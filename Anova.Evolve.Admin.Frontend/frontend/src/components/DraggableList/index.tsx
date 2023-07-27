/* eslint-disable indent */
// The majority of this was set up initially from react-beautiful-dnd's "Simple
// vertical list" example:
// https://codesandbox.io/s/k260nyxq9v
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { boxBorderColor } from 'styles/colours';
import { CustomDraggableItem } from './types';

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
      }
    : {
        border: `1px dashed ${boxBorderColor}`,
        background: theme.custom.palette.draggable.isNotDraggingColor,
      }),

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = () => ({
  border: `1px solid ${boxBorderColor}`,
  padding: grid,
});

class DraggableList<T extends CustomDraggableItem> extends Component<
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
                      <Typography>{item.content}</Typography>
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

export default DraggableList;
