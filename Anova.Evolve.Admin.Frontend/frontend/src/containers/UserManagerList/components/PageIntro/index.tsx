import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  CreateB2cUserResponse,
  IdentityProviderResponse,
  UserPermissionType,
} from 'api/admin/api';
import routes, { UserId } from 'apps/admin/routes';
import DownloadDialog from 'apps/ops/components/DownloadDialog';
import { ReactComponent as CaretIcon } from 'assets/icons/caret.svg';
import Button from 'components/Button';
import DownloadButton from 'components/DownloadButton';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import Menu from 'components/Menu';
import PageHeader from 'components/PageHeader';
import RefreshButton from 'components/RefreshButton';
import AddUserDrawer from 'containers/UserEditorBase/components/AddUserDrawer';
import React, { useEffect, useRef, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType, AuthProviderClassificiation, GeoCsvFormat } from 'types';
import {
  formatCsvSeparator,
  formatTableDataForCsv,
  getExportFilenameWithDatetime,
  TableDataForDownload,
} from 'utils/format/dataExport';
import { useGetAuthenticationProviderForDomain } from '../../hooks/useGetAuthenticationProviderForDomain';

const StyledMenuItem = styled(MenuItem)`
  flex-direction: column;
  align-items: flex-start;
`;
const ProviderDescription = styled(Typography)`
  font-size: 14px;
  line-height: 24px;
`;
const ProviderDetails = styled(Typography)`
  font-style: italic;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  line-height: 16px;

  color: ${(props) => props.theme.palette.text.secondary};
`;

const CaretDownIcon = styled(CaretIcon)``;
const CaretUpIcon = styled(CaretIcon)`
  transform: rotate(180deg);
`;

interface Props {
  tableStateForDownload: TableDataForDownload<any> | null;
  refetchRecords: () => void;
  assetTitle?: string | null;
}

