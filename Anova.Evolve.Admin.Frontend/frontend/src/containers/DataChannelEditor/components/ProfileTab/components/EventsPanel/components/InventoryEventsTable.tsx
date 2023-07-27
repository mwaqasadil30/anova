/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import TableRow from '@material-ui/core/TableRow';
import {
  DataChannelEventRuleInventoryDTO,
  DataChannelEventRuleLevelDTO,
  EventRuleImportanceLevel,
} from 'api/admin/api';
import ShowEnabledOrDisabledIcon from 'components/ShowEnabledOrDisabledIcon';
import TableHead from 'components/tables/components/TableHead';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'utils/format/numbers';
import {
  buildImportanceLevelTextMapping,
  buildInventoryStatusTypeEnumTextMapping,
  eventComparatorTypeTextMapping,
} from 'utils/i18n/enum-to-text';
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
  inventoryEvents?: DataChannelEventRuleInventoryDTO[] | null;
  levelEvents?: DataChannelEventRuleLevelDTO[] | null;
  isAirProductsEnabledDomain?: boolean;
  formattedScaledUnitsText?: string | null;
  setpointList: string[];
  isMaster?: boolean;
}

const InventoryEventsTable = ({
  inventoryEvents,
  levelEvents,
  isAirProductsEnabledDomain,
  formattedScaledUnitsText,
  setpointList,
  isMaster,
}: Props) => {
  const { t } = useTranslation();

  const inventoryStatusTypeEnumTextMapping = buildInventoryStatusTypeEnumTextMapping(
    t
  );
  const importanceLevelTextMapping = buildImportanceLevelTextMapping(t);

  const getInventoryAndLevelEvents = (): Array<
    DataChannelEventRuleInventoryDTO | DataChannelEventRuleLevelDTO
  > => {
    if (inventoryEvents?.length && levelEvents?.length) {
      return inventoryEvents.concat(levelEvents);
    }

    if (inventoryEvents?.length) {
      return inventoryEvents;
    }
    if (levelEvents?.length) {
      return levelEvents;
    }
    return [];
  };

  const inventoryOrLevelEvents = getInventoryAndLevelEvents();

  const hasRosters = inventoryOrLevelEvents?.some(
    (event) => event?.rosters?.length
  );

  return (
    <>
      {!!inventoryOrLevelEvents?.length && (
        <>
          <Grid item xs={12}>
            <StyledEventTypeText>
              {/* 
                NOTE: 
                Inventory events are both level and inventory events combined,
                but we label them as "Level Events".
              */}
              {t('ui.datachanneleventrule.levelevents', 'Level Events')}
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

                    <PaddedHeadCell style={{ minWidth: 120, width: 120 }}>
                      {t(
                        'ui.datachanneleventrule.inventoryState',
                        'Inventory State'
                      )}
                    </PaddedHeadCell>

                    <PaddedHeadCell style={{ minWidth: 125, width: 125 }}>
                      {t('ui.datachanneleventrule.importance', 'Importance')}
                    </PaddedHeadCell>
                    <PaddedHeadCell style={{ minWidth: 120, width: 120 }}>
                      {t('ui.common.value', 'Value')} {formattedScaledUnitsText}
                    </PaddedHeadCell>
                    {isMaster && (
                      <PaddedHeadCell style={{ minWidth: 65, width: 65 }}>
                        {t('ui.datachannel.setpoint', 'Set Point')}
                      </PaddedHeadCell>
                    )}
                    <PaddedHeadCell style={{ width: 170 }}>
                      {t(
                        'ui.datachanneleventrule.hysteresis.nounits',
                        'Hysteresis'
                      )}{' '}
                      {formattedScaledUnitsText}
                    </PaddedHeadCell>
                    {!isAirProductsEnabledDomain && (
                      <PaddedHeadCell style={{ minWidth: 90, width: 90 }}>
                        {t('ui.datachannel.eventDelay', 'Event Delay')}
                      </PaddedHeadCell>
                    )}
                    <PaddedHeadCell
                      style={{
                        minWidth: hasRosters ? 300 : 120,
                        width: hasRosters ? 300 : 120,
                      }}
                    >
                      {t('ui.datachanneleventrule.rosters', 'Rosters')}
                    </PaddedHeadCell>
                    <PaddedHeadCell style={{ width: 150 }}>
                      {t('ui.datachanneleventrule.graphed', 'Graphed')}
                    </PaddedHeadCell>
                    <PaddedHeadCell style={{ width: 150 }}>
                      {t('ui.datachanneleventrule.summarized', 'Summarized')}
                    </PaddedHeadCell>
                    <PaddedHeadCell style={{ width: 150 }}>
                      {t(
                        'ui.datachanneleventrule.alwaystriggered',
                        'Always Triggered'
                      )}
                    </PaddedHeadCell>

                    <PaddedHeadCell style={{ width: 150 }}>
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
                  {inventoryOrLevelEvents?.map((event) => {
                    // If the setpoint index is 0, then it is not set.
                    const setpointText = event.rtuChannelSetpointIndex
                      ? setpointList[event.rtuChannelSetpointIndex]
                      : '-';

                    const formattedEventValue = isNumber(event.eventValue)
                      ? `${
                          eventComparatorTypeTextMapping[
                            event.eventComparatorTypeId!
                          ]
                        } ${event.eventValue}`
                      : '-';

                    const isNormalProblemReportImportanceLevelId =
                      event.problemReportImportanceLevelId ===
                      EventRuleImportanceLevel.Normal;

                    const problemReportEventImportanceIcon =
                      isNumber(event.problemReportImportanceLevelId) &&
                      renderImportance(event.problemReportImportanceLevelId!);
                    return (
                      <StyledTableRow $isFaded={!event.isEnabled}>
                        <StyledPaddedCell>
                          <ShowEnabledOrDisabledIcon
                            isEnabled={event.isEnabled}
                          />
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
                        {'eventInventoryStatusTypeId' in event ? (
                          <PaddedCell>
                            {isNumber(event.eventInventoryStatusTypeId) &&
                              inventoryStatusTypeEnumTextMapping[
                                event.eventInventoryStatusTypeId!
                              ]}
                          </PaddedCell>
                        ) : (
                          <PaddedCell>-</PaddedCell>
                        )}

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
                                  renderImportance(
                                    event.eventImportanceLevelId!
                                  )}
                              </Grid>
                            )}
                          </Grid>
                        </PaddedCell>

                        <PaddedCell>{formattedEventValue}</PaddedCell>

                        {isMaster && <PaddedCell>{setpointText}</PaddedCell>}

                        <PaddedCell>
                          {showDashForNullOrZeroNumberValues(event.hysteresis)}
                        </PaddedCell>

                        {!isAirProductsEnabledDomain && (
                          <PaddedCell>
                            {showDashForNullOrZeroNumberValues(event.delay)}
                          </PaddedCell>
                        )}

                        <PaddedCell>
                          <Grid container>
                            {event.rosters?.length ? (
                              event.rosters.split(',').map((roster) => {
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
                            isEnabled={event.isDisplayedOnGraph}
                            showBlackCheck
                            showDisabledCheckmarkIcon={!event.isEnabled}
                          />
                        </StyledPaddedCell>

                        <StyledPaddedCell>
                          <ShowEnabledOrDisabledIcon
                            isEnabled={event.isDisplayedInSummary}
                            showBlackCheck
                            showDisabledCheckmarkIcon={!event.isEnabled}
                          />
                        </StyledPaddedCell>
                        <StyledPaddedCell>
                          <ShowEnabledOrDisabledIcon
                            isEnabled={event.isAlwaysTriggered}
                            showBlackCheck
                            showDisabledCheckmarkIcon={!event.isEnabled}
                          />
                        </StyledPaddedCell>

                        <StyledPaddedCell>
                          <ShowEnabledOrDisabledIcon
                            isEnabled={event.isAcknowledgementRequired}
                            showBlackCheck
                            showDisabledCheckmarkIcon={!event.isEnabled}
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
                              <Grid
                                container
                                spacing={1}
                                justify="space-between"
                              >
                                <Grid item>
                                  {isNumber(
                                    event.problemReportImportanceLevelId
                                  ) &&
                                    importanceLevelTextMapping[
                                      event.problemReportImportanceLevelId!
                                    ]}
                                </Grid>
                                {!isNormalProblemReportImportanceLevelId && (
                                  <Grid item>
                                    {problemReportEventImportanceIcon}
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

export default InventoryEventsTable;
