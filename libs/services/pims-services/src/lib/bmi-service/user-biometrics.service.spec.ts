import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EMPTY_BMI_GET_RESPONSE } from '@local-mocks';
import { Notifications } from '@types-lib';
import { SnackNotificationsDialogService } from '@ui-lib/services';
import { PIMS_ENVIRONMENT } from 'environments';
import { of, throwError } from 'rxjs';
import { USER_BMI_MOCK_RESPONSE } from './../../../../../mocks/src/lib/pims/local-mocks/bmi/bmi.mock';
import { UserBMIService } from './user-biometrics.service';

jest.mock('@ui-lib/services');

describe('UserBMIService', () => {
  let service: UserBMIService;
  const httpMock = { get: jest.fn(), put: jest.fn() };
  const snackBarMock = { openErrorMessage: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserBMIService,
        { provide: HttpClient, useValue: httpMock },
        { provide: SnackNotificationsDialogService, useValue: snackBarMock },
        { provide: PIMS_ENVIRONMENT, useValue: { constants: { ADMIN_API_URL: 'http://mock-api' } } },
      ],
    });

    service = TestBed.inject(UserBMIService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should update BMI item', done => {
    const bmiItem = {
      ...USER_BMI_MOCK_RESPONSE.data.list[0],
      id: 1,
      height: 170,
      weight: 70,
      order: { ...USER_BMI_MOCK_RESPONSE.data.list[0].order, order_id: 123, mail_order_fill_request_id: 456 },
    };
    const response = { bmi_id: 1 };

    httpMock.put?.mockReturnValue(of(response));
    service.updateBmiItem(bmiItem).subscribe(res => {
      expect(httpMock.put).toHaveBeenCalledWith(
        'http://mock-api/admin/orders/123/bodymassindex',
        expect.objectContaining({ height: 170, weight: 70, mail_order_fill_request_id: 456, bmi_id: 1 }),
      );
      expect(res).toEqual(response);
      done();
    });
  });

  test('should handle error on updateBmiItem', done => {
    httpMock.put.mockReturnValue(throwError(() => new Error('API Error')));
    service
      .updateBmiItem({
        id: 1,
        height: 170,
        weight: 70,
        order: { ...USER_BMI_MOCK_RESPONSE.data.list[0].order, order_id: 123 },
      })
      .subscribe({
        next: () => done.fail('Expected an error, but got success'),
        error: () => {
          expect(snackBarMock.openErrorMessage).toHaveBeenCalledWith(Notifications.generic.failure);
          done();
        },
      });
  });

  test('should get BMI data', done => {
    const response = { data: { list: [], treatment_details: {} }, pagination: {} };
    httpMock.get.mockReturnValue(of(response));

    service.getBmiData(1, 10).subscribe(res => {
      expect(httpMock.get).toHaveBeenCalledWith(
        'http://mock-api/admin/orders/bodymassindex',
        expect.objectContaining({ params: { user_id: 1, limit: 10, offset: 0, order: 'desc' } }),
      );
      expect(res).toEqual(response);
      done();
    });
  });

  test('should return EMPTY_BMI_GET_RESPONSE if no userId provided', done => {
    service.getBmiData(0).subscribe(res => {
      expect(res).toEqual(EMPTY_BMI_GET_RESPONSE);
      done();
    });
  });

  test('should update treatment start', done => {
    const treatmentData = { order_id: 123, someData: 'test', start_date: '2024-02-01', start_weight: 60 };
    const response = { bmi_id: 1 };
    httpMock.put.mockReturnValue(of(response));

    service.updateTreatmentStart(treatmentData).subscribe(res => {
      expect(httpMock.put).toHaveBeenCalledWith('http://mock-api/admin/orders/123/bodymassindex', treatmentData);
      expect(res).toEqual(response);
      done();
    });
  });

  test('should handle error on updateTreatmentStart', done => {
    httpMock.put.mockReturnValue(throwError(() => new Error('API Error')));
    service.updateTreatmentStart({ order_id: 123, start_date: '2024-02-01', start_weight: 60 }).subscribe({
      next: () => {},
      error: () => {
        expect(snackBarMock.openErrorMessage).toHaveBeenCalledWith(Notifications.generic.failure);
        done();
      },
    });
  });
});
