export type MyResponse<T = any> = {
  data: T;
  message?: string;
};