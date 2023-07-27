/* eslint-disable indent, react/jsx-indent */
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import {
  DataChannelDataSourceType,
  EditDataChannelOptions,
  EditTankDimension,
  EvolveDataChannelTemplateDetail,
  ForecastModeType,
  ProductNameInfo,
  PublishedDataChannelSearchInfo,
  RTUChannelUsageInfo,
  TankDimensionDescriptionInfo,
  UnitType,
} from 'api/admin/api';
import Button from 'components/Button';
import CloseIconButton from 'components/buttons/CloseIconButton';
import DrawerContent from 'components/drawers/DrawerContent';
import Autocomplete from 'components/forms/form-fields/Autocomplete';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FreeSoloAutocomplete from 'components/forms/form-fields/FreeSoloAutocomplete';
import ProductAutocompleteLegacy from 'components/forms/form-fields/ProductAutocompleteLegacy';
import PublishedCommentsAutocomplete from 'components/forms/form-fields/PublishedCommentsAutocomplete';
import RTUAutoCompleteLegacy from 'components/forms/form-fields/RTUAutoCompleteLegacy';
import TankDimensionAutocompleteLegacy from 'components/forms/form-fields/TankDimensionAutocompleteLegacy';
import ProductLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/ProductLabelWithEditorButtons';
import TankDimensionLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/TankDimensionLabelWithEditorButtons';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import StyledStaticField from 'components/forms/styled-fields/StyledStaticField';
import PageSubHeader from 'components/PageSubHeader';
import {
  ConfirmedUnitConversions,
  UnitConversionDetails,
  UnitConversionDetailsForDialog,
  UnitConversionType,
} from 'containers/DataChannelEditorLegacy/types';
import ProductEditor from 'containers/ProductEditor';
import TankDimensionEditor from 'containers/TankDimensionEditor';
import { Field, FormikHelpers } from 'formik';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { EMPTY_GUID } from 'utils/api/constants';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { formatModifiedDatetime } from 'utils/format/dates';
import { isNumber } from 'utils/format/numbers';
import {
  buildScalingModeTypeTextMapping,
  buildUnitsOfMeasureTextMapping,
  getAllUnitOptions,
  getForecastModeTypeOptions,
  getTankDimensionTypeOptions,
  getUnitsOfVolumeAndMassOptions,
} from 'utils/i18n/enum-to-text';
import { getLabelWithUnits } from 'utils/ui/helpers';
import {
  getPreciseFieldName,
  getPreciseOrRoundedValue,
} from '../ObjectForm/helpers';
import { Values } from '../ObjectForm/types';
import AdvancedCalibrationOptions from './AdvancedCalibrationOptions';
import IntegrationParameters from './IntegrationParameters';
import UnitConversionDialog from './UnitConversionDialog';

// NOTE: This was in place to make it easier to switch between the unit
// conversion dialog feature which has gone through a bunch of changes
const ENABLE_UNIT_CONVERSION_DIALOG_FEATURE = true;

const getProductId = (product?: any): string | undefined => {
  return product?.productId || product?.id;
};

const getProductDescription = (product?: any): string | undefined => {
  return product?.name || product?.description;
};

const StyledSmallBoldedText = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
`;

const StyledSmallText = styled(Typography)`
  font-size: 14px;
`;

const BoldedValue = styled(Typography)`
  font-size: 15px;
  font-weight: 500;
