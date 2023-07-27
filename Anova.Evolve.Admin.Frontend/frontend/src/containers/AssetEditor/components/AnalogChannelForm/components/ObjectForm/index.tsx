/* eslint-disable indent, @typescript-eslint/no-unused-vars */
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DataChannelDataSourceType,
  DataChannelType,
  EditTankDimension,
  EventRuleGroupInfo,
  EvolveDataChannelTemplateDetail,
  ProductNameInfo,
  PublishedDataChannelSearchInfo,
  RTUChannelUsageInfo,
  RTUDeviceInfo,
  SourceDataChannelDefaultsInfo,
  TankType,
  UserPermissionType,
} from 'api/admin/api';
import Alert from 'components/Alert';
import Button from 'components/Button';
import CloseIconButton from 'components/buttons/CloseIconButton';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import ProductAutocompleteLegacy from 'components/forms/form-fields/ProductAutocompleteLegacy';
import PublishedCommentsAutocomplete from 'components/forms/form-fields/PublishedCommentsAutocomplete';
import RTUAutoCompleteLegacy from 'components/forms/form-fields/RTUAutoCompleteLegacy';
import TankDimensionAutocompleteLegacy from 'components/forms/form-fields/TankDimensionAutocompleteLegacy';
import FormikEffect from 'components/forms/FormikEffect';
import ProductLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/ProductLabelWithEditorButtons';
import TankDimensionLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/TankDimensionLabelWithEditorButtons';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import ProductEditor from 'containers/ProductEditor';
import TankDimensionEditor from 'containers/TankDimensionEditor';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { fadedTextColor } from 'styles/colours';
import { AccessType } from 'types';
import { EMPTY_GUID } from 'utils/api/constants';
import { getTankDimensionTypeOptions } from 'utils/i18n/enum-to-text';
import * as Yup from 'yup';
import FormChangeEffect from '../FormChangeEffect';
import { Values } from './types';

