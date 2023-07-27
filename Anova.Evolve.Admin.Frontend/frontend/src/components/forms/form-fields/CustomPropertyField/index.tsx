import MenuItem from '@material-ui/core/MenuItem';
import {
  CustomPropertyDataType,
  EditAssetCustomPropertyItem,
} from 'api/admin/api';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { fadedTextColor } from 'styles/colours';
import { deserializeListValues } from 'utils/api/custom-properties';

type Properties = {
  property: EditAssetCustomPropertyItem;
  name: string;
  disabled?: boolean;
};

const BooleanField = ({ property, name, disabled }: Properties) => (
  <Field
    component={CheckboxWithLabel}
    name={name}
    type="checkbox"
    Label={{ label: property.name }}
    disabled={disabled}
  />
);

const NumberField = ({ property, name, disabled }: Properties) => {
  return (
    <Field
      component={CustomTextField}
      name={name}
      type="number"
      label={property.name}
      disabled={disabled}
    />
  );
};

const StringField = ({ property, name, disabled }: Properties) => (
  <Field
    component={CustomTextField}
    name={name}
    type="text"
    label={property.name}
    disabled={disabled}
  />
);

const ValueListField = ({ property, name, disabled }: Properties) => {
  const { t } = useTranslation();

  return (
    <Field
      component={CustomTextField}
      select
      name={name}
      label={property.name}
      SelectProps={{ displayEmpty: true }}
      disabled={disabled}
    >
      <MenuItem value="">
        <span style={{ color: fadedTextColor }}>
          {t('ui.common.select', 'Select')}
        </span>
      </MenuItem>
      {deserializeListValues(property.listValues || '').map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </Field>
  );
};

const CustomPropertyField = ({
  property,
  name,
  disabled,
}: {
  property: EditAssetCustomPropertyItem;
  name: string;
  disabled?: boolean;
}) => {
  switch (property.dataType) {
    case CustomPropertyDataType.Boolean: {
      return (
        <BooleanField name={name} property={property} disabled={disabled} />
      );
    }
    case CustomPropertyDataType.Number: {
      return (
        <NumberField name={name} property={property} disabled={disabled} />
      );
    }
    case CustomPropertyDataType.String: {
      return (
        <StringField name={name} property={property} disabled={disabled} />
      );
    }
    case CustomPropertyDataType.ValueList: {
      return (
        <ValueListField name={name} property={property} disabled={disabled} />
      );
    }
    default:
      return null;
  }
};

export default CustomPropertyField;
