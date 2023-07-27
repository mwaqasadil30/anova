import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { ReactComponent as PermissionDeniedLaptopIcon } from 'assets/icons/permission-denied-laptop.svg';

const SearchCloudIcon = () => {
  const themeContext = useContext(ThemeContext);
  const { domainColor } = themeContext.custom;

  return <PermissionDeniedLaptopIcon color={domainColor} />;
};

export default SearchCloudIcon;