const StyledLabelButton = styled(Button)`
  height: 15px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const fieldIsRequired = (t: TFunction, field: string) =>
  t('validate.common.isrequired', '{{field}} is required.', { field });

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    description: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.descriptionText))
      .required(fieldIsRequired(t, translationTexts.descriptionText)),
  });
};

const formatInitialValues = (values?: any) => {
  return {
    ...values,
    ...(!values?.description && { description: '' }),
    ...(!values?.dataSource && { dataSource: DataChannelDataSourceType.RTU }),
    ...(!values?.sourceDataChannelId && { sourceDataChannelId: '' }),
    ...(!values?.rtuId && { rtuId: '' }),
    ...(!values?.rtuChannelId && { rtuChannelId: '' }),
    ...(!values?.dataChannelTemplateId && { dataChannelTemplateId: '' }),
    ...(!values?.eventRuleGroupId && { eventRuleGroupId: '' }),
    ...(!values?.productId && { productId: '' }),
    ...(!values?.isTankDimensionsSet && { isTankDimensionsSet: false }),
    ...(!values?.tankType &&
      values?.tankType !== TankType.None && {
        tankType: TankType.HorizontalWith2To1EllipsoidalEnds,
      }),
    ...(!values?.tankDimensionId && { tankDimensionId: '' }),
  };
};

interface Props {
  dataChannelTemplates?: EvolveDataChannelTemplateDetail[] | null;
  eventRuleGroups?: EventRuleGroupInfo[] | null;
  domainId?: string;
  userId?: string;
  initialValues: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  submissionResult?: any;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
  setPublishedCommentDetails: (
    publishedCommentDetails: PublishedDataChannelSearchInfo | null
  ) => void;
}

const ObjectForm = ({
  dataChannelTemplates,
  eventRuleGroups,
  domainId,
  userId,
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
  setPublishedCommentDetails,
}: Props) => {
  const { t } = useTranslation();

  const hasPermission = useSelector(selectHasPermission);
  const canReadTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Read
  );

  const [
    selectedPublishedComment,
    setSelectedPublishedComment,
  ] = useState<PublishedDataChannelSearchInfo | null>(null);
  const [selectedRtu, setSelectedRtu] = useState<RTUDeviceInfo | null>(null);
  const [rtuChannelsFromRtu, setRtuChannelsFromRtu] = useState<
    RTUChannelUsageInfo[] | null | undefined
  >();
  const [sourceDataChannelDetails, setSourceDataChannelDetails] = useState<
    SourceDataChannelDefaultsInfo | null | undefined
  >(null);

  // Product drawer state
  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<ProductNameInfo | null>();
  const [editingProductId, setEditingProductId] = useState<string | null>();
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);

  // Tank Dimensions Drawer
  const [selectedTankDimension, setSelectedTankDimension] = useState<
    EditTankDimension | null | undefined
  >();
  const [editingTankDimensionId, setEditingTankDimensionId] = useState<
    string | null
  >();
  const [isTankDimensionDrawerOpen, setIsTankDimensionDrawerOpen] = useState(
    false
  );

  const formattedInitialValues = formatInitialValues(initialValues);

  const descriptionText = t('ui.common.description', 'Description');
  const rtuText = t('ui.common.rtu', 'RTU');
  const productText = t('ui.common.product', 'Product');
  const publishedCommentsText = t(
    'ui.datachannel.publishedcomments',
    'Published Comments'
  );

  const typeOptions = getTankDimensionTypeOptions(t);
  const validationSchema = buildValidationSchema(t, {
    descriptionText,
    publishedCommentsText,
  });

  const toggleProductDrawer = (open: boolean, options?: any) => (
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsProductDrawerOpen(open);

    if (open && options) {
      setEditingProductId(options?.productId);
    }
  };

  const toggleTankDimensionDrawer = (open: boolean, options?: any) => (
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsTankDimensionDrawerOpen(open);

    if (open && options) {
      setEditingTankDimensionId(options?.tankDimensionId);
    }
  };

  return (
    <Formik
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
      {({ isSubmitting, isValid, values, setFieldValue }) => {
        const selectedTemplate = dataChannelTemplates?.find(
          (template) =>
            template.dataChannelTemplateId === values.dataChannelTemplateId
        );
        return (
          <>
            <FormikEffect
              onChange={handleFormChange}
              isValid={isValid}
              restoreTouchedFields={restoreTouchedFields}
              restoreInitialValues={restoreInitialValues}
            />
            <FormChangeEffect
              values={values}
              setRtuChannelsFromRtu={setRtuChannelsFromRtu}
              setSourceDataChannelDetails={setSourceDataChannelDetails}
            />

            <Form>
              <Grid container spacing={2}>
                <Fade in={!!submissionError} unmountOnExit>
                  <Grid item xs={12}>
                    <Alert severity="error">
                      {t(
                        'ui.asset.addDataChannelError',
                        'Unable to add data channel'
                      )}
                    </Alert>
                  </Grid>
                </Fade>
                <Grid item xs={12}>
                  <FormLinearProgress in={isSubmitting} />
                </Grid>
              </Grid>

              <EditorBox>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      name="description"
                      label={t('ui.common.description', 'Description')}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      name="dataSource"
                      label={t('ui.datachannel.datasource', 'Data Source')}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      {[
                        {
                          label: t('ui.common.none', 'None'),
                          value: '',
                        },
                        {
                          label: t('ui.common.rtu', 'RTU'),
                          value: DataChannelDataSourceType.RTU,
                        },
                        {
                          label: t(
                            'enum.datachanneldatasourcetype.publisheddatachannel',
                            'Published Data Channel'
                          ),
                          value: DataChannelDataSourceType.PublishedDataChannel,
                        },
                      ].map((option) => (
                        <MenuItem key={option.label} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  {values.dataSource === DataChannelDataSourceType.RTU && (
                    <>
                      <Grid item xs={12}>
                        <Field
                          id="rtuId-input"
                          component={RTUAutoCompleteLegacy}
                          name="rtuId"
                          domainId={domainId}
                          selectedOption={selectedRtu}
                          textFieldProps={{
                            placeholder: t(
                              'ui.common.enterSearchCriteria',
                              'Enter Search Criteria...'
                            ),
                            label: rtuText,
                          }}
                          onChange={(selectedOption: RTUDeviceInfo | null) => {
                            setSelectedRtu(selectedOption);

                            // Always reset the Level Channel + Pressure Channel
                            // fields when changing the RTUs since the selected RTU
                            // can have different channels
                            setFieldValue('rtuChannelId', '');
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Field
                          component={CustomTextField}
                          name="rtuChannelId"
                          label={t('ui.common.channel', 'Channel')}
                          select
                          SelectProps={{ displayEmpty: true }}
                        >
                          <MenuItem value="" disabled>
                            <span style={{ color: fadedTextColor }}>
                              {t('ui.common.select', 'Select')}
                            </span>
                          </MenuItem>
                          {rtuChannelsFromRtu?.map((option) => (
                            <MenuItem
                              key={option.rtuChannelId}
                              value={option.rtuChannelId}
                            >
                              {option.channelNumber}&nbsp;
                              <em>
                                {option.dataChannelCount
                                  ? t('ui.datachannel.channelinuse', '(in use)')
                                  : t(
                                      'ui.datachannel.channelnotinuse',
                                      '(not in use)'
                                    )}
                              </em>
                            </MenuItem>
                          ))}
                        </Field>
                      </Grid>
                    </>
                  )}

                  {values.dataSource ===
                    DataChannelDataSourceType.PublishedDataChannel && (
                    <>
                      <Grid item xs={12}>
                        <Field
                          id="sourceDataChannelId-input"
                          component={PublishedCommentsAutocomplete}
                          name="sourceDataChannelId"
                          domainId={domainId}
                          selectedOption={selectedPublishedComment}
                          textFieldProps={{
                            placeholder: t(
                              'ui.common.enterSearchCriteria',
                              'Enter Search Criteria...'
                            ),
                            label: publishedCommentsText,
                          }}
                          onChange={(
                            selectedOption: PublishedDataChannelSearchInfo | null
                          ) => {
                            setSelectedPublishedComment(selectedOption);
                            setPublishedCommentDetails(selectedOption);
                          }}
                        />
                      </Grid>
                      {selectedPublishedComment && (
                        <Grid item xs={12}>
                          <StyledTextField
                            label={t(
                              'ui.datachannel.sourcedomain',
                              'Source Domain'
                            )}
                            value={selectedPublishedComment?.sourceDomainName}
                            disabled
                          />
                        </Grid>
                      )}
                    </>
                  )}

                  {values.dataSource !==
                  DataChannelDataSourceType.PublishedDataChannel ? (
                    <Grid item xs={12}>
                      <Field
                        component={CustomTextField}
                        name="dataChannelTemplateId"
                        label={t('ui.datachannel.template', 'Template')}
                        select
                        SelectProps={{ displayEmpty: true }}
                        required
                      >
                        <MenuItem value="" disabled>
                          <span style={{ color: fadedTextColor }}>
                            {t('ui.common.select', 'Select')}
                          </span>
                        </MenuItem>
                        {dataChannelTemplates?.map((template) => (
                          <MenuItem
                            key={template.dataChannelTemplateId}
                            value={template.dataChannelTemplateId}
                          >
                            {template.description}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                  ) : sourceDataChannelDetails ? (
                    <Grid item xs={12}>
                      <StyledTextField
                        label={t('ui.datachannel.template', 'Template')}
                        value={
                          sourceDataChannelDetails.dataChannelTemplateDescription
                        }
                        disabled
                      />
                    </Grid>
                  ) : null}

                  <Grid item xs={12}>
                    <Drawer
                      anchor="right"
                      open={isProductDrawerOpen}
                      // @ts-ignore
                      onClose={toggleProductDrawer(false)}
                      variant="temporary"
                      disableBackdropClick
                    >
                      <DrawerContent>
                        <ProductEditor
                          editingObjectId={editingProductId}
                          isInlineForm
                          headerNavButton={
                            <CloseIconButton
                              onClick={toggleProductDrawer(false)}
                            />
                          }
                          saveCallback={(response: any) => {
                            const product =
                              response?.saveProductResult?.editObject;

                            setSelectedProduct(product);
                            setEditingProductId(product?.id);
                          }}
                          saveAndExitCallback={(response: any) => {
                            const product =
                              response?.saveProductResult?.editObject;

                            setSelectedProduct(product);
                            setEditingProductId(product?.id);
                            toggleProductDrawer(false)();
                          }}
                        />
                      </DrawerContent>
                    </Drawer>
                    <Field
                      id="productId-input"
                      component={ProductAutocompleteLegacy}
                      name="productId"
                      freeSolo
                      required
                      domainId={domainId}
                      selectedOption={selectedProduct}
                      textFieldProps={{
                        placeholder: t(
                          'ui.common.enterSearchCriteria',
                          'Enter Search Criteria...'
                        ),
                        label: (
                          <ProductLabelWithEditorButtons
                            isEditButtonDisabled={
                              !values.productId ||
                              values.productId === EMPTY_GUID
                            }
                            onClickEdit={toggleProductDrawer(true, {
                              productId: values.productId,
                            })}
                            onClickAdd={toggleProductDrawer(true, {
                              productId: null,
                            })}
                          />
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      id="eventRuleGroupId-input"
                      component={CustomTextField}
                      select
                      name="eventRuleGroupId"
                      label={t('ui.common.eventrulegroup', 'Event Rule Group')}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <span style={{ color: fadedTextColor }}>
                          {t('ui.common.select', 'Select')}
                        </span>
                      </MenuItem>
                      {eventRuleGroups?.map((eventRuleGroup) => (
                        <MenuItem
                          key={eventRuleGroup.eventRuleGroupId}
                          value={eventRuleGroup.eventRuleGroupId}
                        >
                          {eventRuleGroup.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  {selectedTemplate?.dataChannelType ===
                    DataChannelType.Level && (
                    <>
                      {canReadTankDimension && (
                        <Grid item xs={12}>
                          <Field
                            component={CheckboxWithLabel}
                            name="isTankDimensionsSet"
                            type="checkbox"
                            Label={{
                              label: t(
                                'ui.datachannel.setTankDimensions',
                                'Set Tank Dimensions (volumetric)'
                              ),
                            }}
                          />
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        {values.isTankDimensionsSet ? (
                          <>
                            <Drawer
                              anchor="right"
                              open={isTankDimensionDrawerOpen}
                              // @ts-ignore
                              onClose={toggleTankDimensionDrawer(false)}
                              variant="temporary"
                              disableBackdropClick
                            >
                              <DrawerContent>
                                <TankDimensionEditor
                                  editingObjectId={editingTankDimensionId}
                                  isInlineForm
                                  headerNavButton={
                                    <CloseIconButton
                                      onClick={toggleTankDimensionDrawer(false)}
                                    />
                                  }
                                  saveCallback={(response: any) => {
                                    const tankDimension =
                                      response?.saveTankDimensionResult
                                        ?.editObject;

                                    setSelectedTankDimension(tankDimension);
                                    setEditingTankDimensionId(
                                      tankDimension?.tankDimensionId
                                    );
                                  }}
                                  saveAndExitCallback={(response: any) => {
                                    const tankDimension =
                                      response?.saveTankDimensionResult
                                        ?.editObject;

                                    setSelectedTankDimension(tankDimension);
                                    setEditingTankDimensionId(
                                      tankDimension?.tankDimensionId
                                    );
                                    toggleTankDimensionDrawer(false)();
                                  }}
                                />
                              </DrawerContent>
                            </Drawer>
                            <Field
                              id="tankDimensionId-input"
                              component={TankDimensionAutocompleteLegacy}
                              name="tankDimensionId"
                              freeSolo
                              required
                              domainId={domainId}
                              userId={userId}
                              selectedOption={selectedTankDimension}
                              textFieldProps={{
                                label: (
                                  <TankDimensionLabelWithEditorButtons
                                    isEditButtonDisabled={
                                      !values.tankDimensionId ||
                                      values.tankDimensionId === EMPTY_GUID
                                    }
                                    onClickEdit={toggleTankDimensionDrawer(
                                      true,
                                      {
                                        tankDimensionId: values.tankDimensionId,
                                      }
                                    )}
                                    onClickAdd={toggleTankDimensionDrawer(
                                      true,
                                      {
                                        tankDimensionId: null,
                                      }
                                    )}
                                  />
                                ),
                                placeholder: t(
                                  'ui.common.enterSearchCriteria',
                                  'Enter Search Criteria...'
                                ),
                              }}
                            />
                          </>
                        ) : (
                          <Field
                            id="tankType-input"
                            component={CustomTextField}
                            label={t('ui.datachannel.tanktype', 'Tank Type')}
                            select
                            name="tankType"
                            SelectProps={{ displayEmpty: true }}
                          >
                            <MenuItem value="" disabled>
                              <span style={{ color: fadedTextColor }}>
                                {t('ui.common.select', 'Select')}
                              </span>
                            </MenuItem>

                            {typeOptions?.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Field>
                        )}
                      </Grid>
                    </>
                  )}
                </Grid>
              </EditorBox>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default ObjectForm;
