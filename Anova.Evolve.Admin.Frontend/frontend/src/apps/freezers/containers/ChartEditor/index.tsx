/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ChartDataChannelDto, UserChartDto } from 'api/admin/api';
import FreezerChart from 'apps/freezers/components/FreezerChart';
import {
  getDataChannelToColorMapping,
  getDetailsInitialEndDate,
  getDetailsInitialStartDate,
} from 'apps/freezers/helpers';
import { useGetFreezerTimeSeriesForDataChannels } from 'apps/freezers/hooks/useGetFreezerTimeSeriesForDataChannels';
import routes from 'apps/freezers/routes';
import { LocationState } from 'apps/freezers/types';
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
import { useSelector } from 'react-redux';
import {
  generatePath,
  useHistory,
  useLocation,
  useParams,
} from 'react-router-dom';
import {
  selectCanCreateFreezerChart,
  selectCanUpdateFreezerChart,
} from 'redux-app/modules/user/selectors';
import { isNumber } from 'utils/format/numbers';
import GraphSeriesList from './components/GraphSeriesList';
import PageIntro from './components/PageIntro';
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
import { useGetChart } from './hooks/useGetChart';
import { useGetDataChannelsByAssetId } from './hooks/useGetDataChannelsByAssetId';
import { useSaveChart } from './hooks/useSaveChart';
import {
  ChartYAxisPosition,
  GraphSeries,
  GraphSeriesMap,
  Values,
} from './types';

interface RouteParams {
  freezerId: string;
  chartId: string;
}

