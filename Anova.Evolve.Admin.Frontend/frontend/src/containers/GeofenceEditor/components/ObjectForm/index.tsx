import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { GeoAreaPolygonDto, GeoAreaType } from 'api/admin/api';
import EditorBox from 'components/EditorBox';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import { Field, FormikProps } from 'formik';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getGeoAreaCategoryTypeOptions } from 'utils/i18n/enum-to-text';
import GeofenceMap from '../GeofenceMap';
import {
  formatGeoAreaPolygonsToFeature,
  formatGeometryForApi,
} from './helpers';
import { GeofencedFeature, Values } from './types';

interface Props {
  isSubmitting: boolean;
  initialCoordinates: GeoAreaPolygonDto[] | null;
  initialGeometryType?: GeoAreaType;
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

const ObjectForm = ({
  isSubmitting,
  initialCoordinates,
  initialGeometryType,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();
  const descriptionText = t('ui.common.description', 'Description');
  const categoryOptions = getGeoAreaCategoryTypeOptions(t);

  const handleGeometryChange = useCallback(
    (geometry: GeofencedFeature, newGeometryType?: GeoAreaType) => {
      const formattedGeometryForApi = formatGeometryForApi(geometry);
      if (newGeometryType || newGeometryType === GeoAreaType.Polygon) {
        setFieldValue('geoAreaTypeId', newGeometryType);
      }
      setFieldValue('geoAreaPolygons', formattedGeometryForApi);
    },
    []
  );

  const formattedInitialCoordinates = useMemo(
    () =>
      formatGeoAreaPolygonsToFeature(initialCoordinates, initialGeometryType),
    [initialCoordinates]
  );

  return (
    <>
      <EditorBox mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4} xl={3}>
            <Field
              id="description-input"
              name="description"
              component={CustomTextField}
              label={descriptionText}
              required
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4} xl={3}>
            <Field
              component={CustomTextField}
              name="geoAreaCategoryTypeId"
              label={t('ui.geofence.category', 'Category')}
              select
              fullWidth
              SelectProps={{ displayEmpty: true }}
            >
              <MenuItem value="" disabled>
                <SelectItem />
              </MenuItem>
              {categoryOptions?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Field>
          </Grid>
        </Grid>
      </EditorBox>

      <GeofenceMap
        isSubmitting={isSubmitting}
        initialFeature={formattedInitialCoordinates}
        onGeometryChange={handleGeometryChange}
      />
    </>
  );
};

export default ObjectForm;
