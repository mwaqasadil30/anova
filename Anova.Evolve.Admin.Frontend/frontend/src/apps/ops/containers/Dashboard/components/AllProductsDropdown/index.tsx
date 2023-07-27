import React from 'react';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import { TextFieldProps } from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { useTranslation } from 'react-i18next';
import { EvolveProduct } from 'api/admin/api';

interface Props {
  products: EvolveProduct[];
  value: string;
  onChange: TextFieldProps['onChange'];
  disabled?: boolean;
}

const AllProductsDropdown = ({
  products,
  value,
  onChange,
  disabled,
}: Props) => {
  const { t } = useTranslation();

  return (
    <StyledTextField
      select
      InputProps={{
        style: { height: 40, overflow: 'hidden' },
      }}
      value={value}
      onChange={onChange}
      SelectProps={{ displayEmpty: true }}
      disabled={disabled}
    >
      <MenuItem value="">
        {t('ui.assetdashboard.allProducts', 'All Products')}
      </MenuItem>
      {products.map((product) => (
        <MenuItem key={product.id} value={product.id}>
          {product.name}
        </MenuItem>
      ))}
    </StyledTextField>
  );
};

export default AllProductsDropdown;
