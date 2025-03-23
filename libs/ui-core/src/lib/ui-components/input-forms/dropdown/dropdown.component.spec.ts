import { CommonModule } from '@angular/common';
import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent } from './dropdown.component';
import { DropdownItem } from './dropdown.model';

describe('DropdownComponent', () => {
  let component: DropdownComponent<string>;
  let fixture: ComponentFixture<DropdownComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, DropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown on click', () => {
    expect(component.isDropdownOpen()).toBe(false);

    component.toggleDropdown();
    expect(component.isDropdownOpen()).toBe(true);

    component.toggleDropdown();
    expect(component.isDropdownOpen()).toBe(false);
  });

  it('should set selected option and close dropdown', () => {
    const options: DropdownItem<string>[] = [
      { value: '1', description: 'Option 1' },
      { value: '2', description: 'Option 2' },
    ];
    jest.spyOn(component, 'options').mockReturnValue(options);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      component.selectOption(options[1]); // Select "Option 2"
      expect(component.selectedOption()).toEqual(options[1]);
      expect(component.isDropdownOpen()).toBe(false); // Should close after selection
    });
  });

  it('should close dropdown on blur when clicking outside', () => {
    component.isDropdownOpen.set(true);
    expect(component.isDropdownOpen()).toBe(true);

    const mockElementRef = {
      nativeElement: {
        contains: jest.fn().mockReturnValue(false), // Simulating a click outside
      },
    } as unknown as ElementRef;

    component.dropdownElement = mockElementRef;

    component.onBlur(new FocusEvent('focusout', { relatedTarget: document.body }));

    expect(component.isDropdownOpen()).toBe(false);
  });

  it('should not close dropdown on blur when clicking inside', () => {
    component.isDropdownOpen.set(true);
    expect(component.isDropdownOpen()).toBe(true);

    const mockElementRef = {
      nativeElement: {
        contains: jest.fn().mockReturnValue(true), // Simulating a click inside
      },
    } as unknown as ElementRef;

    component.dropdownElement = mockElementRef;

    component.onBlur(new FocusEvent('focusout', { relatedTarget: document.createElement('div') }));

    expect(component.isDropdownOpen()).toBe(true); // Should remain open
  });
});
