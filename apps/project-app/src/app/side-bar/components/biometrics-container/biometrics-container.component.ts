import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { BmiStore } from '@bmi-store';
import { Bmi } from '@types-lib';
import { DefaultDialogService } from '@ui-lib/services';
import { Subject, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { BiometricsDisplayComponent } from './biometrics-display/biometrics-display.component';
import { BMIDialogComponent } from './biometrics-logs-dialog/biometrics-logs-dialog.component';

@Component({
  selector: 'biometrics-container',
  standalone: true,
  imports: [CommonModule, BiometricsDisplayComponent],
  templateUrl: './biometrics-container.component.html',
  styleUrl: './biometrics-container.component.scss',
})
export class BiometricsContainerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) userId!: number;
  @Input() visitId?: number;
  @Input() showLogsButton = true;
  @Output() viewLogsClick = new EventEmitter<MouseEvent>();

  private openBMIDialog$$ = new Subject<void>();
  private bmiDialogRef?: DialogRef<BMIDialogComponent, BMIDialogComponent>;
  readonly store = inject(BmiStore);
  subscriptions = new Subscription();

  constructor(private dialog: DefaultDialogService) {}

  ngOnInit(): void {
    this.store.setPatientUserId(this.userId);
    this.store.loadBmiData({ userId: this.userId, limit: 1 });

    this.subscriptions.add(
      this.openBMIDialog$$
        .pipe(
          filter(() => !this.dialog.hasOpenDialogsOfType(BMIDialogComponent)),
          tap(() => this.store.loadBmiData({ userId: this.userId })),
        )
        .subscribe(() => {
          this.bmiDialogRef = this.dialog.open<BMIDialogComponent, Bmi.BMIDialogData>(BMIDialogComponent, {
            height: '576px',
            width: '1256px',
            data: {
              userId: this.userId,
              visitId: this.visitId,
            },
          });
        }),
    );
  }

  onViewLogsClick() {
    this.openBMIDialog$$.next();
  }

  ngOnDestroy(): void {
    this.bmiDialogRef?.close();
    this.subscriptions.unsubscribe();
    this.store.resetStoreToInitialState();
  }
}
