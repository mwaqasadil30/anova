/* eslint-disable indent */
import { SecondaryListItemText } from 'components/navigation/SideNavigation/styles';
import ThemedTooltip from 'components/ThemedTooltip';
import React from 'react';
import { Link } from 'react-router-dom';
import { StyledSecondaryListItem } from '../styles';

interface Props {
  showTooltip?: boolean;
  primaryText: string;
  linkTo?: any;
  IconComponent: React.FunctionComponent;
}

const SecondaryNavItem = ({
  showTooltip,
  primaryText,
  linkTo,
  IconComponent,
}: Props) => {
  const linkProps = !linkTo
    ? {}
    : {
        component: Link,
        to: linkTo,
      };

  return (
    <ThemedTooltip
      // @ts-ignore
      title={showTooltip ? primaryText : ''}
      placement="right"
      enterDelay={0}
    >
      <div>
        <StyledSecondaryListItem
          button
          // @ts-ignore
          {...linkProps}
          IconComponent={IconComponent}
          TextComponent={SecondaryListItemText}
          primaryText={primaryText}
        />
      </div>
    </ThemedTooltip>
  );
};

export default SecondaryNavItem;
