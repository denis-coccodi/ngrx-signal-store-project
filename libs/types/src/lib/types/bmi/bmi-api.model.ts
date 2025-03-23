
export interface TablePagination {
	total: number;
	limit: number;
	offset: number;
	order: 'desc' | 'asc';
}

export interface UserBMI {
  id?: number;
  user_id?: number;
  order: BMIOrder;
  height?: number;
  weight?: number;
  five_percent_weight_check?: number | null;
  bmi?: number;
  created?: string;
  modified?: string;
  note?: string;
  is_active?: number;
  modified_by?: BMIModifiedBy;
}

export interface SavedBmiItem {
  id?: number;
  user_id?: number;
  order_id: number;
  mail_order_fill_request_id: number;
  height: number;
  weight: number;
  bmi?: number;
  created?: string;
  modified?: string;
  note?: string;
  is_active?: number;
  modified_by: number;
  five_percent_weight_check: number | null;
}

interface BMIOrder {
  service_code: string;
  order_id: number;
  mail_order_fill_request_id: number;
  is_refill?: boolean;
  medication?: BMIMedication;
}

interface BMIMedication {
  code: string;
  name: string;
  medical_name: string;
}

interface BMIModifiedBy {
  user_id: number;
  firstname: string;
  lastname: string;
}

export interface UserBiometricsResponse {
  pagination: TablePagination;
  data: {
    treatment_details: BmiTreatmentInfo;
    list: UserBMI[];
  };
}

export interface UserBiometricsQueryParams {
  limit: number;
  offset: number;
  user_id: number;
  order: 'asc' | 'desc';
  order_id?: number;
  is_active?: number;
}

export interface bodyMassIndexPutRequest {
  height: number;
  weight: number;
  mail_order_fill_request_id: number;
  bmi_id?: number;
}

export interface BmiTreatmentInfo {
  bmi_id?: number;
  mail_order_fill_request_id: number;
  start_date: string;
  start_weight?: number;
  five_percent_weight_check?: number | null;
  one_eighty_days_check: boolean;
  current_wei_medication?: BmiMedication;
  order_id: number;
}

export interface BmiMedication {
  code: string;
  name: string;
  medical_name: string;
  order_id: number;
  last_wei_created: string; // last wei item creation date
  weight: string;
}
