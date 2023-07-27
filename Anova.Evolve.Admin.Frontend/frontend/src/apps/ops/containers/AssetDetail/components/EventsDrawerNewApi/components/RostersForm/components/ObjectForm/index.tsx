import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  QeerBaseDto,
  EventRuleCategory,
  RosterSummaryDto,
} from 'api/admin/api';
import { ReactComponent as AddIcon } from 'assets/icons/icon-add.svg';
import { ReactComponent as RemoveOutlinedDarkIcon } from 'assets/icons/icon-remove.svg';
import Button from 'components/Button';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageSubHeader from 'components/PageSubHeader';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import { Field, FieldArray, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { defaultTextColor } from 'styles/colours';
import { Values } from './types';

const StyledEmptyText = styled(Typography)`
  font-weight: 500;
  color: ${defaultTextColor};
`;

const defaultRoster = {
  rosterId: '',
};

const getEventTypeText = (t: TFunction, eventRuleType?: EventRuleCategory) => {
  switch (eventRuleType) {
    case EventRuleCategory.Level:
      return t('ui.datachanneleventrule.levelEventSingular', 'Level Event');
    case EventRuleCategory.UsageRate:
      return t('ui.datachanneleventrule.usagerateSingular', 'Usage Rate Event');
    case EventRuleCategory.ScheduledDeliveryMissed:
    case EventRuleCategory.ScheduledDeliveryTooEarly:
    case EventRuleCategory.ScheduledDeliveryTooLate:
      return t(
        'ui.datachanneleventrule.scheduledDeliveryEventSingular',
        'Scheduled Delivery Event'
      );
    case EventRuleCategory.MissingData:
      return t(
        'ui.datachanneleventrule.missingDataEventSingular',
        'Missing Data Event'
      );
    default:
      return t('ui.common.event', 'Event');
  }
};

interface Props {
  allRosters?: RosterSummaryDto[];
  eventRule: QeerBaseDto;
  eventRuleType?: EventRuleCategory;
  isSubmitting: boolean;
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

const ObjectForm = ({
  isSubmitting,
  allRosters,
  eventRule,
  eventRuleType,
}: Props) => {
  const { t } = useTranslation();

  const rosterColumnWidth = 400;
  const actionsColumnWidth = 140;

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <PageSubHeader dense>
          {getEventTypeText(t, eventRuleType)}
          {': '}
          <span aria-label="Event description">{eventRule.description}</span>
        </PageSubHeader>
      </Grid>

      <Grid item xs={12}>
        <FieldArray
          name="rosters"
          render={(arrayHelpers) => {
            const selectedRosters = (arrayHelpers.form.values as Values)
              .rosters;
            return (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableHeadRow>
                          <TableHeadCell
                            style={{
                              width: rosterColumnWidth,
                              maxWidth: rosterColumnWidth,
                            }}
                          >
                            {t('ui.main.roster', 'Roster')}
                          </TableHeadCell>
                          <TableHeadCell
                            style={{
                              width: actionsColumnWidth,
                              maxWidth: actionsColumnWidth,
                            }}
                          >
                            {t('ui.assetDetailEvents.actions', 'Actions')}
                          </TableHeadCell>
                        </TableHeadRow>
                      </TableHead>
                      <TableBody>
                        {!selectedRosters?.length ? (
                          <TableBodyRow>
                            <TableCell colSpan={2}>
                              <StyledEmptyText>
                                {t(
                                  'ui.datachanneleventrule.noRostersAdded',
                                  'No rosters added'
                                )}
                              </StyledEmptyText>
                            </TableCell>
                          </TableBodyRow>
                        ) : (
                          selectedRosters?.map((roster, index) => {
                            // Get all selected roster IDs, except the one that
                            // is current selected in this row
                            const selectedRosterIds = selectedRosters
                              ?.filter(
                                (selectedRoster) =>
                                  selectedRoster.rosterId !== roster.rosterId
                              )
                              .map((selectedRoster) => selectedRoster.rosterId);

                            // Get rosters that can be selected. Note that the
                            // one that is currently selected in this row
                            // should still be visible (to be rendered in the
                            // dropdown).
                            const selectableRosters = allRosters?.filter(
                              (rosterOption) =>
                                !selectedRosterIds.includes(
                                  rosterOption.rosterId!
                                )
                            );

                            return (
                              <TableBodyRow key={index}>
                                <TableCell
                                  style={{ maxWidth: rosterColumnWidth }}
                                >
                                  <Field
                                    id={`rosters.${index}.rosterId-input`}
                                    name={`rosters.${index}.rosterId`}
                                    component={CustomTextField}
                                    select
                                    SelectProps={{ displayEmpty: true }}
                                  >
                                    <MenuItem value="">
                                      <SelectItem />
                                    </MenuItem>
                                    {selectableRosters?.map((rosterOption) => (
                                      <MenuItem
                                        key={rosterOption.rosterId}
                                        value={rosterOption.rosterId}
                                      >
                                        {rosterOption.description}
                                      </MenuItem>
                                    ))}
                                  </Field>
                                </TableCell>
                                <TableCell
                                  style={{ maxWidth: actionsColumnWidth }}
                                >
                                  <Button
                                    variant="text"
                                    useDomainColorForIcon
                                    startIcon={<RemoveOutlinedDarkIcon />}
                                    disabled={isSubmitting}
                                    onClick={() => {
                                      arrayHelpers.remove(index);
                                    }}
                                  >
                                    {t('ui.common.remove', 'Remove')}
                                  </Button>
                                </TableCell>
                              </TableBodyRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="text"
                    useDomainColorForIcon
                    startIcon={<AddIcon />}
                    disabled={isSubmitting}
                    onClick={() => {
                      arrayHelpers.push(defaultRoster);
                    }}
                  >
                    {t('ui.datachanneleventrule.addRoster', 'Add Roster')}
                  </Button>
                </Grid>
              </Grid>
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ObjectForm;
