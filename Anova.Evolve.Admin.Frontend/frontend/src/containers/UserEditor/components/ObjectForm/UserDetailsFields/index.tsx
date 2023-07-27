import InputAdornment from '@material-ui/core/InputAdornment';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { UserType } from 'api/admin/api';
import EditorBox from 'components/EditorBox';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import TimeField from 'components/forms/form-fields/TimeField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageSubHeader from 'components/PageSubHeader';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsSystemAdminOrWhitelisted } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';

const StyledDomainSuffixText = styled(Typography)`
  font-size: 16px;
  padding-right: 8px;
`;

interface Props {
  userTypeOptions: { label: string; value: UserType }[];
  usernameText: string;
  firstNameText: string;
  lastNameText: string;
  companyNameText: string;
  applicationTimeoutText: string;
  domainSuffix?: string;
  isSubmitting?: boolean;
}

const UserDetailsFields = ({
  userTypeOptions,
  usernameText,
  firstNameText,
  lastNameText,
  companyNameText,
  applicationTimeoutText,
  domainSuffix,
  isSubmitting,
}: Props) => {
  const { t } = useTranslation();

  const isSystemAdminOrWhitelisted = useSelector(
    selectIsSystemAdminOrWhitelisted
  );

  return (
    <Grid
      container
      spacing={2}
      alignItems="stretch"
      style={{
        flexDirection: 'column',
        flexWrap: 'nowrap',
      }}
    >
      <Grid item xs={12} style={{ flex: '1 0 auto' }}>
        <PageSubHeader dense>
          {t('ui.userEditor.userDetails', 'User Details')}
        </PageSubHeader>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          flexWrap: 'nowrap',
        }}
      >
        <EditorBox>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Field
                component={CustomTextField}
                name="userName"
                label={usernameText}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end" aria-label="unit">
                      <StyledDomainSuffixText>
                        {domainSuffix}
                      </StyledDomainSuffixText>
                    </InputAdornment>
                  ),
                }}
                autoComplete="off"
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CustomTextField}
                name="firstName"
                label={firstNameText}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CustomTextField}
                name="lastName"
                label={lastNameText}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                component={CustomTextField}
                name="companyName"
                label={companyNameText}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                component={CustomTextField}
                name="userTypeId"
                label={t('ui.userEditor.type', 'Type')}
                select
                required
                SelectProps={{ displayEmpty: true }}
                disabled={!isSystemAdminOrWhitelisted || isSubmitting}
              >
                <MenuItem value="" disabled>
                  <SelectItem />
                </MenuItem>
                {userTypeOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            </Grid>
            <Grid item xs={6}>
              <Field
                id="applicationTimeout-input"
                component={TimeField}
                name="applicationTimeout"
                label={applicationTimeoutText}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                component={CheckboxWithLabel}
                name="isPrimary"
                type="checkbox"
                Label={{
                  label: t('ui.userEditor.isPrimaryContact', 'Primary Contact'),
                }}
                withTopMargin
              />
            </Grid>
          </Grid>
        </EditorBox>
      </Grid>
    </Grid>
  );
};

export default UserDetailsFields;
