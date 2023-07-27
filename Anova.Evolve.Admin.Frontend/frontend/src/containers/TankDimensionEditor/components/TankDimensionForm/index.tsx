import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import {
  EditTankStrapping,
  EvolveGenerateStrappingChartRequest,
  TankType,
  UnitType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import Alert from 'components/Alert';
import Button from 'components/Button';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FormikEffect from 'components/forms/FormikEffect';
import PageSubHeader from 'components/PageSubHeader';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fadedTextColor } from 'styles/colours';
import {
  getTankDimensionTypeOptions,
  getTankDimensionUnitsOfMeasureOptions,
} from 'utils/i18n/enum-to-text';
import { getTankDimensionImage } from 'utils/ui/helpers';
import * as Yup from 'yup';
import StrappingPointsTable from '../StrappingPointsTable';
import { Values } from './types';

const StyledAssetMenuList = styled(MenuList)`
  background: ${(props) => props.theme.palette.background.default};
  outline: 0;
  height: 340px;
  overflow-y: auto;
`;

const StyledTankBox = styled(Box)`
  svg {
    width: 100%;
  }
`;

const getHeightLabel = (t: TFunction, tankType: TankType) => {
  switch (Number(tankType)) {
    case TankType.HorizontalWith2To1EllipsoidalEnds:
    case TankType.HorizontalWithHemisphericalEnds:
    case TankType.HorizontalWithVariableDishedEnds:
    case TankType.None:
    case TankType.SphericalTank:
    case TankType.VerticalWith2To1EllipsoidalEnds:
    case TankType.VerticalWithConicalBottomEnd:
    case TankType.VerticalWithFlatEnds:
    case TankType.VerticalWithHemisphericalEnds:
    case TankType.VerticalWithVariableDishedEnds:
      return t('ui.tankdimension.canlength', 'Can Length (L)');
    case TankType.HorizontalWithFlatEnds:
      return t('ui.tankdimension.length', 'Length (L)');
    case TankType.RectangularBox:
      return t('ui.tankdimension.heightwithunit', 'Height (H)');
    default:
      return '';
  }
};

const getWidthLabel = (t: TFunction, tankType: TankType) => {
  switch (Number(tankType)) {
    case TankType.HorizontalWith2To1EllipsoidalEnds:
    case TankType.HorizontalWithFlatEnds:
    case TankType.HorizontalWithHemisphericalEnds:
    case TankType.HorizontalWithVariableDishedEnds:
    case TankType.None:
    case TankType.SphericalTank:
    case TankType.VerticalWith2To1EllipsoidalEnds:
    case TankType.VerticalWithConicalBottomEnd:
    case TankType.VerticalWithFlatEnds:
    case TankType.VerticalWithHemisphericalEnds:
    case TankType.VerticalWithVariableDishedEnds:
      return t('ui.tankdimension.diameter', 'Diameter (D)');
    case TankType.RectangularBox:
      return t('ui.tankdimension.widthwithunit', 'Width (W)');
    default:
      return '';
  }
};

const getDishHeightLabel = (t: TFunction, tankType: TankType) => {
  switch (Number(tankType)) {
    case TankType.HorizontalWithVariableDishedEnds:
    case TankType.VerticalWithVariableDishedEnds:
      return t('ui.tankdimension.dishdepth', 'Dish Depth (DL)');
    case TankType.RectangularBox:
      return t('ui.tankdimension.depth', 'Depth (D)');
    case TankType.VerticalWithConicalBottomEnd:
      return t('ui.tankdimension.conelength', 'Cone Length (CL)');
    default:
      return '';
  }
};

