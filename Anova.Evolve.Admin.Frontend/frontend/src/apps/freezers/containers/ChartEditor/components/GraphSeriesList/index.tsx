/* eslint-disable indent, react/jsx-indent */
import { darken, lighten, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { GraphSeries } from '../../types';
import GraphSeriesItem from '../GraphSeriesItem';

export const getBackgroundColor = (
  theme: Theme,
  isDraggingOver: boolean,
  isDraggingFrom: boolean
): string => {
  if (isDraggingOver) {
    return lighten(theme.palette.background.paper, 0.3);
  }
  if (isDraggingFrom) {
    return darken(theme.palette.background.default, 0.3);
  }
  return darken(theme.palette.background.default, 0.05);
};

const Wrapper = styled(({ isDraggingOver, isDraggingFrom, ...props }) => (
  <div {...props} />
))`
  background-color: ${(props) =>
    getBackgroundColor(
      props.theme,
      props.isDraggingOver,
      props.isDraggingFrom
    )};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')};
  padding: 8px;
  border: 8px;
  border-radius: 5px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
`;

const scrollContainerHeight: number = 250;

const DropZone = styled.div`
  /* stop the list collapsing when empty */
  min-height: ${scrollContainerHeight}px;

  /*
    not relying on the items for a margin-bottom
    as it will collapse when the list is empty
  */
  padding-bottom: 8px;
`;

const EmptyPlaceholderText = styled(Typography)`
  color: ${(props) => props.theme.palette.text.secondary};
  margin-left: 8px;
`;

/* stylelint-disable block-no-empty */
const Container = styled.div``;
/* stylelint-enable */

type Props = {
  listId?: string;
  listType?: string;
  graphSeriesList: GraphSeries[];
  title?: string;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  style?: Object;
  // may not be provided - and might be null
  ignoreContainerClipping?: boolean;
};

type GraphSeriesListProps = {
  graphSeriesList: GraphSeries[];
};

function InnerGraphSeriesList(props: GraphSeriesListProps) {
  return props.graphSeriesList.map(
    (graphSeries: GraphSeries, index: number) => (
      <Draggable
        key={graphSeries.dataChannelId}
        draggableId={graphSeries.dataChannelId!}
        index={index}
      >
        {(
          dragProvided: DraggableProvided,
          dragSnapshot: DraggableStateSnapshot
        ) => (
          <GraphSeriesItem
            key={graphSeries.dataChannelId!}
            graphSeries={graphSeries}
            isDragging={dragSnapshot.isDragging}
            isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
            provided={dragProvided}
          />
        )}
      </Draggable>
    )
  );
}

// @ts-ignore
const MemoizedInnerGraphSeriesList = React.memo(InnerGraphSeriesList);

type InnerListProps = {
  dropProvided: DroppableProvided;
  graphSeriesList: GraphSeries[];
  title?: string;
};

function InnerList(props: InnerListProps) {
  const { t } = useTranslation();
  const { graphSeriesList, dropProvided, title } = props;
  const titleContent = title ? <Typography>{title}</Typography> : null;

  return (
    <Container>
      {titleContent}
      <DropZone ref={dropProvided.innerRef}>
        {graphSeriesList.length === 0 && (
          <EmptyPlaceholderText>
            {t(
              'ui.freezers.chartEditor.dragAndDropPlaceholder',
              'Drag and drop parameter here'
            )}
          </EmptyPlaceholderText>
        )}
        <MemoizedInnerGraphSeriesList graphSeriesList={graphSeriesList} />
        {dropProvided.placeholder}
      </DropZone>
    </Container>
  );
}

export default function GraphSeriesList(props: Props) {
  const {
    ignoreContainerClipping,
    isDropDisabled,
    isCombineEnabled,
    listId = 'LIST',
    listType,
    style,
    graphSeriesList,
    title,
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
    >
      {(
        dropProvided: DroppableProvided,
        dropSnapshot: DroppableStateSnapshot
      ) => (
        <Wrapper
          style={style}
          isDraggingOver={dropSnapshot.isDraggingOver}
          isDropDisabled={isDropDisabled}
          isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
          {...dropProvided.droppableProps}
        >
          <InnerList
            graphSeriesList={graphSeriesList}
            title={title}
            dropProvided={dropProvided}
          />
        </Wrapper>
      )}
    </Droppable>
  );
}
