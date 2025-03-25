import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { BmiStore } from '@bmi-store';
import { BmiApi } from '@types-lib';
import { MetricToImperialHeightPipe, MetricToImperialWeightPipe, OrdinalDatePipe } from '@ui-lib/pipes';

@Component({
  selector: 'biometrics-display',
  standalone: true,
  imports: [CommonModule, OrdinalDatePipe, MetricToImperialHeightPipe, MetricToImperialWeightPipe],
  templateUrl: './biometrics-display.component.html',
  styleUrl: './biometrics-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiometricsDisplayComponent {
  @Input({ required: true }) userId!: number;
  @Input() visitId?: number;
  @Input() showLogsButton = true;
  @Output() viewLogsClick = new EventEmitter<Event>();

  readonly store = inject(BmiStore);

  private readonly latestBmiItemFromStore = this.store.latestBmiItem;
  latestBmiItem = computed(() => (this.latestBmiItemFromStore && this.latestBmiItemFromStore()) || undefined);
  readonly fivePercentStatusDisplayValue = computed(() => {
    const firstLetter = this.store.fivePercentWeightLossStatus()?.charAt(0);
    const restOfStatusName = this.store.fivePercentWeightLossStatus()?.slice(1).toLocaleLowerCase().replace('_', ' ');
    return firstLetter + restOfStatusName;
  });
  readonly fivePercentStatusColorClass = computed(() =>
    this.store.fivePercentWeightLossStatus()?.toLowerCase().replace('_', '-'),
  );

  showBiometrics = computed<boolean>(
    () => !!this.latestBmiItem() && !Object.values(this.latestBmiItem() as BmiApi.UserBMI).every(val => !val),
  );

  onViewLogsClick(e: Event) {
    this.viewLogsClick.emit(e);
  }
}
