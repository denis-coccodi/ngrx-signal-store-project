import { inject } from '@angular/core';
import { signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { UserBMIService } from '@pims-services';
import { Bmi } from '@types-lib';
import { withBmiApiRequestStatus } from './bmi-api-status.feature';
import { withBmiItemEntity } from './bmi-entity.feature';
import { loadBmiDataStart, loadLatestBmiItemStart } from './bmi-store.actions';
import {
  loadBmiData,
  loadLatestBmiItem,
  resetStoreToInitialState,
  setBmiItemEditMode,
  setPatientUserId,
  setServiceCodesFilter,
  setSortType,
  updateBmiItem,
  updateTreatmentStartInfo,
} from './bmi-store.reducers';
import { fivePercentWeightLossStatus } from './bmi-store.selectors';
import { initialBmiState } from './bmi-store.state';

export const BmiStore = signalStore(
  { providedIn: 'root' },
  withState<Bmi.BmiStoreState>(initialBmiState),
  withBmiItemEntity(),
  withBmiApiRequestStatus(),
  withComputed(({ treatmentDetails }) => ({
    fivePercentWeightLossStatus: fivePercentWeightLossStatus(treatmentDetails),
  })),
  withMethods((store, bmiService = inject(UserBMIService)) => ({
    setPatientUserId: setPatientUserId(store),
    setSortType: setSortType(store),
    setServiceCodesFilter: setServiceCodesFilter(store),
    setBmiItemEditMode: setBmiItemEditMode(store),
    loadBmiData: loadBmiData(store, bmiService),
    _loadLatestBmiItem: loadLatestBmiItem(store, bmiService),
    updateTreatmentStartInfo: updateTreatmentStartInfo(store, bmiService),
    updateBmiItem: updateBmiItem(store, bmiService),
    resetStoreToInitialState: resetStoreToInitialState(store),
  })),
  withHooks({
    onInit(store) {
      store.loadBmiData(loadBmiDataStart);
      store._loadLatestBmiItem(loadLatestBmiItemStart);
    },
  }),
);
