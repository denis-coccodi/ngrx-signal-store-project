import { DialogRef } from '@angular/cdk/dialog';
import { CdkDrag, CdkDragStart } from '@angular/cdk/drag-drop';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DraggableDialogHeaderComponent } from './draggable-dialog-header.component';

describe('DraggableDialogHeaderComponent', () => {
  let component: DraggableDialogHeaderComponent;
  let fixture: ComponentFixture<DraggableDialogHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DraggableDialogHeaderComponent],
      providers: [{ provide: DialogRef, useValue: { close: jest.fn() } }],
    }).compileComponents();

    fixture = TestBed.createComponent(DraggableDialogHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onDragStarted', () => {
    it('should capture the correct offset for a mouse event', () => {
      const mockCdkDrag = {
        element: {
          nativeElement: {
            getBoundingClientRect: jest.fn().mockReturnValue({ left: 100, top: 200 }),
          },
        },
      } as unknown as CdkDrag<any>;

      const mockEvent = { clientX: 150, clientY: 275 } as MouseEvent;
      const dragStartEvent = { event: mockEvent, source: mockCdkDrag } as CdkDragStart<any>;

      component.onDragStarted(dragStartEvent);

      expect(component['offsetX']).toBe(50);
      expect(component['offsetY']).toBe(75);
    });

    it('should capture the correct offset for a touch event', () => {
      const mockCdkDrag = {
        element: {
          nativeElement: {
            getBoundingClientRect: jest.fn().mockReturnValue({ left: 100, top: 200 }),
          },
        },
      } as unknown as CdkDrag<any>;

      const mockEvent = {
        targetTouches: [{ pageX: 150, pageY: 275 }],
      } as unknown as TouchEvent;
      const dragStartEvent = { event: mockEvent, source: mockCdkDrag } as CdkDragStart<any>;

      component.onDragStarted(dragStartEvent);

      expect(component['offsetX']).toBe(50); // 150 - 100
      expect(component['offsetY']).toBe(75); // 275 - 200
    });
  });
});