function emptyStringToNull(value: any, originalValue: any) {
  if (typeof originalValue === 'string' && originalValue === '') {
    return null;
  }
  return value;
}

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const fieldIsRequired = (field: string) =>
    t('validate.common.isrequired', '{{field}} is required.', { field });
  const fieldMinimum = (field: string, minimum: number) =>
    t(
      'validate.common.numberMinimumValue',
      '{{field}} must be greater than or equal to {{minimum}}.',
      { field, minimum }
    );

  const typeRequired = fieldIsRequired(translationTexts.typeText);
  const unitsOfMeasureRequired = t(
    'validate.tankdimension.uomrequired',
    'Units of Measure is required.'
  );
  const strappingPointsRequired = t(
    'validate.tankdimension.strappingpointsrequired',
    'Strapping Points are required.'
  );
  const tankTypeNoneAndStrappingPointsRequired = t(
    'validate.tankdimension.tanktypecannotbenoneifnostrappingpoints',
    'Tank Type cannot be None unless Strapping Points are provided.'
  );

  const heightRequired = t(
    'validate.tankdimension.correspondingHeightRequired',
    'The corresponding level is also required'
  );
  const volumeRequired = t(
    'validate.tankdimension.correspondingVolumeRequired',
    'The corresponding volume is also required'
  );

  return Yup.object().shape({
    description: Yup.string()
      .typeError(fieldIsRequired(translationTexts.descriptionText))
      .required(fieldIsRequired(translationTexts.descriptionText)),
    tankType: Yup.string()
      .typeError(typeRequired)
      .required(typeRequired)
      .test(
        'tankType-with-min-tankStrappings',
        tankTypeNoneAndStrappingPointsRequired,
        function isValid(tankType) {
          if (!tankType || Number(tankType) !== TankType.None) {
            return true;
          }

          const { tankStrappings } = this.parent;

          // At least 2 strapping points are required when the tank type is None
          return (
            tankStrappings &&
            tankStrappings.length > 0 &&
            tankStrappings.filter(
              (strapping: any) =>
                strapping &&
                (strapping.height || strapping.height === 0) &&
                (strapping.volume || strapping.volume === 0)
            ).length > 1
          );
        }
      ),
    isStrappingUsedForWeb: Yup.boolean()
      .test(
        'at-least-two-strapping-points',
        strappingPointsRequired,
        function isValid(isStrappingUsedForWeb) {
          const { tankStrappings } = this.parent;

          if (!isStrappingUsedForWeb) {
            return true;
          }

          // At least one strapping point is required when
          // isStrappingUsedForWeb is checked
          return (
            tankStrappings &&
            tankStrappings.length > 0 &&
            tankStrappings.filter(
              (strapping: any) =>
                strapping &&
                (strapping.height || strapping.height === 0) &&
                (strapping.volume || strapping.volume === 0)
            ).length > 1
          );
        }
      )
      .test(
        'required-when-tank-type-is-none',
        strappingPointsRequired,
        function isValid(isStrappingUsedForWeb) {
          const { tankType } = this.parent;

          // Strapping points are required when the tank type is None, so the
          // isStrappingUsedForWeb must be true
          if (
            !isStrappingUsedForWeb &&
            tankType &&
            Number(tankType) === TankType.None
          ) {
            return false;
          }

          return true;
        }
      ),
    // Units of measure isn't required when the tank type is None
    unitsOfMeasure: Yup.mixed().when('tankType', {
      is: (val) => val && Number(val) === TankType.None,
      then: Yup.string().nullable(),
      otherwise: Yup.string()
        .typeError(unitsOfMeasureRequired)
        .required(unitsOfMeasureRequired),
    }),
    width: Yup.mixed().when('tankType', {
      is: (tankType) => Number(tankType) === TankType.None,
      then: Yup.number().nullable(),
      otherwise: Yup.number()
        .typeError(translationTexts.dimensionRequiredText)
        .required(translationTexts.dimensionRequiredText)
        .min(1, translationTexts.dimensionRequiredText),
    }),
    height: Yup.mixed().when('tankType', {
      is: (tankType) => Number(tankType) === TankType.None,
      then: Yup.number().nullable(),
      otherwise: Yup.number()
        .typeError(translationTexts.dimensionRequiredText)
        .required(translationTexts.dimensionRequiredText)
        .min(1, translationTexts.dimensionRequiredText),
    }),
    dishHeight: Yup.mixed().when('tankType', {
      is: (val) =>
        [
          TankType.HorizontalWithVariableDishedEnds,
          TankType.VerticalWithVariableDishedEnds,
          TankType.RectangularBox,
          TankType.VerticalWithConicalBottomEnd,
        ].indexOf(Number(val)) >= 0,
      then: Yup.number()
        .typeError(translationTexts.dimensionRequiredText)
        .required(translationTexts.dimensionRequiredText)
        .min(1, translationTexts.dimensionRequiredText),
    }),
    tankStrappings: Yup.array().of(
      Yup.object().shape({
        height: Yup.number()
          .typeError(heightRequired)
          .min(0, fieldMinimum(translationTexts.heightText, 0))
          .transform(emptyStringToNull)
          .nullable()
          .test('volume-is-set', volumeRequired, function isValid(item) {
            const isHeightSet = item || item === 0;
            const isVolumeSet = this.parent.volume || this.parent.volume === 0;

            if (
              (isHeightSet && isVolumeSet) ||
              (!isHeightSet && !isVolumeSet) ||
              (!isHeightSet && isVolumeSet)
            ) {
              return true;
            }

            return false;
          }),
        volume: Yup.number()
          .typeError(fieldIsRequired(translationTexts.volumeText))
          .min(0, fieldMinimum(translationTexts.volumeText, 0))
          .transform(emptyStringToNull)
          .nullable()
          .test('height-is-set', heightRequired, function isValid(item) {
            const isHeightSet = this.parent.height || this.parent.height === 0;
            const isVolumeSet = item || item === 0;

            if (
              (isHeightSet && isVolumeSet) ||
              (!isHeightSet && !isVolumeSet) ||
              (isHeightSet && !isVolumeSet)
            ) {
              return true;
            }

            return false;
          }),
      })
    ),
  });
};

