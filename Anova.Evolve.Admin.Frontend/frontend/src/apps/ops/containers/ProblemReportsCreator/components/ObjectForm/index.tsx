/* eslint-disable indent, react/jsx-indent */
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { TagDto, UserPermissionType } from 'api/admin/api';
import { useGetProblemReportTagIds } from 'apps/ops/containers/ProblemReportsList/hooks/useGetProblemReportTagIds';
import routes from 'apps/ops/routes';
import AddButton from 'components/buttons/AddButton';
import Chip from 'components/Chip';
import EditorBox from 'components/EditorBox';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import DateTimePicker from 'components/forms/form-fields/DateTimePicker';
import EmptyDropdownAutocomplete from 'components/forms/styled-fields/EmptyDropdownAutocomplete';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import StyledSwitchWithLabel from 'components/forms/styled-fields/StyledSwitchWithLabel';
import ListComponent from 'components/ListComponent';
import PageSubHeader from 'components/PageSubHeader';
import { Field, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, Link } from 'react-router-dom';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { formatModifiedDatetime } from 'utils/format/dates';
import {
  getEventImportanceLevelOptions,
  getProblemReportPriorityLevelOptions,
} from 'utils/i18n/enum-to-text';
import { renderImportance } from 'utils/ui/helpers';
import AffectedDataChannelsTable from '../AffectedDataChannelsTable';
import ProblemReportNotes from '../ProblemReportNotes';
import { Values } from './types';

const ShowGeneratedEntriesText = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
`;

const StyledAffectedDataChannelsGrid = styled(Grid)`
  && {
    padding: 0px 8px 8px 8px;
  }
