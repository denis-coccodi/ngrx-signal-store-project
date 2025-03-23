import { computed, Signal } from '@angular/core';
import { datesDifferenceInDays } from '@shared-utils';
import { Bmi, BmiApi } from '@types-lib';

export const fivePercentWeightLossStatus = (
  treatmentInfo: Signal<BmiApi.BmiTreatmentInfo>,
): Signal<Bmi.FivePercentWeightLossStatusEnum> =>
  computed(() => {
    const { one_eighty_days_check, start_date, five_percent_weight_check } = treatmentInfo();
    const treatmentStartDate = (start_date && new Date(start_date)) || undefined;

    const isTodayPast180Days = treatmentStartDate && datesDifferenceInDays(treatmentStartDate, new Date()) >= 180;
    switch (true) {
      case isTodayPast180Days &&
        one_eighty_days_check &&
        five_percent_weight_check !== null &&
        five_percent_weight_check !== undefined &&
        (five_percent_weight_check as number) <= -5:
        return Bmi.FivePercentWeightLossStatusEnum.MET;
      case isTodayPast180Days &&
        one_eighty_days_check &&
        five_percent_weight_check !== null &&
        five_percent_weight_check !== undefined &&
        (five_percent_weight_check as number) > -5:
        return Bmi.FivePercentWeightLossStatusEnum.NOT_MET;
      case isTodayPast180Days && !one_eighty_days_check:
        return Bmi.FivePercentWeightLossStatusEnum.DUE;
      default:
        return Bmi.FivePercentWeightLossStatusEnum.NOT_DUE;
    }
  });
