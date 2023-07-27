import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { EvolveAddDigitalDataChannelRequest } from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { FormikHelpers, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { selectUser } from 'redux-app/modules/user/selectors';
import { parseResponseError, parseResponseSuccess } from 'utils/api/handlers';
import FormPageIntro from '../FormPageIntro';
import { CommonDataChannelFormProps, digitalChannelTypes } from '../types';
import ObjectForm from './components/ObjectForm';
import type { Values } from './components/ObjectForm/types';

const DigitalChannelForm = ({
  assetId,
  addDataChannels,
  dataChannelTemplates,
  eventRuleGroups,
  handleCancel,
}: CommonDataChannelFormProps) => {
  const { t } = useTranslation();
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<any>();
  const [submissionError, setSubmissionError] = useState<any>();

  const activeDomain = useSelector(selectActiveDomain);
  const user = useSelector(selectUser);
  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;
  const domainId = activeDomain?.domainId;

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    return ApiService.DataChannelService.addDigitalDataChannel_AddDigitalDataChannel(
      {
        assetId,
        digitalChannel: {
          ...values,
        },
      } as EvolveAddDigitalDataChannelRequest
    )
      .then((response) => {
        const result = parseResponseSuccess(response);
        addDataChannels([response.dataChannel]);
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

  const filteredDataChannelTemplates = dataChannelTemplates?.filter(
    (template) => digitalChannelTypes.includes(template.dataChannelType!)
  );

  return (
    <>
      <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
        <FormPageIntro
          title={t('ui.asset.addDigitalChannel', 'Add Digital Channel')}
          isSubmitting={isSubmitting}
          handleCancel={handleCancel}
          handleSave={formInstance?.submitForm}
        />
      </PageIntroWrapper>

      <Box mt={3}>
        <Grid container spacing={2} direction="column" justify="space-between">
          <Grid item>
            <ObjectForm
              domainId={domainId}
              userId={userId}
              initialValues={{}}
              onSubmit={handleSubmit}
              handleFormChange={handleFormChange}
              submissionResult={submissionResult}
              submissionError={submissionError}
              dataChannelTemplates={filteredDataChannelTemplates}
              eventRuleGroups={eventRuleGroups}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default DigitalChannelForm;
