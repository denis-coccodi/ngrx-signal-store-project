import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableHeaderSelectorComponent } from './table-header-selector.component';
import { TableHeaderSelector } from './table-header-selector.model';

describe('TableHeaderSelectorComponent', () => {
  let component: TableHeaderSelectorComponent<string>;
  let fixture: ComponentFixture<TableHeaderSelectorComponent<string>>;

  const mockData: TableHeaderSelector<string> = {
    title: 'Sort By',
    selected: 'newest',
    onClickFunction: jest.fn(),
    selectors: [
      { id: 'oldest', btnLabel: 'Oldest First' },
      { id: 'newest', btnLabel: 'Newest First' },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TableHeaderSelectorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableHeaderSelectorComponent<string>);
    component = fixture.componentInstance;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title', () => {
    const titleElement = fixture.debugElement.query(By.css('strong'));
    expect(titleElement.nativeElement.textContent).toBe('Sort By');
  });

  it('should display the correct number of buttons', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons.length).toBe(2); // Two buttons based on mockData
  });

  it('should correctly bind button labels from selectors', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    expect(buttons[0].nativeElement.textContent).toContain('Oldest First');
    expect(buttons[1].nativeElement.textContent).toContain('Newest First');
  });

  it('should call onClickFunction and update selected on button click', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    const oldestButton = buttons[0];
    const newestButton = buttons[1];

    // Click the 'Oldest First' button
    oldestButton.nativeElement.dispatchEvent(new Event('mouseup'));
    fixture.detectChanges();

    // Check if the function was called with the correct selector ID
    expect(mockData.onClickFunction).toHaveBeenCalledWith('oldest');
    expect(component.data.selected).toBe('oldest');

    // Click the 'Newest First' button
    newestButton.nativeElement.dispatchEvent(new Event('mouseup'));
    fixture.detectChanges();

    // Check if the function was called with the correct selector ID
    expect(mockData.onClickFunction).toHaveBeenCalledWith('newest');
    expect(component.data.selected).toBe('newest');
  });

  it('should apply the selected CSS class to the active button', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button'));

    // Initially, the 'Newest First' button should be selected
    expect(buttons[1].nativeElement.classList).toContain('selected');

    // Click the 'Oldest First' button
    buttons[0].nativeElement.dispatchEvent(new Event('mouseup'));
    fixture.detectChanges();

    // Now, the 'Oldest First' button should have the selected class
    expect(buttons[0].nativeElement.classList).toContain('selected');
    expect(buttons[1].nativeElement.classList).not.toContain('selected');
  });
});
