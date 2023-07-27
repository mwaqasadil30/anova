/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import {
  CustomSiteIntegration1DataChannelDTO,
  DataChannelReportDTO,
  DigitalInputSensorCalibrationInfoDTO,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { useSaveDigitalSetupInfo } from 'containers/DataChannelEditor/hooks/useSaveDigitalSetupInfo';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import { StyledFieldLabelText } from '../../styles';
import DigitalSensorCalibrationFormEffect from './DigitalSensorCalibrationFormEffect';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { Values } from './types';

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  digitalInputSensorCalibration?: DigitalInputSensorCalibrationInfoDTO | null;
  cancelCallback: () => void;
  saveAndExitCallback?: () => void;
  openEventEditorWarningDialog: () => void;
}

const DigitalSensorCalibrationDrawer = ({
  dataChannelDetails,
  digitalInputSensorCalibration,
  cancelCallback,
  saveAndExitCallback,
  openEventEditorWarningDialog,
}: Props) => {
  const { t } = useTranslation();

  const [hasFormSubmitted, setHasFormSubmitted] = useState(false);

  const dispatch = useDispatch();
  const formattedInitialValues = formatInitialValues(
    digitalInputSensorCalibration
  );

  const queryClient = useQueryClient();
  const updateSaveDigitalSetupInfoApi = useSaveDigitalSetupInfo({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getDataChannelDetailsById);
    },
  });

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    setHasFormSubmitted(false);
    updateSaveDigitalSetupInfoApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return updateSaveDigitalSetupInfoApi
      .mutateAsync({
        ...formattedValuesForApi,
        dataChannelId: dataChannelDetails?.dataChannelId!,
      } as CustomSiteIntegration1DataChannelDTO)
      .then(() => {
        dispatch(enqueueSaveSuccessSnackbar(t));
        setHasFormSubmitted(true);
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, initialValues, submitForm, values }) => {
        return (
          <>
            <DigitalSensorCalibrationFormEffect
              values={values}
              initialValues={initialValues}
              dataChannelId={dataChannelDetails?.dataChannelId}
              hasFormSubmitted={hasFormSubmitted}
              openEventEditorWarningDialog={openEventEditorWarningDialog}
            />
            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  showSaveOptions
                  title={t('ui.dataChannel.digitalSetup', 'Digital Setup')}
                  cancelCallback={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={updateSaveDigitalSetupInfoApi.data}
                  submissionError={updateSaveDigitalSetupInfoApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>
            <Box mt={3} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.state0Limit', 'State 0 Limit')}
                      </StyledFieldLabelText>
                      <Field
                        id="state0Limit-input"
                        name="state0Limit"
                        type="number"
                        component={CustomTextField}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.state0Text', 'State 0 Text')}
                      </StyledFieldLabelText>
                      <Field
                        id="state0Text-input"
                        name="state0Text"
                        type="text"
                        component={CustomTextField}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.state1Limit', 'State 1 Limit')}
                      </StyledFieldLabelText>
                      <Field
                        id="state1Limit-input"
                        name="state1Limit"
                        type="number"
                        component={CustomTextField}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.state1Text', 'State 1 Text')}
                      </StyledFieldLabelText>
                      <Field
                        id="state1Text-input"
                        name="state1Text"
                        type="text"
                        component={CustomTextField}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.state2Limit', 'State 2 Limit')}
                      </StyledFieldLabelText>
                      <Field
                        id="state2Limit-input"
                        name="state2Limit"
                        type="number"
                        component={CustomTextField}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.state2Text', 'State 2 Text')}
                      </StyledFieldLabelText>
                      <Field
                        id="state2Text-input"
                        name="state2Text"
                        type="text"
                        component={CustomTextField}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.state3Limit', 'State 3 Limit')}
                      </StyledFieldLabelText>
                      <Field
                        id="state3Limit-input"
                        name="state3Limit"
                        type="number"
                        component={CustomTextField}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.state3Text', 'State 3 Text')}
                      </StyledFieldLabelText>
                      <Field
                        id="state3Text-input"
                        name="state3Text"
                        type="text"
                        component={CustomTextField}
                      />
                    </Grid>

                    <Grid item xs={8}>
                      <Field
                        id="invertData-input"
                        name="invertData"
                        component={SwitchWithLabel}
                        type="checkbox"
                        label={t('ui.datachannel.invertData', 'Invert Data')}
                      />
                    </Grid>
                  </Grid>
                </EditorBox>
              </Grid>
            </Grid>
          </>
        );
      }}
    </Formik>
  );
};

export default DigitalSensorCalibrationDrawer;
