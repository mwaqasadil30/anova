import React from 'react';
import Grid from '@material-ui/core/Grid';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import MenuItem from '@material-ui/core/MenuItem';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import { Field, FieldAttributes } from 'formik';
import AirProductsSiteAutocomplete from 'components/forms/form-fields/AirProductsSiteAutocomplete';
import { SiteInfoDto } from 'api/admin/api';
import {
  StyledFieldLabelText,
  StyledValueText,
} from '../InformationContainer/styles';

type EditorTextProps = {
  label: string;
  value?: React.ReactNode | string | null;
};
type EditorTextBoxProps = FieldAttributes<any> & {
  label: string;
};
type EditorDropDownProps = FieldAttributes<any> & {
  label: string;
  name: string;
  textMapping: Record<number, string>;
};
type EditorGridLayoutProps = {
  label: string;
  error?: string;
  touched?: boolean;
  control: React.ReactNode;
};
type EditorSiteDropDownProps = {
  label: string;
  name: string;
  placeholder: string;
  selectedSiteId: SiteInfoDto | null;
  setSelectedSiteId: React.Dispatch<React.SetStateAction<SiteInfoDto | null>>;
};
const EditorGridLayout = ({ label, control }: EditorGridLayoutProps) => {
  return (
    <>
      <Grid item xs={4}>
        <StyledFieldLabelText>{label}</StyledFieldLabelText>
      </Grid>
      <Grid item xs={8}>
        {control}
      </Grid>
    </>
  );
};
export const EditorText = ({ label, value }: EditorTextProps) => {
  return (
    <EditorGridLayout
      label={label}
      control={<StyledValueText>{value}</StyledValueText>}
    />
  );
};
export const EditorTextBox = ({
  label,
  name,
  ...props
}: EditorTextBoxProps) => {
  return (
    <EditorGridLayout
      {...props}
      label={label}
      control={
        <Field id={`${name}-textbox`} name={name} component={CustomTextField} />
      }
    />
  );
};

export const EditorDropDown = ({
  label,
  name,
  textMapping,
  error,
  touched,
  ...props
}: EditorDropDownProps) => {
  const mappedList = Object.keys(textMapping).map((key) => ({
    key,
    value: textMapping[key as any],
  }));

  const sortedList = mappedList.sort((a, b) => (a.value > b.value ? 1 : -1));

  return (
    <EditorGridLayout
      label={label}
      control={
        <Field
          {...props}
          id={`${name}-dropdown`}
          name={name}
          component={CustomTextField}
          select
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="">
            <SelectItem />
          </MenuItem>
          {sortedList.map((item) => (
            <MenuItem key={item.key} value={item.key}>
              {item.value}
            </MenuItem>
          ))}
        </Field>
      }
      error={error}
      touched={touched}
    />
  );
};
export const EditorSiteDropDown = ({
  label,
  name,
  placeholder,
  selectedSiteId,
  setSelectedSiteId,
}: EditorSiteDropDownProps) => {
  return (
    <EditorGridLayout
      label={label}
      control={
        <Field
          id={`${name}-input`}
          name={name}
          component={AirProductsSiteAutocomplete}
          selectedOption={selectedSiteId}
          onChange={setSelectedSiteId}
          textFieldProps={{
            placeholder,
          }}
          storeSiteId
        />
      }
    />
  );
};
