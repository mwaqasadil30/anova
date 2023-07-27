import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { ReactComponent as FolderSVGIcon } from 'assets/icons/colored-folder.svg';

const FolderIcon = (props: any) => {
  const themeContext = useContext(ThemeContext);
  const { domainColor } = themeContext.custom;

  return <FolderSVGIcon color={domainColor} {...props} />;
};

export default FolderIcon;
