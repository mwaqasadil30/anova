export function createSuccessAction(actionType: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (response: any) => ({
    type: actionType,
    receivedAt: Date.now(),
    payload: response,
  });
}

export function createFailureAction(actionType: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (error: any) => ({
    type: actionType,
    payload: error,
  });
}
