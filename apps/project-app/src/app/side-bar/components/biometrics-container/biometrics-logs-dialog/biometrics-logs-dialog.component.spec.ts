import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Signal, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { BmiStore } from '@bmi-store';
import { BMI_DIALOG_DATA, BMI_STORE_MOCK, USER_BMI_MOCK_RESPONSE, USER_WITH_NO_ROLES, USER_WITH_ROLES } from '@local-mocks';
import { LoggedInUserStore } from '@logged-in-user-store';
import { Bmi, ServiceCodesEnum } from '@types-lib';
import {
  DropdownComponent,
  EditableFieldComponent,
  IconComponent,
  TableHeaderSelectorComponent,
  TextFieldComponent,
} from '@ui-lib/components';
import { MetricToImperialHeightPipe, MetricToImperialWeightPipe } from '@ui-lib/pipes';
import { DialogContentComponent, DraggableDialogHeaderComponent } from '@ui-lib/services';
import { Observable, Unsubscribable } from 'rxjs';
import { BMIDialogComponent } from './biometrics-logs-dialog.component';
import { BmiTreatmentStartComponent } from './bmi-treatment-start/bmi-treatment-start.component';
import { SaveRowSwitcherComponent } from './save-row-switcher/save-row-switcher.component';

describe('BMIDialogComponent', () => {
  let component: BMIDialogComponent;
  let fixture: ComponentFixture<BMIDialogComponent>;
  let store: Partial<InstanceType<typeof BmiStore>>;
  let userStore: Partial<InstanceType<typeof LoggedInUserStore>>;

  const mockDialogData: Bmi.BMIDialogData = {
    ...BMI_DIALOG_DATA,
    userId: 123,
  };

  const mockBmiList: Bmi.EditableUserBMI[] = [
    {
      height: 180,
      weight: 80,
      bmi: 24.7,
      order: { ...USER_BMI_MOCK_RESPONSE.data.list[0].order, mail_order_fill_request_id: 1 },
      editMode: false,
    },
    {
      height: 170,
      weight: 70,
      bmi: 24.2,
      order: { ...USER_BMI_MOCK_RESPONSE.data.list[1].order, mail_order_fill_request_id: 2 },
      editMode: false,
    },
  ];

  beforeEach(() => {
    store = {
      treatmentDetails: signal(BMI_STORE_MOCK.treatmentDetails) as any,
      bmiListOptions: {
        ...(signal(BMI_STORE_MOCK.bmiListOptions) as any),
      } as any,
      bmiItemEntities: signal(mockBmiList),
      sortedAndFilteredBmiList: signal(mockBmiList),
      isLoadBmiDataPending: signal(false),
      isLoadBmiDataFulfilled: signal(true),
      isUpdateTreatmentStartFulfilled: signal(true),
      setSortType: jest.fn(),
      setServiceCodesFilter: jest.fn(),
      setBmiItemEditMode: jest.fn(),
      updateBmiItem: jest.fn() as any,
      loadBmiData: jest.fn(
        (req: Bmi.LoadBmiDataReq | Observable<Bmi.LoadBmiDataReq> | Signal<Bmi.LoadBmiDataReq>) =>
          ({ unsubscribe: jest.fn() }) as Unsubscribable,
      ) as any,
    };

    userStore = {
      user: signal(USER_WITH_ROLES),
    };

    TestBed.configureTestingModule({
      imports: [
        BMIDialogComponent,
        ReactiveFormsModule,
        CommonModule,
        DraggableDialogHeaderComponent,
        DialogContentComponent,
        TableHeaderSelectorComponent,
        EditableFieldComponent,
        SaveRowSwitcherComponent,
        DropdownComponent,
        MatIconModule,
        IconComponent,
        MatCheckboxModule,
        MatTooltipModule,
        BmiTreatmentStartComponent,
        TextFieldComponent,
      ],
      providers: [
        { provide: DIALOG_DATA, useValue: mockDialogData },
        { provide: BmiStore, useValue: store },
        { provide: LoggedInUserStore, useValue: userStore },
        {
          provide: DialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        MetricToImperialHeightPipe,
        MetricToImperialWeightPipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BMIDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set sort type on date selector change', () => {
    component.onSelectedDateSelectorChange({ value: 'OLDEST', description: 'Oldest first' });
    expect(store.setSortType).toHaveBeenCalledWith('asc');

    component.onSelectedDateSelectorChange({ value: 'NEWEST', description: 'Newest first' });
    expect(store.setSortType).toHaveBeenCalledWith('desc');
  });

  it('should set service codes filter on product type selector change', () => {
    component.onSelectedProductTypeSelectorChange({ value: 'WEIGHT_LOSS', description: 'Weight Loss only' });
    expect(store.setServiceCodesFilter).toHaveBeenCalledWith([
      ServiceCodesEnum.WEI_F_WEIGHT_LOSS_TREATMENT,
      ServiceCodesEnum.WEI_R_WEIGHT_LOSS_RETURN,
    ]);

    component.onSelectedProductTypeSelectorChange({ value: '', description: 'All services' });
    expect(store.setServiceCodesFilter).toHaveBeenCalledWith([]);
  });

  it('should set edit mode and initial form values', () => {
    const bmiRow = mockBmiList[0];
    component.setEditMode(bmiRow, true);
    expect(store.setBmiItemEditMode).toHaveBeenCalledWith(bmiRow.order.mail_order_fill_request_id, true);

    component.setEditMode(bmiRow, false);
    expect(store.setBmiItemEditMode).toHaveBeenCalledWith(bmiRow.order.mail_order_fill_request_id, false);
  });

  it('should save row and update BMI item', () => {
    const bmiRow = mockBmiList[0];
    component.setEditMode(bmiRow, true);
    component.centimetersCtrl().setValue('180');
    component.kilogramsCtrl().setValue('80');
    component.onSaveRow(bmiRow);

    expect(store.updateBmiItem).toHaveBeenCalled();
  });

  it('should get display height in metric', () => {
    component.heightSelectors.set({ ...component.heightSelectors(), selected: 'METRIC' });
    const displayHeight = component['getDisplayHeight'](180);
    expect(displayHeight).toBe('180cm');
  });

  it('should get display height in imperial', () => {
    component.heightSelectors.set({ ...component.heightSelectors(), selected: 'IMPERIAL' });
    const displayHeight = component['getDisplayHeight'](180);
    expect(displayHeight).toBeDefined();
  });

  it('should get display weight in metric', () => {
    component.weightSelectors.set({ ...component.weightSelectors(), selected: 'METRIC' });
    const displayWeight = component['getDisplayWeight'](80);
    expect(displayWeight).toBe('80kg');
  });

  it('should get display weight in imperial', () => {
    component.weightSelectors.set({ ...component.weightSelectors(), selected: 'IMPERIAL' });
    const displayWeight = component['getDisplayWeight'](80);
    expect(displayWeight).toBeDefined();
  });

  it('should get display BMI', () => {
    const displayBmi = component['getDisplayBmi'](24.7);
    expect(displayBmi).toBe('24.7');
  });

  it('should render the edit button when role is suitable', async () => {
    const editButton = fixture.debugElement.query(By.css('.pencil-icon'));

    expect(editButton).toBeTruthy();
  });
});

describe('BiometricsLogsDialogComponentNoRoles', () => {
  let fixture: ComponentFixture<BMIDialogComponent>;
  let store: Partial<InstanceType<typeof BmiStore>>;
  let userStore: Partial<InstanceType<typeof LoggedInUserStore>>;

  const mockDialogData: Bmi.BMIDialogData = {
    ...BMI_DIALOG_DATA,
    userId: 123,
  };

  const mockBmiList: Bmi.EditableUserBMI[] = [
    {
      height: 180,
      weight: 80,
      bmi: 24.7,
      order: { ...USER_BMI_MOCK_RESPONSE.data.list[0].order, mail_order_fill_request_id: 1 },
      editMode: false,
    },
    {
      height: 170,
      weight: 70,
      bmi: 24.2,
      order: { ...USER_BMI_MOCK_RESPONSE.data.list[1].order, mail_order_fill_request_id: 2 },
      editMode: false,
    },
  ];

  beforeEach(() => {
    store = {
      treatmentDetails: signal(BMI_STORE_MOCK.treatmentDetails) as any,
      bmiListOptions: {
        ...(signal(BMI_STORE_MOCK.bmiListOptions) as any),
      } as any,
      sortedAndFilteredBmiList: signal(mockBmiList),
      isLoadBmiDataPending: signal(false),
      isLoadBmiDataFulfilled: signal(true),
      isUpdateTreatmentStartFulfilled: signal(true),
      setSortType: jest.fn(),
      setServiceCodesFilter: jest.fn(),
      setBmiItemEditMode: jest.fn(),
      updateBmiItem: jest.fn() as any,
      loadBmiData: jest.fn(
        (req: Bmi.LoadBmiDataReq | Observable<Bmi.LoadBmiDataReq> | Signal<Bmi.LoadBmiDataReq>) =>
          ({ unsubscribe: jest.fn() }) as Unsubscribable,
      ) as any,
    };

    userStore = {
      user: signal(USER_WITH_NO_ROLES),
    };

    TestBed.configureTestingModule({
      imports: [
        BMIDialogComponent,
        ReactiveFormsModule,
        CommonModule,
        DraggableDialogHeaderComponent,
        DialogContentComponent,
        TableHeaderSelectorComponent,
        EditableFieldComponent,
        SaveRowSwitcherComponent,
        DropdownComponent,
        MatIconModule,
        IconComponent,
        MatCheckboxModule,
        MatTooltipModule,
        BmiTreatmentStartComponent,
        TextFieldComponent,
      ],
      providers: [
        { provide: DIALOG_DATA, useValue: mockDialogData },
        { provide: BmiStore, useValue: store },
        { provide: LoggedInUserStore, useValue: userStore },
        {
          provide: DialogRef,
          useValue: {
            close: jest.fn(),
          },
        },
        MetricToImperialHeightPipe,
        MetricToImperialWeightPipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BMIDialogComponent);
    fixture.detectChanges();
  });

  it('should not render the edit button when role is not suitable', async () => {
    const editButton = fixture.debugElement.query(By.css('.pencil-icon'));

    expect(editButton).toBeFalsy();
  });
});
