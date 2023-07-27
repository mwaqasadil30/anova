import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  EvolveRetrieveProductEditComponentsRequest,
  EvolveRetrieveProductEditComponentsResponse,
  EvolveSaveProductRequest,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import EntityDetails from 'components/EntityDetails';
import PageIntro from './components/PageIntro';
import ProductForm from './components/ProductForm';
import type { Values } from './components/ProductForm/types';

interface Props {
  editingObjectId?: string | null;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  saveCallback?: (response: any) => void;
  saveAndExitCallback?: (response: any) => void;
}

const ProductEditor = ({
  editingObjectId,
  headerNavButton,
  isInlineForm,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();

  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [
    productEditData,
    setProductEditData,
  ] = useState<EvolveRetrieveProductEditComponentsResponse | null>();
  const [productGroupList, setProductGroupList] = useState<string[] | null>();
  const [productGroupListError, setProductGroupListError] = useState<any>();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [productData, setProductData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<any>();
  const [submissionError, setSubmissionError] = useState<any>();

  const isCreating = !editingObjectId;

  const activeDomain = useSelector(selectActiveDomain);

  const domainId = activeDomain?.domainId;

  const fetchEditData = useCallback(
    ({ activeDomainId }: any) => {
      setIsFetchingEditData(true);
      return AdminApiService.GeneralService.retrieveProductEditComponents_RetrieveProductEditComponents(
        {
          domainId: activeDomainId,
          ...(editingObjectId && { productId: editingObjectId }),
        } as EvolveRetrieveProductEditComponentsRequest
      )
        .then((response) => {
          setProductEditData(response);
          setProductGroupList(
            response.retrieveProductEditComponentsResult?.editObject
              ?.productGroupList
          );
        })
        .catch((error) => {
          setProductGroupListError(error);
        })
        .finally(() => {
          setIsFetchingEditData(false);
        });
    },
    [domainId, editingObjectId]
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
    return AdminApiService.GeneralService.saveProduct_SaveProduct({
      item: {
        ...values,
        isDeleted: false, // If this isn't passed in, its considered deleted
        domainId,
      },
    } as EvolveSaveProductRequest)
      .then((response) => {
        const validationErrors =
          response.saveProductResult?.editObject?.validationErrors;
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

        setProductData(response);

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
    productEditData?.retrieveProductEditComponentsResult?.editObject;

  return (
    <>
      <PageIntroWrapper
        sticky
        isWithinDrawer={isInlineForm}
        {...(isInlineForm && { topOffset: 0 })}
      >
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
          headerNavButton={headerNavButton}
          saveCallback={saveCallback}
          saveAndExitCallback={saveAndExitCallback}
          isInlineForm={isInlineForm}
        />
      </PageIntroWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box mt={3}>
            <Fade in={productGroupListError} unmountOnExit>
              <div>
                {productGroupListError && (
                  <MessageBlock>
                    <Typography variant="body2" color="error">
                      {t(
                        'ui.product.retrieveProductGroupListError',
                        'Unable to retrieve product groups'
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
            <Fade in={!productGroupListError && !isFetchingEditData}>
              <div>
                {!productGroupListError && !isFetchingEditData && (
                  <Grid
                    container
                    spacing={3}
                    direction="column"
                    justify="space-between"
                  >
                    <Grid item>
                      <ProductForm
                        initialValues={
                          productEditData?.retrieveProductEditComponentsResult
                            ?.editObject
                        }
                        onSubmit={handleSubmit}
                        handleFormChange={handleFormChange}
                        productGroupList={productGroupList}
                        submissionError={submissionError}
                        isInlineForm={isInlineForm}
                      />
                    </Grid>
                    {editDetails && !isCreating && (
                      <Grid item>
                        <EntityDetails
                          details={editDetails}
                          isInline={isInlineForm}
                          extraDetails={[
                            {
                              label: t(
                                'ui.common.datachannels',
                                'Data Channels'
                              ),
                              value: editDetails.dataChannelCount,
                            },
                          ]}
                        />
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

export default ProductEditor;
