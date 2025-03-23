import { DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Inject,
  Signal,
  signal,
} from '@angular/core';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BmiStore } from '@bmi-store';
import { LoggedInUserStore } from '@logged-in-user-store';
import {
  convertImperialToMetricHeight,
  convertImperialToMetricWeight,
  convertMetricToImperialHeight,
  convertMetricToImperialWeight,
} from '@shared-utils';
import {
  DropdownComponent,
  DropdownItem,
  EditableFieldComponent,
  IconComponent,
  SuffixedFormControl,
  TableHeaderSelector,
  TableHeaderSelectorComponent,
  TextFieldComponent,
} from '@ui-lib/components';
import {
  MetricToImperialHeightPipe,
  MetricToImperialWeightPipe,
} from '@ui-lib/pipes';
import {
  DialogContentComponent,
  DraggableDialogHeaderComponent,
} from '@ui-lib/services';

import { Bmi, ServiceCodesEnum, Users } from '@types-lib';
import { BmiTableSkeletonComponent } from './bmi-table-skeleton-item/bmi-table-skeleton-item.component';
import { BmiTreatmentStartComponent } from './bmi-treatment-start/bmi-treatment-start.component';
import { PassFailDisplayComponent } from './pass-fail-display/pass-fail-display.component';
import { SaveRowSwitcherComponent } from './save-row-switcher/save-row-switcher.component';

