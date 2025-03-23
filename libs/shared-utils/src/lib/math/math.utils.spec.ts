import { calculatePercentageDifference } from './math.utils';

describe('calculatePercentageDifference', () => {
  test('should return correct percentage increase', () => {
    expect(calculatePercentageDifference(100, 150)).toBe(50);
    expect(calculatePercentageDifference(50, 100)).toBe(100);
  });

  test('should return correct percentage decrease', () => {
    expect(calculatePercentageDifference(200, 100)).toBe(-50);
    expect(calculatePercentageDifference(100, 50)).toBe(-50);
  });

  test('should return 0 when the numbers are the same', () => {
    expect(calculatePercentageDifference(100, 100)).toBe(0);
  });

  test('should throw an error if the original number is 0', () => {
    expect(() => calculatePercentageDifference(0, 100)).toThrow('Original number cannot be zero.');
  });
});
