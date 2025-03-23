import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input } from '@angular/core';

@Component({
	selector: 'save-row-switcher',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './save-row-switcher.component.html',
	styleUrl: './save-row-switcher.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveRowSwitcherComponent {
	editMode = input<boolean>(false);
	@Input() editButtonType: 'ICON' | 'SOLID_BUTTON' = 'ICON';
	@Input() editButtonText = '';
	@Input() saveButtonDisabled = false;
	@Output() editClick = new EventEmitter<MouseEvent | Event>();
	@Output() saveClick = new EventEmitter<MouseEvent | Event>();
	@Output() cancelClick = new EventEmitter<MouseEvent | Event>();

	onEditClick(e: MouseEvent | Event) {
		this.editClick.emit(e);
	}

	onSaveClick(e: MouseEvent | Event) {
		this.saveClick.emit(e);
	}

	onCancelClick(e: MouseEvent | Event) {
		this.cancelClick.emit(e);
	}
}
