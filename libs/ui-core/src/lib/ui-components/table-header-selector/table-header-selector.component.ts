import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableHeaderSelector } from './table-header-selector.model';

@Component({
	selector: 'lib-table-header-selector',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './table-header-selector.component.html',
	styleUrl: './table-header-selector.component.scss',
})
export class TableHeaderSelectorComponent<T> {
	@Input({ required: true }) data!: TableHeaderSelector<T>;
}
