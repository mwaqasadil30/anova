import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import DraggableList from 'components/DraggableList';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';
import styled from 'styled-components';
import { gray900 } from 'styles/colours';
import { renderHelperText } from 'utils/forms/renderers';
import { DisplayPriorityItem } from './types';

const StyledFormControl = styled(FormControl)`
  & label {
    color: ${gray900};
    font-size: 16px;
    transform: none;
    font-weight: 500;
  }
  & label + .draggable-form-control {
    margin-top: 8px;
  }

  & .MuiInputLabel-root {
    position: relative;
  }

  & .MuiInputBase-root.Mui-disabled {
    background: linear-gradient(180deg, #f5f5f5 0%, #f0f0f0 100%);
    border: 1px solid transparent;
  }
`;

interface Props<T> {
  id: string;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  items: T[];
  onChange: (newItems: T[]) => void;
}

function DisplayPriorityField<T extends DisplayPriorityItem>({
  id,
  label,
  helperText,
  items,
  onChange,
}: Props<T>) {
  const formattedHelperText = renderHelperText(helperText);
  const theme = useTheme();
  return (
    <StyledFormControl fullWidth>
      {label && (
        <InputLabel htmlFor={id} shrink>
          {label}
        </InputLabel>
      )}
      <DraggableList
        id={id}
        className="draggable-form-control"
        items={items}
        onChange={onChange}
        theme={theme}
      />
      {formattedHelperText && (
        <FormHelperText id={`${id}-helper-text`}>
          {formattedHelperText}
        </FormHelperText>
      )}
    </StyledFormControl>
  );
}

export default DisplayPriorityField;
