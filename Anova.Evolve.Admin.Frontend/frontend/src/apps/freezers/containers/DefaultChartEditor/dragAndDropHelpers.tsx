import { DraggableLocation } from 'react-beautiful-dnd';
import { GraphSeries, GraphSeriesMap } from './types';

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number): any[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type ReorderGraphSeriesMapArgs = {
  graphSeriesMap: GraphSeriesMap;
  source: DraggableLocation;
  destination: DraggableLocation;
};

export type ReorderGraphSeriesMapResult = {
  graphSeriesMap: GraphSeriesMap;
};

export const reorderGraphSeriesMap = ({
  graphSeriesMap,
  source,
  destination,
}: ReorderGraphSeriesMapArgs): ReorderGraphSeriesMapResult => {
  const current: GraphSeries[] = [...graphSeriesMap[source.droppableId]];
  const next: GraphSeries[] = [...graphSeriesMap[destination.droppableId]];
  const target: GraphSeries = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered: GraphSeries[] = reorder(
      current,
      source.index,
      destination.index
    );
    const result: GraphSeriesMap = {
      ...graphSeriesMap,
      [source.droppableId]: reordered,
    };
    return {
      graphSeriesMap: result,
    };
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result: GraphSeriesMap = {
    ...graphSeriesMap,
    [source.droppableId]: current,
    [destination.droppableId]: next,
  };

  return {
    graphSeriesMap: result,
  };
};

export const initialGraphSeriesMap: GraphSeriesMap = {
  parameters: [],
  leftAxis: [],
  rightAxis: [],
};