const PageIntro = ({ tableStateForDownload, refetchRecords }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const history = useHistory();

  const hasPermission = useSelector(selectHasPermission);
  const canAddUser = hasPermission(
    UserPermissionType.UserGeneral,
    AccessType.Create
  );

  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const getAuthenticationProviderForDomainApi = useGetAuthenticationProviderForDomain();

  const csvLinkRef = useRef<HTMLAnchorElement | null>(null);
  const [csvData, setCsvData] = useState<any>();

  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<
    GeoCsvFormat | null | undefined
  >(null);

  const downloadData = () => {
    setCsvData(undefined);
    const formattedCsvData = formatTableDataForCsv(
      tableStateForDownload,
      downloadFormat
    );
    setCsvData(formattedCsvData);
  };

  const openDownloadDialog = () => {
    setIsDownloadDialogOpen(true);
  };
  const closeDownloadDialog = () => {
    setIsDownloadDialogOpen(false);
    setIsDownloading(false);
  };

  useUpdateEffect(() => {
    if (!isDownloading) {
      setDownloadFormat(null);
    }
  }, [isDownloadDialogOpen]);

  useUpdateEffect(() => {
    if (downloadFormat) {
      downloadData();
    }
  }, [downloadFormat]);

  const identityProviders =
    getAuthenticationProviderForDomainApi.data?.identityProviderResponses || [];
  const hasMultipleIdentityProviders = identityProviders.length > 1;

  const [
    selectedIdentityProvider,
    setSelectedIdentityProvider,
  ] = useState<IdentityProviderResponse | null>(null);
  const [isAddUserDrawerOpen, setIsAddUserDrawerOpen] = useState(false);
  const [
    addUserMenuAnchorEl,
    setAddUserMenuAnchorEl,
  ] = useState<null | HTMLElement>(null);

  const closeAddUserDrawer = () => {
    setIsAddUserDrawerOpen(false);
  };

  const openAddUserDrawer = (event?: React.MouseEvent) => {
    event?.stopPropagation();
    setIsAddUserDrawerOpen(true);
  };
  const openAddUserDrawerWithIdentityProvider = (
    provider: IdentityProviderResponse
  ) => {
    setSelectedIdentityProvider(provider);
    openAddUserDrawer();
  };

  const saveAndExitCallback = (response: CreateB2cUserResponse) => {
    closeAddUserDrawer();

    if (response.id) {
      const userEditorPathname = generatePath(routes.userManager.edit, {
        [UserId]: response.id,
      });
      history.push(userEditorPathname);
    }
  };

  // Only single sign on authentication providers will have a drawer to enter
  // initial user details. Creating non-single sign on users goes through the
  // old user editor.
  const selectProvider = (provider: IdentityProviderResponse) => {
    if (provider.classification === AuthProviderClassificiation.SingleSignOn) {
      openAddUserDrawerWithIdentityProvider(provider);
    } else if (provider.classification === AuthProviderClassificiation.DOLV3) {
      history.push(routes.userManager.create);
    }
  };

  const handleClickAddUserButton = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (hasMultipleIdentityProviders) {
      setAddUserMenuAnchorEl(event.currentTarget);
    } else if (identityProviders.length) {
      const identityProvider = identityProviders[0];
      selectProvider(identityProvider);
    }
  };

  const closeAddUserMenu = () => {
    setAddUserMenuAnchorEl(null);
  };

  const handleSelectIdentityProvider = (
    provider: IdentityProviderResponse
  ) => () => {
    closeAddUserMenu();
    selectProvider(provider);
  };
  const isDownloadButtonDisabled =
    !tableStateForDownload || tableStateForDownload?.rows?.length < 1;
  const downloadButton = (
    <DownloadButton
      disabled={isDownloadButtonDisabled}
      onClick={openDownloadDialog}
    />
  );
  const filenamePrefix = t('exportFilenames.users.userList', 'user-list-');
  const csvExportFilename = getExportFilenameWithDatetime(filenamePrefix);

  // Trigger the download of the CSV file when csvData changes
  useEffect(() => {
    // @ts-ignore
    if (csvLinkRef.current?.link && csvData) {
      // On Safari, the file gets downloaded before the CSV data can be set.
      // Adding a timeout seems to get around the issue.
      setTimeout(() => {
        closeDownloadDialog();
        // @ts-ignore
        csvLinkRef.current.link.click();
      });
    }
  }, [csvData]);

  return (
    <>
      <Drawer
        anchor="right"
        open={isAddUserDrawerOpen}
        onClose={closeAddUserDrawer}
        variant="temporary"
      >
        <DrawerContent>
          {selectedIdentityProvider && (
            <AddUserDrawer
              identityProvider={selectedIdentityProvider}
              cancelCallback={closeAddUserDrawer}
              saveAndExitCallback={saveAndExitCallback}
            />
          )}
        </DrawerContent>
      </Drawer>

      <CSVLink
        // @ts-ignore
        ref={csvLinkRef}
        separator={formatCsvSeparator(downloadFormat)}
        data={csvData || []}
        filename={csvExportFilename}
        style={{ display: 'none' }}
      />
      <DownloadDialog
        open={isDownloadDialogOpen}
        handleClose={closeDownloadDialog}
        setDownloadFormat={setDownloadFormat}
        downloadData={downloadData}
        isDownloading={isDownloading}
        setIsDownloading={setIsDownloading}
      />

      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item xs={12} md="auto">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PageHeader dense>
                {t('ui.userList.pageHeader', 'User Administration')}
              </PageHeader>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md="auto">
          <Box
            clone
            justifyContent={['space-between', 'space-between', 'flex-end']}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                <RefreshButton onClick={refetchRecords} fullWidth />
              </Grid>
              <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                {downloadButton}
              </Grid>
              {canAddUser && (
                <Grid item {...(isBelowSmBreakpoint && { xs: true })}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleClickAddUserButton}
                    disabled={getAuthenticationProviderForDomainApi.isFetching}
                    endIcon={
                      !hasMultipleIdentityProviders ? undefined : addUserMenuAnchorEl ? (
                        <CaretUpIcon />
                      ) : (
                        <CaretDownIcon />
                      )
                    }
                    aria-controls="add-user-menu"
                    aria-haspopup="true"
                  >
                    {t('ui.userList.addUser', 'Add User')}
                  </Button>
                  <Menu
                    id="add-user-menu"
                    anchorEl={addUserMenuAnchorEl}
                    keepMounted
                    open={Boolean(addUserMenuAnchorEl)}
                    getContentAnchorEl={null}
                    onClose={closeAddUserMenu}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    {identityProviders.map((provider) => {
                      return (
                        <StyledMenuItem
                          key={provider.description!}
                          onClick={handleSelectIdentityProvider(provider)}
                        >
                          <ProviderDescription>
                            {provider.description}
                          </ProviderDescription>

                          {provider.classification ===
                            AuthProviderClassificiation.SingleSignOn && (
                            <ProviderDetails>
                              {t(
                                'ui.authentication.singleSignOnProviderDetails',
                                'Create a Single Sign-On user account for {{providerName}}',
                                { providerName: provider.description }
                              )}
                            </ProviderDetails>
                          )}

                          {provider.classification ===
                            AuthProviderClassificiation.DOLV3 && (
                            <ProviderDetails>
                              {t(
                                'ui.authentication.dolv3ProviderDetails',
                                'Create a basic user account for DOLV3'
                              )}
                            </ProviderDetails>
                          )}
                        </StyledMenuItem>
                      );
                    })}
                  </Menu>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default PageIntro;
