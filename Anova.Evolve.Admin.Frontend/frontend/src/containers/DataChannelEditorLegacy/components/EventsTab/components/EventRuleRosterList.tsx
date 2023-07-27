import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { EventRoster } from '../types';
import { StyledListItemText, StyledOrderedList, TitleText } from './styled';

interface Props {
  rosters?: EventRoster[] | null;
}

const EventRuleRosterList = ({ rosters }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container alignItems="center" spacing={1}>
      <Grid item xs={12}>
        <TitleText>{t('ui.datachanneleventrule.rosters', 'Rosters')}</TitleText>
      </Grid>
      <Grid item xs={12}>
        {!rosters?.length ? (
          <StyledListItemText>
            {t('ui.common.notapplicable', 'N/A')}
          </StyledListItemText>
        ) : (
          <StyledOrderedList>
            {rosters?.map((roster) => {
              return (
                <li>
                  <StyledListItemText>{roster.description}</StyledListItemText>
                </li>
              );
            })}
          </StyledOrderedList>
        )}
      </Grid>
    </Grid>
  );
};

export default EventRuleRosterList;
