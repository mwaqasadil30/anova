import MuiChip from '@material-ui/core/Chip';
import { emphasize } from '@material-ui/core/styles';
import styled from 'styled-components';
import { getCustomDomainContrastText } from 'styles/colours';

const Chip = styled(MuiChip)`
  ${(props) => {
    const dominantDomainColor =
      props.theme.palette.type === 'light'
        ? props.theme.custom.domainSecondaryColor
        : props.theme.custom.domainColor;
    const textColorForDominantColor = getCustomDomainContrastText(
      dominantDomainColor
    );

    return `
      color: ${textColorForDominantColor};
      background: ${dominantDomainColor};
    
      && .MuiChip-root,
      && .MuiChip-deletable:focus {
        color: ${dominantDomainColor};
      }
    
      & .MuiChip-deleteIcon {
        color: ${emphasize(dominantDomainColor, 0.8)};
      }
    `;
  }}
`;

export default Chip;
