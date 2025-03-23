export enum SnackbarClassType {
	SUCCESS = 'snack-success',
	WARNING = 'snack-warning',
	ERROR = 'snack-error',
}

export interface SnackbarMessage {
	text: string,
	type: SnackbarClassType
	duration?: number,
	actionLabel?: string
}
