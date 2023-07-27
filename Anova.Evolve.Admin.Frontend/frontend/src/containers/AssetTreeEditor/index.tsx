import React, { useCallback, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  EvolveSaveTreeRequest,
  EvolveRetrieveTreeEditComponentsResponse,
  EvolveRetrieveTreeEditComponentsRequest,
  CustomPropertyTypeInfo,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import MessageBlock from 'components/MessageBlock';
import { FormikHelpers, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import routes from 'apps/admin/routes';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import EntityDetails from 'components/EntityDetails';
import PageIntro from './components/PageIntro';
import TreeForm from './components/TreeForm';
import type { Values } from './components/TreeForm/types';

interface RouteParams {
  assetTreeId: string;
}

const AssetTreeEditor = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = useParams<RouteParams>();
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [
    assetTreeEditData,
    setAssetTreeEditData,
  ] = useState<EvolveRetrieveTreeEditComponentsResponse | null>();
  const [
    availableDataChannelTypeList,
    setAvailableDataChannelTypeList,
  ] = useState<number[] | null>();
  const [
    availableDomainCustomPropertyList,
    setAvailableDomainCustomPropertyList,
  ] = useState<CustomPropertyTypeInfo[] | null>();

  const [
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    availableDomainCustomPropertyListError,
    setAvailableDomainCustomPropertyListError,
  ] = useState<any>();

  const [
    availableDataChannelTypeListError,
    setAvailableDataChannelTypeListError,
  ] = useState<any>();

  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<any>();
  const [submissionError, setSubmissionError] = useState<any>();

  const isCreating = location.pathname === routes.assetTreeManager.create;

  const activeDomain = useSelector(selectActiveDomain);

  const domainId = activeDomain?.domainId;

  const fetchEditData = useCallback(
    ({ activeDomainId }: any) => {
      setIsFetchingEditData(true);
      return AdminApiService.AssetService.retrieveTreeEditComponents_RetrieveTreeEditComponents(
        {
          domainId: activeDomainId,
          ...(params.assetTreeId && { treeId: params.assetTreeId }),
        } as EvolveRetrieveTreeEditComponentsRequest
      )
        .then((response) => {
          setAssetTreeEditData(response);
          setAvailableDataChannelTypeList(
            response.retrieveTreeEditComponentsResult?.editObject
              ?.availableDataChannelTypeList
          );
          setAvailableDomainCustomPropertyList(
            response.retrieveTreeEditComponentsResult?.editObject
              ?.domainCustomPropertyList
          );
        })
        .catch((error) => {
          setAvailableDataChannelTypeListError(error);
          setAvailableDomainCustomPropertyListError(error);
        })
        .finally(() => {
          setIsFetchingEditData(false);
        });
    },
    [domainId, params.assetTreeId]
  );

  const refetchEditData = useCallback(() => {
    fetchEditData({ activeDomainId: domainId });
  }, [fetchEditData, domainId]);

  useEffect(() => {
    refetchEditData();
  }, [refetchEditData]);

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    const { level1, level2, level3, level4 } = values;
    const formattedExpression = [level1, level2, level3, level4]
      .filter(Boolean)
      .join('/');
    const formattedDataChannelTypes = values.dataChannelTypes
      /* eslint-disable-next-line no-restricted-globals */
      ?.filter((dataChannelType: any) => !isNaN(parseInt(dataChannelType, 10)))
      .join(';');

    return AdminApiService.AssetService.saveTree_SaveTree({
      item: {
        id: values.id,
        expression: formattedExpression,
        name: values.name,
        dataChannelTypes: formattedDataChannelTypes,
        domainCustomPropertyList: values.customDomainPropertyTypes,
        isDeleted: false, // If this isn't passed in, its considered deleted
        domainId,
      },
    } as EvolveSaveTreeRequest)
      .then((response) => {
        const validationErrors =
          response.saveTreeResult?.editObject?.validationErrors;
        if (validationErrors && validationErrors?.length > 0) {
          const formattedValidationErrors = validationErrors.reduce(
            (prev, currentError) => {
              const { propertyName } = currentError;
              if (propertyName) {
                const formattedPropertyName =
                  propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
                // TODO: Need to create a mapping between validation errors
                // and field names
                // @ts-ignore
                prev[formattedPropertyName] = currentError.errorDescription; // eslint-disable-line no-param-reassign
              }
              return prev;
            },
            {}
          );
          formikBag.setErrors(formattedValidationErrors);

          const errorResult = {
            errors: formattedValidationErrors,
          };

          // TODO: Cannot throw an error here since Formik doesn't seem to
          // catch it. Throwing an error is preferred so any place using this
          // submit logic can just use .then().catch(). Instead of using
          // .then() for successful submissions and .catch() for ones with
          // errors, we have to manage the state ourselves. See formik issue:
          // https://github.com/jaredpalmer/formik/issues/1580
          setSubmissionResult(errorResult);
          return errorResult;
        }

        const successResult = { response };
        setSubmissionResult(successResult);
        return successResult;
      })
      .catch((error) => {
        setSubmissionError(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleFormChange = (formik: FormikProps<Values>) => {
    setFormInstance(formik);
  };

  const editDetails =
    assetTreeEditData?.retrieveTreeEditComponentsResult?.editObject;

  return (
    <>
      <PageIntroWrapper sticky>
        <PageIntro
          // NOTE: Don't use `formInstance?.isSubmitting` or any other
          // properties directly from formInstance. They won't update as
          // often. Best thing to do is set properties like isSubmitting
          // when in handleFormChange where the formik instance is updated
          isSubmitting={isSubmitting}
          submitForm={formInstance?.submitForm}
          refetchEditData={refetchEditData}
          submissionResult={submissionResult}
          isCreating={isCreating}
        />
      </PageIntroWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box mt={3}>
            <Fade in={availableDataChannelTypeListError} unmountOnExit>
              <div>
                {availableDataChannelTypeListError && (
                  <MessageBlock>
                    <Typography variant="body2" color="error">
                      {t(
                        'ui.assetTree.retrieveAvailableDataChannelTypeListError',
                        'Unable to retrieve available data channels'
                      )}
                    </Typography>
                  </MessageBlock>
                )}
              </div>
            </Fade>
            <Fade in={isFetchingEditData} unmountOnExit>
              <div>
                {isFetchingEditData && (
                  <MessageBlock>
                    <CircularProgress />
                  </MessageBlock>
                )}
              </div>
            </Fade>
            <Fade
              in={!availableDataChannelTypeListError && !isFetchingEditData}
            >
              <div>
                {!availableDataChannelTypeListError && !isFetchingEditData && (
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    justify="space-between"
                  >
                    <Grid item>
                      <TreeForm
                        initialValues={
                          assetTreeEditData?.retrieveTreeEditComponentsResult
                            ?.editObject
                        }
                        onSubmit={handleSubmit}
                        handleFormChange={handleFormChange}
                        availableDataChannelTypeList={
                          availableDataChannelTypeList
                        }
                        availableDomainCustomPropertyList={
                          availableDomainCustomPropertyList
                        }
                        dataChannelTypes={editDetails?.dataChannelTypes}
                        submissionError={submissionError}
                        isCreating={isCreating}
                      />
                    </Grid>
                    {editDetails && !isCreating && (
                      <Grid item>
                        <EntityDetails details={editDetails} />
                      </Grid>
                    )}
                  </Grid>
                )}
              </div>
            </Fade>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AssetTreeEditor;
