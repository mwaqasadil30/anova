import Box from '@material-ui/core/Box';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CloseIconButton from 'components/buttons/CloseIconButton';
import CircularProgress from 'components/CircularProgress';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import SuccessfulCreationContent from 'containers/HeliumISOContainerCreate/components/SuccessfulCreationContent';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { white } from 'styles/colours';
import useRetrieveHeliumISOReport from '../../hooks/useRetrieveHeliumISOReport';

const StyledCloseButton = styled(CloseIconButton)`
  background: ${white};
`;

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    height: 100%;
  }
`;

interface Props extends DialogProps {
  assetId?: string;
}

const DetailsDialog = ({ assetId, ...dialogProps }: Props) => {
  const { t } = useTranslation();
  const { isFetching, refetch, data, error } = useRetrieveHeliumISOReport();

  useEffect(() => {
    if (assetId) {
      refetch(assetId);
    }
  }, [assetId]);

  return (
    <StyledDialog maxWidth="lg" fullWidth {...dialogProps}>
      <Box m={1} display="flex" justifyContent="flex-end">
        <StyledCloseButton
          // @ts-ignore
          onClick={dialogProps?.onClose}
        />
      </Box>
      <Box
        p={3}
        overflow="scroll"
        height={isFetching || data ? '100%' : 'inherit'}
      >
        {isFetching ? (
          <Box textAlign="center">
            <CircularProgress />
          </Box>
        ) : !data || error ? (
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item>
              <SearchCloudIcon />
            </Grid>
            <Grid item>
              {error ? (
                <Typography color="error">
                  {t(
                    'ui.common.unableToRetrieveDataError',
                    'Unable to retrieve data'
                  )}
                </Typography>
              ) : (
                <Typography>
                  {t('ui.common.noDataFound', 'No data found')}
                </Typography>
              )}
            </Grid>
          </Grid>
        ) : (
          <Fade in>
            <div>
              <SuccessfulCreationContent createdAsset={data?.report} />
            </div>
          </Fade>
        )}
      </Box>
    </StyledDialog>
  );
};

export default DetailsDialog;
