import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  dateBoundariesValidator,
  dateFormatValidator,
  dateToString,
  isDateWithinBoundaries,
  isSameDate,
  SHORT_DAYS_NAMES,
  stringToDate,
} from '@shared-utils';
import { IconComponent } from './../../lib-icon/icon.component';

@Component({
  selector: 'lib-datepicker',
  standalone: true,
  imports: [CommonModule, IconComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent {
  dateFormControl = input(new FormControl<string>('', [Validators.required]));
  placeholder = input<string>('');
  minDate = input<Date | undefined>();
  maxDate = input<Date | undefined>();
  // uses moment standard strings: https://momentjs.com/docs/#/manipulating/
  dateDisplayFormat = input<string>('DD/MM/YYYY');
  showCalendar = signal(false);
  selectedDate = signal<Date>(new Date());
  selectedDateIndex = computed<number>(() =>
    this.calendarDates().findIndex(date => isSameDate(date, this.selectedDate())),
  );
  middleCalendarDate = computed<Date>(() => this.calendarDates()[Math.floor(this.calendarDates().length / 2)]);
  displayedMonth = computed<string>(() => dateToString(this.middleCalendarDate(), 'MMMM'));
  displayedYear = computed<number>(() => this.middleCalendarDate().getFullYear());
  calendarDates = signal<Date[]>([]);
  days = SHORT_DAYS_NAMES;
  NUMBER_OF_WEEKS_IN_CALENDAR = 6;
  WEEK_LENGTH = 7;
  CALENDAR_LENGTH = this.WEEK_LENGTH * this.NUMBER_OF_WEEKS_IN_CALENDAR;
  @ViewChild('datepicker', { static: false }) datepickerElement?: ElementRef;
  @ViewChildren('calendarDate') calendarDateElements?: QueryList<ElementRef>;

  constructor() {
    // focus first date when opening calendar
    effect(() => {
      if (this.showCalendar()) {
        setTimeout(() => {
          if (this.calendarDateElements?.length) {
            this.focusDate(this.selectedDateIndex() || 0);
          }
        }, 0);
      }
    });
    effect(() => {
      this.dateFormControl().setValidators([
        Validators.required,
        dateFormatValidator(this.dateDisplayFormat()),
        dateBoundariesValidator(this.dateDisplayFormat(), this.minDate(), this.maxDate()),
      ]);

      this.dateFormControl().updateValueAndValidity();
    });
  }

  toggleCalendar(): void {
    if (this.showCalendar() === false) {
      const formControlDate = stringToDate(this.dateFormControl().value || '', this.dateDisplayFormat());
      if (formControlDate && !this.isDisabledDate(formControlDate)) {
        this.selectedDate.update(() => formControlDate);
      }
      this.generateCalendar(this.selectedDate());
    }
    this.showCalendar.update(() => !this.showCalendar());
  }

  selectDate(date: Date): void {
    this.selectedDate.update(() => date);
    this.dateFormControl().markAsDirty();
    this.dateFormControl().setValue(dateToString(date, this.dateDisplayFormat()));
    this.showCalendar.update(() => false);
  }

  prevMonth(): void {
    const newDate = new Date(this.middleCalendarDate().setMonth(this.middleCalendarDate().getMonth() - 1));
    this.generateCalendar(newDate);
  }

  nextMonth(): void {
    const newDate = new Date(this.middleCalendarDate().setMonth(this.middleCalendarDate().getMonth() + 1));
    this.generateCalendar(newDate);
  }

  isSelected(date: Date): boolean {
    return !!this.selectedDate() && isSameDate(date, this.selectedDate());
  }

  isDisabledDate(date: Date) {
    return !isDateWithinBoundaries(date, this.minDate(), this.maxDate());
  }

  closeCalendar(e: Event) {
    e.stopPropagation();
    this.showCalendar.update(() => false);
  }

  private generateCalendar(selectedDate?: Date): void {
    this.calendarDates.update(() => {
      const firstDayOfMonth = selectedDate
        ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        : new Date();

      const firstDayInGrid = new Date(firstDayOfMonth);
      firstDayInGrid.setDate(firstDayInGrid.getDate() - firstDayInGrid.getDay());

      // Generate 6 weeks (42 days) for the calendar grid
      return Array.from({ length: this.CALENDAR_LENGTH }, (_, i) => {
        const date = new Date(firstDayInGrid);
        date.setDate(firstDayInGrid.getDate() + i);
        return date;
      });
    });
  }

  protected focusNextDate(e: Event) {
    e.preventDefault();
    if (!this.calendarDateElements) {
      return;
    }

    const currentDateIndex = this.getFocusedCalendarDateElementIndex();
    const nextIndex = (currentDateIndex + 1) % this.CALENDAR_LENGTH;
    this.focusDate(nextIndex);
  }

  protected focusPreviousDate(e: Event) {
    e.preventDefault();
    if (!this.calendarDateElements) {
      return;
    }

    const currentDateIndex = this.getFocusedCalendarDateElementIndex();
    const previousIndex = (currentDateIndex - 1 + this.CALENDAR_LENGTH) % this.CALENDAR_LENGTH;
    this.focusDate(previousIndex);
  }

  protected focusNextRowDate(e: Event) {
    e.preventDefault();
    if (!this.calendarDateElements) {
      return;
    }

    const nextRowItemIndex = (this.getFocusedCalendarDateElementIndex() + this.WEEK_LENGTH) % this.CALENDAR_LENGTH;
    this.focusDate(nextRowItemIndex);
  }

  protected focusPreviousRowDate(e: Event) {
    e.preventDefault();
    if (!this.calendarDateElements) {
      return;
    }

    const previousRowItemIndex =
      (this.getFocusedCalendarDateElementIndex() - this.WEEK_LENGTH + this.CALENDAR_LENGTH) % this.CALENDAR_LENGTH;
    this.focusDate(previousRowItemIndex);
  }

  private focusDate(index: number) {
    const date = this.calendarDateElements?.get(index);
    date?.nativeElement.focus();
  }

  private getFocusedCalendarDateElementIndex(): number {
    if (!this.calendarDateElements) return -1;

    return this.calendarDateElements.toArray().findIndex(element => element.nativeElement === document.activeElement);
  }

  @HostListener('document:mousedown', ['$event'])
  @HostListener('pointerdown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showCalendar()) {
      const target = event.target as HTMLElement;

      if (this.datepickerElement && !this.datepickerElement.nativeElement.contains(target)) {
        this.showCalendar.update(() => false);
      }
    }
  }
}
