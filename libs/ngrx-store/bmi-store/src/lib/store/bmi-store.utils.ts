import { calculatePercentageDifference, datesDifferenceInDays } from '@shared-utils';
import { Bmi, ServiceCodesEnum } from '@types-lib';

export const filterListByServiceCodes = (
  list: Bmi.EditableUserBMI[],
  filter: Bmi.BmiStoreFilter,
): Bmi.EditableUserBMI[] =>
  filter.serviceCodes?.length
    ? list.filter(bmiRow => filter.serviceCodes.includes(bmiRow.order.service_code as ServiceCodesEnum))
    : list;

export const sortByCreatedDate = (sortType: 'desc' | 'asc') => (a: Bmi.EditableUserBMI, b: Bmi.EditableUserBMI) =>
  sortType === 'desc'
    ? getDateAsNumber(b) - getDateAsNumber(a)
    : sortType === 'asc'
    ? getDateAsNumber(a) - getDateAsNumber(b)
    : 0;

const getDateAsNumber = (bio: Bmi.EditableUserBMI) => new Date(bio?.created || 0).valueOf();

export const weightLossPercentage = (
  bmiItemServiceCode: ServiceCodesEnum,
  treatmentStart: string,
  startWeight?: number,
  bmiItemCreationDate?: string,
  weight?: number
): number | undefined | null => {
  const treatmentStartDate = (treatmentStart && new Date(treatmentStart)) || undefined;
  const rowCreatedDate = (bmiItemCreationDate && new Date(bmiItemCreationDate)) || undefined;

  return bmiItemServiceCode === ServiceCodesEnum.WEI_F_WEIGHT_LOSS_TREATMENT ||
  bmiItemServiceCode === ServiceCodesEnum.WEI_R_WEIGHT_LOSS_RETURN
    ? fivePercentLogicAfter180Days(treatmentStartDate, startWeight, rowCreatedDate, weight)
    : null;
};

const fivePercentLogicAfter180Days = (
  startDate?: Date,
  startWeight?: number,
  comparingDate?: Date,
  comparingWeight?: number,
) => {
  if (
    startDate &&
    startWeight &&
    comparingWeight &&
    comparingDate &&
    datesDifferenceInDays(startDate, comparingDate) >= 180
  ) {
    return calculatePercentageDifference(startWeight, comparingWeight);
  }
  return null;
};
