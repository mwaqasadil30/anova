import { MenuProps as MuiMenuProps } from '@material-ui/core/Menu';
import CustomTextField, {
  Props as CustomTextFieldProps,
} from 'components/forms/form-fields/CustomTextField';
import StyledMultiSelect from 'components/forms/styled-fields/MultiSelect';
import React from 'react';

type Props<T> = Partial<CustomTextFieldProps> & {
  children?: React.ReactNode;
  label: React.ReactNode;
  options: T[];
  value: T[];
  style: any;
  MenuProps?: Partial<MuiMenuProps>;
  onClose?: (selectedOptions: T[]) => void;
  setValue: (selectedOptions: T[]) => void;
  renderValue: (option: T) => string;
};

function MultiSelect<T = any>(props: Props<T>) {
  return (
    <CustomTextField
      select
      SelectProps={{
        multiple: true,
      }}
      {...props}
      // @ts-ignore
      TextFieldComponent={StyledMultiSelect}
      setValue={(value: any) => {
        if (props.field?.name) {
          props.form?.setFieldValue(props.field.name, value);
        }
      }}
    />
  );
}

export default MultiSelect;
