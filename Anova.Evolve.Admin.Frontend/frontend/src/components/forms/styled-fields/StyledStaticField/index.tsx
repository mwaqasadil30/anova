/* eslint-disable indent, react/jsx-indent */
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import styled from 'styled-components';

const StyledInputField = styled(InputLabel)`
  color: ${(props) => props.theme.palette.text.primary};
  margin-bottom: 8px;
  font-weight: 500;
`;

const StyledTypography = styled(Typography)`
  height: 48px; /* The height of a text field */
  display: flex;
  align-items: center;
`;

interface Props {
  label: React.ReactNode;
  value: React.ReactNode;
  valueAriaLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

const StyledStaticField = ({
  label,
  value,
  valueAriaLabel,
  style,
  className,
}: Props) => {
  return (
    <div style={style} className={className}>
      <StyledInputField shrink={false}>{label}</StyledInputField>
      <StyledTypography aria-label={valueAriaLabel || undefined}>
        {value}
      </StyledTypography>
    </div>
  );
};

export default StyledStaticField;
