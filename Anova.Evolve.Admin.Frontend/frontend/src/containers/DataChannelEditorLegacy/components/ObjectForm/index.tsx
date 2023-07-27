/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import {
  EditDataChannelOptions,
  EvolveDataChannelEventsInfo,
  LevelDataChannelGeneralInfo,
  RTUChannelUsageInfo,
  SourceDataChannelDefaultsInfo,
} from 'api/admin/api';
import EntityDetails from 'components/EntityDetails';
import FormikEffect from 'components/forms/FormikEffect';
import FullPageLoadingOverlay from 'components/FullPageLoadingOverlay';
import { DataChannelEditorTabs } from 'containers/DataChannelEditorLegacy/types';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'utils/format/numbers';
import { fieldIsRequired } from 'utils/forms/errors';
import { getNumberValue } from 'utils/forms/values';
import { buildUnitsOfMeasureTextMapping } from 'utils/i18n/enum-to-text';
import * as Yup from 'yup';
import EventsTab from '../EventsTab';
import FormChangeEffect from '../FormChangeEffect';
import GeneralTab from '../GeneralTab';
import HistoryTab from '../HistoryTab';
import PublishTab from '../PublishTab';
import {
  dataChannelEventInfoToFormValues,
  dataChannelToFormValues,
} from './helpers';
import { Values } from './types';

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const eventRuleHoursRangeText = t(
    'validate.datachanneleventrule.invalidHoursRange',
    'Hours must be between 0 and 168.'
  );
  const eventRuleMinutesRangeText = t(
    'validate.datachanneleventrule.invalidHoursRange',
    'Minutes must be between 0 and 59.'
  );
  const eventDelayPeriodHoursRangeText = t(
    'validate.datachanneleventrule.eventrulevaluerange.delay.hours',
    'Event Rule Delay Hours must be between 0 and 168.'
  );
  const eventDelayPeriodMinutesRangeText = t(
    'validate.datachanneleventrule.eventrulevaluerange.delay.minutes',
    'Event Rule Delay Minutes must be between 0 and 59.'
  );
  return Yup.object().shape({
    description: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.descriptionText))
      .required(fieldIsRequired(t, translationTexts.descriptionText)),
    levelEventRules: Yup.array().of(
      Yup.object().shape({
        hours: Yup.number()
          .typeError(eventDelayPeriodHoursRangeText)
          .min(0, eventDelayPeriodHoursRangeText)
          .max(168, eventDelayPeriodHoursRangeText),
        minutes: Yup.number()
          .typeError(eventDelayPeriodMinutesRangeText)
          .min(0, eventDelayPeriodMinutesRangeText)
          .max(59, eventDelayPeriodMinutesRangeText),
      })
    ),
    usageRateEventRules: Yup.array().of(
      Yup.object().shape({
        hours: Yup.number()
          .typeError(eventRuleHoursRangeText)
          .min(0, eventRuleHoursRangeText)
          .max(168, eventRuleHoursRangeText),
        minutes: Yup.number()
          .typeError(eventRuleMinutesRangeText)
          .min(0, eventRuleMinutesRangeText)
          .max(59, eventRuleMinutesRangeText),
      })
    ),
    missingDataEventRules: Yup.array().of(
      Yup.object().shape({
        hours: Yup.number()
          .typeError(eventRuleHoursRangeText)
          .min(0, eventRuleHoursRangeText)
          .max(168, eventRuleHoursRangeText),
        minutes: Yup.number()
          .typeError(eventRuleMinutesRangeText)
          .min(0, eventRuleMinutesRangeText)
          .max(59, eventRuleMinutesRangeText),
      })
    ),
  });
};

interface Props {
  initialValues?: LevelDataChannelGeneralInfo | null;
  eventsData?: EvolveDataChannelEventsInfo | null;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  isInlineForm?: boolean;
  domainId?: string;
  dataChannelId?: string;
  options?: EditDataChannelOptions | null;
  activeTab: DataChannelEditorTabs;
  dataChannelTypeText?: string;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
}

