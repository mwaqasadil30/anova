import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  EvolveAddDiagnosticDataChannelRequest,
  EvolveRetrieveAssetDiagnosticDataChannelsByRtuRequest,
  EvolveRetrieveAssetDiagnosticDataChannelsByRtuResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { parseResponseError, parseResponseSuccess } from 'utils/api/handlers';
import FormPageIntro from '../FormPageIntro';
import { CommonDataChannelFormProps } from '../types';
import ObjectForm from './components/ObjectForm';
import type { Values } from './components/ObjectForm/types';

const DiagnosticChannelForm = ({
  assetId,
  addDataChannels,
  handleCancel,
}: CommonDataChannelFormProps) => {
  const { t } = useTranslation();
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [editDataError, setEditDataError] = useState<any>();
  const [editData, setEditData] = useState<
    EvolveRetrieveAssetDiagnosticDataChannelsByRtuResponse['supportedDiagnosticChannels']
  >();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<any>();
  const [submissionError, setSubmissionError] = useState<any>();

  const retrieveDataChannelsByRtu = () => {
    setIsFetchingEditData(true);
    setEditDataError(undefined);

    if (!assetId) {
      return null;
    }

    return ApiService.AssetService.retrieveAssetDiagnosticDataChannelsByRtu_RetrieveAssetDiagnosticDataChannelsByRtu(
      {
        assetId,
      } as EvolveRetrieveAssetDiagnosticDataChannelsByRtuRequest
    )
      .then((response) => {
        setEditData(response.supportedDiagnosticChannels);
      })
      .catch(setEditDataError)
      .finally(() => setIsFetchingEditData(false));
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    return ApiService.DataChannelService.addDiagnosticDataChannel_AddDiagnosticDataChannel(
      {
        assetId,
        deviceId: values.deviceId,
        diagnosticChannel: values.diagnosticChannel,
      } as EvolveAddDiagnosticDataChannelRequest
    )
      .then((response) => {
        const result = parseResponseSuccess(response);
        addDataChannels(response.dataChannels);
        setSubmissionResult(result);
        return submissionResult;
      })
      .catch((error) => {
        const errorResult = parseResponseError(error);
        if (errorResult) {
          formikBag.setErrors(errorResult.errors);
          setSubmissionResult(errorResult);
        } else {
          setSubmissionError(error);
        }
      })
      .finally(() => setIsSubmitting(false));
  };

  const handleFormChange = (formik: FormikProps<Values>) => {
    setFormInstance(formik);
  };

  useEffect(() => {
    retrieveDataChannelsByRtu();
  }, [assetId]);

  return (
    <>
      <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
        <FormPageIntro
          title={t('ui.asset.addDiagnosticChannel', 'Add Diagnostic Channel')}
          isSubmitting={isSubmitting}
          handleCancel={handleCancel}
          handleSave={formInstance?.submitForm}
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
        <Fade in={!editDataError && !isFetchingEditData}>
          <div>
            {!editDataError && !isFetchingEditData && (
              <Grid
                container
                spacing={2}
                direction="column"
                justify="space-between"
              >
                <Grid item>
                  <ObjectForm
                    onSubmit={handleSubmit}
                    handleFormChange={handleFormChange}
                    submissionError={submissionError}
                    supportedDiagnosticChannels={editData || {}}
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

export default DiagnosticChannelForm;
