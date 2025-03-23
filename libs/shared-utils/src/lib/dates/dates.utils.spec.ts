import { FormControl } from '@angular/forms';
import {
    dateBoundariesValidator,
    dateFormatValidator,
    datesDifferenceInDays,
    dateToString,
    isAfterOrSameDate,
    isBeforeOrSameDate,
    isDateWithinBoundaries,
    isSameDate,
    isStringDateValid,
    stringToDate,
} from './dates.utils';

describe('Date Utils', () => {
  test('isStringDateValid should validate correct date format', () => {
    expect(isStringDateValid('12/03/2024')).toBe(true);
    expect(isStringDateValid('32/03/2024')).toBe(false);
    expect(isStringDateValid('12-03-2024', 'DD-MM-YYYY')).toBe(true);
  });

  test('dateToString should format Date object correctly', () => {
    const date = new Date(2024, 2, 12);
    expect(dateToString(date)).toBe('12/03/2024');
  });

  test('stringToDate should convert valid date string to Date object', () => {
    expect(stringToDate('12/03/2024')).toEqual(new Date(2024, 2, 12));
    expect(stringToDate('invalid date')).toBeUndefined();
  });

  test('isBeforeOrSameDate should check if date is before or same', () => {
    expect(isBeforeOrSameDate('10/03/2024', '12/03/2024')).toBe(true);
    expect(isBeforeOrSameDate('15/03/2024', '12/03/2024')).toBe(false);
  });

  test('isAfterOrSameDate should check if date is after or same', () => {
    expect(isAfterOrSameDate('12/03/2024', '10/03/2024')).toBe(true);
    expect(isAfterOrSameDate('08/03/2024', '10/03/2024')).toBe(false);
  });

  test('isSameDate should check if two dates are the same', () => {
    expect(isSameDate('12/03/2024', '12/03/2024')).toBe(true);
    expect(isSameDate('11/03/2024', '12/03/2024')).toBe(false);
  });

  test('isDateWithinBoundaries should verify date within range', () => {
    expect(isDateWithinBoundaries(new Date(2024, 2, 12), new Date(2024, 2, 10), new Date(2024, 2, 15))).toBe(true);
    expect(isDateWithinBoundaries(new Date(2024, 2, 9), new Date(2024, 2, 10), new Date(2024, 2, 15))).toBe(false);
  });

  test('dateFormatValidator should validate date format', () => {
    const validator = dateFormatValidator('DD/MM/YYYY');
    expect(validator(new FormControl('12/03/2024'))).toBeNull();
    expect(validator(new FormControl('03-12-2024'))).toEqual({ invalidDateFormat: { value: '03-12-2024' } });
  });

  test('dateBoundariesValidator should validate date within boundaries', () => {
    const validator = dateBoundariesValidator('DD/MM/YYYY', new Date(2024, 2, 10), new Date(2024, 2, 15));
    expect(validator(new FormControl('12/03/2024'))).toBeNull();
    expect(validator(new FormControl('09/03/2024'))).toEqual({ dateOutOfBounds: { value: '09/03/2024' } });
  });

  test('datesDifferenceInDays should return correct difference in days', () => {
    expect(datesDifferenceInDays(new Date(2024, 2, 10), new Date(2024, 2, 15))).toBe(5);
  });
});
