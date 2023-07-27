/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ReactComponent as GroupIcon } from 'assets/icons/updated-group-icon.svg';
import CircularProgress from 'components/CircularProgress';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setOpsNavigationItem } from 'redux-app/modules/app/actions';
import { selectOpsNavigationData } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { DomainThemeColor } from 'styles/colours';
import { OpsNavItemType } from 'types';
import { TabPanel } from '../../helpers';
import { useGetAssetGroups } from '../../hooks/useGetAssetGroups';
import {
  StyledListItemIcon,
  StyledListItemText,
  StyledNavMenuItemIcon,
} from '../../styles';

const StyledGroupIcon = styled(GroupIcon)`
  color: ${(props) =>
    props.theme.custom.domainColor === DomainThemeColor.Yellow &&
    props.theme.palette.type === 'light'
      ? '#464646'
      : props.theme.custom.domainColor};
`;

interface AssetGroupTabProps {
  selectedTab: number;
  handleClose: () => void;
  redirectUser: () => void;
}

const AssetGroupTab = ({
  selectedTab,
  handleClose,
  redirectUser,
}: AssetGroupTabProps) => {
  const { t } = useTranslation();

  const opsNavData = useSelector(selectOpsNavigationData);

  const dispatch = useDispatch();

  const assetGroupApi = useGetAssetGroups(selectedTab === 3);
  const assetGroupData = assetGroupApi.data?.assetGroups;

  const { isFetching, isError } = assetGroupApi;

  if (isFetching || isError) {
    return (
      <TabPanel value={selectedTab} index={3}>
        <Box p={2} height={150}>
          <Grid container spacing={2} alignItems="center" justify="center">
            <Grid item>
              {isFetching && <CircularProgress />}

              {isError && (
                <TransitionErrorMessage in={!isFetching && isError} />
              )}
            </Grid>
          </Grid>
        </Box>
      </TabPanel>
    );
  }

  return (
    <TabPanel value={selectedTab} index={3}>
      {!assetGroupData?.length ? (
        <MessageBlock height={125}>
          <Box>
            <StyledNavMenuItemIcon as={StyledGroupIcon} size="large" />
          </Box>
          <LargeBoldDarkText>
            {t('ui.assetnav.noAssetGroupsFound', 'No asset groups found')}
          </LargeBoldDarkText>
        </MessageBlock>
      ) : (
        <List component="nav" aria-label="Asset group items nav">
          {assetGroupData?.map((item, index) => (
            <ListItem
              key={index}
              button
              selected={
                opsNavData?.type === OpsNavItemType.AssetGroup &&
                opsNavData.item.id === item.id
              }
              onClick={() => {
                dispatch(setOpsNavigationItem(item));
                redirectUser();
                handleClose();
              }}
            >
              <StyledListItemIcon>
                <StyledNavMenuItemIcon as={StyledGroupIcon} />
              </StyledListItemIcon>
              <StyledListItemText
                primary={item.name}
                aria-label="Asset group item title"
              />
            </ListItem>
          ))}
        </List>
      )}
    </TabPanel>
  );
};

export default AssetGroupTab;
