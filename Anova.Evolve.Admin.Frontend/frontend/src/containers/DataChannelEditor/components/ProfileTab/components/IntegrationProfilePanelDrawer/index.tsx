/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  CustomIntegration1DTO,
  CustomSiteIntegration1DataChannelDTO,
  DataChannelReportDTO,
  SiteInfoDto,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import AirProductsSiteAutocomplete from 'components/forms/form-fields/AirProductsSiteAutocomplete';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { useSaveApciCustomIntegration } from 'containers/DataChannelEditor/hooks/useSaveApciCustomIntegration';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import styled from 'styled-components';
import { getAPCITankFunctionTypeOptionsForIntegrationInfo } from 'utils/i18n/enum-to-text';
import { StyledFieldLabelText } from '../../styles';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { Values } from './types';

const StyledValueText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  customIntegration1?: CustomIntegration1DTO | null;
  canDisplayExtraInfo?: boolean;
  cancelCallback: () => void;
  saveAndExitCallback?: () => void;
}

const IntegrationProfilePanelDrawer = ({
  dataChannelDetails,
  customIntegration1,
  canDisplayExtraInfo,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const formattedInitialValues = formatInitialValues(customIntegration1);

  const queryClient = useQueryClient();
  const updateCustomIntegration1InfoApi = useSaveApciCustomIntegration({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getDataChannelDetailsById);
    },
  });

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateCustomIntegration1InfoApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);

    return updateCustomIntegration1InfoApi
      .mutateAsync({
        ...formattedValuesForApi,
        dataChannelId: dataChannelDetails?.dataChannelId!,
      } as CustomSiteIntegration1DataChannelDTO)
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

  const APCITankFunctionTypeOptions = getAPCITankFunctionTypeOptionsForIntegrationInfo(
    t
  );

  const initialSelectedSiteId = customIntegration1?.shipTo // renamed to siteNumber
    ? SiteInfoDto.fromJS({
        siteNumber: customIntegration1.shipTo,
        customerName: customIntegration1.customerName,
        address1: customIntegration1.customerAddress1,
      })
    : null;
  const [selectedSiteId, setSelectedSiteId] = useState<SiteInfoDto | null>(
    initialSelectedSiteId
  );

  const siteCustomerName = selectedSiteId
    ? selectedSiteId.customerName
    : customIntegration1?.customerName || '';

  const siteAddress = selectedSiteId
    ? selectedSiteId.address1
    : customIntegration1?.customerAddress1 || '';

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => {
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
                  submissionResult={updateCustomIntegration1InfoApi.data}
                  submissionError={updateCustomIntegration1InfoApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>
            <Box mt={3} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.apci.siteNumber', 'Site Number')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={8}>
                      <Field
                        id="siteNumber-input"
                        name="siteNumber"
                        component={AirProductsSiteAutocomplete}
                        selectedOption={selectedSiteId}
                        onChange={setSelectedSiteId}
                        textFieldProps={{
                          placeholder: t(
                            'ui.common.enterSearchCriteria',
                            'Enter Search Criteria...'
                          ),
                        }}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.dataChannel.customer', 'Customer')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={8}>
                      <StyledValueText>
                        {selectedSiteId ? siteCustomerName : ''}
                      </StyledValueText>
                    </Grid>

                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.common.address', 'Address')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={8}>
                      <StyledValueText>
                        {selectedSiteId ? siteAddress : ''}
                      </StyledValueText>
                    </Grid>
                    {canDisplayExtraInfo && (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.apci.tankfunction', 'Tank Function')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="tankFunctionTypeId-input"
                            name="tankFunctionTypeId"
                            component={CustomTextField}
                            select
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="">
                              <SelectItem />
                            </MenuItem>
                            {APCITankFunctionTypeOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t(
                              'ui.dataChannel.enableSendReadingsToLbShell',
                              'Enable Send Readings to LBShell'
                            )}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="isSendEnabled-input"
                            name="isSendEnabled"
                            component={SwitchWithLabel}
                            type="checkbox"
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.datachannel.scaledunits', 'Scaled Units')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <StyledValueText>
                            {customIntegration1?.airProductsUnitTypeAsText}
                          </StyledValueText>
                        </Grid>
                      </>
                    )}
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

export default IntegrationProfilePanelDrawer;
