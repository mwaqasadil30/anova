import React from 'react';
import BasicSwitch from 'components/forms/styled-fields/BasicSwitch';
import { fieldToSwitch, SwitchProps } from 'formik-material-ui';

const Switch = (props: SwitchProps) => {
  return <BasicSwitch {...fieldToSwitch(props)} />;
};

export default Switch;
