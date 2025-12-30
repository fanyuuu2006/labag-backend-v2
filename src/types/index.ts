export type MyResponse<T> = {
  data: T;
  message?: string;
};

export type SignOptions = 'google';