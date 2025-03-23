import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Users } from '@types-lib';
import { PIMS_ENVIRONMENT, PIMSEnvironment } from 'environments';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private env = inject<PIMSEnvironment>(PIMS_ENVIRONMENT);
  private httpClient: HttpClient = inject(HttpClient);
  private userSubject$ = new BehaviorSubject<Users.User | null>(null);

  login(credentials: Users.AuthPostRequest) {
    return this.httpClient
      .post<Users.AuthPostResponse>(
        `${this.env.constants.API_URL}/users/me/authenticate`,
        credentials
      )
      .pipe(
        tap(({ token }) => {
          window.localStorage.setItem('token', token);
          this.userSubject$.next(null);
        }),
        catchError(() => {
          window.localStorage.removeItem('token');
          return of(null);
        })
      );
  }

  get profile(): any {
    return this.userSubject$.value;
  }

  isLoggedIn(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.userSubject$.next(null); // Clear profile if no token
      return of(false);
    }

    // Check if profile is already loaded
    if (this.userSubject$.value) {
      return of(true);
    }
    // Fetch profile if it hasn't been retrieved yet
    return this.getLoggedInUserDetails().pipe(
      tap((user) => this.userSubject$.next(user)), // Store profile in subject
      map(() => true),
      catchError(() => of(false)),
      shareReplay(1)
    );
  }

  getLoggedInUserDetails(): Observable<Users.User> {
    return this.httpClient
      .get<Users.User>(`${this.env.constants.API_URL}/users/me/details`)
      .pipe(
        catchError((err) => {
          localStorage.removeItem('token'); // Clean up if profile fetch fails
          this.userSubject$.next(null);
          throw err;
        })
      );
  }
}
