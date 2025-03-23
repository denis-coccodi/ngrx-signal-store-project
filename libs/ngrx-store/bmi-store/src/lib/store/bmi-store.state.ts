import { EMPTY_BMI_GET_RESPONSE } from '@local-mocks';
import { Bmi } from '@types-lib';

export const baseBmiInitialState: Bmi.BaseBmiStoreState = {
  treatmentDetails: EMPTY_BMI_GET_RESPONSE.data.treatment_details,
  latestBmiItem: undefined,
  patientUserId: 0,
};

export const initialBmiEntityState: Bmi.BmiEntityState = {
  bmiListOptions: {
    filterBy: { serviceCodes: [] },
    sort: 'desc',
    pagination: EMPTY_BMI_GET_RESPONSE.pagination,
  },
  bmiItemEntityMap: {},
  bmiItemIds: [],
};

export const initialApiState: Bmi.BmiApiStatusState = {
  loadBmiDataStatus: 'idle',
  loadLatestBmiItemStatus: 'idle',
  updateBmiItemStatus: 'idle',
  updateTreatmentStartStatus: 'idle',
};

export const initialBmiState: Bmi.BmiStoreState = {
  ...baseBmiInitialState,
  ...initialApiState,
  ...initialBmiEntityState,
};
