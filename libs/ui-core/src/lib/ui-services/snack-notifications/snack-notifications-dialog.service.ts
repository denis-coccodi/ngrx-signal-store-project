import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { SnackAnnotatedComponentComponent } from './snack-annotated-component/snack-annotated-component.component';
import { SnackbarClassType, SnackbarMessage } from './snack-notification.model';

export { SnackbarClassType, SnackbarMessage } from './snack-notification.model';

@Injectable({
	providedIn: 'root',
})
export class SnackNotificationsDialogService {
	private snackbarQueue: MatSnackBarConfig[] = [];
	private currentSnackRef?: MatSnackBarRef<SnackAnnotatedComponentComponent>;
	private subscriptions = new Subscription();
	private DEFAULT_DURATION = 5000;
	private DEFAULT_ACTION_LABEL = 'Close';

	constructor(private snackBar: MatSnackBar) {}

	openSuccessMessage(message: string, duration?: number, actionLabel?: string) {
		this.openSnackBar(
			message,
			SnackbarClassType.SUCCESS,
			duration,
			actionLabel
		);
	}

	openWarningMessage(message: string, duration?: number, actionLabel?: string) {
		this.openSnackBar(
			message,
			SnackbarClassType.WARNING,
			duration,
			actionLabel
		);
	}

	openErrorMessage(message: string, duration?: number, actionLabel?: string) {
		this.openSnackBar(message, SnackbarClassType.ERROR, duration, actionLabel);
	}

	addMessagesToQueue(messages: SnackbarMessage[]) {
		messages.forEach((message) =>
			this.openSnackBar(
				message.text,
				message.type,
				message.duration,
				message.actionLabel
			)
		);
	}

	openSnackBar(
		message: string,
		type: SnackbarClassType,
		duration = this.DEFAULT_DURATION,
		actionLabel = this.DEFAULT_ACTION_LABEL
	) {
		const config: MatSnackBarConfig = {
			duration,
			data: { message, type, actionLabel },
			horizontalPosition: 'end',
			verticalPosition: 'bottom',
			panelClass: [`messages-snackbar`],
		};

		this.snackbarQueue.push(config);
		if (!this.currentSnackRef) {
			this.subscriptions = new Subscription();
			this.showNextSnackbar();
		}
	}

	private showNextSnackbar() {
		if (this.snackbarQueue.length === 0) {
			this.subscriptions.unsubscribe();
			return;
		}

		const nextConfig = this.snackbarQueue.shift();
		if (!nextConfig) {
			return;
		}

		this.currentSnackRef = this.snackBar.openFromComponent(
			SnackAnnotatedComponentComponent,
			nextConfig
		);

		this.subscriptions.add(
			this.currentSnackRef.afterDismissed().subscribe(() => {
				this.currentSnackRef = undefined;
				this.showNextSnackbar();
			})
		);
	}
}
