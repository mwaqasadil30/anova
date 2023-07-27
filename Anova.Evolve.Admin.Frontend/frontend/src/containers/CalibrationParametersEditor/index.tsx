import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { EditDataChannelOptions } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { SubmissionResult } from 'form-utils/types';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import { parseResponseError } from 'utils/api/handlers';
import ObjectForm from './components/ObjectForm';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import { SaveRequest, SaveResponse } from './types';

const mapApiErrorsToFields = (errors: any) => {
  if (!errors) {
    return null;
  }

  // NOTE: This helper is to be used if we need to map back-end errors to
  // front-end formik fields
  return { ...errors };
};

interface Props {
  initialValues: any;
  options?: EditDataChannelOptions | null;
  dataChannelId?: string;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  cancelCallback?: () => void;
  saveCallback?: (response: SaveResponse) => void;
  saveAndExitCallback?: (response: SaveResponse) => void;
}

const CalibrationParametersEditor = ({
  initialValues,
  options,
  dataChannelId,
  headerNavButton,
  isInlineForm,
  cancelCallback,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<
    SubmissionResult<SaveResponse>
  >();
  const [submissionError, setSubmissionError] = useState<any>();

  const domainId = useSelector(selectActiveDomainId);

  const isCreating = !dataChannelId;

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    return AdminApiService.DataChannelService.saveLevelDataChannelCalibrationInfo_SaveLevelDataChannelCalibrationInfo(
      // @ts-ignore
      {
        domainId,
        dataChannelId,
        scalingMode: values.scalingMode,
        rawUnits: values.rawUnits,
        rawUnitsAtZero: values.rawUnitsAtZero,
        rawUnitsAtFullScale: values.rawUnitsAtFullScale,
        rawUnitsAtScaledMin: values.rawUnitsAtScaledMin,
        rawUnitsAtScaledMax: values.rawUnitsAtScaledMax,
        rawUnitsAtUnderRange: values.rawUnitsAtUnderRange,
        rawUnitsAtOverRange: values.rawUnitsAtOverRange,
        isDataInverted: values.isDataInverted,
        scaledMax: values.scaledMax,
        scaledMin: values.scaledMin,
      } as Omit<SaveRequest, 'init' | 'toJSON'>
    )
      .then((response) => {
        const successResult = { response };
        setSubmissionResult(successResult);
        return successResult;
      })
      .catch((error) => {
        const errorResult = parseResponseError(error);
        if (errorResult) {
          const formattedErrors = mapApiErrorsToFields(errorResult.errors);

          formikBag.setErrors(formattedErrors);
          formikBag.setStatus({ errors: formattedErrors });
          setSubmissionResult(errorResult);
        } else {
          setSubmissionError(error);
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleFormChange = (formik: FormikProps<Values>) => {
    setFormInstance(formik);
  };

  return (
    <>
      <PageIntroWrapper
        sticky
        isWithinDrawer={isInlineForm}
        {...(isInlineForm && { topOffset: 0 })}
      >
        <PageIntro
          isCreating={isCreating}
          isSubmitting={isSubmitting}
          submissionResult={submissionResult}
          submitForm={formInstance?.submitForm}
          headerNavButton={headerNavButton}
          cancelCallback={cancelCallback}
          saveCallback={saveCallback}
          saveAndExitCallback={saveAndExitCallback}
          isInlineForm={isInlineForm}
        />
      </PageIntroWrapper>
      <Grid item xs={12}>
        <Box mt={3}>
          <Grid
            container
            spacing={2}
            direction="column"
            justify="space-between"
          >
            <Grid item>
              <ObjectForm
                initialValues={initialValues}
                options={options}
                onSubmit={handleSubmit}
                handleFormChange={handleFormChange}
                submissionError={submissionError}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </>
  );
};

export default CalibrationParametersEditor;
