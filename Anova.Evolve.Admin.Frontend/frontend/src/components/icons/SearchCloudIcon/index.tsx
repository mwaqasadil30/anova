import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { ReactComponent as SearchCloud } from 'assets/icons/search-cloud.svg';

const SearchCloudIcon = (props: React.ComponentPropsWithoutRef<'svg'>) => {
  const themeContext = useContext(ThemeContext);
  const { domainColor } = themeContext.custom;

  return <SearchCloud color={domainColor} {...props} />;
};

export default SearchCloudIcon;
