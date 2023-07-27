interface ErrorPayload {
  non_field_errors?: Array<string>;
  detail?: string;
}

export function getFormErrors(errorPayload: ErrorPayload) {
  // Retrieve django-rest-framework's global form errors from the
  // non_field_errors key in the response.
  const globalErrors = [];
  if (errorPayload.non_field_errors) {
    globalErrors.push(errorPayload.non_field_errors);
  }
  if (errorPayload.detail) {
    globalErrors.push(errorPayload.detail);
  }

  let globalFormErrors = {};
  if (globalErrors.length > 0) {
    globalFormErrors = { _error: globalErrors };
  }

  const errors = { ...errorPayload, ...globalFormErrors };
  return errors;
}

export function getErrorKeys(errorPayload: ErrorPayload) {
  // Get the error keys so we can touch the fields to indicate there's an error on it.
  // If we dont check if the field was touched before displaying the error (like in
  // CheckboxField), then the error would always be displayed (even if the user didnt touch the
  // field).
  let errorKeys: Array<string> = [];
  if (errorPayload && typeof errorPayload === 'object') {
    errorKeys = Object.keys(errorPayload);
  }
  return errorKeys;
}
