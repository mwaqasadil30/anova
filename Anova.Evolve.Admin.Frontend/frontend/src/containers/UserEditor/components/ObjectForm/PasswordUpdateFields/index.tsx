import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import EditorBox from 'components/EditorBox';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import PasswordField from 'components/forms/form-fields/PasswordField';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import PageSubHeader from 'components/PageSubHeader';
import PasswordRequirementsPopper from 'components/PasswordRequirementsPopper';
import PasswordRequirementsList from 'components/PasswordRequirementsList';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsSystemAdminOrWhitelisted } from 'redux-app/modules/user/selectors';

interface Props {
  newPasswordValue: string;
}

const PasswordUpdateFields = ({ newPasswordValue }: Props) => {
  const { t } = useTranslation();

  const isSystemAdminOrWhitelisted = useSelector(
    selectIsSystemAdminOrWhitelisted
  );

  const [popperAnchorEl, setPopperAnchorEl] = React.useState<any>(null);
  const [isPopperOpen, setIsPopperOpen] = React.useState(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setPopperAnchorEl(event.currentTarget.parentElement);
    setIsPopperOpen(true);
  };

  const handleBlur = () => {
    setPopperAnchorEl(null);
    setIsPopperOpen(false);
  };

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
          {t('ui.userEditor.authentication', 'Authentication')}
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
        <EditorBox width="100%">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledTextField
                select
                label={t('ui.userEditor.method', 'Method')}
                value="DOLV3"
              >
                <MenuItem value="DOLV3">DOLV3</MenuItem>
              </StyledTextField>
            </Grid>
            {/* <Grid item xs={12}>
              <Field
                id="authenticationMethod-input"
                name="authenticationMethod"
                component={CustomTextField}
                label={t('ui.userEditor.authenticationMethod', 'Method')}
                select
                required
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="" disabled>
                  <SelectItem />
                </MenuItem>
                {authenticationMethodOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field>
            </Grid> */}
            <Grid item xs={12} lg={6}>
              <Field
                id="newPassword-input"
                name="newPassword"
                component={PasswordField}
                label={t('ui.userEditor.newPassword', 'New Password')}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="new-password"
              />
              <PasswordRequirementsPopper
                open={isPopperOpen}
                anchorEl={popperAnchorEl}
                placement="bottom"
                disablePortal={false}
                style={{
                  width: popperAnchorEl?.offsetWidth,
                }}
              >
                <PasswordRequirementsList password={newPasswordValue} />
              </PasswordRequirementsPopper>
            </Grid>
            <Grid item xs={12} lg={6}>
              <Field
                id="confirmNewPassword-input"
                name="confirmNewPassword"
                component={PasswordField}
                label={t(
                  'ui.changepassword.confirmpassword',
                  'Confirm Password'
                )}
              />
            </Grid>
            {isSystemAdminOrWhitelisted && (
              <Grid item xs={12}>
                <Field
                  component={CheckboxWithLabel}
                  name="migratedToNewUi"
                  type="checkbox"
                  Label={{
                    label: t(
                      'ui.userEditor.preventUserFromUsingDolv3',
                      'Prevent user from using DOLV3'
                    ),
                  }}
                />
              </Grid>
            )}
          </Grid>
        </EditorBox>
      </Grid>
    </Grid>
  );
};

export default PasswordUpdateFields;
