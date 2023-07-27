/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { ChartDefaultDto } from 'api/admin/api';
import {
  getDetailsInitialEndDate,
  getDetailsInitialStartDate,
  getTagToColorMapping,
} from 'apps/freezers/helpers';
import routes from 'apps/freezers/routes';
import { AssetSubTypeEnum, LocationState } from 'apps/freezers/types';
import BackIconButton from 'components/buttons/BackIconButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageSubHeader from 'components/PageSubHeader';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import {
  generatePath,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import { isNumber } from 'utils/format/numbers';
import { getFreezerAssetSubTypeOptions } from 'utils/i18n/enum-to-text';
import GraphSeriesList from './components/GraphSeriesList';
import PageIntro from './components/PageIntro';
import DefaultChartEditorFormEffect from './DefaultChartEditorFormEffect';
import {
  initialGraphSeriesMap,
  reorderGraphSeriesMap,
} from './dragAndDropHelpers';
import {
  buildValidationSchema,
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './formHelpers';
import { useGetDefaultChart } from './hooks/useGetDefaultChart';
import { useGetTagListByAssetSubTypeId } from './hooks/useGetTagsByAssetSubTypeId';
import { useSaveDefaultChart } from './hooks/useSaveDefaultChart';
import {
  ChartYAxisPosition,
  GraphSeries,
  GraphSeriesMap,
  Values,
} from './types';

interface RouteParams {
  defaultChartId: string;
}

const DefaultChartEditor = () => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();
  const params = useParams<RouteParams>();

  const editingObjectId = params.defaultChartId;

  const isCreating = !editingObjectId;

  const [startDate] = useState(() =>
    getDetailsInitialStartDate(location.state?.startDate)
  );
  const [endDate] = useState(() =>
    getDetailsInitialEndDate(location.state?.endDate)
  );
  const routeState = {
    startDate: startDate.toJSON(),
    endDate: endDate.toJSON(),
  };

  const [hasSubmissionError, setHasSubmissionError] = useState(false);
  const [graphSeriesMap, setGraphSeriesMap] = useState<GraphSeriesMap>(
    initialGraphSeriesMap
  );

  const [
    selectedFreezerAssetSubType,
    setSelectedFreezerAssetSubType,
  ] = useState<AssetSubTypeEnum>();

  const freezerAssetSubTypeOptions = getFreezerAssetSubTypeOptions(t);

  const getChartTagsByAssetSubTypeIdApi = useGetTagListByAssetSubTypeId({
    // NOTE/TODO: tags are not retrieved through params anymore, its by freezer type,
    // assetSubTypeId, an ENUM that the back-end needs to create still
    assetSubTypeId: selectedFreezerAssetSubType,
  });

  const retrieveChartApi = useGetDefaultChart({
    // This won't fetch chart details unless editingObjectId exists (i.e. when
    // editing a chart)
    ...(isNumber(editingObjectId) && {
      defaultChartId: Number(editingObjectId),
    }),
  });
  const saveChartApi = useSaveDefaultChart({
    onMutate: () => setHasSubmissionError(false),
    onError: () => setHasSubmissionError(true),
  });

  const chartNameText = t(
    'ui.freezer.defaultChartEditor.globalChartName',
    'Global Chart Name'
  );
  const leftAxisText = t('ui.freezers.chartEditor.leftAxis', 'Left axis');
  const rightAxisText = t('ui.freezers.chartEditor.rightAxis', 'Right axis');
  const sortIndexText = t(
    'ui.freezer.defaultChartEditor.sortIndex',
    'Sort Index'
  );

  // Memoized to prevent unnecessary data/re-renders while using formik's
  // enableReinitialize prop
  const initialValues = useMemo(
    () => formatInitialValues(retrieveChartApi.data),
    [retrieveChartApi.data]
  );

  const validationSchema = buildValidationSchema(t, {
    chartNameText,
    sortIndexText,
  });

  const dataChannelIdToColorMapping = useMemo(
    () => getTagToColorMapping(getChartTagsByAssetSubTypeIdApi.data),
    [getChartTagsByAssetSubTypeIdApi.data]
  );

  useEffect(() => {
    const chartTags = retrieveChartApi.data?.chartDefaultTags?.map<GraphSeries>(
      (chartTag) => {
        return {
          ...chartTag,
          color: dataChannelIdToColorMapping?.[chartTag.chartDefaultTagId!],
        };
      }
    );

    const leftAxis = chartTags
      ?.filter(
        (chartTag) => chartTag.chartYaxisPosition === ChartYAxisPosition.Left
      )
      .map<GraphSeries>((chartTag) => {
        return {
          ...chartTag,
          color: dataChannelIdToColorMapping?.[chartTag.chartDefaultTagId!],
          units: null,
        };
      });

    const rightAxis = chartTags
      ?.filter(
        (chartTag) => chartTag.chartYaxisPosition === ChartYAxisPosition.Right
      )
      .map<GraphSeries>((chartTag) => {
        return {
          ...chartTag,
          color: dataChannelIdToColorMapping?.[chartTag.chartDefaultTagId!],
          units: null,
        };
      });

    const nonSelectedChartTags = getChartTagsByAssetSubTypeIdApi.data?.filter(
      (tag) => {
        const result = !chartTags?.find(
          (chartTag) => chartTag.chartDefaultTagId === Number(tag.tagId)
        );
        return result;
      }
    );

    const newParameters = nonSelectedChartTags?.map<GraphSeries>((chartTag) => {
      return {
        tagName: chartTag.tagName,
        chartDefaultTagId: Number(chartTag.tagId),
        color: dataChannelIdToColorMapping?.[chartTag.tagId!],
        units: null,
      };
    });

    const newGraphSeriesMap: GraphSeriesMap = {
      parameters: newParameters || [],
      leftAxis: leftAxis || [],
      rightAxis: rightAxis || [],
    };

    setGraphSeriesMap(newGraphSeriesMap);
  }, [
    retrieveChartApi.data,
    getChartTagsByAssetSubTypeIdApi.data,
    dataChannelIdToColorMapping,
  ]);

  const onDragEnd = (
    result: DropResult,
    values: Values,
    setValues: FormikHelpers<Values>['setValues']
  ) => {
    // dropped nowhere
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    const reorderedData = reorderGraphSeriesMap({
      graphSeriesMap,
      source,
      destination,
    });
    setGraphSeriesMap(reorderedData.graphSeriesMap);

    // Using setValues here because of a Formik bug: calling setFieldValue with
    // an empty array removes the field from the form's `values` causing
    // validation errors to not appear. However, using setValues keeps the
    // field in the form's `values`.
    // https://github.com/formium/formik/issues/2151
    setValues({
      ...values,
      leftAxis: reorderedData.graphSeriesMap.leftAxis,
      rightAxis: reorderedData.graphSeriesMap.rightAxis,
    });
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setHasSubmissionError(false);

    const formattedValuesForApi = formatValuesForApi(values, {
      defaultChartId: editingObjectId,
    });
    return saveChartApi.mutateAsync(formattedValuesForApi).catch((error) => {
      if (error) {
        const formattedErrors = mapApiErrorsToFields(t, error);

        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      }
    });
  };

  const saveCallback = (chart: ChartDefaultDto) => {
    const editRoutePath = generatePath(routes.defaultChartManager.edit, {
      defaultChartId: chart.chartDefaultId,
    });
    history.replace(editRoutePath, routeState);
  };
  const saveAndExitCallback = () => {
    const listRoutePath = generatePath(routes.defaultChartManager.list);
    history.push(listRoutePath, routeState);
  };

  const { isFetching } = retrieveChartApi;
  const isEditDataError =
    retrieveChartApi.isError || getChartTagsByAssetSubTypeIdApi.isError;

  // Prevent the form from being rendered until we get all the necessary data
  // so Formik doesn't reinitialize the form (via enableReinitialize)
  // incorrectly
  if (isFetching || isEditDataError) {
    return (
      <>
        <PageIntroWrapper sticky>
          <PageIntro
            isCreating={isCreating}
            headerNavButton={<BackIconButton />}
          />
        </PageIntroWrapper>

        <Box mt={3}>
          <TransitionLoadingSpinner in={isFetching} />
          <TransitionErrorMessage in={!isFetching && isEditDataError} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Formik<Values>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, submitForm, setValues }) => {
          return (
            <>
              <DefaultChartEditorFormEffect
                values={values}
                setValues={setValues}
                setSelectedFreezerAssetSubType={setSelectedFreezerAssetSubType}
              />
              <PageIntroWrapper sticky>
                <PageIntro
                  isCreating={isCreating}
                  isSubmitting={isSubmitting}
                  submissionError={hasSubmissionError}
                  submissionResult={saveChartApi.data}
                  submitForm={submitForm}
                  headerNavButton={<BackIconButton />}
                  saveCallback={saveCallback}
                  saveAndExitCallback={saveAndExitCallback}
                />
              </PageIntroWrapper>

              <Box mt={2} />

              <TransitionLoadingSpinner
                in={!!editingObjectId && retrieveChartApi.isFetching}
              />
              <TransitionErrorMessage
                in={
                  !!editingObjectId &&
                  !retrieveChartApi.isFetching &&
                  retrieveChartApi.isError
                }
              />

              <DefaultTransition
                in={!retrieveChartApi.isFetching}
                unmountOnExit
              >
                <div>
                  <DragDropContext
                    onDragEnd={(result) => onDragEnd(result, values, setValues)}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Grid container spacing={2} alignItems="stretch">
                          <Grid item xs={12} md={5} lg={4}>
                            <CustomBoxRedesign
                              px={4}
                              py={3}
                              display="flex"
                              flexDirection="column"
                              flexGrow={1}
                              boxSizing="border-box"
                              width="100%"
                            >
                              <PageSubHeader>
                                {t(
                                  'ui.freezers.chartEditor.parameters',
                                  'Parameters'
                                )}
                              </PageSubHeader>

                              <Typography>
                                {t(
                                  'ui.freezers.chartEditor.parametersInstructions',
                                  'Drag & drop into chart configuration boxes'
                                )}
                              </Typography>

                              <Box
                                p={1}
                                maxHeight={750}
                                style={{ overflowY: 'auto' }}
                              >
                                <GraphSeriesList
                                  // title="parameters"
                                  listId="parameters"
                                  listType="card"
                                  // isDropDisabled={disabledDroppable === 'parameters'}
                                  graphSeriesList={graphSeriesMap.parameters}
                                />
                              </Box>
                            </CustomBoxRedesign>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={7}
                            lg={8}
                            style={{ display: 'flex' }}
                          >
                            <Grid container direction="column" spacing={2}>
                              <Grid item xs={12} style={{ flex: 0 }}>
                                <CustomBoxRedesign px={4} py={3}>
                                  <Grid container spacing={3}>
                                    <Grid item xs={5}>
                                      <Field
                                        id="name-input"
                                        component={CustomTextField}
                                        name="name"
                                        label={chartNameText}
                                        required
                                        placeholder={t(
                                          'ui.freezer.defaultChartEditor.enterName',
                                          'Enter name'
                                        )}
                                      />
                                    </Grid>

                                    <Grid item xs={4}>
                                      <Field
                                        id="assetSubTypeId-input"
                                        name="assetSubTypeId"
                                        component={CustomTextField}
                                        label={t(
                                          'ui.freezer.defaultChartEditor.freezerType',
                                          'Freezer Type'
                                        )}
                                        select
                                        disabled={isSubmitting || !isCreating}
                                      >
                                        {freezerAssetSubTypeOptions?.map(
                                          (option) => (
                                            <MenuItem
                                              key={option.value}
                                              value={option.value}
                                            >
                                              {option.label}
                                            </MenuItem>
                                          )
                                        )}
                                      </Field>
                                    </Grid>
                                    <Grid item xs={3}>
                                      <Field
                                        id="sortIndex-input"
                                        name="sortIndex"
                                        type="number"
                                        required
                                        component={CustomTextField}
                                        placeholder={t(
                                          'ui.freezer.defaultChartEditor.enterSortIndex',
                                          'Enter sort index'
                                        )}
                                        label={t(
                                          'ui.freezer.defaultChartEditor.sortIndex',
                                          'Sort Index'
                                        )}
                                      />
                                    </Grid>
                                  </Grid>
                                </CustomBoxRedesign>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                style={{
                                  display: 'flex',
                                  alignItems: 'stretch',
                                  flexWrap: 'nowrap',
                                  flex: 1,
                                }}
                              >
                                <CustomBoxRedesign
                                  px={4}
                                  py={3}
                                  boxSizing="border-box"
                                  width="100%"
                                  flex={1}
                                  display="flex"
                                  flexDirection="column"
                                >
                                  <PageSubHeader>
                                    {t(
                                      'ui.freezers.chartEditor.chartConfiguration',
                                      'Chart configuration'
                                    )}
                                  </PageSubHeader>

                                  <Grid
                                    container
                                    spacing={2}
                                    style={{ flex: 1 }}
                                  >
                                    <Grid
                                      item
                                      xs={12}
                                      lg={6}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                      }}
                                    >
                                      <Typography>{leftAxisText}</Typography>
                                      <GraphSeriesList
                                        // title="leftAxis"
                                        listId="leftAxis"
                                        listType="card"
                                        // isDropDisabled={disabledDroppable === 'leftAxis'}
                                        graphSeriesList={
                                          graphSeriesMap.leftAxis
                                        }
                                      />
                                      {touched.leftAxis && errors.leftAxis && (
                                        <FormHelperText error>
                                          {errors.leftAxis}
                                        </FormHelperText>
                                      )}
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      lg={6}
                                      style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                      }}
                                    >
                                      <Typography>{rightAxisText}</Typography>
                                      <GraphSeriesList
                                        // title="rightAxis"
                                        listId="rightAxis"
                                        listType="card"
                                        // isDropDisabled={disabledDroppable === 'rightAxis'}
                                        graphSeriesList={
                                          graphSeriesMap.rightAxis
                                        }
                                      />
                                      {touched.rightAxis &&
                                        errors.rightAxis && (
                                          <FormHelperText error>
                                            {errors.rightAxis}
                                          </FormHelperText>
                                        )}
                                    </Grid>
                                  </Grid>
                                </CustomBoxRedesign>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </DragDropContext>
                </div>
              </DefaultTransition>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default DefaultChartEditor;
