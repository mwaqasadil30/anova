/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  AssetDetailDto,
  AssetDetailsSiteInfo,
  EditSite,
  EvolveAssetCustomPropertyDetail,
  EvolveAssetDetails,
  EvolveSaveEditAssetDetailsInfoRequest,
  SiteInfoDto,
  SiteInfoRecord,
  UserPermissionType,
} from 'api/admin/api';
import CloseIconButton from 'components/buttons/CloseIconButton';
import CustomProperties from 'components/CustomProperties';
import CustomThemeProvider from 'components/CustomThemeProvider';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import AirProductsSiteAutocomplete from 'components/forms/form-fields/AirProductsSiteAutocomplete';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SiteAutocomplete from 'components/forms/form-fields/SiteAutocomplete';
import SiteLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/SiteLabelWithEditorButtons';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageSubHeader from 'components/PageSubHeader';
import SiteEditor from 'containers/SiteEditor';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import {
  selectActiveDomainId,
  selectIsActiveDomainApciEnabled,
} from 'redux-app/modules/app/selectors';
import {
  selectHasPermission,
  selectUserId,
} from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { massageCustomProperties } from 'utils/api/custom-properties';
import { parseResponseError } from 'utils/api/handlers';
import { fieldIsRequired, fieldMaxLength } from 'utils/forms/errors';
import { formatPhoneNumber } from 'utils/ui/helpers';
import * as Yup from 'yup';
import { useSaveAssetInformation } from '../../hooks/useSaveAssetInformation';
import FormEffect from './FormEffect';
import { useRetrieveSiteEditComponentsById } from './hooks/useRetrieveEditComponentsById';

const MajorText = styled(Typography)`
  font-weight: 500;
  font-size: 16px;
`;

const MinorText = styled(Typography)`
  font-size: 14px;
`;

const StyledGrid = styled(Grid)`
  && {
    padding-top: 0;
  }
`;

interface Values {
  customProperties?: EvolveAssetCustomPropertyDetail[] | null;
  siteNotes: string;
  assetNotes: string;
  siteId: string;
  assetDescription: string;
  technician: string;
  integrationId: string;
  referenceDocumentUrl: string; // Also known as: "Working instructions".
}

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  return Yup.object().shape({
    siteId: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.siteText))
      .required(fieldIsRequired(t, translationTexts.siteText)),
    siteNotes: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.descriptionText))
      .max(1000, fieldMaxLength(t)),
    assetNotes: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.descriptionText))
      .max(1000, fieldMaxLength(t)),
  });
};

interface Props {
  assetResult?: AssetDetailDto | null;
  customProperties?: EvolveAssetCustomPropertyDetail[] | null;
  closeAssetInfoDrawer: () => void;
  onSaveSuccess: (asset?: EvolveAssetDetails | null) => void;
}

