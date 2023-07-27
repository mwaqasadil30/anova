import { ReactComponent as PlusIcon } from 'assets/icons/add-button-plus.svg';
import Button, { ButtonProps } from 'components/Button';
import React from 'react';

const AddButton = (props: ButtonProps) => {
  return <Button variant="contained" {...props} startIcon={<PlusIcon />} />;
};

export default AddButton;
