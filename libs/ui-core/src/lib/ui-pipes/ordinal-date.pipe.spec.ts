import { OrdinalDatePipe } from './ordinal-date.pipe';

describe('OrdinalDatePipe', () => {
	let pipe: OrdinalDatePipe;

	beforeEach(() => {
		pipe = new OrdinalDatePipe();
	});

	it('should return an empty string when value is undefined', () => {
		expect(pipe.transform(undefined)).toBe('');
	});

	it('should return an empty string when value is null', () => {
		expect(pipe.transform(null as unknown as string)).toBe('');
	});

	it('should correctly transform a Date object to ordinal date string', () => {
		const date = new Date(2021, 9, 1); // October 1, 2021
		expect(pipe.transform(date)).toBe('1st October 2021');
	});

	it('should correctly transform a string ISO date to ordinal date string', () => {
		const isoDate = '2021-10-01T00:00:00.000Z';
		expect(pipe.transform(isoDate)).toBe('1st October 2021');
	});

	it('should correctly return "th" for dates from 4th to 20th', () => {
		const date = new Date(2021, 9, 4); // October 4, 2021
		expect(pipe.transform(date)).toBe('4th October 2021');
	});

	it('should correctly return the proper ordinal suffix for days', () => {
		expect(pipe.nth(1)).toBe('st');
		expect(pipe.nth(2)).toBe('nd');
		expect(pipe.nth(3)).toBe('rd');
		expect(pipe.nth(4)).toBe('th');
		expect(pipe.nth(11)).toBe('th');
		expect(pipe.nth(22)).toBe('nd');
		expect(pipe.nth(23)).toBe('rd');
		expect(pipe.nth(31)).toBe('st');
	});

	it('should use current date when an invalid string is passed', () => {
		const mockDate = new Date(2021, 9, 1); // Mock current date to 1st October 2021
		jest.spyOn(global, 'Date').mockImplementation(() => mockDate as never);
		expect(pipe.transform('invalid-date')).toBe('1st October 2021');
	});

	it('should return "th" suffix for days between 11 and 13', () => {
		expect(pipe.nth(11)).toBe('th');
		expect(pipe.nth(12)).toBe('th');
		expect(pipe.nth(13)).toBe('th');
	});

	it('should correctly identify ISO date strings', () => {
		expect(pipe.isIsoDate('2021-10-01T00:00:00.000Z')).toBe(true);
		expect(pipe.isIsoDate('2021-10-01')).toBe(false);
		expect(pipe.isIsoDate('invalid-date')).toBe(false);
	});
});
