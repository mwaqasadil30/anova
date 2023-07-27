/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelReportDTO,
  EventRuleGroupListItemDto,
  QuickEditEventsDto,
  UnitConversionModeEnum,
  UserPermissionType,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import AccordionDetails from 'components/AccordionDetails';
import BackIconButton from 'components/buttons/BackIconButton';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EmptyContentBlock from 'components/EmptyContentBlock';
import FormErrorAlertWithMessage from 'components/FormErrorAlertWithMessage';
import EventRuleGroupAutocomplete from 'components/forms/form-fields/EventRuleGroupAutocomplete';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { StaticAccordion } from 'components/StaticAccordion';
import {
  BoxTitle,
  StyledAccordionSummary,
} from 'containers/DataChannelEditor/components/ProfileTab/styles';
import { IS_DATA_CHANNEL_EVENTS_EDIT_FEATURE_ENABLED } from 'env';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useUpdateEffect } from 'react-use';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import {
  selectActiveDomain,
  selectIsActiveDomainApciEnabled,
} from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { buildUnitsOfMeasureTextMapping } from 'utils/i18n/enum-to-text';
import DeliveryScheduleEventsTable from './components/DeliveryScheduleEventsTable';
import LevelAndInventoryEventsTable from './components/LevelAndInventoryEventsTable';
import MissingDataEventsTable from './components/MissingDataEventsTable';
import RostersForm from './components/RostersForm';
import UpdateEventRuleGroupDialog from './components/UpdateEventRuleGroupDialog';
import UsageRateEventsTable from './components/UsageRateEventsTable';
import CustomPageIntro from './CustomPageIntro';
import {
  buildValidationSchema,
  formatDataChannelsForForm,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './formHelpers';
import HandleSubmitFormEffect from './HandleSubmitFormEffect';
import { useGetDataChannelEventsByDataChannelId } from './hooks/useGetDataChannelEventsByDataChannelId';
import { useGetEventRuleGroupByEventRuleGroupId } from './hooks/useGetEventRuleGroupByEventRuleGroupId';
import { useSaveEventRules } from './hooks/useSaveEventRules';
import {
  CommonEventTableRowProps,
  EditingEventRuleData,
  Status,
  Values,
} from './types';

const StyledAccordionDetails = styled(AccordionDetails)`
  padding: 16px;
`;

const StyledAccordionBanner = styled(StyledAccordionSummary)`
  padding-top: 8px;
  padding-bottom: 8px;
`;

const StyledEventGroupTitleText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
  font-weight: 500;
`;

const StyledEventTypeText = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
`;

interface Props {
  dataChannelDetails?: DataChannelReportDTO | null;
  shouldSubmitEventForm: boolean;
  setShouldSubmitEventForm: (data: boolean) => void;
}

const DataChannelEventEditor = ({
  dataChannelDetails,
  shouldSubmitEventForm,
  setShouldSubmitEventForm,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const hasPermission = useSelector(selectHasPermission);
  const canUpdateEvents = hasPermission(
    UserPermissionType.DataChannelFullEditOfEvents,
    AccessType.Update
  );
  const canUpdateDataChannel = hasPermission(
    UserPermissionType.DataChannelGlobal,
    AccessType.Update
  );

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const queryClient = useQueryClient();

  const dataChannelEventsApi = useGetDataChannelEventsByDataChannelId(
    dataChannelDetails?.dataChannelId!
  );

  const dataChannelEventsApiData = dataChannelEventsApi?.data;

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

  const saveCallback = () => {};

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

  // This was used to disable specific fields (make them read only)
  const canEditEvents =
    // IS_QUICK_EDIT_EVENTS_SAVE_FEATURE_ENABLED &&
    // !isPublishedAsset &&
    true;

  const getFormattedScaledUnitsText = () => {
    const isBasicTank =
      dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
      UnitConversionModeEnum.Basic;
    const isSimplifiedTank =
      dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
      UnitConversionModeEnum.SimplifiedVolumetric;
    const isVolumetricTank =
      dataChannelDetails?.tankSetupInfo?.unitConversionModeId ===
      UnitConversionModeEnum.Volumetric;

    if (isBasicTank) {
      return `(${dataChannelDetails?.sensorCalibration?.scaledUnitsAsText})`;
    }
    if (isSimplifiedTank) {
      return `(${dataChannelDetails?.tankSetupInfo?.simplifiedTankSetupInfo?.displayUnitsAsText})`;
    }
    if (isVolumetricTank) {
      return `(${dataChannelDetails?.tankSetupInfo?.volumetricTankSetupInfo?.displayUnitsAsText})`;
    }
    return '';
  };
  const formattedScaledUnitsText = getFormattedScaledUnitsText();

  const defaultSetpointList = ['-'];

  const levelSetpointList = dataChannelEventsApiData?.setpointSelectionLists
    ?.levelSetpoints?.length
    ? defaultSetpointList.concat(
        dataChannelEventsApiData?.setpointSelectionLists?.levelSetpoints
      )
    : defaultSetpointList;

  const localSetpointList = dataChannelEventsApiData?.setpointSelectionLists
    ?.localSetpoints?.length
    ? dataChannelEventsApiData?.setpointSelectionLists?.localSetpoints
    : [];

  const combinedSelectableLevelAndLocalSetpointList = levelSetpointList.concat(
    localSetpointList
  );

  const usageRateSetpointList = dataChannelEventsApiData?.setpointSelectionLists
    ?.usageRateSetpoints?.length
    ? defaultSetpointList.concat(
        dataChannelEventsApiData?.setpointSelectionLists?.usageRateSetpoints
      )
    : defaultSetpointList;

  const removeDuplicates = new Set(dataChannelEventsApiData?.domainTags || []);
  const filteredDomainTagsOptions = Array.from(removeDuplicates);

  const canAccessEventEditor =
    canUpdateDataChannel &&
    canUpdateEvents &&
    IS_DATA_CHANNEL_EVENTS_EDIT_FEATURE_ENABLED;

  // Event Rule Group Autocomplete with add / edit buttons
  const initialSelectedEventRuleGroup =
    dataChannelEventsApiData?.eventRuleGroupId &&
    dataChannelEventsApiData.eventRuleGroupAsText
      ? EventRuleGroupListItemDto.fromJS({
          eventRuleGroupId: dataChannelEventsApiData?.eventRuleGroupId,
          eventRuleGroupAsText: dataChannelEventsApiData.eventRuleGroupAsText,
        })
      : EventRuleGroupListItemDto.fromJS({
          eventRuleGroupId: -1,
          eventRuleGroupAsText: t('ui.common.none', 'None'),
        });
  const [
    selectedEventRuleGroup,
    setSelectedEventRuleGroup,
  ] = useState<EventRuleGroupListItemDto | null>(initialSelectedEventRuleGroup);

  // Set the initial selected event rule group after a response from
  // the dataChannelEventsApiData api.
  useEffect(() => {
    setSelectedEventRuleGroup(initialSelectedEventRuleGroup);
  }, [dataChannelEventsApiData]);

  const selectedEventRuleGroupApi = useGetEventRuleGroupByEventRuleGroupId(
    dataChannelDetails?.dataChannelId!,
    selectedEventRuleGroup?.eventRuleGroupId!
  );

  // UpdateEventRuleGroupDialog
  const [
    isUpdateEventRuleGroupDialogOpen,
    setIsUpdateEventRuleGroupDialogOpen,
  ] = useState<boolean>(false);

  const openEventRuleGroupDialog = () => {
    setIsUpdateEventRuleGroupDialogOpen(true);
  };

  const closeEventRuleGroupDialog = () => {
    saveDataChannelEventRulesApi.reset();
    setIsUpdateEventRuleGroupDialogOpen(false);
  };

  const submitEventRuleGroupTemplate = () => {
    return saveDataChannelEventRulesApi
      .mutateAsync({
        dataChannelId: dataChannelEventsApi?.data?.dataChannelId!,
        // @ts-ignore
        eventRules:
          selectedEventRuleGroup?.eventRuleGroupId === -1
            ? {
                ...formattedInitialValues,
                eventRuleGroupId: null,
                eventRuleGroupAsText: null,
              }
            : (selectedEventRuleGroupApi.data as QuickEditEventsDto),
      })
      .then(() => {
        dispatch(enqueueSaveSuccessSnackbar(t));
      })
      .then(closeEventRuleGroupDialog)
      .catch(() => {});
  };

  const confirmSelectedEventRuleGroup = () => {
    submitEventRuleGroupTemplate();
  };

  // Open the <UpdateEventRuleGroupDialog /> when changing the selected event
  // rule group.
  useUpdateEffect(() => {
    if (
      selectedEventRuleGroup !== null &&
      selectedEventRuleGroup?.eventRuleGroupId !==
        initialSelectedEventRuleGroup?.eventRuleGroupId
    ) {
      openEventRuleGroupDialog();
    }
  }, [selectedEventRuleGroup]);

  const isLoadingEditData = dataChannelEventsApi.isLoading;
  const hasFetchingError = dataChannelEventsApi.isError;

  // Temporary method of stopping users from using the event edit route
  if (!canAccessEventEditor) {
    return (
      <Box mt={3}>
        <TransitionErrorMessage
          in={!canAccessEventEditor}
          message={t('ui.common.permissionDenied', 'Permission Denied')}
        />
      </Box>
    );
  }

  if (isLoadingEditData || hasFetchingError) {
    return (
      <>
        <Box mt={3}>
          <TransitionLoadingSpinner in={isLoadingEditData} />
          <TransitionErrorMessage in={!isLoadingEditData && hasFetchingError} />
        </Box>
      </>
    );
  }

  return (
    <>
      <UpdateEventRuleGroupDialog
        isDialogOpen={isUpdateEventRuleGroupDialogOpen}
        closeDialog={closeEventRuleGroupDialog}
        confirmSave={confirmSelectedEventRuleGroup}
        initialEventRuleGroup={initialSelectedEventRuleGroup}
        setSelectedEventRuleGroup={setSelectedEventRuleGroup}
        isLoading={
          selectedEventRuleGroupApi.isLoading ||
          saveDataChannelEventRulesApi.isLoading
        }
        hasError={saveDataChannelEventRulesApi.isError}
      />
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
          resetForm,
        }) => {
          const hasEditableEvents =
            !!values.inventoryEvents?.length ||
            !!values.levelEvents?.length ||
            !!values.missingDataEvent ||
            !!values.usageRateEvent ||
            !!values.deliveryScheduleEvents?.length;

          const updateEventRostersAndCloseRostersDrawer = (
            response: string
          ) => {
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
          const hasDeliveryScheduleEvents = !!values.deliveryScheduleEvents
            ?.length;

          // const fullDataChannelDescription = getGenericDataChannelDescription({
          //   type: values.dataChannelTypeId,
          //   dataChannelDescription: values.dataChannelDescription,
          //   productDescription: values.productDescription,
          // });

          const hasIntegrationId = !!values.hasIntegrationEnabled;

          const commonRowProps: CommonEventTableRowProps = {
            isAirProductsEnabledDomain,
            domainTagsOptions: filteredDomainTagsOptions,
            canEdit: canEditEvents,
            hasIntegrationId,
            dataChannel: values,
            errors,
            status: status as Status,
            openRostersDrawer,
            setFieldValue,
          };

          return (
            <>
              <HandleSubmitFormEffect
                submitForm={submitForm}
                shouldSubmitEventForm={shouldSubmitEventForm}
                setShouldSubmitEventForm={setShouldSubmitEventForm}
              />
              <TransitionLoadingSpinner in={isLoadingEditData} />
              <TransitionErrorMessage
                in={!isLoadingEditData && dataChannelEventsApi.isError}
              />

              <DefaultTransition
                in={!isLoadingEditData && dataChannelEventsApi.isSuccess}
                unmountOnExit
              >
                <div>
                  <Form>
                    <PageIntroWrapper
                      sticky
                      verticalPaddingFactor={1}
                      zIndex={4}
                    >
                      <CustomPageIntro
                        dataChannelDetails={dataChannelDetails}
                        headerNavButton={<BackIconButton />}
                        submitForm={submitForm}
                        isSubmitting={isSubmitting}
                        submissionResult={saveDataChannelEventRulesApi.data}
                        cancelCallback={() => {
                          resetForm();
                          // Reset any save api errors rendered on screen
                          saveDataChannelEventRulesApi.reset();
                          dataChannelEventsApi.refetch();
                        }}
                        disableSaveButton={
                          isSubmitting ||
                          dataChannelEventsApi.isFetching ||
                          dataChannelEventsApi.isError
                        }
                        showSaveButton={canEditEvents}
                        saveCallback={saveCallback}
                      />
                    </PageIntroWrapper>

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
                      <Grid item xs={12}>
                        <StaticAccordion>
                          <StyledAccordionBanner>
                            <Grid
                              container
                              alignItems="center"
                              justify="space-between"
                            >
                              <Grid item>
                                <BoxTitle>
                                  {t('ui.common.events', 'Events')}
                                </BoxTitle>
                              </Grid>
                            </Grid>
                          </StyledAccordionBanner>

                          {saveDataChannelEventRulesApi.error && (
                            <Box px={2} pt={2}>
                              <DefaultTransition
                                in={!!saveDataChannelEventRulesApi.error}
                                unmountOnExit
                              >
                                <Grid item xs={12}>
                                  <FormErrorAlertWithMessage
                                    error={saveDataChannelEventRulesApi.error}
                                  />
                                </Grid>
                              </DefaultTransition>
                            </Box>
                          )}

                          <StyledAccordionDetails>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <Grid container alignItems="center" spacing={3}>
                                  <Grid item>
                                    <StyledEventGroupTitleText>
                                      {t(
                                        'ui.common.eventrulegroup',
                                        'Event Rule Group'
                                      )}
                                    </StyledEventGroupTitleText>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Field
                                      id="eventRuleGroupId-input"
                                      name="eventRuleGroupId"
                                      component={EventRuleGroupAutocomplete}
                                      selectedOption={selectedEventRuleGroup}
                                      onChange={setSelectedEventRuleGroup}
                                      textFieldProps={{
                                        placeholder: t(
                                          'ui.common.enterSearchCriteria',
                                          'Enter Search Criteria...'
                                        ),
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={12}>
                                <Grid container spacing={2}>
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
                                      {(hasLevelEvents ||
                                        hasInventoryEvents) && (
                                        <>
                                          <Grid item xs={12}>
                                            <StyledEventTypeText>
                                              {t(
                                                'ui.datachanneleventrule.levelevents',
                                                'Level Events'
                                              )}
                                            </StyledEventTypeText>
                                          </Grid>
                                          <Grid item xs={12}>
                                            <LevelAndInventoryEventsTable
                                              {...commonRowProps}
                                              unitsOfMeasureTextMapping={
                                                unitsOfMeasureTextMapping
                                              }
                                              isAirProductsEnabledDomain={
                                                isAirProductsEnabledDomain
                                              }
                                              formattedScaledUnitsText={
                                                formattedScaledUnitsText
                                              }
                                              setPoints={
                                                combinedSelectableLevelAndLocalSetpointList
                                              }
                                            />
                                          </Grid>
                                        </>
                                      )}

                                      {hasUsageRateEvent &&
                                        /* 
                                      Usage rate events not able to edit until we find out what is editable
                                      re: figma note
                                      */
                                        !isAirProductsEnabledDomain && (
                                          <>
                                            <Grid item xs={12}>
                                              <StyledEventTypeText>
                                                {t(
                                                  'ui.dataChannel.usageRateEvent',
                                                  'Usage Rate Event'
                                                )}
                                              </StyledEventTypeText>
                                            </Grid>
                                            <Grid item xs={12}>
                                              <UsageRateEventsTable
                                                {...commonRowProps}
                                                unitsOfMeasureTextMapping={
                                                  unitsOfMeasureTextMapping
                                                }
                                                isAirProductsEnabledDomain={
                                                  isAirProductsEnabledDomain
                                                }
                                                formattedScaledUnitsText={
                                                  formattedScaledUnitsText
                                                }
                                                setPoints={
                                                  usageRateSetpointList
                                                }
                                              />
                                            </Grid>
                                          </>
                                        )}

                                      {hasDeliveryScheduleEvents && (
                                        <>
                                          <Grid item xs={12}>
                                            <StyledEventTypeText>
                                              {t(
                                                'ui.datachanneleventrule.scheduleddeliveryevents',
                                                'Scheduled Delivery Events'
                                              )}
                                            </StyledEventTypeText>
                                          </Grid>
                                          <Grid item xs={12}>
                                            <DeliveryScheduleEventsTable
                                              {...commonRowProps}
                                              unitsOfMeasureTextMapping={
                                                unitsOfMeasureTextMapping
                                              }
                                            />
                                          </Grid>
                                        </>
                                      )}

                                      {hasMissingDataEvent && (
                                        <>
                                          <Grid item xs={12}>
                                            <StyledEventTypeText>
                                              {t(
                                                'ui.dataChannel.missingDataEvent',
                                                'Missing Data Event'
                                              )}
                                            </StyledEventTypeText>
                                          </Grid>
                                          <Grid item xs={12}>
                                            <MissingDataEventsTable
                                              {...commonRowProps}
                                              isAirProductsEnabledDomain={
                                                isAirProductsEnabledDomain
                                              }
                                            />
                                          </Grid>
                                        </>
                                      )}
                                    </>
                                  )}
                                </Grid>
                              </Grid>
                            </Grid>
                          </StyledAccordionDetails>
                        </StaticAccordion>
                      </Grid>
                    </Grid>
                  </Form>
                </div>
              </DefaultTransition>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default DataChannelEventEditor;
