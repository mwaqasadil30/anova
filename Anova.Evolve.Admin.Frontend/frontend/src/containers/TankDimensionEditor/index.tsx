import React, { useCallback, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  EvolveRetrieveTankDimensionEditComponentsByIdRequest,
  EvolveRetrieveTankDimensionEditComponentsByIdResponse,
  EvolveSaveTankDimensionRequest,
  TankType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import MessageBlock from 'components/MessageBlock';
import { FormikHelpers, FormikProps } from 'formik';
import { formatValidationErrors } from 'utils/format/errors';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import EntityDetails from 'components/EntityDetails';
import PageIntro from './components/PageIntro';
import TankDimensionForm from './components/TankDimensionForm';
import type { Values } from './components/TankDimensionForm/types';

const translateBackendErrors = (errors: Record<string, any>, t: TFunction) => {
  const translatedErrors = { ...errors };
  if (
    translatedErrors.description &&
    translatedErrors.description ===
      'There is already a Tank Dimension with this name.'
  ) {
    translatedErrors.description = t(
      'validate.tankdimension.descriptionmustbeunique',
      'There is already a Tank Dimension with this name.'
    );
  }

  return translatedErrors;
};

interface Props {
  editingObjectId?: string | null;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  saveCallback?: (response: any) => void;
  saveAndExitCallback?: (response: any) => void;
}

const TankDimensionEditor = ({
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
    editComponents,
    setEditComponents,
  ] = useState<EvolveRetrieveTankDimensionEditComponentsByIdResponse | null>();
  const [editComponentsError, setEditComponentsError] = useState<any>();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [savedData, setSavedData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<any>();
  const [submissionError, setSubmissionError] = useState<any>();

  const isCreating = !editingObjectId;

  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);
    return AdminApiService.GeneralService.retrieveTankDimensionEditComponentsById_RetrieveTankDimensionEditComponentsById(
      {
        ...(editingObjectId && {
          tankDimensionId: editingObjectId,
        }),
      } as EvolveRetrieveTankDimensionEditComponentsByIdRequest
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
  }, [editingObjectId]);

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

    const isDishHeightRequired =
      [
        TankType.HorizontalWithVariableDishedEnds,
        TankType.VerticalWithVariableDishedEnds,
        TankType.RectangularBox,
        TankType.VerticalWithConicalBottomEnd,
      ].indexOf(Number(values.tankType)) >= 0;

    return AdminApiService.GeneralService.saveTankDimension_SaveTankDimension({
      tankDimension: {
        ...values,
        // Prevent sending dishHeight to the API for tanks that dont need it
        ...(!isDishHeightRequired && { dishHeight: null }),
        domainId,
      },
    } as EvolveSaveTankDimensionRequest)
      .then((response) => {
        const validationErrors =
          response.saveTankDimensionResult?.editObject?.validationErrors;
        const formattedValidationErrors = formatValidationErrors(
          validationErrors
        );
        if (
          formattedValidationErrors &&
          Object.keys(formattedValidationErrors).length > 0
        ) {
          const translatedErrors = translateBackendErrors(
            formattedValidationErrors,
            t
          );
          formikBag.setErrors(translatedErrors);

          const errorResult = {
            errors: translatedErrors,
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
    editComponents?.retrieveTankDimensionEditComponentsByIdResult?.editObject;

  return (
    <>
      <PageIntroWrapper
        sticky
        isWithinDrawer={isInlineForm}
        {...(isInlineForm && { topOffset: 0 })}
      >
        <PageIntro
          isCreating={isCreating}
          isSubmitting={isSubmitting}
          submissionResult={submissionResult}
          refetchEditData={refetchEditData}
          submitForm={formInstance?.submitForm}
          headerNavButton={headerNavButton}
          saveCallback={saveCallback}
          saveAndExitCallback={saveAndExitCallback}
          isInlineForm={isInlineForm}
        />
      </PageIntroWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
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
                      <TankDimensionForm
                        initialValues={editDetails}
                        onSubmit={handleSubmit}
                        handleFormChange={handleFormChange}
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
                                'ui.common.datachannelcount',
                                'Data Channel Count'
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

export default TankDimensionEditor;
