import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';

const StyledText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
  /* Override the default link color */
  color: ${(props) => props.theme.palette.text.primary};
  line-height: 20px;
`;

interface Props {
  ActiveIconComponent: React.ComponentType<{ color?: string }>;
  InactiveIconComponent: React.ComponentType;
  text: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

const AppIcon = ({
  ActiveIconComponent,
  InactiveIconComponent,
  text,
  active,
  disabled,
}: Props) => {
  const [isHovering, setIsHovering] = useState(false);
  const themeContext = useContext(ThemeContext);
  const { domainColor } = themeContext.custom;
  const isUsingActiveIcon = active || isHovering;

  return (
    <Box textAlign="center" style={{ cursor: disabled ? 'not-allowed' : '' }}>
      <Box
        mb={1}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {!disabled && isUsingActiveIcon ? (
          <ActiveIconComponent color={domainColor} />
        ) : (
          <div style={{ cursor: 'not-allowed' }}>
            <InactiveIconComponent />
          </div>
        )}
      </Box>
      <StyledText>{text}</StyledText>
    </Box>
  );
};

export default AppIcon;
