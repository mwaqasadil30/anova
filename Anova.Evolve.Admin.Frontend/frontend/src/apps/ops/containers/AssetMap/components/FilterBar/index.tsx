import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
  withStyles,
} from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { EventInventoryStatusType } from 'api/admin/api';
import Button from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  boxBorderColor,
  criticalOrEmptyTankColor,
  criticalOrEmptyTankColorDark,
  defaultTextColor,
  fullColor,
  fullColorDark,
  normalTankColor,
  normalTankColorDark,
  reorderTankColor,
  reorderTankColorDark,
} from 'styles/colours';
import { MapFiltersData } from '../../hooks/types';

export const getColorForInventoryStatus = (
  inventoryStatus?: EventInventoryStatusType | null,
  theme?: 'light' | 'dark'
) => {
  if (theme !== 'dark') {
    switch (inventoryStatus) {
      case EventInventoryStatusType.UserDefined:
        return 'transparent'; // Previously `userDefinedTankColor`
      case EventInventoryStatusType.Full:
        return fullColor;
      case EventInventoryStatusType.Reorder:
        return reorderTankColor;
      case EventInventoryStatusType.Critical:
      case EventInventoryStatusType.Empty:
        return criticalOrEmptyTankColor;
      default:
        return normalTankColor;
    }
  }
  switch (inventoryStatus) {
    case EventInventoryStatusType.UserDefined:
      return 'transparent'; // Previously `userDefinedTankColor`
    case EventInventoryStatusType.Full:
      return fullColorDark;
    case EventInventoryStatusType.Reorder:
      return reorderTankColorDark;
    case EventInventoryStatusType.Critical:
    case EventInventoryStatusType.Empty:
      return criticalOrEmptyTankColorDark;
    default:
      return normalTankColorDark;
  }
};

const StyledTabPanel = styled(TabPanel)`
  background: ${(props) => props.theme.palette.background.default};
  padding: 0 24px 6px 24px;
`;

const useFilterTabsStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      color: defaultTextColor,
      boxShadow: 'none',
      paddingTop: theme.spacing(2),
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
    },
  })
);

const FilterTabList = withStyles({
  indicator: {
    backgroundColor: 'transparent',
  },
})(TabList);

interface StyledTabProps {
  value: string;
  label: string;
}
const FilterTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      // TODO: Remove cursor property once other tabs are added
      cursor: 'default',
      boxSizing: 'border-box',
      textTransform: 'none',
      color: theme.palette.text.primary,
      minWidth: 72,
      fontWeight: 600,
      overflow: 'visible',
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      position: 'relative',
      '&:hover': {
        color: theme.palette.text.primary,
        opacity: 1,
      },
      '&$selected': {
        fontWeight: 600,
        color: theme.palette.text.primary,
        backgroundColor: 'transparent',
      },
      '&:focus': {
        color: theme.palette.text.primary,
      },
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

const StyledSelectionButton = styled(({ isActive, color, ...props }) => (
  <Button {...props} />
))`
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: 500;
  min-width: 130px;
`;

const StyledFilterButton = styled(({ isActive, color, ...props }) => (
  <Button {...props} />
))`
  display: inline-block;
  text-align: center;
  min-width: 128px;
  margin-right: 8px;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 0;
  box-sizing: border-box;
  font-weight: ${(props) => (props.isActive ? 500 : 400)};
  border: 1px solid ${boxBorderColor};
  box-shadow: ${(props) =>
    props.theme.palette.type === 'light'
      ? '0px 3px 10px rgba(159, 178, 189, 0.2)'
      : 'none'};
  justify-content: center;
  align-items: center;
  ${(props) =>
    props.isActive
      ? `background: ${props.theme.palette.background.paper};
        color: ${props.theme.palette.action.active};`
      : `background: ${props.theme.palette.action.disabledBackground};
      color: ${props.theme.palette.action.active};`};
  &:hover {
    background: ${(props) => props.theme.palette.action.hover};
  }
  & .filterButtonLabel {
    position: relative;
    & .filterButtonColorIndicator {
      display: inline-block;
      vertical-align: middle;
      width: 12px;
      height: 12px;
      margin-right: 6px;
      background: ${(props) => props.color};
      border-radius: 50%;
    }
    & .filterButtonText {
      vertical-align: middle;
    }
  }
`;

