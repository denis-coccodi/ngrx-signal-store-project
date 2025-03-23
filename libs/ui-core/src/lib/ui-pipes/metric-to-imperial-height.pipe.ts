import { Pipe, PipeTransform } from '@angular/core';
import { convertMetricToImperialHeightStr } from '@shared-utils';

@Pipe({
	name: 'metricToImperialHeight',
	standalone: true,
})
export class MetricToImperialHeightPipe implements PipeTransform {
	transform(
		value?: string | number
	): string {
		if (!value) {
			return '';
		}
		const valueAsNumber = +value;

		return convertMetricToImperialHeightStr(valueAsNumber);
	}
}
