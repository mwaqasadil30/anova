import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { GeoAreaDto } from 'api/admin/api';
import routes from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import EditorPageIntro from 'components/EditorPageIntro';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { Formik, FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory, useParams } from 'react-router';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import {
  selectCanCreateGeofences,
  selectCanUpdateGeofences,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { convertToNumber } from 'utils/forms/values';
import ObjectForm from './components/ObjectForm';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './components/ObjectForm/helpers';
import type { Values } from './components/ObjectForm/types';
import { useGetGeoAreaById } from './hooks/useGetGeoAreaById';
import { useSaveGeoArea } from './hooks/useSaveGeoArea';

const Wrapper = styled.div`
  ${(props: { $topOffset: number }) =>
    props.$topOffset &&
    `
    display: flex;
    flex-direction: column;
    /* Minus 16px from the main container's bottom padding */
    height: calc(100vh - ${props.$topOffset}px - 16px);
    padding: 0;
    `};
`;

interface RouteParams {
  geofenceId?: string;
}

interface Props {
  isWithinDrawer?: boolean;
}

const GeofenceEditor = ({ isWithinDrawer }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);
  const params = useParams<RouteParams>();
  const editingObjectId = convertToNumber(params.geofenceId);

  const isCreating = !editingObjectId;
  const canCreateGeofence = useSelector(selectCanCreateGeofences);
  const canUpdateGeofence = useSelector(selectCanUpdateGeofences);
  const showSaveOptions =
    (isCreating && canCreateGeofence) || (!isCreating && canUpdateGeofence);

  // Edit User Api
  const getGeoAreaByIdApi = useGetGeoAreaById(editingObjectId!);
  const geoAreaData = getGeoAreaByIdApi.data;
  const editGeoAreaError = getGeoAreaByIdApi.error;

  // Update/Save User Api
  const saveGeoAreaApi = useSaveGeoArea();

  const formattedInitialValues = useMemo(
    () => formatInitialValues(geoAreaData),
    [geoAreaData]
  );

  const refetchEditData = () => {
    // Clear the error state when submitting
    saveGeoAreaApi.reset();
    if (!isCreating) {
      getGeoAreaByIdApi.refetch();
    }
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    saveGeoAreaApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return saveGeoAreaApi
      .mutateAsync({
        ...formattedValuesForApi,
        ...(editingObjectId && { id: editingObjectId }),
      } as GeoAreaDto)
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const saveCallback = (response: GeoAreaDto) => {
    if (response?.id) {
      const editRoutePath = generatePath(routes.geofenceManager.edit, {
        geofenceId: response.id,
      });
      history.replace(editRoutePath);
    }
  };
  const saveAndExitCallback = () => {
    history.push(routes.geofenceManager.list);
  };

  const isFetchingEditData = getGeoAreaByIdApi.isFetching;
  const hasFetchingError = getGeoAreaByIdApi.isError;

  const commonPageIntroProps = {
    title: isCreating
      ? t('ui.geofenceManager.addGeofence', 'Add Geofence')
      : t('ui.geofenceManager.editGeofence', 'Edit Geofence'),
    headerNavButton: <BackIconButton />,
    showSaveOptions,
    isWithinDrawer,
  };

  if (isFetchingEditData || hasFetchingError) {
    return (
      <>
        <PageIntroWrapper sticky {...(isWithinDrawer && { topOffset: 0 })}>
          <EditorPageIntro
            {...commonPageIntroProps}
            cancelCallback={refetchEditData}
            saveCallback={() => {}}
            saveAndExitCallback={() => {}}
            isSubmitting={!hasFetchingError}
          />
        </PageIntroWrapper>

        <Box mt={3}>
          <TransitionLoadingSpinner in={isFetchingEditData} />
          <TransitionErrorMessage
            in={!isFetchingEditData && hasFetchingError}
          />
        </Box>
      </>
    );
  }

  const descriptionText = t('ui.common.description', 'Description');
  const validationSchema = buildValidationSchema(t, {
    descriptionText,
  });

  return (
    <Wrapper $topOffset={topOffset}>
      <Formik<Values>
        // NOTE: Using `enableReinitialize` could cause the resetForm method to
        // not work. Instead, we're resetting the form by re-fetching the
        // required data to edit the form, and unmounting then mounting the form
        // again so that the initialValues passed from the parent are used
        // correctly
        initialValues={formattedInitialValues}
        validateOnChange
        validateOnBlur
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, submitForm, setFieldValue, resetForm }) => {
          return (
            <>
              <PageIntroWrapper
                sticky
                {...(isWithinDrawer && { topOffset: 0 })}
              >
                <EditorPageIntro
                  {...commonPageIntroProps}
                  isSubmitting={isSubmitting}
                  submissionResult={saveGeoAreaApi.data}
                  submissionError={saveGeoAreaApi.error}
                  /* eslint-disable indent */
                  cancelCallback={
                    !isCreating
                      ? () => {
                          resetForm();
                          refetchEditData();
                        }
                      : undefined
                  }
                  /* eslint-enable indent */
                  submitForm={submitForm}
                  saveCallback={saveCallback}
                  saveAndExitCallback={saveAndExitCallback}
                />
              </PageIntroWrapper>

              <Box
                mt={3}
                display="flex"
                flexWrap="nowrap"
                flexDirection="column"
                flex={1}
              >
                <Fade
                  in={!editGeoAreaError && !isFetchingEditData}
                  style={{ display: 'flex', flex: 1 }}
                >
                  <div>
                    {!editGeoAreaError && !isFetchingEditData && (
                      <Grid
                        container
                        spacing={2}
                        direction="column"
                        justify="space-between"
                      >
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                          }}
                        >
                          <ObjectForm
                            isSubmitting={isSubmitting}
                            initialCoordinates={
                              formattedInitialValues.geoAreaPolygons
                            }
                            initialGeometryType={
                              formattedInitialValues.geoAreaTypeId
                            }
                            setFieldValue={setFieldValue}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </div>
                </Fade>
              </Box>
            </>
          );
        }}
      </Formik>
    </Wrapper>
  );
};

export default GeofenceEditor;
