import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'ordinalDate',
	standalone: true,
})
export class OrdinalDatePipe implements PipeTransform {
	transform(value?: string | Date): string {
		if (!value) {
			return '';
		}
		const dateValue: Date =
			value instanceof Date
				? value
				: this.isIsoDate(value)
				? new Date(value)
				: new Date();

		const months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December',
		];
		return `${dateValue.getDate()}${this.nth(dateValue.getDate())} ${
			months[dateValue.getMonth()]
		} ${dateValue.getFullYear()}`;
	}

	isIsoDate = (isoStr: string) => {
		return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.(\d+)Z/.test(isoStr);
	};

	nth(day: number) {
		if (day > 3 && day < 21) return 'th';
		switch (day % 10) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	}
}
