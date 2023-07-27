/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import {
  DataChannelEventRuleDeliveryScheduleDTO,
  EventRuleImportanceLevel,
} from 'api/admin/api';
import ShowEnabledOrDisabledIcon from 'components/ShowEnabledOrDisabledIcon';
import TableHead from 'components/tables/components/TableHead';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'utils/format/numbers';
import { buildImportanceLevelTextMapping } from 'utils/i18n/enum-to-text';
import { renderImportance } from 'utils/ui/helpers';
import { showDashForEmptyStrings } from '../../../helpers';
import {
  CustomTable,
  PaddedCell,
  PaddedHeadCell,
  StyledEventTypeText,
  StyledGreenCircle,
  StyledNoneText,
  StyledPaddedCell,
  StyledTableBody,
  StyledTableContainer,
  StyledTableRow,
} from '../../../styles';

interface Props {
  event?: DataChannelEventRuleDeliveryScheduleDTO[] | null;
}

const ScheduledDeliveryEventsTable = ({ event }: Props) => {
  const { t } = useTranslation();

  const importanceLevelTextMapping = buildImportanceLevelTextMapping(t);

  const hasRosters = event?.some(
    (deliveryEvent) => deliveryEvent?.rosters?.length
  );

  return (
    <>
      {!!event?.length && (
        <>
          <Grid item xs={12}>
            <StyledEventTypeText>
              {t(
                'ui.datachanneleventrule.scheduleddeliveryevents',
                'Scheduled Delivery Events'
              )}
            </StyledEventTypeText>
          </Grid>
          <Grid item xs={12}>
            <StyledTableContainer>
              <CustomTable>
                <TableHead>
                  <TableRow>
                    <PaddedHeadCell
                      style={{
                        width: 75,
                      }}
                    >
                      {t('ui.common.enabled', 'Enabled')}
                    </PaddedHeadCell>
                    <PaddedHeadCell style={{ minWidth: 130, width: 130 }}>
                      {t('ui.common.description', 'Description')}
                    </PaddedHeadCell>

                    <PaddedHeadCell style={{ minWidth: 125, width: 125 }}>
                      {t('ui.datachanneleventrule.importance', 'Importance')}
                    </PaddedHeadCell>

                    <PaddedHeadCell
                      style={{
                        minWidth: hasRosters ? 300 : 120,
                        width: hasRosters ? 300 : 120,
                      }}
                    >
                      {t('ui.datachanneleventrule.rosters', 'Rosters')}
                    </PaddedHeadCell>

                    <PaddedHeadCell style={{ width: 150 }}>
                      {t(
                        'ui.datachanneleventrule.acknowledgement',
                        'Acknowledgement'
                      )}
                    </PaddedHeadCell>

                    <PaddedHeadCell style={{ minWidth: 150, width: 150 }}>
                      {t(
                        'ui.datachanneleventrule.integrationid',
                        'Integration ID'
                      )}
                    </PaddedHeadCell>
                  </TableRow>
                </TableHead>

                <StyledTableBody>
                  {event?.map((deliveryEvent) => {
                    return (
                      <StyledTableRow $isFaded={!deliveryEvent.isEnabled}>
                        <StyledPaddedCell>
                          <ShowEnabledOrDisabledIcon
                            isEnabled={deliveryEvent.isEnabled}
                          />
                        </StyledPaddedCell>

                        <PaddedCell>{deliveryEvent.description}</PaddedCell>

                        <PaddedCell>
                          <Grid container spacing={1} justify="space-between">
                            <Grid item>
                              {isNumber(deliveryEvent.eventImportanceLevelId) &&
                                importanceLevelTextMapping[
                                  deliveryEvent.eventImportanceLevelId!
                                ]}
                            </Grid>
                            {deliveryEvent.eventImportanceLevelId !==
                              EventRuleImportanceLevel.Normal && (
                              <Grid item>
                                {isNumber(
                                  deliveryEvent.eventImportanceLevelId
                                ) &&
                                  renderImportance(
                                    deliveryEvent.eventImportanceLevelId!
                                  )}
                              </Grid>
                            )}
                          </Grid>
                        </PaddedCell>

                        <PaddedCell>
                          <Grid container>
                            {deliveryEvent.rosters?.length ? (
                              deliveryEvent.rosters.split(',').map((roster) => {
                                return (
                                  <Grid
                                    item
                                    xs="auto"
                                    style={{ paddingRight: 8 }}
                                  >
                                    <StyledGreenCircle className="roster-circle-icon" />{' '}
                                    {roster}
                                  </Grid>
                                );
                              })
                            ) : (
                              <StyledNoneText>
                                {t('ui.common.none', 'None')}
                              </StyledNoneText>
                            )}
                          </Grid>
                        </PaddedCell>

                        <StyledPaddedCell>
                          <ShowEnabledOrDisabledIcon
                            isEnabled={deliveryEvent.isAcknowledgementRequired}
                            showBlackCheck
                            showDisabledCheckmarkIcon={!deliveryEvent.isEnabled}
                          />
                        </StyledPaddedCell>

                        <PaddedCell>
                          {showDashForEmptyStrings(
                            deliveryEvent.integrationName
                          )}
                        </PaddedCell>
                      </StyledTableRow>
                    );
                  })}
                </StyledTableBody>
              </CustomTable>
            </StyledTableContainer>
          </Grid>
        </>
      )}
    </>
  );
};

export default ScheduledDeliveryEventsTable;
