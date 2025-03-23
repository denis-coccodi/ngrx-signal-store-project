import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TextFieldComponent } from './text-field.component';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TextFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should show input field', () => {
    jest.spyOn(component, 'formCtrl').mockReturnValue(new FormControl('Value'));
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.value).toBe('Value');
  });

  it('should bind the form control value to the input field', () => {
    const formCtrl = new FormControl('Initial Value');
    jest.spyOn(component, 'formCtrl').mockReturnValue(formCtrl);
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.value).toBe('Initial Value');

    // Update form control value and check if input updates
    formCtrl.setValue('Updated Value');
    fixture.detectChanges();
    expect(inputElement.nativeElement.value).toBe('Updated Value');
  });

  it('should update form control when input changes', () => {
    jest.spyOn(component, 'formCtrl').mockReturnValue(new FormControl(''));
    fixture.detectChanges();

    const inputElement = fixture.debugElement.query(By.css('input'));
    inputElement.nativeElement.value = 'New Input Value';
    inputElement.nativeElement.dispatchEvent(new Event('input'));

    expect(component.formCtrl().value).toBe('New Input Value');
  });
});
