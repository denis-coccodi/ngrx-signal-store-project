import { TestBed } from '@angular/core/testing';
import { IconComponent } from './icon.component';

describe('IconComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponent], // Import standalone component
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(IconComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });

  it('should set default size and compute correct viewBox', () => {
    const fixture = TestBed.createComponent(IconComponent);
    const component = fixture.componentInstance;
    jest.spyOn(component, 'name').mockReturnValue('test-icon');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const svgElement = fixture.nativeElement.querySelector('svg');
      expect(svgElement).not.toBeNull();
      expect(svgElement.getAttribute('viewBox')).toBe('0 0 20 20');
    });
  });

  it('should compute correct href for use tag', () => {
    const fixture = TestBed.createComponent(IconComponent);
    const component = fixture.componentInstance;
    jest.spyOn(component, 'name').mockReturnValue('test-icon');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const useElement = fixture.nativeElement.querySelector('use');
      expect(useElement).not.toBeNull();
      expect(useElement.getAttribute('href')).toBe('assets/icons/test-icon.svg#test-icon');
    });
  });
});
