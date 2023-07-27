export const getSessionId = () => localStorage.getItem('authToken');
export const setSessionId = (sessionId: string) =>
  localStorage.setItem('authToken', sessionId);
