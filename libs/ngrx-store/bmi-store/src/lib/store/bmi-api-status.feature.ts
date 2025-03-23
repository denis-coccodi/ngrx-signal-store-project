import { HttpErrorResponse } from '@angular/common/http';
import { computed } from '@angular/core';
import {
  signalStoreFeature,
  type,
  withComputed
} from '@ngrx/signals';
import { Bmi } from '@types-lib';

export function withBmiApiRequestStatus() {
  return signalStoreFeature(
    { state: type<Bmi.BmiApiStatusState>() },
    withComputed(
      ({
        loadBmiDataStatus,
        loadLatestBmiItemStatus,
        updateBmiItemStatus,
        updateTreatmentStartStatus,
      }) => ({
        isLoadBmiDataIdle: computed(() => loadBmiDataStatus() === 'idle'),
        isLoadBmiDataPending: computed(() => loadBmiDataStatus() === 'pending'),
        isLoadBmiDataFulfilled: computed(
          () => loadBmiDataStatus() === 'fulfilled'
        ),
        loadBmiDataError: computed(() => {
          const status = loadBmiDataStatus();
          return typeof status === 'object' ? status : null;
        }),
        isLoadLatestBmiItemIdle: computed(
          () => loadLatestBmiItemStatus() === 'idle'
        ),
        isLoadLatestBmiItemPending: computed(
          () => loadLatestBmiItemStatus() === 'pending'
        ),
        isLoadLatestBmiItemFulfilled: computed(
          () => loadLatestBmiItemStatus() === 'fulfilled'
        ),
        loadLatestBmiItemError: computed(() => {
          const status = loadLatestBmiItemStatus();
          return typeof status === 'object' ? status : null;
        }),
        isUpdateBmiItemIdle: computed(() => updateBmiItemStatus() === 'idle'),
        isUpdateBmiItemPending: computed(
          () => updateBmiItemStatus() === 'pending'
        ),
        isUpdateBmiItemFulfilled: computed(
          () => updateBmiItemStatus() === 'fulfilled'
        ),
        updateBmiItemError: computed(() => {
          const status = updateBmiItemStatus();
          return typeof status === 'object' ? status : null;
        }),
        isUpdateTreatmentStartIdle: computed(
          () => updateTreatmentStartStatus() === 'idle'
        ),
        isUpdateTreatmentStartFulfilled: computed(
          () => updateTreatmentStartStatus() === 'fulfilled'
        ),
        updateTreatmentStartError: computed(() => {
          const status = updateTreatmentStartStatus();
          return typeof status === 'object' ? status : null;
        }),
      })
    )
  );
}

// bmi Data api call
export function setBmiDataIdle(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, loadBmiDataStatus: 'idle' };
}

export function setBmiDataPending(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, loadBmiDataStatus: 'pending' };
}

export function setBmiDataFulfilled(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, loadBmiDataStatus: 'fulfilled' };
}

export function setBmiDataError(
  state: Bmi.BmiApiStatusState,
  error: string | HttpErrorResponse
): Bmi.BmiApiStatusState {
  return { ...state, loadBmiDataStatus: { error } };
}

// latest bmi item api call
export function setLatestBmiItemIdle(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, loadLatestBmiItemStatus: 'idle' };
}

export function setLatestBmiItemPending(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, loadLatestBmiItemStatus: 'pending' };
}

export function setLatestBmiItemFulfilled(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, loadLatestBmiItemStatus: 'fulfilled' };
}

export function setLatestBmiItemError(
  state: Bmi.BmiApiStatusState,
  error: string | HttpErrorResponse
): Bmi.BmiApiStatusState {
  return { ...state, loadLatestBmiItemStatus: { error } };
}

// update bmi item api call
export function setUpdateBmiItemIdle(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, updateBmiItemStatus: 'idle' };
}

export function setUpdateBmiItemPending(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, updateBmiItemStatus: 'pending' };
}

export function setUpdateBmiItemFulfilled(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, updateBmiItemStatus: 'fulfilled' };
}

export function setUpdateBmiItemError(
  state: Bmi.BmiApiStatusState,
  error: string | HttpErrorResponse
): Bmi.BmiApiStatusState {
  return { ...state, updateBmiItemStatus: { error } };
}

// update treatment start api call
export function setUpdateTreatmentStartIdle(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, updateTreatmentStartStatus: 'idle' };
}

export function setUpdateTreatmentStartPending(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, updateTreatmentStartStatus: 'pending' };
}

export function setUpdateTreatmentStartFulfilled(
  state: Bmi.BmiApiStatusState
): Bmi.BmiApiStatusState {
  return { ...state, updateTreatmentStartStatus: 'fulfilled' };
}

export function setUpdateTreatmentStartError(
  state: Bmi.BmiApiStatusState,
  error: string | HttpErrorResponse
): Bmi.BmiApiStatusState {
  return { ...state, updateTreatmentStartStatus: { error } };
}
