/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { RtuDeviceType, UserPermissionType } from 'api/admin/api';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import KeyboardDatePicker from 'components/forms/form-fields/KeyboardDatePicker';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { useGetRtuNotes } from './hooks/useGetRtuNotes';
import { useSaveRtuNotes } from './hooks/useSaveRtuNotes';
import { Values } from './types';

const StyledFieldLabelText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

interface Props {
  rtuType?: RtuDeviceType | null;
  rtuDeviceId?: string | null;
  closeDrawer: () => void;
  fetchRecords: () => void;
}

const RtuNotesDrawer = ({
  rtuType,
  rtuDeviceId,
  closeDrawer,
  fetchRecords,
}: Props) => {
  const { t } = useTranslation();

  const isSmsRtuType =
    rtuType === RtuDeviceType.FFD ||
    rtuType === RtuDeviceType.FFB ||
    rtuType === RtuDeviceType.FFE ||
    rtuType === RtuDeviceType.FF6 ||
    rtuType === RtuDeviceType.FF9 ||
    rtuType === RtuDeviceType.FF70 ||
    rtuType === RtuDeviceType.FFA ||
    rtuType === RtuDeviceType.FF8 ||
    rtuType === RtuDeviceType.FF1 ||
    rtuType === RtuDeviceType.FF4 ||
    rtuType === RtuDeviceType.FF78 ||
    rtuType === RtuDeviceType.FF74 ||
    rtuType === RtuDeviceType.FF7F ||
    rtuType === RtuDeviceType.FF79 ||
    rtuType === RtuDeviceType.FF7E ||
    rtuType === RtuDeviceType.FF7D ||
    rtuType === RtuDeviceType.FF71 ||
    rtuType === RtuDeviceType.FF7A ||
    rtuType === RtuDeviceType.FF7B ||
    rtuType === RtuDeviceType.FF75 ||
    rtuType === RtuDeviceType.FF72 ||
    rtuType === RtuDeviceType.FF73 ||
    rtuType === RtuDeviceType.FF7C ||
    rtuType === RtuDeviceType.FF17 ||
    rtuType === RtuDeviceType.TrippleHash ||
    rtuType === RtuDeviceType.Demo4Channel ||
    rtuType === RtuDeviceType.FakeWired4Channel;

  const isCloverRtuType =
    rtuType === RtuDeviceType.Compak || rtuType === RtuDeviceType.Infact;

  const isModbusRtuType =
    rtuType === RtuDeviceType.FE ||
    rtuType === RtuDeviceType.FE0 ||
    rtuType === RtuDeviceType.FA;

  const isMetron2RtuType = rtuType === RtuDeviceType.Metron2;

  const isHornerRtuType = rtuType === RtuDeviceType.Horner;

  const isFileRtuType =
    rtuType === RtuDeviceType.File ||
    rtuType === RtuDeviceType.KT09 ||
    rtuType === RtuDeviceType.EaglePaymeter ||
    rtuType === RtuDeviceType.GGPlant;

  const is400SeriesRtuType =
    rtuType === RtuDeviceType.DP489 ||
    rtuType === RtuDeviceType.BC474 ||
    rtuType === RtuDeviceType.GU476 ||
    rtuType === RtuDeviceType.EG501 ||
    rtuType === RtuDeviceType.LC490;

  const hasPermission = useSelector(selectHasPermission);
  const canUpdateRTU400SeriesEditor =
    hasPermission(UserPermissionType.RTU400SeriesEditor, AccessType.Update) &&
    is400SeriesRtuType;

  const canUpdateRTUFileEditor =
    hasPermission(UserPermissionType.RTUFileEditor, AccessType.Update) &&
    isFileRtuType;

  const canUpdateRTUHornerEditor =
    hasPermission(UserPermissionType.RTUHornerEditor, AccessType.Update) &&
    isHornerRtuType;

  const canUpdateRTUCloverEditor =
    hasPermission(UserPermissionType.RTUCloverEditor, AccessType.Update) &&
    isCloverRtuType;

  const canUpdateRTUMetron2Editor =
    hasPermission(UserPermissionType.RTUMetron2Editor, AccessType.Update) &&
    isMetron2RtuType;

  // MODBUS Rtu
  const canUpdateRTUWiredEditor =
    hasPermission(UserPermissionType.RTUWiredEditor, AccessType.Update) &&
    isModbusRtuType;

  // SMS Rtu
  const canUpdateRtuWirelessEditor =
    hasPermission(UserPermissionType.RtuWirelessEditor, AccessType.Update) &&
    isSmsRtuType;

  const canUpdateRtuNotes =
    canUpdateRTU400SeriesEditor ||
    canUpdateRTUFileEditor ||
    canUpdateRTUHornerEditor ||
    canUpdateRTUCloverEditor ||
    canUpdateRTUMetron2Editor ||
    canUpdateRTUWiredEditor ||
    canUpdateRtuWirelessEditor;

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const getRtuNotesApi = useGetRtuNotes(rtuDeviceId!);

  const { data, isFetching, isError } = getRtuNotesApi;

  const formattedInitialValues = formatInitialValues(data);

  const saveRtuNotesApi = useSaveRtuNotes();
  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    saveRtuNotesApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);

    return saveRtuNotesApi
      .mutateAsync({
        rtuDeviceId: rtuDeviceId!,
        rtuNotesInfo: formattedValuesForApi,
      })
      .then(() => {
        closeDrawer();
        fetchRecords();
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const commonPageIntroProps = {
    showSaveOptions: true,
    cancelCallback: closeDrawer,
  };

  if (isFetching || isError) {
    return (
      <>
        <CustomThemeProvider forceThemeType="dark">
          <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
            <EditorPageIntro
              {...commonPageIntroProps}
              disableSaveAndExit
              saveAndExitCallback={() => {}}
              showSaveOptions={canUpdateRtuNotes}
            />
          </PageIntroWrapper>
        </CustomThemeProvider>

        <Box mt={3}>
          <TransitionLoadingSpinner in={isFetching} />
          <TransitionErrorMessage in={!isFetching && isError} />
        </Box>
      </>
    );
  }

  const formattedRtuNotesDrawerTitle = rtuDeviceId
    ? `${t('ui.rtu.rtuNotes', 'RTU Notes')} - ${rtuDeviceId}`
    : t('ui.rtu.rtuNotes', 'RTU Notes');

  return (
    <>
      <Formik initialValues={formattedInitialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, submitForm }) => {
          return (
            <Form>
              <CustomThemeProvider forceThemeType="dark">
                <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                  <EditorPageIntro
                    {...commonPageIntroProps}
                    submitForm={submitForm}
                    isSubmitting={isSubmitting}
                    submissionError={saveRtuNotesApi.error}
                    saveAndExitCallback={() => {}}
                    disableSaveAndExit={isFetching}
                    title={formattedRtuNotesDrawerTitle}
                    showSaveOptions={canUpdateRtuNotes}
                  />
                </PageIntroWrapper>
              </CustomThemeProvider>

              <Box mt={2} />
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <EditorBox>
                    <Grid container spacing={2} alignItems="center">
                      {isAirProductsEnabledDomain && (
                        <>
                          <Grid item xs={4}>
                            <StyledFieldLabelText>
                              {t(
                                'ui.rtu.installationdate',
                                'Installation Date'
                              )}
                            </StyledFieldLabelText>
                          </Grid>
                          <Grid item xs={8}>
                            <Field
                              id="installationDate-input"
                              name="installationDate"
                              component={KeyboardDatePicker}
                              KeyboardButtonProps={{
                                'aria-label': 'change installation date',
                              }}
                              PopoverProps={{ id: 'installation date popover' }}
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <StyledFieldLabelText>
                              {t(
                                'ui.rtu.modeldescription',
                                'Model Description'
                              )}
                            </StyledFieldLabelText>
                          </Grid>
                          <Grid item xs={8}>
                            <Field
                              id="modelDescription-input"
                              name="modelDescription"
                              component={CustomTextField}
                              disabled={
                                isSubmitting || isFetching || !canUpdateRtuNotes
                              }
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <StyledFieldLabelText>
                              {t(
                                'ui.rtu.functionallocation',
                                'Functional Location'
                              )}
                            </StyledFieldLabelText>
                          </Grid>
                          <Grid item xs={8}>
                            <Field
                              id="functionalLocation-input"
                              name="functionalLocation"
                              component={CustomTextField}
                              disabled={
                                isSubmitting || isFetching || !canUpdateRtuNotes
                              }
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <StyledFieldLabelText>
                              {t('ui.rtu.simiccid', 'SIM ICCID')}
                            </StyledFieldLabelText>
                          </Grid>
                          <Grid item xs={8}>
                            <Field
                              id="simIccId-input"
                              name="simIccId"
                              component={CustomTextField}
                              disabled={
                                isSubmitting || isFetching || !canUpdateRtuNotes
                              }
                            />
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12}>
                        <Field
                          id="temporaryNotes-input"
                          name="temporaryNotes"
                          label={t('ui.rtu.temporarynotes', 'Temporary Notes')}
                          multiline
                          rows={8}
                          component={CustomTextField}
                          disabled={
                            isSubmitting || isFetching || !canUpdateRtuNotes
                          }
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          id="permanentNotes-input"
                          name="permanentNotes"
                          // Renamed from "Permanent Notes"
                          label={t('ui.common.notes', 'Notes')}
                          multiline
                          rows={8}
                          component={CustomTextField}
                          disabled={
                            isSubmitting || isFetching || !canUpdateRtuNotes
                          }
                        />
                      </Grid>
                    </Grid>
                  </EditorBox>
                </Grid>
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default RtuNotesDrawer;
