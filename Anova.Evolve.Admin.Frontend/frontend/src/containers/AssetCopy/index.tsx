import React, { useCallback, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  EvolveRetrieveAssetCopyEditComponentsByIdRequest,
  EvolveRetrieveAssetCopyEditComponentsByIdResponse,
  EvolveSaveAssetCopyRequest,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import MessageBlock from 'components/MessageBlock';
import { FormikHelpers, FormikProps } from 'formik';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { selectUser } from 'redux-app/modules/user/selectors';
import { formatValidationErrors } from 'utils/format/errors';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import ObjectForm from './components/ObjectForm';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';

interface RouteParams {
  assetId: string;
}

const AssetCopy = () => {
  const params = useParams<RouteParams>();
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [
    editComponents,
    setEditComponents,
  ] = useState<EvolveRetrieveAssetCopyEditComponentsByIdResponse | null>();
  const [editComponentsError, setEditComponentsError] = useState<any>();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [savedData, setSavedData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<any>();
  const [submissionError, setSubmissionError] = useState<any>();

  const activeDomain = useSelector(selectActiveDomain);
  const user = useSelector(selectUser);
  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;
  const domainId = activeDomain?.domainId;

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);
    return AdminApiService.AssetService.retrieveAssetCopyEditComponentsById_RetrieveAssetCopyEditComponentsById(
      {
        ...(params.assetId && {
          assetId: params.assetId,
        }),
      } as EvolveRetrieveAssetCopyEditComponentsByIdRequest
    )
      .then((response) => {
        setEditComponents(response);
      })
      .catch((error) => {
        setEditComponentsError(error);
      })
      .finally(() => {
        setIsFetchingEditData(false);
      });
  }, [params.assetId]);

  useEffect(() => {
    fetchEditData();
  }, [fetchEditData]);

  const refetchEditData = () => {
    fetchEditData();
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);
    return AdminApiService.AssetService.saveAssetCopy_SaveAssetCopy({
      item: {
        ...values,
        domainId,
      },
    } as EvolveSaveAssetCopyRequest)
      .then((response) => {
        const validationErrors =
          response.saveAssetCopyResult?.editObject?.validationErrors;
        const formattedValidationErrors = formatValidationErrors(
          validationErrors
        );
        if (
          formattedValidationErrors &&
          Object.keys(formattedValidationErrors).length > 0
        ) {
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

        setSavedData(response);

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
    editComponents?.retrieveAssetCopyEditComponentsByIdResult?.editObject;

  return (
    <>
      <PageIntroWrapper sticky>
        <PageIntro
          isSubmitting={isSubmitting}
          submissionResult={submissionResult}
          refetchEditData={refetchEditData}
          submitForm={formInstance?.submitForm}
        />
      </PageIntroWrapper>

      <Box mt={3}>
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
              <Grid
                container
                spacing={2}
                direction="column"
                justify="space-between"
              >
                <Grid item>
                  <ObjectForm
                    initialValues={editDetails}
                    onSubmit={handleSubmit}
                    handleFormChange={handleFormChange}
                    submissionError={submissionError}
                    editDetails={editDetails}
                    domainId={domainId}
                    userId={userId}
                  />
                </Grid>
              </Grid>
            )}
          </div>
        </Fade>
      </Box>
    </>
  );
};

export default AssetCopy;
