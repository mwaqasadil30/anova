/* eslint-disable indent */
import React from 'react';
import Box, { BoxProps } from '@material-ui/core/Box';
import PageDivider from 'components/PageDivider';
import { constructionBannerHeight, navbarHeight } from 'styles/theme';
import { useSelector } from 'react-redux';
import { selectIsPageUnderConstruction } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';

const DefaultDivider = <PageDivider dense />;

const StyledBox = styled(({ isWithinDrawer, ...props }) => <Box {...props} />)`
  ${(props) => {
    let backgroundColor = '';
    if (props.isWithinDrawer) {
      backgroundColor =
        props.theme.palette.type === 'light'
          ? props.theme.palette.background.paper
          : props.theme.custom.palette.background.drawerHeader;
    } else {
      backgroundColor = props.theme.palette.background.default;
    }

    return `
      background-color: ${backgroundColor};
    `;
  }}
`;

interface Props extends BoxProps {
  children: React.ReactNode;
  sticky?: boolean;
  topOffset?: number;
  divider?: React.ReactNode;
  verticalPaddingFactor?: number;
  isWithinDrawer?: boolean;
}

const PageIntroWrapper = ({
  children,
  divider = DefaultDivider,
  topOffset = navbarHeight,
  verticalPaddingFactor = 2,
  sticky,
  isWithinDrawer,
  ...props
}: Props) => {
  const showConstructionBanner = useSelector(selectIsPageUnderConstruction);
  const calculatedTopOffset =
    showConstructionBanner && !isWithinDrawer
      ? topOffset + constructionBannerHeight
      : topOffset;

  return (
    <StyledBox
      {...(sticky && {
        position: 'sticky',
        top: calculatedTopOffset,
        zIndex: 1,
        // Ensure the sticky content always appears on top of the content below
        // it. The spacing amount should match the left and right spacing
        // amount of the content this is stickied over (currently the
        // MainContent component and forms within drawers).
        mx: -4,
        px: 4,
      })}
      isWithinDrawer={isWithinDrawer}
      {...props}
    >
      <Box py={isWithinDrawer ? 1 : verticalPaddingFactor}>{children}</Box>
      {sticky && divider}
    </StyledBox>
  );
};

export default PageIntroWrapper;
