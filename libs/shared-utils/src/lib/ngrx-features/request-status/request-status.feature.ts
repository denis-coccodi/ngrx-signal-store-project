import { HttpErrorResponse } from '@angular/common/http';
import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';
import { NgrxCustomTypes } from '@types-lib';


export function withRequestStatus() {
  return signalStoreFeature(
    withState<NgrxCustomTypes.RequestStatusState>({ requestStatus: 'idle' }),
    withComputed(({ requestStatus }) => ({
      isIdle: computed(() => requestStatus() === 'idle'),
      isPending: computed(() => requestStatus() === 'pending'),
      isFulfilled: computed(() => requestStatus() === 'fulfilled'),
      error: computed(() => {
        const status = requestStatus();
        return typeof status === 'object' ? status.error : null;
      }),
    })),
  );
}

export function setIdle(): NgrxCustomTypes.RequestStatusState {
  return { requestStatus: 'idle' };
}

export function setPending(): NgrxCustomTypes.RequestStatusState {
  return { requestStatus: 'pending' };
}

export function setFulfilled(): NgrxCustomTypes.RequestStatusState {
  return { requestStatus: 'fulfilled' };
}

export function setError(error: HttpErrorResponse): NgrxCustomTypes.RequestStatusState {
  return { requestStatus: { error } };
}