`;

const StyleGrid = styled(Grid)`
  & .MuiInputLabel-root {
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

const StyledActivityLogGrid = styled(Grid)`
  && {
    padding: 0px 8px 8px 8px;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 1px 0 1px 0;
`;

const StyledListComponent = styled(ListComponent)`
  & .styled-form-control-label {
    /* Remove right margin on checkboxes */
    margin-right: 0;
  }
  & .checkbox-style-padding {
    /* Center label/title text with checkbox */
    padding-top: 6px;
  }
`;

interface Props {
  isSubmitting: boolean;
  formValues: Values;
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

const ObjectForm = ({ isSubmitting, formValues, setFieldValue }: Props) => {
  const { t } = useTranslation();

  const hasPermission = useSelector(selectHasPermission);

  const canViewHyperlinks = hasPermission(
    UserPermissionType.ProblemReportShowHyperlinks,
    AccessType.Read
  );

  const canUpdateProblemReportsEditor = hasPermission(
    UserPermissionType.ProblemReportEditorAccess,
    AccessType.Update
  );

  const domainId = useSelector(selectActiveDomainId);

  // Tags
  const getTagsApi = useGetProblemReportTagIds(domainId);

  const getTagsApiData = getTagsApi.data;

  const handleSelectTag = (tag: TagDto) => {
    const existingTags = formValues?.problemReport?.tags || [];
    setFieldValue('problemReport.tags', existingTags.concat(tag));
  };

  const handleDeleteTag = (tag: TagDto) => () => {
    const existingTags = formValues?.problemReport?.tags || [];
    setFieldValue(
      'problemReport.tags',
      existingTags.filter((selectedTagId) => selectedTagId.tagId !== tag.tagId)
    );
  };

  const selectedTags = getTagsApiData?.filter((tagObject) =>
    formValues?.problemReport?.tags?.find(
      (selectedTagId) => selectedTagId.tagId === tagObject.tagId
    )
  );

  const selectableTags = getTagsApiData?.filter(
    (tagObject) =>
      !formValues?.problemReport?.tags?.find(
        (selectedTagId) => selectedTagId.tagId === tagObject.tagId
      )
  );

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);
  const problemReportPriorityOptions = getProblemReportPriorityLevelOptions(t);

  const isFieldDisabled = !canUpdateProblemReportsEditor;

  // Add affected data channels table Dialog
  const [
    isAddAffectedDataChannelsDialogOpen,
    setIsAddAffectedDataChannelsDialogOpen,
  ] = React.useState(false);

  const handleOpenAddAffectedDataChannelsDialog = () => {
    setIsAddAffectedDataChannelsDialogOpen(true);
  };

  const handleCloseAddAffectedDataChannelsDialog = () => {
    setIsAddAffectedDataChannelsDialogOpen(false);
  };

  const formattedAffectedDataChannelsCount =
    formValues.affectedDataChannels &&
    formValues.affectedDataChannels?.length > 0
      ? formValues.affectedDataChannels?.length
      : 0;

  // Show notes "Activity Log"
  const [
    showSystemGeneratedLogEntries,
    setShowSystemGeneratedLogEntries,
  ] = useState(false);

  const toggleSystemGeneratedLogEntries = () => {
    setShowSystemGeneratedLogEntries((prevState) => !prevState);
  };

  return (
    <>
      <StyleGrid container spacing={3}>
        <Grid item xs={12} md={8} container>
          <Grid container spacing={2} direction="column" wrap="nowrap">
            <Grid item xs={12} style={{ flex: '1 0 auto' }}>
              <EditorBox p={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      id="problemReport.description-input"
                      name="problemReport.description"
                      label={t('ui.common.description', 'Description')}
                      disabled={isSubmitting || isFieldDisabled}
                      required
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Field
                      component={CustomTextField}
                      id="problemReport.importanceLevelTypeId-input"
                      name="problemReport.importanceLevelTypeId"
                      label={t('ui.problemreport.importance', 'Importance')}
                      select
                      SelectProps={{ displayEmpty: true }}
                      disabled={isSubmitting || isFieldDisabled}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {eventImportanceLevelOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {renderImportance(option.value)}&nbsp;{option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  <Grid item xs={4}>
                    <Field
                      component={CustomTextField}
                      id="problemReport.reportedBy-input"
                      name="problemReport.reportedBy"
                      label={t('ui.problemreport.reportedby', 'Reported By')}
                      disabled={isSubmitting || isFieldDisabled}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <EmptyDropdownAutocomplete
                      label={t('ui.common.tags', 'Tags')}
                      options={selectableTags!}
                      getOptionLabel={(option) => option?.name || ''}
                      onChange={(_: any, tag) => {
                        if (tag?.tagId) {
                          handleSelectTag(tag);
                        }
                      }}
                      renderOption={(option) => (
                        <Typography>{option.name}</Typography>
                      )}
                      disabled={isSubmitting || isFieldDisabled}
                    />
                  </Grid>

                  {!!selectedTags?.length && (
                    <Grid item xs={12}>
                      <Grid
                        container
                        alignItems="center"
                        spacing={1}
                        justify="flex-start"
                      >
                        {selectedTags?.map((tag) => {
                          return (
                            <Grid item key={tag.tagId}>
                              <Chip
                                label={tag.name}
                                onDelete={handleDeleteTag(tag!)}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>
                  )}

                  <Grid item xs={6}>
                    <Field
                      component={CustomTextField}
                      id="problemReport.currentOpStatus-input"
                      name="problemReport.currentOpStatus"
                      label={t(
                        'ui.packetretrieval.currentopstatus',
                        'Current Op Status'
                      )}
                      multiline
                      rows={4}
                      disabled={isSubmitting || isFieldDisabled}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Field
                      component={CustomTextField}
                      id="problemReport.resolution-input"
                      name="problemReport.resolution"
                      label={t('ui.problemreport.resolution', 'Resolution')}
                      multiline
                      rows={4}
                      disabled={isSubmitting || isFieldDisabled}
                    />
                  </Grid>
                </Grid>
              </EditorBox>
            </Grid>

            <Grid item xs={12} container wrap="nowrap">
              <EditorBox p={2} width="100%">
                <Grid container spacing={3}>
                  <Grid item xs={4}>
                    <Field
                      component={CustomTextField}
                      type="number"
                      id="problemReport.workOrder.workOrderNumber-input"
                      name="problemReport.workOrder.workOrderNumber"
                      label={t(
                        'ui.problemreport.workordernumber',
                        'Work Order #'
                      )}
                      disabled={isSubmitting || isFieldDisabled}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Field
                      id="problemReport.workOrder.workOrderInitiatedDate-input"
                      name="problemReport.workOrder.workOrderInitiatedDate"
                      label={t(
                        'ui.problemreport.workorderintiated',
                        'Initiated'
                      )}
                      component={DateTimePicker}
                      ampm
                      PopoverProps={{ id: 'initiated date popover' }}
                      disabled={isSubmitting || isFieldDisabled}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Field
                      id="problemReport.workOrder.workOrderClosedDate-input"
                      name="problemReport.workOrder.workOrderClosedDate"
                      label={t('ui.problemreport.closed', 'Closed')}
                      component={DateTimePicker}
                      ampm
                      PopoverProps={{ id: 'closed date popover' }}
                      disabled={isSubmitting || isFieldDisabled}
                    />
                  </Grid>
                </Grid>
              </EditorBox>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={4} container>
          <Grid container spacing={2} direction="column" wrap="nowrap">
            <Grid item xs={12} container wrap="nowrap">
              <EditorBox p={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <ListComponent
                          titleText={t(
                            'ui.problemreport.businessunit',
                            'Business Unit'
                          )}
                          contentText={
                            formValues.problemReport?.primaryDataChannelInfo
                              ?.businessUnit
                          }
                          noTopPadding
                          noBottomPadding
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <StyledDivider />
                      </Grid>

                      <Grid item xs={12}>
                        <ListComponent
                          titleText={t('ui.problemreport.region', 'Region')}
                          contentText={
                            formValues.problemReport?.primaryDataChannelInfo
                              ?.region
                          }
                          noTopPadding
                          noBottomPadding
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <StyledDivider />
                      </Grid>

                      <Grid item xs={12}>
                        <ListComponent
                          titleText={t('ui.common.rtu', 'RTU')}
                          contentText={
                            formValues.problemReport?.primaryDataChannelInfo
                              ?.deviceId
                          }
                          noTopPadding
                          noBottomPadding
                        />
                      </Grid>
                      {/* <Grid item xs={12}> */}
                      {/* NOTE/TODO: Implement code below once rtu editor is implemented*/}
                      {/* {canViewHyperlinks ? (
                      <StyledStaticFieldWithChildren
                        label={t('ui.common.rtu', 'RTU')}
                      >
                        <MuiLink
                          component={Link}
                          // NOTE/TODO: Add rtu path here once the editor is implemented
                          to={generatePath(routes.assetSummary.detail, {
                            rtuId: formValues.rtuId!,
                          })}
                          color="inherit"
                          underline="always"
                        >
                          {formValues.rtuId}
                        </MuiLink>
                      </StyledStaticFieldWithChildren>
                    ) : (
                      <StyledStaticField
                        label={t('ui.common.rtu', 'RTU')}
                        value={formValues.rtuId}
                      />
                    )} */}
                      {/* </Grid> */}

                      <Grid item xs={12}>
                        <StyledDivider />
                      </Grid>

                      <Grid item xs={12}>
                        <ListComponent
                          titleText={t('ui.common.asset', 'Asset')}
                          contentText={
                            canViewHyperlinks &&
                            formValues.problemReport?.primaryDataChannelInfo
                              ?.assetId ? (
                              <MuiLink
                                component={Link}
                                to={generatePath(routes.assetSummary.detail, {
                                  assetId: formValues.problemReport
                                    ?.primaryDataChannelInfo?.assetId!,
                                })}
                                color="inherit"
                                underline="always"
                              >
                                {
                                  formValues.problemReport
                                    ?.primaryDataChannelInfo?.assetTitle
                                }
                              </MuiLink>
                            ) : (
                              formValues.problemReport?.primaryDataChannelInfo
                                ?.assetTitle
                            )
                          }
                          noTopPadding
                          noBottomPadding
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <StyledDivider />
                      </Grid>

                      <Grid item xs={12}>
                        <ListComponent
                          titleText={t(
                            'ui.problemreport.opendate',
                            'Open Date'
                          )}
                          contentText={formatModifiedDatetime(
                            formValues.problemReport?.statusInformation
                              ?.openDate
                          )}
                          noTopPadding
                          noBottomPadding
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <StyledDivider />
                      </Grid>

                      <Grid item xs={12}>
                        <StyledListComponent
                          titleText={t(
                            'ui.problemreport.disableautoclose',
                            'Disable Auto Close'
                          )}
                          contentText={
                            <Field
                              component={CheckboxWithLabel}
                              id="problemReport.isDisableAutoClose-input"
                              name="problemReport.isDisableAutoClose"
                              type="checkbox"
                              style={{ padding: '4px' }}
                              disabled={isSubmitting || isFieldDisabled}
                            />
                          }
                          noTopPadding
                          noBottomPadding
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </EditorBox>
            </Grid>

            <Grid item xs={12} style={{ flex: '1 0 auto' }}>
              <EditorBox p={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      id="problemReport.statusInformation.customerPriorityTypeId-input"
                      name="problemReport.statusInformation.customerPriorityTypeId"
                      label={t('ui.problemreport.priority', 'Priority')}
                      select
                      SelectProps={{ displayEmpty: true }}
                      disabled // Users cannot edit this field when creating.
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {problemReportPriorityOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      id="problemReport.statusInformation.fixDate-input"
                      name="problemReport.statusInformation.fixDate"
                      label={t('ui.problemreport.fixdate', 'Fix Date')}
                      component={DateTimePicker}
                      ampm
                      PopoverProps={{ id: 'fix date popover' }}
                      disabled={isSubmitting || isFieldDisabled}
                    />
                  </Grid>
                </Grid>
              </EditorBox>
            </Grid>
          </Grid>
        </Grid>
      </StyleGrid>
      {/* Affected Data channels table */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justify="space-between"
          >
            <Grid item xs>
              <PageSubHeader dense>
                {t(
                  'ui.problemreport.affectedDataChannelsCount',
                  'Affected Data Channels ({{count}})',
                  {
                    count: formattedAffectedDataChannelsCount,
                  }
                )}
              </PageSubHeader>
            </Grid>
            <Grid item xs="auto">
              <AddButton
                variant="text"
                onClick={() => {
                  handleOpenAddAffectedDataChannelsDialog();
                }}
              >
                {t('ui.common.addNew', 'Add New')}
              </AddButton>
            </Grid>
          </Grid>
        </Grid>
        <StyledAffectedDataChannelsGrid item xs={12}>
          <AffectedDataChannelsTable
            affectedDataChannels={formValues.affectedDataChannels}
            isAddAffectedDataChannelsDialogOpen={
              isAddAffectedDataChannelsDialogOpen
            }
            handleCloseAddAffectedDataChannelsDialog={
              handleCloseAddAffectedDataChannelsDialog
            }
          />
        </StyledAffectedDataChannelsGrid>
      </Grid>

      {/* Notes "Activity Log" section */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <PageSubHeader dense>
            {t('ui.problemreport.activitylog', 'Activity Log')}
          </PageSubHeader>
        </Grid>
        <Grid item xs="auto">
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <ShowGeneratedEntriesText>
                {t(
                  'ui.problemreport.showsystemgeneratedlogentries',
                  'Show System Generated Log Entries'
                )}
              </ShowGeneratedEntriesText>
            </Grid>
            <Grid item>
              <StyledSwitchWithLabel
                onChange={toggleSystemGeneratedLogEntries}
                checked={showSystemGeneratedLogEntries}
              />
            </Grid>
          </Grid>
        </Grid>
        <StyledActivityLogGrid item xs={12}>
          <ProblemReportNotes
            showSystemGeneratedLogEntries={showSystemGeneratedLogEntries}
            notes={formValues.activityLog}
          />
        </StyledActivityLogGrid>
      </Grid>
    </>
  );
};

export default ObjectForm;
