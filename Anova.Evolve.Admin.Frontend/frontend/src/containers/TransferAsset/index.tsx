/* eslint-disable indent */
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import {
  EvolveRetrieveTransferAssetProcessInfoByOptionsResponse,
  EvolveRetrieveTransferAssetProcessInfoByOptionsRequest,
  EvolveTransferAssetsRequest,
  EvolveTransferAssetsResponse,
  SaveResultType,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import CircularProgress from 'components/CircularProgress';
import MessageBlock from 'components/MessageBlock';
import { FormikHelpers, FormikProps } from 'formik';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { formatValidationErrors } from 'utils/format/errors';
import { parseAssetTransferQuery } from 'apps/admin/utils/routes';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import uniqBy from 'lodash/uniqBy';
import { useTranslation } from 'react-i18next';
import ObjectForm from './components/ObjectForm';
import type { Values } from './components/ObjectForm/types';
import PageIntro from './components/PageIntro';
import WarningDialog from './components/WarningDialog';
import TransferSummaryTable from './components/TransferSummaryTable';

const unquoteKeys = (obj?: any | null) => {
  return Object.entries(obj || {}).reduce((prev, [key, value]) => {
    const unquotedKey = key.replace(/\D/g, '');
    // @ts-ignore
    prev[unquotedKey] = value;
    return prev;
  }, {});
};

const formatSubmissionData = (values: Values) => {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { transferOtherAssetsUsingTheSameRtu, ...actualFormValues } = values;

  return {
    ...actualFormValues,
    // NOTE: The field name is quoted because in some cases the values
    // (like eventRuleGroup.eventRuleGroupId) are integers. Formik
    // treats integers in nested fields as arrays instead of objects.
    // This is a workaround.
    eventRuleGroupMappings: unquoteKeys(values.eventRuleGroupMappings),
    eventRuleMappings: unquoteKeys(values.eventRuleMappings),
    rosterMappings: unquoteKeys(values.rosterMappings),
    // An empty object is required for the back-end
    siteMappings: {},
    assetIdMappings: {},
    dataChannelMappings: {},
    dataChannelTemplateMappings: {},
  };
};

type SubmissionResult =
  | {
      errors: any;
      response?: never;
    }
  | {
      response: EvolveTransferAssetsResponse;
      errors?: never;
    };

const TransferAsset = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const transferIdsFromQueryString = useMemo(
    () => parseAssetTransferQuery(location.search),
    [location.search]
  );

  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();
  const [isFetchingEditData, setIsFetchingEditData] = useState(false);
  const [
    editComponents,
    setEditComponents,
  ] = useState<EvolveRetrieveTransferAssetProcessInfoByOptionsResponse | null>();
  const [editComponentsError, setEditComponentsError] = useState<any>();
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const [savedData, setSavedData] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState<any>();
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult>();
  const [submissionError, setSubmissionError] = useState<any>();

  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const assetTransferEditData =
    editComponents?.retrieveTransferAssetProcessInfoByOptionsResult;

  const editDetails = assetTransferEditData?.editObject;
  const assetsToTransfer = assetTransferEditData?.assets;

  const fetchEditData = useCallback(() => {
    setIsFetchingEditData(true);
    return AdminApiService.AssetService.retrieveTransferAssetProcessInfoByOptions_RetrieveTransferAssetProcessInfoByOptions(
      {
        options: {
          transferAssetIds: transferIdsFromQueryString,
        },
      } as EvolveRetrieveTransferAssetProcessInfoByOptionsRequest
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
  }, [transferIdsFromQueryString]);

  useEffect(() => {
    if (transferIdsFromQueryString.length > 0) {
      fetchEditData();
    }
  }, [fetchEditData]);

  const refetchEditData = () => {
    fetchEditData();
  };

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    setIsSubmitting(true);
    setSubmissionError(undefined);
    setSubmissionResult(undefined);

    return AdminApiService.AssetService.transferAssets_TransferAssets({
      item: {
        ...formatSubmissionData(values),
        assetIds: assetsToTransfer
          ?.map((asset) => asset.assetId)
          .filter(Boolean),
        sourceDomainId: domainId,
      },
    } as EvolveTransferAssetsRequest)
      .then((response) => {
        const validationErrors =
          response.transferAssetsResult?.editObject?.validationErrors;
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

  const selectedOriginalAssets = assetsToTransfer?.filter(
    (asset) => asset.isOriginalSelected
  );
  const associatedAssets = assetsToTransfer?.filter(
    (asset) => !asset.isOriginalSelected
  );

  const validEventRuleGroupAssets = assetsToTransfer?.filter(
    (asset) => asset.eventRuleGroupId
  );
  const uniqueEventRuleGroups = uniqBy(
    validEventRuleGroupAssets,
    'eventRuleGroupId'
  );

  const eventRuleGroups = uniqueEventRuleGroups.map((eventRuleGroup) => {
    const eventRules = validEventRuleGroupAssets
      ?.flatMap((asset) => asset.dataChannels)
      .filter(
        (dataChannel) =>
          dataChannel?.eventRuleGroupId === eventRuleGroup.eventRuleGroupId
      )
      .flatMap((channel) => channel?.eventRules);
    const uniqueEventRules = uniqBy(eventRules, 'eventRuleId');

    return {
      ...eventRuleGroup,
      uniqueEventRules,
    };
  });

  const flatDataChannels = assetsToTransfer?.flatMap(
    (asset) => asset.dataChannels
  );
  const uniqueDataChannels = uniqBy(flatDataChannels, 'dataChannelId');

  // Handle event rules: asset.dataChannels[].eventRules
  const flatEventRules = uniqueDataChannels?.flatMap(
    (channel) => channel?.eventRules
  );
  const uniqueEventRules = uniqBy(flatEventRules, 'dataChannelEventRuleId');

  // Handle rosters: asset.dataChannels[].eventRules[].rosters[]
  const flatRosters = uniqueEventRules.flatMap((rule) => rule?.rosters);
  const uniqueRosters = uniqBy(flatRosters, 'rosterId');

  // Handle products: asset.dataChannels[].productName
  const validProducts = uniqueDataChannels.filter(
    (channel) => channel?.productId
  );
  const uniqueProducts = uniqBy(validProducts, 'productId');

  // Handle tank dimensions: asset.dataChannels[].tankDimensionName
  const validTankDimensions = uniqueDataChannels.filter(
    (channel) => channel?.tankDimensionId
  );
  const uniqueTankDimensions = uniqBy(validTankDimensions, 'tankDimensionId');

  const complexNestingMessageText = t(
    'ui.assetTransfer.complexNestingOfAssetsAndRtus',
    'Complex Nesting of Asset(s) and RTU(s) are detected. Asset Transfer is disabled.'
  );
  const noAssetsMessageText = t(
    'ui.assetTransfer.noRtuAssociationWithAssets',
    'There is no RTU association with the selected Asset(s). Asset Transfer is disabled.'
  );

  let warningDialogMessage = '';
  if (assetTransferEditData?.hasComplexNestedAssets) {
    warningDialogMessage = complexNestingMessageText;
  } else if (
    assetTransferEditData?.assets?.length === 0 ||
    transferIdsFromQueryString.length === 0
  ) {
    warningDialogMessage = noAssetsMessageText;
  }

  if (warningDialogMessage) {
    return <WarningDialog open message={warningDialogMessage} />;
  }

  const transferAssetsResult = submissionResult?.response?.transferAssetsResult;
  const isTransferSuccessful =
    transferAssetsResult?.result === SaveResultType.Success;

  return (
    <>
      <PageIntroWrapper sticky>
        <PageIntro
          isSubmitting={isSubmitting}
          refetchEditData={refetchEditData}
          submitForm={formInstance?.submitForm}
          showFinishedAction={isTransferSuccessful}
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
        <Fade in={!!transferAssetsResult} unmountOnExit>
          <TransferSummaryTable
            assetsToTransfer={assetsToTransfer}
            transferredAssets={transferAssetsResult?.transferResults}
          />
        </Fade>
        <Fade
          in={
            !editComponentsError && !isFetchingEditData && !transferAssetsResult
          }
          unmountOnExit
        >
          <div>
            {!editComponentsError && !isFetchingEditData && (
              <Grid
                container
                spacing={2}
                direction="column"
                justify="space-between"
              >
                <Grid item xs={12}>
                  <ObjectForm
                    initialValues={editDetails}
                    onSubmit={handleSubmit}
                    handleFormChange={handleFormChange}
                    submissionError={submissionError}
                    selectedOriginalAssets={selectedOriginalAssets}
                    associatedAssets={associatedAssets}
                    eventRuleGroups={eventRuleGroups}
                    rosters={uniqueRosters}
                    products={uniqueProducts}
                    tankDimensions={uniqueTankDimensions}
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

export default TransferAsset;
