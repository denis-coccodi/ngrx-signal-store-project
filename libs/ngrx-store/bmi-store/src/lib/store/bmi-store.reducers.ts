import { HttpErrorResponse } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';
import { patchState } from '@ngrx/signals';
import { setAllEntities, updateAllEntities, updateEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UserBMIService } from '@pims-services';
import { calculateBMI } from '@shared-utils';
import { Bmi, BmiApi, ServiceCodesEnum, Users } from '@types-lib';
import { distinctUntilChanged, filter, Observable, pipe, switchMap, tap, throttleTime, UnaryFunction } from 'rxjs';
import {
  setBmiDataError,
  setBmiDataFulfilled,
  setBmiDataIdle,
  setBmiDataPending,
  setLatestBmiItemError,
  setLatestBmiItemFulfilled,
  setLatestBmiItemIdle,
  setLatestBmiItemPending,
  setUpdateBmiItemError,
  setUpdateBmiItemFulfilled,
  setUpdateBmiItemIdle,
  setUpdateBmiItemPending,
  setUpdateTreatmentStartError,
  setUpdateTreatmentStartFulfilled,
  setUpdateTreatmentStartIdle,
  setUpdateTreatmentStartPending,
} from './bmi-api-status.feature';
import { bmiItemConfig } from './bmi-entity.feature';
import { loadBmiDataStart, loadLatestBmiItemStart } from './bmi-store.actions';
import { BmiStoreInstanceType } from './bmi-store.model';
import { initialBmiState } from './bmi-store.state';

export const setPatientUserId = (store: BmiStoreInstanceType) => (patientUserId: number) =>
  patchState(store, {
    patientUserId,
  });

export const setSortType = (store: BmiStoreInstanceType) => (sortType: 'asc' | 'desc') =>
  patchState(store, {
    bmiListOptions: {
      ...store.bmiListOptions(),
      sort: sortType,
    },
  });

export const setServiceCodesFilter = (store: BmiStoreInstanceType) => (serviceCodes: ServiceCodesEnum[]) =>
  patchState(store, {
    bmiListOptions: {
      ...store.bmiListOptions(),
      filterBy: { serviceCodes },
    },
  });

export const setBmiItemEditMode =
  (store: BmiStoreInstanceType) => (mail_order_fill_request_id: number, editState: boolean) => {
    patchState(store, updateAllEntities({ editMode: false }, bmiItemConfig));
    patchState(
      store,
      updateEntity({ id: mail_order_fill_request_id, changes: { editMode: editState } }, bmiItemConfig)
    );
  };

export const updateTreatmentStartInfo = (store: BmiStoreInstanceType, bmiService: UserBMIService) =>
  rxMethod<Bmi.TreatmentStartInfoSaveReq>(
    pipe(
      throttleTime(2000),
      distinctUntilChanged(),
      tap(() => patchState(store, state => setUpdateTreatmentStartPending(state))),
      switchMap(({ ...treatmentStartSaveReq }) =>
        bmiService.updateTreatmentStart(treatmentStartSaveReq).pipe(
          tapResponse({
            next: () => {
              patchState(store, state => setUpdateTreatmentStartFulfilled(state));
              loadBmiDataStart.update(() => ({
                userId: store.patientUserId(),
                limit: store.bmiListOptions.pagination.limit(),
                order: store.bmiListOptions.pagination.order(),
                offset: store.bmiListOptions.pagination.offset(),
              }));
            },
            error: (err: HttpErrorResponse) => {
              patchState(store, state => setUpdateTreatmentStartError(state, err));
              console.error(err);
            },
            finalize: () => patchState(store, state => setUpdateTreatmentStartIdle(state))
          }),
        ),
      ),
    ),
  );

export const loadBmiData = (store: BmiStoreInstanceType, bmiService: UserBMIService) =>
  rxMethod<Bmi.LoadBmiDataReq | undefined>(loadBmiDataPipe(store, bmiService));

export const loadLatestBmiItem = (store: BmiStoreInstanceType, bmiService: UserBMIService) =>
  rxMethod<Bmi.LoadBmiDataReq | undefined>(loadLatestBmiItemPipe(store, bmiService));

