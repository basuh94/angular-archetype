export type ApiErrorType = 'network' | 'client' | 'server' | 'unknown';

export interface ApiError {
  type: ApiErrorType;
  status: number;
  code: string;
  message: string;
  url: string | null;
}

export function isApiError(error: unknown): error is ApiError {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const candidate = error as Partial<ApiError>;
  return (
    typeof candidate.type === 'string' &&
    typeof candidate.status === 'number' &&
    typeof candidate.code === 'string' &&
    typeof candidate.message === 'string'
  );
}
