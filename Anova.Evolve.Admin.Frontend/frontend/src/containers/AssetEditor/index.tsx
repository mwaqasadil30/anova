import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import {
  AssetType,
  CustomPropertyDataType,
  EditAsset,
  EditAssetCustomPropertyItem,
  EvolveAssetCustomProperty,
  EvolveRetrieveAssetEditDetailsByIdRequest as Request,
  EvolveRetrieveAssetEditDetailsByIdResponse as Response,
  EvolveSaveAssetEditRequest,
  EvolveSaveAssetEditResponse,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { SubmissionResult } from 'form-utils/types';
import {
  connect,
  Form,
  Formik,
  FormikErrors,
  FormikHelpers,
  FormikProps,
} from 'formik';
import get from 'lodash/get';
import noop from 'lodash/noop';
import set from 'lodash/set';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import useDebounce from 'react-use/lib/useDebounce';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { EMPTY_GUID } from 'utils/api/constants';
import { deserializeBooleanValue } from 'utils/api/custom-properties';
import { parseResponseError, parseResponseSuccess } from 'utils/api/handlers';
import { buildAssetTypeTextMapping } from 'utils/i18n/enum-to-text';
import EntityDetails from 'components/EntityDetails';
import {
  utilizedFields as GeneralTabUtilizedFields,
  utilizedFieldsNamespace as GeneralTabUtilizedFieldsNamespace,
} from './components/GeneralTab';
import PageIntro from './components/PageIntro';
import {
  defaultTabsValidityState,
  getColorVariant,
  StyledBadge,
  StyledTab,
  StyledTabs,
  tabComponentMap,
  TabName,
  tabNamespaceMap,
  tabPropsMap,
  TabsValidity,
} from './components/StyledTabs';
import WarningDialog from './components/WarningDialog';
import { buildValidationSchema } from './validation';

const FormikEffect = ({ onChange = noop, formik }: any) => {
  const values = formik?.values;
  const isValid = formik?.isValid;
  const touched = formik?.touched;

  useDebounce(
    () => {
      onChange(formik, formik.setValue, formik.isValid, touched);
    },
    100,
    [values, isValid, touched]
  );

  return null;
};

const ConnectedFormikEffect = connect(FormikEffect);

function TabPanel(props: {
  children?: React.ReactNode;
  index: any;
  value: any;
}) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      {...other}
      {...(value !== TabName.DataChannels && { mt: 3 })}
    >
      {/* Unmount children when switching tabs */}
      {/* {value === index && children} */}

      {/* Keep children mounted when switching tabs */}
      <div style={{ display: value === index ? 'inherit' : 'none' }}>
        {children}
      </div>
    </Box>
  );
}

const shouldReplace = (value: any): boolean => value === null;
const massageData = (data: Response): Response => {
  const newData = { ...data };

  const customPropertiesPath = 'asset.customProperties';
  const newValueForCustomProps = (get(
    newData,
    customPropertiesPath
  ) as EditAssetCustomPropertyItem[]).map((property) => {
    let { value }: any = property;

    switch (property.dataType) {
      case CustomPropertyDataType.Boolean: {
        value = deserializeBooleanValue(value) || false;
        break;
      }
      case CustomPropertyDataType.Number: {
        property.minimum = property.minimum || 0;
        property.maximum = property.maximum || 0;
        property.precision = property.precision || 0;
        value = value || undefined;
        break;
      }
      case CustomPropertyDataType.String:
      case CustomPropertyDataType.ValueList: {
        value = value || '';
        break;
      }
      default:
    }

    return {
      ...property,
      value,
    };
  });
  set(newData, customPropertiesPath, newValueForCustomProps);

  // NOTE: We need to convert null values to '' since Formik/Material-UI
  // require empty strings for controlled field values
  Object.keys(GeneralTabUtilizedFields).forEach((prop: string) => {
    const path = `${GeneralTabUtilizedFieldsNamespace}.${prop}`;
    const orig = get(newData, path);
    set(newData, path, shouldReplace(orig) ? '' : orig);
  });

  return newData as Response;
};

const toString = (
  data: Response | null | FormikErrors<Response>,
  namespace: string,
  fields: string[]
) => {
  return fields
    .map((prop: string) => get(data, `${namespace}.${prop}`, ''))
    .join('');
};

