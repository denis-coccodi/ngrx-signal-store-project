import { TestBed } from '@angular/core/testing';
import {
	MatSnackBar,
	MatSnackBarDismiss,
	MatSnackBarRef
} from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { SnackAnnotatedComponentComponent } from './snack-annotated-component/snack-annotated-component.component';
import { SnackbarClassType } from './snack-notification.model';
import { SnackNotificationsDialogService } from './snack-notifications-dialog.service';

describe('SnackNotificationsDialogService', () => {
  let service: SnackNotificationsDialogService;
  let snackBar: MatSnackBar;
  let mockSnackBarRef: jest.Mocked<MatSnackBarRef<SnackAnnotatedComponentComponent>>;

  beforeEach(() => {
    mockSnackBarRef = {
      afterDismissed: jest.fn().mockReturnValue(new Subject<MatSnackBarDismiss>().asObservable()),
      _dismissedByAction: false,
    } as unknown as jest.Mocked<MatSnackBarRef<SnackAnnotatedComponentComponent>>;

    TestBed.configureTestingModule({
      providers: [
        SnackNotificationsDialogService,
        {
          provide: MatSnackBar,
          useValue: {
            openFromComponent: jest.fn().mockReturnValue(mockSnackBarRef),
          },
        },
      ],
    });

    service = TestBed.inject(SnackNotificationsDialogService);
    snackBar = TestBed.inject(MatSnackBar);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a success message', () => {
    service.openSuccessMessage('Test Success Message', 100);

    expect(snackBar.openFromComponent).toHaveBeenCalledWith(
      SnackAnnotatedComponentComponent,
      expect.objectContaining({
        data: {
          message: 'Test Success Message',
          type: SnackbarClassType.SUCCESS,
          actionLabel: 'Close',
        },
        duration: 100,
        horizontalPosition: 'end',
        panelClass: ['messages-snackbar'],
        verticalPosition: 'bottom',
      })
    );
  });

  it('should queue multiple snackbars and show them sequentially', () => {
    const afterDismissedSubject = new Subject<MatSnackBarDismiss>();
    mockSnackBarRef.afterDismissed.mockReturnValue(afterDismissedSubject.asObservable());

    service.openSuccessMessage('Message 1', 100);
    service.openWarningMessage('Message 2', 100);
    service.openErrorMessage('Message 3', 100);

    // Verify first snackbar is opened
    expect(snackBar.openFromComponent).toHaveBeenCalledTimes(1);
    expect(snackBar.openFromComponent).toHaveBeenCalledWith(
      SnackAnnotatedComponentComponent,
      expect.objectContaining({
        data: { message: 'Message 1', type: SnackbarClassType.SUCCESS, actionLabel: 'Close' },
        duration: 100,
        horizontalPosition: 'end',
        panelClass: ['messages-snackbar'],
        verticalPosition: 'bottom',
      })
    );

    // Simulate dismissing the first snackbar
    afterDismissedSubject.next({ dismissedByAction: false });

    // Verify second snackbar is opened
    expect(snackBar.openFromComponent).toHaveBeenCalledTimes(2);
    expect(snackBar.openFromComponent).toHaveBeenCalledWith(
      SnackAnnotatedComponentComponent,
      expect.objectContaining({
        data: { message: 'Message 2', type: SnackbarClassType.WARNING, actionLabel: 'Close' },
        duration: 100,
        horizontalPosition: 'end',
        panelClass: ['messages-snackbar'],
        verticalPosition: 'bottom',
      })
    );

    // Simulate dismissing the second snackbar
    afterDismissedSubject.next({ dismissedByAction: false });

    // Verify third snackbar is opened
    expect(snackBar.openFromComponent).toHaveBeenCalledTimes(3);
    expect(snackBar.openFromComponent).toHaveBeenCalledWith(
      SnackAnnotatedComponentComponent,
      expect.objectContaining({
        data: { message: 'Message 3', type: SnackbarClassType.ERROR, actionLabel: 'Close' },
        duration: 100,
        horizontalPosition: 'end',
        panelClass: ['messages-snackbar'],
        verticalPosition: 'bottom',
      })
    );
  });

  it('should not open a new snackbar if one is already visible', () => {
    service.openSuccessMessage('Message 1', 100);
    service.openSuccessMessage('Message 2', 100);

    // Only the first snackbar should be opened immediately
    expect(snackBar.openFromComponent).toHaveBeenCalledTimes(1);
    expect(snackBar.openFromComponent).toHaveBeenCalledWith(
      SnackAnnotatedComponentComponent,
      expect.objectContaining({
        data: { message: 'Message 1', type: SnackbarClassType.SUCCESS, actionLabel: 'Close' },
        duration: 100,
        horizontalPosition: 'end',
        panelClass: ['messages-snackbar'],
        verticalPosition: 'bottom',
      })
    );
  });

	it('should clean up subscriptions after all snackbars are dismissed', () => {
		jest.useFakeTimers();

		const afterDismissedSubject = new Subject<MatSnackBarDismiss>();
		mockSnackBarRef.afterDismissed.mockReturnValue(afterDismissedSubject.asObservable());

		service.openSuccessMessage('Message 1');
		service.openSuccessMessage('Message 2');

		// Simulate dismissing the first snackbar
		afterDismissedSubject.next({ dismissedByAction: false });

		// Fast-forward timers to ensure the first dismissal is processed
		jest.runOnlyPendingTimers();

		// Verify subscription is still active after the first snackbar is dismissed
		expect(service['subscriptions'].closed).toBe(false);

		// Simulate dismissing the second snackbar
		afterDismissedSubject.next({ dismissedByAction: false });
		afterDismissedSubject.complete();

		// Fast-forward timers to ensure the second dismissal is processed
		jest.runOnlyPendingTimers();

		// Verify the subscription is cleaned up after all snackbars are dismissed
		expect(service['subscriptions'].closed).toBe(true);

		jest.useRealTimers();
	});
});
