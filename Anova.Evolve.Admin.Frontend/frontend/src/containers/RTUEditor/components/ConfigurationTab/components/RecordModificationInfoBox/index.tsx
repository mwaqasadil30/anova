import Grid from '@material-ui/core/Grid';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import FormatDateTime from 'components/FormatDateTime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const CustomTypography = (props: TypographyProps) => {
  return <Typography {...props} component="span" />;
};
const InfoLabel = styled(CustomTypography)`
  font-weight: 500;
`;
const InfoText = styled(CustomTypography)`
  font-weight: 400;
  font-size: 0.875rem;
  color: ${(props) => props.theme.palette.text.secondary};
`;
interface RecordModificationInfo {
  createdDate?: Date | null;
  lastUpdatedDate?: Date | null;
  createdByName?: string | null;
  lastUpdateUserName?: string | null;
}
type RecordModificationInfoProps = {
  modificationData?: RecordModificationInfo;
};
const RecordModificationInfoBox = ({
  modificationData,
}: RecordModificationInfoProps) => {
  const { t } = useTranslation();
  const { createdDate, lastUpdatedDate, createdByName, lastUpdateUserName } =
    modificationData || {};

  if (lastUpdateUserName && lastUpdatedDate)
    return (
      <Grid container justify="flex-end">
        <Grid>
          <InfoLabel variant="body2">
            {t('ui.common.lastUpdated', 'Last Updated')}:{' '}
          </InfoLabel>
          <InfoText variant="body1">
            <FormatDateTime date={lastUpdatedDate} /> by {lastUpdateUserName}
          </InfoText>
        </Grid>
      </Grid>
    );
  if (createdByName && createdDate)
    return (
      <Grid container justify="flex-end">
        <Grid>
          <InfoLabel variant="body2">
            {t('ui.common.created', 'Created')}:{' '}
          </InfoLabel>
          <InfoText variant="body1">
            <FormatDateTime date={createdDate} /> by {createdByName}
          </InfoText>
        </Grid>
      </Grid>
    );
  return null;
};
export default RecordModificationInfoBox;
