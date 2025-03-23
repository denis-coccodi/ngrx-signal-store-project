import { signal, WritableSignal } from '@angular/core';
import { Bmi } from '@types-lib';

export const loadBmiDataStart: WritableSignal<Bmi.LoadBmiDataReq | undefined> = signal(undefined);
export const loadLatestBmiItemStart: WritableSignal<Bmi.LoadBmiDataReq | undefined> = signal(undefined);