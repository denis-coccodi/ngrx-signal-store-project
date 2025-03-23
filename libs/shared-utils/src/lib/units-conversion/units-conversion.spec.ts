import {
    calculateBMI,
    convertImperialToMetricHeight,
    convertImperialToMetricWeight,
    convertMetricToImperialHeight,
    convertMetricToImperialWeight
} from './units-conversion';
  
  describe('Conversion Functions', () => {
    test('convertMetricToImperialHeight correctly converts cm to feet and inches', () => {
      expect(convertMetricToImperialHeight(180)).toEqual({ feet: 5, inches: 11 });
      expect(convertMetricToImperialHeight(150)).toEqual({ feet: 4, inches: 11 });
    });
  
    test('convertMetricToImperialWeight correctly converts kg to stones and pounds', () => {
      expect(convertMetricToImperialWeight(70)).toEqual({ stones: 11, pounds: 0 });
      expect(convertMetricToImperialWeight(100)).toEqual({ stones: 15, pounds: 10 });
    });
  
    test('convertImperialToMetricHeight correctly converts feet and inches to cm', () => {
      expect(convertImperialToMetricHeight(5, 11)).toBeCloseTo(180.34, 2);
      expect(convertImperialToMetricHeight(4, 11)).toBeCloseTo(149.86, 2);
    });
  
    test('convertImperialToMetricWeight correctly converts stones and pounds to kg', () => {
      expect(convertImperialToMetricWeight(11, 0)).toBeCloseTo(69.85, 2);
      expect(convertImperialToMetricWeight(15, 10)).toBeCloseTo(99.79, 2);
    });
  });
  
  describe('BMI Calculation', () => {
    test('calculateBMI correctly computes BMI in metric system', () => {
      expect(calculateBMI(180, 70, 'METRIC')).toBeCloseTo(21.6, 1);
      expect(calculateBMI(160, 50, 'METRIC')).toBeCloseTo(19.5, 1);
    });
  
    test('calculateBMI correctly computes BMI in imperial system', () => {
      expect(calculateBMI(71, 154, 'IMPERIAL')).toBeCloseTo(21.5, 1);
      expect(calculateBMI(63, 110, 'IMPERIAL')).toBeCloseTo(19.5, 1);
    });
  });
  