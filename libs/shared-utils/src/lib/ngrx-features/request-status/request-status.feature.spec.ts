import { HttpErrorResponse } from '@angular/common/http';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import { setError, setFulfilled, setIdle, setPending, withRequestStatus } from './request-status.feature';

class TestRequestStatusStore extends signalStore(
  withRequestStatus(),
  withMethods(store => ({
    setIdle() {
      patchState(store, setIdle());
    },
    setPending() {
      patchState(store, setPending());
    },
    setFulfilled() {
      patchState(store, setFulfilled());
    },
    setError(error: HttpErrorResponse) {
      patchState(store, setError(error));
    },
  })),
) {}

describe.only('withRequestStatus', () => {
  let store: TestRequestStatusStore;

  beforeEach(() => {
    store = new TestRequestStatusStore();
  });

  it('should initialize with idle state', () => {
    expect(store.requestStatus()).toBe('idle');
    expect(store.isIdle()).toBe(true);
    expect(store.isPending()).toBe(false);
    expect(store.isFulfilled()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should update state to pending', () => {
    store.setPending();
    expect(store.requestStatus()).toBe('pending');
    expect(store.isIdle()).toBe(false);
    expect(store.isPending()).toBe(true);
    expect(store.isFulfilled()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('should update state to fulfilled', () => {
    store.setFulfilled();
    expect(store.requestStatus()).toBe('fulfilled');
    expect(store.isIdle()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.isFulfilled()).toBe(true);
    expect(store.error()).toBeNull();
  });

  it('should update state to error with an error object', () => {
    const errorResponse = new HttpErrorResponse({ error: 'Server error', status: 500 });
    store.setError(errorResponse);
    expect(store.requestStatus()).toEqual({ error: errorResponse });
    expect(store.isIdle()).toBe(false);
    expect(store.isPending()).toBe(false);
    expect(store.isFulfilled()).toBe(false);
    expect(store.error()).toBe(errorResponse);
  });

  it('should reset to idle', () => {
    store.setPending();
    store.setIdle();
    expect(store.requestStatus()).toBe('idle');
    expect(store.isIdle()).toBe(true);
    expect(store.isPending()).toBe(false);
    expect(store.isFulfilled()).toBe(false);
    expect(store.error()).toBeNull();
  });
});
