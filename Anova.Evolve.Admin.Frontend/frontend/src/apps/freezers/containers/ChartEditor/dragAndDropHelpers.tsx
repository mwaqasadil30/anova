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

// STUFF TO INITIALIZE THINGS

// export const initialGraphSeries: GraphSeries[] = [
//   {
//     id: '1',
//     label: 'LIN control valve position',
//     color: '#EDEA71',
//     units: null,
//   },
//   { id: '2', label: 'Pressure of LIN supply', color: '#94B842', units: null },
//   { id: '3', label: 'O2 monitoring', color: '#29929E', units: null },
//   { id: '4', label: 'Balance blower speed', color: '#3DA4EB', units: null },
//   {
//     id: '5',
//     label: 'Central exhaust blower speed',
//     color: '#3780E8',
//     units: null,
//   },
//   {
//     id: '6',
//     label: 'Control gas supply pressure',
//     color: '#B46CEC',
//     units: null,
//   },
//   {
//     id: '7',
//     label: 'Outfeed exhaust blower speed',
//     color: '#ED71BB',
//     units: null,
//   },
//   {
//     id: '8',
//     label: 'Infeed exhaust blower speed',
//     color: '#EB5760',
//     units: null,
//   },
//   {
//     id: '9',
//     label: 'Bottom right hand floor temperature',
//     color: '#D68253',
//     units: '°C',
//   },
//   {
//     id: '10',
//     label: 'Temperature setpoint of XF',
//     color: '#EFB051',
//     units: '°C',
//   },
//   {
//     id: '11',
//     label: 'Bottom left hand floor temperature',
//     color: '#D9D9D9',
//     units: '°C',
//   },
//   { id: '12', label: 'Doors or guard open', color: '#BFB87C', units: null },
//   { id: '13', label: 'Main blower speed', color: '#838063', units: null },
//   { id: '14', label: 'Belt speed', color: '#767676', units: null },
// ];

export const initialGraphSeriesMap: GraphSeriesMap = {
  parameters: [], // initialGraphSeries,
  leftAxis: [],
  rightAxis: [],
};
