/* eslint-disable indent */
import { darken, lighten, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import type { DraggableProvided } from 'react-beautiful-dnd';
import styled from 'styled-components';
import type { GraphSeries } from '../../types';

const spacingAmountInPixels = 8;

type Props = {
  graphSeries: GraphSeries;
  isDragging: boolean;
  provided: DraggableProvided;
  isGroupedOver?: boolean;
  style?: Object;
  index?: number;
};

const getBackgroundColor = (
  theme: Theme,
  isDragging: boolean,
  isGroupedOver: boolean
) => {
  if (isDragging) {
    return darken(theme.palette.background.paper, 0.2);
  }

  if (isGroupedOver) {
    return darken(theme.palette.background.paper, 0.3);
  }

  return theme.palette.background.paper;
};

const getBorderColor = (theme: Theme, isDragging: boolean) =>
  isDragging ? theme.palette.divider : 'transparent';

const imageSize: number = 40;

const Container = styled(Typography)`
  border-radius: ${(props) => props.theme.shape.borderRadius}px;
  border: 2px solid transparent;
  border-color: ${(props: any) =>
    getBorderColor(props.theme, props.isDragging)};
  background-color: ${(props: any) =>
    getBackgroundColor(props.theme, props.isDragging, props.isGroupedOver)};
  box-sizing: border-box;
  padding: ${spacingAmountInPixels}px;
  min-height: ${imageSize}px;
  margin-bottom: ${spacingAmountInPixels}px;
  user-select: none;

  &:hover,
  &:active {
    background: ${(props) => darken(props.theme.palette.background.paper, 0.1)};
  }

  &:focus {
    outline: none;
    border-color: ${(props) =>
      lighten(props.theme.palette.background.paper, 0.4)};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;

  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;

  /* flex parent */
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ColorIndicator = styled(({ color, ...props }) => <span {...props} />)`
  background: ${(props) => props.color};
  border-radius: 50%;
  width: 11px;
  height: 11px;
  margin-right: 16px;
  margin-left: 16px;
`;

function getStyle(provided: DraggableProvided, style?: Object) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style,
  };
}

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function GraphSeriesItem(props: Props) {
  const {
    graphSeries,
    isDragging,
    isGroupedOver,
    provided,
    style,
    index,
  } = props;

  return (
    // Try using Container instead
    <Container
      component="div"
      isDragging={isDragging}
      isGroupedOver={isGroupedOver}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      // @ts-ignore
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={graphSeries.tagId}
      data-index={index}
      aria-label={`${graphSeries.description} graph series`}
    >
      <Content>
        <ColorIndicator color={graphSeries.color} />
        <Typography display="inline">{graphSeries.description}</Typography>
      </Content>
    </Container>
  );
}

export default React.memo<Props>(GraphSeriesItem);
