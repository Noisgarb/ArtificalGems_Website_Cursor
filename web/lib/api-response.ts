export type ApiResponse<T = unknown> = {
  code: number;
  message: string;
  data?: T;
};

export function ok<T>(data: T, message = "ok"): ApiResponse<T> {
  return { code: 0, message, data };
}

export function err(code: number, message: string): ApiResponse<never> {
  return { code, message };
}

export const ErrorCodes = {
  VALIDATION: 40001,
  UNAUTHORIZED: 40101,
  FORBIDDEN: 40301,
  NOT_FOUND: 40401,
  INTERNAL: 50001,
} as const;
