import { Injector, runInInjectionContext } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  BMI_ITEM_ENTITIES_ARRAY,
  USER_BMI_MOCK_RESPONSE,
  USER_WITH_ROLES,
} from '@local-mocks';
import { UserBMIService } from '@pims-services';
import { Users } from '@types-lib';
import { of } from 'rxjs';
import { BmiStore } from './bmi-store.store';

jest.mock('@pims-services');

describe('BmiStore', () => {
  let store: InstanceType<typeof BmiStore>;
  let bmiServiceMock: Partial<UserBMIService>;

  beforeEach(() => {
    bmiServiceMock = {
      getBmiData: jest.fn().mockReturnValue(of(USER_BMI_MOCK_RESPONSE)),
      updateTreatmentStart: jest.fn().mockReturnValue(of({})),
      updateBmiItem: jest.fn().mockReturnValue(of({})),
    };

    TestBed.configureTestingModule({
      providers: [
        BmiStore,
        { provide: UserBMIService, useValue: bmiServiceMock },
      ],
    });

    const injector = TestBed.inject(Injector);

    // runInInjectionContext so that Jest can inject the bmi service in the BmiStore
    runInInjectionContext(injector, () => {
      store = TestBed.inject(BmiStore);
    });
  });

  it('should initialize with the correct state', () => {
    expect(store.patientUserId()).toBe(0);
    expect(store.sortedAndFilteredBmiList()).toEqual([]);
  });

  it('should set the patient user ID', () => {
    store.setPatientUserId(123);
    expect(store.patientUserId()).toBe(123);
  });

  it('should load BMI data', fakeAsync(() => {
    store.loadBmiData({ userId: 1, limit: 10 }) as any;
    tick(2000);
    expect(bmiServiceMock.getBmiData).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      undefined,
      undefined
    );
  }));

  it('should update BMI item', fakeAsync(() => {
    const bmiItem = {
      ...BMI_ITEM_ENTITIES_ARRAY[0],
      id: 1,
      weight: 70,
      height: 175,
    };
    store.loadBmiData({ userId: 1234 });
    store.updateBmiItem({
      currentUser: { ...USER_WITH_ROLES, id: 1 } as Users.User,
      bmiRow: bmiItem,
      newMetricHeight: 165,
      newMetricWeight: 60,
    }) as any;
    tick(2000);
    const updatedItem = store
      .sortedAndFilteredBmiList()
      .find(
        (bmi) =>
          bmi.order.mail_order_fill_request_id ===
          bmiItem.order.mail_order_fill_request_id
      );
    expect(updatedItem?.bmi).toBeCloseTo(22, 1);
  }));

  it('should reset the store to initial state', () => {
    store.setPatientUserId(123);
    store.resetStoreToInitialState();
    expect(store.patientUserId()).toBe(0);
  });
});
