/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  RetrieveSiteEditComponentsResult,
  SiteLocationInfoAutoCompleteListType,
} from 'api/admin/api';
import { geocode, parseLatLongCoordinates } from 'api/mapbox/api';
import Alert from 'components/Alert';
import Button from 'components/Button';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FormikEffect from 'components/forms/FormikEffect';
import PageSubHeader from 'components/PageSubHeader';
import {
  FastField,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fadedTextColor } from 'styles/colours';
import {
  fieldIsRequired,
  fieldMaxLength,
  fieldMustBeNumber,
} from 'utils/forms/errors';
import * as Yup from 'yup';
import AsyncAutocomplete from '../AsyncAutocomplete';
import { Values } from './types';

const StyledForm = styled(Form)`
  &.disabled-labels-wrapper {
    .field-affected-by-wrapper label.MuiFormLabel-root.Mui-disabled {
      color: ${(props) => props.theme.palette.text.primary};
    }
    // Styles below are for more custom "Read-only" fields
    /* .field-affected-by-wrapper .MuiInput-formControl {
      background: transparent;
      padding-left: 0;
    /* } */
    // Autocompletes still need some changes re: caret/cancel icons in the field
    /* .field-affected-by-wrapper .MuiInput-input {
      color: ${(props) => props.theme.palette.text.primary};
    } */
  }
`;

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    customerName: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.customerNameText))
      .required(fieldIsRequired(t, translationTexts.customerNameText))
      .max(80, fieldMaxLength(t)),
    address1: Yup.string().nullable().max(120, fieldMaxLength(t)),
    address2: Yup.string().nullable().max(80, fieldMaxLength(t)),
    address3: Yup.string().nullable().max(80, fieldMaxLength(t)),
    country: Yup.string().nullable().max(80, fieldMaxLength(t)),
    city: Yup.string().nullable().max(80, fieldMaxLength(t)),
    state: Yup.string().nullable().max(40, fieldMaxLength(t)),
    zipcode: Yup.string().nullable().max(20, fieldMaxLength(t)),
    contactName: Yup.string().nullable().max(80, fieldMaxLength(t)),
    contactPhone: Yup.string().nullable().max(80, fieldMaxLength(t)),
    timeZoneId: Yup.number()
      .typeError(fieldIsRequired(t, translationTexts.timezoneText))
      .required(fieldIsRequired(t, translationTexts.timezoneText)),
    latitude: Yup.number().typeError(
      fieldMustBeNumber(t, translationTexts.latitudeText)
    ),
    longitude: Yup.number().typeError(
      fieldMustBeNumber(t, translationTexts.longitudeText)
    ),
  });
};

const defaultInitialValues = {
  customerName: '',
  contactName: '',
  contactPhone: '',
  address1: '',
  address2: '',
  address3: '',
  country: '',
  state: '',
  city: '',
  latitude: '',
  longitude: '',
  notes: '',
  postalCode: '',
  timeZoneId: '',
  isGeoCodeManual: false,
};

const formatInitialValues = (values: any) => {
  return {
    ...values,
    // Important for the autocomplete to work
    ...(!values.customerName && { customerName: '' }),
    ...(!values.contactName && { contactName: '' }),
    ...(!values.contactPhone && { contactPhone: '' }),
    ...(!values.address1 && { address1: '' }),
    ...(!values.address2 && { address2: '' }),
    ...(!values.address3 && { address3: '' }),
    ...(!values.country && { country: '' }),
    ...(!values.state && { state: '' }),
    ...(!values.city && { city: '' }),
    ...(!values.latitude && { latitude: '' }),
    ...(!values.longitude && { longitude: '' }),
    ...(!values.notes && { notes: '' }),
    ...(!values.postalCode && { postalCode: '' }),
    ...(!values.timeZoneId && { timeZoneId: '' }),
    ...(!values.isGeoCodeManual && { isGeoCodeManual: false }),
  };
};

interface Props {
  isAirProductsEnabledDomain?: boolean;
  initialValues: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  isInlineForm?: boolean;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
  timezones: RetrieveSiteEditComponentsResult['timeZones'];
}

