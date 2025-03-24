import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  Signal,
  signal
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BmiStore } from '@bmi-store';
import {
  convertImperialToMetricWeight,
  convertMetricToImperialWeight,
  dateToString,
  stringToDate,
} from '@shared-utils';
import { BmiApi } from '@types-lib';
import {
  DatepickerComponent,
  EditableFieldComponent,
  SuffixedFormControl,
  TextFieldComponent,
} from '@ui-lib/components';
import { MetricToImperialWeightPipe } from '@ui-lib/pipes';
import { SaveRowSwitcherComponent } from '../save-row-switcher/save-row-switcher.component';

type WeightSystem = 'METRIC' | 'IMPERIAL';

@Component({
  selector: 'bmi-treatment-start',
  standalone: true,
  imports: [
    CommonModule,
    EditableFieldComponent,
    TextFieldComponent,
    DatepickerComponent,
    SaveRowSwitcherComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './bmi-treatment-start.component.html',
  styleUrl: './bmi-treatment-start.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BmiTreatmentStartComponent {
  readonly store = inject(BmiStore);
  selectedWeightSystem = input<WeightSystem>('METRIC');
  treatmentStartData: Signal<BmiApi.BmiTreatmentInfo> = this.store.treatmentDetails;
  editMode = signal(false);
  metricToImpWeightPipe = new MetricToImperialWeightPipe();
  today = new Date();
  startDate = computed<Date | undefined>(
    () =>
      (this.treatmentStartData()?.start_date && new Date(this.treatmentStartData()?.start_date as string)) || undefined,
  );
  weight = computed<number | undefined>(() => this.treatmentStartData()?.start_weight);
  editButtonText = computed(() => (this.startDate() || this.weight() ? 'Edit' : 'Add'));

  displayWeight = computed<string>(() =>
    !this.weight()
      ? 'N/A'
      : this.selectedWeightSystem() === 'METRIC'
      ? `${Math.round(((this.weight() as number) * 10) as number) / 10}kg`
      : this.metricToImpWeightPipe.transform(this.weight()),
  );

  displayStartDate = computed<string>(() => (!this.startDate() ? 'N/A' : dateToString(this.startDate() as Date)));

  treatmentStartDateCtrl = signal(new FormControl<string>(''));
  kilogramsCtrl = signal(
    new SuffixedFormControl<string>('', 'kg', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^\\d+(\\.\\d{1,1})?$'),
    ]),
  );
  stonesCtrl = signal<SuffixedFormControl<string>>(
    new SuffixedFormControl<string>('', 'st', [Validators.required, Validators.min(1), Validators.pattern('[\\d]*')]),
  );
  poundsCtrl = signal<SuffixedFormControl<string>>(
    new SuffixedFormControl<string>('', 'lb', [Validators.required, Validators.pattern('[\\d]*'), Validators.max(13)]),
  );

  bmiTreatmentStartForm = computed<FormGroup>(
    () =>
      new FormGroup({
        treatmentStartDate: this.treatmentStartDateCtrl(),
        ...this.currentWeightControls(),
      }),
  );

  currentWeightControls = computed<{ [key: string]: SuffixedFormControl<string> }>(() =>
    this.selectedWeightSystem() === 'METRIC'
      ? {
          kilogramsWeight: this.kilogramsCtrl(),
        }
      : ({
          stonesWeight: this.stonesCtrl(),
          poundsWeight: this.poundsCtrl(),
        } as { [key: string]: SuffixedFormControl<string> }),
  );

  currentWeightControlsArray = computed(() => Object.values(this.currentWeightControls()));

  constructor() {
    effect(
      () => {
        if (this.store.isUpdateTreatmentStartFulfilled()) {
          this.bmiTreatmentStartForm().reset();
          this.editMode.update(() => false);
        }
      }, {allowSignalWrites: true}
    );

    effect(() => {
      const system = this.selectedWeightSystem();
      if (this.editMode()) {
        this.setInitialFormWeightValues(this.weight(), system);
      }
    });
  }

  onEditClick() {
    this.setEditMode(true);
  }

  onCancelClick() {
    this.editMode.update(() => false);
    this.bmiTreatmentStartForm().reset();
  }

  private readonly setInitialFormWeightValues = (weight?: number, system: WeightSystem = 'METRIC') => {
    if (system === 'METRIC') {
      const roundedWeight = weight && Math.round(weight * 10) / 10;
      this.kilogramsCtrl().setValue(roundedWeight?.toString() || '');
    } else {
      const { pounds, stones } = convertMetricToImperialWeight(weight || 0);
      this.stonesCtrl().setValue(stones?.toString() || '');
      this.poundsCtrl().setValue((pounds !== undefined && stones && pounds?.toString()) || '');
    }
  };

  setEditMode(state: boolean) {
    this.editMode.update(() => state);
    if (state) {
      const startDateString: string = this.startDate() ? dateToString(this.startDate() as Date, 'DD/MM/YYYY') : '';
      this.bmiTreatmentStartForm().reset();
      this.treatmentStartDateCtrl().setValue(startDateString);
    }
  }

  private readonly getWeightInMetric = (): number => {
    const weight =
      this.selectedWeightSystem() === 'METRIC'
        ? +(this.kilogramsCtrl().value || 0)
        : convertImperialToMetricWeight(+(this.stonesCtrl().value || 0), +(this.poundsCtrl().value || 0));

    return weight;
  };

  onSaveClick() {
    this.bmiTreatmentStartForm().markAllAsTouched();
    this.bmiTreatmentStartForm().updateValueAndValidity();

    if (this.bmiTreatmentStartForm().valid) {
      const { bmi_id, order_id } = { ...this.treatmentStartData() } as BmiApi.BmiTreatmentInfo;
      const start_weight = this.getWeightInMetric();
      const controlStringAsDate = stringToDate(this.treatmentStartDateCtrl().value as string) as Date;
      const start_date = dateToString(controlStringAsDate, 'YYYY-MM-DD');
      this.store.updateTreatmentStartInfo({
        order_id,
        start_date,
        start_weight,
        bmi_id,
      });
    }
  }
}
