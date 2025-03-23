import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EditableFieldComponent } from './editable-field.component';

describe('EditableFieldComponent', () => {
  let component: EditableFieldComponent;
  let fixture: ComponentFixture<EditableFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditableFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditableFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the static value when editMode is false', () => {
    component.displayedValue = 'Test Value';
    component.editMode = false;
    fixture.detectChanges();

    const staticValueElement = fixture.debugElement.query(By.css('.editable-field-container'));
    expect(staticValueElement.nativeElement.textContent).toContain('Test Value');
  });

  it('should not show the display text when editMode is true', () => {
    component.editMode = true;
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('.displayed-text'));
    expect(div).toBe(null);
  });

  it('should show the display text when editMode is false', () => {
    component.editMode = false;
    component.displayedValue = 'value';
    fixture.detectChanges();

    const div = fixture.debugElement.query(By.css('.displayed-text'));
    expect(div).not.toBe(null);
  });
});