const formatSaveData = (
  values?: EditAsset | null
): EvolveSaveAssetEditRequest => {
  // @ts-ignore
  return {
    assetId: values?.assetId,
    description: values?.description,
    designCurveType: values?.designCurveType,
    dataChannels: values?.dataChannels,
    notes: values?.notes,
    technician: values?.installedTechName,
    eventRuleGroupId: values?.eventRuleGroupId,
    siteId: values?.siteId,
    integrationName: values?.integrationName,
    assetType: values?.assetType,
    domainId: values?.domainId,
    isMobile: values?.isMobile,
    geoAreaGroupId: values?.geoAreaGroupId,

    customProperties: values?.customProperties?.map((property) => ({
      // We dont pass propertyTypeId when creating an asset since the
      // propertyTypeId wont exist
      propertyTypeId: property.propertyTypeId || undefined,
      name: property.name,
      value: property.value,
    })) as EvolveAssetCustomProperty[],
  };
};

const Editor = () => {
  const { t } = useTranslation();

  const assetTypeMapping = buildAssetTypeTextMapping(t);

  const tabsTranslations = {
    [TabName.General]: t('ui.common.general', 'General'),
    [TabName.DataChannels]: t('ui.common.datachannels', 'Data Channels'),
    [TabName.History]: t('ui.common.history', 'History'),
  };
  const { assetId } = useParams<{ assetId: string }>();
  const descriptionText = t('ui.common.description', 'Description');
  const siteText = t('ui.common.site', 'Site');
  const validationSchema = buildValidationSchema(t, {
    siteText,
    descriptionText,
  });
  const activeDomainId = useSelector(selectActiveDomain)?.domainId;

  const [selectedTab, setSelectedTab] = useState<TabName>(TabName.General);
  const [isFetchingEditData, setIsFetchingEditData] = useState(true);
  const [tabsValidityState, setTabsValidityState] = useState<TabsValidity>(
    defaultTabsValidityState
  );
  const [formInstance, setFormInstance] = useState<FormikProps<Response>>();
  const [originalData, setOriginalData] = useState<Response | null>(null);
  const [editComponentsError, setEditComponentsError] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<
    SubmissionResult<EvolveSaveAssetEditResponse>
  >();
  const [submissionError, setSubmissionError] = useState<any>();

  const recalculateTabsHash = (formik: FormikProps<Response>) => {
    const newState = {} as TabsValidity;
    Object.keys(TabName)
      .map((tab) => tab as TabName)
      .forEach((tab: TabName) => {
        const propsKeys = Object.keys(tabPropsMap[tab]);
        if (tab === TabName.General) {
          const customPropertiesPath = `${GeneralTabUtilizedFieldsNamespace}.customProperties`;
          propsKeys.push(
            ...Array.from(
              get(originalData, customPropertiesPath),
              (_, index) => `customProperties[${index}].value`
            )
          );
        }

        newState[tab] = {
          isValid: !toString(formik.errors, tabNamespaceMap[tab], propsKeys),
          isDirty:
            toString(formik.values, tabNamespaceMap[tab], propsKeys) !==
            toString(originalData, tabNamespaceMap[tab], propsKeys),
        };
      });
    setTabsValidityState(newState);
  };
  useEffect(() => {
    if (formInstance) {
      recalculateTabsHash(formInstance);
    }
  }, [formInstance, originalData]);

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);

    return AdminApiService.AssetService.retrieveAssetEditDetailsById_RetrieveAssetEditDetailsById(
      {
        assetId: assetId || EMPTY_GUID,
      } as Request
    )
      .then(massageData)
      .then(setOriginalData)
      .catch(setEditComponentsError)
      .finally(() => {
        setIsFetchingEditData(false);
      });
  }, [assetId]);
  const refetchEditData = () => void fetchEditData();
  useEffect(refetchEditData, [fetchEditData]);

  const handleSubmit = (
    values: Response,
    formikBag: FormikHelpers<Response>
  ) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    // Inject the active domain ID
    const formattedValues = {
      ...formatSaveData(values.asset),
      domainId: activeDomainId,
    } as Omit<EvolveSaveAssetEditRequest, 'init' | 'toJSON'>;

    return AdminApiService.AssetService.saveAssetEdit_SaveAssetEdit(
      formattedValues as EvolveSaveAssetEditRequest
    )
      .then(parseResponseSuccess)
      .then((result) => {
        if (result.errors) {
          // @ts-ignore
          formikBag.setErrors(result.errors);
        }

        setSubmissionResult(result);
        setOriginalData(values);
        return result;
      })
      .catch((error) => {
        const errorResult = parseResponseError(error);
        if (errorResult) {
          // Because of the way the form was initially set up, we need to
          // nest the keys under 'asset' so they match the Formik field names
          const formattedErrors = Object.entries(errorResult.errors).reduce(
            (prev, [key, value]) => {
              // @ts-ignore
              prev.asset[key] = value;
              return prev;
            },
            {
              asset: {},
            }
          );

          // @ts-ignore
          formikBag.setErrors(formattedErrors);
          setSubmissionResult(errorResult);
        } else {
          setSubmissionError(error);
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  const tabRenderer = (tab: TabName) => {
    if (!assetId && (tab === TabName.History || tab === TabName.DataChannels)) {
      return null;
    }
    const { isValid, isDirty } = tabsValidityState[tab];

    return (
      <StyledTab
        key={`${tab}-${isValid}-${isDirty}`}
        label={
          <Grid container spacing={2} alignItems="center">
            <Grid item>{tabsTranslations[tab]}</Grid>
            {(!isValid || isDirty) && (
              <Grid item>
                <StyledBadge
                  variant="dot"
                  colorVariant={getColorVariant(isValid, isDirty)}
                />
              </Grid>
            )}
          </Grid>
        }
        value={tab}
      />
    );
  };

  const assetDetails = originalData?.asset;
  const editAssetType = assetDetails?.assetType;

  let message;
  if (editAssetType === undefined) {
    message = '';
  } else {
    message = t(
      'ui.asset.unsupportedAssetType',
      'Asset type {{assetType}} currently not supported. Coming soon...',
      { assetType: assetTypeMapping[editAssetType] }
    );
  }

  if (editComponentsError) {
    return (
      <WarningDialog
        open
        message={t('ui.asset.retrieveError', 'Unable to retrieve asset')}
      />
    );
  }

  if (
    !isFetchingEditData &&
    editAssetType !== AssetType.Tank &&
    editAssetType !== AssetType.HeliumIsoContainer
  ) {
    return <WarningDialog open message={message} />;
  }

  return (
    <>
      <PageIntroWrapper
        sticky
        divider={
          <StyledTabs
            value={selectedTab}
            onChange={(e, tab: TabName) => setSelectedTab(tab)}
            aria-label="asset tabs"
          >
            {Object.keys(TabName).map((tab) => tabRenderer(tab as TabName))}
          </StyledTabs>
        }
      >
        <PageIntro
          isCreating={!assetId}
          isSubmitting={isSubmitting}
          submissionResult={submissionResult}
          refetchEditData={refetchEditData}
          isAnyFormDirty={
            !Object.keys(TabName).every(
              (tab) => !tabsValidityState[tab as TabName].isDirty
            )
          }
          submitForm={formInstance?.submitForm}
        />
      </PageIntroWrapper>
      <Fade in={isFetchingEditData} unmountOnExit>
        <div>
          {isFetchingEditData && (
            <MessageBlock>
              <CircularProgress />
            </MessageBlock>
          )}
        </div>
      </Fade>
      <Fade in={!editComponentsError && !isFetchingEditData}>
        <div>
          {!editComponentsError && !isFetchingEditData && (
            <Formik
              // NOTE: Using `enableReinitialize` could cause the resetForm method to
              // not work. Instead, we're resetting the form by re-fetching the
              // required data to edit the form, and unmounting then mounting the form
              // again so that the initialValues passed from the parent are used
              // correctly
              initialValues={originalData || ({} as Response)}
              validateOnChange
              validateOnBlur
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {(formik) => (
                <>
                  <ConnectedFormikEffect
                    onChange={() => setFormInstance(formik)}
                    formik={formik}
                    isValid={formik.isValid}
                  />
                  <Form>
                    <Grid
                      container
                      spacing={2}
                      direction="column"
                      justify="space-between"
                    >
                      <Grid item xs={12}>
                        {Object.keys(TabName).map((tab) => {
                          const Component = tabComponentMap[tab as TabName];

                          return (
                            <TabPanel value={selectedTab} index={tab} key={tab}>
                              <Component
                                formik={formik}
                                submissionError={submissionError}
                              />
                            </TabPanel>
                          );
                        })}
                      </Grid>
                      {assetDetails && assetId && (
                        <Grid item xs={12}>
                          <EntityDetails details={assetDetails} />
                        </Grid>
                      )}
                    </Grid>
                  </Form>
                </>
              )}
            </Formik>
          )}
        </div>
      </Fade>
    </>
  );
};

export default Editor;
