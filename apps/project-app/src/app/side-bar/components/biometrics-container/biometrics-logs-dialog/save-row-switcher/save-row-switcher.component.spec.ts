import { Component } from '@angular/core';
import { SaveRowSwitcherComponent } from './save-row-switcher.component';

@Component({
  selector: 'mock-parent',
  standalone: true,
  imports: [SaveRowSwitcherComponent],
  template: `
    <save-row-switcher
      [editButtonType]="editButtonType"
      [editButtonText]="editButtonText"
      [saveButtonDisabled]="saveButtonDisabled"
      (editClick)="onEdit($event)"
      (saveClick)="onSave($event)"
      (cancelClick)="onCancel($event)"
    ></save-row-switcher>
  `,
})
export class MockParentComponent {
  editMode = false;
  editButtonType: 'ICON' | 'SOLID_BUTTON' = 'ICON';
  editButtonText = 'Edit';
  saveButtonDisabled = false;

  onEdit = jest.fn();
  onSave = jest.fn();
  onCancel = jest.fn();
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

describe('SaveRowSwitcherComponent (via MockParentComponent)', () => {
  let fixture: ComponentFixture<MockParentComponent>;
  let parent: MockParentComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockParentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MockParentComponent);
    parent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render edit button when editMode is false', () => {
    parent.editMode = false;
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(By.css('.button[data-button-variant="icon-default"]'));
    expect(editButton).toBeTruthy();
  });

  it('should render save and cancel buttons when editMode is true', () => {
    parent.editMode = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const saveButton = fixture.debugElement.query(By.css('.button[data-button-variant="solid-default"]'));
      const cancelButton = fixture.debugElement.query(By.css('.button[data-button-variant="outline-default"]'));

      expect(saveButton).toBeTruthy();
      expect(cancelButton).toBeTruthy();
      expect(saveButton.nativeElement.textContent.trim()).toBe('Save');
      expect(cancelButton.nativeElement.textContent.trim()).toBe('Cancel');
    });
  });

  it('should call onEdit when edit button is clicked', () => {
    parent.editMode = false;
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(By.css('.button[data-button-variant="icon-default"]'));
    editButton.triggerEventHandler('mouseup', new MouseEvent('mouseup'));

    expect(parent.onEdit).toHaveBeenCalledTimes(1);
  });

  it('should call onSave when save button is clicked', () => {
    parent.editMode = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const saveButton = fixture.debugElement.query(By.css('.button[data-button-variant="solid-default"]'));
      saveButton.triggerEventHandler('mouseup', new MouseEvent('mouseup'));

      expect(parent.onSave).toHaveBeenCalledTimes(1);
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    parent.editMode = true;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const cancelButton = fixture.debugElement.query(By.css('.button[data-button-variant="outline-default"]'));
      cancelButton.triggerEventHandler('mouseup', new MouseEvent('mouseup'));

      expect(parent.onCancel).toHaveBeenCalledTimes(1);
    });
  });

  it('should disable save button when saveButtonDisabled is true', () => {
    parent.editMode = true;
    fixture.detectChanges();

    // Wait for the component to update
    fixture.whenStable().then(() => {
      parent.saveButtonDisabled = true;
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(By.css('.button[data-button-variant="solid-default"]'));
      expect(saveButton).toBeTruthy(); // Ensure the button exists
      expect(saveButton.nativeElement.disabled).toBe(true);
    });
  });

  it('should render edit button with correct variant based on editButtonType', () => {
    parent.editMode = false;
    parent.editButtonType = 'SOLID_BUTTON';
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(By.css('.button[data-button-variant="outline-default"]'));
    expect(editButton).toBeTruthy();
  });
});
