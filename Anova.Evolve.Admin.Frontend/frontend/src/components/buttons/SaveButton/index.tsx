import Button, { ButtonProps } from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  min-width: 94px;
`;

const SaveButton = (props: ButtonProps) => {
  const { t } = useTranslation();
  return (
    <StyledButton variant="outlined" {...props}>
      {t('ui.common.save', 'Save')}
    </StyledButton>
  );
};

export default SaveButton;
