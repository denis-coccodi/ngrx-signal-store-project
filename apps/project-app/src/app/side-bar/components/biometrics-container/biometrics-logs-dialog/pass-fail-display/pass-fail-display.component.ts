import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'pass-fail-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pass-fail-display.component.html',
  styleUrl: './pass-fail-display.component.scss',
})
export class PassFailDisplayComponent {
  @Input({ required: true }) isSuccess = true;
}
