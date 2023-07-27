import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';

const IsDisplayedIcon = ({ isDisplayed }: { isDisplayed?: boolean | null }) => {
  if (isDisplayed) return <DoneIcon />;
  return <ClearIcon />;
};
export default IsDisplayedIcon;
