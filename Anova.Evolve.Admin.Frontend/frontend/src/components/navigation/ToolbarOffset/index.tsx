import React from 'react';
import { useSelector } from 'react-redux';
import { selectShowOpsNavBar } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { navbarHeight, opsNavbarHeight } from 'styles/theme';

const Spacing = styled(({ showOpsNav, ...props }) => <div {...props} />)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-height: ${(props) =>
    props.showOpsNav ? navbarHeight + opsNavbarHeight - 1 : navbarHeight}px;
  padding: ${(props) => props.theme.spacing(0, 1)};
`;

const ToolbarSpacing = (props: any) => {
  const showOpsNav = useSelector(selectShowOpsNavBar);

  return <Spacing {...props} showOpsNav={showOpsNav} />;
};

export default ToolbarSpacing;
