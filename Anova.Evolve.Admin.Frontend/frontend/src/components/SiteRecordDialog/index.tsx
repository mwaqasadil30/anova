/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  ApiException,
  SiteInfoDto,
  SiteNumberSearchStatusTypeEnum,
} from 'api/admin/api';
import { ReactComponent as WarningIcon } from 'assets/icons/warning-high-colored.svg';
import Button from 'components/Button';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import { storeSiteIdOrSiteNumber } from 'components/forms/form-fields/AirProductsSiteAutocomplete/helpers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StyledAlignedLabelWithValue from './components/StyledAlignedLabelWithValue';
import { useImportSiteBySiteNumber } from './hooks/useImportSiteBySiteNumber';
import { useTransferSiteBySiteNumber } from './hooks/useTransferSiteBySiteNumber';

const StyledWarningIcon = styled(WarningIcon)`
  height: 20px;
  width: 20px;
`;

const DialogMainText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: 500;
  line-height: 18px;
`;

const DetailsBoxWrapper = styled.div`
  & > * {
    border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

interface SiteDialogDetails {
  titleText: string;
  confirmationButtonText?: string | null;
  showSiteInfo: boolean;
  hasError: boolean;
  isLoading?: boolean;
  canImport?: boolean;
  canTransfer?: boolean;
  onConfirm?: () => void;
  apiError?: boolean;
}

interface Props {
  storeSiteId?: boolean;
  siteInfoApiData?: SiteInfoDto | null;
  isSiteRecordDialogOpen: boolean;
  isSiteInfoDownloadLoading: boolean;
  isFetching: boolean;
  apiError: ApiException | any;
  siteNumberRequest?: string | null;
  fieldName: string;
  setValue: (value: React.SetStateAction<SiteInfoDto | null>) => void;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  closeSiteRecordDialog: () => void;
  onChange?: (
    selectedOption: SiteInfoDto | null,
    newValue: string | undefined
  ) => void;
}

const SiteRecordDialog = ({
  storeSiteId,
  siteInfoApiData,
  isSiteRecordDialogOpen,
  isSiteInfoDownloadLoading,
  isFetching,
  apiError,
  siteNumberRequest,
  fieldName,
  setValue,
  setFieldValue,
  closeSiteRecordDialog,
  onChange,
}: Props) => {
  const { t } = useTranslation();

  const formattedAddress = [
    siteInfoApiData?.address1,
    siteInfoApiData?.city,
    siteInfoApiData?.state,
    siteInfoApiData?.country,
  ]
    .filter(Boolean)
    .join(', ');

  const importSiteApi = useImportSiteBySiteNumber({
    onSuccess: (data) => {
      onChange?.(data, data?.customerName!);
      setValue(data);
      setFieldValue(fieldName, storeSiteIdOrSiteNumber(storeSiteId, data));
      closeSiteRecordDialog();
    },
  });
  const transferSiteApi = useTransferSiteBySiteNumber({
    onSuccess: (data) => {
      onChange?.(data, data?.customerName!);
      setValue(data);
      setFieldValue(fieldName, storeSiteIdOrSiteNumber(storeSiteId, data));
      closeSiteRecordDialog();
    },
  });

  const transferSiteBySiteNumber = () => {
    if (siteInfoApiData?.siteNumber) {
      transferSiteApi.mutate(siteInfoApiData.siteNumber);
    }
  };

  const importSiteBySiteNumber = () => {
    if (siteInfoApiData?.siteNumber) {
      importSiteApi.mutate(siteInfoApiData.siteNumber);
    }
  };

  const getDialogDetails = (): SiteDialogDetails | null => {
    if (apiError && apiError.status === 404) {
      return {
        titleText: t(
          'ui.siteRecordImport.siteNotFound',
          'Site {{siteNumber}} was not found',
          {
            siteNumber: siteNumberRequest,
          }
        ),
        showSiteInfo: false,
        hasError: true,
      };
    }

    if ((apiError && apiError.status === 500) || apiError) {
      return {
        titleText: t('ui.common.defaultError', 'An unexpected error occurred'),
        showSiteInfo: false,
        hasError: true,
      };
    }

    if (
      siteInfoApiData?.searchStatus ===
      SiteNumberSearchStatusTypeEnum.FromOtherDomainInUse
    ) {
      return {
        titleText: t(
          'ui.siteRecordImport.domainAlreadyRegistered',
          'Site record {{siteNumber}} is registered to {{domainName}} and is currently being used. Cannot import record.',
          {
            siteNumber: siteInfoApiData?.siteNumber,
            domainName: siteInfoApiData?.domainName,
          }
        ),
        showSiteInfo: true,
        hasError: true,
      };
    }

    if (
      siteInfoApiData?.searchStatus ===
      SiteNumberSearchStatusTypeEnum.FromOtherDomainNotInUse
    ) {
      return {
        titleText: t(
          'ui.siteRecordImport.siteRegisteredToDomain',
          'Site record {{siteNumber}} is registered to {{domainName}}.',
          {
            siteNumber: siteInfoApiData?.siteNumber,
            domainName: siteInfoApiData?.domainName,
          }
        ),
        confirmationButtonText: t('ui.apci.transferRecord', 'Transfer Record'),
        showSiteInfo: true,
        hasError: false,
        isLoading: transferSiteApi.isLoading,
        onConfirm: () => transferSiteBySiteNumber(),
        apiError: transferSiteApi.isError,
      };
    }

    if (
      siteInfoApiData?.searchStatus ===
      SiteNumberSearchStatusTypeEnum.FromExternalSystem
    ) {
      return {
        titleText: t(
          'ui.apci.importSiteInformation',
          'Import Site Information'
        ),
        confirmationButtonText: t('ui.importSiteRecord.import', 'Import'),
        showSiteInfo: true,
        hasError: false,
        isLoading: importSiteApi.isLoading,
        onConfirm: () => importSiteBySiteNumber(),
        apiError: importSiteApi.isError,
      };
    }

    if (
      siteInfoApiData?.searchStatus ===
      SiteNumberSearchStatusTypeEnum.FromExternalSystemInactive
    ) {
      return {
        titleText: t(
          'ui.siteRecordImport.siteIsInactive',
          'Site Record {{siteNumber}} is Inactive. Cannot import record',
          {
            siteNumber: siteInfoApiData?.siteNumber,
          }
        ),
        showSiteInfo: true,
        hasError: true,
      };
    }

    return null;
  };

  const dialogDetails = getDialogDetails();

  const mainTitle = t('ui.apci.importSite', 'Import Site');

  return (
    <UpdatedConfirmationDialog
      open={isSiteRecordDialogOpen}
      maxWidth="xs"
      disableBackdropClick
      disableEscapeKeyDown
      mainTitle={mainTitle}
      content={
        <>
          <Box m={1}>
            <Grid container spacing={3}>
              {isSiteInfoDownloadLoading ? (
                <Box mt={3} height="250px" width="100%">
                  <TransitionLoadingSpinner in={isFetching} />
                </Box>
              ) : (
                <>
                  <Grid item xs={12}>
                    <Grid container alignItems="flex-start">
                      <Grid item xs={11}>
                        <Grid container spacing={2} alignItems="flex-start">
                          {dialogDetails?.hasError && (
                            <Grid item xs="auto">
                              <StyledWarningIcon />
                            </Grid>
                          )}
                          <Grid item xs>
                            <DialogMainText align="left">
                              {dialogDetails?.titleText}
                            </DialogMainText>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {dialogDetails?.showSiteInfo && (
                    <Grid item xs={12}>
                      <Grid container spacing={2} component={DetailsBoxWrapper}>
                        <Grid item xs={12}>
                          <StyledAlignedLabelWithValue
                            label={t('ui.apci.siteNumber', 'Site Number')}
                            value={siteInfoApiData?.siteNumber}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledAlignedLabelWithValue
                            label={t('ui.dataChannel.customer', 'Customer')}
                            value={siteInfoApiData?.customerName}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <StyledAlignedLabelWithValue
                            label={t('ui.common.address', 'Address')}
                            value={formattedAddress}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  <Grid item xs>
                    <Grid
                      container
                      spacing={2}
                      alignItems="center"
                      justify="center"
                    >
                      {dialogDetails?.onConfirm && (
                        <Grid item>
                          <Button
                            variant="contained"
                            onClick={dialogDetails.onConfirm}
                            disabled={dialogDetails.isLoading}
                          >
                            {dialogDetails?.confirmationButtonText}
                          </Button>
                        </Grid>
                      )}
                      <Grid item>
                        <Button
                          variant={
                            dialogDetails?.hasError ? 'contained' : 'outlined'
                          }
                          onClick={() => {
                            closeSiteRecordDialog();
                            transferSiteApi.reset();
                            importSiteApi.reset();
                          }}
                          disabled={dialogDetails?.isLoading}
                        >
                          {dialogDetails?.hasError
                            ? t('ui.common.close', 'Close')
                            : t('ui.common.cancel', 'Cancel')}
                        </Button>
                      </Grid>
                      {dialogDetails?.apiError && (
                        <Grid item>
                          <Typography variant="body2" color="error">
                            {t(
                              'ui.common.defaultError',
                              'An unexpected error occurred'
                            )}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </>
      }
      hideCancelButton
      hideConfirmationButton
    />
  );
};

export default SiteRecordDialog;
