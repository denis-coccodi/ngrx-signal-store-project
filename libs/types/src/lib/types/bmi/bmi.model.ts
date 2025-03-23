import { HttpErrorResponse } from '@angular/common/http';
import { NamedEntityState } from '@ngrx/signals/entities';
import { ServiceCodesEnum } from '../service-codes/service-codes';
import { User } from '../users/users.model';
import { BmiTreatmentInfo, TablePagination, UserBMI } from './bmi-api.model';

export enum WeightLossCodesEnum {
  WEI_F = ServiceCodesEnum.WEI_F_WEIGHT_LOSS_TREATMENT,
  WEI_R = ServiceCodesEnum.WEI_R_WEIGHT_LOSS_RETURN,
}

export enum FivePercentWeightLossStatusEnum {
  NOT_DUE = 'NOT_DUE',
  DUE = 'DUE',
  MET = 'MET',
  NOT_MET = 'NOT_MET',
}

export interface BMIDialogData {
  userId: number;
  visitId?: number;
}

export interface EditableUserBMI extends UserBMI {
  editMode: boolean;
}

export interface BmiStoreFilter {
  serviceCodes: ServiceCodesEnum[];
}

export enum BmiEntitiesEnum {
  COLLECTION_NAME = 'bmiItem',
}

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string | HttpErrorResponse };

export interface BmiApiStatusState {
  loadBmiDataStatus: RequestStatus;
  loadLatestBmiItemStatus: RequestStatus;
  updateBmiItemStatus: RequestStatus;
  updateTreatmentStartStatus: RequestStatus;
}

export interface BmiEntityState
extends NamedEntityState<EditableUserBMI, BmiEntitiesEnum.COLLECTION_NAME> {
  bmiListOptions: BmiStoreListOptions;
}

export interface BaseBmiStoreState {
  treatmentDetails: BmiTreatmentInfo;
  latestBmiItem?: UserBMI;
  patientUserId: number;
}

export type BmiStoreState = BaseBmiStoreState & BmiApiStatusState & BmiEntityState

export interface BmiStoreListOptions {
  pagination: TablePagination;
  filterBy: BmiStoreFilter;
  sort: 'asc' | 'desc';
}

export interface LoadBmiDataReq {
  userId: number;
  limit?: number;
  order?: 'asc' | 'desc';
  offset?: number;
  visitId?: number;
}

export interface SaveBmiItemReq {
  currentUser: User;
  bmiRow: UserBMI;
  newMetricHeight: number;
  newMetricWeight: number;
}

export interface TreatmentStartInfoSaveReq {
  order_id: number;
  bmi_id?: number;
  start_date: string;
  start_weight: number;
}
