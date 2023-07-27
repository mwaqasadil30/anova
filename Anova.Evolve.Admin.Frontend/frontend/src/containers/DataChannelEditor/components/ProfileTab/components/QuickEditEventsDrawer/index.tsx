/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import { DataChannelEventRulesDTO } from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import CustomThemeProvider from 'components/CustomThemeProvider';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EmptyContentBlock from 'components/EmptyContentBlock';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageSubHeader from 'components/PageSubHeader';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import { IS_QUICK_EDIT_EVENTS_SAVE_FEATURE_ENABLED } from 'env';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient, UseQueryResult } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { buildUnitsOfMeasureTextMapping } from 'utils/i18n/enum-to-text';
import { getGenericDataChannelDescription } from 'utils/ui/helpers';
import InventoryEventsTableBodyRow from './components/InventoryEventsTableBodyRow';
import LevelEventsTableBodyRow from './components/LevelEventsTableBodyRow';
import MissingDataEventsTableBodyRow from './components/MissingDataEventsTableBodyRow';
import RostersForm from './components/RostersForm';
import UsageRateEventsTableBodyRow from './components/UsageRateEventsTableBodyRow';
import {
  buildValidationSchema,
  formatDataChannelsForForm,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './formHelpers';
import { useSaveEventRules } from './hooks/useSaveEventRules';
import PageIntro from './PageIntro';
import {
  CommonEventTableRowProps,
  EditingEventRuleData,
  Status,
  Values,
} from './types';

interface Props {
  dataChannelEventsApi: UseQueryResult<DataChannelEventRulesDTO, unknown>;
  canUpdateEvents?: boolean;
  cancelCallback: () => void;
  saveAndExitCallback: () => void;
}

const QuickEditEventsDrawer = ({
  dataChannelEventsApi,
  canUpdateEvents,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const unitsOfMeasureTextMapping = buildUnitsOfMeasureTextMapping(t);

  const [isRostersDrawerOpen, setIsRostersDrawerOpen] = useState(false);
  const [
    editingEventRule,
    setEditingEventRule,
  ] = useState<EditingEventRuleData | null>(null);

  const toggleEventRuleDrawer = (
    open: boolean,
    eventRuleData?: EditingEventRuleData
  ) => {
    if (open && eventRuleData) {
      setEditingEventRule(eventRuleData);
    }

    setIsRostersDrawerOpen(open);
  };

  const openRostersDrawer = (eventRuleData: EditingEventRuleData) => {
    return toggleEventRuleDrawer(true, eventRuleData);
  };
  const closeRostersDrawer = () => {
    return toggleEventRuleDrawer(false);
  };

  const validationSchema = buildValidationSchema(t, {
    hoursText: t('ui.common.hours', 'Hour(s)'),
    minutesText: t('ui.common.mins', 'Min(s)'),
  });

  const saveDataChannelEventRulesApi = useSaveEventRules({
    onSuccess: () => {
      queryClient.invalidateQueries(
        APIQueryKey.getDataChannelEventsByDataChannelId
      );
    },
  });

  const dataChannelsWithEvents = dataChannelEventsApi?.data;

  const formattedInitialValues = formatDataChannelsForForm(
    dataChannelsWithEvents
  );

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear server-side errors when re-submitting the form
    formikBag.setStatus({});

    const formattedDataChannel = formatValuesForApi(
      values,
      formattedInitialValues
    );

    // Don't make an API call if there events were not changed. Use an
    // empty Promise so Formik can set isSubmitting to false immediately.
    if (
      !formattedDataChannel.inventoryEvents?.length &&
      !formattedDataChannel.levelEvents?.length &&
      !formattedDataChannel.missingDataEvent &&
      !formattedDataChannel.usageRateEvent
    ) {
      return new Promise((resolve) => {
        // TODO: Verify if using an empty object works
        resolve({});
        saveAndExitCallback();
        // saveAndExitCallback([]);
      });
    }

    return saveDataChannelEventRulesApi
      .mutateAsync({
        dataChannelId: dataChannelEventsApi?.data?.dataChannelId!,
        eventRules: formattedDataChannel,
      })
      .then(() => {
        dispatch(enqueueSaveSuccessSnackbar(t));
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(
          t,
          error as any,
          // IMPORTANT: We send the list of the full data channel object so we
          // can compare errors across any event rule that may have failed
          // validation.
          formattedInitialValues
        );
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const saveCallback = () => {};

  const canEditEvents =
    IS_QUICK_EDIT_EVENTS_SAVE_FEATURE_ENABLED && canUpdateEvents;

  return (
    <Formik
      initialValues={formattedInitialValues}
      validationSchema={validationSchema}
      // NOTE: We're using enableReinitialize so we can render the sticky
      // PageIntroWrapper while the API call is being made or when there's an
      // error so the user can click on "Cancel" to close the drawer. If
      // there's weird form issues, it may be worth seeing if it's because of
      // enableReinitialize.
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        values,
        errors,
        status,
        submitForm,
        setFieldValue,
      }) => {
        const hasEditableEvents =
          !!values.inventoryEvents?.length ||
          !!values.levelEvents?.length ||
          !!values.missingDataEvent ||
          !!values.usageRateEvent;

        const updateEventRostersAndCloseRostersDrawer = (response: string) => {
          if (editingEventRule) {
            const rostersFieldName = `${editingEventRule.fieldNamePrefix}.rosters`;
            setFieldValue(rostersFieldName, response || '');
          }
          closeRostersDrawer();
        };

        // copied from logic after hasEditableEvents but moved up here

        // We need to iterate through the original list of data
        // channels because we need to use the correct data
        // channel index for the form (not the filtered data
        // channel index)
        const hasInventoryEvents = !!values.inventoryEvents?.length;
        const hasLevelEvents = !!values.levelEvents?.length;
        const hasMissingDataEvent = !!values.missingDataEvent;
        const hasUsageRateEvent = !!values.usageRateEvent;

        const fullDataChannelDescription = getGenericDataChannelDescription({
          type: values.dataChannelTypeId,
          dataChannelDescription: values.dataChannelDescription,
          productDescription: values.productDescription,
        });

        const hasIntegrationId = !!values.hasIntegrationEnabled;

        const commonRowProps: CommonEventTableRowProps = {
          canEdit: canEditEvents,
          hasIntegrationId,
          dataChannel: values,
          // TODO: THIS SHOULDNT BE NEEDED ANYMORE. USING 0 TO GET AROUND TYPESCRIPT ISSUES FOR NOW
          dataChannelIndex: 0,
          errors,
          status: status as Status,
          openRostersDrawer,
        };

        return (
          <>
            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <PageIntro
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={saveDataChannelEventRulesApi?.data}
                  submissionError={saveDataChannelEventRulesApi.error}
                  cancelCallback={cancelCallback}
                  saveCallback={saveCallback}
                  saveAndExitCallback={saveAndExitCallback}
                  disableSaveButton={
                    isSubmitting ||
                    dataChannelEventsApi.isFetching ||
                    dataChannelEventsApi.isError
                  }
                  showSaveButton={canEditEvents}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>

            <TransitionLoadingSpinner in={dataChannelEventsApi.isFetching} />
            <TransitionErrorMessage
              in={
                !dataChannelEventsApi.isFetching && dataChannelEventsApi.isError
              }
            />

            <DefaultTransition
              in={
                !dataChannelEventsApi.isFetching &&
                dataChannelEventsApi.isSuccess
              }
              unmountOnExit
            >
              <div>
                <Form>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Drawer
                        anchor="right"
                        open={isRostersDrawerOpen}
                        variant="temporary"
                        onClose={() => {
                          setIsRostersDrawerOpen(false);
                        }}
                        // disableBackdropClick
                      >
                        <DrawerContent>
                          {domainId && (
                            <RostersForm
                              domainId={domainId}
                              // @ts-ignore
                              eventRule={editingEventRule?.eventRule}
                              eventRuleType={editingEventRule?.eventRuleType}
                              cancelCallback={closeRostersDrawer}
                              saveAndExitCallback={
                                updateEventRostersAndCloseRostersDrawer
                              }
                            />
                          )}
                        </DrawerContent>
                      </Drawer>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} alignItems="center">
                    {/*
                      If there are no data channels with events, show an empty message
                    */}
                    {!hasEditableEvents ? (
                      <Grid item xs={12}>
                        <EmptyContentBlock
                          message={t(
                            'ui.assetdetail.noEventsConfigured',
                            'No events configured'
                          )}
                        />
                      </Grid>
                    ) : (
                      <>
                        <Grid item xs={12}>
                          <PageSubHeader dense>
                            {fullDataChannelDescription}
                          </PageSubHeader>
                        </Grid>
                        <Grid item xs>
                          <TableContainer>
                            <Table style={{ minWidth: 1000 }}>
                              <TableHead>
                                <TableHeadRow>
                                  {/* The RTU sync icon cell */}
                                  <TableHeadCell
                                    style={{ width: 50, padding: 0 }}
                                  />
                                  <TableHeadCell style={{ width: 200 }}>
                                    {t('ui.common.event', 'Event')}
                                  </TableHeadCell>
                                  <TableHeadCell style={{ width: 400 }}>
                                    {t(
                                      'ui.assetDetailEvents.eventValues',
                                      'Event Values'
                                    )}
                                  </TableHeadCell>
                                  <TableHeadCell style={{ minWidth: 170 }}>
                                    {t('ui.events.rosters', 'Roster(s)')}
                                  </TableHeadCell>
                                  {hasIntegrationId && (
                                    <TableHeadCell style={{ minWidth: 190 }}>
                                      {t(
                                        'ui.datachanneleventrule.integrationid',
                                        'Integration ID'
                                      )}
                                    </TableHeadCell>
                                  )}
                                </TableHeadRow>
                              </TableHead>
                              <TableBody>
                                {hasInventoryEvents && (
                                  <InventoryEventsTableBodyRow
                                    {...commonRowProps}
                                    unitsOfMeasureTextMapping={
                                      unitsOfMeasureTextMapping
                                    }
                                  />
                                )}

                                {hasLevelEvents && (
                                  <LevelEventsTableBodyRow
                                    {...commonRowProps}
                                    unitsOfMeasureTextMapping={
                                      unitsOfMeasureTextMapping
                                    }
                                  />
                                )}

                                {hasUsageRateEvent && (
                                  <UsageRateEventsTableBodyRow
                                    {...commonRowProps}
                                    unitsOfMeasureTextMapping={
                                      unitsOfMeasureTextMapping
                                    }
                                  />
                                )}

                                {hasMissingDataEvent && (
                                  <MissingDataEventsTableBodyRow
                                    {...commonRowProps}
                                  />
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Form>
              </div>
            </DefaultTransition>
          </>
        );
      }}
    </Formik>
  );
};

export default QuickEditEventsDrawer;
