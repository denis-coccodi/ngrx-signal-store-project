import { CommonModule } from '@angular/common';
import { computed, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BmiStore } from '@bmi-store';
import { USER_BMI_MOCK_RESPONSE } from '@local-mocks';
import { UserBMIService } from '@pims-services';
import { convertMetricToImperialWeight, dateToString } from '@shared-utils';
import { BmiApi } from '@types-lib';
import { DatepickerComponent, EditableFieldComponent, TextFieldComponent } from '@ui-lib/components';
import { MetricToImperialWeightPipe } from '@ui-lib/pipes';
import { of } from 'rxjs';
import { SaveRowSwitcherComponent } from '../save-row-switcher/save-row-switcher.component';
import { BmiTreatmentStartComponent } from './bmi-treatment-start.component';

const setisUpdateTreatmentStartFulfilled = signal(false);

// Mock BmiStore
const mockBmiStore = {
  treatmentDetails: signal<Partial<BmiApi.BmiTreatmentInfo>>({
    ...USER_BMI_MOCK_RESPONSE.data.treatment_details,
    bmi_id: 1,
    order_id: 1,
    start_date: '2023-10-01',
    start_weight: 70,
  }),
  isUpdateTreatmentStartFulfilled: computed(() => setisUpdateTreatmentStartFulfilled()),
  updateTreatmentStartInfo: jest.fn().mockReturnValue(of({})),
};

const mockUserBMIService = {
  updateBmiItem: jest.fn(),
  getBmiData: jest.fn(),
  updateTreatmentStart: jest.fn(),
};

describe('BmiTreatmentStartComponent', () => {
  let component: BmiTreatmentStartComponent;
  let fixture: ComponentFixture<BmiTreatmentStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BmiTreatmentStartComponent,
        EditableFieldComponent,
        TextFieldComponent,
        DatepickerComponent,
        SaveRowSwitcherComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: BmiStore, useValue: mockBmiStore },
        { provide: UserBMIService, useValue: mockUserBMIService },
        MetricToImperialWeightPipe,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BmiTreatmentStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.editMode()).toBe(false);
    expect(component.startDate()).toEqual(new Date('2023-10-01'));
    expect(component.weight()).toBe(70);
    expect(component.displayWeight()).toBe('70kg');
    expect(component.displayStartDate()).toBe(dateToString(new Date('2023-10-01')));
  });

  it('should switch to edit mode when edit button is clicked', () => {
    component.onEditClick();

    fixture.detectChanges();
    expect(component.editMode()).toBe(true);
    expect(component.treatmentStartDateCtrl().value).toBe('01/10/2023');
    expect(component.kilogramsCtrl().value).toBe('70');
  });

  it('should cancel edit mode and reset form values', () => {
    component.onEditClick();
    component.treatmentStartDateCtrl().setValue('02/10/2023');
    component.kilogramsCtrl().setValue('80');

    component.onCancelClick();
    expect(component.editMode()).toBe(false);
    expect(component.treatmentStartDateCtrl().value).toBe(null);
    expect(component.kilogramsCtrl().value).toBe(null);
  });

  it('should validate form and save data when valid', () => {
    component.onEditClick();
    component.treatmentStartDateCtrl().setValue('02/10/2023');
    component.kilogramsCtrl().setValue('80');

    component.onSaveClick();
    setisUpdateTreatmentStartFulfilled.update(() => true);
    fixture.detectChanges();
    expect(mockBmiStore.updateTreatmentStartInfo).toHaveBeenCalledWith({
      order_id: 1,
      bmi_id: 1,
      start_date: '2023-10-02',
      start_weight: 80,
    });
    expect(component.editMode()).toBe(false);
  });

  it('should not save data when form is invalid', () => {
    component.onEditClick();
    component.treatmentStartDateCtrl().setValue('');
    component.kilogramsCtrl().setValue('');

    component.onSaveClick();
    expect(mockBmiStore.updateTreatmentStartInfo).not.toHaveBeenCalled();
    expect(component.editMode()).toBe(true);
  });

  it('should convert weight to imperial system when selected', () => {
    fixture.componentRef.setInput('selectedWeightSystem', 'IMPERIAL');
    fixture.detectChanges();

    const { stones, pounds } = convertMetricToImperialWeight(70);
    expect(component.displayWeight()).toBe(`${stones}st ${pounds}lb`);
  });
});
