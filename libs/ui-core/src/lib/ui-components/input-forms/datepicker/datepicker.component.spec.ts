import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { dateToString } from '@shared-utils';
import { DatepickerComponent } from './datepicker.component';

describe('DatepickerComponent', () => {
  let component: DatepickerComponent;
  let fixture: ComponentFixture<DatepickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, DatepickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle calendar visibility', () => {
    expect(component.showCalendar()).toBe(false);
    component.toggleCalendar();
    expect(component.showCalendar()).toBe(true);
    component.toggleCalendar();
    expect(component.showCalendar()).toBe(false);
  });

  it('should set selected date and update form control on date selection', () => {
    const testDate = new Date(2024, 0, 15);
    component.selectDate(testDate);
    expect(component.selectedDate()).toEqual(testDate);
    expect(component.dateFormControl().value).toBe(dateToString(testDate, 'DD/MM/YYYY'));
  });

  it('should generate previous month calendar', () => {
    component['generateCalendar'](new Date('2025-02-05'));
    const initialMonth = component.displayedMonth();
    component.prevMonth();
    fixture.detectChanges();
    expect(component.displayedMonth()).not.toBe(initialMonth);
  });

  it('should generate next month calendar', () => {
    component['generateCalendar'](new Date('2025-02-05'));
    const initialMonth = component.displayedMonth();
    component.nextMonth();
    fixture.detectChanges();
    expect(component.displayedMonth()).not.toBe(initialMonth);
  });

  it('should correctly determine if a date is selected', () => {
    const testDate = new Date();
    component.selectedDate.update(() => testDate);
    expect(component.isSelected(testDate)).toBe(true);
  });

  it('should correctly determine if a date is disabled', () => {
    jest.spyOn(component, 'minDate').mockReturnValue(new Date(2024, 0, 10));
    jest.spyOn(component, 'maxDate').mockReturnValue(new Date(2024, 0, 20));
    expect(component.isDisabledDate(new Date(2024, 0, 5))).toBe(true);
    expect(component.isDisabledDate(new Date(2024, 0, 15))).toBe(false);
    expect(component.isDisabledDate(new Date(2024, 0, 25))).toBe(true);
  });
});
