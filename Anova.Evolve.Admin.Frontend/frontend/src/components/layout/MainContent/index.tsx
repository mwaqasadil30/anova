import React from 'react';
import Box from '@material-ui/core/Box';
import { useLocation } from 'react-router';
import opsRoutes from 'apps/ops/routes';

interface Props {
  children: React.ReactNode;
}

const MainContent = ({ children }: Props) => {
  const location = useLocation();

  const isOnAssetMapPage = location.pathname === opsRoutes.assetMap.list;
  const bottomMarginFactor = isOnAssetMapPage ? 0 : 2;

  return (
    <Box mx={3} mb={bottomMarginFactor}>
      {children}
    </Box>
  );
};

export default MainContent;
