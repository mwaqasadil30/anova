import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { ReactComponent as SaveCloud } from 'assets/icons/save-cloud.svg';

const SaveCloudIcon = () => {
  const themeContext = useContext(ThemeContext);
  const { domainColor } = themeContext.custom;

  return <SaveCloud color={domainColor} />;
};

export default SaveCloudIcon;
