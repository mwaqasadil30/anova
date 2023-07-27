import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import React from 'react';
import styled from 'styled-components';
import { gray900 } from 'styles/colours';
import { LatestReading } from './types';
import { getTooltipValue } from '../AssetGraph/helpers';

const StyledPopper = styled(Popper)`
  top: 20px;
  z-index: 2;
`;

const StyledPopperContent = styled('div')`
  background-color: white;
  color: ${gray900};
  padding: 12px 18px;
  white-space: nowrap;
  border-radius: 0 0 10px 10px;
  position: relative;
`;

const StyledPopperTootipHeader = styled('div')`
  font-size: 0.8rem;
  background-color: ${gray900};
  border-radius: 10px 10px 0 0;
`;

const StyledPopperTootipHeaderTypography = styled(Typography)`
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  padding: 6px 18px;
`;

const StyledTypography = styled(Typography)`
  font-size: 0.8rem;
`;

const StyledInlineText = styled('span')`
  font-weight: 400;
  padding-right: 0.3em;
`;

const StyledArrow = styled('span')`
  width: 1em;
  height: 1em;
  position: absolute;
  box-sizing: border-box;
  left: 50%;
  transform: translateX(-50%);
  &.arrow-bottom {
    bottom: 0;
    margin-bottom: -0.5em;
    &::before {
      width: 100%;
      height: 100%;
      margin: auto;
      content: '';
      display: block;
      transform: rotate(45deg);
      background-color: white;
    }
  }
`;

interface Props {
  dateTime: string;
  latestReadings?: LatestReading[];
  open: boolean;
  anchor: HTMLButtonElement | null;
  // NOTE: Using 'any' here because InteractiveMap type
  // does not include _width/_height
  container: any;
}

const ReadingsCard = ({
  dateTime,
  latestReadings,
  open,
  anchor,
  container,
}: Props) => {
  return (
    <StyledPopper
      open={open}
      // STASHING: open={open || hoverOpen || hovered}
      anchorEl={anchor}
      container={container}
      placement="top"
      transition
      popperOptions={{
        modifiers: {
          offset: {
            offset: '0,16',
          },
        },
      }}
    >
      {({ TransitionProps }) => (
        <Zoom {...TransitionProps} timeout={200}>
          <Fade {...TransitionProps} timeout={200}>
            <div>
              <StyledPopperTootipHeader>
                <StyledPopperTootipHeaderTypography>
                  {dateTime}
                </StyledPopperTootipHeaderTypography>
              </StyledPopperTootipHeader>
              <StyledPopperContent>
                {latestReadings?.map((lr: LatestReading, index: number) => (
                  <React.Fragment key={index}>
                    <StyledTypography>
                      <StyledInlineText
                        style={{ color: lr?.color, paddingRight: '1em' }}
                      >
                        ●
                      </StyledInlineText>
                      <StyledInlineText style={{ fontWeight: 600 }}>
                        {lr?.description} -
                      </StyledInlineText>
                      <StyledInlineText>
                        {lr?.type &&
                          lr?.value &&
                          lr?.decimalPlaces &&
                          getTooltipValue(
                            lr?.type,
                            lr?.value,
                            lr?.decimalPlaces,
                            lr?.digitalState0Text,
                            lr?.digitalState1Text,
                            lr?.digitalState2Text,
                            lr?.digitalState3Text
                          )}
                      </StyledInlineText>
                      <StyledInlineText>{lr.scaledUnit}</StyledInlineText>
                    </StyledTypography>
                  </React.Fragment>
                ))}
                <StyledArrow className="arrow-bottom" />
              </StyledPopperContent>
            </div>
          </Fade>
        </Zoom>
      )}
    </StyledPopper>
  );
};

export default ReadingsCard;

/**
 const valueForHtml = getTooltipValue(
            dataChannelType,
            point.y,
            decimalPlaces,
            digitalState0Text,
            digitalState1Text,
            digitalState2Text,
            digitalState3Text
          );
 */
