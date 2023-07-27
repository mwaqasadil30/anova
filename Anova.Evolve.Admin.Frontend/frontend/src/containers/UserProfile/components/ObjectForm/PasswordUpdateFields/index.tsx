import Grid from '@material-ui/core/Grid';
import EditorBox from 'components/EditorBox';
import PasswordField from 'components/forms/form-fields/PasswordField';
import PageSubHeader from 'components/PageSubHeader';
import PasswordRequirementsPopper from 'components/PasswordRequirementsPopper';
import PasswordStrengthIndicator from 'components/PasswordStrengthIndicator';
import PasswordRequirementsList from 'components/PasswordRequirementsList';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  newPasswordValue: string;
}

const PasswordUpdateFields = ({ newPasswordValue }: Props) => {
  const { t } = useTranslation();

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
          {t('ui.main.changepassword', 'Change Password')}
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
              <Field
                id="oldPassword-input"
                name="oldPassword"
                component={PasswordField}
                label={t('ui.changepassword.oldPassword', 'Old Password')}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                id="newPassword-input"
                name="newPassword"
                component={PasswordField}
                label={
                  <Grid
                    container
                    spacing={1}
                    alignItems="flex-end"
                    justify="space-between"
                  >
                    <Grid item>
                      {t('ui.userEditor.newPassword', 'New Password')}
                    </Grid>
                    {newPasswordValue && (
                      <Grid item>
                        <PasswordStrengthIndicator
                          dense
                          password={newPasswordValue}
                        />
                      </Grid>
                    )}
                  </Grid>
                }
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="new-password"
              />
              <PasswordRequirementsPopper
                open={isPopperOpen}
                anchorEl={popperAnchorEl}
                placement="bottom-start"
                disablePortal={false}
                style={{
                  width: popperAnchorEl?.offsetWidth,
                }}
              >
                <PasswordRequirementsList password={newPasswordValue} />
              </PasswordRequirementsPopper>
            </Grid>
            <Grid item xs={12}>
              <Field
                id="confirmPassword-input"
                name="confirmPassword"
                component={PasswordField}
                label={t(
                  'ui.changepassword.repeatNewPassword',
                  'Repeat New Password'
                )}
              />
            </Grid>
          </Grid>
        </EditorBox>
      </Grid>
    </Grid>
  );
};

export default PasswordUpdateFields;
