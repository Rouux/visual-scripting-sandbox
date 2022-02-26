export type RequireOnly<T, K extends keyof T> = Required<Pick<T, K>>;
export type RequireButOmit<T, K extends keyof T> = Required<Omit<T, K>>;
export type PartialOnly<T, K extends keyof T> = Partial<Pick<T, K>>;
export type PartialButOmit<T, K extends keyof T> = Partial<Omit<T, K>>;
