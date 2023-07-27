/* eslint-disable indent, react/jsx-indent */
import InputLabel from '@material-ui/core/InputLabel';
import React from 'react';
import styled from 'styled-components';

const StyledInputField = styled(InputLabel)`
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: 500;
`;

const StyledBlockMatchingInputHeight = styled.div`
  min-height: 48px;
  display: flex;
  align-items: center;
`;

interface Props {
  label: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const StyledStaticFieldWithChildren = ({
  label,
  children,
  style,
  className,
}: Props) => {
  return (
    <div style={style} className={className}>
      <StyledInputField shrink={false}>{label}</StyledInputField>
      <StyledBlockMatchingInputHeight>
        {children}
      </StyledBlockMatchingInputHeight>
    </div>
  );
};

export default StyledStaticFieldWithChildren;
