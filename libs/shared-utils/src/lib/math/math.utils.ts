export const calculatePercentageDifference = (original: number, newNumber: number): number => {
  if (original === 0) {
    throw new Error('Original number cannot be zero.');
  }
  return ((newNumber - original) / original) * 100;
}