@Component({
  selector: 'bmi-logs-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DraggableDialogHeaderComponent,
    DialogContentComponent,
    TableHeaderSelectorComponent,
    EditableFieldComponent,
    SaveRowSwitcherComponent,
    PassFailDisplayComponent,
    DropdownComponent,
    FormsModule,
    MatIconModule,
    IconComponent,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatTooltipModule,
    BmiTreatmentStartComponent,
    BmiTableSkeletonComponent,
    TextFieldComponent,
    DatePipe,
  ],
  templateUrl: './biometrics-logs-dialog.component.html',
  styleUrl: './biometrics-logs-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BMIDialogComponent {
  readonly bmiStore = inject(BmiStore);
  readonly userStore = inject(LoggedInUserStore);
  metricToImpHeightPipe = new MetricToImperialHeightPipe();
  metricToImpWeightPipe = new MetricToImperialWeightPipe();
  displayedBMIs = this.bmiStore.sortedAndFilteredBmiList;
  dateSelectors = signal<DropdownItem<'OLDEST' | 'NEWEST' | 'NONE'>[]>([
    { value: 'NEWEST', description: 'Newest first' },
    { value: 'OLDEST', description: 'Oldest first' },
  ]);
  defaultDateSelector = signal<DropdownItem<'OLDEST' | 'NEWEST' | 'NONE'>>(
    this.dateSelectors()[0]
  );

  productTypeSelectors = signal<DropdownItem<'' | 'WEIGHT_LOSS'>[]>([
    { value: '', description: 'All services' },
    { value: 'WEIGHT_LOSS', description: 'Weight Loss only' },
  ]);
  defaultProductTypeSelector = signal<DropdownItem<'' | 'WEIGHT_LOSS'>>(
    this.productTypeSelectors()[0]
  );

  heightSelectors = signal<TableHeaderSelector<'METRIC' | 'IMPERIAL'>>({
    title: 'Height',
    selected: 'METRIC',
    onClickFunction: (id) => {
      this.heightSelectors.set({ ...this.heightSelectors(), selected: id });
      const rowBeingEdited = this.bmiStore.itemBeingEdited();
      if (rowBeingEdited) {
        this.setInitialFormHeightValues(rowBeingEdited);
      }
    },
    selectors: [
      {
        id: 'METRIC',
        btnLabel: 'Cm',
      },
      {
        id: 'IMPERIAL',
        btnLabel: 'Ft/In',
      },
    ],
  });

  weightSelectors = signal<TableHeaderSelector<'METRIC' | 'IMPERIAL'>>({
    title: 'Weight',
    selected: 'METRIC',
    onClickFunction: (id) => {
      this.weightSelectors.set({ ...this.weightSelectors(), selected: id });
      const rowBeingEdited = this.bmiStore.itemBeingEdited();
      if (rowBeingEdited) {
        this.setInitialFormWeightValues(rowBeingEdited);
      }
    },
    selectors: [
      {
        id: 'METRIC',
        btnLabel: 'Kg',
      },
      {
        id: 'IMPERIAL',
        btnLabel: 'St/Lb',
      },
    ],
  });

  loggedInUser = computed(() => (this.userStore.user as Signal<Users.User>)());

  canEdit = computed<boolean>(
    () =>
      !!Object.keys(this.loggedInUser().roles).some((role) =>
        [
          Users.ROLES.DOCTOR.ID.toString(),
          Users.ROLES.PHARMACIST.ID.toString(),
          Users.ROLES.DOCTOR_ADMIN.ID.toString(),
          Users.ROLES.SUPERVISING_DOCTOR.ID.toString(),
        ].some((allowedRole) => allowedRole === role)
      )
  );

  gridTemplateColumns = computed<string>(
    () =>
      `auto auto minmax(50px, 1fr) minmax(50px, 1fr) auto auto auto ${
        this.canEdit() ? '206px' : ''
      }`
  );

  centimetersCtrl = signal<SuffixedFormControl<string>>(
    new SuffixedFormControl<string>('', 'cm', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('[\\d]*'),
    ])
  );
  kilogramsCtrl = signal<SuffixedFormControl<string>>(
    new SuffixedFormControl<string>('', 'kg', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^\\d+(\\.\\d{1,1})?$'),
    ])
  );
  feetCtrl = signal<SuffixedFormControl<string>>(
    new SuffixedFormControl<string>('', 'ft', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('[\\d]*'),
    ])
  );
  inchesCtrl = signal<SuffixedFormControl<string>>(
    new SuffixedFormControl<string>('', 'in', [
      Validators.required,
      Validators.pattern('[\\d]*'),
      Validators.max(11),
    ])
  );
  stonesCtrl = signal<SuffixedFormControl<string>>(
    new SuffixedFormControl<string>('', 'st', [
      Validators.required,
      Validators.min(1),
      Validators.pattern('[\\d]*'),
    ])
  );
  poundsCtrl = signal<SuffixedFormControl<string>>(
    new SuffixedFormControl<string>('', 'lb', [
      Validators.required,
      Validators.pattern('[\\d]*'),
      Validators.max(13),
    ])
  );

  currentHeightControls = computed<{
    [key: string]: SuffixedFormControl<string>;
  }>(() =>
    this.heightSelectors().selected === 'METRIC'
      ? {
          centimetersHeight: this.centimetersCtrl(),
        }
      : ({
          feetHeight: this.feetCtrl(),
          inchesHeight: this.inchesCtrl(),
        } as { [key: string]: SuffixedFormControl<string> })
  );
  currentWeightControls = computed<{
    [key: string]: SuffixedFormControl<string>;
  }>(() =>
    this.weightSelectors().selected === 'METRIC'
      ? {
          kilogramsWeight: this.kilogramsCtrl(),
        }
      : ({
          stonesWeight: this.stonesCtrl(),
          poundsWeight: this.poundsCtrl(),
        } as { [key: string]: SuffixedFormControl<string> })
  );

  currentHeightControlsArray = computed(() =>
    Object.values(this.currentHeightControls())
  );
  currentWeightControlsArray = computed(() =>
    Object.values(this.currentWeightControls())
  );

  // recreate form on metric system change to include the proper FormControls
  bmiForm = computed<FormGroup>(
    () =>
      new FormGroup({
        ...this.currentHeightControls(),
        ...this.currentWeightControls(),
      })
  );

  constructor(@Inject(DIALOG_DATA) public data: Bmi.BMIDialogData) {
    effect(() => {
      if (this.bmiStore.isLoadBmiDataFulfilled()) {
        this.bmiForm().reset();
      }
    });
  }

  onSelectedDateSelectorChange(
    e: DropdownItem<'OLDEST' | 'NEWEST' | 'NONE'> | undefined
  ) {
    if (e) {
      if (e.value === 'NEWEST') {
        this.bmiStore.setSortType('desc');
      } else {
        this.bmiStore.setSortType('asc');
      }
    }
  }

  onSelectedProductTypeSelectorChange(
    e: DropdownItem<'' | 'WEIGHT_LOSS'> | undefined
  ) {
    if (e) {
      if (e.value === 'WEIGHT_LOSS') {
        this.bmiStore.setServiceCodesFilter([
          ServiceCodesEnum.WEI_F_WEIGHT_LOSS_TREATMENT,
          ServiceCodesEnum.WEI_R_WEIGHT_LOSS_RETURN,
        ]);
      } else {
        this.bmiStore.setServiceCodesFilter([]);
      }
    }
  }

  setEditMode(bmiDisplayRow: Bmi.EditableUserBMI, state: boolean) {
    this.setInitialFormValues(bmiDisplayRow, state);
    this.bmiStore.setBmiItemEditMode(
      bmiDisplayRow.order.mail_order_fill_request_id,
      state
    );
  }

  private readonly setInitialFormValues = (
    bmiRow: Bmi.EditableUserBMI,
    isEditMode: boolean
  ) => {
    if (isEditMode) {
      this.setInitialFormHeightValues(bmiRow);
      this.setInitialFormWeightValues(bmiRow);
    } else {
      this.bmiForm().reset();
    }
  };

  private readonly setInitialFormHeightValues = (
    bmiRow: Bmi.EditableUserBMI
  ) => {
    if (this.heightSelectors().selected === 'METRIC') {
      if (bmiRow.height) {
        this.centimetersCtrl().setValue(
          Math.round(bmiRow.height)?.toString() || ''
        );
      }
    } else {
      const { feet, inches } = convertMetricToImperialHeight(
        bmiRow.height as number
      );
      this.feetCtrl().setValue((feet && feet.toString()) || '');
      this.inchesCtrl().setValue(
        (inches !== undefined && feet && inches.toString()) || ''
      );
    }
  };

  private readonly setInitialFormWeightValues = (
    bmiRow: Bmi.EditableUserBMI
  ) => {
    if (this.weightSelectors().selected === 'METRIC') {
      if (bmiRow.weight) {
        this.kilogramsCtrl().setValue(
          (Math.round(bmiRow.weight * 10) / 10)?.toString() || ''
        );
      }
    } else {
      const { pounds, stones } = convertMetricToImperialWeight(
        bmiRow.weight as number
      );
      this.stonesCtrl().setValue((stones && stones.toString()) || '');
      this.poundsCtrl().setValue(
        (pounds !== undefined && stones && pounds.toString()) || ''
      );
    }
  };

  onSaveRow(bmiRow: Bmi.EditableUserBMI) {
    this.bmiForm().markAllAsTouched();
    this.bmiForm().updateValueAndValidity();

    if (this.bmiForm().valid) {
      const metricHeightAndWeight = this.getHeightAndWeightInMetric();
      this.bmiStore.updateBmiItem({
        bmiRow,
        currentUser: this.loggedInUser(),
        newMetricHeight: metricHeightAndWeight.height,
        newMetricWeight: metricHeightAndWeight.weight,
      });
    }
  }

  private readonly getHeightAndWeightInMetric = (): {
    height: number;
    weight: number;
  } => {
    const height =
      this.heightSelectors().selected === 'METRIC'
        ? +(this.centimetersCtrl().value || 0)
        : convertImperialToMetricHeight(
            +(this.feetCtrl().value || 0),
            +(this.inchesCtrl().value || 0)
          );
    const weight =
      this.weightSelectors().selected === 'METRIC'
        ? +(this.kilogramsCtrl().value || 0)
        : convertImperialToMetricWeight(
            +(this.stonesCtrl().value || 0),
            +(this.poundsCtrl().value || 0)
          );

    return {
      height,
      weight,
    };
  };

  protected readonly getDisplayHeight = (height?: number) =>
    !height
      ? ''
      : this.heightSelectors().selected === 'METRIC'
      ? `${Math.round(height)}cm`
      : this.metricToImpHeightPipe.transform(height);

  protected readonly getDisplayWeight = (weight?: number) =>
    !weight
      ? ''
      : this.weightSelectors().selected === 'METRIC'
      ? `${Math.round(weight * 10) / 10}kg`
      : this.metricToImpWeightPipe.transform(weight);

  protected readonly getDisplayBmi = (bmi?: number) =>
    !bmi ? '' : (Math.round(bmi * 10) / 10).toFixed(1);
}
