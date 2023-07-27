import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { DataChannelDTO, EventRuleCategory } from 'api/admin/api';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageSubHeader from 'components/PageSubHeader';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { eventComparatorTypeTextMapping } from 'utils/i18n/enum-to-text';
import PageIntro from './PageIntro';

const StyledFieldGroup = styled(FieldGroup)`
  display: flex;
  align-items: flex-end;
`;

const StyledComparatorText = styled(StyledTextField)`
  min-width: 40px;
  max-width: 40px;

  & .MuiInput-input {
    text-align: center;
  }
`;

const Wrapper = styled.div`
  margin-top: ${(props) => props.theme.spacing(2)}px;
`;

const StyledEventText = styled(Typography)`
  font-size: 14px;
`;

const StyledSecondaryText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

interface FormValues {
  siteNotes: string;
  assetNotes: string;
}

interface Props {
  closeEventDrawer: () => void;
  dataChannelResult: DataChannelDTO[];
}

const EventsDrawer = ({ closeEventDrawer, dataChannelResult }: Props) => {
  const { t } = useTranslation();

  const dataChannelsWithEnabledEvents = dataChannelResult.filter(
    (dataChannel) => !!dataChannel.uomParams?.eventRules?.length
  );

  return (
    <>
      <Formik
        initialValues={{
          dataChannels: dataChannelsWithEnabledEvents,
        }}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSubmit={async (values) => {}}
      >
        {({ values }) => {
          return (
            <Form>
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <PageIntro closeEventDrawer={closeEventDrawer} />
              </PageIntroWrapper>

              <Wrapper>
                <Grid container spacing={2} alignItems="center">
                  <FieldArray
                    name="dataChannels"
                    render={() => {
                      return (
                        <>
                          {values.dataChannels?.map(
                            (dataChannel, dataChannelIndex) => {
                              const eventRules =
                                dataChannel.uomParams?.eventRules;
                              const eventIdToIndexMapping = eventRules?.reduce<
                                Record<number, number>
                              >((prev, event, index) => {
                                prev[event.dataChannelEventRuleId!] = index;
                                return prev;
                              }, {});

                              const levelEvents = eventRules?.filter(
                                (event) =>
                                  event.eventRuleType ===
                                  EventRuleCategory.Level
                              );
                              const missingDataEvents = eventRules?.filter(
                                (event) =>
                                  event.eventRuleType ===
                                  EventRuleCategory.MissingData
                              );
                              const scheduledDeliveryEvents = eventRules?.filter(
                                (event) =>
                                  [
                                    EventRuleCategory.ScheduledDeliveryMissed,
                                    EventRuleCategory.ScheduledDeliveryTooEarly,
                                    EventRuleCategory.ScheduledDeliveryTooLate,
                                  ].includes(event.eventRuleType!)
                              );

                              return (
                                <>
                                  <Grid item xs={12}>
                                    <PageSubHeader dense>
                                      {dataChannel.description}
                                    </PageSubHeader>
                                  </Grid>
                                  {!!levelEvents?.length && (
                                    <Grid item xs={12}>
                                      <TableContainer>
                                        <Table style={{ minWidth: 500 }}>
                                          <TableHead>
                                            <TableHeadRow>
                                              <TableHeadCell
                                                style={{ width: 200 }}
                                              >
                                                {t('ui.common.event', 'Event')}
                                              </TableHeadCell>
                                              <TableHeadCell
                                                style={{ minWidth: 200 }}
                                              >
                                                {t(
                                                  'ui.assetDetailEvents.eventValues',
                                                  'Event Values'
                                                )}
                                              </TableHeadCell>
                                            </TableHeadRow>
                                          </TableHead>
                                          <TableBody>
                                            {levelEvents.map((event) => {
                                              const eventIndex =
                                                eventIdToIndexMapping?.[
                                                  event.dataChannelEventRuleId!
                                                ];

                                              const comparatorText =
                                                eventComparatorTypeTextMapping[
                                                  event.comparator!
                                                ];

                                              const eventValueFieldName = `dataChannels.${dataChannelIndex}.uomParams.eventRules.${eventIndex}.eventValue`;
                                              return (
                                                <TableBodyRow>
                                                  <TableCell>
                                                    <StyledEventText>
                                                      {event.description}
                                                    </StyledEventText>
                                                  </TableCell>
                                                  <TableCell>
                                                    <Grid
                                                      container
                                                      alignItems="center"
                                                      spacing={1}
                                                    >
                                                      <Grid item xs="auto">
                                                        <StyledFieldGroup>
                                                          <StyledComparatorText
                                                            fullWidth={false}
                                                            value={
                                                              comparatorText
                                                            }
                                                            InputProps={{
                                                              style: {
                                                                height: 40,
                                                                overflow:
                                                                  'hidden',
                                                                padding:
                                                                  '7px 9px',
                                                                textAlign:
                                                                  'center',
                                                              },
                                                            }}
                                                            disabled
                                                          />

                                                          <StyledTextField
                                                            fullWidth={false}
                                                            id={`${eventValueFieldName}-input`}
                                                            name={
                                                              eventValueFieldName
                                                            }
                                                            style={{
                                                              minWidth: 200,
                                                            }}
                                                            InputProps={{
                                                              style: {
                                                                height: 40,
                                                                overflow:
                                                                  'hidden',
                                                              },
                                                            }}
                                                            disabled
                                                          />
                                                        </StyledFieldGroup>
                                                      </Grid>

                                                      {/* <Grid item xs={9}>
                                                        <Field
                                                          id={`${eventValueFieldName}-input`}
                                                          name={
                                                            eventValueFieldName
                                                          }
                                                          disabled
                                                          type="number"
                                                          component={
                                                            CustomTextField
                                                          }
                                                          InputProps={{
                                                            startAdornment: (
                                                              <InputAdornment
                                                                position="start"
                                                                aria-label="Event comparator"
                                                              >
                                                                {comparatorText}
                                                              </InputAdornment>
                                                            ),
                                                          }}
                                                        />
                                                      </Grid> */}
                                                      <Grid item xs={3}>
                                                        <StyledSecondaryText>
                                                          {
                                                            dataChannel
                                                              .uomParams?.unit
                                                          }
                                                        </StyledSecondaryText>
                                                      </Grid>
                                                    </Grid>
                                                  </TableCell>
                                                </TableBodyRow>
                                              );
                                            })}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    </Grid>
                                  )}
                                  {!!missingDataEvents?.length && (
                                    <Grid item xs={12}>
                                      <TableContainer>
                                        <Table style={{ minWidth: 500 }}>
                                          <TableHead>
                                            <TableHeadRow>
                                              <TableHeadCell
                                                style={{ width: 200 }}
                                              >
                                                {t('ui.common.event', 'Event')}
                                              </TableHeadCell>
                                              <TableHeadCell
                                                style={{ minWidth: 200 }}
                                              >
                                                {t(
                                                  'ui.assetDetailEvents.eventValues',
                                                  'Event Values'
                                                )}
                                              </TableHeadCell>
                                            </TableHeadRow>
                                          </TableHead>
                                          <TableBody>
                                            {missingDataEvents.map((event) => {
                                              const eventIndex =
                                                eventIdToIndexMapping?.[
                                                  event.dataChannelEventRuleId!
                                                ];
                                              const comparatorText =
                                                eventComparatorTypeTextMapping[
                                                  event.comparator!
                                                ];

                                              const eventValueFieldName = `dataChannels.${dataChannelIndex}.uomParams.eventRules.${eventIndex}.eventValue`;

                                              return (
                                                <TableBodyRow>
                                                  <TableCell>
                                                    <StyledEventText>
                                                      {event.description}
                                                    </StyledEventText>
                                                  </TableCell>
                                                  <TableCell>
                                                    <Grid
                                                      container
                                                      alignItems="center"
                                                      spacing={1}
                                                    >
                                                      <Grid item xs="auto">
                                                        <StyledFieldGroup>
                                                          <StyledComparatorText
                                                            fullWidth={false}
                                                            value={
                                                              comparatorText
                                                            }
                                                            InputProps={{
                                                              style: {
                                                                height: 40,
                                                                overflow:
                                                                  'hidden',
                                                                padding:
                                                                  '7px 9px',
                                                                textAlign:
                                                                  'center',
                                                              },
                                                            }}
                                                            disabled
                                                          />

                                                          <StyledTextField
                                                            fullWidth={false}
                                                            id={`${eventValueFieldName}-input`}
                                                            name={
                                                              eventValueFieldName
                                                            }
                                                            style={{
                                                              minWidth: 200,
                                                            }}
                                                            InputProps={{
                                                              style: {
                                                                height: 40,
                                                                overflow:
                                                                  'hidden',
                                                              },
                                                            }}
                                                            disabled
                                                          />
                                                        </StyledFieldGroup>
                                                      </Grid>
                                                      {/* <Grid item xs={9}>
                                                        <Field
                                                          id={`${eventValueFieldName}-input`}
                                                          name={
                                                            eventValueFieldName
                                                          }
                                                          type="number"
                                                          disabled
                                                          component={
                                                            CustomTextField
                                                          }
                                                          InputProps={{
                                                            startAdornment: (
                                                              <InputAdornment
                                                                position="start"
                                                                aria-label="Event comparator"
                                                              >
                                                                {comparatorText}
                                                              </InputAdornment>
                                                            ),
                                                          }}
                                                        />
                                                      </Grid> */}
                                                      <Grid item xs={3}>
                                                        <StyledSecondaryText>
                                                          {t(
                                                            'ui.common.minutes',
                                                            'Minutes'
                                                          )}
                                                        </StyledSecondaryText>
                                                      </Grid>
                                                    </Grid>
                                                  </TableCell>
                                                </TableBodyRow>
                                              );
                                            })}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    </Grid>
                                  )}

                                  {!!scheduledDeliveryEvents?.length && (
                                    <Grid item xs={12}>
                                      <TableContainer>
                                        <Table
                                          style={{
                                            minWidth: 500,
                                          }}
                                        >
                                          <TableHead>
                                            <TableHeadRow>
                                              <TableHeadCell
                                                style={{ width: 200 }}
                                              >
                                                {t('ui.common.event', 'Event')}
                                              </TableHeadCell>
                                              <TableHeadCell
                                                style={{ minWidth: 200 }}
                                              >
                                                {t(
                                                  'ui.assetDetailEvents.eventValues',
                                                  'Event Values'
                                                )}
                                              </TableHeadCell>
                                            </TableHeadRow>
                                          </TableHead>
                                          <TableBody>
                                            {scheduledDeliveryEvents?.map(
                                              (event) => {
                                                return (
                                                  <TableBodyRow>
                                                    <TableCell>
                                                      <StyledEventText>
                                                        {event.description}
                                                      </StyledEventText>
                                                    </TableCell>
                                                    <TableCell>
                                                      {/* 
                                          NOTE/TODO: 
                                          Assuming levelEvents were accidentally renamed from scheduledEvents
                                          eventValue has to be able to differentiate between Yes/No values and the number 
                                          type eventValues from the other event types 
                                        */}
                                                      <StyledTextField
                                                        select
                                                        value="yes"
                                                        disabled
                                                      >
                                                        <MenuItem value="yes">
                                                          {t(
                                                            'ui.common.yes',
                                                            'Yes'
                                                          )}
                                                        </MenuItem>
                                                      </StyledTextField>
                                                    </TableCell>
                                                  </TableBodyRow>
                                                );
                                              }
                                            )}
                                          </TableBody>
                                        </Table>
                                      </TableContainer>
                                    </Grid>
                                  )}
                                </>
                              );
                            }
                          )}
                        </>
                      );
                    }}
                  />
                </Grid>
              </Wrapper>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default EventsDrawer;
