/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import {
  EvolveRetrieveDomainEditComponentsByIdRequest,
  EvolveRetrieveDomainEditComponentsByIdResponse,
  EvolveSaveDomainAdditionalRequest,
  EvolveSaveDomainAdditionalResponse,
  EvolveSaveDomainRequest,
  EvolveSaveDomainResponse,
  UpdateDomainNotesRequest,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { DomainId } from 'apps/admin/routes';
import BackIconButton from 'components/buttons/BackIconButton';
import CircularProgress from 'components/CircularProgress';
import EntityDetails from 'components/NewEntityDetails';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { SubmissionResult } from 'form-utils/types';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useQueryClient } from 'react-query';
import { APIQueryKey } from 'api/react-query/helpers';
import { setActiveDomainById } from 'redux-app/modules/app/actions';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { DEFAULT_DOMAIN_THEME_COLOR } from 'styles/colours';
import { parseResponseError } from 'utils/api/handlers';
import { formatValidationErrors } from 'utils/format/errors';
import ObjectForm from './components/ObjectForm';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import useGetDomainAdditionalById from './hooks/useGetDomainAdditionalById';
import useGetDomainNotes from './hooks/useGetDomainNotes';
import useSaveDomainNotes from './hooks/useSaveDomainNotes';

const StyledTabs = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      marginLeft: -theme.spacing(3),
      marginRight: -theme.spacing(3),
      paddingLeft: theme.spacing(3),
    },
    indicator: {
      backgroundColor: theme.custom.domainColor,
      height: 3,
    },
  })
)(Tabs);

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.text.primary,
      textTransform: 'none',
      minWidth: 72,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      fontSize: 14,
      opacity: 1,
      '&$selected': {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    selected: {},
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface StyledTabProps {
  label: string;
}

interface RouteParams {
  [DomainId]: string;
}

const DomainEditor = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const params = useParams<RouteParams>();
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [
    editComponents,
    setEditComponents,
  ] = useState<EvolveRetrieveDomainEditComponentsByIdResponse | null>();
  const [editComponentsError, setEditComponentsError] = useState<any>();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [savedData, setSavedData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<
    SubmissionResult<EvolveSaveDomainResponse>
  >();
  const [submissionError, setSubmissionError] = useState<any>();

  // Domain Additional Info
  const [
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    domainAdditionalSavedData,
    setDomainAdditionalSavedData,
  ] = useState<any>();
  const [
    domainAdditionalIsSubmitting,
    setDomainAdditionalIsSubmitting,
  ] = useState<any>();
  const [
    // NOTE: The `domainAdditionalSubmissionResult` isn't needed at the moment.
    // This may change if we shift around how both of these APIs are handled
    // (saveDomain, saveDomainAdditional) since they should be specific to
    // individual tabs
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    domainAdditionalSubmissionResult,
    setDomainAdditionalSubmissionResult,
  ] = useState<SubmissionResult<EvolveSaveDomainAdditionalResponse>>();
  const [
    domainAdditionalSubmissionError,
    setDomainAdditionalSubmissionError,
  ] = useState<any>();

  const [domainNotesIsSubmitting, setDomainNotesIsSubmitting] = useState<any>();

  const [
    domainNotesSubmissionError,
    setDomainNotesSubmissionError,
  ] = useState<any>();

  const editingObjectId = params[DomainId];
  const isCreating = !editingObjectId;

  const activeDomain = useSelector(selectActiveDomain);

  const domainAdditionalApi = useGetDomainAdditionalById();
  const domainAdditionalInfo = domainAdditionalApi.data?.domainAdditionalInfo;
  const areThereDomainNotes =
    domainAdditionalApi.data?.domainAdditionalInfo?.areThereDomainNotes;

  const retrieveDomainNotesApi = useGetDomainNotes({
    ...(editingObjectId &&
      areThereDomainNotes && { domainId: editingObjectId }),
  });

  const queryClient = useQueryClient();

  const saveDomainNotesApi = useSaveDomainNotes({
    onMutate: () => setDomainNotesSubmissionError(false),
    onSuccess: () => {
      setDomainNotesIsSubmitting(false);
      queryClient.invalidateQueries([
        APIQueryKey.getDomainNotes,
        editingObjectId,
      ]);
    },
    onError: () => setDomainNotesSubmissionError(true),
  });

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);
    return AdminApiService.GeneralService.retrieveDomainEditComponentsById_RetrieveDomainEditComponentsById(
      {
        ...(editingObjectId && {
          domainId: editingObjectId,
        }),
        loadEditComponents: true,
      } as EvolveRetrieveDomainEditComponentsByIdRequest
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

  useEffect(() => void domainAdditionalApi.fetchEditData(editingObjectId), [
    editingObjectId,
  ]);

  useEffect(() => {
    fetchEditData();
  }, [fetchEditData]);

  const refetchEditData = () => {
    setSubmissionError(undefined);
    setDomainAdditionalSubmissionError(undefined);
    fetchEditData();
    retrieveDomainNotesApi.refetch();
    domainAdditionalApi.fetchEditData(editingObjectId);
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);
    const editComponentsEditObject =
      editComponents?.retrieveDomainEditComponentsByIdResult?.editObject;
    const saveDomainPromise = AdminApiService.GeneralService.saveDomain_SaveDomain(
      {
        item: {
          ...editComponentsEditObject,
          name: values.name,
          parentDomainId: values.parentDomainId,
          logo: values.logo,
        },
      } as EvolveSaveDomainRequest
    )
      .then((response) => {
        const validationErrors =
          response.saveDomainResult?.editObject?.validationErrors;
        const formattedValidationErrors = formatValidationErrors(
          validationErrors
        );
        if (
          formattedValidationErrors &&
          Object.keys(formattedValidationErrors).length > 0
        ) {
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
        const savedDomainId = response.saveDomainResult?.editObject?.id;
        if (savedDomainId && savedDomainId === activeDomain?.domainId) {
          dispatch(setActiveDomainById(savedDomainId));
        }
        return successResult;
      })
      .catch((error) => {
        setSubmissionError(error);
        return { errors: error };
      })
      .finally(() => {
        setIsSubmitting(false);
      });

    setDomainAdditionalIsSubmitting(true);
    setDomainAdditionalSubmissionError(undefined);
    setDomainAdditionalSubmissionResult(undefined);

    const {
      themeColor,
      ...domainHeliumIsoContainerValues
    } = values.domainHeliumIsoContainer;

    const saveDomainAdditionalPromise = AdminApiService.GeneralService.saveDomainAdditional_SaveDomainAdditional(
      {
        domainId: editingObjectId,
        themeColor: themeColor || DEFAULT_DOMAIN_THEME_COLOR,
        domainHeliumIsoContainer: {
          ...domainHeliumIsoContainerValues,
        },
      } as EvolveSaveDomainAdditionalRequest
    )
      .then((response) => {
        setDomainAdditionalSavedData(response);

        const successResult = { response };
        setDomainAdditionalSubmissionResult(successResult);
        const savedDomainId = editingObjectId;
        if (savedDomainId && savedDomainId === activeDomain?.domainId) {
          dispatch(setActiveDomainById(savedDomainId));
        }
        return successResult;
      })
      .catch((error) => {
        const errorResult = parseResponseError(error);

        setDomainAdditionalSubmissionError(errorResult);
        return errorResult;
      })
      .finally(() => {
        setDomainAdditionalIsSubmitting(false);
      });

    // todo: save only when it will change
    const notesParams = {
      notes: values.domainNotes,
      domainId: editingObjectId,
    } as UpdateDomainNotesRequest;

    const rowVersion = retrieveDomainNotesApi.data?.rowVersion;
    if (rowVersion) {
      notesParams.rowVersion = rowVersion;
    }

    setDomainNotesIsSubmitting(true);

    const saveDomaineNotesPromise = saveDomainNotesApi.mutate(notesParams);

    // TODO: `Promise.allSettled` may not be supported in the legacy version of
    // Microsoft Edge, but is supported in the Chromium version of Edge. Do we
    // need to support old Edge? If so, we need a polyfill
    return Promise.allSettled([
      saveDomainPromise,
      saveDomainAdditionalPromise,
      saveDomaineNotesPromise,
    ]).then((results) => {
      const errorsFromResults = results
        .filter(
          (result) =>
            // @ts-ignore
            result.status === 'fulfilled' && result.value?.errors
        )
        // @ts-ignore
        .map((result) => result.value?.errors);

      const formErrors = errorsFromResults.reduce(
        (prev, current) => ({
          ...prev,
          ...current,
        }),
        {}
      );

      // Since we should only set formik errors once, we do it here, after both
      // promises have settled.
      formikBag.setErrors(formErrors);
      formikBag.setStatus({ errors: formErrors });
    });
  };

  const handleFormChange = (formik: FormikProps<Values>) => {
    setFormInstance(formik);
  };

  const editDetails =
    editComponents?.retrieveDomainEditComponentsByIdResult?.editObject;

  const domainNotesData = useMemo(() => {
    return retrieveDomainNotesApi.data;
  }, [retrieveDomainNotesApi.data]);

  const domainNotes = retrieveDomainNotesApi.data?.notes || '';

  const noteEditDetails = {
    createdDate: domainNotesData?.createdDate,
    createdByUserName:
      domainNotesData?.createdByUsername || domainNotesData?.createdBy,
    lastUpdatedDate: domainNotesData?.lastUpdatedDate,
    lastUpdateUserName:
      domainNotesData?.lastUpdateUsername || domainNotesData?.lastUpdateUserId,
  };

  const formInitialValues = {
    ...editComponents,
    domainHeliumIsoContainer: {
      ...domainAdditionalInfo,
    },
    domainNotes,
  };

  const domainErrors = formInstance?.errors.name;
  const isDomainListValid =
    !Array.isArray(domainErrors) ||
    domainErrors.length === 0 ||
    domainErrors.find((schedule) => typeof schedule === 'string');

  const [activeTab, setActiveTab] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const anyIsSubmitting =
    isSubmitting || domainAdditionalIsSubmitting || domainNotesIsSubmitting;
  const anySubmissionError =
    submissionError ||
    domainAdditionalSubmissionError ||
    domainNotesSubmissionError;
  const isFetching = isFetchingEditData || domainAdditionalApi.isFetching;
  const anyEditComponentsError =
    editComponentsError || domainAdditionalApi.error;

  const domainNameForPageIntro = formInstance?.initialValues.name;

  return (
    <>
      <PageIntroWrapper
        sticky
        divider={
          <StyledTabs
            value={activeTab}
            onChange={handleChange}
            aria-label="Domain Editor tabs"
          >
            <StyledTab label={t('ui.common.general', 'General')} />
            <StyledTab label={t('ui.common.assets', 'Assets')} />
            <StyledTab label={t('ui.common.notes', 'Notes')} />
          </StyledTabs>
        }
      >
        <PageIntro
          isCreating={isCreating}
          domainName={domainNameForPageIntro}
          isSubmitting={anyIsSubmitting}
          submissionResult={submissionResult}
          domainAdditionalSubmissionResult={domainAdditionalSubmissionResult}
          submissionError={anySubmissionError}
          refetchEditData={refetchEditData}
          submitForm={formInstance?.submitForm}
          isValid={isDomainListValid}
          headerNavButton={<BackIconButton />}
        />
      </PageIntroWrapper>

      <Box mt={3}>
        <Fade in={isFetching} unmountOnExit>
          <div>
            {isFetching && (
              <MessageBlock>
                <CircularProgress />
              </MessageBlock>
            )}
          </div>
        </Fade>
        <Fade in={!isFetching && anyEditComponentsError} unmountOnExit>
          <div>
            {!isFetching && anyEditComponentsError && (
              <MessageBlock>
                <Typography variant="body2" color="error">
                  {t('ui.common.retrieveDataError', 'Unable to retrieve data')}
                </Typography>
              </MessageBlock>
            )}
          </div>
        </Fade>
        <Fade in={!anyEditComponentsError && !isFetching}>
          <div>
            {!anyEditComponentsError && !isFetching && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <ObjectForm
                    initialValues={formInitialValues}
                    onSubmit={handleSubmit}
                    handleFormChange={handleFormChange}
                    activeTab={activeTab}
                    editingDomainId={editingObjectId}
                    domains={
                      editComponents?.retrieveDomainEditComponentsByIdResult
                        ?.domains || []
                    }
                    eventRuleGroups={editComponents?.eventRuleGroups || []}
                    dataChannelTemplates={
                      editComponents?.dataChannelTemplates || []
                    }
                    heliumISOContainerDataChannel={
                      domainAdditionalApi.data?.heliumISOContainerDataChannel
                    }
                    isoContainerDefaultSiteInfo={
                      domainAdditionalInfo?.isoContainerDefaultSiteInfo
                    }
                    isoContainerDefaultHeliumProductInfo={
                      domainAdditionalInfo?.isoContainerDefaultHeliumProductInfo
                    }
                    isoContainerDefaultNitrogenProductInfo={
                      domainAdditionalInfo?.isoContainerDefaultNitrogenProductInfo
                    }
                  />
                </Grid>
                {editDetails && !isCreating && (
                  <Grid item xs={12} style={{ paddingTop: '0' }}>
                    <EntityDetails
                      details={activeTab === 2 ? noteEditDetails : editDetails}
                    />
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

export default DomainEditor;
