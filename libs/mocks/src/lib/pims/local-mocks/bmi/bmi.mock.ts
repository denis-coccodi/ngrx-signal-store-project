import { Bmi, BmiApi, ServiceCodesEnum } from '@types-lib';

export const EMPTY_BMI_GET_RESPONSE: BmiApi.UserBiometricsResponse = {
  pagination: {
    total: 0,
    limit: 0,
    offset: 0,
    order: 'desc',
  },
  data: {
    treatment_details: {
      bmi_id: undefined,
      mail_order_fill_request_id: 0,
      start_date: '1985-01-01',
      start_weight: undefined,
      five_percent_weight_check: undefined,
      current_wei_medication: undefined,
      order_id: 0,
      one_eighty_days_check: false,
    },
    list: [],
  },
};

export const USER_BMI_MOCK_RESPONSE: BmiApi.UserBiometricsResponse = {
  pagination: {
    total: 2,
    limit: 2,
    offset: 0,
    order: 'desc',
  },
  data: {
    treatment_details: {
      bmi_id: 98765,
      mail_order_fill_request_id: 12345,
      start_date: '2024-02-21',
      start_weight: 100,
      five_percent_weight_check: -5,
      one_eighty_days_check: true,
      current_wei_medication: {
        code: 'med_code',
        name: 'med_name',
        order_id: 9876,
        medical_name: 'medical_name',
        last_wei_created: '2025-02-27', // last wei row creation date
        weight: '100',
      },
      order_id: 54321,
    },
    list: [
      {
        id: 0,
        user_id: 0,
        order: {
          mail_order_fill_request_id: 0,
          service_code: ServiceCodesEnum.HAY_F_HAYFEVER_TREATMENT,
          order_id: 12345,
          is_refill: false,
        },
        height: 145.0,
        weight: 60.0,
        bmi: 28.5,
        created: '2024-09-04T10:55:22.000000Z',
        modified: '2024-09-05T10:55:22.000000Z',
        note: '',
        is_active: 0,
      },
      {
        id: 1,
        user_id: 1,
        order: {
          mail_order_fill_request_id: 1,
          service_code: ServiceCodesEnum.WEI_F_WEIGHT_LOSS_TREATMENT,
          order_id: 12345,
          is_refill: true,
        },
        height: 170.0,
        weight: 95.0,
        five_percent_weight_check: -5,
        bmi: 20.0,
        created: '2024-09-02T10:55:22.000000Z',
        modified: '2024-09-02T10:55:22.000000Z',
        note: '',
        is_active: 0,
      },
    ],
  },
};

export const BMI_STORE_MOCK: Bmi.BmiStoreState = {
  loadBmiDataStatus: 'idle',
  loadLatestBmiItemStatus: 'idle',
  updateBmiItemStatus: 'idle',
  updateTreatmentStartStatus: 'idle',
  treatmentDetails: USER_BMI_MOCK_RESPONSE.data.treatment_details,
  latestBmiItem: USER_BMI_MOCK_RESPONSE.data.list[0],
  patientUserId: 1234789,
  bmiItemIds: [],
  bmiItemEntityMap: {},
  bmiListOptions: {
    pagination: {
      // BE pagination as future possibility
      total: 2,
      limit: 300,
      offset: 0,
      order: 'desc',
    },
    filterBy: { serviceCodes: [] },
    sort: 'desc',
  },
};

export const BMI_ITEM_ENTITIES_ARRAY: Bmi.EditableUserBMI[] = [
  {
    ...USER_BMI_MOCK_RESPONSE.data.list[0],
    editMode: false,
  },
  {
    ...USER_BMI_MOCK_RESPONSE.data.list[1],
    editMode: false,
  },
];

export const BMI_DIALOG_DATA: Bmi.BMIDialogData = {
  userId: 1,
  visitId: 100,
};

