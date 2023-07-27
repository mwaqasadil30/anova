import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  EditAssetCustomPropertyItem,
  EvolveRetrieveQuickAssetCreateHeliumISOContainerResponse,
  RetrieveSiteEditComponentsResult,
  RTUChannelUsageInfo,
  RTUDeviceInfo,
  SiteInfoRecord,
} from 'api/admin/api';
import { geocode, parseLatLongCoordinates } from 'api/mapbox/api';
import { isLatitudeValid, isLongitudeValid } from 'api/mapbox/helpers';
import Alert from 'components/Alert';
import CloseIconButton from 'components/buttons/CloseIconButton';
import CustomProperties from 'components/CustomProperties';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import RTUAutoCompleteHeliumISOContainer from 'components/forms/form-fields/RTUAutoCompleteHeliumISOContainer';
import SiteAutocomplete from 'components/forms/form-fields/SiteAutocomplete';
import FormikEffect from 'components/forms/FormikEffect';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import FullPageLoadingOverlay from 'components/FullPageLoadingOverlay';
import IntegrationParameters from 'components/IntegrationParameters';
import PageSubHeader from 'components/PageSubHeader';
import SiteLocationMap from 'components/SiteLocationMap';
import SiteEditor from 'containers/SiteEditor';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DomainDetailWithTheme } from 'redux-app/modules/app/types';
import styled from 'styled-components';
import { gray25 } from 'styles/colours';
import { EMPTY_GUID } from 'utils/api/constants';
import {
  customPropertiesValidationSchema,
  massageCustomProperties,
} from 'utils/api/custom-properties';
import { formatAddressInOneLine } from 'utils/format/address';
import { fieldIsRequired, fieldMaxLength } from 'utils/forms/errors';
import * as Yup from 'yup';
import FormChangeEffect from '../FormChangeEffect';
import { Values } from './types';

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    description: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.descriptionText))
      .required(fieldIsRequired(t, translationTexts.descriptionText))
      .max(80, fieldMaxLength(t)),
    designCurveId: Yup.number()
      .typeError(fieldIsRequired(t, translationTexts.designCurveTypeText))
      .required(fieldIsRequired(t, translationTexts.designCurveTypeText)),
    siteId: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.siteText))
      .required(fieldIsRequired(t, translationTexts.siteText)),
    rtuId: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.rtuText))
      .required(fieldIsRequired(t, translationTexts.rtuText)),
    notes: Yup.string().max(1000, fieldMaxLength(t)),
    customProperties: customPropertiesValidationSchema(t),
  });
};

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
  domainDefaultSite?: SiteInfoRecord | null;
}

