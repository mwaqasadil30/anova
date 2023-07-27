/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DataChannelReportDTO,
  DataChannelSaveIntegrationProfileCollectionDTO,
  IntegrationProfileCollectionDTO,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageSubHeader from 'components/PageSubHeader';
import { useGetFtpDomains } from 'containers/DataChannelEditor/hooks/useGetFTPDomains';
import { useSaveIntegrationProfileInfo } from 'containers/DataChannelEditor/hooks/useSaveIntegrationProfileInfo';
import { Field, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import { StyledFieldLabelText, StyledValueText } from '../../styles';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { Values } from './types';

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  integrationInfoDetails?: IntegrationProfileCollectionDTO | null;
  cancelCallback: () => void;
  saveAndExitCallback?: () => void;
}

const IntegrationProfileTableDrawer = ({
  dataChannelDetails,
  integrationInfoDetails,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formattedInitialValues = formatInitialValues(integrationInfoDetails);

  const queryClient = useQueryClient();
  const updateIntegrationProfileInfoApi = useSaveIntegrationProfileInfo({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getDataChannelDetailsById);
    },
  });

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateIntegrationProfileInfoApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return updateIntegrationProfileInfoApi
      .mutateAsync({
        ...formattedValuesForApi,
        dataChannelId: dataChannelDetails?.dataChannelId!,
      } as DataChannelSaveIntegrationProfileCollectionDTO)
      .then(() => {
        dispatch(enqueueSaveSuccessSnackbar(t));
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const integrationIdText = t('ui.datachannel.id', 'ID');

  const getFtpDomainsApi = useGetFtpDomains();
  const ftpDomainsOptions = getFtpDomainsApi.data;

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      onSubmit={handleSubmit}
    >
      {({ values, isSubmitting, submitForm }) => {
        const integration1FtpFormatForSelectedDomain = ftpDomainsOptions?.ftpInfoModels?.find(
          (domain) =>
            domain.targetDomainId ===
              values.integrationProfile1.integrationDomainId &&
            domain.targetDomainFtpFileFormatAsText
        );

        const integration2FtpFormatForSelectedDomain = ftpDomainsOptions?.ftpInfoModels?.find(
          (domain) =>
            domain.targetDomainId ===
              values.integrationProfile2.integrationDomainId &&
            domain.targetDomainFtpFileFormatAsText
        );

        return (
          <>
            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  showSaveOptions
                  title={t(
                    'ui.dataChannel.integrationProfile',
                    'Integration Profile'
                  )}
                  cancelCallback={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={updateIntegrationProfileInfoApi.data}
                  submissionError={updateIntegrationProfileInfoApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>
            <Box mt={3} />
            <Grid container spacing={2} alignItems="center">
              {/* Integration 1 */}
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <PageSubHeader dense>
                      {`${t('ui.dataChannel.integration', 'Integration')} 1`}
                    </PageSubHeader>
                  </Grid>
                  <Grid item xs={12}>
                    <EditorBox>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.common.enabled', 'Enabled')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="integrationProfile1.isIntegrationEnabled-input"
                            name="integrationProfile1.isIntegrationEnabled"
                            component={SwitchWithLabel}
                            type="checkbox"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {integrationIdText}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="integrationProfile1.integrationId-input"
                            name="integrationProfile1.integrationId"
                            component={CustomTextField}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.datachannel.destination', 'Destination')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="integrationProfile1.integrationDomainId-input"
                            name="integrationProfile1.integrationDomainId"
                            component={CustomTextField}
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="">
                              <SelectItem />
                            </MenuItem>

                            {ftpDomainsOptions?.ftpInfoModels?.map((option) => (
                              <MenuItem
                                key={option.targetDomainId}
                                value={option.targetDomainId}
                              >
                                {option.targetDomainName}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.datachannel.formatType', 'Format Type')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <StyledValueText>
                            {
                              integration1FtpFormatForSelectedDomain?.targetDomainFtpFileFormatAsText
                            }
                          </StyledValueText>
                          {/* <Field
                            id="format1-input"
                            name="format1"
                            component={CustomTextField}
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>
                            TODO: Translations for the mapping may need to be verified
                            {ftpFileFormatOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field> */}
                        </Grid>
                      </Grid>
                    </EditorBox>
                  </Grid>
                </Grid>
              </Grid>

              {/* Integration 2 */}
              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <PageSubHeader dense>
                      {`${t('ui.dataChannel.integration', 'Integration')} 2`}
                    </PageSubHeader>
                  </Grid>
                  <Grid item xs={12}>
                    <EditorBox>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.common.enabled', 'Enabled')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="integrationProfile2.isIntegrationEnabled-input"
                            name="integrationProfile2.isIntegrationEnabled"
                            component={SwitchWithLabel}
                            type="checkbox"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {integrationIdText}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="integrationProfile2.integrationId-input"
                            name="integrationProfile2.integrationId"
                            component={CustomTextField}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.datachannel.destination', 'Destination')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="integrationProfile2.integrationDomainId-input"
                            name="integrationProfile2.integrationDomainId"
                            component={CustomTextField}
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="">
                              <SelectItem />
                            </MenuItem>

                            {ftpDomainsOptions?.ftpInfoModels?.map((option) => (
                              <MenuItem
                                key={option.targetDomainId}
                                value={option.targetDomainId}
                              >
                                {option.targetDomainName}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.datachannel.formatType', 'Format Type')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <StyledValueText>
                            {
                              integration2FtpFormatForSelectedDomain?.targetDomainFtpFileFormatAsText
                            }
                          </StyledValueText>
                          {/* <Field
                            id="format2-input"
                            name="format2"
                            component={CustomTextField}
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>
                            TODO: Translations for the mapping may need to be verified
                            {ftpFileFormatOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field> */}
                        </Grid>
                      </Grid>
                    </EditorBox>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        );
      }}
    </Formik>
  );
};

export default IntegrationProfileTableDrawer;
