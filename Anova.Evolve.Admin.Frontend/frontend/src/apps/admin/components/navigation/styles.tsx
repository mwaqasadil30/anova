/* eslint-disable indent */
import {
  styledPrimaryListItemCss,
  styledSecondaryListItemCss,
} from 'components/navigation/SideNavigation/styles';
import React from 'react';
import styled from 'styled-components';
import LocationIndicator from './LocationIndicator';

export const StyledPrimaryListItem = styled((props: any) => (
  <LocationIndicator isTopLevelItem {...props} />
))`
  ${styledPrimaryListItemCss}
`;

export const StyledSecondaryListItem = styled(LocationIndicator)`
  ${styledSecondaryListItemCss}
`;
