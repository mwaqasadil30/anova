export const getAppVersion = () => {
  const uiVersionElement = document.getElementsByName('ui-version')[0];
  const version = uiVersionElement?.getAttribute('content');
  return version;
};
