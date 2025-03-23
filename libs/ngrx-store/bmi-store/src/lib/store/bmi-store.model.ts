import { StateSignals, WritableStateSource } from '@ngrx/signals';
import { Bmi } from '@types-lib';

export type BmiStoreInstanceType = WritableStateSource<Bmi.BmiStoreState> & StateSignals<Bmi.BmiStoreState>;

