import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
	MAT_SNACK_BAR_DATA,
	MatSnackBarAction,
	MatSnackBarActions,
	MatSnackBarLabel,
	MatSnackBarRef,
} from '@angular/material/snack-bar';

@Component({
	selector: 'snack-annotated-component',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatSnackBarLabel,
		MatSnackBarActions,
		MatSnackBarAction,
	],
	templateUrl: './snack-annotated-component.component.html',
	styleUrl: './snack-annotated-component.component.scss',
})
export class SnackAnnotatedComponentComponent {
	constructor(
		@Inject(MAT_SNACK_BAR_DATA) public data: any,
		public snackBarRef: MatSnackBarRef<SnackAnnotatedComponentComponent>
	) {}
}
