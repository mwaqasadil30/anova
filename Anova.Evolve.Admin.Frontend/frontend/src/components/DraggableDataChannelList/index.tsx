/* eslint-disable indent */
// The majority of this was set up initially from react-beautiful-dnd's "Simple
// vertical list" example:
// https://codesandbox.io/s/k260nyxq9v
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as DragAndDropItemIcon } from 'assets/icons/drag-and-drop-item-icon.svg';
import React, { Component } from 'react';
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import styled from 'styled-components';
import { CustomDraggableItem } from './types';

const StyledDragAndDropItemIcon = styled(DragAndDropItemIcon)`
  color: ${(props) => props.theme.custom.domainColor};
`;

const StyledDataChannelText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 600;
`;

const StyledSecondaryText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 400;
  color: ${(props) => props.theme.palette.text.secondary};
`;

interface Props<T extends CustomDraggableItem> {
  id: string;
  className?: string;
  items: T[];
  theme: Theme;
  onChange: (newItems: T[]) => void;
}

interface State<T extends CustomDraggableItem> {
  items: T[];
}

// a little function to help us with reordering the result
function reorder<T extends CustomDraggableItem>(
  list: T[],
  startIndex: number,
  endIndex: number
) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const grid = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
  theme: Theme
) => ({
  userSelect: 'none',
  padding: `${grid}px ${grid * 2}px`,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging or not
  ...(isDragging
    ? {
        background: theme.custom.palette.draggable.isDraggingColor,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '10px',
      }
    : {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '10px',
        background: theme.custom.palette.draggable.isNotDraggingColor,
      }),

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = () => ({
  // border: `1px solid ${boxBorderColor}`,
  padding: grid,
});

class DraggableDataChannelList<T extends CustomDraggableItem> extends Component<
  Props<T>,
  State<T>
> {
  constructor(props: Props<T>) {
    super(props);
    this.state = {
      items: props.items,
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result: DropResult) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const { items } = this.state;
    const { onChange } = this.props;

    const newItems = reorder<T>(
      items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items: newItems,
    });

    onChange(newItems);
  }

  render() {
    const { id, className, theme } = this.props;
    const { items } = this.state;
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId={id}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle()}
              className={className}
            >
              {items.map((item, index) => (
                <Draggable
                  key={item.id}
                  draggableId={String(item.id)}
                  index={index}
                >
                  {(draggablProvided, draggableSnapshot) => (
                    <div
                      ref={draggablProvided.innerRef}
                      {...draggablProvided.draggableProps}
                      {...draggablProvided.dragHandleProps}
                      // @ts-ignore
                      style={getItemStyle(
                        draggableSnapshot.isDragging,
                        draggablProvided.draggableProps.style,
                        theme
                      )}
                    >
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        wrap="nowrap"
                      >
                        <Grid item>
                          <StyledDragAndDropItemIcon />
                        </Grid>
                        <Grid item>
                          <Grid container spacing={0} direction="column">
                            <Grid item>
                              <StyledDataChannelText>
                                {item.description}
                              </StyledDataChannelText>
                            </Grid>
                            <Grid item>
                              <StyledSecondaryText>
                                {item.channelNumber}
                              </StyledSecondaryText>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs>
                          <StyledSecondaryText align="right">
                            {item.rtuDeviceId}
                          </StyledSecondaryText>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default DraggableDataChannelList;
