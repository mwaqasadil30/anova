import { Feature, LineString } from '@turf/helpers';
import { EvolveReading, DataChannelDTO } from 'api/admin/api';

export type MapLineSegment = Feature<LineString, any>;
export interface DcReadingsForMap {
  description?: string | null;
  decimalPlaces?: number;
  scaledUnit?: string | null;
  color?: string;
  type: DataChannelDTO['dataChannelTypeId'];
  readings?: EvolveReading[];
  digitalState0Text?: string | null;
  digitalState1Text?: string | null;
  digitalState2Text?: string | null;
  digitalState3Text?: string | null;
}

export interface LatestReading {
  logTime?: Date;
  value: number;
  description?: string | null;
  decimalPlaces?: number;
  scaledUnit?: string | null;
  color?: string;
  type: DataChannelDTO['dataChannelTypeId'];
  digitalState0Text?: string | null;
  digitalState1Text?: string | null;
  digitalState2Text?: string | null;
  digitalState3Text?: string | null;
}
