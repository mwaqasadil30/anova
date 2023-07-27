export type FormValue = string | number | null | undefined;

export interface SubmissionError {
  errors: any;
  response?: never;
}
export interface SubmissionSuccess<T> {
  response: T;
  errors?: never;
}

export type SubmissionResult<T> = SubmissionSuccess<T> | SubmissionError;
