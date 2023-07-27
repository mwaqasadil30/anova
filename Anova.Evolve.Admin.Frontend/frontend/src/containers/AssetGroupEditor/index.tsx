import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { capitalize } from '@material-ui/core/utils';
import { ValidationErrorInfo } from 'api/admin/api';
import CircularProgress from 'components/CircularProgress';
import EntityDetails from 'components/EntityDetails';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import Form from './components/EditForm';
import PageIntro, {
  ITEM_ID,
  Submission,
  SubmissionError,
} from './components/PageIntro';
import {
  buildErrorMessageTextMapping,
  callApiForEditData,
  callApiSaveData,
  CREATE_PATH,
  DUPLICATE_DESCRIPTION_MESSAGE,
  massage,
  RequestPayload,
  ResponsePayload,
  SaveRequestPayload,
} from './constants';

const Editor = () => {
  const isCreating = useLocation().pathname === CREATE_PATH;
  const query = useParams<{ [ITEM_ID]: string }>();
  const itemId = query[ITEM_ID];
  const { t } = useTranslation();
  const [formProps, setFormProps] = useState<FormikProps<ResponsePayload>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [editData, setEditData] = useState<ResponsePayload | null>();
  const [groupListError, setGroupListError] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<
    Submission | undefined
  >();
  const [submissionError, setSubmissionError] = useState<SubmissionError>();

  const activeDomain = useSelector(selectActiveDomain);
  const activeDomainId = activeDomain?.domainId;

  const errorMessageTextMapping = buildErrorMessageTextMapping(t);

  const fetchEditData = useCallback((requestPayload: RequestPayload) => {
    setIsFetchingEditData(true);
    return callApiForEditData(requestPayload)
      .then(massage)
      .then(setEditData)
      .catch(setGroupListError)
      .finally(() => {
        setIsFetchingEditData(false);
      });
  }, []);

  const refetchEditData = () => {
    void fetchEditData({
      [ITEM_ID]: itemId,
      loadEditComponents: true,
    } as RequestPayload);
  };

  useEffect(refetchEditData, [itemId]);

  const handleSubmit = (
    values: ResponsePayload,
    formikBag: FormikHelpers<ResponsePayload>
  ) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    // Inject the active domain ID
    const formattedValues = {
      ...values,
      retrieveAssetGroupEditComponentsByIdResult: {
        ...values.retrieveAssetGroupEditComponentsByIdResult,
        editObject: {
          ...values.retrieveAssetGroupEditComponentsByIdResult?.editObject,
          domainId: activeDomainId,
        },
      },
    };

    return callApiSaveData(({
      ...formattedValues,
      assetGroup:
        formattedValues.retrieveAssetGroupEditComponentsByIdResult?.editObject,
      isDeleted: false, // If this isn't passed in, its considered deleted
      [ITEM_ID]: itemId,
    } as unknown) as SaveRequestPayload)
      .then((response) => {
        const validationErrorInfos: ValidationErrorInfo[] | null | undefined =
          response.saveAssetGroupResult?.editObject?.validationErrors;
        if (validationErrorInfos && validationErrorInfos?.length > 0) {
          const errors = validationErrorInfos
            .filter((info) => info.propertyName)
            .reduce<Record<string, ValidationErrorInfo['errorDescription']>>(
              (prev, currentError) => {
                // Currently, the only back-end validation error is for the
                // "Name" field
                const propertyName = currentError.propertyName as string;
                if (propertyName === 'Name') {
                  const translatedError =
                    // @ts-ignore
                    errorMessageTextMapping[currentError.errorDescription] ||
                    DUPLICATE_DESCRIPTION_MESSAGE;

                  prev.retrieveAssetGroupEditComponentsByIdResult = {
                    // @ts-ignore
                    ...prev.retrieveAssetGroupEditComponentsByIdResult,
                    editObject: {
                      ...prev.retrieveAssetGroupEditComponentsByIdResult
                        ?.editObject,
                      name: translatedError,
                    },
                  };
                } else {
                  prev[capitalize(propertyName)] =
                    currentError.errorDescription;
                }
                return prev;
              },
              {}
            );
          formikBag.setErrors(errors);
          const errorResult = { errors };
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
      .catch(setSubmissionError)
      .finally(() => setIsSubmitting(false));
  };

  return (
    <>
      <PageIntroWrapper sticky>
        <PageIntro
          // NOTE: Don't use `formInstance?.isSubmitting` or any other
          // properties directly from formInstance. They won't update as
          // often. Best thing to do is set properties like isSubmitting
          // when in handleFormChange where the formik instance is updated
          isSubmitting={isSubmitting}
          submitForm={formProps?.submitForm}
          refetchEditData={refetchEditData}
          submissionResult={submissionResult}
          isCreating={isCreating}
        />
      </PageIntroWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box mt={3}>
            <Fade in={groupListError} unmountOnExit>
              <div>
                {groupListError && (
                  <MessageBlock>
                    <Typography variant="body2" color="error">
                      {t(
                        // todo: think about how we can abstract from specific Model, in this case from asset group
                        'ui.assetgroup.assetgroupmanager.error',
                        'Unable to retrieve Asset Groups'
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
            <Fade in={!groupListError && !isFetchingEditData}>
              <div>
                {!groupListError && !isFetchingEditData && (
                  <Grid
                    container
                    spacing={2}
                    direction="column"
                    justify="space-between"
                  >
                    <Grid item xs={12}>
                      {(() => {
                        return (
                          !isFetchingEditData && (
                            <Form
                              initialValues={editData}
                              onSubmit={handleSubmit}
                              handleFormChange={setFormProps}
                              submissionError={submissionError}
                            />
                          )
                        );
                      })()}
                    </Grid>
                    {(() => {
                      const editDetails =
                        editData?.retrieveAssetGroupEditComponentsByIdResult
                          ?.editObject;
                      return (
                        editDetails &&
                        !isCreating &&
                        !isFetchingEditData && (
                          <Grid item>
                            <EntityDetails details={editDetails} />
                          </Grid>
                        )
                      );
                    })()}
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

export default Editor;
