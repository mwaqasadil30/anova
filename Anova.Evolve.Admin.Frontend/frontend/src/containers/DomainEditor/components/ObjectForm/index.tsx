import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelTemplateDetail,
  DomainInfoRecord,
  EventRuleGroupInfo,
  HeliumISOContainerDataChannelTemplate,
  ProductDetail,
  SiteInfoRecord,
} from 'api/admin/api';
import { ReactComponent as RefreshIcon } from 'assets/icons/refresh-icon.svg';
import EditorBox from 'components/EditorBox';
import Button from 'components/Button';
import FormLinearProgress from 'components/FormLinearProgress';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FormikEffect from 'components/forms/FormikEffect';
import DropdownAutocomplete from 'components/forms/styled-fields/DropdownAutocomplete';
import Logo from 'components/icons/Logo';
import PageSubHeader from 'components/PageSubHeader';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  DEFAULT_DOMAIN_THEME_COLOR,
  DomainThemeColor,
  fadedTextColor,
} from 'styles/colours';
import * as Yup from 'yup';
import AssetsTab from '../AssetsTab';
import NoteTab from '../NoteTab';
import { Values } from './types';

const StyledButton = styled(Button)`
  padding: 0px 10px;
`;

const StyledLogo = styled.img`
  max-width: 87px;
  max-height: 42px;
  vertical-align: middle;
`;

const StyledDefaultLogo = styled(Logo)`
  width: 87px;
  vertical-align: middle;
`;

const StyledText = styled(Typography)`
  font-size: 14px;
  color: ${(props) => props.theme.palette.text.primary};
  font-weight: 500;
  line-height: 1;
`;

const StyledDragFileText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const fieldIsRequired = (t: TFunction, field: string) =>
  t('validate.common.isrequired', '{{field}} is required.', { field });

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    name: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.nameText))
      .required(fieldIsRequired(t, translationTexts.nameText)),
    parentDomainId: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.parentDomainNameText))
      .required(fieldIsRequired(t, translationTexts.parentDomainNameText)),
  });
};

interface FormatInitialValuesOptions {
  heliumISOContainerDataChannel?:
    | HeliumISOContainerDataChannelTemplate[]
    | null;
}

const formatInitialValues = (
  initialValues: any,
  options: FormatInitialValuesOptions
): Values => {
  const editObject =
    initialValues?.retrieveDomainEditComponentsByIdResult?.editObject;

  const domainHeliumIsoContainer = initialValues?.domainHeliumIsoContainer;

  const hasDisplayPrioritiesPreConfigured =
    domainHeliumIsoContainer?.dataChannelsDisplayPriority &&
    Array.isArray(domainHeliumIsoContainer.dataChannelsDisplayPriority) &&
    domainHeliumIsoContainer.dataChannelsDisplayPriority.length > 0;

  const displayPriority = hasDisplayPrioritiesPreConfigured
    ? domainHeliumIsoContainer.dataChannelsDisplayPriority!
    : options.heliumISOContainerDataChannel?.map(
        (channel) => channel.heliumISOContainerDataChannelId
      );

  return {
    name: editObject?.name || '',
    parentDomainId: editObject?.parentDomainId || '',
    logo: editObject?.logo || '',

    // Assets Tab
    // Helium ISO Containers sub-tab
    domainHeliumIsoContainer: {
      themeColor: domainHeliumIsoContainer?.themeColor || '',
      hasIsoContainer: domainHeliumIsoContainer?.hasIsoContainer || false,
      isoContainerDefaultSiteId:
        domainHeliumIsoContainer?.isoContainerDefaultSiteInfo?.siteId || '',
      isoContainerDefaultHeliumEventGroupId:
        domainHeliumIsoContainer?.isoContainerDefaultHeliumEventGroupId || '',
      isoContainerDefaultHeliumProductId:
        domainHeliumIsoContainer?.isoContainerDefaultHeliumProductInfo
          ?.productId || '',
      isoContainerDefaultHeliumLevelDCTemplateId:
        domainHeliumIsoContainer?.isoContainerDefaultHeliumLevelDCTemplateId ||
        '',
      isoContainerDefaultHeliumPressureDCTemplateId:
        domainHeliumIsoContainer?.isoContainerDefaultHeliumPressureDCTemplateId ||
        '',
      isoContainerDefaultHeliumPressureRoCDCTemplateId:
        domainHeliumIsoContainer?.isoContainerDefaultHeliumPressureRoCDCTemplateId ||
        '',
      isoContainerDefaultNitrogenEventGroupId:
        domainHeliumIsoContainer?.isoContainerDefaultNitrogenEventGroupId || '',
      isoContainerDefaultNitrogenProductId:
        domainHeliumIsoContainer?.isoContainerDefaultNitrogenProductInfo
          ?.productId || '',
      isoContainerDefaultNitrogenLevelDCTemplateId:
        domainHeliumIsoContainer?.isoContainerDefaultNitrogenLevelDCTemplateId ||
        '',
      isoContainerDefaultNitrogenPressureDCTemplateId:
        domainHeliumIsoContainer?.isoContainerDefaultNitrogenPressureDCTemplateId ||
        '',
      dataChannelsDisplayPriority: displayPriority,
    },
    domainNotes: initialValues?.domainNotes || '',
  };
};