const SiteFormWrapper = ({
  isAirProductsEnabledDomain,
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
  timezones,
  isInlineForm,
}: Props) => {
  const { t } = useTranslation();

  const formInitialValues = initialValues || defaultInitialValues;
  const formattedInitialValues = formatInitialValues(formInitialValues);

  const customerNameText = t('ui.common.customername', 'Customer Name');
  const timezoneText = t('ui.common.timezone', 'Time Zone');
  const latitudeText = t('ui.common.latitude', 'Latitude');
  const longitudeText = t('ui.common.longitude', 'Longitude');

  const validationSchema = buildValidationSchema(t, {
    customerNameText,
    timezoneText,
    latitudeText,
    longitudeText,
  });

  const [geocodeError, setGeocodeError] = useState<any>();

  const handleGetLatLong = ({
    address1,
    city,
    state,
    country,
    setFieldValue,
  }: any) => {
    setGeocodeError(undefined);
    // Mapbox address components formatting:
    // https://docs.mapbox.com/help/troubleshooting/address-geocoding-format-guide/#format-address-components-consistently
    const address = [address1, city, state, country].filter(Boolean).join(' ');

    geocode(address)
      .then(parseLatLongCoordinates)
      .then((coordinates: any) => {
        if (coordinates) {
          setFieldValue('latitude', coordinates.lat);
          setFieldValue('longitude', coordinates.long);
        } else {
          setGeocodeError('Unable to find coordinates');
          console.error('Unable to find relevant coordinates');
        }
      })
      .catch((error) => {
        setGeocodeError(error);
        console.error(`Geocode was not successful: ${error}`);
      });
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
      {({ isSubmitting, isValid, values, setFieldValue }) => (
        <>
          <FormikEffect
            onChange={handleFormChange}
            isValid={isValid}
            restoreTouchedFields={restoreTouchedFields}
            restoreInitialValues={restoreInitialValues}
          />

          <StyledForm
            className={
              isAirProductsEnabledDomain ? 'disabled-labels-wrapper' : ''
            }
          >
            <Grid container spacing={3}>
              {/*
                TODO: Find a better way to handle errors + loading state. At the
                moment the shift is too jarring where the error appears and takes up
                space pushing the loading spinner down
              */}
              <Fade in={!!submissionError} unmountOnExit>
                <Grid item xs={12}>
                  <Alert severity="error">
                    {t('ui.site.saveError', 'Unable to save site')}
                  </Alert>
                </Grid>
              </Fade>
              <Grid item xs={12}>
                <FormLinearProgress in={isSubmitting} />
              </Grid>
            </Grid>

            <Grid container spacing={8}>
              <Grid item xs={12} md={isInlineForm ? undefined : 6}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <PageSubHeader dense>
                          {t(
                            'ui.common.customerInformation',
                            'Customer Information'
                          )}
                        </PageSubHeader>
                      </Grid>
                      <Grid item xs={12}>
                        <EditorBox>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Field
                                className="field-affected-by-wrapper"
                                component={AsyncAutocomplete}
                                name="customerName"
                                freeSolo
                                textFieldProps={{
                                  required: true,
                                  label: t(
                                    'ui.common.customername',
                                    'Customer Name'
                                  ),
                                }}
                                searchType={
                                  SiteLocationInfoAutoCompleteListType.CustomerName
                                }
                                disabled={isAirProductsEnabledDomain}
                              />
                            </Grid>
                            {isAirProductsEnabledDomain && (
                              <Grid item xs={12}>
                                <FastField
                                  className="field-affected-by-wrapper"
                                  component={CustomTextField}
                                  name="siteNumber"
                                  label={t('ui.site.siteNumber', 'Site Number')}
                                  disabled={isAirProductsEnabledDomain}
                                />
                              </Grid>
                            )}
                            <Grid item xs={12}>
                              <FastField
                                className="field-affected-by-wrapper"
                                component={CustomTextField}
                                name="contactName"
                                label={t('ui.site.contactname', 'Contact Name')}
                                disabled={isAirProductsEnabledDomain}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <FastField
                                className="field-affected-by-wrapper"
                                component={CustomTextField}
                                name="contactPhone"
                                label={t(
                                  'ui.site.contactphone',
                                  'Contact Phone'
                                )}
                                disabled={isAirProductsEnabledDomain}
                              />
                            </Grid>
                          </Grid>
                        </EditorBox>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <PageSubHeader dense>
                          {t('ui.common.time', 'Time')}
                        </PageSubHeader>
                      </Grid>
                      <Grid item xs={12}>
                        <EditorBox>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <Field
                                className="field-affected-by-wrapper"
                                component={CustomTextField}
                                name="timeZoneId"
                                label={t('ui.common.timezone', 'Time Zone')}
                                select
                                required
                                SelectProps={{ displayEmpty: true }}
                                disabled={isAirProductsEnabledDomain}
                              >
                                <MenuItem value="" disabled>
                                  <span style={{ color: fadedTextColor }}>
                                    {t('ui.common.select', 'Select')}
                                  </span>
                                </MenuItem>
                                {timezones?.map((timezone) => (
                                  <MenuItem
                                    key={timezone.timezoneId}
                                    value={timezone.timezoneId}
                                  >
                                    {timezone.displayName}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>
                            {geocodeError && (
                              <Grid item xs={12}>
                                <Alert severity="error">
                                  {t(
                                    'ui.site.geocodingFailed',
                                    'Geocode was not successful.'
                                  )}
                                </Alert>
                              </Grid>
                            )}
                            <Grid item xs={6}>
                              <Field
                                className="field-affected-by-wrapper"
                                component={CustomTextField}
                                name="latitude"
                                label={t('ui.common.latitude', 'Latitude')}
                                disabled={
                                  !values.isGeoCodeManual ||
                                  isAirProductsEnabledDomain
                                }
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Field
                                className="field-affected-by-wrapper"
                                component={CustomTextField}
                                name="longitude"
                                label={t('ui.common.longitude', 'Longitude')}
                                disabled={
                                  !values.isGeoCodeManual ||
                                  isAirProductsEnabledDomain
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Field
                                className="field-affected-by-wrapper"
                                component={CheckboxWithLabel}
                                name="isGeoCodeManual"
                                type="checkbox"
                                Label={{
                                  label: t(
                                    'ui.site.isgeocodemanual',
                                    'Manual Lat/Long Lookup'
                                  ),
                                }}
                                disabled={isAirProductsEnabledDomain}
                              />
                            </Grid>
                            {values.isGeoCodeManual && (
                              <Grid item xs={12}>
                                <Button
                                  className="field-affected-by-wrapper"
                                  variant="contained"
                                  onClick={() =>
                                    handleGetLatLong({
                                      address1: values.address1,
                                      city: values.city,
                                      state: values.state,
                                      country: values.country,
                                      setFieldValue,
                                    })
                                  }
                                  disabled={isAirProductsEnabledDomain}
                                >
                                  {t('ui.site.getlatlong', 'Get Lat/Long')}
                                </Button>
                              </Grid>
                            )}
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
                      {t('ui.site.siteAddress', 'Site Address')}
                    </PageSubHeader>
                  </Grid>
                  <Grid item xs={12}>
                    <EditorBox>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <FastField
                            className="field-affected-by-wrapper"
                            component={CustomTextField}
                            name="address1"
                            label={t('ui.common.address', 'Address')}
                            disabled={isAirProductsEnabledDomain}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FastField
                            className="field-affected-by-wrapper"
                            component={CustomTextField}
                            name="address2"
                            disabled={isAirProductsEnabledDomain}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FastField
                            className="field-affected-by-wrapper"
                            component={CustomTextField}
                            name="address3"
                            disabled={isAirProductsEnabledDomain}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Box m={2} />
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Field
                            className="field-affected-by-wrapper"
                            component={AsyncAutocomplete}
                            name="country"
                            freeSolo
                            textFieldProps={{
                              label: t('ui.common.country', 'Country'),
                            }}
                            required
                            searchType={
                              SiteLocationInfoAutoCompleteListType.Country
                            }
                            disabled={isAirProductsEnabledDomain}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Field
                            className="field-affected-by-wrapper"
                            component={AsyncAutocomplete}
                            name="state"
                            freeSolo
                            textFieldProps={{
                              label: t('ui.common.state', 'State'),
                            }}
                            required
                            searchType={
                              SiteLocationInfoAutoCompleteListType.State
                            }
                            searchCountry={values.country}
                            disabled={isAirProductsEnabledDomain}
                          />
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Field
                            className="field-affected-by-wrapper"
                            component={AsyncAutocomplete}
                            name="city"
                            freeSolo
                            textFieldProps={{
                              label: t('ui.common.city', 'City'),
                            }}
                            required
                            searchType={
                              SiteLocationInfoAutoCompleteListType.City
                            }
                            searchCountry={values.country}
                            searchState={values.state}
                            disabled={isAirProductsEnabledDomain}
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Field
                            className="field-affected-by-wrapper"
                            component={CustomTextField}
                            name="postalCode"
                            label={t('ui.common.zipcode', 'Zip Code')}
                            disabled={isAirProductsEnabledDomain}
                          />
                        </Grid>
                      </Grid>
                    </EditorBox>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <PageSubHeader dense>
                          {t('ui.common.notes', 'Notes')}
                        </PageSubHeader>
                      </Grid>
                      <Grid item xs={12}>
                        <EditorBox>
                          <FastField
                            className="field-affected-by-wrapper"
                            component={CustomTextField}
                            multiline
                            name="notes"
                            rows={7}
                            disabled={isAirProductsEnabledDomain}
                          />
                        </EditorBox>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </StyledForm>
        </>
      )}
    </Formik>
  );
};

export default SiteFormWrapper;