`;

interface Props {
  values: Values;
  setValues: FormikHelpers<Values>['setValues'];
  setFieldValue: FormikHelpers<Values>['setFieldValue'];
  domainId?: string;
  dataChannelId?: string;
  options?: EditDataChannelOptions | null;
  rtuChannelsFromRtu?: RTUChannelUsageInfo[] | null;
  dataChannelTypeText?: string;
}

const GeneralTab = ({
  values,
  setValues,
  setFieldValue,
  domainId,
  dataChannelId,
  options,
  rtuChannelsFromRtu,
  dataChannelTypeText,
}: Props) => {
  // #region Translation helpers
  const { t } = useTranslation();
  const typeOptions = useMemo(() => getTankDimensionTypeOptions(t), [t]);
  const forecastModeTypeOptions = useMemo(() => getForecastModeTypeOptions(t), [
    t,
  ]);
  const rtuText = t('ui.common.rtu', 'RTU');
  const unitsOfMeasureTextMapping = buildUnitsOfMeasureTextMapping(t);
  const scalingModeTypeTextMapping = buildScalingModeTypeTextMapping(t);
  const unitsOfVolumeAndMassOptions = getUnitsOfVolumeAndMassOptions(t);
  const allUnitOptions = getAllUnitOptions(t);
  // #endregion Translation helpers

  // #region Helper variables for the form/fields
  const isTankRelevant = values.dataChannelTemplateInfo?.isTankRelevant;
  const isProductRelevant = values.dataChannelTemplateInfo?.isProductRelevant;
  const isForecastRelevant = values.dataChannelTemplateInfo?.isForecastRelevant;

  const displayUnitsOptions = values.isTankDimensionsSet
    ? allUnitOptions
    : unitsOfVolumeAndMassOptions;

  const selectedRtuChannel =
    values.rtuChannelId === values.rtuChannelInfo?.rtuChannelId
      ? values.rtuChannelInfo
      : rtuChannelsFromRtu?.find(
          (channel) => channel.rtuChannelId === values.rtuChannelId
        );
  const isRTUChannelMaster =
    selectedRtuChannel && 'isRTUChannelMaster' in selectedRtuChannel
      ? selectedRtuChannel.isRTUChannelMaster
      : undefined;

  const priorityLevelText =
    isRTUChannelMaster === undefined
      ? t('ui.common.notapplicable', 'N/A')
      : isRTUChannelMaster
      ? t('ui.datachannel.master', 'Master')
      : t('ui.datachannel.secondary', 'Secondary');

  const productId = getProductId(values.productInfo);

  const scaledUnitsText =
    values.isTankDimensionsSet && isNumber(values.scaledUnits)
      ? // @ts-ignore
        unitsOfMeasureTextMapping[values.scaledUnits]
      : values.scaledUnitsAsText;
  const displayUnitsText =
    !values.isTankDimensionsSet && !values.setReadingDisplayOptions
      ? scaledUnitsText
      : // @ts-ignore
        unitsOfMeasureTextMapping[values.displayUnits] || '';

  const showUsageRateField =
    values.forecastMode === ForecastModeType.ManualUsageRate;
  const usageRateText = displayUnitsText
    ? t('ui.datachannel.usagerate', 'Usage Rate ({{unit}}/hr)', {
        unit: displayUnitsText,
      })
    : t('ui.datachanneleventrule.usagerate', 'Usage Rate');

  const channelPublishedDate = values.publishedChannelInfo?.publishedDate;
  const channelUnpublishedDate = values.publishedChannelInfo?.unpublishedDate;
  const isChannelPublished =
    !!values.publishedChannelInfo?.isPublished ||
    !!(
      // Channel has only been published (not unpublished yet)
      (
        (channelPublishedDate && !channelUnpublishedDate) ||
        // Channel was published AFTER it was unpublished
        (channelPublishedDate &&
          channelUnpublishedDate &&
          channelPublishedDate > channelUnpublishedDate)
      )
    );

  // Only data channel templates that match the data channel's type at time
  // of creation are allowed to be selected.
  const filteredDataChannelTemplates = options?.dataChannelTemplates?.filter(
    (template) => template.dataChannelType === values.dataChannelType
  );

  // TODO: Is this logic needed now that the Sensor Template is disabled when
  // data source is PublishedComments?
  const dataChannelTemplateOptions =
    values.dataChannelTemplateInfo &&
    !filteredDataChannelTemplates?.find(
      (template) =>
        template.dataChannelTemplateId ===
        values.dataChannelTemplateInfo?.dataChannelTemplateId
    )
      ? [
          values.dataChannelTemplateInfo,
          ...(filteredDataChannelTemplates || []),
        ]
      : filteredDataChannelTemplates;
  // #endregion Helper variables for the form/fields

  const [
    isAdvancedCalibrationBoxOpen,
    setIsAdvancedCalibrationBoxOpen,
  ] = useState(false);
  const toggleAdvancedCalibrationBox = () => {
    setIsAdvancedCalibrationBoxOpen((prevState) => !prevState);
  };

  const [
    selectedPublishedComment,
    setSelectedPublishedComment,
  ] = useState<PublishedDataChannelSearchInfo | null>(null);

  // #region Unit conversion dialog
  const [isUnitConversionDialogOpen, setIsUnitConversionDialogOpen] = useState(
    false
  );
  const [
    unitConversionDetails,
    setUnitConversionDetails,
  ] = useState<UnitConversionDetails | null>(null);

  const openUnitConversionDialog = (
    details: UnitConversionDetailsForDialog
  ) => {
    const conversionProductId = details.productId || productId;
    const conversionProductInfo = details.productInfo || values.productInfo;
    const conversionTankDimensionId =
      details.tankDimensionId || values.tankDimensionInfo?.tankDimensionId;
    const conversionTankDimensionInfo =
      details.tankDimensionInfo || values.tankDimensionInfo;
    const conversionFromUnit = isNumber(details.fromUnit)
      ? (details.fromUnit as UnitType)
      : values.displayUnits;
    const conversionToUnit = isNumber(details.toUnit)
      ? (details.toUnit as UnitType)
      : values.displayUnits;
    if (
      // The following things are REQUIRED in order to perform unit conversions
      conversionProductId &&
      conversionTankDimensionId &&
      isNumber(conversionFromUnit) &&
      isNumber(conversionToUnit) &&
      isNumber(values.displayMaxProductHeight) &&
      isNumber(values.displayUnits) &&
      isNumber(values.scaledUnits)
    ) {
      const displayMaxProductHeight = getPreciseOrRoundedValue(
        values,
        'displayMaxProductHeight'
      );
      const graphMin = getPreciseOrRoundedValue(values, 'graphMin');
      const graphMax = getPreciseOrRoundedValue(values, 'graphMax');
      const maxDeliverQuantity = getPreciseOrRoundedValue(
        values,
        'maxDeliverQuantity'
      );
      const manualUsageRate = getPreciseOrRoundedValue(
        values,
        'manualUsageRate'
      );
      const conversionDetails = {
        unitConversionType: details.unitConversionType,
        productId: conversionProductId,
        productInfo: conversionProductInfo,
        tankDimensionId: conversionTankDimensionId,
        tankDimensionInfo: conversionTankDimensionInfo,
        fromUnit: conversionFromUnit as UnitType,
        toUnit: conversionToUnit as UnitType,
        scaledUnit: values.scaledUnits as UnitType,
        fromTextValue: details.fromTextValue,
        toTextValue: details.toTextValue,
        showUsageRate: showUsageRateField,
        displayDecimalPlaces: values.displayDecimalPlaces,
        // Fields
        displayMaxProductHeight: isNumber(displayMaxProductHeight)
          ? Number(displayMaxProductHeight)
          : undefined,
        graphMin: isNumber(graphMin) ? Number(graphMin) : undefined,
        graphMax: isNumber(graphMax) ? Number(graphMax) : undefined,
        maxDeliveryQuantity: isNumber(maxDeliverQuantity)
          ? Number(maxDeliverQuantity)
          : undefined,
        usageRate: isNumber(manualUsageRate)
          ? Number(manualUsageRate)
          : undefined,
        values,
      };

      setUnitConversionDetails(conversionDetails);
      setIsUnitConversionDialogOpen(true);

      return true;
    }

    return false;
  };
  const closeUnitConversionDialog = () => setIsUnitConversionDialogOpen(false);
  const clearConversionDetails = () => setUnitConversionDetails(null);

  const handleDisplayUnitOnChangeBlocking = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newDisplayUnit = (event.target.value as unknown) as UnitType | null;
    if (!isNumber(values.displayUnits) || !isNumber(newDisplayUnit)) {
      return false;
    }

    const fromUnit = values.displayUnits as UnitType;
    const toUnit = newDisplayUnit as UnitType;

    return openUnitConversionDialog({
      unitConversionType: UnitConversionType.DisplayUnits,
      fromUnit,
      toUnit,
      fromTextValue: unitsOfMeasureTextMapping[fromUnit],
      toTextValue: unitsOfMeasureTextMapping[toUnit],
    });
  };
  const handleProductOnChangeBlocking = (
    newProduct: Partial<ProductNameInfo> | null
  ) => {
    if (!newProduct) {
      return false;
    }

    const fromProduct = values.productInfo;
    const toProduct = newProduct;

    return openUnitConversionDialog({
      unitConversionType: UnitConversionType.Product,
      productId: toProduct.productId,
      productInfo: toProduct,
      fromTextValue: getProductDescription(fromProduct),
      toTextValue: getProductDescription(toProduct)!,
    });
  };
  const handleTankDimensionOnChangeBlocking = (
    newTankDimension: Partial<TankDimensionDescriptionInfo> | null
  ) => {
    if (!newTankDimension) {
      return false;
    }

    const fromTankDimension = values.tankDimensionInfo;
    const toTankDimension = newTankDimension;

    return openUnitConversionDialog({
      unitConversionType: UnitConversionType.TankDimension,
      tankDimensionId: toTankDimension.tankDimensionId,
      tankDimensionInfo: toTankDimension,
      fromTextValue: fromTankDimension?.description,
      toTextValue: toTankDimension.description!,
    });
  };
  const handleConfirmUnitConversions = ({
    displayMaxProductHeight,
    graphMin,
    graphMax,
    maxDeliveryQuantity,
    usageRate,
    productInfo,
    tankDimensionInfo,
    displayUnits,
    eventRuleFieldNameValuePairs,
  }: ConfirmedUnitConversions) => {
    // Update precise values for non-nested fields
    setValues({
      ...values,
      ...(isNumber(displayMaxProductHeight) && {
        _precise_displayMaxProductHeight: displayMaxProductHeight,
      }),
      ...(isNumber(graphMin) && { _precise_graphMin: graphMin }),
      ...(isNumber(graphMax) && { _precise_graphMax: graphMax }),
      ...(isNumber(maxDeliveryQuantity) && {
        _precise_maxDeliverQuantity: maxDeliveryQuantity,
      }),
      ...(isNumber(usageRate) && { _precise_manualUsageRate: usageRate }),
      ...(productInfo && { productInfo }),
      ...(tankDimensionInfo && { tankDimensionInfo }),
      displayUnits,
    });

    // Update precise values for array-related fields
    eventRuleFieldNameValuePairs.forEach((newEventRuleValues) => {
      const { fieldName, value } = newEventRuleValues;
      const preciseFieldName = getPreciseFieldName(fieldName);
      setFieldValue(preciseFieldName, value);
    });
    closeUnitConversionDialog();
  };
  // #endregion Unit conversion dialog

  // #region Tank Dimensions Drawer
  const [selectedTankDimension, setSelectedTankDimension] = useState<
    EditTankDimension | null | undefined
  >();
  const [editingTankDimensionId, setEditingTankDimensionId] = useState<
    string | null
  >();
  const [isTankDimensionDrawerOpen, setIsTankDimensionDrawerOpen] = useState(
    false
  );
  const toggleTankDimensionDrawer = (open: boolean, drawerOptions?: any) => (
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

    if (open && drawerOptions) {
      setEditingTankDimensionId(drawerOptions?.tankDimensionId);
    }
  };
  // #endregion Tank Dimensions Drawer

  // #region Product Drawer
  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<ProductNameInfo | null>();
  const [editingProductId, setEditingProductId] = useState<string | null>();
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const toggleProductDrawer = (open: boolean, drawerOptions?: any) => (
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

    if (open && drawerOptions) {
      setEditingProductId(getProductId(drawerOptions));
    }
  };
  // #endregion Product Drawer

  return (
    <>
      {unitConversionDetails && (
        <UnitConversionDialog
          open={isUnitConversionDialogOpen}
          conversionDetails={unitConversionDetails}
          handleConfirm={handleConfirmUnitConversions}
          handleCancel={closeUnitConversionDialog}
          onExited={clearConversionDetails}
        />
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PageSubHeader dense>
            {t('ui.common.generalinfo', 'General Information')}
          </PageSubHeader>
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            id="description-input"
            component={CustomTextField}
            name="description"
            label={t('ui.common.description', 'Description')}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Field
            id="serialNumber-input"
            name="serialNumber"
            component={CustomTextField}
            label={t('ui.datachannel.serialnumber', 'Serial Number')}
          />
        </Grid>
        <Grid item xs={12}>
          <StyledSmallBoldedText>
            {t('ui.datachannel.datachanneltype', 'Data Channel Type')}:{' '}
            <span aria-label="Data channel type">
              {dataChannelTypeText || <em>{t('ui.common.none', 'None')}</em>}
            </span>
          </StyledSmallBoldedText>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {(isTankRelevant || isProductRelevant) && (
          <>
            <Grid item xs={12}>
              <Grid container spacing={4} alignItems="center">
                <Grid item>
                  <PageSubHeader dense>
                    {t('ui.common.tankdetails', 'Tank Details')}
                  </PageSubHeader>
                </Grid>
                {isTankRelevant && (
                  <Grid item>
                    <Field
                      id="isTankDimensionsSet-input"
                      component={CheckboxWithLabel}
                      name="isTankDimensionsSet"
                      Label={{
                        label: t(
                          'ui.common.shouldSetTankDimensions',
                          'Set Tank Dimensions (volumetric)'
                        ),
                      }}
                      style={{ paddingTop: 0, paddingBottom: 0 }}
                      type="checkbox"
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
            {isTankRelevant && (
              <Grid item xs={12} md={6}>
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
                              response?.saveTankDimensionResult?.editObject;

                            setSelectedTankDimension(tankDimension);
                            setEditingTankDimensionId(
                              tankDimension?.tankDimensionId
                            );
                          }}
                          saveAndExitCallback={(response: any) => {
                            const tankDimension =
                              response?.saveTankDimensionResult?.editObject;

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
                      id="tankDimensionInfo-input"
                      name="tankDimensionInfo"
                      component={TankDimensionAutocompleteLegacy}
                      storeObject
                      domainId={domainId}
                      selectedOption={selectedTankDimension}
                      onChangeBlocking={
                        ENABLE_UNIT_CONVERSION_DIALOG_FEATURE
                          ? handleTankDimensionOnChangeBlocking
                          : undefined
                      }
                      textFieldProps={{
                        label: (
                          <TankDimensionLabelWithEditorButtons
                            isEditButtonDisabled={
                              !values.tankDimensionInfo?.tankDimensionId ||
                              values.tankDimensionInfo?.tankDimensionId ===
                                EMPTY_GUID
                            }
                            onClickEdit={toggleTankDimensionDrawer(true, {
                              tankDimensionId:
                                values.tankDimensionInfo?.tankDimensionId,
                            })}
                            onClickAdd={toggleTankDimensionDrawer(true, {
                              tankDimensionId: null,
                            })}
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
                      <SelectItem />
                    </MenuItem>

                    {typeOptions?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field>
                )}
              </Grid>
            )}
            {isProductRelevant && (
              <Grid item xs={12} md={6}>
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
                        <CloseIconButton onClick={toggleProductDrawer(false)} />
                      }
                      saveCallback={(response: any) => {
                        const product = response?.saveProductResult?.editObject;

                        setSelectedProduct(product);
                        setEditingProductId(getProductId(product));
                      }}
                      saveAndExitCallback={(response: any) => {
                        const product = response?.saveProductResult?.editObject;

                        setSelectedProduct(product);
                        setEditingProductId(getProductId(product));
                        toggleProductDrawer(false)();
                      }}
                    />
                  </DrawerContent>
                </Drawer>
                <Field
                  id="productInfo-input"
                  name="productInfo"
                  component={ProductAutocompleteLegacy}
                  storeObject
                  domainId={domainId}
                  selectedOption={selectedProduct}
                  onChangeBlocking={
                    ENABLE_UNIT_CONVERSION_DIALOG_FEATURE
                      ? handleProductOnChangeBlocking
                      : undefined
                  }
                  textFieldProps={{
                    placeholder: t(
                      'ui.common.enterSearchCriteria',
                      'Enter Search Criteria...'
                    ),
                    label: (
                      <ProductLabelWithEditorButtons
                        isEditButtonDisabled={
                          // "productId" is returned in responses from the autocomplete.
                          // "id" is returned in responses from editing within the drawer
                          !productId || productId === EMPTY_GUID
                        }
                        onClickEdit={toggleProductDrawer(true, {
                          productId,
                        })}
                        onClickAdd={toggleProductDrawer(true, {
                          productId: null,
                        })}
                      />
                    ),
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </>
        )}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t('ui.datachannel.datasource', 'Data Source')}
              </PageSubHeader>
            </Grid>
            {values.dataSource === DataChannelDataSourceType.RTU ? (
              <>
                <Grid item xs={12} md={6}>
                  <Field
                    id="rtuInfo-input"
                    name="rtuInfo"
                    component={RTUAutoCompleteLegacy}
                    domainId={domainId}
                    storeObject
                    textFieldProps={{
                      placeholder: t(
                        'ui.common.enterSearchCriteria',
                        'Enter Search Criteria...'
                      ),
                      label: rtuText,
                    }}
                    // Reset rtu channel field when changing RTU
                    onChange={() => {
                      setFieldValue('rtuChannelId', '');
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Field
                    id="rtuChannelId-input"
                    name="rtuChannelId"
                    component={CustomTextField}
                    label={`${t('ui.common.channel', 'Channel')} (${t(
                      'ui.datachannel.prioritylevel',
                      'Priority Level'
                    )}: ${priorityLevelText})`}
                    select
                    SelectProps={{ displayEmpty: true }}
                  >
                    <MenuItem value="">
                      <SelectItem />
                    </MenuItem>

                    {rtuChannelsFromRtu?.map((channel) => (
                      <MenuItem
                        key={channel.rtuChannelId}
                        value={channel.rtuChannelId}
                      >
                        {channel.channelNumber}&nbsp;
                        <em>
                          {channel.dataChannelCount
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
            ) : values.dataSource ===
              DataChannelDataSourceType.PublishedDataChannel ? (
              <>
                <Grid item xs={12} md={6}>
                  <Field
                    id="publishedChannelInfo-input"
                    component={PublishedCommentsAutocomplete}
                    name="publishedChannelInfo"
                    domainId={domainId}
                    storeObject
                    selectedOption={selectedPublishedComment}
                    textFieldProps={{
                      placeholder: t(
                        'ui.common.enterSearchCriteria',
                        'Enter Search Criteria...'
                      ),
                      label: t(
                        'ui.datachannel.publishedcomments',
                        'Published Comments'
                      ),
                    }}
                    onChange={(
                      selectedOption: PublishedDataChannelSearchInfo | null
                    ) => {
                      setSelectedPublishedComment(selectedOption);
                    }}
                  />
                </Grid>
                {values.publishedChannelInfo && (
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <StyledSmallText>
                          {t('ui.datachannel.sourcedomain', 'Source Domain')}
                        </StyledSmallText>
                      </Grid>
                      <Grid item xs={8}>
                        <BoldedValue>
                          {values.publishedChannelInfo?.sourceDomainName}
                        </BoldedValue>
                      </Grid>
                      <Grid item xs={4}>
                        <StyledSmallText>
                          {t('ui.datachannel.ispublished', 'Published')}
                        </StyledSmallText>
                      </Grid>
                      <Grid item xs={8}>
                        <BoldedValue>
                          {formatBooleanToYesOrNoString(isChannelPublished, t)}
                        </BoldedValue>
                      </Grid>
                      <Grid item xs={4}>
                        <StyledSmallText>
                          {isChannelPublished
                            ? t(
                                'ui.datachannel.publisheddate',
                                'Published Date'
                              )
                            : t(
                                'ui.datachannel.unpublisheddate',
                                'Unpublished Date'
                              )}
                        </StyledSmallText>
                      </Grid>
                      <Grid item xs={8}>
                        <BoldedValue>
                          {isChannelPublished
                            ? formatModifiedDatetime(channelPublishedDate)
                            : formatModifiedDatetime(channelUnpublishedDate)}
                        </BoldedValue>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
              </>
            ) : (
              <Grid item xs={12}>
                {/*
              TODO: Handle multiple different data sources. Should this whole
              data souce container be in a component?
            */}
                <StyledSmallBoldedText>
                  {t('ui.assetdetail.manualdataentry', 'Manual Data Entry')}
                </StyledSmallBoldedText>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t('ui.datachannel.sensorInformation', 'Sensor Information')}
              </PageSubHeader>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {values.dataSource === DataChannelDataSourceType.RTU ? (
                    <Field
                      id="dataChannelTemplateInfo-input"
                      name="dataChannelTemplateInfo"
                      component={Autocomplete}
                      textFieldProps={{
                        placeholder: t('ui.common.select', 'Select'),
                        label: t('ui.rtusms.sensortemplate', 'Sensor Template'),
                      }}
                      options={dataChannelTemplateOptions}
                      getOptionLabel={(
                        option: EvolveDataChannelTemplateDetail
                      ) => option.description}
                      getSelectedValue={(
                        newValue: EvolveDataChannelTemplateDetail | null
                      ) => {
                        return newValue || null;
                      }}
                      isValueSelected={(
                        option: EvolveDataChannelTemplateDetail | null,
                        currentValue: EvolveDataChannelTemplateDetail | null
                      ) => {
                        return (
                          option?.dataChannelTemplateId ===
                          currentValue?.dataChannelTemplateId
                        );
                      }}
                      getFormFieldValue={(
                        option: EvolveDataChannelTemplateDetail | null
                      ) => {
                        return option || null;
                      }}
                    />
                  ) : (
                    <StyledStaticField
                      label={t('ui.rtusms.sensortemplate', 'Sensor Template')}
                      value={
                        values.dataChannelTemplateInfo?.description || (
                          <em>{t('ui.common.none', 'None')}</em>
                        )
                      }
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  <StyledStaticField
                    label={t('ui.datachannel.scalingmode', 'Scaling Mode')}
                    value={
                      scalingModeTypeTextMapping[values.scalingMode!] || (
                        <em>{t('ui.common.none', 'None')}</em>
                      )
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {values.isTankDimensionsSet ? (
                    <Field
                      id="scaledUnits-input"
                      name="scaledUnits"
                      component={CustomTextField}
                      label={t('ui.datachannel.scaledunits', 'Scaled Units')}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <SelectItem />
                      </MenuItem>

                      {allUnitOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  ) : (
                    <Field
                      id="scaledUnitsAsText-input"
                      name="scaledUnitsAsText"
                      component={FreeSoloAutocomplete}
                      textFieldProps={{
                        label: t('ui.datachannel.scaledunits', 'Scaled Units'),
                      }}
                      options={options?.nonVolumetricScaledUnitsList}
                    />
                  )}
                </Grid>
                {!values.isTankDimensionsSet && (
                  <Grid item xs={12} md={6}>
                    <Field
                      id="scaledMaxProductHeight-input"
                      type="number"
                      name="scaledMaxProductHeight"
                      component={CustomTextField}
                      label={getLabelWithUnits(
                        t(
                          'ui.datachannel.scaledMaxProductHeight',
                          'Scaled Max Product Height'
                        ),
                        scaledUnitsText
                      )}
                    />
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Field
                    id="scaledDecimalPlaces-input"
                    type="number"
                    name="scaledDecimalPlaces"
                    component={CustomTextField}
                    label={t(
                      'ui.datachannel.scaledDecimalPlaces',
                      'Scaled Decimal Places'
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<SettingsIcon />}
                onClick={toggleAdvancedCalibrationBox}
              >
                {isAdvancedCalibrationBoxOpen
                  ? t(
                      'ui.datachannel.hideAdvancedCalibrationOptions',
                      'Hide Advanced Calibration Options'
                    )
                  : t(
                      'ui.datachannel.showAdvancedCalibrationOptions',
                      'Show Advanced Calibration Options'
                    )}
              </Button>
            </Grid>
            {isAdvancedCalibrationBoxOpen && (
              <Grid item xs={12}>
                <AdvancedCalibrationOptions
                  values={values}
                  setValues={setValues}
                  options={options}
                  dataChannelId={dataChannelId}
                  scaledUnitsText={scaledUnitsText}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
        {!isAdvancedCalibrationBoxOpen && (
          <Grid item xs={12}>
            <Divider />
          </Grid>
        )}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t(
                  'ui.datachannel.readingDisplayOptions',
                  'Reading Display Options'
                )}
              </PageSubHeader>
            </Grid>
            {!values.isTankDimensionsSet && (
              <Grid item xs={12}>
                <Field
                  component={CheckboxWithLabel}
                  id="setReadingDisplayOptions-input"
                  name="setReadingDisplayOptions"
                  type="checkbox"
                  Label={{
                    label: t(
                      'ui.datachannel.setReadingDisplayOptions',
                      'Set Reading Display Options'
                    ),
                  }}
                />
              </Grid>
            )}
            {(values.isTankDimensionsSet ||
              values.setReadingDisplayOptions) && (
              <>
                <Grid item xs={12}>
                  <Field
                    id="displayUnits-input"
                    name="displayUnits"
                    component={CustomTextField}
                    label={t('ui.datachannel.displayunits', 'Display Units')}
                    select
                    SelectProps={{ displayEmpty: true }}
                    onChangeBlocking={
                      ENABLE_UNIT_CONVERSION_DIALOG_FEATURE
                        ? handleDisplayUnitOnChangeBlocking
                        : undefined
                    }
                  >
                    <MenuItem value="">
                      <SelectItem />
                    </MenuItem>

                    {displayUnitsOptions?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Field
                    id="displayMaxProductHeight-input"
                    type="number"
                    name="displayMaxProductHeight"
                    component={CustomTextField}
                    label={getLabelWithUnits(
                      t(
                        'ui.datachannel.displayMaxProductHeight',
                        'Display Max Product Height'
                      ),
                      displayUnitsText
                    )}
                  />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <Field
                    id="displayDecimalPlaces-input"
                    type="number"
                    name="displayDecimalPlaces"
                    component={CustomTextField}
                    label={t(
                      'ui.datachannel.displayDecimalPlaces',
                      'Display Decimal Places'
                    )}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t('ui.datachannel.graphSettings', 'Graph Settings')}
              </PageSubHeader>
            </Grid>
            <Grid item xs={12}>
              <Field
                id="graphYAxisScaleId-input"
                name="graphYAxisScaleId"
                component={CustomTextField}
                label={t(
                  'ui.datachannel.graphYAxisMinAndMax',
                  'Graph Y-Axis Min and Max'
                )}
                select
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="" disabled>
                  <SelectItem />
                </MenuItem>
                {options?.yAxisScaleList?.map((scale) => (
                  <MenuItem
                    key={scale.graphYAxisScaleId}
                    value={scale.graphYAxisScaleId}
                  >
                    {scale.description}
                  </MenuItem>
                ))}
              </Field>
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                id="graphMin-input"
                type="number"
                name="graphMin"
                component={CustomTextField}
                label={getLabelWithUnits(
                  t('ui.datachannel.graphmin', 'Graph Min'),
                  displayUnitsText
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Field
                id="graphMax-input"
                type="number"
                name="graphMax"
                component={CustomTextField}
                label={getLabelWithUnits(
                  t('ui.datachannel.graphmax', 'Graph Max'),
                  displayUnitsText
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Field
                component={CheckboxWithLabel}
                id="isDisplayGapsInGraph-input"
                name="isDisplayGapsInGraph"
                type="checkbox"
                Label={{
                  label: t(
                    'ui.datachannel.displayGapsInGraph',
                    'Display Gaps in Graph'
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t(
                  'ui.datachannel.deliverySchedulingOptions',
                  'Delivery Scheduling Options'
                )}
              </PageSubHeader>
            </Grid>
            {isForecastRelevant && (
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      id="forecastMode-input"
                      component={CustomTextField}
                      label={t('ui.datachannel.forecastmode', 'Forecast Mode')}
                      select
                      name="forecastMode"
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <SelectItem />
                      </MenuItem>
                      {forecastModeTypeOptions?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  {showUsageRateField && (
                    <Grid item xs={6}>
                      <Field
                        id="manualUsageRate-input"
                        name="manualUsageRate"
                        type="number"
                        component={CustomTextField}
                        label={usageRateText}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Grid container>
                      <Grid item xs={12}>
                        <Field
                          component={CheckboxWithLabel}
                          id="showHighLowForecast-input"
                          name="showHighLowForecast"
                          type="checkbox"
                          Label={{
                            label: t(
                              'ui.datachannel.showhighlowforecast',
                              'Show High/Low Forecast'
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          component={CheckboxWithLabel}
                          id="showScheduledDeliveriesInforecast-input"
                          name="showScheduledDeliveriesInforecast"
                          type="checkbox"
                          Label={{
                            label: t(
                              'ui.datachannel.isdeliveryforecasted',
                              'Show Scheduled Deliveries in Forecast'
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={6}>
                  <Field
                    id="maxDeliverQuantity-input"
                    name="maxDeliverQuantity"
                    type="number"
                    component={CustomTextField}
                    label={
                      displayUnitsText
                        ? t(
                            'ui.datachannel.maxdeliverquantity',
                            'Max Delivery Quantity ({{unit}})',
                            {
                              unit: displayUnitsText,
                            }
                          )
                        : t(
                            'ui.datachannel.maxdeliverquantitywithoutunit',
                            'Max Delivery Quantity'
                          )
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {options?.isIntegrationFeedEnabled && (
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <PageSubHeader dense>
                  {t(
                    'ui.common.integrationParameters',
                    'Integration Parameters (FTP)'
                  )}
                </PageSubHeader>
              </Grid>
              <Grid item xs={12}>
                <IntegrationParameters
                  values={values}
                  domains={options.domainIntegrationInfo}
                  profiles={[
                    {
                      enableIntegrationFieldName: 'enableIntegration1',
                      integrationDomainIdFieldName: 'integration1DomainId',
                      autoGenerateIntegrationIdFieldName:
                        'autoGenerateIntegration1Id',
                      integrationIdFieldName: 'integration1Id',
                    },
                    {
                      enableIntegrationFieldName: 'enableIntegration2',
                      integrationDomainIdFieldName: 'integration2DomainId',
                      autoGenerateIntegrationIdFieldName:
                        'autoGenerateIntegration2Id',
                      integrationIdFieldName: 'integration2Id',
                    },
                  ]}
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default GeneralTab;