const getColor = (props: any) => {
  if (props.isDragAccept) {
    return props.theme.custom.palette.draggable.isDragAccept;
  }
  if (props.isDragReject) {
    return props.theme.custom.palette.draggable.isDragReject;
  }
  if (props.isDragActive) {
    return props.theme.custom.palette.draggable.isDragActive;
  }
  return props.theme.custom.palette.draggable.isDragDefault;
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 1px;
  border-color: ${(props) => getColor(props)};
  border-style: solid;
  background-color: ${(props) => props.theme.palette.background.paper};
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  margin-top: 8px;
`;

interface StyledDropZoneProps {
  id?: string;
  initialLogo?: string;
  onChange?: (base64Result?: string | null | ArrayBuffer) => void;
}
function StyledDropzone({ id, initialLogo, onChange }: StyledDropZoneProps) {
  const { t } = useTranslation();

  const onDropHandler = (files: any) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event?.target?.result;
      onChange?.(base64String);
    };
    reader.readAsDataURL(file);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: 'image/jpeg, image/png', onDrop: onDropHandler });

  return (
    <div className="container">
      <StyledText>{t('ui.domainEditor.Logo', 'Logo')}</StyledText>
      <Container
        id={id}
        {...getRootProps({ isDragActive, isDragAccept, isDragReject })}
      >
        <Grid container alignItems="center" justify="space-between">
          <Grid item>
            <Box bgcolor="#ffffff" padding={1}>
              {initialLogo ? (
                <StyledLogo
                  src={`data:image;base64,${initialLogo}`}
                  alt="Logo"
                />
              ) : (
                <StyledDefaultLogo />
              )}
            </Box>
          </Grid>

          <Grid item>
            <input {...getInputProps()} />
            <StyledDragFileText>
              {t(
                'ui.domainEditor.uploadFieldText',
                'Drag file here or click to select file'
              )}
            </StyledDragFileText>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

interface Props {
  initialValues: any;

  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  isInlineForm?: boolean;
  activeTab: number;
  editingDomainId: string;
  domains: DomainInfoRecord[];
  eventRuleGroups: EventRuleGroupInfo[];
  dataChannelTemplates: DataChannelTemplateDetail[];
  isoContainerDefaultSiteInfo?: SiteInfoRecord | null;
  isoContainerDefaultHeliumProductInfo?: ProductDetail | null;
  isoContainerDefaultNitrogenProductInfo?: ProductDetail | null;
  heliumISOContainerDataChannel?:
    | HeliumISOContainerDataChannelTemplate[]
    | null;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
}

const ObjectForm = ({
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  domains,
  eventRuleGroups,
  dataChannelTemplates,
  isInlineForm,
  activeTab,
  editingDomainId,
  isoContainerDefaultSiteInfo,
  isoContainerDefaultHeliumProductInfo,
  isoContainerDefaultNitrogenProductInfo,
  heliumISOContainerDataChannel,
}: Props) => {
  const { t } = useTranslation();

  // State variables to maintain selected autocomplete values when switching
  // between tabs. We need this since the current tab is unmounted when
  // switching to another tab. When re-visiting that tab, we need to populate
  // the autocomplete with the value the user selected (if they changed the
  // value of the autocomplete.)
  const [
    selectedDefaultSite,
    setSelectedDefaultSite,
  ] = useState<ProductDetail | null>(null);
  const [
    selectedHeliumProduct,
    setSelectedHeliumProduct,
  ] = useState<ProductDetail | null>(null);
  const [
    selectedNitrogenProduct,
    setSelectedNitrogenProduct,
  ] = useState<ProductDetail | null>(null);

  const formattedInitialValues = formatInitialValues(initialValues, {
    heliumISOContainerDataChannel,
  });

  const nameText = t('ui.common.name', 'Name');
  const parentDomainNameText = t(
    'ui.domainEditor.parentDomainName',
    'Parent Domain Name'
  );

  const validationSchema = buildValidationSchema(t, {
    nameText,
    parentDomainNameText,
  });

  const colorOptions = [
    {
      label: t('enum.colorScheme.yellow', 'Yellow'),
      value: DomainThemeColor.Yellow,
    },
    {
      label: t('enum.colorScheme.blue', 'Blue'),
      value: DomainThemeColor.Blue,
    },
    {
      label: t('enum.colorScheme.navy', 'Navy'),
      value: DomainThemeColor.Navy,
    },
    {
      label: t('enum.colorScheme.green', 'Green'),
      value: DomainThemeColor.Green,
    },
    {
      label: t('enum.colorScheme.teal', 'Teal'),
      value: DomainThemeColor.Teal,
    },
    {
      label: t('enum.colorScheme.orange', 'Orange'),
      value: DomainThemeColor.Orange,
    },
    {
      label: t('enum.colorScheme.red', 'Red'),
      value: DomainThemeColor.Red,
    },
  ];

  return (
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
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, errors, setFieldValue }) => (
        <>
          <FormikEffect
            onChange={handleFormChange}
            isValid={isValid}
            restoreTouchedFields={restoreTouchedFields}
            restoreInitialValues={restoreInitialValues}
          />

          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormLinearProgress in={isSubmitting} />
              </Grid>
            </Grid>

            {activeTab === 0 && (
              <Grid container spacing={3} alignItems="stretch">
                <Grid
                  item
                  xs={12}
                  md={isInlineForm ? undefined : 6}
                  style={{ display: 'flex' }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="stretch"
                    style={{
                      flexDirection: 'column',
                      flexWrap: 'nowrap',
                    }}
                  >
                    <Grid item xs={12} style={{ flex: '1 0 auto' }}>
                      <PageSubHeader dense>
                        {t('ui.domainEditor.domainDetails', 'Domain Details')}
                      </PageSubHeader>
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
                      <EditorBox width="100%">
                        <Grid container spacing={5}>
                          <Grid item xs={12}>
                            <Field
                              id="name-input"
                              component={CustomTextField}
                              name="name"
                              label={nameText}
                              required
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <DropdownAutocomplete<DomainInfoRecord>
                              id="parentDomainId-input"
                              options={domains}
                              getOptionLabel={(domain) => domain?.name || ''}
                              value={
                                domains.find(
                                  (domain) =>
                                    domain.domainId === values.parentDomainId
                                ) || null
                              }
                              onChange={(__: any, domain) => {
                                if (!domain || !domain.domainId) {
                                  return setFieldValue('parentDomainId', '');
                                }

                                return setFieldValue(
                                  'parentDomainId',
                                  domain.domainId
                                );
                              }}
                              label={parentDomainNameText}
                              renderOption={(option) => (
                                <Typography>{option.name}</Typography>
                              )}
                              fieldError={errors.parentDomainId}
                            />
                          </Grid>
                        </Grid>
                      </EditorBox>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={isInlineForm ? undefined : 6}
                  style={{ display: 'flex' }}
                >
                  <Grid
                    container
                    spacing={2}
                    alignItems="stretch"
                    style={{
                      flexDirection: 'column',
                      flexWrap: 'nowrap',
                    }}
                  >
                    <Grid item xs={12} style={{ flex: '1 0 auto' }}>
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        justify="space-between"
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'nowrap',
                        }}
                      >
                        <Grid item>
                          <PageSubHeader dense>
                            {t('ui.domainEditor.theme', 'Theme')}
                          </PageSubHeader>
                        </Grid>
                        <Grid item>
                          <StyledButton
                            variant="text"
                            useDomainColorForIcon
                            startIcon={<RefreshIcon />}
                            onClick={() => {
                              setFieldValue(
                                'domainHeliumIsoContainer.themeColor',
                                DEFAULT_DOMAIN_THEME_COLOR
                              );
                              setFieldValue('logo', '');
                            }}
                          >
                            {t(
                              'ui.domainEditor.resetToDefault',
                              'Reset to Default'
                            )}
                          </StyledButton>
                        </Grid>
                      </Grid>
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
                      <EditorBox width="100%">
                        <Grid container spacing={5}>
                          <Grid item xs={12}>
                            <Field
                              id="domainHeliumIsoContainer.themeColor-input"
                              component={CustomTextField}
                              name="domainHeliumIsoContainer.themeColor"
                              label={t(
                                'ui.domainEditor.colorScheme',
                                'Color Scheme'
                              )}
                              select
                              SelectProps={{ displayEmpty: true }}
                            >
                              <MenuItem value="" disabled>
                                <span style={{ color: fadedTextColor }}>
                                  {t('ui.common.select', 'Select')}
                                </span>
                              </MenuItem>
                              {colorOptions?.map((color) => (
                                <MenuItem value={color.value} key={color.value}>
                                  <Grid container spacing={1}>
                                    <Grid item>
                                      <Box
                                        component="span"
                                        height="25px"
                                        width="25px"
                                        bgcolor={color.value}
                                        overflow="hidden"
                                        border="1px solid rgba(0, 0, 0, 0.2)"
                                      >
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                      </Box>
                                    </Grid>
                                    <Grid item>{color.label}</Grid>
                                  </Grid>
                                </MenuItem>
                              ))}
                            </Field>
                          </Grid>
                          <Grid item xs={12}>
                            <StyledDropzone
                              id="logo-input"
                              initialLogo={values.logo}
                              onChange={(base64String) => {
                                if (
                                  !base64String ||
                                  typeof base64String !== 'string'
                                ) {
                                  setFieldValue('logo', '');
                                  return;
                                }

                                const parsedData = base64String.split(
                                  'base64,'
                                )?.[1];
                                setFieldValue('logo', parsedData);
                              }}
                            />
                          </Grid>
                        </Grid>
                      </EditorBox>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            {activeTab === 1 && (
              <AssetsTab
                values={values}
                setFieldValue={setFieldValue}
                editingDomainId={editingDomainId}
                isoContainerDefaultSiteInfo={isoContainerDefaultSiteInfo}
                isoContainerDefaultHeliumProductInfo={
                  isoContainerDefaultHeliumProductInfo
                }
                isoContainerDefaultNitrogenProductInfo={
                  isoContainerDefaultNitrogenProductInfo
                }
                heliumISOContainerDataChannel={heliumISOContainerDataChannel}
                eventRuleGroups={eventRuleGroups}
                dataChannelTemplates={dataChannelTemplates}
                selectedHeliumProduct={selectedHeliumProduct}
                selectedNitrogenProduct={selectedNitrogenProduct}
                selectedDefaultSite={selectedDefaultSite}
                setSelectedHeliumProduct={setSelectedHeliumProduct}
                setSelectedNitrogenProduct={setSelectedNitrogenProduct}
                setSelectedDefaultSite={setSelectedDefaultSite}
              />
            )}
            {activeTab === 2 && <NoteTab />}
          </Form>
        </>
      )}
    </Formik>
  );
};

export default ObjectForm;
