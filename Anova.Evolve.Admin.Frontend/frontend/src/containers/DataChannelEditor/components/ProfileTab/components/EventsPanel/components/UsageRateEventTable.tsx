/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import {
  DataChannelEventRuleByUsageRateDTO,
  EventRuleImportanceLevel,
} from 'api/admin/api';
import ShowEnabledOrDisabledIcon from 'components/ShowEnabledOrDisabledIcon';
import TableHead from 'components/tables/components/TableHead';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'utils/format/numbers';
import { buildImportanceLevelTextMapping } from 'utils/i18n/enum-to-text';
import { renderImportance } from 'utils/ui/helpers';
import {
  showDashForEmptyStrings,
  showDashForNullOrZeroNumberValues,
} from '../../../helpers';
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
  event?: DataChannelEventRuleByUsageRateDTO | null;
  isAirProductsEnabledDomain?: boolean;
  formattedScaledUnitsText?: string | null;
  setpointList: string[];
  isMaster?: boolean;
}
const UsageRateEventTable = ({
  event,
  isAirProductsEnabledDomain,
  formattedScaledUnitsText,
  setpointList,
  isMaster,
}: Props) => {
  const { t } = useTranslation();

  const importanceLevelTextMapping = buildImportanceLevelTextMapping(t);
  const hasRosters = !!event?.rosters?.length;

  const formattedUsageRateMinReadingPeriod =
    event?.minimumReadingPeriod &&
    isNumber(event?.minimumReadingPeriod) &&
    // minimumReadingPeriod will have a value by this point
    event.minimumReadingPeriod > 0
      ? `${event?.minimumReadingPeriod} ${t('ui.common.mins', 'Min(s)')}`
      : '-';

  const getRtuSetpointIndexConversion = () => {
    // The back-end hardcodes usage rate setpoints to 10 and 11
    if (event?.rtuChannelSetpointIndex && event?.rtuChannelSetpointIndex > 0) {
      return event?.rtuChannelSetpointIndex - 10;
    }
    return 0;
  };

  const formattedRtuSetpointIndex = getRtuSetpointIndexConversion();

  // If the setpoint index is 0, then it is not set.
  const setpointText = event?.rtuChannelSetpointIndex
    ? setpointList[formattedRtuSetpointIndex]
    : '-';

  return (
    <>
      {event && (
        <>
          <Grid item xs={12}>
            <StyledEventTypeText>
              {t('ui.dataChannel.usageRateEvent', 'Usage Rate Event')}
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
                    {isAirProductsEnabledDomain && (
                      <PaddedHeadCell style={{ width: 100 }}>
                        {t('ui.datachanneleventrule.linked', 'Linked')}
                      </PaddedHeadCell>
                    )}
                    <PaddedHeadCell style={{ minWidth: 130, width: 130 }}>
                      {t('ui.common.description', 'Description')}
                    </PaddedHeadCell>
                    <PaddedHeadCell style={{ minWidth: 125, width: 125 }}>
                      {t('ui.datachanneleventrule.importance', 'Importance')}
                    </PaddedHeadCell>
                    <PaddedHeadCell style={{ minWidth: 135, width: 135 }}>
                      {t('ui.datachanneleventrule.usagerate', 'Usage Rate')}{' '}
                      {formattedScaledUnitsText}
                    </PaddedHeadCell>
                    {isMaster && (
                      <PaddedHeadCell style={{ minWidth: 130, width: 130 }}>
                        {t('ui.datachannel.setpoint', 'Set Point')}
                      </PaddedHeadCell>
                    )}
                    <PaddedHeadCell style={{ minWidth: 200, width: 200 }}>
                      {t(
                        'ui.datachanneleventrule.minimumreadingperiod',
                        'Minimum Reading Period'
                      )}
                    </PaddedHeadCell>
                    <PaddedHeadCell
                      style={{
                        minWidth: hasRosters ? 300 : 120,
                        width: hasRosters ? 300 : 120,
                      }}
                    >
                      {t('ui.datachanneleventrule.rosters', 'Rosters')}
                    </PaddedHeadCell>
                    <PaddedHeadCell style={{ width: 200 }}>
                      {t(
                        'ui.datachanneleventrule.acknowledgement',
                        'Acknowledgement'
                      )}
                    </PaddedHeadCell>
                    {isAirProductsEnabledDomain && (
                      <PaddedHeadCell style={{ minWidth: 130, width: 130 }}>
                        {t('ui.common.tags', 'Tags')}
                      </PaddedHeadCell>
                    )}
                    <PaddedHeadCell style={{ minWidth: 150, width: 150 }}>
                      {t(
                        'ui.datachanneleventrule.integrationid',
                        'Integration ID'
                      )}
                    </PaddedHeadCell>
                  </TableRow>
                </TableHead>

                <StyledTableBody>
                  <StyledTableRow $isFaded={!event.isEnabled}>
                    <PaddedCell style={{ textAlign: 'center' }}>
                      <ShowEnabledOrDisabledIcon isEnabled={event.isEnabled} />
                    </PaddedCell>

                    {isAirProductsEnabledDomain && (
                      <StyledPaddedCell>
                        <ShowEnabledOrDisabledIcon
                          isEnabled={event.isLinkedToEventRule}
                          showBlackCheck
                        />
                      </StyledPaddedCell>
                    )}

                    <PaddedCell>{event.description}</PaddedCell>

                    <PaddedCell>
                      <Grid container spacing={1} justify="space-between">
                        <Grid item>
                          {isNumber(event.eventImportanceLevelId) &&
                            importanceLevelTextMapping[
                              event.eventImportanceLevelId!
                            ]}
                        </Grid>
                        {event.eventImportanceLevelId !==
                          EventRuleImportanceLevel.Normal && (
                          <Grid item>
                            {isNumber(event.eventImportanceLevelId) &&
                              renderImportance(event.eventImportanceLevelId!)}
                          </Grid>
                        )}
                      </Grid>
                    </PaddedCell>

                    <PaddedCell>
                      {showDashForNullOrZeroNumberValues(event.eventValue)}
                    </PaddedCell>

                    {isMaster && <PaddedCell>{setpointText}</PaddedCell>}

                    <PaddedCell>
                      {formattedUsageRateMinReadingPeriod}
                    </PaddedCell>

                    <PaddedCell>
                      <Grid container>
                        {event.rosters?.length ? (
                          event.rosters.split(',').map((roster) => {
                            return (
                              <Grid item xs="auto" style={{ paddingRight: 8 }}>
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
                        isEnabled={event.isAcknowledgementRequired}
                        showBlackCheck
                        showDisabledCheckmarkIcon={!event.isEnabled}
                      />
                    </StyledPaddedCell>
                    {isAirProductsEnabledDomain && (
                      <PaddedCell>
                        {showDashForEmptyStrings(event.tags)}
                      </PaddedCell>
                    )}
                    <PaddedCell>
                      {showDashForEmptyStrings(event.integrationName)}
                    </PaddedCell>
                  </StyledTableRow>
                </StyledTableBody>
              </CustomTable>
            </StyledTableContainer>
          </Grid>
        </>
      )}
    </>
  );
};

export default UsageRateEventTable;
