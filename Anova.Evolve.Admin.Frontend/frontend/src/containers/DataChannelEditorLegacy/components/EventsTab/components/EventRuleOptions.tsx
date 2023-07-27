import Grid from '@material-ui/core/Grid';
import { ReactComponent as BlockedIcon } from 'assets/icons/blocked.svg';
import { ReactComponent as CheckmarkIcon } from 'assets/icons/events-checkmark.svg';
import React from 'react';
import { ActiveText, InactiveText } from './styled';

interface Props {
  description: React.ReactNode;
  isActive?: boolean;
  optionAriaLabel?: string;
}

const EventRuleOptions = ({
  description,
  isActive,
  optionAriaLabel,
}: Props) => {
  const TextComponent = isActive ? ActiveText : InactiveText;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        {isActive ? (
          <CheckmarkIcon aria-label="Checkmark icon" />
        ) : (
          <BlockedIcon aria-label="Blocked icon" />
        )}
      </Grid>
      <Grid item>
        <TextComponent aria-label={optionAriaLabel || undefined}>
          {description}
        </TextComponent>
      </Grid>
    </Grid>
  );
};

export default EventRuleOptions;
