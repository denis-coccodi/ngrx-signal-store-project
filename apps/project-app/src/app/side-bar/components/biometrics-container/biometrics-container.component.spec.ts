import { DialogRef } from '@angular/cdk/dialog';
import { signal, Signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BmiStore } from '@bmi-store';
import { Bmi } from '@types-lib';
import { DefaultDialogService } from '@ui-lib/services';
import { Observable, Unsubscribable } from 'rxjs';
import { BiometricsContainerComponent } from './biometrics-container.component';
import { BiometricsDisplayComponent } from './biometrics-display/biometrics-display.component';

const mockBmiStore: Partial<InstanceType<typeof BmiStore>> = {
  setPatientUserId: jest.fn(),
  loadBmiData: jest.fn(
    (req: Bmi.LoadBmiDataReq | Observable<Bmi.LoadBmiDataReq> | Signal<Bmi.LoadBmiDataReq>) =>
      ({ unsubscribe: jest.fn() }) as Unsubscribable,
  ) as any,
  resetStoreToInitialState: jest.fn(),
  fivePercentWeightLossStatus: signal(Bmi.FivePercentWeightLossStatusEnum.MET),
};

const mockDialogService: Partial<DefaultDialogService> = {
  hasOpenDialogsOfType: jest.fn(() => false),
  open: jest.fn(() => ({ close: jest.fn() }) as unknown as DialogRef<any, any>),
};

describe('BiometricsContainerComponent', () => {
  let component: BiometricsContainerComponent;
  let fixture: ComponentFixture<BiometricsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BiometricsContainerComponent, BiometricsDisplayComponent],
      providers: [
        { provide: BmiStore, useValue: mockBmiStore },
        { provide: DefaultDialogService, useValue: mockDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BiometricsContainerComponent);
    component = fixture.componentInstance;
    component.userId = 123;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call store method for latest bmi item on init', () => {
    expect(mockBmiStore.setPatientUserId).toHaveBeenCalledWith(123);
    expect(mockBmiStore.loadBmiData).toHaveBeenCalledWith({ limit: 1, userId: 123 });
  });

  it('should open the BMI dialog on viewLogsClick', () => {
    component.onViewLogsClick();
    expect(mockDialogService.open).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        height: '576px',
        width: '1256px',
        data: expect.objectContaining({ userId: 123 }),
      }),
    );
  });

  it('should close the dialog and unsubscribe on destroy', () => {
    const spyUnsubscribe = jest.spyOn(component.subscriptions, 'unsubscribe');
    component.ngOnDestroy();
    expect(spyUnsubscribe).toHaveBeenCalled();
    expect(mockBmiStore.resetStoreToInitialState).toHaveBeenCalled();
  });
});
