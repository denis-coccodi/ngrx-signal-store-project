import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

type MomentUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';

export const DAYS_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const SHORT_DAYS_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export const MONTHS_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const SHORT_MONTHS_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const isStringDateValid = (dateString: string, dateDisplayFormat = 'DD/MM/YYYY'): boolean => {
  return moment(dateString, dateDisplayFormat, true).isValid();
};

export const dateToString = (date: Date, dateDisplayFormat = 'DD/MM/YYYY'): string => {
  return moment(date).format(dateDisplayFormat);
};

export const stringToDate = (dateString: string, dateDisplayFormat = 'DD/MM/YYYY'): Date | undefined => {
  const momentDate = moment(dateString, dateDisplayFormat, true);

  return momentDate.isValid() ? momentDate.toDate() : undefined;
};

export const isBeforeOrSameDate = (date: Date | string, referenceDate?: Date | string, diffReference: MomentUnit = 'day'): boolean =>
  moment(date).isSameOrBefore(moment(referenceDate), diffReference);

export const isAfterOrSameDate = (date: Date | string, referenceDate?: Date | string, diffReference: MomentUnit = 'day'): boolean =>
  moment(date).isSameOrAfter(moment(referenceDate), diffReference);

export const isSameDate = (date: Date | string, referenceDate?: Date | string, diffReference: MomentUnit = 'day'): boolean =>
  moment(date).isSame(moment(referenceDate), diffReference);

export const isDateWithinBoundaries = (date: Date, minDate?: Date, maxDate?: Date) => {
  const isBeforeOrSameDateVar = !maxDate || isBeforeOrSameDate(date, maxDate);
  const isAfterOrSameDateVar = !minDate || isAfterOrSameDate(date, minDate);
  return isBeforeOrSameDateVar && isAfterOrSameDateVar;
};

export function dateFormatValidator(dateFormat: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value;
    const isValid = moment(value, dateFormat, true).isValid();

    return !isValid ? { invalidDateFormat: { value: control.value } } : null;
  };
}

export function dateBoundariesValidator(dateFormat = 'DD/MM/YYYY', minDate?: Date, maxDate?: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = control.value;
    const date = moment(value, dateFormat, true).toDate();

    return !isDateWithinBoundaries(date, minDate, maxDate) ? { dateOutOfBounds: { value: control.value } } : null;
  };
}

export const datesDifferenceInDays = (baseDate: Date, destinationDate: Date): number =>
  moment(destinationDate).diff(moment(baseDate), 'days');