export const updateBmiItem = (store: BmiStoreInstanceType, bmiService: UserBMIService) =>
  rxMethod<Bmi.SaveBmiItemReq>(
    pipe(
      throttleTime(2000),
      distinctUntilChanged(),
      tap(() => patchState(store, state => setUpdateBmiItemPending(state))),
      switchMap(({ currentUser, bmiRow, newMetricHeight, newMetricWeight }) =>
        saveRow(bmiService, currentUser, bmiRow, newMetricHeight, newMetricWeight).pipe(
          tapResponse({
            next: () => {
              patchState(store, state => setUpdateBmiItemFulfilled(state));
              loadBmiDataStart.update(() => ({
                userId: store.patientUserId(),
                limit: store.bmiListOptions.pagination.limit(),
                order: store.bmiListOptions.pagination.order(),
                offset: store.bmiListOptions.pagination.offset(),
              }));
            },
            error: (err: HttpErrorResponse) => {
              patchState(store, state => setUpdateBmiItemError(state, err));
              console.error(err);
            },
            finalize: () => patchState(store, state => setUpdateBmiItemIdle(state))
          }),
        ),
      ),
    ),
  );

export const resetStoreToInitialState = (store: BmiStoreInstanceType) => () =>
  patchState(store, {
    ...initialBmiState,
  });

const loadBmiDataPipe = (
  store: BmiStoreInstanceType,
  bmiService: UserBMIService,
): UnaryFunction<Observable<Bmi.LoadBmiDataReq | undefined>, Observable<BmiApi.UserBiometricsResponse>> =>
  pipe(
    filter(loadBmiDataReq => !!loadBmiDataReq),
    throttleTime(2000),
    distinctUntilChanged(),
    tap(() => patchState(store, state => setBmiDataPending(state))),
    switchMap(({ userId, limit, order, offset, visitId }) =>
      bmiService.getBmiData(userId, limit, order, offset, visitId).pipe(
        tapResponse({
          next: ({ pagination, data: { treatment_details, list } }) => {
            const bmiList = list.map(bmiItem => ({ ...bmiItem, editMode: false }));
            patchState(store, {
              treatmentDetails: treatment_details,
              bmiListOptions: {
                ...store.bmiListOptions(),
                pagination,
              },
            });
            patchState(store, setAllEntities(bmiList, bmiItemConfig));
            patchState(store, state => setBmiDataFulfilled(state));
            loadLatestBmiItemStart.update(() => ({ userId: store.patientUserId() }));
          },
          error: (err: HttpErrorResponse) => {
            patchState(store, state => setBmiDataError(state, err));
            console.error(err);
          },
          finalize: () => patchState(store, state => setBmiDataIdle(state))
        }),
      ),
    ),
  );

const loadLatestBmiItemPipe = (
  store: BmiStoreInstanceType,
  bmiService: UserBMIService,
): UnaryFunction<Observable<Bmi.LoadBmiDataReq | undefined>, Observable<BmiApi.UserBiometricsResponse>> =>
  pipe(
    filter(loadLatestBmiItemReq => !!loadLatestBmiItemReq),
    throttleTime(2000),
    distinctUntilChanged(),
    tap(() => patchState(store, state => setLatestBmiItemPending(state))),
    switchMap(({ userId }) =>
      bmiService.getBmiData(userId, 1).pipe(
        tapResponse({
          next: ({ data: { list } }) => {
            patchState(store, {
              latestBmiItem: (list && list[0]) || undefined,
            });
            patchState(store, state => setLatestBmiItemFulfilled(state));
          },
          error: (err: HttpErrorResponse) => {
            patchState(store, state => setLatestBmiItemError(state, err));
            console.error(err);
          },
          finalize: () => patchState(store, state => setLatestBmiItemIdle(state))
        }),
      ),
    ),
  );

const saveRow = (
  bmiService: UserBMIService,
  currentUser: Users.User,
  bmiRow: BmiApi.UserBMI,
  newMetricHeight: number,
  newMetricWeight: number,
) => {
  const updatedBmiRow: BmiApi.UserBMI = {
    ...bmiRow,
    modified: new Date().toISOString(),
    modified_by: {
      user_id: currentUser?.id,
      firstname: currentUser?.firstname,
      lastname: currentUser?.lastname,
    },
    height: newMetricHeight,
    weight: newMetricWeight,
    bmi: calculateBMI(newMetricHeight, newMetricWeight),
  };
  return bmiService.updateBmiItem(updatedBmiRow);
};
