import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  name = input.required();
  customStyles = input<{ [key: string]: string }>({});
  pathData: string | null = null;
  path = computed<string>(() => `assets/icons/${this.name()}.svg#${this.name()}`);
}
