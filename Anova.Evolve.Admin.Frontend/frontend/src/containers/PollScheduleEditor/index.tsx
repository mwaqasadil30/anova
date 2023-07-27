/* eslint-disable indent */
import React, { useCallback, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  EvolveRetrieveRtuPollScheduleGroupEditComponentsByIdRequest,
  EvolveRetrieveRtuPollScheduleGroupEditComponentsByIdResponse,
  EvolveSaveRtuPollScheduleGroupRequest,
  RTUPollScheduleType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import MessageBlock from 'components/MessageBlock';
import { FormikHelpers, FormikProps } from 'formik';
import { formatValidationErrors } from 'utils/format/errors';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { useParams } from 'react-router';
import BackIconButton from 'components/buttons/BackIconButton';
import moment from 'moment';
import EntityDetails from 'components/EntityDetails';
import PageIntro from './components/PageIntro';
import ObjectForm from './components/ObjectForm';
import type { Values } from './components/ObjectForm/types';

const formatDateToTime = (date?: Date | null) => {
  const defaultTime = '00:00';
  if (!date) {
    return defaultTime;
  }

  const momentDate = moment(date);
  return momentDate.isValid()
    ? momentDate.format(moment.HTML5_FMT.TIME_SECONDS) // Example: 01:20
    : defaultTime;
};

const formatFormValues = (values: Values) => {
  return {
    ...values,
    minDataAge: values.minDataAge || 0,
    interval: values.interval || 0,
    // NOTE: This is the result of using @material-ui/pickers which uses a date
    // instead of a string for their "time" input
    // @ts-ignore
    offsetTime: formatDateToTime(values.offsetTime),
    rtuPollSchedules:
      values.typeOfSchedule !== RTUPollScheduleType.PointInTime
        ? []
        : values.rtuPollSchedules?.map((schedule) => ({
            ...schedule,
            // @ts-ignore
            scheduledPollTime: formatDateToTime(schedule.scheduledPollTime),
          })),
  };
};

interface RouteParams {
  pollScheduleId: string;
}

const PollScheduleEditor = () => {
  const params = useParams<RouteParams>();
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [
    editComponents,
    setEditComponents,
  ] = useState<EvolveRetrieveRtuPollScheduleGroupEditComponentsByIdResponse | null>();
  const [editComponentsError, setEditComponentsError] = useState<any>();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [savedData, setSavedData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<any>();
  const [submissionError, setSubmissionError] = useState<any>();

  const editingObjectId = params.pollScheduleId;
  const isCreating = !editingObjectId;

  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);
    return AdminApiService.RTUService.retrieveRtuPollScheduleGroupEditComponentsById_RetrieveRtuPollScheduleGroupEditComponentsById(
      {
        ...(editingObjectId && {
          rtuPollScheduleGroupId: editingObjectId,
        }),
        loadEditComponents: true,
      } as EvolveRetrieveRtuPollScheduleGroupEditComponentsByIdRequest
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
    return AdminApiService.RTUService.saveRtuPollScheduleGroup_SaveRtuPollScheduleGroup(
      {
        rtuPollScheduleGroup: {
          ...formatFormValues(values),
          domainId,
        },
      } as EvolveSaveRtuPollScheduleGroupRequest
    )
      .then((response) => {
        const validationErrors =
          response.saveRtuPollScheduleGroupResult?.editObject?.validationErrors;
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
    editComponents?.retrieveRtuPollScheduleGroupEditComponentsByIdResult
      ?.editObject;

  const pollScheduleErrors = formInstance?.errors.rtuPollSchedules;
  const isPollScheduleListValid =
    !Array.isArray(pollScheduleErrors) ||
    pollScheduleErrors.length === 0 ||
    pollScheduleErrors.find((schedule) => typeof schedule === 'string');

  return (
    <>
      <PageIntroWrapper sticky>
        <PageIntro
          isCreating={isCreating}
          isSubmitting={isSubmitting}
          submissionResult={submissionResult}
          refetchEditData={refetchEditData}
          submitForm={formInstance?.submitForm}
          isValid={isPollScheduleListValid}
          headerNavButton={<BackIconButton />}
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
                    submissionResult={submissionResult}
                    submissionError={submissionError}
                    timezones={
                      editComponents
                        ?.retrieveRtuPollScheduleGroupEditComponentsByIdResult
                        ?.timezones
                    }
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
    </>
  );
};

export default PollScheduleEditor;
