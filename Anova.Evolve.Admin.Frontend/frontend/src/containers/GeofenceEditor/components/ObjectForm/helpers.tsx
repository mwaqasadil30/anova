import { Feature, Polygon, Position } from '@turf/helpers';
import {
  GeoAreaCategory,
  GeoAreaDto,
  GeoAreaPolygonDto,
  GeoAreaType,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { formatApiErrors } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { fieldIsRequired } from 'utils/forms/errors';
import * as Yup from 'yup';
import { GeofencedFeature, Values } from './types';

export enum MAP_GL_DRAW_SHAPE_TYPES {
  CIRCLE = 'Circle',
}

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    description: Yup.string()
      .required(fieldIsRequired(t, translationTexts.descriptionText))
      .typeError(fieldIsRequired(t, translationTexts.descriptionText)),
  });
};

export const formatInitialValues = (values?: GeoAreaDto | null): Values => {
  return {
    description: values?.description || '',
    geoAreaCategoryTypeId: isNumber(values?.geoAreaCategoryTypeId)
      ? values?.geoAreaCategoryTypeId!
      : '',
    geoAreaPolygons: values?.geoAreaPolygons || [],
    geoAreaTypeId: isNumber(values?.geoAreaTypeId)
      ? values?.geoAreaTypeId
      : undefined,
  };
};

export const formatValuesForApi = (values: Values): GeoAreaDto => {
  return {
    description: values.description || '',
    geoAreaCategoryTypeId: isNumber(values?.geoAreaCategoryTypeId)
      ? values?.geoAreaCategoryTypeId!
      : GeoAreaCategory.None,
    geoAreaPolygons: values?.geoAreaPolygons || [],
    // For now we always pass back Polygon since PointRadius is to be
    // implemented later
    // geoAreaTypeId: GeoAreaType.Polygon,
    geoAreaTypeId: values.geoAreaTypeId,
  } as GeoAreaDto;
};

export const formatGeoAreaPolygonsToFeature = (
  geoAreaPolygonCoorindates: GeoAreaPolygonDto[] | null,
  geometryType?: GeoAreaType
): GeofencedFeature => {
  if (!geoAreaPolygonCoorindates) {
    return null;
  }

  // TODO: Verify the correct ordering of coordinates (is it long, lat? or lat
  // long?)
  const formattedCoordinates = geoAreaPolygonCoorindates.map((coordinate) => [
    coordinate.longitude!,
    coordinate.latitude!,
  ]);

  const properties =
    geometryType === GeoAreaType.PointRadius
      ? { shape: MAP_GL_DRAW_SHAPE_TYPES.CIRCLE }
      : {};

  const geometry: Polygon = {
    type: 'Polygon',
    coordinates: [formattedCoordinates],
  };

  const feature: Feature<Polygon> = {
    geometry,
    properties,
    type: 'Feature',
  };

  return feature;
};

export const formatGeometryForApi = (
  feature: GeofencedFeature
): GeoAreaDto['geoAreaPolygons'] => {
  // Various checks to verify the coordinates are of the type we need (most of
  // the checks to satisfy TypeScript)
  const coordinates = feature?.geometry.coordinates?.[0];
  if (
    !coordinates ||
    typeof coordinates === 'number' ||
    !coordinates.length ||
    typeof coordinates[0] === 'number' ||
    coordinates[0].length !== 2
  ) {
    return null;
  }

  const formattedCoordinates = (coordinates as Position[]).map(
    (position) =>
      ({
        // NOTE: Passing `id` as null will return a 500 response from the API
        // TODO: Verify these numbers are correct (0 is long, 1 is lat)
        longitude: position[0],
        latitude: position[1],
      } as Omit<GeoAreaPolygonDto, 'init' | 'toJSON'>)
  );

  return (formattedCoordinates as GeoAreaPolygonDto[]) || null;
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return formatApiErrors(t, errors);
  }

  return errors;
};
