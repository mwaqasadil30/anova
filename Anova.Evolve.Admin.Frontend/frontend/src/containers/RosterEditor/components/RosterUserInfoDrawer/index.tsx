/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  DropDownListDtoOfLong,
  RosterUserDto,
  RosterUserSummaryDto,
  UserNameDto,
} from 'api/admin/api';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import MessageTemplateAutocomplete from 'components/forms/form-fields/MessageTemplateAutocomplete';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import UserAutocomplete from 'components/forms/form-fields/UserAutocomplete';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageSubHeader from 'components/PageSubHeader';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useSaveRosterUser } from '../../hooks/useUpdateRosterUser';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import PageIntro from './PageIntro';
import { Values } from './types';

const StyledFieldLabelText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
  line-height: ${(props) => props.theme.custom.fontSize?.commonLineHeight};
`;

const StyledValueText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.tableCells};
`;

interface Props {
  domainId?: string;
  rosterId: number;
  rosterUser: RosterUserSummaryDto | null;
  cancelCallback: () => void;
  saveAndExitCallback: (rosterUser: RosterUserSummaryDto) => void;
}

const RosterUserInfoDrawer = ({
  domainId,
  rosterId,
  rosterUser,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();

  const initialSelectedEmailMessageTemplate = rosterUser?.emailMessageTemplateId
    ? DropDownListDtoOfLong.fromJS({
        id: rosterUser.emailMessageTemplateId,
        value: rosterUser.emailMessageTemplateName,
      })
    : null;

  const initialSelectedEmailToPhoneMessageTemplate = rosterUser?.emailToPhoneMessageTemplateId
    ? DropDownListDtoOfLong.fromJS({
        id: rosterUser.emailToPhoneMessageTemplateId,
        value: rosterUser.emailToPhoneMessageTemplateName,
      })
    : null;

  const [
    selectedEmailMessageTemplate,
    setSelectedEmailMessageTemplate,
  ] = useState<DropDownListDtoOfLong | null>(
    initialSelectedEmailMessageTemplate
  );
  const [
    selectedEmailToPhoneMessageTemplate,
    setSelectedEmailToPhoneMessageTemplate,
  ] = useState<DropDownListDtoOfLong | null>(
    initialSelectedEmailToPhoneMessageTemplate
  );

  const initialSelectedUser = rosterUser
    ? UserNameDto.fromJS({
        userId: rosterUser.userId,
        userName: rosterUser.userName,
        firstName: rosterUser.firstName,
        lastName: rosterUser.lastName,
        companyName: rosterUser.companyName,
        emailAddress: rosterUser.emailAddress,
        emailToPhoneAddress: rosterUser.emailToPhoneAddress,
      })
    : null;
  const [selectedUser, setSelectedUser] = useState<UserNameDto | null>(
    initialSelectedUser
  );

  const formattedInitialValues = formatInitialValues(rosterUser);

  const updateRosterUserApi = useSaveRosterUser();

  const usernameText = t('ui.common.username', 'Username');
  const messageTemplateText = t(
    'ui.rosterEditor.messageTemplate',
    'Message Template'
  );

  const validationSchema = buildValidationSchema(t, {
    usernameText,
    messageTemplateText,
  });

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateRosterUserApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return updateRosterUserApi
      .mutateAsync({
        rosterId,
        roster: {
          ...formattedValuesForApi,
          rosterUserId: rosterUser?.rosterUserId,
        } as RosterUserDto,
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
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => {
        return (
          <>
            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <PageIntro
                  closeDeliveryDrawer={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={updateRosterUserApi.data}
                  submissionError={updateRosterUserApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>
            <Box mt={3} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <PageSubHeader dense>
                  {t('ui.rosterEditor.userInformation', 'User Information')}
                </PageSubHeader>
              </Grid>
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.rosterEditor.username', 'Username')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="userId-input"
                        name="userId"
                        component={UserAutocomplete}
                        domainId={domainId}
                        selectedOption={selectedUser}
                        onChange={setSelectedUser}
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
                        {t('ui.common.enabled', 'Enabled')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="isEnabled-input"
                        name="isEnabled"
                        component={SwitchWithLabel}
                        type="checkbox"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.rosterEditor.firstName', 'First Name')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledValueText>
                        {selectedUser?.firstName}
                      </StyledValueText>
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.rosterEditor.lastName', 'Last Name')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledValueText>
                        {selectedUser?.lastName}
                      </StyledValueText>
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.rosterEditor.company', 'Company')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledValueText>
                        {selectedUser?.companyName}
                      </StyledValueText>
                    </Grid>
                  </Grid>
                </EditorBox>
              </Grid>
              <Grid item xs={12}>
                <PageSubHeader dense>
                  {t('ui.rosterEditor.email', 'Email')}
                </PageSubHeader>
              </Grid>
              {/* NOTE/TODO: 
                Add <SendTestMessage> Button once back-end api is implemented 
              */}
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.common.enabled', 'Enabled')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="isEmailSelected-input"
                        name="isEmailSelected"
                        component={SwitchWithLabel}
                        type="checkbox"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.rosterEditor.email', 'Email')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledValueText>
                        {selectedUser?.emailAddress}
                      </StyledValueText>
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t(
                          'ui.rosterEditor.messageTemplate',
                          'Message Template'
                        )}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="emailMessageTemplateId-input"
                        name="emailMessageTemplateId"
                        component={MessageTemplateAutocomplete}
                        domainId={domainId}
                        selectedOption={selectedEmailMessageTemplate}
                        onChange={setSelectedEmailMessageTemplate}
                        textFieldProps={{
                          placeholder: t(
                            'ui.common.enterSearchCriteria',
                            'Enter Search Criteria...'
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>
                </EditorBox>
              </Grid>
              <Grid item xs={12}>
                <PageSubHeader dense>
                  {t(
                    'ui.rosterEditor.mobilePushNotifications',
                    'Mobile Push Notifications'
                  )}
                </PageSubHeader>
              </Grid>
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.common.enabled', 'Enabled')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="isPushSelected-input"
                        name="isPushSelected"
                        component={SwitchWithLabel}
                        type="checkbox"
                      />
                    </Grid>
                  </Grid>
                </EditorBox>
              </Grid>
              <Grid item xs={12}>
                <PageSubHeader dense>
                  {t('ui.rosterEditor.emailToPhone', 'Email to Phone')}
                </PageSubHeader>
              </Grid>
              {/* NOTE/TODO: 
                Add <SendTestMessage> Button once back-end api is implemented 
              */}
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.common.enabled', 'Enabled')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="isEmailToPhoneSelected-input"
                        name="isEmailToPhoneSelected"
                        component={SwitchWithLabel}
                        type="checkbox"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.rosterEditor.mobileEmail', 'Mobile Email')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <StyledValueText>
                        {selectedUser?.emailToPhoneAddress}
                      </StyledValueText>
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t(
                          'ui.rosterEditor.messageTemplate',
                          'Message Template'
                        )}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        id="emailToPhoneMessageTemplateId-input"
                        name="emailToPhoneMessageTemplateId"
                        component={MessageTemplateAutocomplete}
                        domainId={domainId}
                        selectedOption={selectedEmailToPhoneMessageTemplate}
                        onChange={setSelectedEmailToPhoneMessageTemplate}
                        textFieldProps={{
                          placeholder: t(
                            'ui.common.enterSearchCriteria',
                            'Enter Search Criteria...'
                          ),
                        }}
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

export default RosterUserInfoDrawer;