const ChartEditor = () => {
  const { t } = useTranslation();
  const location = useLocation<LocationState | undefined>();
  const history = useHistory();
  const params = useParams<RouteParams>();

  const editingObjectId = params.chartId;
  const isCreating = !editingObjectId;

  const canCreateChart = useSelector(selectCanCreateFreezerChart);
  const canUpdateChart = useSelector(selectCanUpdateFreezerChart);
  const showSaveOptions =
    (isCreating && canCreateChart) || (!isCreating && canUpdateChart);

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
  // TODO: Modify the initial graph series map
  const [graphSeriesMap, setGraphSeriesMap] = useState<GraphSeriesMap>(
    initialGraphSeriesMap
  );

  const getDataChannelsByAssetIdApi = useGetDataChannelsByAssetId({
    assetId: params.freezerId,
  });
  const retrieveChartApi = useGetChart({
    // This won't fetch chart details unless editingObjectId exists (i.e. when
    // editing a chart)
    ...(isNumber(editingObjectId) && { chartId: Number(editingObjectId) }),
  });
  const saveChartApi = useSaveChart({
    onMutate: () => setHasSubmissionError(false),
    onError: () => setHasSubmissionError(true),
  });
  const allChartDataChannels = useMemo(() => {
    // We need to override the left and right axis when the user modifies these
    // fields, otherwise, they always remain on the same side as when the page
    // was first loaded.
    const leftAxisSeries = graphSeriesMap.leftAxis.map<GraphSeries>(
      (series) => ({
        ...series,
        chartYAxisPosition: ChartYAxisPosition.Left,
      })
    );
    const rightAxisSeries = graphSeriesMap.rightAxis.map<GraphSeries>(
      (series) => ({
        ...series,
        chartYAxisPosition: ChartYAxisPosition.Right,
      })
    );
    return leftAxisSeries.concat(rightAxisSeries);
  }, [graphSeriesMap]);
  const {
    tagNameToTimeSeriesDataMapping,
  } = useGetFreezerTimeSeriesForDataChannels({
    freezerId: params.freezerId,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
    dataChannels: allChartDataChannels,
  });

  const chartNameText = t('ui.freezers.chartEditor.chartName', 'Chart name');
  const leftAxisText = t('ui.freezers.chartEditor.leftAxis', 'Left axis');
  const rightAxisText = t('ui.freezers.chartEditor.rightAxis', 'Right axis');

  // Memoized to prevent unnecessary data/re-renders while using formik's
  // enableReinitialize prop
  const initialValues = useMemo(
    () => formatInitialValues(retrieveChartApi.data),
    [retrieveChartApi.data]
  );

  const validationSchema = buildValidationSchema(t, {
    chartNameText,
  });

  const dataChannelIdToColorMapping = useMemo(
    () => getDataChannelToColorMapping(getDataChannelsByAssetIdApi.data),
    [getDataChannelsByAssetIdApi.data]
  );

  useEffect(() => {
    const chartDataChannels = retrieveChartApi.data?.chartDataChannels?.map<GraphSeries>(
      (chartDataChannel) => {
        return {
          ...chartDataChannel,
          color: dataChannelIdToColorMapping?.[chartDataChannel.tagId!],
        };
      }
    );
    const leftAxis = chartDataChannels
      ?.filter(
        (chartDataChannel) =>
          chartDataChannel.chartYAxisPosition === ChartYAxisPosition.Left
      )
      .map<GraphSeries>((chartDataChannel) => {
        return {
          ...chartDataChannel,
          color: dataChannelIdToColorMapping?.[chartDataChannel.tagId!],
          units: null,
        };
      });
    const rightAxis = chartDataChannels
      ?.filter(
        (chartDataChannel) =>
          chartDataChannel.chartYAxisPosition === ChartYAxisPosition.Right
      )
      .map<GraphSeries>((chartDataChannel) => {
        return {
          ...chartDataChannel,
          color: dataChannelIdToColorMapping?.[chartDataChannel.tagId!],
          units: null,
        };
      });

    const nonSelectedChartDataChannels = getDataChannelsByAssetIdApi.data?.filter(
      (dataChannel) =>
        !chartDataChannels?.find(
          (chartDataChannel) => chartDataChannel.tagId === dataChannel.tagId
        )
    );

    const newParameters = nonSelectedChartDataChannels?.map<GraphSeries>(
      (chartDataChannel) => {
        return {
          ...chartDataChannel,
          color: dataChannelIdToColorMapping?.[chartDataChannel.tagId!],
          units: null,
        };
      }
    );

    const newGraphSeriesMap: GraphSeriesMap = {
      parameters: newParameters || [],
      leftAxis: leftAxis || [],
      rightAxis: rightAxis || [],
    };

    setGraphSeriesMap(newGraphSeriesMap);
  }, [
    retrieveChartApi.data,
    getDataChannelsByAssetIdApi.data,
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
      chartId: editingObjectId,
      assetId: params.freezerId,
    });
    return saveChartApi.mutateAsync(formattedValuesForApi).catch((error) => {
      if (error) {
        const formattedErrors = mapApiErrorsToFields(t, error);

        formikBag.setErrors(formattedErrors as any);
        formikBag.setStatus({ errors: formattedErrors });
      }
    });
  };

  const saveCallback = (chart: UserChartDto) => {
    const editRoutePath = generatePath(routes.charts.detail, {
      freezerId: params.freezerId,
      chartId: chart.chartId,
    });
    history.replace(editRoutePath, routeState);
  };
  const saveAndExitCallback = () => {
    const listRoutePath = generatePath(routes.freezers.detail, {
      freezerId: params.freezerId,
    });
    history.push(listRoutePath, routeState);
  };

  const isFetching =
    retrieveChartApi.isFetching || getDataChannelsByAssetIdApi.isFetching;
  const isEditDataError =
    retrieveChartApi.isError || getDataChannelsByAssetIdApi.isError;

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
            showSaveOptions={showSaveOptions}
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
              <PageIntroWrapper sticky>
                <PageIntro
                  isCreating={isCreating}
                  isSubmitting={isSubmitting}
                  submissionError={hasSubmissionError}
                  submissionResult={saveChartApi.data}
                  submitForm={submitForm}
                  showSaveOptions={showSaveOptions}
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
                        <CustomBoxRedesign px={4} py={3}>
                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={6} lg={4}>
                              <Field
                                id="name-input"
                                component={CustomTextField}
                                name="name"
                                label={chartNameText}
                                required
                              />
                            </Grid>
                          </Grid>
                        </CustomBoxRedesign>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={2} alignItems="stretch">
                          <Grid
                            item
                            xs={12}
                            md={5}
                            lg={4}
                            style={{ display: 'flex' }}
                          >
                            <CustomBoxRedesign
                              px={4}
                              py={3}
                              display="flex"
                              flexDirection="column"
                              flexGrow={1}
                              boxSizing="border-box"
                              height="100%"
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
                            <Grid
                              container
                              spacing={2}
                              alignItems="stretch"
                              style={{ height: '100%' }}
                            >
                              <Grid
                                item
                                xs={12}
                                style={{
                                  display: 'flex',
                                  alignItems: 'stretch',
                                  flexWrap: 'nowrap',
                                }}
                              >
                                <CustomBoxRedesign
                                  px={4}
                                  py={3}
                                  height="100%"
                                  boxSizing="border-box"
                                  width="100%"
                                >
                                  <PageSubHeader>
                                    {t(
                                      'ui.freezers.chartEditor.chartConfiguration',
                                      'Chart configuration'
                                    )}
                                  </PageSubHeader>

                                  <Grid container spacing={2}>
                                    <Grid item xs={12} lg={6}>
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
                                    <Grid item xs={12} lg={6}>
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
                              <Grid
                                item
                                xs={12}
                                style={{
                                  display: 'flex',
                                  alignItems: 'stretch',
                                  flexWrap: 'nowrap',
                                }}
                              >
                                <CustomBoxRedesign
                                  px={4}
                                  pt={3}
                                  pb={4}
                                  height="100%"
                                  boxSizing="border-box"
                                  display="flex"
                                  flexDirection="column"
                                  width="100%"
                                >
                                  <PageSubHeader>
                                    {t(
                                      'ui.freezers.chartEditor.chartPreview',
                                      'Chart preview'
                                    )}
                                  </PageSubHeader>
                                  <FreezerChart
                                    freezerId={params.freezerId}
                                    startDate={startDate}
                                    endDate={endDate}
                                    tagNameToTimeSeriesDataMapping={
                                      tagNameToTimeSeriesDataMapping
                                    }
                                    dataChannelIdToColorMapping={
                                      dataChannelIdToColorMapping
                                    }
                                    chartDataChannels={
                                      allChartDataChannels as ChartDataChannelDto[]
                                    }
                                    height={370}
                                  />
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

export default ChartEditor;
