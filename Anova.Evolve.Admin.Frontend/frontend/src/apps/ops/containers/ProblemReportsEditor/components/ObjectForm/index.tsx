/* eslint-disable indent */
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { TagDto, UserPermissionType } from 'api/admin/api';
import { useGetProblemReportTagIds } from 'apps/ops/containers/ProblemReportsList/hooks/useGetProblemReportTagIds';
import routes from 'apps/ops/routes';
import Chip from 'components/Chip';
import EditorBox from 'components/EditorBox';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import DateTimePicker from 'components/forms/form-fields/DateTimePicker';
import EmptyDropdownAutocomplete from 'components/forms/styled-fields/EmptyDropdownAutocomplete';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import ListComponent from 'components/ListComponent';
import { Field, FormikProps } from 'formik';
import React from 'react';
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
import { Values } from './types';

const StyleGrid = styled(Grid)`
  & .MuiInputLabel-root {
    color: ${(props) => props.theme.palette.text.secondary};
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
  isPriorityFieldDisabled?: boolean;
}

const ObjectForm = ({
  isSubmitting,
  formValues,
  setFieldValue,
  isPriorityFieldDisabled,
}: Props) => {
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
    const existingTags = formValues?.tags || [];
    setFieldValue('tags', existingTags.concat(tag));
  };

  const handleDeleteTag = (tag: TagDto) => () => {
    const existingTags = formValues?.tags || [];
    setFieldValue(
      'tags',
      existingTags.filter((selectedTagId) => selectedTagId.tagId !== tag.tagId)
    );
  };

  const selectedTags = getTagsApiData?.filter((tagObject) =>
    formValues.tags?.find(
      (selectedTagId) => selectedTagId.tagId === tagObject.tagId
    )
  );

  const selectableTags = getTagsApiData?.filter(
    (tagObject) =>
      !formValues.tags?.find(
        (selectedTagId) => selectedTagId.tagId === tagObject.tagId
      )
  );

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);
  const problemReportPriorityOptions = getProblemReportPriorityLevelOptions(t);

  const isFieldDisabled = !canUpdateProblemReportsEditor;

  return (
    <StyleGrid container spacing={3}>
      <Grid item xs={12} md={8} container>
        <Grid container spacing={2} direction="column" wrap="nowrap">
          <Grid item xs={12} style={{ flex: '1 0 auto' }}>
            <EditorBox p={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field
                    component={CustomTextField}
                    id="description-input"
                    name="description"
                    label={t('ui.common.description', 'Description')}
                    disabled={isSubmitting || isFieldDisabled}
                  />
                </Grid>

                <Grid item xs={4}>
                  <Field
                    component={CustomTextField}
                    id="importanceLevelTypeId-input"
                    name="importanceLevelTypeId"
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
                    id="reportedBy-input"
                    name="reportedBy"
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
                    id="currentOpStatus-input"
                    name="currentOpStatus"
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
                    id="resolution-input"
                    name="resolution"
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
                    id="workOrder.workOrderNumber-input"
                    name="workOrder.workOrderNumber"
                    label={t(
                      'ui.problemreport.workordernumber',
                      'Work Order #'
                    )}
                    disabled={isSubmitting || isFieldDisabled}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    id="workOrder.workOrderInitiatedDate-input"
                    name="workOrder.workOrderInitiatedDate"
                    label={t('ui.problemreport.workorderintiated', 'Initiated')}
                    component={DateTimePicker}
                    ampm
                    PopoverProps={{ id: 'initiated date popover' }}
                    disabled={isSubmitting || isFieldDisabled}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Field
                    id="workOrder.workOrderClosedDate-input"
                    name="workOrder.workOrderClosedDate"
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
                          formValues.primaryDataChannelInfo?.businessUnit
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
                        contentText={formValues.primaryDataChannelInfo?.region}
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
                          formValues.primaryDataChannelInfo?.deviceId
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
                          formValues.primaryDataChannelInfo?.assetId ? (
                            <MuiLink
                              component={Link}
                              to={generatePath(routes.assetSummary.detail, {
                                assetId: formValues.primaryDataChannelInfo
                                  ?.assetId!,
                              })}
                              color="inherit"
                              underline="always"
                            >
                              {formValues.primaryDataChannelInfo?.assetTitle}
                            </MuiLink>
                          ) : (
                            formValues.primaryDataChannelInfo?.assetTitle
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
                        titleText={t('ui.problemreport.opendate', 'Open Date')}
                        contentText={formatModifiedDatetime(
                          formValues.statusInformation?.openDate
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
                            id="isDisableAutoClose-input"
                            name="isDisableAutoClose"
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
                    id="statusInformation.customerPriorityTypeId-input"
                    name="statusInformation.customerPriorityTypeId"
                    label={t('ui.problemreport.priority', 'Priority')}
                    select
                    SelectProps={{ displayEmpty: true }}
                    disabled={
                      isSubmitting || isFieldDisabled || isPriorityFieldDisabled
                    }
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
                    id="statusInformation.fixDate-input"
                    name="statusInformation.fixDate"
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
  );
};

export default ObjectForm;
