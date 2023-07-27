import React from 'react';
import Button, { ButtonProps } from 'components/Button';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  min-width: 94px;
`;

const SaveAsNewTemplateButton = (props: ButtonProps) => {
  const { t } = useTranslation();
  return (
    <StyledButton variant="outlined" {...props}>
      {t('ui.common.saveasnewtemplate', 'Save As New Template')}
    </StyledButton>
  );
};

export default SaveAsNewTemplateButton;
