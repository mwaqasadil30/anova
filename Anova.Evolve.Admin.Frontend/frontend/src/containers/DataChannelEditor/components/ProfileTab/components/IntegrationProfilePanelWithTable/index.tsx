/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { DataChannelReportDTO, IntegrationInfoDTO } from 'api/admin/api';
import { ReactComponent as GreenCircle } from 'assets/icons/green-circle.svg';
import { ReactComponent as RedCircle } from 'assets/icons/red-circle.svg';
import AccordionDetails from 'components/AccordionDetails';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EmptyContentBlock from 'components/EmptyContentBlock';
import { StaticAccordion } from 'components/StaticAccordion';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import { IS_DATA_CHANNEL_INTEGRATION_PANEL_EDIT_FEATURE_ENABLED } from 'env';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  BoxTitle,
  StyledAccordionSummary,
  StyledEditButton,
  StyledEditIcon,
} from '../../styles';
import DetailsBoxWrapper from '../DetailsBoxWrapper';
import IntegrationProfileTableDrawer from '../IntegrationProfileTableDrawer';

const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 16px;
`;

const StyledGreenCircle = styled(GreenCircle)`
  height: 8px;
  width: 6px;
`;
const StyledRedCircle = styled(RedCircle)`
  height: 8px;
  width: 6px;
`;

// Remove the top left and right border-radius in the table
const StyledTableContainer = styled(TableContainer)`
  && {
    border-radius: 10px;
  }
  border: ${(props) =>
    props.theme.palette.type === 'light'
      ? '1px solid #e9e9e9'
      : '1px solid #7e7e7e'};
`;

// Remove the top left and right border-radius in the table
const CustomSizedTable = styled(Table)`
  min-width: 500px;

  // TODO:
  // The code below removes a part of the gray top left and top right border.
  // Not sure why it still appears, need to look into it.
  & thead,
  & .MuiTableHead-root {
    border-top-left-radius: 0px;
    border-top-left-radius: 0px;
  }

  & thead > tr > th:first-of-type,
  & .MuiTableHead-root > .MuiTableRow-head > .MuiTableCell-head:first-of-type {
    border-top-left-radius: 0px;
  }

  & thead > tr > th:last-of-type,
  & .MuiTableHead-root > .MuiTableRow-head > .MuiTableCell-head:last-of-type {
    border-top-right-radius: 0px;
  }
`;

const PaddedHeadCell = styled(TableHeadCell)`
  padding: 9px 16px;
  width: 50%;
  background-color: ${(props) =>
    props.theme.palette.type === 'light' ? '#F4F4F4' : '#686868'};
`;

const PaddedCell = styled(TableCell)`
  padding: 0px 16px;
  // TODO: use proper css accessors
  &&&:not(:last-child) {
    border-right: ${(props) =>
      props.theme.palette.type === 'light'
        ? '1px solid #e9e9e9'
        : '1px solid #7e7e7e'};
  }
`;

const StyledTableBody = styled(TableBody)`
  & > tr:not(:last-child) > td,
  & .MuiTableRow-root:not(:last-child) > .MuiTableCell-body {
    border-bottom: ${(props) =>
      props.theme.palette.type === 'light'
        ? '1px solid #e9e9e9'
        : '1px solid #7e7e7e'};
  }
`;

const StyledTableRow = styled(TableRow)<{ $isFaded: boolean }>`
  ${(props) =>
    props.$isFaded &&
    `
    & > td {
      color: ${props.theme.palette.text.secondary};
    }
  `}
  height: 42px;
