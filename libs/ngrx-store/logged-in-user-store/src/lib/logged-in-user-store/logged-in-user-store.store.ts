import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { USER_WITH_ROLES } from '@local-mocks';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { AuthService } from '@pims-services';
import { setError, setFulfilled, setPending, withRequestStatus } from '@shared-utils';
import { Users } from '@types-lib';
import { pipe, switchMap, tap } from 'rxjs';
import { LoggedInUserInitialState } from './logged-in-user.state';

export const LoggedInUserStore = signalStore(
  { providedIn: 'root' },
  withState(LoggedInUserInitialState),
  withRequestStatus(),
  withComputed(({ user }) => ({})),
  withMethods((store, authService = inject(AuthService)) => ({
    resetUserDetails() {
      patchState(store, { user: undefined });
    },
    setUserDetails(user: Users.User) {
      patchState(store, { user });
    },
    loadUserDetails: rxMethod<void>(
      pipe(
        tap(() => patchState(store, setPending())),
        switchMap(() => authService.getLoggedInUserDetails()),
        tapResponse({
          next: user => {
            patchState(store, { user }, setFulfilled());
          },
          error: (err: HttpErrorResponse) => {
            patchState(store, { user: undefined }, setError(err));
            console.error(err);
          },
        }),
      ),
    ),
  })),
  withHooks({
    onInit(store) {
      store.setUserDetails(USER_WITH_ROLES);
    }
  }),
);
