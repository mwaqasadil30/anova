/* eslint-disable indent */
import Grid from '@material-ui/core/Grid';
import { RosterDto, RosterUserSummaryDto } from 'api/admin/api';
import EditorBox from 'components/EditorBox';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import StyledStaticField from 'components/forms/styled-fields/StyledStaticField';
import { SaveCallbackFunction } from 'containers/RosterEditor/types';
import { Field, FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import RosterUserTable from '../RosterUserTable';
import { Values } from './types';

const CustomStaticField = styled(StyledStaticField)`
  & .MuiFormLabel-root {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: 500;
  }
  & .MuiTypography-root {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: 500;
  }
`;

interface Props {
  isCreating: boolean;
  isSubmitting: boolean;
  isFetching: boolean;
  isLoadingInitial: boolean;
  responseError: boolean;
  domainId?: string;
  rosterData?: RosterDto | null;
  rosterUsers?: RosterUserSummaryDto[] | null;
  submissionResult?: RosterDto;
  wasSavedViaAddContactButton: boolean;
  setWasSavedViaAddContactButton: (wasSaved: boolean) => void;
  saveCallback: SaveCallbackFunction;
  setFieldValue: FormikProps<Values>['setFieldValue'];
  submitFormViaAddContact: FormikProps<Values>['submitForm'];
}

const ObjectForm = ({
  isCreating,
  isSubmitting,
  isFetching,
  isLoadingInitial,
  responseError,
  domainId,
  rosterData,
  rosterUsers,
  submissionResult,
  wasSavedViaAddContactButton,
  setWasSavedViaAddContactButton,
  saveCallback,
  submitFormViaAddContact,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();

  const dataChannelsText = t('ui.common.datachannels', 'Data Channels');
  const descriptionText = t('ui.common.description', 'Description');
  const enabledText = t('ui.common.enabled', 'Enabled');
  const activeContactsText = t(
    'ui.rosterEditor.activeContacts',
    'Active Contacts'
  );

  const activeContacts = rosterUsers?.filter(
    (rosterUser) => rosterUser.isEnabled
  );

  return (
    <>
      <EditorBox>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <Field
              id="description-input"
              name="description"
              component={CustomTextField}
              label={descriptionText}
              required
            />
          </Grid>

          <Grid item xs={4} md={2}>
            <Field
              id="isEnabled-input"
              name="isEnabled"
              component={SwitchWithLabel}
              type="checkbox"
              label={enabledText}
            />
          </Grid>
          {!isCreating && (
            <>
              <Grid item xs={4} md={2}>
                <CustomStaticField
                  label={dataChannelsText}
                  value={rosterData?.dataChannelCount}
                />
              </Grid>
              <Grid item xs={4} md={2}>
                <CustomStaticField
                  label={activeContactsText}
                  value={activeContacts?.length || 0}
                />
              </Grid>
            </>
          )}
        </Grid>
      </EditorBox>

      <RosterUserTable
        isCreating={isCreating}
        isFetching={isFetching}
        isSubmitting={isSubmitting}
        isLoadingInitial={isLoadingInitial}
        responseError={responseError}
        domainId={domainId}
        rosterId={rosterData?.rosterId}
        rosterUsers={rosterUsers}
        submissionResult={submissionResult}
        saveCallback={saveCallback}
        submitFormViaAddContact={submitFormViaAddContact}
        setFieldValue={setFieldValue}
        wasSavedViaAddContactButton={wasSavedViaAddContactButton}
        setWasSavedViaAddContactButton={setWasSavedViaAddContactButton}
      />
    </>
  );
};

export default ObjectForm;
