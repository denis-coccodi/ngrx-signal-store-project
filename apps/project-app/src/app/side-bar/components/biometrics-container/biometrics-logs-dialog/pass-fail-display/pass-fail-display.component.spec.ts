import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PassFailDisplayComponent } from './pass-fail-display.component';

describe('PassFailDisplayComponent', () => {
    let component: PassFailDisplayComponent;
    let fixture: ComponentFixture<PassFailDisplayComponent>;
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PassFailDisplayComponent],
        providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }]
      }).compileComponents();
  
      fixture = TestBed.createComponent(PassFailDisplayComponent);
      component = fixture.componentInstance;
    });
  
    it('should apply "pass" class when isSuccess is true', () => {
      component.isSuccess = true;
      fixture.detectChanges();
      const container = fixture.debugElement.query(By.css('.pass-fail-container'));
      expect(container.classes['pass']).toBe(true);
      expect(container.classes['fail']).toBeFalsy();
    });
  
    it('should apply "fail" class when isSuccess is false', () => {
      component.isSuccess = false;
      fixture.detectChanges();
      const container = fixture.debugElement.query(By.css('.pass-fail-container'));
      expect(container.classes['fail']).toBe(true);
      expect(container.classes['pass']).toBeFalsy();
    });
  });
