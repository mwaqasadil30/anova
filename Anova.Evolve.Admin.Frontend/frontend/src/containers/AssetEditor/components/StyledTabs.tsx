/* eslint-disable indent */
import Badge from '@material-ui/core/Badge';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { tabErrorBadgeColor, tabYellow } from '../../../styles/colours';
import DataChannelsTab, {
  utilizedFieldsNamespace as DataChannelsTabUtilizedFieldsNamespace,
} from './DataChannelsTab';
import GeneralTab, {
  utilizedFields as GeneralTabUtilizedFields,
  utilizedFieldsNamespace as GeneralTabUtilizedFieldsNamespace,
} from './GeneralTab';
import HistoryTab, {
  utilizedFields as HistoryTabUtilizedFields,
  utilizedFieldsNamespace as HistoryAssetTabUtilizedFieldsNamespace,
} from './HistoryAssetTab';

export interface StyledBadgeProps {
  colorVariant: 'warning' | 'error';
}

export const getColorVariant = (
  isValid: boolean,
  isDirty: boolean
): StyledBadgeProps['colorVariant'] | null => {
  if (!isValid) {
    return 'error';
  }
  if (isDirty) {
    return 'warning';
  }

  return null;
};

export const StyledBadge = styled(
  ({ colorVariant: _colorVariant, ...props }) => <Badge {...props} />
)`
  & .MuiBadge-badge {
    ${(props: StyledBadgeProps) =>
      ({
        warning: `background-color: ${tabYellow}`,
        error: `background-color: ${tabErrorBadgeColor}`,
      }[props.colorVariant] || '')}
  }
`;

interface StyledTabProps {
  label: ReactNode;
  value: string;
}

export enum TabName {
  General = 'General',
  DataChannels = 'DataChannels',
  History = 'History',
}
export type TabsValidity = Record<
  TabName,
  {
    isValid: boolean;
    isDirty: boolean;
  }
>;
export const defaultTabsValidityState = {
  [TabName.General]: { isValid: true, isDirty: false },
  [TabName.DataChannels]: { isValid: true, isDirty: false },
  [TabName.History]: { isValid: true, isDirty: false },
};
export const tabComponentMap = {
  [TabName.General]: GeneralTab,
  [TabName.DataChannels]: DataChannelsTab,
  [TabName.History]: HistoryTab,
};
export const tabPropsMap = {
  [TabName.General]: GeneralTabUtilizedFields,
  [TabName.DataChannels]: {},
  [TabName.History]: HistoryTabUtilizedFields,
};
export const tabNamespaceMap = {
  [TabName.General]: GeneralTabUtilizedFieldsNamespace,
  [TabName.DataChannels]: DataChannelsTabUtilizedFieldsNamespace,
  [TabName.History]: HistoryAssetTabUtilizedFieldsNamespace,
};

export const StyledTabs = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      marginLeft: -theme.spacing(3),
      marginRight: -theme.spacing(3),
      paddingLeft: theme.spacing(3),
    },
    indicator: {
      backgroundColor: theme.custom.domainColor,
      height: 3,
    },
  })
)(Tabs);

export const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.primary,
      textTransform: 'none',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontSize: 14,
      opacity: 1,
      '&$selected': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    selected: {},
    wrapper: {
      flexDirection: 'row',
    },
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);
