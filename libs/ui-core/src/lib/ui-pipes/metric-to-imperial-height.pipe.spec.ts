import { MetricToImperialHeightPipe } from './metric-to-imperial-height.pipe';

describe('metricToImperialPipe', () => {
	let pipe: MetricToImperialHeightPipe;

	beforeEach(() => {
		pipe = new MetricToImperialHeightPipe();
	});

	it('should return an empty string when value is undefined', () => {
		expect(pipe.transform(undefined)).toBe('');
	});

	it('should return an empty string when value is null', () => {
		expect(pipe.transform(null as unknown as string)).toBe('');
	});

	it('should correctly convert height from centimeters to feet and inches', () => {
		const heightInCm = 180; // 180 cm should be around 5ft 11in
		const result = pipe.transform(heightInCm);
		expect(result).toBe('5ft 11in');
	});

	it('should handle height conversions with decimal values', () => {
		const heightInCm = 175.5; // 175.5 cm should be around 5ft 9in
		const result = pipe.transform(heightInCm);
		expect(result).toBe('5ft 9in');
	});

	it('should handle conversion with string input for height', () => {
		const heightInCm = '170'; // Passing height as string
		const result = pipe.transform(heightInCm);
		expect(result).toBe('5ft 7in');
	});
});