export const BMI_GET_API_PROJECT_MOCK: BmiApi.UserBiometricsResponse = {
  pagination: {
    total: 5,
    limit: 300,
    offset: 0,
    order: 'desc',
  },
  data: {
    treatment_details: {
      bmi_id: 6,
      mail_order_fill_request_id: 12345,
      start_weight: 100,
      start_date: '2024-08-24T00:00:00.000000Z',
      order_id: 11380,
      current_wei_medication: {
        code: 'Weight Med 1',
        name: 'Weight Med 1',
        medical_name: 'Weight Med 1',
        weight: '55.00',
        order_id: 12345,
        last_wei_created: '2025-03-18T11:00:13.000000Z',
      },
      one_eighty_days_check: true,
      five_percent_weight_check: -45,
    },
    list: [
      {
        id: 67,
        user_id: 54321,
        order: {
          medication: {
            code: 'Weight Med 1',
            name: 'Weight Med 1',
            medical_name: 'Weight Med 1',
          },
          service_code: 'WEI-F',
          order_id: 12345,
          mail_order_fill_request_id: 123456,
          is_refill: false,
        },
        height: 190,
        weight: 55,
        five_percent_weight_check: -45,
        bmi: 15.2,
        note: undefined,
        is_active: 1,
        created: '2025-03-18T11:00:13.000000Z',
        modified: '2025-03-21T14:46:40.000000Z',
        modified_by: {
          user_id: 11,
          firstname: 'Denis',
          lastname: 'Coccodi',
        },
      },
      {
        id: 66,
        user_id: 54321,
        order: {
          medication: {
            code: 'Weight Med 1',
            name: 'Weight Med 1',
            medical_name: 'Weight Med 1',
          },
          service_code: 'WEI-F',
          order_id: 123456,
          mail_order_fill_request_id: 123455,
          is_refill: false,
        },
        height: 193,
        weight: 55,
        five_percent_weight_check: -45,
        bmi: 14.8,
        note: undefined,
        is_active: 1,
        created: '2025-03-15T10:57:18.000000Z',
        modified: '2025-03-21T14:46:18.000000Z',
        modified_by: {
          user_id: 11,
          firstname: 'Denis',
          lastname: 'Coccodi',
        },
      },
      {
        id: undefined,
        user_id: 54321,
        order: {
          medication: {
            code: 'hay weight med 1',
            name: 'hay weight med 1',
            medical_name: '',
          },
          service_code: 'HAY-F',
          order_id: 112233,
          mail_order_fill_request_id: 332211,
          is_refill: true,
        },
        height: undefined,
        weight: undefined,
        five_percent_weight_check: null,
        bmi: undefined,
        note: undefined,
        is_active: undefined,
        created: '2025-02-13T17:03:59.000000Z',
        modified: undefined,
        modified_by: undefined,
      },
      {
        id: 68,
        user_id: 54321,
        order: {
          medication: {
            code: 'Weight Med 2',
            name: 'Weight Med 2',
            medical_name: 'Weight Med 2',
          },
          service_code: 'WEI-F',
          order_id: 12345,
          mail_order_fill_request_id: 123555,
          is_refill: false,
        },
        height: 193,
        weight: 65,
        five_percent_weight_check: undefined,
        bmi: 17.5,
        note: undefined,
        is_active: 1,
        created: '2024-12-22T07:56:44.000000Z',
        modified: undefined,
        modified_by: undefined
      },
      {
        id: undefined,
        user_id: 54321,
        order: {
          medication: {
            code: 'hay weight med 3',
            name: 'hay weight med 3',
            medical_name: '',
          },
          service_code: 'HAY-F',
          order_id: 112233,
          mail_order_fill_request_id: 331221,
          is_refill: true,
        },
        height: undefined,
        weight: undefined,
        five_percent_weight_check: null,
        bmi: undefined,
        note: undefined,
        is_active: undefined,
        created: '2023-02-13T17:03:59.000000Z',
        modified: undefined,
        modified_by: undefined,
      },
    ],
  },
};
