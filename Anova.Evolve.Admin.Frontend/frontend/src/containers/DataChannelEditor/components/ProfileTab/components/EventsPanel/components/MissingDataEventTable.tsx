/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import {
  DataChannelEventRuleMissingDataDTO,
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
  event?: DataChannelEventRuleMissingDataDTO | null;
  isAirProductsEnabledDomain?: boolean;
}
const MissingDataEventTable = ({
  event,
  isAirProductsEnabledDomain,
}: Props) => {
  const { t } = useTranslation();

  const hasRosters = !!event?.rosters?.length;

  const importanceLevelTextMapping = buildImportanceLevelTextMapping(t);

  const missingDataMaxDataAgeString = () => {
    const maxDataAgeByHour =
      isNumber(event?.maxDataAgeByHour) &&
      `${event?.maxDataAgeByHour} ${t('ui.common.hours', 'Hour(s)')}`;
    const maxDataAgeByMinute =
      isNumber(event?.maxDataAgeByMinute) &&
      `${event?.maxDataAgeByMinute} ${t('ui.common.mins', 'Min(s)')}`;

    return `${maxDataAgeByHour} ${maxDataAgeByMinute}`;
  };

  return (
    <>
      {event && (
        <>
          <Grid item xs={12}>
            <StyledEventTypeText>
              {t('ui.dataChannel.missingDataEvent', 'Missing Data Event')}
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
                    <PaddedHeadCell style={{ minWidth: 115, width: 115 }}>
                      {t('ui.datachanneleventrule.importance', 'Importance')}
                    </PaddedHeadCell>
                    <PaddedHeadCell style={{ minWidth: 160, width: 160 }}>
                      {t('ui.datachanneleventrule.maxdataage', 'Max Data Age')}
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
                      <>
                        <PaddedHeadCell style={{ minWidth: 130, width: 130 }}>
                          {t('ui.common.tags', 'Tags')}
                        </PaddedHeadCell>
                        <PaddedHeadCell style={{ minWidth: 120, width: 120 }}>
                          {t(
                            'ui.datachanneleventrule.prautocreate',
                            'PR Auto-Create'
                          )}
                        </PaddedHeadCell>
                        <PaddedHeadCell style={{ minWidth: 120, width: 120 }}>
                          {t(
                            'ui.datachanneleventrule.prautoclose',
                            'PR Auto-Close'
                          )}
                        </PaddedHeadCell>

                        <PaddedHeadCell style={{ minWidth: 120, width: 120 }}>
                          {t(
                            'ui.datachanneleventrule.primportance',
                            'PR Importance'
                          )}
                        </PaddedHeadCell>
                      </>
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
                    <StyledPaddedCell>
                      <ShowEnabledOrDisabledIcon isEnabled={event.isEnabled} />
                    </StyledPaddedCell>
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

                    <PaddedCell>{missingDataMaxDataAgeString()}</PaddedCell>

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
                      />
                    </StyledPaddedCell>
                    {isAirProductsEnabledDomain && (
                      <>
                        <PaddedCell>
                          {showDashForEmptyStrings(event.tags)}
                        </PaddedCell>
                        <StyledPaddedCell>
                          <ShowEnabledOrDisabledIcon
                            isEnabled={event.isAutoCreateProblemReport}
                            showBlackCheck
                            showDisabledCheckmarkIcon={!event.isEnabled}
                          />
                        </StyledPaddedCell>
                        <StyledPaddedCell>
                          <ShowEnabledOrDisabledIcon
                            isEnabled={event.isAutoCloseProblemReport}
                            showBlackCheck
                            showDisabledCheckmarkIcon={!event.isEnabled}
                          />
                        </StyledPaddedCell>

                        <PaddedCell>
                          <Grid container spacing={1} justify="space-between">
                            <Grid item>
                              {isNumber(event.problemReportImportanceLevelId) &&
                                importanceLevelTextMapping[
                                  event.problemReportImportanceLevelId!
                                ]}
                            </Grid>
                            {event.problemReportImportanceLevelId !==
                              EventRuleImportanceLevel.Normal && (
                              <Grid item>
                                {isNumber(
                                  event.problemReportImportanceLevelId
                                ) &&
                                  renderImportance(
                                    event.problemReportImportanceLevelId!
                                  )}
                              </Grid>
                            )}
                          </Grid>
                        </PaddedCell>
                      </>
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

export default MissingDataEventTable;
