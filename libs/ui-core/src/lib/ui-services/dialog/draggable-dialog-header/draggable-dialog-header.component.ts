import { DialogRef } from '@angular/cdk/dialog';
import { CdkDragStart, DragDropModule, DragRef } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IconComponent } from '../../../ui-components/lib-icon/icon.component';

@Component({
  selector: 'lib-draggable-dialog-header',
  standalone: true,
  imports: [CommonModule, DragDropModule, IconComponent],
  templateUrl: './draggable-dialog-header.component.html',
  styleUrl: './draggable-dialog-header.component.scss',
})
export class DraggableDialogHeaderComponent {
  private offsetX = 0; // X offset between mouse and dialog left border
  private offsetY = 0; // Y offset between mouse and dialog top border

  constructor(private dialogRef: DialogRef) {}

  /**
   * Capture the offset when the drag starts.
   */
  onDragStarted({ event, source: dragRef }: CdkDragStart): void {
    const elementRect = dragRef.element.nativeElement.getBoundingClientRect();

    const touchOffsetX =
      (event as TouchEvent).targetTouches && (event as TouchEvent).targetTouches[0]?.pageX - elementRect.left;
    const touchOffsetY =
      (event as TouchEvent).targetTouches && (event as TouchEvent).targetTouches[0]?.pageY - elementRect.top;
    const mouseOffsetX = (event as MouseEvent).clientX && (event as MouseEvent).clientX - elementRect.left;
    const mouseOffsetY = (event as MouseEvent).clientY && (event as MouseEvent).clientY - elementRect.top;

    this.offsetX = mouseOffsetX !== undefined ? mouseOffsetX : touchOffsetX;
    this.offsetY = mouseOffsetY !== undefined ? mouseOffsetY : touchOffsetY;
  }

  /**
   * Constrain the dialog's position within the viewport.
   */
  constrainPosition = (point: { x: number; y: number }, _dragRef: DragRef): { x: number; y: number } => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const constrainedX = Math.min(
      Math.max(-this.offsetX, point.x - this.offsetX), // Left boundary
      viewportWidth - this.offsetX - 30, // Right boundary with 30 px buffer space for the scrollbar
    );

    const constrainedY = Math.min(
      Math.max(-this.offsetY, point.y - this.offsetY), // Top boundary
      viewportHeight - this.offsetY, // Bottom boundary
    );

    return { x: constrainedX, y: constrainedY };
  };

  close() {
    this.dialogRef.close();
  }
}
