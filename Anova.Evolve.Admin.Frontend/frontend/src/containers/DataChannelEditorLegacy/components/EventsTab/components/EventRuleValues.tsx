import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ActiveText, InactiveText } from './styled';

interface Props {
  description: React.ReactNode;
  value: React.ReactNode;
  isActive?: boolean;
  valueAriaLabel?: string;
}

const EventRuleDetails = ({
  description,
  value,
  isActive,
  valueAriaLabel,
}: Props) => {
  const { t } = useTranslation();
  const TextComponent = isActive ? ActiveText : InactiveText;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} md={5}>
        <TextComponent>{description}</TextComponent>
      </Grid>
      <Grid item xs={12} md={7}>
        <TextComponent aria-label={valueAriaLabel || undefined}>
          {isActive ? value : t('ui.common.notapplicable', 'N/A')}
        </TextComponent>
      </Grid>
    </Grid>
  );
};

export default EventRuleDetails;
