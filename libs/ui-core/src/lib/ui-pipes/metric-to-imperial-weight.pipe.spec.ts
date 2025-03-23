import { MetricToImperialWeightPipe } from './metric-to-imperial-weight.pipe';

describe('metricToImperialPipe', () => {
	let pipe: MetricToImperialWeightPipe;

	beforeEach(() => {
		pipe = new MetricToImperialWeightPipe();
	});

	it('should return an empty string when value is undefined', () => {
		expect(pipe.transform(undefined)).toBe('');
	});

	it('should return an empty string when value is null', () => {
		expect(pipe.transform(null as unknown as string)).toBe('');
	});

	it('should correctly convert weight from kilograms to stones and pounds', () => {
		const weightInKg = 70; // 70 kg should be around 11st 0lb
		const result = pipe.transform(weightInKg);
		expect(result).toBe('11st 0lb');
	});

	it('should handle weight conversions with decimal values', () => {
		const weightInKg = 75.5; // 75.5 kg should be around 11st 12lb
		const result = pipe.transform(weightInKg);
		expect(result).toBe('11st 12lb');
	});

	it('should handle conversion with string input for weight', () => {
		const weightInKg = '68'; // Passing weight as string
		const result = pipe.transform(weightInKg);
		expect(result).toBe('10st 10lb');
	});
});
