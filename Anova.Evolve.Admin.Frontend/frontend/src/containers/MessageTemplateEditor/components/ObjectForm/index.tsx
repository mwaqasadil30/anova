/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { TimeZoneTypeEnum } from 'api/admin/api';
import Button from 'components/Button';
import EditorBox from 'components/EditorBox';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import StyledStaticFieldWithChildren from 'components/forms/styled-fields/StyledStaticFieldWithChildren';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import PageSubHeader from 'components/PageSubHeader';
import { Field, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  selectActiveDomain,
  selectTimezones,
} from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { replaceRange } from 'utils/format/messageTemplate';
import { useGetMessageTemplateContentOptions } from '../../hooks/useRetrieveMessageTemplateContentOptions';
import { TemplateValidation } from '../../types';
import PreviewDialog from '../PreviewDialog';
import ValidationDialog from '../ValidationDialog';
import {
  fillInTemplateVariable,
  getVariableToPreviewTextMapping,
  messageTemplateVariables,
  validateTemplateString,
} from './helpers';
import { FormattedTemplates, Values } from './types';

const StyledAddButton = styled(Button)``;

interface Props {
  isSubmitting: boolean;
  timeZoneTypeId?: Values['timeZoneTypeId'];
  subjectTemplate: Values['subjectTemplate'];
  bodyTemplate: Values['bodyTemplate'];
  setFieldValue: FormikProps<Values>['setFieldValue'];
}

