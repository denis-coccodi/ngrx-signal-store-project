import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-dialog-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog-content.component.html',
  styleUrl: './dialog-content.component.scss',
})
export class DialogContentComponent {}