interface Props {
  mapFilters: MapFiltersData;
}

const FilterBar = ({ mapFilters }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState('1');

  const {
    inventoryStates,
    filterButtonActiveMapping,
    inventoryStateCountMapping,
    setFilterButtonActiveMapping,
    selectAllInventoryStates,
    deselectAllInventoryStates,
  } = mapFilters;

  const handleClickInventoryStateButton = (key: string) => {
    const existingValueForKey = filterButtonActiveMapping[key];
    if (existingValueForKey !== undefined) {
      setFilterButtonActiveMapping((prevState) => ({
        ...prevState,
        [key]: !existingValueForKey,
      }));
    }
  };

  const filterBarClasses = useFilterTabsStyles();

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <>
      <TabContext value={tabValue}>
        <AppBar position="static" classes={filterBarClasses}>
          <Grid container justify="space-between">
            <Grid item>
              <FilterTabList onChange={handleTabChange} aria-label="Filters">
                <FilterTab
                  label={t('ui.assetmap.inventoryTabTitle', 'Inventory')}
                  value="1"
                />
                {/* NOTE: These tabs haven't been spec'd out yet */}
                {/* <FilterTab label="Level" value="2" />
                <FilterTab label="Scheduling" value="3" />
                <FilterTab label="Usage Rate" value="4" />
                <FilterTab label="Missing Data" value="5" />
                <FilterTab label="RTU" value="6" /> */}
              </FilterTabList>
            </Grid>
            <Grid item>
              <StyledSelectionButton
                isActive
                color="transparent"
                variant="text"
                onClick={selectAllInventoryStates}
                startIcon={<CheckIcon />}
              >
                {t('ui.main.selectall', 'Select All')}
              </StyledSelectionButton>
              <StyledSelectionButton
                isActive
                color="transparent"
                variant="text"
                onClick={deselectAllInventoryStates}
                startIcon={<CloseIcon />}
              >
                {t('ui.main.deselectall', 'Deselect All')}
              </StyledSelectionButton>
            </Grid>
          </Grid>
        </AppBar>
        <StyledTabPanel value="1" style={{ paddingRight: 0 }}>
          <Box p={1} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
            {inventoryStates?.map((inventoryState) => {
              const key = `${inventoryState.eventInventoryStatus}|${inventoryState.description}`;
              const count = inventoryStateCountMapping[key] || 0;
              const color = getColorForInventoryStatus(
                inventoryState.eventInventoryStatus,
                theme.palette.type
              );
              const isActive = filterButtonActiveMapping[key];

              return (
                <StyledFilterButton
                  color={color}
                  isActive={isActive}
                  onClick={() => handleClickInventoryStateButton(key)}
                >
                  <span className="filterButtonLabel">
                    {/* Only show the color indicator for non-custom events */}
                    {color !== 'transparent' && (
                      <span className="filterButtonColorIndicator" />
                    )}
                    <span className="filterButtonText">
                      {inventoryState.description} ({count})
                    </span>
                  </span>
                </StyledFilterButton>
              );
            })}
          </Box>
        </StyledTabPanel>
        {/* NOTE: These tabs haven't been spec'd out yet */}
        {/* <TabPanel value="2">Level</TabPanel>
        <TabPanel value="3">Scheduling</TabPanel>
        <TabPanel value="4">Usage Rate</TabPanel>
        <TabPanel value="5">Missing Data</TabPanel>
        <TabPanel value="6">RTU</TabPanel> */}
      </TabContext>
    </>
  );
};

export default FilterBar;
