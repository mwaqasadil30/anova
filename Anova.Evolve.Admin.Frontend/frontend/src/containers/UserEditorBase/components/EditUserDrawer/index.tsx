import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { CreateB2cUserResponse, UserDto } from 'api/admin/api';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { Field, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  buildValidationSchema,
  mapApiErrorsToFields,
} from '../../addOrEditUserHelpers';
import { useUpdateB2cUser } from '../../hooks/useUpdateB2cUser';
import { formatInitialValues, formatValuesForApi } from './helpers';
import { Values } from './types';

const StyledFieldLabelText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

interface Props {
  userDetails?: UserDto | null;
  cancelCallback: () => void;
  saveAndExitCallback?: (response: CreateB2cUserResponse) => void;
}

const EditUserDrawer = ({
  userDetails,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();

  const validationSchema = buildValidationSchema(t);
  const formattedInitialValues = formatInitialValues(userDetails);

  const updateB2cUserApi = useUpdateB2cUser();

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateB2cUserApi.reset();
    const formattedValuesForApi = formatValuesForApi(values, userDetails);
    return updateB2cUserApi
      .mutateAsync(formattedValuesForApi)
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const emailSuffixOptions = userDetails?.associatedEmailSuffixes || [];

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      validationSchema={validationSchema}
      validateOnBlur={false}
      validateOnChange={false}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => {
        return (
          <>
            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  showSaveOptions
                  title={t('ui.userEditor.editUser', 'Edit User')}
                  cancelCallback={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={updateB2cUserApi.data}
                  submissionError={updateB2cUserApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>
            <Box mt={3} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={3}>
                      <StyledFieldLabelText>
                        {t('ui.events.emailaddress', 'Email Address')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={9}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid
                          item
                          xs={emailSuffixOptions.length > 0 ? undefined : 12}
                        >
                          <Field
                            id="emailAddress-input"
                            name="emailAddress"
                            component={CustomTextField}
                            style={{
                              width:
                                emailSuffixOptions.length > 0 ? 175 : undefined,
                            }}
                          />
                        </Grid>
                        {emailSuffixOptions.length > 0 && (
                          <>
                            <Grid item>
                              <Typography>@</Typography>
                            </Grid>
                            <Grid item xs>
                              <Field
                                id="emailDomain-input"
                                name="emailDomain"
                                component={CustomTextField}
                                select
                                SelectProps={{ displayEmpty: true }}
                              >
                                <MenuItem value="" disabled>
                                  <SelectItem />
                                </MenuItem>
                                {emailSuffixOptions?.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </Grid>

                    <Grid item xs={3}>
                      <StyledFieldLabelText>
                        {t('ui.userEditor.firstName', 'First Name')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={9}>
                      <Field
                        id="firstName-input"
                        name="firstName"
                        component={CustomTextField}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <StyledFieldLabelText>
                        {t('ui.userEditor.lastName', 'Last Name')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={9}>
                      <Field
                        id="lastName-input"
                        name="lastName"
                        component={CustomTextField}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <StyledFieldLabelText>
                        {t('ui.userEditor.companyName', 'Company Name')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={9}>
                      <Field
                        id="company-input"
                        name="company"
                        component={CustomTextField}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <StyledFieldLabelText>
                        {t(
                          'ui.userEditor.applicationTimeout',
                          'Application Timeout'
                        )}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={9}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Field
                            id="applicationTimeoutHours-input"
                            name="applicationTimeoutHours"
                            type="number"
                            component={CustomTextField}
                            style={{ width: 100 }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography>
                            {t('ui.common.hoursShort', 'hrs')}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Field
                            id="applicationTimeoutMinutes-input"
                            name="applicationTimeoutMinutes"
                            type="number"
                            component={CustomTextField}
                            style={{ width: 100 }}
                          />
                        </Grid>
                        <Grid item>
                          <Typography>
                            {t('ui.common.minutesShort', 'mins')}
                          </Typography>
                        </Grid>
                      </Grid>
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

export default EditUserDrawer;
