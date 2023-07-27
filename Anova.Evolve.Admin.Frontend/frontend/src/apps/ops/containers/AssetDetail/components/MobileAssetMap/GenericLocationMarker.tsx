import Fade from '@material-ui/core/Fade';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { gray900 } from 'styles/colours';
import ReadingsCard from './ReadingsCard';
import { LatestReading } from './types';

const StyledPopper = styled(Popper)`
  top: 20px;
  z-index: 2;
`;

const StyledPopperContent = styled('div')`
  background-color: ${gray900};
  color: ${gray900};
  padding: 12px 18px;
  white-space: nowrap;
  border-radius: 10px;
  position: relative;
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
      background-color: currentColor;
    }
  }
`;

const StyledPopperTypography = styled(Typography)`
  font-size: 0.8rem;
`;

const ClickableMarkerWrapper = styled('button')`
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
  &:focus {
    outline: none;
  }
  &:hover,
  &:active {
    outline: none;
    circle {
      fill: #ff6726;
    }
  }
`;

interface Props {
  latestReadings?: LatestReading[];
  tooltipTitle: string;
  IconComponent: any;
  date: Date | string;
  color: string;
  markerId: number;
  markerTootipOpen: boolean;
  bearing?: number;
  selected?: boolean | null;
  isHovered?: boolean | null;
  // NOTE: Using 'any' here because InteractiveMap type
  // does not include _width/_height
  containerRef: any;
  markerRange: number[];
  setSelected: (marker: number | null) => void;
  setMarkerTootipOpen: (open: boolean) => void;
  setClickedMapMarkerTimeRange: (timeRange: number[] | null) => void;
  // onHoverMarker: (site: EvolveAssetLocationDto | null) => void;
}

const LocationMarker = ({
  latestReadings,
  tooltipTitle,
  IconComponent,
  color,
  bearing,
  isHovered,
  containerRef,
  markerId,
  markerRange,
  // selected,
  setSelected,
  setClickedMapMarkerTimeRange,
}: Props) => {
  const [hoverOpen, setHoverOpen] = useState(false);

  // STASHING:
  // const [open, setOpen] = useState(false);
  const hovered = Boolean(isHovered);

  const handleMouseOver = () => {
    setHoverOpen(true);
  };

  // TODO: Restore once map-to-graph interactions are added
  const handleClick = () => {
    setSelected(markerId);
    // setOpen(!open);
    setClickedMapMarkerTimeRange(markerRange);
  };
  const handleMouseLeave = () => {
    setTimeout(() => {
      setHoverOpen(false);
    }, 200);
  };
  const iconRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      {latestReadings?.length ? (
        <ReadingsCard
          dateTime={tooltipTitle}
          latestReadings={latestReadings}
          open={hoverOpen || hovered}
          anchor={iconRef.current}
          container={containerRef.current}
        />
      ) : (
        <StyledPopper
          open={hoverOpen || hovered}
          // STASHING: open={open || hoverOpen || hovered}
          anchorEl={iconRef.current}
          container={containerRef.current}
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
                <StyledPopperContent>
                  <StyledPopperTypography style={{ color: 'white' }}>
                    {tooltipTitle}
                  </StyledPopperTypography>
                  <StyledArrow className="arrow-bottom" />
                </StyledPopperContent>
              </Fade>
            </Zoom>
          )}
        </StyledPopper>
      )}

      <ClickableMarkerWrapper
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onFocus={handleMouseOver}
        onMouseLeave={handleMouseLeave}
        ref={iconRef}
      >
        <IconComponent color={color} bearing={bearing} />
      </ClickableMarkerWrapper>
    </>
  );
};

export default LocationMarker;