const formatInitialValues = (
  values: any,
  { customProperties, domainDefaultSite }: FormatInitialValuesOptions = {}
) => {
  const formattedCustomProperties = massageCustomProperties(customProperties);

  return {
    ...values,
    customProperties: formattedCustomProperties,
    // NOTE: Values need to be in Formik's initialValues in order to be
    // "touched" when submitting the form. If they're not "touched" then errors
    // wont appear on these fields (ex: productId and tankDimensionId)
    description: '',
    designCurveId: '',
    siteId:
      domainDefaultSite?.siteId && domainDefaultSite?.siteId !== EMPTY_GUID
        ? domainDefaultSite?.siteId
        : '',
    rtuId: '',
    addHeliumPressureRateOfChange: false,
    notes: '',

    // Integration parameters
    assetIntegrationId: '',
    integrationDomainId: '',

    heliumLevelIntegrationDetails: buildInitialIntegrationDetails(),
    heliumPressureIntegrationDetails: buildInitialIntegrationDetails(),
    nitrogenLevelIntegrationDetails: buildInitialIntegrationDetails(),
    nitrogenPressureIntegrationDetails: buildInitialIntegrationDetails(),
    batteryIntegrationDetails: buildInitialIntegrationDetails(),
    gpsIntegrationDetails: buildInitialIntegrationDetails(),
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
  editDetails?: EvolveRetrieveQuickAssetCreateHeliumISOContainerResponse | null;
  domain?: DomainDetailWithTheme | null;
  userId?: string;
  customProperties?: EditAssetCustomPropertyItem[] | null;
  domainDefaultSite?: SiteInfoRecord | null;
  selectedRtu: RTUDeviceInfo | null;
  rtuChannelsFromRtu?: RTUChannelUsageInfo[] | null;
  setSelectedRtu: React.Dispatch<React.SetStateAction<RTUDeviceInfo | null>>;
  setRtuChannelsFromRtu: React.Dispatch<
    React.SetStateAction<RTUChannelUsageInfo[] | null | undefined>
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
  customProperties,
  domainDefaultSite,
}: Props) => {
  const { t } = useTranslation();

  const [mappedLatLong, setMappedLatLong] = useState<MappedLatLong>();

  const [siteDetails, setSiteDetails] = useState<
    RetrieveSiteEditComponentsResult | null | undefined
  >();
  const [selectedRtu, setSelectedRtu] = useState<RTUDeviceInfo | null>(null);
  const [rtuChannelsFromRtu, setRtuChannelsFromRtu] = useState<
    RTUChannelUsageInfo[] | null | undefined
  >();

  // Site Drawer
  const [selectedSite, setSelectedSite] = useState<SiteInfoRecord | null>();
  const [editingSiteId, setEditingSiteId] = useState<string | null>();
  const [isSiteDrawerOpen, setIsSiteDrawerOpen] = useState(false);

  const formattedInitialValues = formatInitialValues(initialValues || {}, {
    customProperties,
    domainDefaultSite,
  });

  const descriptionText = t(
    'ui.quicktankcreate.heliumISOContainer.assetDescription',
    'Asset Description (Container ID)'
  );
  const siteText = t('ui.common.site', 'Site');
  const rtuText = t('ui.common.rtu', 'RTU');
  const designCurveTypeText = t(
    'ui.asset.designcurvetype',
    'Design Curve Type'
  );

  const validationSchema = useMemo(
    () =>
      buildValidationSchema(t, {
        descriptionText,
        siteText,
        rtuText,
        designCurveTypeText,
      }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [t]
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

  // TODO: Is the site drawer needed on this page?
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

  if (!editDetails) {
    return null;
  }

  const domainId = domain?.domainId;

  const mappedLatitude = mappedLatLong?.lat;
  const mappedLongitude = mappedLatLong?.long;

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, values, setFieldValue }) => {
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
              setRtuChannelsFromRtu={setRtuChannelsFromRtu}
              setFieldValue={setFieldValue}
              selectedRtu={selectedRtu}
              rtuChannelsFromRtu={rtuChannelsFromRtu}
              integrationDomains={editDetails.domainIntegrationInfo}
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
                    {t('ui.asset.assetdetails', 'Asset Details')}
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
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          id="designCurveId-input"
                          component={CustomTextField}
                          select
                          required
                          name="designCurveId"
                          label={designCurveTypeText}
                          SelectProps={{ displayEmpty: true }}
                        >
                          <MenuItem value="">
                            <SelectItem />
                          </MenuItem>
                          {editDetails?.designCurve?.map((designCurve) => (
                            <MenuItem
                              key={designCurve.designCurveId}
                              value={designCurve.designCurveId}
                            >
                              {designCurve.description}
                            </MenuItem>
                          ))}
                        </Field>
                      </Grid>
                      <Grid item xs={12}>
                        {/* TODO: Potentially remove the drawer */}
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
                          label={siteText}
                          required
                          domainId={domainId}
                          userId={userId}
                          selectedOption={selectedSite}
                          initialValue={domainDefaultSite}
                          textFieldProps={{
                            placeholder: t(
                              'ui.common.enterSearchCriteria',
                              'Enter Search Criteria...'
                            ),
                            label: siteText,
                            required: true,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          id="rtuId-input"
                          component={RTUAutoCompleteHeliumISOContainer}
                          name="rtuId"
                          domainId={domainId}
                          textFieldProps={{
                            placeholder: t(
                              'ui.common.enterSearchCriteria',
                              'Enter Search Criteria...'
                            ),
                            label: rtuText,
                            required: true,
                          }}
                          selectedOption={selectedRtu}
                          onChange={(selectedOption: RTUDeviceInfo | null) => {
                            setSelectedRtu(selectedOption);
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Field
                          id="addHeliumPressureRateOfChange-input"
                          component={CheckboxWithLabel}
                          name="addHeliumPressureRateOfChange"
                          Label={{
                            label: t(
                              'quicktankcreate.heliumISOContainer.addHeliumPressureRateOfChange',
                              'Add Helium Pressure Rate of Change Data Channel'
                            ),
                          }}
                          type="checkbox"
                        />
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
                {editDetails.isIntegrationFeedEnabled && (
                  <>
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
                        assetIntegrationFieldName="assetIntegrationId"
                        domains={editDetails.domainIntegrationInfo}
                        selectedDomainId={values.integrationDomainId}
                        dataChannels={[
                          {
                            description: t(
                              'ui.heliumIsoContainers.heliumLevel',
                              'Helium Level'
                            ),
                            fieldName: 'heliumLevelIntegrationDetails',
                            shouldAutoGenerate:
                              values.heliumLevelIntegrationDetails
                                ?.shouldAutoGenerate,
                          },
                          {
                            description: t(
                              'ui.heliumIsoContainers.heliumPressure',
                              'Helium Pressure'
                            ),
                            fieldName: 'heliumPressureIntegrationDetails',
                            shouldAutoGenerate:
                              values.heliumPressureIntegrationDetails
                                ?.shouldAutoGenerate,
                          },
                          {
                            description: t(
                              'ui.heliumIsoContainers.nitrogenLevel',
                              'Nitrogen Level'
                            ),
                            fieldName: 'nitrogenLevelIntegrationDetails',
                            shouldAutoGenerate:
                              values.nitrogenLevelIntegrationDetails
                                ?.shouldAutoGenerate,
                          },
                          {
                            description: t(
                              'ui.heliumIsoContainers.nitrogenPressure',
                              'Nitrogen Pressure'
                            ),
                            fieldName: 'nitrogenPressureIntegrationDetails',
                            shouldAutoGenerate:
                              values.nitrogenPressureIntegrationDetails
                                ?.shouldAutoGenerate,
                          },
                          {
                            description: t('ui.common.battery', 'Battery'),
                            fieldName: 'batteryIntegrationDetails',
                            shouldAutoGenerate:
                              values.batteryIntegrationDetails
                                ?.shouldAutoGenerate,
                          },
                          {
                            description: t('enum.datachanneltype.gps', 'GPS'),
                            fieldName: 'gpsIntegrationDetails',
                            shouldAutoGenerate:
                              values.gpsIntegrationDetails?.shouldAutoGenerate,
                            hideAutoGenerateCheckbox: true,
                          },
                        ]}
                      />
                    </Grid>
                  </>
                )}
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