const ObjectForm = ({
  initialValues,
  eventsData,
  restoreInitialValues,
  domainId,
  dataChannelId,
  restoreTouchedFields,
  options,
  activeTab,
  dataChannelTypeText,
  handleFormChange,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const descriptionText = t('ui.common.description', 'Description');
  const unitsOfMeasureTextMapping = buildUnitsOfMeasureTextMapping(t);

  const validationSchema = buildValidationSchema(t, {
    descriptionText,
  });

  const displayDecimalPlaces =
    getNumberValue(initialValues?.displayDecimalPlaces) || 0;

  const formattedGeneralInitialValues = dataChannelToFormValues(initialValues);
  const formattedEventInitialValues = dataChannelEventInfoToFormValues(
    eventsData,
    { decimalPlaces: displayDecimalPlaces }
  );

  const formattedInitialValues = {
    ...formattedGeneralInitialValues,
    ...formattedEventInitialValues,
  };

  const [sourceDataChannelDetails, setSourceDataChannelDetails] = useState<
    SourceDataChannelDefaultsInfo | null | undefined
  >(null);
  const [rtuChannelsFromRtu, setRtuChannelsFromRtu] = useState<
    RTUChannelUsageInfo[] | null | undefined
  >();

  return (
    <Formik<Values>
      // NOTE: Using `enableReinitialize` could cause the resetForm method to
      // not work. Instead, we're resetting the form by re-fetching the
      // required data to edit the form, and unmounting then mounting the form
      // again so that the initialValues passed from the parent are used
      // correctly
      initialValues={formattedInitialValues}
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, setValues, setFieldValue }) => {
        const scaledUnitsText =
          values.isTankDimensionsSet && isNumber(values.scaledUnits)
            ? // @ts-ignore
              (unitsOfMeasureTextMapping[values.scaledUnits] as
                | string
                | undefined) || ''
            : values.scaledUnitsAsText;
        const displayUnitsText =
          !values.isTankDimensionsSet && !values.setReadingDisplayOptions
            ? scaledUnitsText
            : // @ts-ignore
              (unitsOfMeasureTextMapping[values.displayUnits] as
                | string
                | undefined) || '';

        return (
          <>
            {isSubmitting && <FullPageLoadingOverlay />}
            <FormikEffect
              onChange={handleFormChange}
              isValid={isValid}
              restoreTouchedFields={restoreTouchedFields}
              restoreInitialValues={restoreInitialValues}
            />

            {/*
            Detect changes in form fields to handle for business logic
          */}
            <FormChangeEffect
              setRtuChannelsFromRtu={setRtuChannelsFromRtu}
              setFieldValue={setFieldValue}
              rtuChannelsFromRtu={rtuChannelsFromRtu}
              integrationDomains={options?.domainIntegrationInfo}
              sourceDataChannelDetails={sourceDataChannelDetails}
              setSourceDataChannelDetails={setSourceDataChannelDetails}
              values={values}
              options={options}
              dataChannelId={dataChannelId}
            />

            <Form>
              {activeTab === DataChannelEditorTabs.General && (
                <GeneralTab
                  values={values}
                  setValues={setValues}
                  setFieldValue={setFieldValue}
                  domainId={domainId}
                  dataChannelId={dataChannelId}
                  options={options}
                  rtuChannelsFromRtu={rtuChannelsFromRtu}
                  dataChannelTypeText={dataChannelTypeText}
                />
              )}
              {activeTab === DataChannelEditorTabs.Events && (
                <EventsTab
                  eventsData={eventsData}
                  values={values}
                  options={options}
                  setFieldValue={setFieldValue}
                  displayUnitsText={displayUnitsText}
                />
              )}
              {activeTab === DataChannelEditorTabs.Publish && <PublishTab />}
              {activeTab === DataChannelEditorTabs.History && <HistoryTab />}
            </Form>

            <Box mt={8}>
              <EntityDetails details={values} />
            </Box>
          </>
        );
      }}
    </Formik>
  );
};

export default ObjectForm;
