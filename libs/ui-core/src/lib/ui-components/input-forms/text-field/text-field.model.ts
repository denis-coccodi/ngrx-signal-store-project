import { AbstractControlOptions, FormControl, ValidatorFn } from '@angular/forms';

export class SuffixedFormControl<T> extends FormControl<T | null> {
  suffix: string;

  constructor(
    formState: T | null = null,
    suffix = '',
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
  ) {
    super(formState, validatorOrOpts);
    this.suffix = suffix;
  }
}
