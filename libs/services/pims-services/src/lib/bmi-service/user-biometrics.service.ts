import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BMI_GET_API_PROJECT_MOCK, EMPTY_BMI_GET_RESPONSE } from '@local-mocks';
import { getCachedValue, LocalStorageKeys } from '@shared-utils';
import { Bmi, BmiApi, Notifications } from '@types-lib';
import { SnackNotificationsDialogService } from '@ui-lib/services';
import { PIMS_ENVIRONMENT, PIMSEnvironment } from 'environments';
import { catchError, delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserBMIService {
  private env = inject<PIMSEnvironment>(PIMS_ENVIRONMENT);
  constructor(
    private http: HttpClient,
    private snackBar: SnackNotificationsDialogService
  ) {}
  private biometricsListLength = getCachedValue(
    LocalStorageKeys.PIMS_PARAMETERS
  )?.pimsVisitParameters?.biometrics?.listLength;

  updateBmiItem(data: BmiApi.UserBMI): Observable<BmiApi.SavedBmiItem> {
    const {
      height,
      weight,
      id,
      order: { order_id, mail_order_fill_request_id },
    } = { ...data };

    const requestObj: BmiApi.bodyMassIndexPutRequest = {
      height: height as number,
      weight: weight as number,
      mail_order_fill_request_id,
      bmi_id: id,
    };

    return this.http
      .put<BmiApi.SavedBmiItem>(
        `${this.env.constants.ADMIN_API_URL}/admin/orders/${order_id}/bodymassindex`,
        {
          ...requestObj,
        }
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          this.snackBar.openErrorMessage(Notifications.generic.failure);
          throw err;
        })
      );
  }

  private _getBmiData = (
    queryParams: BmiApi.UserBiometricsQueryParams
  ): Observable<BmiApi.UserBiometricsResponse> => of(BMI_GET_API_PROJECT_MOCK).pipe(delay(1000));

  getBmiData(
    userId: number,
    limit = this.biometricsListLength || 300,
    order: 'asc' | 'desc' = 'desc',
    offset = 0,
    visitId?: number
  ): Observable<BmiApi.UserBiometricsResponse> {
    const queryParams: BmiApi.UserBiometricsQueryParams = {
      limit,
      offset,
      user_id: userId,
      order,
      ...(visitId && { order_id: visitId }),
    };

    return (
      (userId && this._getBmiData(queryParams)) || of(EMPTY_BMI_GET_RESPONSE)
    );
  }

  updateTreatmentStart(
    data: Bmi.TreatmentStartInfoSaveReq
  ): Observable<BmiApi.SavedBmiItem> {
    return this.http
      .put<BmiApi.SavedBmiItem>(
        `${this.env.constants.ADMIN_API_URL}/admin/orders/${data.order_id}/bodymassindex`,
        data
      )
      .pipe(
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          this.snackBar.openErrorMessage(Notifications.generic.failure);
          throw err;
        })
      );
  }
}
