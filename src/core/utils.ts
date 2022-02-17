export const roundUp = (x: number, threshold = 100) => {
  if (x >= 0) {
    return x % threshold === 0 ? x : x + threshold - (x % threshold);
  }
  return x % threshold === 0 ? x : x - (x % threshold);
};
