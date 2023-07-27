/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { DataChannelReportDTO } from 'api/admin/api';
import CancelButton from 'components/buttons/CancelButton';
import SaveButton from 'components/buttons/SaveButton';
import { FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Values } from './types';

enum SaveType {
  Save = 'save',
  SaveAndExit = 'save-and-exit',
}

const StyledPageHeaderText = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`;

const StyledPageHeaderSubText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 400;
  color: ${(props) => props.theme.palette.text.secondary};
`;

interface Props<T = any> {
  dataChannelDetails?: DataChannelReportDTO | null;
  disableSaveButton?: boolean;
  showSaveButton?: boolean;
  isSubmitting: boolean;
  submissionResult?: boolean;
  headerNavButton?: React.ReactNode;
  submitForm?: FormikProps<Values>['submitForm'];
  cancelCallback: () => void;
  saveCallback?: (response: T) => void;
}

const CustomPageIntro = ({
  dataChannelDetails,
  showSaveButton,
  isSubmitting,
  submissionResult,
  headerNavButton,
  saveCallback,
  cancelCallback,
  submitForm,
}: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    cancelCallback();
  };

  const submit = () => {
    submitForm?.().then(() => {
      setSaveType(SaveType.Save);
    });
  };
  const dataChannelDescription = dataChannelDetails?.dataChannelDescription;
  const formattedEventEditorPageIntroTitle = dataChannelDescription
    ? `${t(
        'ui.dataChannel.editDataChannelEvents',
        'Edit Data Channel Events'
      )} - ${dataChannelDescription}`
    : t('ui.dataChannel.editDataChannelEvents', 'Edit Data Channel Events');

  const assetTypeText = dataChannelDetails?.assetInfo?.assetTypeAsText || '-';
  const assetTitleText = dataChannelDetails?.assetInfo?.assetTitle || '-';

  const formattedPageIntroSubtitle = `${t(
    'ui.asset.assettype',
    'Asset Type'
  )}: ${assetTypeText} | ${t('ui.common.asset', 'Asset')}: ${assetTitleText}`;

  useEffect(() => {
    if (!submissionResult || isSubmitting) {
      return;
    }

    if (saveType === SaveType.Save) {
      saveCallback?.(submissionResult);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [submissionResult, saveType, history, isSubmitting]);

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        {headerNavButton && <Grid item>{headerNavButton}</Grid>}
        <Grid item xs zeroMinWidth>
          <Grid container direction="column">
            <Grid item xs zeroMinWidth>
              <StyledPageHeaderText
                title={formattedEventEditorPageIntroTitle}
                noWrap
              >
                {formattedEventEditorPageIntroTitle}
              </StyledPageHeaderText>
            </Grid>
            <Grid item xs zeroMinWidth>
              <StyledPageHeaderSubText
                title={formattedPageIntroSubtitle}
                noWrap
              >
                {formattedPageIntroSubtitle}
              </StyledPageHeaderSubText>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <CancelButton onClick={cancel} fullWidth />
            </Grid>
            {showSaveButton && (
              <Grid item>
                <SaveButton
                  onClick={submit}
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomPageIntro;
