import Grid from '@material-ui/core/Grid';
import { QuickEditEventsDto } from 'api/admin/api';
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
import { useDispatch } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
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
import { useRetrieveDataChannelEventRulesByAssetId } from './hooks/useRetrieveDataChannelEventRulesByAssetId';
import { useSaveEventRules } from './hooks/useSaveEventRules';
import PageIntro from './PageIntro';
import {
  CommonEventTableRowProps,
  EditingEventRuleData,
  Status,
  Values,
} from './types';

interface Props {
  assetId: string;
  domainId?: string;
  isPublishedAsset?: boolean;
  canUpdateEvents?: boolean;
  cancelCallback: () => void;
  saveAndExitCallback: (updatedDataChannels: QuickEditEventsDto[]) => void;
}

const EventsDrawer = ({
  assetId,
  domainId,
  isPublishedAsset,
  canUpdateEvents,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

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

  const dataChannelEventRulesApi = useRetrieveDataChannelEventRulesByAssetId(
    assetId
  );
  const saveDataChannelEventRulesApi = useSaveEventRules();

  const dataChannelsWithEvents = dataChannelEventRulesApi?.data;

  const formattedInitialValues = {
    dataChannels: formatDataChannelsForForm(dataChannelsWithEvents),
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear server-side errors when re-submitting the form
    formikBag.setStatus({});

    const formattedDataChannels = formatValuesForApi(
      values,
      formattedInitialValues
    );

    // Don't make an API call if there are no data channels to update. Use an
    // empty Promise so Formik can set isSubmitting to false immediately.
    if (!formattedDataChannels.length) {
      return new Promise((resolve) => {
        resolve([]);
        saveAndExitCallback([]);
      });
    }

    return saveDataChannelEventRulesApi
      .mutateAsync({
        assetId,
        eventRules: formattedDataChannels,
      })
      .then(() => {
        dispatch(enqueueSaveSuccessSnackbar(t));
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(
          t,
          error as any,
          formattedInitialValues.dataChannels
        );
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const saveCallback = () => {};

  const canEditEvents =
    IS_QUICK_EDIT_EVENTS_SAVE_FEATURE_ENABLED &&
    !isPublishedAsset &&
    canUpdateEvents;

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
        const filteredDataChannels = values.dataChannels?.filter(
          (dataChannel) => {
            const hasInventoryEvents = !!dataChannel.inventoryEvents?.length;
            const hasLevelEvents = !!dataChannel.levelEvents?.length;
            const hasMissingDataEvent = !!dataChannel.missingDataEvent;
            const hasUsageRateEvent = !!dataChannel.usageRateEvent;

            return (
              hasInventoryEvents ||
              hasLevelEvents ||
              hasMissingDataEvent ||
              hasUsageRateEvent
            );
          }
        );

        const updateEventRostersAndCloseRostersDrawer = (response: string) => {
          if (editingEventRule) {
            const rostersFieldName = `${editingEventRule.fieldNamePrefix}.rosters`;
            setFieldValue(rostersFieldName, response || '');
          }
          closeRostersDrawer();
        };

        return (
          <>
            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <PageIntro
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={saveDataChannelEventRulesApi.data}
                  submissionError={saveDataChannelEventRulesApi.error}
                  cancelCallback={cancelCallback}
                  saveCallback={saveCallback}
                  saveAndExitCallback={saveAndExitCallback}
                  disableSaveButton={
                    isSubmitting ||
                    dataChannelEventRulesApi.isFetching ||
                    dataChannelEventRulesApi.isError
                  }
                  showSaveButton={canEditEvents}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>

            <TransitionLoadingSpinner
              in={dataChannelEventRulesApi.isFetching}
            />
            <TransitionErrorMessage
              in={
                !dataChannelEventRulesApi.isFetching &&
                dataChannelEventRulesApi.isError
              }
            />

            <DefaultTransition
              in={
                !dataChannelEventRulesApi.isFetching &&
                dataChannelEventRulesApi.isSuccess
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
                    {!filteredDataChannels?.length ? (
                      <Grid item xs={12}>
                        <EmptyContentBlock
                          message={t(
                            'ui.assetdetail.noEventsConfigured',
                            'No events configured'
                          )}
                        />
                      </Grid>
                    ) : (
                      // We need to iterate through the original list of data
                      // channels because we need to use the correct data
                      // channel index for the form (not the filtered data
                      // channel index)
                      values.dataChannels?.map(
                        (dataChannel, dataChannelIndex) => {
                          const hasInventoryEvents = !!dataChannel
                            .inventoryEvents?.length;
                          const hasLevelEvents = !!dataChannel.levelEvents
                            ?.length;
                          const hasMissingDataEvent = !!dataChannel.missingDataEvent;
                          const hasUsageRateEvent = !!dataChannel.usageRateEvent;

                          if (
                            !hasInventoryEvents &&
                            !hasLevelEvents &&
                            !hasMissingDataEvent &&
                            !hasUsageRateEvent
                          ) {
                            return null;
                          }

                          const fullDataChannelDescription = getGenericDataChannelDescription(
                            {
                              type: dataChannel.dataChannelTypeId,
                              dataChannelDescription:
                                dataChannel.dataChannelDescription,
                              productDescription:
                                dataChannel.productDescription,
                            }
                          );

                          const hasIntegrationId = !!dataChannel.hasIntegrationEnabled;

                          const commonRowProps: CommonEventTableRowProps = {
                            canEdit: canEditEvents,
                            hasIntegrationId,
                            dataChannel,
                            dataChannelIndex,
                            errors,
                            status: status as Status,
                            openRostersDrawer,
                          };

                          return (
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
                                        <TableHeadCell
                                          style={{ minWidth: 170 }}
                                        >
                                          {t('ui.events.rosters', 'Roster(s)')}
                                        </TableHeadCell>
                                        {hasIntegrationId && (
                                          <TableHeadCell
                                            style={{ minWidth: 190 }}
                                          >
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
                          );
                        }
                      )
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

export default EventsDrawer;
