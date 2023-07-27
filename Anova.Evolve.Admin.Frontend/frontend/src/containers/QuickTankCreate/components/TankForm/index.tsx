/* eslint-disable indent, react/jsx-indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelDataSourceType,
  EditAssetCustomPropertyItem,
  EditTankDimension,
  EventInventoryStatusType,
  EventRuleGroupInfo,
  EventRuleInfo,
  EvolveDataChannelTemplateDetail,
  EvolveRetrieveQuickAssetCreateBulkTankResponse,
  IntegrationProfileType,
  ProductDetail,
  ProductNameInfo,
  PublishedDataChannelSearchInfo,
  RetrieveSiteEditComponentsResult,
  RTUChannelUsageInfo,
  RTUDeviceInfo,
  SiteInfoRecord,
  SourceDataChannelDefaultsInfo,
  TankDimensionDetail,
  TankType,
  UnitType,
  UserPermissionType,
} from 'api/admin/api';
import { geocode, parseLatLongCoordinates } from 'api/mapbox/api';
import { isLatitudeValid, isLongitudeValid } from 'api/mapbox/helpers';
import Alert from 'components/Alert';
import CloseIconButton from 'components/buttons/CloseIconButton';
import CustomProperties from 'components/CustomProperties';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import Autocomplete from 'components/forms/form-fields/Autocomplete';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import ProductAutocompleteLegacy from 'components/forms/form-fields/ProductAutocompleteLegacy';
import PublishedCommentsAutocomplete from 'components/forms/form-fields/PublishedCommentsAutocomplete';
import RTUAutoCompleteLegacy from 'components/forms/form-fields/RTUAutoCompleteLegacy';
import SiteAutocomplete from 'components/forms/form-fields/SiteAutocomplete';
import TankDimensionAutocompleteLegacy from 'components/forms/form-fields/TankDimensionAutocompleteLegacy';
import FormikEffect from 'components/forms/FormikEffect';
import ProductLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/ProductLabelWithEditorButtons';
import SiteLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/SiteLabelWithEditorButtons';
import TankDimensionLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/TankDimensionLabelWithEditorButtons';
import FullPageLoadingOverlay from 'components/FullPageLoadingOverlay';
import IntegrationParameters from 'components/IntegrationParameters';
import PageSubHeader from 'components/PageSubHeader';
import SiteLocationMap from 'components/SiteLocationMap';
import ProductEditor from 'containers/ProductEditor';
import SiteEditor from 'containers/SiteEditor';
import TankDimensionEditor from 'containers/TankDimensionEditor';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DomainDetailWithTheme } from 'redux-app/modules/app/types';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { fadedTextColor, gray25 } from 'styles/colours';
import { AccessType } from 'types';
import { EMPTY_GUID } from 'utils/api/constants';
import {
  customPropertiesValidationSchema,
  massageCustomProperties,
} from 'utils/api/custom-properties';
import {
  canAddBatteryChannelForRtu,
  canAddRtuTemperatureChannelForRtu,
} from 'utils/api/helpers';
import { formatAddressInOneLine } from 'utils/format/address';
import {
  getTankDimensionTypeOptions,
  getUnitTypeOptions,
} from 'utils/i18n/enum-to-text';
import { getTankDimensionImage } from 'utils/ui/helpers';
import * as Yup from 'yup';
import FormChangeEffect from '../FormChangeEffect';
import { Values } from './types';

const StyledInputField = styled(InputLabel)`
  color: ${(props) => props.theme.palette.text.primary};
  padding: 6px 0 6px 0;
  font-weight: 500;
`;

const StyledTypography = styled(Typography)`
  color: ${(props) => props.theme.palette.text.primary};
`;

const fieldIsRequired = (t: TFunction, field: string) =>
  t('validate.common.isrequired', '{{field}} is required.', { field });
const fieldMaxLength = (t: TFunction) => ({ max }: { max: number }) =>
  t(
    'validate.customproperties.greaterthanmaxlength',
    `Input is beyond maximum length of {{max}}.`,
    { max }
  );

const isChannelValid = (
  dataSource: DataChannelDataSourceType,
  levelChannelId?: string | null,
  pressureChannelId?: string | null
) => {
  const isDataSourceRtu = dataSource === DataChannelDataSourceType.RTU;

  const areChannelsSelectedAndEqivalent =
    pressureChannelId && levelChannelId && pressureChannelId === levelChannelId;

  return !isDataSourceRtu || !areChannelsSelectedAndEqivalent;
};

interface ExternalFormData {
  levelSensorOptions?: EvolveDataChannelTemplateDetail[];
}

const buildValidationSchema = (
  t: TFunction,
  externalFormData: ExternalFormData,
  translationTexts: Record<string, string>
) => {
  const { levelSensorOptions } = externalFormData;

  const requiredChannelText = t(
    'validate.datachannel.rtuchannelrequired',
    'If the RTU is set than the Channel is required.'
  );

  const requiredTankTypeText = t(
    'validate.datachannel.tanktyperequiredcannotsetbesettonone',
    'Tank Type is required and cannot be set to none.'
  );

  const uniqueRtuChannelText = t(
    'validate.datachannel.rtuchannelalreadyinuse',
    'RTU Channel already in use by another Data Channel that is in this Asset.'
  );

  return Yup.object().shape({
    description: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.descriptionText))
      .required(fieldIsRequired(t, translationTexts.descriptionText))
      .max(80, fieldMaxLength(t)),
    integrationId: Yup.string().max(80, fieldMaxLength(t)),
    technician: Yup.string().max(80, fieldMaxLength(t)),
    notes: Yup.string().max(1000, fieldMaxLength(t)),
    siteId: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.siteText))
      .required(fieldIsRequired(t, translationTexts.siteText)),
    levelDataChannelTemplateId: Yup.mixed().when('dataSource', {
      is: (dataSource) => dataSource === DataChannelDataSourceType.RTU,
      then: Yup.string()
        .typeError(fieldIsRequired(t, translationTexts.levelSensorText))
        .required(fieldIsRequired(t, translationTexts.levelSensorText)),
      otherwise: Yup.string().nullable(),
    }),
    rtuId: Yup.mixed().when('dataSource', {
      is: (dataSource) => dataSource === DataChannelDataSourceType.RTU,
      then: Yup.string()
        .typeError(fieldIsRequired(t, translationTexts.rtuText))
        .required(fieldIsRequired(t, translationTexts.rtuText)),
      otherwise: Yup.string().nullable(),
    }),
    sourceDataChannelId: Yup.mixed().when('dataSource', {
      is: (dataSource) =>
        dataSource === DataChannelDataSourceType.PublishedDataChannel,
      then: Yup.string()
        .typeError(fieldIsRequired(t, translationTexts.sourceDataChannelText))
        .required(fieldIsRequired(t, translationTexts.sourceDataChannelText)),
      otherwise: Yup.string().nullable(),
    }),
    levelRtuChannelId: Yup.mixed().when('rtuId', {
      is: (rtuId) => !!rtuId,
      then: Yup.string()
        .typeError(requiredChannelText)
        .required(requiredChannelText)
        .test(
          'levelRtuChannelId-different-from-pressureRtuChannelId',
          uniqueRtuChannelText,
          function isValid(levelRtuChannelId) {
            const { dataSource, pressureRtuChannelId } = this.parent;
            return isChannelValid(
              dataSource,
              levelRtuChannelId,
              pressureRtuChannelId
            );
          }
        ),
      otherwise: Yup.string().nullable(),
    }),

    pressureRtuChannelId: Yup.string().test(
      'pressureRtuChannelId-different-from-levelRtuChannelId',
      uniqueRtuChannelText,
      function isValid(pressureRtuChannelId) {
        const { dataSource, levelRtuChannelId } = this.parent;
        return isChannelValid(
          dataSource,
          levelRtuChannelId,
          pressureRtuChannelId
        );
      }
    ),
    tankType: Yup.string().test(
      'tankType-required-when-relevant',
      requiredTankTypeText,
      function isValid(tankType) {
        const { dataSource, levelDataChannelTemplateId } = this.parent;

        const selectedLevelSensor = levelSensorOptions?.find(
          (option) =>
            option.dataChannelTemplateId === levelDataChannelTemplateId
        );

        if (
          dataSource !== DataChannelDataSourceType.RTU ||
          !selectedLevelSensor?.isTankRelevant
        ) {
          return true;
        }

        return (
          dataSource === DataChannelDataSourceType.RTU &&
          selectedLevelSensor?.isTankRelevant &&
          !!Number(tankType) &&
          Number(tankType) !== TankType.None
        );
      }
    ),
    tankDimensionId: Yup.string().test(
      'tankDimensionId-required-when-relevant',
      fieldIsRequired(t, translationTexts.tankDimensionText),
      function isValid(tankDimensionId) {
        const {
          dataSource,
          levelDataChannelTemplateId,
          isTankDimensionsSet,
        } = this.parent;

        const selectedLevelSensor = levelSensorOptions?.find(
          (option) =>
            option.dataChannelTemplateId === levelDataChannelTemplateId
        );

        if (
          dataSource !== DataChannelDataSourceType.RTU ||
          !isTankDimensionsSet ||
          !selectedLevelSensor?.isTankRelevant
        ) {
          return true;
        }

        return (
          dataSource === DataChannelDataSourceType.RTU &&
          isTankDimensionsSet &&
          selectedLevelSensor?.isTankRelevant &&
          !!tankDimensionId
        );
      }
    ),
    productId: Yup.string().test(
      'productId-required-when-relevant',
      fieldIsRequired(t, translationTexts.productText),
      function isValid(productId) {
        const {
          dataSource,
          levelDataChannelTemplateId,
          isTankDimensionsSet,
        } = this.parent;

        const selectedLevelSensor = levelSensorOptions?.find(
          (option) =>
            option.dataChannelTemplateId === levelDataChannelTemplateId
        );

        if (
          dataSource !== DataChannelDataSourceType.RTU ||
          !isTankDimensionsSet ||
          !selectedLevelSensor?.isProductRelevant
        ) {
          return true;
        }

        return (
          dataSource === DataChannelDataSourceType.RTU &&
          isTankDimensionsSet &&
          selectedLevelSensor?.isProductRelevant &&
          !!productId
        );
      }
    ),
    customProperties: customPropertiesValidationSchema(t),

    levelIntegrationDetails: Yup.object().shape({
      integrationId: Yup.string().max(128, fieldMaxLength(t)),
    }),
    pressureIntegrationDetails: Yup.object().shape({
      integrationId: Yup.string().max(128, fieldMaxLength(t)),
    }),
    batteryIntegrationDetails: Yup.object().shape({
      integrationId: Yup.string().max(128, fieldMaxLength(t)),
    }),
  });
};

const StyledTankBox = styled(Box)`
  svg {
    width: 100%;
  }
`;

const HR = styled('div')`
  width: 100%;
  border-top: 1px solid ${gray25};
  margin: 16px 0;
`;

const buildInitialIntegrationDetails = () => ({
  enableIntegration: false,
  shouldAutoGenerate: false,
  integrationId: '',
});

interface FormatInitialValuesOptions {
  customProperties?: EditAssetCustomPropertyItem[] | null;
}

const formatInitialValues = (
  values: any,
  { customProperties }: FormatInitialValuesOptions = {}
) => {
  const formattedCustomProperties = massageCustomProperties(customProperties);

  return {
    ...values,
    customProperties: formattedCustomProperties,
    // NOTE: Values need to be in Formik's initialValues in order to be
    // "touched" when submitting the form. If they're not "touched" then errors
    // wont appear on these fields (ex: productId and tankDimensionId)
    tankType: TankType.VerticalWith2To1EllipsoidalEnds,
    dataSource: DataChannelDataSourceType.RTU,
    description: '',
    siteId: '',
    productId: '',
    tankDimensionId: '',
    rtuId: '',
    technician: '',
    notes: '',
    levelDataChannelTemplateId: '',
    levelRtuChannelId: '',
    pressureDataChannelTemplateId: '',
    pressureRtuChannelId: '',
    displayUnits: '',

    sourceDataChannelId: '',
    isTankDimensionsSet: false,
    addBatteryChannel: false,
    addRtuTemperatureChannel: false,

    // Event Rules
    eventRuleGroupId: '',
    reorderEventValue: '',
    criticalEventValue: '',

    // Integration parameters
    integrationId: '',
    integrationDomainId: '',
    levelIntegrationDetails: buildInitialIntegrationDetails(),
    pressureIntegrationDetails: buildInitialIntegrationDetails(),
    batteryIntegrationDetails: buildInitialIntegrationDetails(),
  };
};

interface MappedLatLong {
  lat: number;
  long: number;
}

interface Props {
  initialValues?: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  editDetails?: EvolveRetrieveQuickAssetCreateBulkTankResponse | null;
  domain?: DomainDetailWithTheme | null;
  userId?: string;
  customProperties?: EditAssetCustomPropertyItem[] | null;
  eventRuleGroups?: EventRuleGroupInfo[] | null;
  pressureSensorOptions?: EvolveDataChannelTemplateDetail[];
  levelSensorOptions?: EvolveDataChannelTemplateDetail[];
  volumetricUnitTypes?: UnitType[] | null;
  nonVolumetricUnitTypes?: UnitType[] | null;
  tankDimensionDetails?: TankDimensionDetail | null;
  selectedRtu: RTUDeviceInfo | null;
  rtuChannelsFromRtu?: RTUChannelUsageInfo[] | null;
  unitTypeTextToEnumMapping?: Record<string, UnitType>;
  setSelectedRtu: React.Dispatch<React.SetStateAction<RTUDeviceInfo | null>>;
  setRtuChannelsFromRtu: React.Dispatch<
    React.SetStateAction<RTUChannelUsageInfo[] | null | undefined>
  >;
  setTankDimensionDetails: React.Dispatch<
    React.SetStateAction<TankDimensionDetail | null | undefined>
  >;
  setProductDetails: React.Dispatch<
    React.SetStateAction<ProductDetail | null | undefined>
  >;
  setPublishedCommentDetails: React.Dispatch<
    React.SetStateAction<PublishedDataChannelSearchInfo | null>
  >;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
}

const ObjectForm = ({
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
  editDetails,
  domain,
  userId,
  eventRuleGroups,
  customProperties,
  pressureSensorOptions,
  levelSensorOptions,
  volumetricUnitTypes,
  nonVolumetricUnitTypes,
  tankDimensionDetails,
  unitTypeTextToEnumMapping,
  selectedRtu,
  setSelectedRtu,
  setTankDimensionDetails,
  setProductDetails,
  setPublishedCommentDetails,
}: Props) => {
  const { t } = useTranslation();

  const hasPermission = useSelector(selectHasPermission);
  const canReadTankDimension = hasPermission(
    UserPermissionType.TankDimensionAccess,
    AccessType.Read
  );

  const [mappedLatLong, setMappedLatLong] = useState<MappedLatLong>();

  const [eventRuleGroupInfoDetails, setEventRuleGroupInfoDetails] = useState<
    EventRuleInfo[] | null | undefined
  >();
  const [siteDetails, setSiteDetails] = useState<
    RetrieveSiteEditComponentsResult | null | undefined
  >();
  const [rtuChannelsFromRtu, setRtuChannelsFromRtu] = useState<
    RTUChannelUsageInfo[] | null | undefined
  >();

  const [
    selectedPublishedComment,
    setSelectedPublishedComment,
  ] = useState<PublishedDataChannelSearchInfo | null>(null);

  const [sourceDataChannelDetails, setSourceDataChannelDetails] = useState<
    SourceDataChannelDefaultsInfo | null | undefined
  >(null);

  // Site Drawer
  const [selectedSite, setSelectedSite] = useState<SiteInfoRecord | null>();
  const [editingSiteId, setEditingSiteId] = useState<string | null>();
  const [isSiteDrawerOpen, setIsSiteDrawerOpen] = useState(false);

  // Product Drawer
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

  const formattedInitialValues = formatInitialValues(initialValues || {}, {
    customProperties,
  });

  const descriptionText = t('ui.common.description', 'Description');
  const siteText = t('ui.common.site', 'Site');
  const levelSensorText = t('ui.asset.levelsensor', 'Level Sensor');
  const tankDimensionText = t('ui.common.tankdimension', 'Tank Dimension');
  const productText = t('ui.common.product', 'Product');
  const rtuText = t('ui.common.rtu', 'RTU');
  const sourceDataChannelText = t(
    'ui.datachannel.sourcedatachannel',
    'Source Data Channel'
  );

  const validationSchema = useMemo(
    () =>
      buildValidationSchema(
        t,
        { levelSensorOptions },
        {
          descriptionText,
          siteText,
          levelSensorText,
          tankDimensionText,
          productText,
          rtuText,
          sourceDataChannelText,
        }
      ),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [t, levelSensorOptions]
  );

  const typeOptions = getTankDimensionTypeOptions(t);
  const volumetricUnitTypeOptions = getUnitTypeOptions(t, volumetricUnitTypes);
  const nonVolumetricUnitTypeOptions = getUnitTypeOptions(
    t,
    nonVolumetricUnitTypes
  );

  // Retrieve lat/long co-ordinates from the selected site to render a MapBox
  // Map
  useEffect(() => {
    const siteEditObject = siteDetails?.editObject;
    if (!siteEditObject) {
      return void setMappedLatLong(undefined);
    }

    const { address1, city, state, country } = siteEditObject;
    const joinedAddress = formatAddressInOneLine(
      address1,
      city,
      state,
      country
    );

    const { latitude, longitude } = siteEditObject;
    if (isLatitudeValid(latitude) && isLongitudeValid(longitude)) {
      setMappedLatLong({ lat: latitude!, long: longitude! });
    } else {
      geocode(joinedAddress)
        .then(parseLatLongCoordinates)
        .then((coordinates) => {
          if (coordinates) {
            setMappedLatLong({
              lat: coordinates.lat,
              long: coordinates.long,
            });
          }
        })
        .catch(() => {
          setMappedLatLong(undefined);
        });
    }
  }, [siteDetails?.editObject?.siteId]);

  const toggleSiteDrawer = (open: boolean, options?: any) => (
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

    setIsSiteDrawerOpen(open);

    if (open && options) {
      setEditingSiteId(options?.siteId);
    }
  };

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

  if (!editDetails) {
    return null;
  }

  const domainId = domain?.domainId;
  const isDomainProfileAPCI =
    domain?.integrationProfile === IntegrationProfileType.APCI;

  const mappedLatitude = mappedLatLong?.lat;
  const mappedLongitude = mappedLatLong?.long;

  const showAddBatteryChannelCheckbox = canAddBatteryChannelForRtu(selectedRtu);
  const showAddRtuTemperatureChannelCheckbox = canAddRtuTemperatureChannelForRtu(
    selectedRtu
  );

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, setFieldValue }) => {
        const unitTypeOptions = values.isTankDimensionsSet
          ? volumetricUnitTypeOptions
          : nonVolumetricUnitTypeOptions;
        const selectedUnitType = unitTypeOptions.find(
          (type) => type.value === String(values.displayUnits)
        );
        const selectedLevelSensor = levelSensorOptions?.find(
          (option) =>
            option.dataChannelTemplateId === values.levelDataChannelTemplateId
        );
        const scaledUnitTypeOption = volumetricUnitTypeOptions.find(
          // TODO: This could be an issue in any language other than English
          // since the back-end is returning selectedLevelSensor?.scaledUnits
          // in English, ex: "Ins WC" whereas type.label COULD have a different
          // label in a different language. If the front-end translates any of
          // the unit types, then the label may not match here.
          (type) => type.label === selectedLevelSensor?.scaledUnits
        );

        const displayUnitsSuffix = selectedUnitType
          ? ` (${selectedUnitType.label})`
          : '';
        const scaledUnitsSuffix = values.isTankDimensionsSet
          ? displayUnitsSuffix
          : selectedLevelSensor
          ? ` (${selectedLevelSensor.scaledUnits})`
          : '';

        const tankTypeForImage = values.isTankDimensionsSet
          ? tankDimensionDetails?.tankType || TankType.None
          : values.tankType || TankType.None;

        const showPressureDataChannel =
          values.dataSource === DataChannelDataSourceType.RTU &&
          !!values.pressureDataChannelTemplateId;
        const showBatteryDataChannel =
          values.dataSource === DataChannelDataSourceType.RTU &&
          values.addBatteryChannel;

        const displayUnitsField = (
          <Field
            id="displayUnits-input"
            component={CustomTextField}
            select
            name="displayUnits"
            label={t('ui.datachannel.displayunits', 'Display Units')}
            SelectProps={{ displayEmpty: true }}
          >
            <MenuItem value="">{t('ui.common.none', 'None')}</MenuItem>
            {unitTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field>
        );

        return (
          <>
            {isSubmitting && <FullPageLoadingOverlay />}
            <FormikEffect
              onChange={handleFormChange}
              isValid={isValid}
              restoreTouchedFields={restoreTouchedFields}
              restoreInitialValues={restoreInitialValues}
            />

            {/*
            Detect changes in form fields to make API calls + store their
            responses
          */}
            <FormChangeEffect
              setEventRuleGroupInfoDetails={setEventRuleGroupInfoDetails}
              setRtuChannelsFromRtu={setRtuChannelsFromRtu}
              setTankDimensionDetails={setTankDimensionDetails}
              setProductDetails={setProductDetails}
              setFieldValue={setFieldValue}
              selectedRtu={selectedRtu}
              rtuChannelsFromRtu={rtuChannelsFromRtu}
              integrationDomains={editDetails.integrationDomain}
              selectedLevelSensor={selectedLevelSensor}
              scaledUnitTypeOption={scaledUnitTypeOption}
              sourceDataChannelDetails={sourceDataChannelDetails}
              unitTypeTextToEnumMapping={unitTypeTextToEnumMapping}
              setSourceDataChannelDetails={setSourceDataChannelDetails}
              setSiteDetails={setSiteDetails}
              values={values}
            />

            <Form>
              <Grid container spacing={3}>
                {submissionError && (
                  <Grid item xs={12}>
                    <Fade in={!!submissionError} unmountOnExit>
                      <Grid item xs={12}>
                        <Alert severity="error">
                          {t(
                            'ui.quicktankcreate.saveError',
                            'Unable to create a Tank'
                          )}
                        </Alert>
                      </Grid>
                    </Fade>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t('ui.common.generalinfo', 'General Information')}
                  </PageSubHeader>
                </Grid>
                <Grid item xs={12} md={6}>
                  <EditorBox>
                    <Grid container direction="column" spacing={3}>
                      <Grid item xs={12}>
                        <Field
                          id="description-input"
                          component={CustomTextField}
                          name="description"
                          label={descriptionText}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          id="technician-input"
                          component={CustomTextField}
                          name="technician"
                          label={t('ui.asset.technician', 'Technician')}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        {!isDomainProfileAPCI && (
                          <>
                            <Drawer
                              anchor="right"
                              open={isSiteDrawerOpen}
                              // @ts-ignore
                              onClose={toggleSiteDrawer(false)}
                              variant="temporary"
                              disableBackdropClick
                            >
                              <DrawerContent>
                                <SiteEditor
                                  editingSiteId={editingSiteId}
                                  isInlineForm
                                  headerNavButton={
                                    <CloseIconButton
                                      onClick={toggleSiteDrawer(false)}
                                    />
                                  }
                                  saveCallback={(response: any) => {
                                    const site =
                                      response?.saveSiteResult?.editObject;

                                    setSelectedSite(site);
                                    setEditingSiteId(site?.siteId);
                                  }}
                                  saveAndExitCallback={(response: any) => {
                                    const site =
                                      response?.saveSiteResult?.editObject;

                                    setSelectedSite(site);
                                    setEditingSiteId(site?.siteId);
                                    toggleSiteDrawer(false)();
                                  }}
                                />
                              </DrawerContent>
                            </Drawer>
                            <Field
                              id="siteId-input"
                              component={SiteAutocomplete}
                              name="siteId"
                              required
                              domainId={domainId}
                              userId={userId}
                              selectedOption={selectedSite}
                              textFieldProps={{
                                placeholder: t(
                                  'ui.common.enterSearchCriteria',
                                  'Enter Search Criteria...'
                                ),
                                label: (
                                  <SiteLabelWithEditorButtons
                                    isEditButtonDisabled={
                                      !values.siteId ||
                                      values.siteId === EMPTY_GUID
                                    }
                                    onClickEdit={toggleSiteDrawer(true, {
                                      siteId: values.siteId,
                                    })}
                                    onClickAdd={toggleSiteDrawer(true, {
                                      siteId: null,
                                    })}
                                  />
                                ),
                              }}
                            />
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </EditorBox>
                </Grid>

                <Grid item xs={12} md={6}>
                  <SiteLocationMap
                    latitude={mappedLatitude}
                    longitude={mappedLongitude}
                    hasSelectedSite={!!siteDetails}
                  />
                </Grid>
                <Grid item xs={12}>
                  <HR />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item xs={12}>
                      <Grid container spacing={4} alignItems="center">
                        <Grid item>
                          <PageSubHeader dense>
                            {t('ui.common.tankdetails', 'Tank Details')}
                          </PageSubHeader>
                        </Grid>
                        {canReadTankDimension && (
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

                    <Grid item xs={12}>
                      <EditorBox>
                        <Grid container spacing={3}>
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
                                          onClick={toggleTankDimensionDrawer(
                                            false
                                          )}
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
                                  required
                                  domainId={domainId}
                                  selectedOption={
                                    selectedTankDimension ||
                                    tankDimensionDetails
                                  }
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
                                            tankDimensionId:
                                              values.tankDimensionId,
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
                            ) : !isDomainProfileAPCI ? (
                              <Field
                                id="tankType-input"
                                component={CustomTextField}
                                label={t(
                                  'ui.datachannel.tanktype',
                                  'Tank Type'
                                )}
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
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Field>
                            ) : null}
                          </Grid>
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
                            <StyledTankBox mt={5} textAlign="center">
                              {getTankDimensionImage(tankTypeForImage)}
                            </StyledTankBox>
                          </Grid>
                        </Grid>
                      </EditorBox>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item xs={12}>
                      <PageSubHeader dense>
                        {t(
                          'ui.quicktankcreate.tankmonitoring',
                          'Tank Monitoring'
                        )}
                      </PageSubHeader>
                    </Grid>

                    <Grid item xs={12}>
                      <EditorBox>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <Field
                              component={CustomTextField}
                              select
                              name="dataSource"
                              label={t(
                                'ui.datachannel.datasource',
                                'Data Source'
                              )}
                            >
                              {[
                                {
                                  label: t('ui.common.rtu', 'RTU'),
                                  value: DataChannelDataSourceType.RTU,
                                },
                                {
                                  label: t(
                                    'enum.datachanneldatasourcetype.publisheddatachannel',
                                    'Published Data Channel'
                                  ),
                                  value:
                                    DataChannelDataSourceType.PublishedDataChannel,
                                },
                              ].map((option) => (
                                <MenuItem
                                  key={option.label}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Field>
                          </Grid>

                          {values.dataSource ===
                          DataChannelDataSourceType.RTU ? (
                            <>
                              <Grid item xs={12}>
                                <Field
                                  id="rtuId-input"
                                  component={RTUAutoCompleteLegacy}
                                  name="rtuId"
                                  domainId={domainId}
                                  textFieldProps={{
                                    placeholder: t(
                                      'ui.common.enterSearchCriteria',
                                      'Enter Search Criteria...'
                                    ),
                                    label: rtuText,
                                  }}
                                  selectedOption={selectedRtu}
                                  onChange={(
                                    selectedOption: RTUDeviceInfo | null
                                  ) => {
                                    setSelectedRtu(selectedOption);

                                    // Always reset the Level Channel + Pressure Channel
                                    // fields when changing the RTUs since the selected RTU
                                    // can have different channels
                                    setFieldValue('levelRtuChannelId', '');
                                    setFieldValue('pressureRtuChannelId', '');
                                  }}
                                />
                              </Grid>

                              <Grid item xs={12}>
                                <Field
                                  id="levelDataChannelTemplateId-input"
                                  component={Autocomplete}
                                  name="levelDataChannelTemplateId"
                                  textFieldProps={{
                                    placeholder: t(
                                      'ui.common.select',
                                      'Select'
                                    ),
                                    label: levelSensorText,
                                  }}
                                  options={levelSensorOptions}
                                  getOptionLabel={(
                                    option: EvolveDataChannelTemplateDetail
                                  ) => option.description}
                                  isValueSelected={(
                                    option: EvolveDataChannelTemplateDetail | null,
                                    currentValue: string
                                  ) => {
                                    return (
                                      (option?.dataChannelTemplateId || '') ===
                                      currentValue
                                    );
                                  }}
                                  getSelectedValue={(
                                    newValue: EvolveDataChannelTemplateDetail | null
                                  ) => {
                                    return (
                                      newValue?.dataChannelTemplateId || ''
                                    );
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <Field
                                  id="levelRtuChannelId-input"
                                  component={CustomTextField}
                                  select
                                  name="levelRtuChannelId"
                                  label={t(
                                    'ui.asset.levelchannel',
                                    'Level Channel'
                                  )}
                                  SelectProps={{ displayEmpty: true }}
                                >
                                  <MenuItem value="">
                                    <span style={{ color: fadedTextColor }}>
                                      {t('ui.common.select', 'Select')}
                                    </span>
                                  </MenuItem>
                                  {selectedRtu &&
                                    rtuChannelsFromRtu?.map((option) => (
                                      <MenuItem
                                        key={option.rtuChannelId}
                                        value={option.rtuChannelId}
                                      >
                                        {option.channelNumber}&nbsp;
                                        <em>
                                          {option.dataChannelCount
                                            ? t(
                                                'ui.datachannel.channelinuse',
                                                '(in use)'
                                              )
                                            : t(
                                                'ui.datachannel.channelnotinuse',
                                                '(not in use)'
                                              )}
                                        </em>
                                      </MenuItem>
                                    ))}
                                </Field>
                              </Grid>
                              <Grid item xs={12}>
                                <Field
                                  id="pressureDataChannelTemplateId-input"
                                  component={Autocomplete}
                                  name="pressureDataChannelTemplateId"
                                  textFieldProps={{
                                    placeholder: t(
                                      'ui.common.select',
                                      'Select'
                                    ),
                                    label: t(
                                      'ui.asset.pressuresensor',
                                      'Pressure Sensor'
                                    ),
                                  }}
                                  options={pressureSensorOptions}
                                  getOptionLabel={(
                                    option: EvolveDataChannelTemplateDetail
                                  ) => option.description}
                                  isValueSelected={(
                                    option: EvolveDataChannelTemplateDetail | null,
                                    currentValue: string
                                  ) => {
                                    return (
                                      (option?.dataChannelTemplateId || '') ===
                                      currentValue
                                    );
                                  }}
                                  getSelectedValue={(
                                    newValue: EvolveDataChannelTemplateDetail | null
                                  ) => {
                                    return (
                                      newValue?.dataChannelTemplateId || ''
                                    );
                                  }}
                                />
                              </Grid>
                              {values.pressureDataChannelTemplateId && (
                                <Grid item xs={12}>
                                  <Field
                                    id="pressureRtuChannelId-input"
                                    component={CustomTextField}
                                    select
                                    name="pressureRtuChannelId"
                                    label={t(
                                      'ui.asset.pressurechannel',
                                      'Pressure Channel'
                                    )}
                                    SelectProps={{ displayEmpty: true }}
                                  >
                                    <MenuItem value="">
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
                                            ? t(
                                                'ui.datachannel.channelinuse',
                                                '(in use)'
                                              )
                                            : t(
                                                'ui.datachannel.channelnotinuse',
                                                '(not in use)'
                                              )}
                                        </em>
                                      </MenuItem>
                                    ))}
                                  </Field>
                                </Grid>
                              )}
                              {showAddBatteryChannelCheckbox && (
                                <Grid item xs={12}>
                                  <Field
                                    id="addBatteryChannel-input"
                                    component={CheckboxWithLabel}
                                    name="addBatteryChannel"
                                    Label={{
                                      label: t(
                                        'ui.asset.addbatterychannel',
                                        'Add Battery Channel'
                                      ),
                                    }}
                                    type="checkbox"
                                  />
                                </Grid>
                              )}
                              {showAddRtuTemperatureChannelCheckbox && (
                                <Grid item xs={12}>
                                  <Field
                                    id="addRtuTemperatureChannel-input"
                                    component={CheckboxWithLabel}
                                    name="addRtuTemperatureChannel"
                                    Label={{
                                      label: t(
                                        'ui.asset.addrtutemperaturechannel',
                                        'Add RTU Temperature Channel'
                                      ),
                                    }}
                                    type="checkbox"
                                  />
                                </Grid>
                              )}
                            </>
                          ) : (
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
                                    label: t(
                                      'ui.datachannel.publishedcomments',
                                      'Published Comments'
                                    ),
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
                                  <StyledInputField shrink={false}>
                                    {t(
                                      'ui.datachannel.sourcedomain',
                                      'Source Domain'
                                    )}
                                  </StyledInputField>
                                  <StyledTypography>
                                    {selectedPublishedComment?.sourceDomainName}
                                  </StyledTypography>
                                </Grid>
                              )}
                              {sourceDataChannelDetails?.dataChannelTemplateDescription && (
                                <Grid item xs={12}>
                                  <StyledInputField shrink={false}>
                                    {t('ui.asset.levelsensor', 'Level Sensor')}
                                  </StyledInputField>
                                  <StyledTypography>
                                    {
                                      sourceDataChannelDetails?.dataChannelTemplateDescription
                                    }
                                  </StyledTypography>
                                </Grid>
                              )}
                            </>
                          )}
                        </Grid>
                      </EditorBox>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <HR />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <PageSubHeader dense>
                        {t(
                          'ui.quicktankcreate.levelmonitoring',
                          'Level Monitoring'
                        )}
                      </PageSubHeader>
                    </Grid>

                    <Grid item xs={12}>
                      <EditorBox>
                        <Grid container spacing={3}>
                          {values.isTankDimensionsSet && (
                            <Grid item xs={12} md={6}>
                              {displayUnitsField}
                            </Grid>
                          )}
                          <Grid item xs={12} md={6}>
                            <Field
                              id="levelMonitoringMaxProductHeight-input"
                              component={CustomTextField}
                              type="number"
                              name="levelMonitoringMaxProductHeight"
                              label={`${t(
                                'ui.datachannel.maxproductheight',
                                'Max Product Height'
                              )}${
                                values.isTankDimensionsSet
                                  ? displayUnitsSuffix
                                  : scaledUnitsSuffix
                              }`}
                            />
                          </Grid>
                        </Grid>
                      </EditorBox>
                    </Grid>
                  </Grid>
                </Grid>
                {!values.isTankDimensionsSet && (
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <PageSubHeader dense>
                          {t(
                            'ui.quicktankcreate.levelvolumedetails',
                            'Level Volume/Mass Details'
                          )}
                        </PageSubHeader>
                      </Grid>

                      <Grid item xs={12}>
                        <EditorBox>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              {displayUnitsField}
                            </Grid>
                            {values.displayUnits && (
                              <Grid item xs={12} md={6}>
                                <Field
                                  id="levelVolumeMaxProductHeight-input"
                                  component={CustomTextField}
                                  type="number"
                                  name="levelVolumeMaxProductHeight"
                                  label={`${t(
                                    'ui.datachannel.maxproductheight',
                                    'Max Product Height'
                                  )}${displayUnitsSuffix}`}
                                />
                              </Grid>
                            )}
                          </Grid>
                        </EditorBox>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <HR />
                </Grid>
                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t('ui.common.eventrules', 'Event Rules')}
                  </PageSubHeader>
                </Grid>

                <Grid item xs={12}>
                  <EditorBox>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Grid item xs={12}>
                          <Field
                            id="eventRuleGroupId-input"
                            component={CustomTextField}
                            select
                            name="eventRuleGroupId"
                            label={t(
                              'ui.common.eventrulegroup',
                              'Event Rule Group'
                            )}
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
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {!isDomainProfileAPCI && (
                          <Grid container spacing={4}>
                            {eventRuleGroupInfoDetails?.map((eventRule) => {
                              const statusType = eventRule.inventoryStatusType;
                              if (
                                statusType !==
                                  EventInventoryStatusType.Reorder &&
                                statusType !== EventInventoryStatusType.Critical
                              ) {
                                return null;
                              }

                              const fieldName =
                                statusType === EventInventoryStatusType.Reorder
                                  ? `reorderEventValue`
                                  : `criticalEventValue`;

                              const labelText =
                                statusType === EventInventoryStatusType.Reorder
                                  ? t(
                                      'enum.eventinventorystatustype.reorder',
                                      'Reorder'
                                    )
                                  : t(
                                      'enum.eventinventorystatustype.critical',
                                      'Critical'
                                    );

                              return (
                                <Grid item xs={6} key={fieldName}>
                                  <Field
                                    id={`${fieldName}-input`}
                                    component={CustomTextField}
                                    type="number"
                                    name={fieldName}
                                    label={`${labelText}${scaledUnitsSuffix}`}
                                  />
                                </Grid>
                              );
                            })}
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </EditorBox>
                </Grid>

                {!!customProperties?.length && (
                  <>
                    <Grid item xs={12}>
                      <HR />
                    </Grid>
                    <Grid item xs={12}>
                      <PageSubHeader dense>
                        {t('ui.asset.customproperties', 'Custom Properties')}
                      </PageSubHeader>
                    </Grid>

                    <Grid item xs={12}>
                      <EditorBox>
                        <CustomProperties customProperties={customProperties} />
                      </EditorBox>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <HR />
                </Grid>
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
                    assetIntegrationFieldName="integrationId"
                    domains={editDetails.integrationDomain}
                    selectedDomainId={values.integrationDomainId}
                    dataChannels={[
                      {
                        description: t(
                          'ui.integrationParameters.levelDataChannel',
                          'Level Data Channel'
                        ),
                        fieldName: 'levelIntegrationDetails',
                        shouldAutoGenerate:
                          values.levelIntegrationDetails.shouldAutoGenerate,
                      },
                      {
                        description: t(
                          'ui.integrationParameters.pressureDataChannel',
                          'Pressure Data Channel'
                        ),
                        fieldName: 'pressureIntegrationDetails',
                        shouldAutoGenerate:
                          values.pressureIntegrationDetails?.shouldAutoGenerate,
                        hide: !showPressureDataChannel,
                      },
                      {
                        description: t(
                          'ui.integrationParameters.batteryDataChannel',
                          'Battery Data Channel'
                        ),
                        fieldName: 'batteryIntegrationDetails',
                        shouldAutoGenerate:
                          values.batteryIntegrationDetails?.shouldAutoGenerate,
                        hide: !showBatteryDataChannel,
                      },
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <HR />
                </Grid>
                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t('ui.common.notes', 'Notes')}
                  </PageSubHeader>
                </Grid>
                <Grid item xs={12}>
                  <EditorBox>
                    <Field
                      component={CustomTextField}
                      multiline
                      name="notes"
                      rows={7}
                    />
                  </EditorBox>
                </Grid>
              </Grid>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default ObjectForm;
