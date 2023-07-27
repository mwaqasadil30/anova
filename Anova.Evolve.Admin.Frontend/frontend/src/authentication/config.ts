interface BuildBaseLoginRequestParams {
  scopeUri: string | null | undefined;
  authority: string | null | undefined;
}

export const buildBaseLoginRequest = ({
  scopeUri,
  authority,
}: BuildBaseLoginRequestParams) => {
  const defaultScopes = ['openid'];
  const scopes = scopeUri ? [...defaultScopes, scopeUri] : defaultScopes;

  return {
    scopes,
    ...(authority ? { authority } : {}),
  };
};
