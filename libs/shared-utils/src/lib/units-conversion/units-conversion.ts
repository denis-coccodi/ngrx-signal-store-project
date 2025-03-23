export const METRIC_TO_IMPERIAL_CONVERSION_RATES = {
  CM_TO_INCH_CONVERSION_RATE: 0.393701,
  CM_TO_FOOT_CONVERSION_RATE: 0.0328084,
  KILOGRAM_TO_POUNDS_CONVERSION_RATE: 2.20462,
  KILOGRAM_TO_STONE_CONVERSION_RATE: 0.15747,
};

export const IMPERIAL_TO_METRIC_CONVERSION_RATES = {
  FOOT_TO_CM_CONVERSION_RATE: 30.48,
  INCH_TO_CM_CONVERSION_RATE: 2.54,
  STONE_TO_KILOGRAM_CONVERSION_RATE: 6.35029,
  POUNDS_TO_KILOGRAM_CONVERSION_RATE: 0.453592,
};

export const convertMetricToImperialHeight = (cmValue: number) => {
  const totalInches =
    cmValue * METRIC_TO_IMPERIAL_CONVERSION_RATES.CM_TO_INCH_CONVERSION_RATE;
  const flooredFeet = Math.floor(totalInches / 12);
  const roundedInches = Math.round(totalInches % 12);
  return roundedInches >= 12
    ? {
        feet: flooredFeet + 1,
        inches: 0,
      }
    : {
        feet: flooredFeet,
        inches: roundedInches,
      };
};

export const convertMetricToImperialWeight = (kgValue: number) => {
  const totalPounds =
    kgValue *
    METRIC_TO_IMPERIAL_CONVERSION_RATES.KILOGRAM_TO_POUNDS_CONVERSION_RATE;
  const flooredStones = Math.floor(totalPounds / 14);
  const roundedPounds = Math.round(totalPounds % 14);
  return roundedPounds >= 14
    ? {
        stones: flooredStones + 1,
        pounds: 0,
      }
    : {
        stones: flooredStones,
        pounds: roundedPounds,
      };
};

export const convertImperialToMetricHeight = (
  feet: number,
  inches: number
): number => {
  const totalInches = feet * 12 + inches;
  return (
    Math.round(
      totalInches *
        IMPERIAL_TO_METRIC_CONVERSION_RATES.INCH_TO_CM_CONVERSION_RATE *
        100
    ) / 100
  );
};

export const convertImperialToMetricWeight = (
  stones: number,
  pounds: number
): number => {
  const totalPounds = stones * 14 + pounds;
  return (
    Math.round(
      totalPounds *
        IMPERIAL_TO_METRIC_CONVERSION_RATES.POUNDS_TO_KILOGRAM_CONVERSION_RATE *
        100
    ) / 100
  );
};

export const calculateBMI = (
  height: number,
  weight: number,
  system: 'METRIC' | 'IMPERIAL' = 'METRIC'
): number =>
  // round to second decimal digit << * 100 before rounding -> / 100 after rounding >>
  system === 'METRIC'
    ? Math.round((weight / (height * height)) * 10000 * 100) / 100
    : Math.round(((703 * weight) / (height * height)) * 100) / 100;

export const convertMetricToImperialHeightStr = (cmValue: number) => {
  const { feet, inches } = convertMetricToImperialHeight(cmValue);
  return `${feet}ft ${inches}in`;
};

export const convertMetricToImperialWeightStr = (kgValue: number) => {
  const { stones, pounds } = convertMetricToImperialWeight(kgValue);
  return `${stones}st ${pounds}lb`;
};
