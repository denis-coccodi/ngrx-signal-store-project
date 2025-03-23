import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  input,
  model,
  QueryList,
  signal,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { DropdownItem } from './dropdown.model';

@Component({
  selector: 'lib-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent<T> {
  options = input<DropdownItem<T>[]>([]);
  selectedOption = model<DropdownItem<T>>();
  isDropdownOpen = signal(false);

  @ViewChild('dropdown', { static: false }) dropdownElement?: ElementRef;
  @ViewChildren('optionElements') optionElements?: QueryList<ElementRef>;

  toggleDropdown() {
    this.isDropdownOpen.set(!this.isDropdownOpen());
  }

  closeDropdown(e: Event) {
    e.stopPropagation();
    this.isDropdownOpen.update(() => false);
  }

  selectOption(selectedOption: DropdownItem<T>) {
    this.selectedOption.set(selectedOption);
    this.isDropdownOpen.set(false);
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.isDropdownOpen() || !this.optionElements) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.focusNextOption();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusPreviousOption();
    }
  }

  private focusNextOption() {
    if (!this.optionElements) {
      return;
    }
    const focusedIndex = this.getFocusedOptionElementIndex() > -1 ? this.getFocusedOptionElementIndex() : -1;
    const nextIndex = (focusedIndex + 1) % this.optionElements?.length;
    this.focusOption(nextIndex);
  }

  private focusPreviousOption() {
    if (!this.optionElements) {
      return;
    }
    const focusedIndex =
      this.getFocusedOptionElementIndex() > -1 ? this.getFocusedOptionElementIndex() : this.optionElements.length;
    const previousIndex = (focusedIndex - 1 + this.optionElements.length) % this.optionElements.length;
    this.focusOption(previousIndex);
  }

  private getFocusedOptionElementIndex(): number {
    if (!this.optionElements) return -1;

    return this.optionElements.toArray().findIndex(element => element.nativeElement === document.activeElement);
  }

  private focusOption(index: number) {
    const option = this.optionElements?.get(index);
    option?.nativeElement.focus();
    option?.nativeElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  @HostListener('focusout', ['$event'])
  onBlur(event: FocusEvent) {
    const target = event.relatedTarget as HTMLElement;

    if (!this.dropdownElement?.nativeElement.contains(target)) {
      this.isDropdownOpen.set(false);
    }
  }
}
