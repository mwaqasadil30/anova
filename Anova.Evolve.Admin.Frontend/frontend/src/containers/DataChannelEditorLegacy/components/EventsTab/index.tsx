import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  EditDataChannelOptions,
  EvolveDataChannelEventsInfo,
} from 'api/admin/api';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import { Field, FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Values } from '../ObjectForm/types';
import CustomAccordion from './components/CustomAccordion';

interface Props {
  eventsData?: EvolveDataChannelEventsInfo | null;
  options?: EditDataChannelOptions | null;
  values: Values;
  displayUnitsText: string;
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

const EventsTab = ({
  eventsData,
  options,
  values,
  displayUnitsText,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();

  const eventRuleGroups = options?.eventRuleGroups;

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Field
          id="eventRuleGroupId-input"
          name="eventRuleGroupId"
          component={CustomTextField}
          label={t('ui.common.eventrulegroup', 'Event Rule Group')}
          select
          required
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="" disabled>
            <SelectItem />
          </MenuItem>
          {eventRuleGroups?.map((eventRuleGroup) => (
            <MenuItem
              key={eventRuleGroup.eventRuleGroupId}
              value={eventRuleGroup.eventRuleGroupId}
            >
              {eventRuleGroup.description}
            </MenuItem>
          ))}
        </Field>
      </Grid>
      <Grid item xs={12}>
        <CustomAccordion
          displayUnitsText={displayUnitsText}
          values={values}
          options={options}
          eventRuleInfo={eventsData}
          setFieldValue={setFieldValue}
        />
      </Grid>
    </Grid>
  );
};

export default EventsTab;
