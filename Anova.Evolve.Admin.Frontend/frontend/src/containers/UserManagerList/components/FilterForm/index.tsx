import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from 'components/Button';
import FieldLabel from 'components/forms/labels/FieldLabel';
import FieldGroup from 'components/forms/styled-fields/FieldGroup';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatSearchText } from 'utils/api/helpers';
import { UserListColumnId } from '../../helpers';

interface FormData {
  column: string;
  text: string;
}

interface Props {
  onSubmit: (formData: FormData) => void;
  uniqueRoleNames: string[];
}

const FilterForm = ({ onSubmit, uniqueRoleNames }: Props) => {
  const { t } = useTranslation();

  const [filterColumn, setFilterColumn] = useState(UserListColumnId.UserName);
  const [filterText, setFilterText] = useState('');

  const handleFilterByColumnChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newColumn = event.target.value as UserListColumnId;
    setFilterColumn(newColumn);
    setFilterText('');
  };

  const handleFilterByInputChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setFilterText(event.target.value);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit({ column: filterColumn, text: formatSearchText(filterText) });
  };

  const usernameText = t('ui.common.username', 'Username');
  const companyText = t('ui.userList.company', 'Company');
  const emailAddressText = t('ui.userEditor.emailAddress', 'Email Address');
  const firstnameText = t('ui.userList.fistName', 'First Name');
  const lastnameText = t('ui.userList.lastName', 'Last Name');
  const roleText = t('ui.userList.role', 'Role');

  const placeholderMapping = {
    [UserListColumnId.UserName]: usernameText,
    [UserListColumnId.CompanyName]: companyText,
    [UserListColumnId.EmailAddress]: emailAddressText,
    [UserListColumnId.FirstName]: firstnameText,
    [UserListColumnId.LastName]: lastnameText,
    [UserListColumnId.RoleName]: roleText,
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <FieldLabel>{t('ui.common.filterby', 'Filter By')}</FieldLabel>
        </Grid>
        <Grid item>
          <FieldGroup>
            <StyledTextField
              id="filterColumn-input"
              select
              fullWidth={false}
              onChange={handleFilterByColumnChange}
              value={filterColumn}
              style={{ minWidth: 160 }}
              InputProps={{
                style: { overflow: 'hidden' },
              }}
            >
              {[
                {
                  label: usernameText,
                  value: UserListColumnId.UserName,
                },
                {
                  label: companyText,
                  value: UserListColumnId.CompanyName,
                },
                {
                  label: emailAddressText,
                  value: UserListColumnId.EmailAddress,
                },
                {
                  label: firstnameText,
                  value: UserListColumnId.FirstName,
                },
                {
                  label: lastnameText,
                  value: UserListColumnId.LastName,
                },
                {
                  label: roleText,
                  value: UserListColumnId.RoleName,
                },
              ].map((option) => (
                <MenuItem key={option.label} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StyledTextField>
            {filterColumn === UserListColumnId.RoleName ? (
              <StyledTextField
                id="roleName-input"
                select
                fullWidth={false}
                onChange={handleFilterByInputChange}
                value={filterText}
                style={{ minWidth: 160 }}
                SelectProps={{ displayEmpty: true }}
                InputProps={{
                  style: { overflow: 'hidden' },
                }}
              >
                <MenuItem value="">
                  <SelectItem />
                </MenuItem>
                {uniqueRoleNames.map((role: string) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </StyledTextField>
            ) : (
              <StyledTextField
                id="filterText-input"
                fullWidth={false}
                placeholder={t(
                  'ui.common.filterplaceholder',
                  `Enter {{filterOption}}`,
                  // @ts-ignore
                  { filterOption: placeholderMapping[filterColumn] }
                )}
                onChange={handleFilterByInputChange}
                value={filterText}
                style={{ minWidth: 280 }}
                InputProps={{
                  style: { overflow: 'hidden' },
                }}
              />
            )}
          </FieldGroup>
        </Grid>

        <Grid item>
          <Button type="submit" variant="outlined">
            {t('ui.common.apply', 'Apply')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FilterForm;