const AssetInfoDrawerDetails = ({
  assetResult,
  customProperties,
  closeAssetInfoDrawer,
  onSaveSuccess,
}: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const hasPermission = useSelector(selectHasPermission);

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  // Site Permissions
  const canReadSiteNotes = hasPermission(
    UserPermissionType.SiteNotes,
    AccessType.Read
  );
  const canUpdateSiteNotes = hasPermission(
    UserPermissionType.SiteNotes,
    AccessType.Update
  );

  // Asset Notes Permissions
  const canReadAssetNotes = hasPermission(
    UserPermissionType.AssetNotes,
    AccessType.Read
  );
  const canUpdateAssetNotes = hasPermission(
    UserPermissionType.AssetNotes,
    AccessType.Update
  );

  // Custom Properties permissions
  const canReadCustomProperties = hasPermission(
    UserPermissionType.AssetCustomProperties,
    AccessType.Read
  );

  // Asset Info Permissions
  const canReadAssetInfo = hasPermission(
    UserPermissionType.AssetGlobal,
    AccessType.Read
  );
  const canUpdateAssetInfo = hasPermission(
    UserPermissionType.AssetGlobal,
    AccessType.Update
  );

  // Site autocomplete (Air products & non-air products)
  const canUpdateSite = hasPermission(
    UserPermissionType.AdministrationTabAsset
  );

  const siteText = t('ui.common.site', 'Site');
  const siteNotesText = t('ui.assetdetail.sitenotes', 'Site Notes');
  const assetNotesText = t('ui.assetdetail.assetnotes', 'Asset Notes');

  const validationSchema = buildValidationSchema(t, {
    siteText,
    assetNotesText,
    siteNotesText,
  });

  const result = assetResult;

  const formattedCustomProperties = massageCustomProperties(customProperties);

  const domainId = useSelector(selectActiveDomainId);
  const userId = useSelector(selectUserId);

  // Site drawer state
  const [selectedSite, setSelectedSite] = useState<
    // SiteInfoRecord: When the user selects an option from the autocomplete
    // AssetDetailsSiteInfo: The initial site provided from the asset details
    // response
    // EditSite: When creating/editing a site in the site drawer
    SiteInfoRecord | AssetDetailsSiteInfo | EditSite | null | undefined
  >(result?.siteInfo);
  const [editingSiteId, setEditingSiteId] = useState<string | null>();
  const [isSiteDrawerOpen, setIsSiteDrawerOpen] = useState(false);

  const { makeRequest, error } = useSaveAssetInformation();
  const retrieveSiteEditComponentsByIdApi = useRetrieveSiteEditComponentsById({
    site: selectedSite,
  });
  const { isFetching } = retrieveSiteEditComponentsByIdApi;

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

  const handleSave = (values: Values, formikBag: FormikHelpers<Values>) => {
    /* 
      IMPORTANT! 
      NOTE:
      When adding new fields here, keep in mind that we may need to update the UI
      after making any changes. Add any new properties that are displayed on 
      the asset detail page in the updateAssetInformation() function in the
      main AssetDetail component.
    */
    const editingAssetInfoObject = {
      assetId: assetResult?.assetId,
      domainId,
      assetDescription: values.assetDescription,
      siteId: values.siteId,
      assetNotes: values.assetNotes,
      siteNotes: values.siteNotes,
      customProperties: values.customProperties,
      technician: values.technician,
      assetIntegrationId: values.integrationId,
      referenceDocumentUrl: values.referenceDocumentUrl,
    } as EvolveSaveEditAssetDetailsInfoRequest;

    return makeRequest(editingAssetInfoObject)
      .then((response) => {
        const successResult = { response };
        onSaveSuccess(response.asset);

        return successResult;
      })
      .then(() => {
        dispatch(enqueueSaveSuccessSnackbar(t));
      })
      .catch((responseError) => {
        const errorResult = parseResponseError(responseError);
        if (errorResult) {
          const fieldErrors = errorResult.errors;

          formikBag.setErrors(fieldErrors);
          formikBag.setStatus({ errors: fieldErrors });
        }
      });
  };

  const retrievedSiteDetails =
    retrieveSiteEditComponentsByIdApi.data?.retrieveSiteEditComponentsByIdResult
      ?.editObject;

  const joinedAddress = [
    retrievedSiteDetails?.address1,
    retrievedSiteDetails?.city,
    retrievedSiteDetails?.state,
  ]
    .filter(Boolean)
    .join(', ');

  // NOTE: The SiteAutocomplete API response doesn't include some information
  // so we have to make an API call to retrieve the data so it's consistent
  const customerContactName = retrievedSiteDetails?.contactName || '';
  const sitePhoneNumber = retrievedSiteDetails?.contactPhone || '';
  const formattedPhoneNumber = formatPhoneNumber(sitePhoneNumber);

  const isPublishedAsset = assetResult?.isPublishedAsset;

  const initialSelectedApciSite = assetResult?.siteInfo?.siteId
    ? SiteInfoDto.fromJS({
        id: assetResult.siteInfo.siteId,
        customerName: assetResult.siteInfo.customerName,
        address1: assetResult.siteInfo.address1,
        address2: assetResult.siteInfo.address2,
        address3: assetResult.siteInfo.address3,
        country: assetResult.siteInfo.country,
        // domainId: no domainId on assetResult
        // domainName: no domainName on assetResult
        // searchStatus: no searchStatus on assetResult
        siteNumber: assetResult.siteInfo.siteNumber,
        city: assetResult.siteInfo.city,
        state: assetResult.siteInfo.state,
      })
    : null;
  const [selectedApciSite, setSelectedApciSite] = useState<SiteInfoDto | null>(
    initialSelectedApciSite
  );

  const joinedApciSiteAddress = [
    selectedApciSite?.address1,
    selectedApciSite?.city,
    selectedApciSite?.state,
    selectedApciSite?.country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <>
      <Formik
        initialValues={
          {
            customProperties: formattedCustomProperties,
            siteNotes: result?.siteInfo?.siteNotes || '',
            assetNotes: result?.assetNotes || '',
            siteId: result?.siteInfo?.siteId || '',
            assetDescription: result?.assetDescription || '',
            technician: result?.technician || '',
            integrationId: result?.integrationId || '',
            referenceDocumentUrl: result?.referenceDocumentUrl || '',
          } as Values
        }
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ isSubmitting, values, submitForm, setFieldValue }) => {
          return (
            <Form>
              <FormEffect
                fetchedSiteDetails={retrievedSiteDetails}
                setFieldValue={setFieldValue}
              />
              <CustomThemeProvider forceThemeType="dark">
                <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                  {/* 
                    Moved to reusable generic EditorPageIntro component, 
                    need to verify this is possible
                  */}
                  <EditorPageIntro
                    title={t(
                      'ui.assetsummary.assetinformation',
                      'Asset Information'
                    )}
                    showSaveOptions
                    cancelCallback={closeAssetInfoDrawer}
                    submitForm={submitForm}
                    isSubmitting={isSubmitting}
                    submissionError={error}
                    saveAndExitCallback={() => {}}
                    disableSaveAndExit={isFetching}
                  />
                </PageIntroWrapper>
              </CustomThemeProvider>

              <Box mt={2} />
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <EditorBox>
                    <Grid container spacing={3} alignItems="center">
                      {canReadAssetInfo && (
                        <Grid item xs={12}>
                          <Field
                            id="assetDescription-input"
                            name="assetDescription"
                            component={CustomTextField}
                            label={t('ui.common.description', 'Description')}
                            disabled={
                              isSubmitting ||
                              isFetching ||
                              isPublishedAsset ||
                              !canUpdateAssetInfo
                            }
                          />
                        </Grid>
                      )}
                      {/* 
                        If the asset is published, never show a site-related autocomplete.
                        Otherwise, show a site autocomplete depending on if the domain is 
                        an air-products (APCI)-enabled domain or a regular (non-airproducts) domain.
                      */}
                      {!isPublishedAsset &&
                        (isAirProductsEnabledDomain ? (
                          <Grid item xs={12}>
                            <Field
                              id="siteId-input"
                              name="siteId"
                              component={AirProductsSiteAutocomplete}
                              label
                              selectedOption={selectedApciSite}
                              onChange={setSelectedApciSite}
                              textFieldProps={{
                                placeholder: t(
                                  'ui.common.enterSearchCriteria',
                                  'Enter Search Criteria...'
                                ),
                                label: t('ui.apci.siteNumber', 'Site Number'),
                              }}
                              storeSiteId
                              disabled={!canUpdateSite}
                            />
                          </Grid>
                        ) : (
                          <Grid item xs={12}>
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
                                    const editObject =
                                      response?.saveSiteResult?.editObject;

                                    setSelectedSite(editObject);
                                    setEditingSiteId(editObject?.siteId);
                                  }}
                                  saveAndExitCallback={(response: any) => {
                                    const editObject =
                                      response?.saveSiteResult?.editObject;

                                    setSelectedSite(editObject);
                                    setEditingSiteId(editObject?.siteId);
                                    toggleSiteDrawer(false)();
                                  }}
                                />
                              </DrawerContent>
                            </Drawer>
                            <Field
                              id="siteId-input"
                              component={SiteAutocomplete}
                              name="siteId"
                              domainId={domainId}
                              userId={userId}
                              initialInputValue={values.siteId}
                              selectedOption={selectedSite}
                              onChange={setSelectedSite}
                              textFieldProps={{
                                placeholder: t(
                                  'ui.common.enterSearchCriteria',
                                  'Enter Search Criteria...'
                                ),
                                label: (
                                  <SiteLabelWithEditorButtons
                                    isAddButtonDisabled={isSubmitting}
                                    isEditButtonDisabled={
                                      !values.siteId || isSubmitting
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
                              disabled={!canUpdateSite}
                            />
                          </Grid>
                        ))}

                      {isAirProductsEnabledDomain ? (
                        <Grid item xs={12}>
                          <MajorText>
                            {selectedApciSite?.customerName || '\u00A0'}
                          </MajorText>
                          <MinorText>
                            {joinedApciSiteAddress || '\u00A0'}
                          </MinorText>
                        </Grid>
                      ) : (
                        <Grid item xs={12}>
                          <MajorText>
                            {selectedSite?.customerName || '\u00A0'}
                          </MajorText>
                          <MinorText>{joinedAddress || '\u00A0'}</MinorText>
                          <MinorText>
                            {!!formattedPhoneNumber && (
                              <span aria-label="Customer contact phone number">
                                {formattedPhoneNumber}
                              </span>
                            )}
                            {!!formattedPhoneNumber &&
                              !!customerContactName &&
                              ' | '}
                            {!!customerContactName && (
                              <span aria-label="Customer contact name">
                                {customerContactName}
                              </span>
                            )}
                          </MinorText>
                        </Grid>
                      )}

                      {canReadAssetInfo && (
                        <Grid item xs={12}>
                          <Field
                            id="technician-input"
                            name="technician"
                            component={CustomTextField}
                            label={t('ui.asset.technician', 'Technician')}
                            disabled={
                              isSubmitting ||
                              isFetching ||
                              isPublishedAsset ||
                              !canUpdateAssetInfo
                            }
                          />
                        </Grid>
                      )}

                      {canReadAssetInfo && (
                        <Grid item xs={12}>
                          <Field
                            id="integrationId-input"
                            name="integrationId"
                            component={CustomTextField}
                            label={t(
                              'ui.asset.assetintegrationid',
                              'Asset Integration ID'
                            )}
                            disabled={
                              isSubmitting ||
                              isFetching ||
                              isPublishedAsset ||
                              !canUpdateAssetInfo
                            }
                          />
                        </Grid>
                      )}

                      {canReadSiteNotes && (
                        <Grid item xs={12}>
                          <Field
                            id="siteNotes-input"
                            name="siteNotes"
                            component={CustomTextField}
                            label={t('ui.assetdetail.sitenotes', 'Site Notes')}
                            multiline
                            fullWidth
                            rows={4}
                            disabled={
                              !canUpdateSiteNotes ||
                              isSubmitting ||
                              isFetching ||
                              isPublishedAsset
                            }
                          />
                        </Grid>
                      )}

                      {canReadAssetNotes && (
                        <Grid item xs={12}>
                          <Field
                            id="assetNotes-input"
                            name="assetNotes"
                            component={CustomTextField}
                            label={t(
                              'ui.assetdetail.assetnotes',
                              'Asset Notes'
                            )}
                            multiline
                            fullWidth
                            rows={4}
                            disabled={
                              !canUpdateAssetNotes ||
                              isSubmitting ||
                              isFetching ||
                              isPublishedAsset
                            }
                          />
                        </Grid>
                      )}
                    </Grid>
                  </EditorBox>
                </Grid>

                {canReadCustomProperties && !!customProperties?.length && (
                  <>
                    <Grid item xs={12}>
                      <PageSubHeader dense>
                        {t('ui.asset.customproperties', 'Custom Properties')}
                      </PageSubHeader>
                    </Grid>
                    <StyledGrid item xs={12}>
                      <EditorBox>
                        <Grid item xs={12}>
                          <CustomProperties
                            customProperties={customProperties}
                            isSubmitting={isSubmitting}
                          />
                        </Grid>
                      </EditorBox>
                    </StyledGrid>
                  </>
                )}

                {isAirProductsEnabledDomain && (
                  <>
                    <Grid item xs={12}>
                      <PageSubHeader dense>
                        {t(
                          'ui.apci.workingInstructions',
                          'Working Instructions'
                        )}
                      </PageSubHeader>
                    </Grid>
                    <StyledGrid item xs={12}>
                      <EditorBox>
                        <Field
                          id="referenceDocumentUrl-input"
                          name="referenceDocumentUrl"
                          component={CustomTextField}
                          label={t('ui.apci.documentUrl', 'Document URL')}
                          multiline
                          fullWidth
                          rows={4}
                          disabled={
                            !canUpdateAssetNotes ||
                            isSubmitting ||
                            isFetching ||
                            isPublishedAsset
                          }
                        />
                      </EditorBox>
                    </StyledGrid>
                  </>
                )}
              </Grid>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default AssetInfoDrawerDetails;
