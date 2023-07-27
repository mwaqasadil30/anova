/* eslint-disable indent */
import MuiButton, {
  ButtonProps as MuiButtonProps,
} from '@material-ui/core/Button';
import { lighten } from '@material-ui/core/styles';
import React from 'react';
import styled from 'styled-components';
import {
  boxBorderColor,
  brandYellow,
  getCustomDomainContrastText,
} from 'styles/colours';

export interface ButtonProps extends MuiButtonProps {
  // NOTE: "replace", "to", "component" are react-router-dom <Link/> props
  // that need to be passed explicity to avoid typecheck fail.
  // TODO: Figure out a more generic solution  // Workaround: https://github.com/mui-org/material-ui/issues/13921#issuecomment-484133463
  replace?: any;
  to?: any;
  component?: any;
  useDomainColorForIcon?: boolean;
}

const ThemeableButton = styled(
  ({ useDomainColorForIcon, ...props }: ButtonProps) => <MuiButton {...props} />
)`
  ${(props) => {
    const dominantDomainColor =
      props.theme.palette.type === 'light'
        ? props.theme.custom.domainSecondaryColor
        : props.theme.custom.domainColor;

    return `
      ${
        props.useDomainColorForIcon &&
        `&:not([class*='Mui-disabled']) [class*='MuiButton-startIcon'] {
          color: ${dominantDomainColor};
        }
      `
      };

      && {
        transition: background background-color color border-color 0.2s ease-in-out;
        border-radius: 8px;
        border: 1px solid transparent;
      }
      & {
        padding: 6px 20px 7px 20px;
        box-shadow: none;
      }
      &[class*='MuiButton-text'] {
        border: 1px solid transparent;
      }
      &[class*='MuiButton-outlined'] {
        background: transparent;
        box-sizing: border-box;
        border: 1px solid ${props.theme.palette.text.secondary};

        &:hover {
          background: ${
            props.theme.custom.palette.background.outlineButtonHoverBackground
          };
        }
      }

      &.outlined-light {
        border-color: ${boxBorderColor};
      }

      &.solid-background {
        background: ${
          props.theme.palette.type === 'light' ? '#EBEBEB' : '#494949'
        };
      }

      &[class*='MuiButton-outlined'][class*='Mui-disabled'] {
        box-sizing: border-box;
        border: 1px solid rgba(51, 51, 51, 0.2);

        &:hover {
          background: ${
            props.theme.custom.palette.background.outlineButtonHoverBackground
          };
        }
      }

      /* prettier-ignore */
      &[class*='MuiButton-contained'] {
        background: ${props.theme.custom.domainColor};
        color: ${getCustomDomainContrastText(props.theme.custom.domainColor)};
        border: 1px solid transparent;

        &:hover {
          background: ${lighten(props.theme.custom.domainColor, 0.1)};
        }

        &.brand-yellow {
          background: ${brandYellow};
          color: ${getCustomDomainContrastText(brandYellow)};

          &:hover {
            background: ${lighten(brandYellow, 0.1)};
          }
        }
      }

      &[class*='MuiButton-textSizeSmall'] {
        padding: 0;
      }

      &[class*='MuiButton-contained'][class*='Mui-disabled'] {
        opacity: 0.75;
        svg {
          opacity: 1;
        }
      }
      &.lowercase {
        text-transform: initial;
      }
    `;
  }}
`;

const Button = (props: ButtonProps) => <ThemeableButton {...props} />;

export default Button;