const ObjectForm = ({
  isSubmitting,
  timeZoneTypeId,
  subjectTemplate,
  bodyTemplate,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();
  const timezonesData = useSelector(selectTimezones);

  // "Local Time Zone" has an id of -1, silverlight does not include it in
  // the Time Zone dropdown, so we are removing it (temporarily?)
  const filteredTimeZonesData = timezonesData.timezones.filter(
    (timezone) => timezone.timezoneId !== -1
  );

  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const templateContentDropdownOptions = useGetMessageTemplateContentOptions(
    domainId!
  );

  const subjectAndBodyTemplateOptions = templateContentDropdownOptions.data;

  const descriptionText = t('ui.common.description', 'Description');

  const [subjectCursorRange, setSubjectCursorRange] = useState<
    [number, number] | null
  >(null);
  const [bodyCursorRange, setBodyCursorRange] = useState<
    [number, number] | null
  >(null);

  const [subjectDropdownItem, setSubjectDropdownItem] = useState('');
  const [bodyDropdownItem, setBodyDropdownItem] = useState('');

  const handleSubjectDropdownChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newSubjectTemplateItem = event.target.value as any;
    setSubjectDropdownItem(newSubjectTemplateItem);
  };

  const handleBodyDropdownChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const newBodyTemplateItem = event.target.value as any;
    setBodyDropdownItem(newBodyTemplateItem);
  };

  const [
    templateValidation,
    setTemplateValidation,
  ] = React.useState<TemplateValidation | null>(null);

  // Preview Dialog
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = React.useState(false);
  const [
    formattedTemplates,
    setFormattedTemplates,
  ] = React.useState<FormattedTemplates | null>(null);

  const handleOpenPreviewDialog = () => {
    const customFields = subjectAndBodyTemplateOptions?.filter((option) => {
      return option.id?.includes('CustomField');
    });
    const variableToPreviewTextMapping = getVariableToPreviewTextMapping(
      customFields
    );

    let formattedSubjectTemplate = subjectTemplate;

    messageTemplateVariables.forEach((variable) => {
      formattedSubjectTemplate = fillInTemplateVariable(
        formattedSubjectTemplate,
        variable,
        variableToPreviewTextMapping
      );
    });

    let formattedBodyTemplate = bodyTemplate;

    messageTemplateVariables.forEach((variable) => {
      formattedBodyTemplate = fillInTemplateVariable(
        formattedBodyTemplate,
        variable,
        variableToPreviewTextMapping
      );
    });

    setFormattedTemplates({
      subject: formattedSubjectTemplate,
      body: formattedBodyTemplate,
    });
    setIsPreviewDialogOpen(true);
  };

  const handleClosePreviewDialog = () => {
    setIsPreviewDialogOpen(false);
  };

  // Validation Dialog
  const [isValidationDialogOpen, setIsValidationDialogOpen] = React.useState(
    false
  );

  const handleOpenValidationDialog = () => {
    const availableFieldNames = subjectAndBodyTemplateOptions?.map((option) => {
      return option.id!;
    });

    const subjectTemplateValidation = validateTemplateString(
      t,
      subjectTemplate!,
      availableFieldNames
    );
    const bodyTemplateValidation = validateTemplateString(
      t,
      bodyTemplate!,
      availableFieldNames
    );

    setTemplateValidation({
      subject: subjectTemplateValidation,
      body: bodyTemplateValidation,
    });
    setIsValidationDialogOpen(true);
  };

  const handleCloseValidationDialog = () => {
    setIsValidationDialogOpen(false);
  };

  // Dropdown options for <MenuItem> mapping
  const domainAvailableTimeZoneText = t(
    'enum.timeZoneTypeEnum.domainAvailableTimeZone',
    'Domain Available Time Zone'
  );
  const assetLocalTimeZoneText = t(
    'enum.timeZoneTypeEnum.assetLocalTimeZone',
    'Asset Local Time Zone'
  );

  const timeZoneTypeOptions = [
    {
      label: domainAvailableTimeZoneText,
      value: TimeZoneTypeEnum.DomainAvailableTimeZone,
    },
    {
      label: assetLocalTimeZoneText,
      value: TimeZoneTypeEnum.AssetLocalTimeZone,
    },
  ];

  const dateFormatOptions = [
    {
      label: 'dd-MM-yyy',
      value: 'dd-MM-yyy',
    },
    {
      label: 'dd-MM-yyyy',
      value: 'dd-MM-yyyy',
    },
    {
      label: 'dd-MM-yyyy-MM-dd',
      value: 'dd-MM-yyyy-MM-dd',
    },
    {
      label: 'MM-dd',
      value: 'MM-dd',
    },
    {
      label: 'MM-dd-yyyy',
      value: 'MM-dd-yyyy',
    },

    {
      label: 'yyyy/MM/dd',
      value: 'yyyy/MM/dd',
    },
    {
      label: 'yyyy-MM-d',
      value: 'yyyy-MM-d',
    },
    {
      label: 'yyyy-MM-dd',
      value: 'yyyy-MM-dd',
    },
  ];

  const timeFormatOptions = [
    {
      label: 'HH:mm',
      value: 'HH:mm',
    },
    {
      label: 'HH:mm:ss',
      value: 'HH:mm:ss',
    },
  ];

  const addTemplateVariable = (
    templateString: string,
    fieldName: string,
    templateCursorRange?: number[] | null,
    selectedOption?: string | null
  ) => {
    if (!selectedOption) {
      return;
    }

    let startRange = templateString.length;
    let endRange = templateString.length;
    if (templateCursorRange) {
      [startRange, endRange] = templateCursorRange;
    }

    const newValue = replaceRange(
      templateString,
      startRange,
      endRange,
      `{${selectedOption}}`
    );
    setFieldValue(`${fieldName}`, newValue);
  };

  return (
    <>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <PageSubHeader dense>
            {t('ui.messageTemplateEditor.settings', 'Settings')}
          </PageSubHeader>
        </Grid>

        <Grid item xs={12}>
          <EditorBox>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={9}>
                <Grid container spacing={3} alignItems="stretch">
                  <Grid item xs={12} md={6}>
                    <Field
                      id="description-input"
                      name="description"
                      component={CustomTextField}
                      label={descriptionText}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      component={CustomTextField}
                      id="dateFormat-input"
                      name="dateFormat"
                      label={t(
                        'ui.messageTemplateEditor.dateFormat',
                        'Date Format'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                      disabled={isSubmitting}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {dateFormatOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Field
                      component={CustomTextField}
                      id="timeZoneTypeId-input"
                      name="timeZoneTypeId"
                      label={t(
                        'ui.messageTemplateEditor.timeZoneType',
                        'Time Zone Type'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                      disabled={isSubmitting}
                    >
                      <MenuItem value="" disabled>
                        <SelectItem />
                      </MenuItem>
                      {timeZoneTypeOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  {timeZoneTypeId ===
                    TimeZoneTypeEnum.DomainAvailableTimeZone && (
                    <Grid item xs={12} md={6}>
                      <Field
                        component={CustomTextField}
                        id="timeZoneId-input"
                        name="timeZoneId"
                        label={t(
                          'ui.messageTemplateEditor.timeZone',
                          'Time Zone'
                        )}
                        select
                        required
                        SelectProps={{ displayEmpty: true }}
                        disabled={isSubmitting}
                      >
                        <MenuItem value="" disabled>
                          <SelectItem />
                        </MenuItem>
                        {filteredTimeZonesData.map((timezone) => (
                          <MenuItem
                            key={timezone.timezoneId!}
                            value={timezone.timezoneId!}
                          >
                            {timezone.displayName}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                  )}

                  <Grid item xs={12} md={6}>
                    <Field
                      component={CustomTextField}
                      id="timeFormat-input"
                      name="timeFormat"
                      label={t(
                        'ui.messageTemplateEditor.timeFormat',
                        'Time Format'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                      disabled={isSubmitting}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {timeFormatOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </EditorBox>
        </Grid>
      </Grid>

      {/* Message Template Preview Dialog */}
      <PreviewDialog
        open={isPreviewDialogOpen}
        close={handleClosePreviewDialog}
        formattedTemplates={formattedTemplates}
      />

      {/* Validate Dialog */}
      <ValidationDialog
        open={isValidationDialogOpen}
        close={handleCloseValidationDialog}
        templateValidation={templateValidation}
      />

      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box p={1}>
            <Grid
              container
              spacing={2}
              justify="space-between"
              alignItems="center"
            >
              <Grid item xs={6}>
                <PageSubHeader dense>
                  {t(
                    'ui.messageTemplateEditor.templateContent',
                    'Template Content'
                  )}
                </PageSubHeader>
              </Grid>

              <Grid item xs="auto">
                <Grid container spacing={2}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleOpenValidationDialog();
                      }}
                    >
                      {t('ui.messageTemplateEditor.validate', 'Validate')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleOpenPreviewDialog();
                      }}
                    >
                      {t('ui.messageTemplateEditor.preview', 'Preview')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <EditorBox>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={9}>
                <Grid container spacing={3} alignItems="stretch">
                  <Grid item xs={6}>
                    <StyledTextField
                      select
                      id="subjectTemplateOptions-input"
                      label={t('ui.messageTemplateEditor.subject', 'Subject')}
                      onChange={handleSubjectDropdownChange}
                      value={subjectDropdownItem}
                      InputProps={{
                        style: { overflow: 'hidden' },
                      }}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {subjectAndBodyTemplateOptions?.map((options) => (
                        <MenuItem key={options.id!} value={options.id!}>
                          {options.value}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>

                  <Grid item xs={6}>
                    <StyledStaticFieldWithChildren label="&nbsp;">
                      <StyledAddButton
                        variant="outlined"
                        disabled={!subjectDropdownItem}
                        onClick={() => {
                          addTemplateVariable(
                            subjectTemplate,
                            'subjectTemplate',
                            subjectCursorRange,
                            subjectDropdownItem
                          );
                        }}
                      >
                        {t('ui.common.add', 'Add')}
                      </StyledAddButton>
                    </StyledStaticFieldWithChildren>
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      id="subjectTemplate-input"
                      name="subjectTemplate"
                      disabled={isSubmitting}
                      onBlur={(e: any) => {
                        setSubjectCursorRange([
                          e.target.selectionStart,
                          e.target.selectionEnd,
                        ]);
                      }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <StyledTextField
                      select
                      id="bodyTemplateOptions-input"
                      label={t('ui.messageTemplateEditor.body', 'Body')}
                      onChange={handleBodyDropdownChange}
                      value={bodyDropdownItem}
                      InputProps={{
                        style: { overflow: 'hidden' },
                      }}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {subjectAndBodyTemplateOptions?.map((options) => (
                        <MenuItem key={options.id!} value={options.id!}>
                          {options.value}
                        </MenuItem>
                      ))}
                    </StyledTextField>
                  </Grid>
                  <Grid item xs={6}>
                    <StyledStaticFieldWithChildren label="&nbsp;">
                      <StyledAddButton
                        variant="outlined"
                        disabled={!bodyDropdownItem}
                        onClick={() => {
                          addTemplateVariable(
                            bodyTemplate,
                            'bodyTemplate',
                            bodyCursorRange,
                            bodyDropdownItem
                          );
                        }}
                      >
                        {t('ui.common.add', 'Add')}
                      </StyledAddButton>
                    </StyledStaticFieldWithChildren>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      multiline
                      id="bodyTemplate-input"
                      name="bodyTemplate"
                      rows={7}
                      onBlur={(e: any) => {
                        setBodyCursorRange([
                          e.target.selectionStart,
                          e.target.selectionEnd,
                        ]);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </EditorBox>
        </Grid>
      </Grid>
    </>
  );
};

export default ObjectForm;
