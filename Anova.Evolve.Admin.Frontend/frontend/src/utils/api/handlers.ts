import { SubmissionResult } from 'form-utils/types';
import { AxiosError } from 'axios';

interface ErrorResponse {
  validationErrors?: any;
}

export function parseResponseSuccess<T = any>(
  response: T
): SubmissionResult<T> {
  const successResult = { response };
  return successResult;
}

export function parseResponseError<T extends ErrorResponse>(
  error: AxiosError<T>
) {
  // It looks like the generated API file removes the typical axios
  // `error.response.data` payload and directly puts it on `error.response`
  const validationErrors =
    // @ts-ignore
    error.validationErrors ||
    // @ts-ignore
    error.response?.validationErrors ||
    // New APIs seem to not use the `validationErrors` key
    error.response;
  if (validationErrors) {
    return { errors: validationErrors };
  }

  return null;
}
