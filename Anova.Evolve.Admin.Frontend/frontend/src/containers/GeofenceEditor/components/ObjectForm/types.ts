import { Feature, Polygon } from '@turf/helpers';
import { GeoAreaCategory, GeoAreaPolygonDto, GeoAreaType } from 'api/admin/api';

export interface Values {
  description: string;
  geoAreaCategoryTypeId: GeoAreaCategory | '';
  geoAreaTypeId: GeoAreaType | undefined;
  geoAreaPolygons: GeoAreaPolygonDto[] | null;
}

// For now, we only allow Polygon features
export type GeofencedFeature = Feature<Polygon> | null;
