import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
	selector: 'lib-editable-field',
	standalone: true,
	imports: [CommonModule, FormsModule, ReactiveFormsModule],
	templateUrl: './editable-field.component.html',
	styleUrl: './editable-field.component.scss',
})
export class EditableFieldComponent {
	@Input() displayedValue = '';
	@Input() editMode = false;
	@Input() customStyles: { [key: string]: string } = {};
}
