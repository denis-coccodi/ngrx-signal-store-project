import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BmiStore } from '@bmi-store';
import { BMI_STORE_MOCK, USER_BMI_MOCK_RESPONSE } from '@local-mocks';
import { DeepSignal } from '@ngrx/signals';
import { Bmi, BmiApi } from '@types-lib';
import { MetricToImperialHeightPipe, MetricToImperialWeightPipe, OrdinalDatePipe } from '@ui-lib/pipes';
import { environmentPIMS, PIMS_ENVIRONMENT } from 'environments';
import { BiometricsDisplayComponent } from './biometrics-display.component';

const latestBmiSignal = signal<BmiApi.UserBMI | undefined>(undefined);

const mockBmiStore: Partial<InstanceType<typeof BmiStore>> = {
  latestBmiItem: latestBmiSignal,
  fivePercentWeightLossStatus: signal(Bmi.FivePercentWeightLossStatusEnum.NOT_DUE),
  treatmentDetails: signal(USER_BMI_MOCK_RESPONSE.data.treatment_details) as unknown as DeepSignal<BmiApi.BmiTreatmentInfo>
};

describe('BiometricsDisplayComponent', () => {
  let component: BiometricsDisplayComponent;
  let fixture: ComponentFixture<BiometricsDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BiometricsDisplayComponent,
        OrdinalDatePipe,
        MetricToImperialHeightPipe,
        MetricToImperialWeightPipe,
      ],
      providers: [
        { provide: PIMS_ENVIRONMENT, useValue: environmentPIMS },
        { provide: BmiStore, useValue: mockBmiStore },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BiometricsDisplayComponent);
    component = fixture.componentInstance;
    component.userId = 123;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show logs button when enabled', () => {
    latestBmiSignal.set({ ...BMI_STORE_MOCK.latestBmiItem, weight: 70, height: 175 } as BmiApi.UserBMI);
    component.showLogsButton = true;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('button'));
    expect(button).toBeTruthy();
  });

  it('should compute latestBmiItem correctly', () => {
    latestBmiSignal.set({ ...BMI_STORE_MOCK.latestBmiItem, weight: 70, height: 175 } as BmiApi.UserBMI);
    fixture.detectChanges();
    expect(component.latestBmiItem()).toEqual({
      ...BMI_STORE_MOCK.latestBmiItem,
      weight: 70,
      height: 175,
    } as BmiApi.UserBMI);
  });

  it('should not show biometrics when latestBmiItem is empty', () => {
    latestBmiSignal.set(undefined);
    fixture.detectChanges();
    expect(component.showBiometrics()).toBe(false);
  });
});
