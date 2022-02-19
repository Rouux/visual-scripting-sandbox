// eslint-disable-next-line import/prefer-default-export
export const roundUp = (x: number, threshold = 100) => {
  if (x >= 0) {
    return x % threshold === 0 ? x : x + threshold - (x % threshold);
  }
  return x % threshold === 0 ? x : x - (x % threshold);
};

export enum MouseButton {
  LEFT = 0,
  RIGHT = 2,
  WHEEL = 1
}
