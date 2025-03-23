import { Pipe, PipeTransform } from '@angular/core';
import { convertMetricToImperialWeightStr } from '@shared-utils';

@Pipe({
	name: 'metricToImperialWeight',
	standalone: true,
})
export class MetricToImperialWeightPipe implements PipeTransform {
	transform(
		value?: string | number
	): string {
		if (!value) {
			return '';
		}
		const valueAsNumber = +value;

		return convertMetricToImperialWeightStr(valueAsNumber);
	}
}