`;

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  integrationInfo?: IntegrationInfoDTO | null;
  canUpdateDataChannel?: boolean;
}

const IntegrationProfilePanelWithTable = ({
  canUpdateDataChannel,
  dataChannelDetails,
  integrationInfo,
}: Props) => {
  const { t } = useTranslation();

  const [
    isIntegrationProfileTableDrawerOpen,
    setIsIntegrationProfileTableDrawerOpen,
  ] = useState(false);

  const closeIntegrationProfileTableDrawer = () => {
    setIsIntegrationProfileTableDrawerOpen(false);
  };

  const openIntegrationProfileTableDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsIntegrationProfileTableDrawerOpen(true);
  };

  const saveAndExitCallback = () => {
    closeIntegrationProfileTableDrawer();
  };

  const isIntegration1Enabled =
    integrationInfo?.integration?.integrationProfile1?.isIntegrationConfigured;
  const isIntegration2Enabled =
    integrationInfo?.integration?.integrationProfile2?.isIntegrationConfigured;

  const areBothIntegrationProfilesDisabled =
    !isIntegration1Enabled && !isIntegration2Enabled;

  return (
    <>
      <Drawer
        anchor="right"
        open={isIntegrationProfileTableDrawerOpen}
        onClose={closeIntegrationProfileTableDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <IntegrationProfileTableDrawer
            dataChannelDetails={dataChannelDetails}
            integrationInfoDetails={integrationInfo?.integration}
            cancelCallback={closeIntegrationProfileTableDrawer}
            saveAndExitCallback={saveAndExitCallback}
          />
        </DrawerContent>
      </Drawer>
      <Grid item xs={12}>
        <StaticAccordion>
          <StyledAccordionSummary>
            <Grid
              container
              alignItems="center"
              spacing={0}
              justify="space-between"
            >
              <Grid item>
                <BoxTitle>
                  {t(
                    'ui.dataChannel.integrationProfile',
                    'Integration Profile'
                  )}
                </BoxTitle>
              </Grid>

              {canUpdateDataChannel &&
                IS_DATA_CHANNEL_INTEGRATION_PANEL_EDIT_FEATURE_ENABLED && (
                  <Grid item>
                    <StyledEditButton
                      onClick={openIntegrationProfileTableDrawer}
                    >
                      <StyledEditIcon />
                    </StyledEditButton>
                  </Grid>
                )}
            </Grid>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Grid container alignItems="center">
              {areBothIntegrationProfilesDisabled ? (
                <Grid item xs>
                  <EmptyContentBlock
                    message={t(
                      'ui.dataChannel.integrationNotConfigured',
                      'Integration not configured'
                    )}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs>
                    <Grid
                      container
                      direction="column"
                      component={DetailsBoxWrapper}
                    >
                      <Grid item>
                        <StyledTableContainer>
                          <CustomSizedTable>
                            <TableHead>
                              <TableRow>
                                <PaddedHeadCell
                                  style={{
                                    width: 100,
                                  }}
                                >
                                  {t(
                                    'ui.datachannel.integration',
                                    'Integration'
                                  )}
                                </PaddedHeadCell>
                                <PaddedHeadCell style={{ width: 150 }}>
                                  {t('ui.common.status', 'Status')}
                                </PaddedHeadCell>
                                <PaddedHeadCell style={{ width: 150 }}>
                                  {t('ui.datachannel.id', 'ID')}
                                </PaddedHeadCell>
                                <PaddedHeadCell style={{ width: 200 }}>
                                  {t(
                                    'ui.datachannel.destination',
                                    'Destination'
                                  )}
                                </PaddedHeadCell>
                                <PaddedHeadCell style={{ width: 200 }}>
                                  {t(
                                    'ui.datachannel.formatType',
                                    'Format Type'
                                  )}
                                </PaddedHeadCell>
                              </TableRow>
                            </TableHead>

                            {/* TODO: Could this logic be simplified -- lots of duplicated code */}
                            <StyledTableBody>
                              {/* // Enabled Integration (#1) case */}
                              {isIntegration1Enabled && (
                                <StyledTableRow
                                  $isFaded={
                                    !integrationInfo?.integration
                                      ?.integrationProfile1
                                      ?.isIntegrationEnabled
                                  }
                                >
                                  {/* Integration (#1) Number Column */}
                                  <PaddedCell>1</PaddedCell>

                                  {/* Integration (#1) Status Column */}
                                  <PaddedCell>
                                    {integrationInfo?.integration
                                      ?.integrationProfile1
                                      ?.isIntegrationEnabled ? (
                                      <Grid
                                        container
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        <Grid item xs="auto">
                                          <StyledGreenCircle />
                                        </Grid>
                                        <Grid item>
                                          {t('ui.common.enabled', 'Enabled')}
                                        </Grid>
                                      </Grid>
                                    ) : (
                                      <Grid
                                        container
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        <Grid item xs="auto">
                                          <StyledRedCircle />
                                        </Grid>
                                        <Grid item>
                                          {t('ui.common.disabled', 'Disabled')}
                                        </Grid>
                                      </Grid>
                                    )}
                                  </PaddedCell>

                                  {/* Integration (#1) ID Column */}
                                  <PaddedCell>
                                    {
                                      integrationInfo?.integration
                                        ?.integrationProfile1?.integrationId
                                    }
                                  </PaddedCell>

                                  {/* Integration (#1) Target Domain Column */}
                                  <PaddedCell>
                                    {
                                      integrationInfo?.integration
                                        ?.integrationProfile1?.domainName
                                    }
                                  </PaddedCell>

                                  {/* Integration (#1) Format Type Column */}
                                  <PaddedCell>
                                    {
                                      integrationInfo?.integration
                                        ?.integrationProfile1?.formatTypeAsText
                                    }
                                  </PaddedCell>
                                </StyledTableRow>
                              )}

                              {/* // Enabled Integration (#2) case */}
                              {isIntegration2Enabled && (
                                <StyledTableRow
                                  $isFaded={
                                    !integrationInfo?.integration
                                      ?.integrationProfile2
                                      ?.isIntegrationEnabled
                                  }
                                >
                                  {/* Integration (#2) Number Column */}
                                  <PaddedCell>2</PaddedCell>

                                  {/* Integration (#2) Status Column */}
                                  <PaddedCell>
                                    {integrationInfo?.integration
                                      ?.integrationProfile2
                                      ?.isIntegrationEnabled ? (
                                      <Grid
                                        container
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        <Grid item xs="auto">
                                          <StyledGreenCircle />
                                        </Grid>
                                        <Grid item>
                                          {t('ui.common.enabled', 'Enabled')}
                                        </Grid>
                                      </Grid>
                                    ) : (
                                      <Grid
                                        container
                                        spacing={1}
                                        alignItems="center"
                                      >
                                        <Grid item xs="auto">
                                          <StyledRedCircle />
                                        </Grid>
                                        <Grid item>
                                          {t('ui.common.disabled', 'Disabled')}
                                        </Grid>
                                      </Grid>
                                    )}
                                  </PaddedCell>

                                  {/* Integration (#2) ID Column */}
                                  <PaddedCell>
                                    {
                                      integrationInfo?.integration
                                        ?.integrationProfile2?.integrationId
                                    }
                                  </PaddedCell>

                                  {/* Integration (#2) Target Domain Column */}
                                  <PaddedCell>
                                    {
                                      integrationInfo?.integration
                                        ?.integrationProfile2?.domainName
                                    }
                                  </PaddedCell>

                                  {/* Integration (#2) Format Type Column */}
                                  <PaddedCell>
                                    {
                                      integrationInfo?.integration
                                        ?.integrationProfile2?.formatTypeAsText
                                    }
                                  </PaddedCell>
                                </StyledTableRow>
                              )}
                            </StyledTableBody>
                          </CustomSizedTable>
                        </StyledTableContainer>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </StyledAccordionDetails>
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default IntegrationProfilePanelWithTable;