const defaultInitialValues = {
  description: '',
  type: '',
  unitsOfMeasure: '',
  tankStrappings: [] as EditTankStrapping[],
};

interface FormProps
  extends Pick<
    FormikProps<Values>,
    | 'isSubmitting'
    | 'isValid'
    | 'errors'
    | 'touched'
    | 'setFieldTouched'
    | 'values'
    | 'setFieldValue'
  > {
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  isFetchingStrappingPoints?: boolean;
  handleFormChange: (formik: FormikProps<Values>) => void;
  generateStrappingPoints: (
    request: EvolveGenerateStrappingChartRequest,
    setFieldValue: FormikProps<Values>['setFieldValue']
  ) => void;
  isInlineForm?: boolean;
  strappingPointsError?: any;
}

const TankDimensionForm = ({
  isSubmitting,
  submissionError,
  values,
  isFetchingStrappingPoints,
  setFieldValue,
  generateStrappingPoints,
  isInlineForm,
  strappingPointsError,
}: FormProps) => {
  const { t } = useTranslation();

  const typeOptions = getTankDimensionTypeOptions(t);
  const unitsOfMeasureOptions = getTankDimensionUnitsOfMeasureOptions(t);

  const widthLabel = getWidthLabel(t, values.tankType);
  const heightLabel = getHeightLabel(t, values.tankType);
  const dishHeightLabel = getDishHeightLabel(t, values.tankType);
  const dimensionsColumnWidth = dishHeightLabel ? 6 : 4;

  const formattedAssets = useMemo(() => {
    if (!values.tankAssetNames) {
      return [];
    }

    return values.tankAssetNames.split(',');
  }, [values.tankAssetNames]);

  // Determine if tank dimensions are defined based on the currently selected
  // Tank Type
  const areTankDimensionsValue = dishHeightLabel
    ? values.height &&
      values.width &&
      values.dishHeight &&
      Number(values.height) > 0 &&
      Number(values.width) > 0 &&
      Number(values.dishHeight) > 0
    : values.height &&
      values.width &&
      Number(values.height) > 0 &&
      Number(values.width) > 0;

  const handleGenerateStrappingPoints = () => {
    generateStrappingPoints(
      {
        ...(dishHeightLabel && { dishHeight: values.dishHeight }),
        height: values.height,
        width: values.width,
        strappingLevelUnits: values.strappingLevelUnits,
        strappingVolumeUnits: values.strappingVolumeUnits,
        tankType: values.tankType,
        unitsOfMeasure: values.unitsOfMeasure,
      } as EvolveGenerateStrappingChartRequest,
      setFieldValue
    );
    setFieldValue('isStrappingUsedForWeb', true);
  };

  return (
    <Form>
      <Grid container spacing={2}>
        {/*
          TODO: Find a better way to handle errors + loading state. At the
          moment the shift is too jarring where the error appears and takes up
          space pushing the loading spinner down
        */}
        <Fade in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <Alert severity="error">
              {t('ui.tankdimension.saveError', 'Unable to save tank dimension')}
            </Alert>
          </Grid>
        </Fade>
        <Grid item xs={12}>
          <FormLinearProgress in={isSubmitting} />
        </Grid>
        <Grid item>
          <Grid container spacing={8}>
            <Grid item xs={12} md={isInlineForm ? undefined : 6}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <PageSubHeader dense>
                        {t(
                          'ui.edittankdimensions.tankinformation',
                          'Tank Information'
                        )}
                      </PageSubHeader>
                    </Grid>

                    <Grid item xs={12}>
                      <EditorBox>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Field
                              component={CustomTextField}
                              name="description"
                              label={t('ui.common.description', 'Description')}
                              required
                              // Disabling LastPass autocomplete on this field
                              // https://stackoverflow.com/a/30921628/7752479
                              id="disable-lastpass-autocomplete-search-tank-description"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Field
                              component={CustomTextField}
                              label={t('ui.common.type', 'Type')}
                              select
                              required
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
                          </Grid>
                          {!!values.tankType && (
                            <Grid item xs={12}>
                              <StyledTankBox mt={5} textAlign="center">
                                {getTankDimensionImage(values.tankType)}
                              </StyledTankBox>
                            </Grid>
                          )}
                        </Grid>
                      </EditorBox>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <PageSubHeader dense>
                        {t('ui.edittankdimensions.dimensions', 'Dimensions')}
                      </PageSubHeader>
                    </Grid>

                    <Grid item xs={12}>
                      <EditorBox>
                        <Grid container spacing={2}>
                          <Grid item xs={12} xl={dimensionsColumnWidth}>
                            <Field
                              component={CustomTextField}
                              name="unitsOfMeasure"
                              label={t(
                                'ui.tankdimension.unitsofmeasure',
                                'Units Of Measure'
                              )}
                              select
                              required
                              SelectProps={{ displayEmpty: true }}
                            >
                              <MenuItem value="">
                                <span style={{ color: fadedTextColor }}>
                                  {t('ui.common.select', 'Select')}
                                </span>
                              </MenuItem>
                              {unitsOfMeasureOptions?.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Field>
                          </Grid>
                          <Grid item xs={12} xl={dimensionsColumnWidth}>
                            <Field
                              component={CustomTextField}
                              type="number"
                              name="height"
                              required={values.tankType !== TankType.None}
                              label={heightLabel}
                            />
                          </Grid>
                          <Grid item xs={12} xl={dimensionsColumnWidth}>
                            <Field
                              component={CustomTextField}
                              type="number"
                              name="width"
                              required={values.tankType !== TankType.None}
                              label={widthLabel}
                            />
                          </Grid>
                          {dishHeightLabel && (
                            <Grid item xs={12} xl={dimensionsColumnWidth}>
                              <Field
                                component={CustomTextField}
                                type="number"
                                name="dishHeight"
                                required
                                label={dishHeightLabel}
                              />
                            </Grid>
                          )}
                        </Grid>
                      </EditorBox>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <PageSubHeader dense>
                        {t(
                          'ui.tankdimension.assetswithparenthesis',
                          'Asset(s)'
                        )}
                      </PageSubHeader>
                    </Grid>
                    <Grid item xs={12}>
                      <EditorBox>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <StyledAssetMenuList aria-label="Asset list">
                              {formattedAssets.length === 0 ? (
                                <MenuItem disabled>
                                  <em>
                                    {t('ui.assetlist.empty', 'No assets found')}
                                  </em>
                                </MenuItem>
                              ) : (
                                formattedAssets.map((asset) => (
                                  <MenuItem key={asset} disabled>
                                    {asset}
                                  </MenuItem>
                                ))
                              )}
                            </StyledAssetMenuList>
                          </Grid>
                        </Grid>
                      </EditorBox>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={isInlineForm ? undefined : 6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t('ui.tankdimension.strappingchart', 'Strapping Chart')}
                  </PageSubHeader>
                </Grid>
                <Grid item xs={12}>
                  <EditorBox>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Field
                          component={CheckboxWithLabel}
                          name="isStrappingUsedForWeb"
                          type="checkbox"
                          Label={{
                            label: t(
                              'ui.tankdimension.usestrappingchartforgraph',
                              'Use Strapping Chart For Graph'
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </EditorBox>
                </Grid>

                <Grid item xs={12}>
                  <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                      <PageSubHeader dense>
                        {t(
                          'ui.tankdimension.strappingpoints',
                          'Strapping Points'
                        )}
                      </PageSubHeader>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item>
                          <BoldPrimaryText>
                            <Button
                              variant="text"
                              startIcon={<GearIcon />}
                              disabled={
                                !values.tankType ||
                                Number(values.tankType) === TankType.None ||
                                !values.unitsOfMeasure ||
                                !areTankDimensionsValue ||
                                isFetchingStrappingPoints
                              }
                              onClick={handleGenerateStrappingPoints}
                            >
                              {t(
                                'ui.tankdimension.generatestrappingpoints',
                                'Generate Strapping Points'
                              )}
                            </Button>
                          </BoldPrimaryText>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                {strappingPointsError && (
                  <Grid item xs={12}>
                    <Alert severity="error">
                      {t(
                        'ui.tankdimension.unableToGenerateStrappingPoints',
                        'Unable to generate strapping points'
                      )}
                    </Alert>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <StrappingPointsTable />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Form>
  );
};

const metricLevelUnits = [
  UnitType.Centimeters,
  UnitType.Meters,
  UnitType.Millimeters,
];

const formatInitialValues = (values: any) => {
  let initialLevelUnit = values.strappingLevelUnits;
  if (!initialLevelUnit && values.unitsOfMeasure) {
    initialLevelUnit = values.unitsOfMeasure;
  } else if (!values.unitsOfMeasure) {
    initialLevelUnit = UnitType.Meters;
  }

  let initialVolumeUnit = values.strappingVolumeUnits;
  if (!initialVolumeUnit) {
    const isLevelMetric = metricLevelUnits.indexOf(initialLevelUnit) >= 0;
    initialVolumeUnit = isLevelMetric
      ? UnitType.CubicMeters
      : UnitType.CubicInches;
  }

  // NOTE: This was done since Yup throws an exception when validating a list
  // with objects and null values: [null, null, {...}]
  const formattedTankStrappings = [];
  for (let index = 0; index < 20; index += 1) {
    if (!values.tankStrappings || !values.tankStrappings[index]) {
      formattedTankStrappings.push({});
    } else {
      formattedTankStrappings.push(values.tankStrappings[index]);
    }
  }

  return {
    ...values,
    strappingLevelUnits: initialLevelUnit,
    strappingVolumeUnits: initialVolumeUnit,
    ...(!values.description && { description: '' }),
    ...(!values.tankType &&
      values.tankType !== TankType.None && { tankType: '' }),
    ...(!values.unitsOfMeasure && { unitsOfMeasure: '' }),
    tankStrappings: formattedTankStrappings,
  };
};

interface Props {
  initialValues: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
  isInlineForm?: boolean;
}

const TankDimensionFormWrapper = ({
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
  isInlineForm,
}: Props) => {
  const { t } = useTranslation();
  const [isFetchingStrappingPoints, setIsFetchingStrappingPoints] = useState(
    false
  );

  const [strappingPointsError, setStrappingPointsError] = useState<any>();

  const formInitialValues = initialValues || defaultInitialValues;
  const formattedInitialValues = formatInitialValues(formInitialValues);

  const descriptionText = t('ui.common.description', 'Description');
  const typeText = t('ui.common.type', 'Type');
  const unitsOfMeasureText = t(
    'ui.tankdimension.unitsofmeasure',
    'Units Of Measure'
  );
  const dimensionRequiredText = t(
    'validate.tankdimension.dimensionisrequired',
    'Dimension is required.'
  );
  const heightText = t('ui.tankdimension.height', 'Height');
  const volumeText = t('ui.tankdimension.volume', 'Volume');
  const validationSchema = buildValidationSchema(t, {
    descriptionText,
    typeText,
    unitsOfMeasureText,
    dimensionRequiredText,
    heightText,
    volumeText,
  });

  const generateStrappingPoints = useCallback(
    (
      request: EvolveGenerateStrappingChartRequest,
      setFieldValue: FormikProps<Values>['setFieldValue']
    ) => {
      setIsFetchingStrappingPoints(true);
      setStrappingPointsError(undefined);
      return AdminApiService.StrappingChartService.generateStrappingChart_GenerateStrappingChart(
        request
      )
        .then((response) => {
          const { strappingChart } = response;

          if (strappingChart && strappingChart.length > 0) {
            // NOTE: setFieldValue on arrays won't reset existing values if
            // the length doesn't match.
            // Example: If there are currently 25 strapping chart records on
            // the form, and the response only returns 20 strapping chart
            // records back, then the last 5 values will remain untouched
            // (they won't get reset/removed).
            // This isn't the case now since we always have 20 records, but it
            // could happen in the future
            setFieldValue('tankStrappings', strappingChart);
          }
        })
        .catch((error) => {
          console.error('Unable to generate strapping points', error);
          setStrappingPointsError(error);
        })
        .finally(() => {
          setIsFetchingStrappingPoints(false);
        });
    },
    []
  );

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
      {(formikProps) => (
        <>
          <FormikEffect
            onChange={handleFormChange}
            // NOTE: Adding additional props here like isValid may cause the
            // restoring of tabbed form values to screw up. Just something to
            // be aware of if values stop being restored properly
            isValid={formikProps.isValid}
            restoreTouchedFields={restoreTouchedFields}
            restoreInitialValues={restoreInitialValues}
          />
          <TankDimensionForm
            {...formikProps}
            restoreInitialValues={restoreInitialValues}
            handleFormChange={handleFormChange}
            restoreTouchedFields={restoreTouchedFields}
            submissionError={submissionError}
            generateStrappingPoints={generateStrappingPoints}
            isFetchingStrappingPoints={isFetchingStrappingPoints}
            isInlineForm={isInlineForm}
            strappingPointsError={strappingPointsError}
          />
        </>
      )}
    </Formik>
  );
};

export default TankDimensionFormWrapper;
