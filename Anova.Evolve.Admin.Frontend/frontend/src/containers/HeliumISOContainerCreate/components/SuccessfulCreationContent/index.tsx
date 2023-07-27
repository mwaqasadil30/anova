import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  HeliumISODataChannel,
  HeliumISODataChannelEventRules,
  QuickAssetCreateHeliumISOContainer,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
import Button from 'components/Button';
import EntityDetails from 'components/EntityDetails';
import PageSubHeader from 'components/PageSubHeader';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  isHeliumDataChannel,
  isNitrogenDataChannel,
  isTelemetryEventRule,
} from 'utils/api/helpers';
import { isNumber } from 'utils/format/numbers';
import EventsTable from './EventsTable';

const StyledTableHeadCell = styled(TableHeadCell)`
  padding: 7px 16px;
`;

const FieldTitle = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-size: 14px;
  margin-bottom: ${(props) => props.theme.spacing(0.5)}px;
`;
const FieldValue = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
  font-size: 16px;
  font-weight: 500;
`;

export interface SuccessfulCreationDialogProps {
  createdAsset?: QuickAssetCreateHeliumISOContainer | null;
}

const defaultDataChannels: any[] = [];

const SuccessfulCreationDialog = ({
  createdAsset,
}: SuccessfulCreationDialogProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  const rtuDeviceId = createdAsset?.dataChannels?.filter(
    (channel) => !!channel.rtuDeviceId
  )?.[0].rtuDeviceId;

  const filteredHeliumDataChannels =
    createdAsset?.dataChannels?.filter(isHeliumDataChannel) ||
    defaultDataChannels;
  const heliumDataChannels = filteredHeliumDataChannels?.filter(Boolean) as
    | HeliumISODataChannel[]
    | undefined;
  const nitrogenDataChannels = createdAsset?.dataChannels?.filter(
    isNitrogenDataChannel
  ) as HeliumISODataChannel[] | undefined;

  const telemetryEventRules = createdAsset?.dataChannels
    ?.flatMap((channel) =>
      channel.eventRules?.map((eventRule) => ({
        ...eventRule,
        dataChannelType: channel.type,
      }))
    )
    .filter((eventRule) =>
      isTelemetryEventRule(eventRule, eventRule?.dataChannelType)
    ) as HeliumISODataChannelEventRules[] | null | undefined;

  const hasIntegrationParameters = createdAsset?.dataChannels?.some(
    (channel) => !!channel.integrationDetails?.integrationId
  );

  return (
    <Grid container spacing={5} alignItems="stretch">
      <Grid item xs={12} md={3} lg={2}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12}>
            <FieldTitle>
              {t(
                'ui.quicktankcreate.heliumISOContainer.assetDescription',
                'Asset Description (Container ID)'
              )}
            </FieldTitle>
            <FieldValue>{createdAsset?.description}</FieldValue>
          </Grid>
          <Grid item xs={12}>
            <FieldTitle>
              {t('ui.asset.designcurvetype', 'Design Curve Type')}
            </FieldTitle>
            <FieldValue>{createdAsset?.designCurve?.description}</FieldValue>
          </Grid>
          <Grid item xs={12}>
            <FieldTitle>{t('ui.common.site', 'Site')}</FieldTitle>
            <FieldValue>{createdAsset?.siteInfo}</FieldValue>
          </Grid>
          <Grid item xs={12}>
            <FieldTitle>{t('ui.common.rtu', 'RTU')}</FieldTitle>
            <FieldValue>{rtuDeviceId}</FieldValue>
          </Grid>
          <Grid item xs={12}>
            {createdAsset?.assetId && (
              <Button
                variant="contained"
                component={Link}
                to={generatePath(routes.assetManager.edit, {
                  assetId: createdAsset.assetId,
                })}
              >
                {t('ui.common.viewDetails', 'View Details')}
              </Button>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item {...(isBelowSmBreakpoint && { xs: 12 })}>
        <Divider
          orientation={isBelowSmBreakpoint ? 'horizontal' : 'vertical'}
          style={{ margin: isBelowSmBreakpoint ? 0 : '0 40px' }}
        />
      </Grid>
      <Grid item xs>
        <Grid container spacing={4}>
          {!!createdAsset?.customProperties?.length && (
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t('ui.asset.customproperties', 'Custom Properties')}
                  </PageSubHeader>
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {createdAsset.customProperties.map((property) => (
                      <Grid item xs={3} key={property.propertyTypeId}>
                        <FieldTitle>{property.name}</FieldTitle>
                        <FieldValue>
                          {isNumber(property.value) || !!property.value ? (
                            property.value
                          ) : (
                            <em>{t('ui.common.none', 'None')}</em>
                          )}
                        </FieldValue>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PageSubHeader dense>
                  {t('ui.assetdetail.assetnotes', 'Asset Notes')}
                </PageSubHeader>
              </Grid>
              <Grid item xs={12}>
                <FieldValue>
                  {createdAsset?.notes || (
                    <em>{t('ui.common.none', 'None')}</em>
                  )}
                </FieldValue>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <PageSubHeader dense>
              {t(
                'ui.quicktankcreate.successPage.dataChannelsAndIntegrationParams',
                'Data Channels & Integration Parameters'
              )}
            </PageSubHeader>
          </Grid>
          <Grid item xs={12}>
            <TableContainer>
              <Box
                component={Table}
                minWidth={500}
                aria-label="Data Channels &amp; Integration Parameters table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableHeadCell>
                      {t('ui.common.datachannel', 'Data Channel')}
                    </StyledTableHeadCell>
                    <StyledTableHeadCell>
                      {t('ui.common.rtu', 'RTU')}
                    </StyledTableHeadCell>
                    {hasIntegrationParameters && (
                      <StyledTableHeadCell>
                        {t(
                          'ui.datachanneleventrule.integrationid',
                          'Integration ID'
                        )}
                      </StyledTableHeadCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!createdAsset?.dataChannels?.length ? (
                    <TableRow>
                      <TableCell colSpan={4}>
                        {t('ui.datachannel.empty', 'No Data Channels found')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    createdAsset?.dataChannels.map((channel) => (
                      <TableRow>
                        <TableCell>{channel.description}</TableCell>
                        <TableCell>
                          {channel.rtuDeviceId}-{channel.rtuChannelNumber}
                        </TableCell>
                        {hasIntegrationParameters && (
                          <TableCell>
                            {channel.integrationDetails?.integrationId}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Box>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <PageSubHeader dense>
              {t(
                'ui.quicktankcreate.heliumISOContainer.heliumEvents',
                'Helium Events'
              )}
            </PageSubHeader>
          </Grid>
          <Grid item xs={12}>
            <EventsTable
              dataChannels={heliumDataChannels}
              TableProps={{
                'aria-label': 'Helium Events table',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <PageSubHeader dense>
              {t(
                'ui.quicktankcreate.heliumISOContainer.nitrogenEvents',
                'Nitrogen Events'
              )}
            </PageSubHeader>
          </Grid>
          <Grid item xs={12}>
            <EventsTable
              dataChannels={nitrogenDataChannels}
              TableProps={{
                'aria-label': 'Nitrogen Events table',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <PageSubHeader dense>
              {t(
                'ui.quicktankcreate.heliumISOContainer.telemetryEvents',
                'Telemetry Events'
              )}
            </PageSubHeader>
          </Grid>
          <Grid item xs={12}>
            <EventsTable
              eventRules={telemetryEventRules}
              TableProps={{
                'aria-label': 'Telemetry Events table',
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <EntityDetails
          details={{
            createdDate: createdAsset?.createdDate,
            createdByUsername: createdAsset?.createdByUsername,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default SuccessfulCreationDialog;
