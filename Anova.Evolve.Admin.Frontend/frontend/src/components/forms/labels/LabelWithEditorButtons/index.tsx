import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import { ReactComponent as PencilIcon } from 'assets/icons/pencil.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import Button from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { LabelWithEditorButtonsProps } from './types';

const StyledButton = styled(Button)`
  height: 15px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const LabelWithEditorButtons = ({
  label,
  isAddButtonDisabled,
  isEditButtonDisabled,
  showAddButton,
  showEditButton,
  onClickAdd,
  onClickEdit,
}: LabelWithEditorButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Grid container alignItems="flex-end" justify="space-between">
      <Grid item>
        <InputLabel>{label}</InputLabel>
      </Grid>
      <Grid item>
        <Grid container spacing={1}>
          {showEditButton && (
            <Grid item>
              <StyledButton
                variant="text"
                startIcon={<PencilIcon />}
                size="small"
                onClick={onClickEdit}
                disabled={isEditButtonDisabled}
                tabIndex={-1}
              >
                {t('ui.common.edit', 'Edit')}
              </StyledButton>
            </Grid>
          )}
          {showAddButton && (
            <Grid item>
              <StyledButton
                variant="text"
                startIcon={<PlusIcon />}
                size="small"
                onClick={onClickAdd}
                disabled={isAddButtonDisabled}
                tabIndex={-1}
              >
                {t('ui.common.add', 'Add')}
              </StyledButton>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LabelWithEditorButtons;
