import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import releaseNotes from 'assets/release_notes.json';
import WorldMapImage from 'components/images/WorldMapImage';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import PageHeader from 'components/PageHeader';
import PageSubHeader from 'components/PageSubHeader';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { ReleaseNoteMapping, ReleaseNoteType, WorkItem } from './types';

const StyledWorldMap = styled(WorldMapImage)`
  position: fixed;
  padding: ${(props) => props.theme.spacing(1)}px;
  top: 200px;
  right: 50px;
  opacity: 0.6;
`;

const StyledPageSubheader = styled(PageSubHeader)`
  margin-bottom: ${(props) => props.theme.spacing(2)}px;
`;

const NoteTitle = styled(Typography)`
  font-size: 18px;
`;

const dateFormat = 'YYYY-MM-DD';

const sortDatesInDescendingOrder = (
  dateString1: string,
  dateString2: string
) => {
  return (
    Number(moment(dateString2, dateFormat)) -
    Number(moment(dateString1, dateFormat))
  );
};

const sortWorkItemsAlphabetically = (
  workItem1: WorkItem,
  workItem2: WorkItem
) => {
  if (workItem1.WorkItemReleaseNotes < workItem2.WorkItemReleaseNotes) {
    return -1;
  }
  if (workItem1.WorkItemReleaseNotes > workItem2.WorkItemReleaseNotes) {
    return 1;
  }
  return 0;
};

const ReleaseNotes = () => {
  const { t } = useTranslation();
  const topOffset = useSelector(selectTopOffset);

  const typedReleaseNotes = releaseNotes as ReleaseNoteMapping;

  const sortedDates = Object.keys(typedReleaseNotes).sort(
    sortDatesInDescendingOrder
  );

  return (
    <div>
      <PageIntroWrapper sticky topOffset={topOffset}>
        <PageHeader dense>
          {t('ui.main.releaseNotes', 'Release Notes')}
        </PageHeader>
      </PageIntroWrapper>

      <Box mt={4}>
        <StyledWorldMap />
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {sortedDates.map((dateKey) => {
                const formattedDate = moment(dateKey, dateFormat).format(
                  dateFormat
                );

                const releaseNotesForDate = typedReleaseNotes[dateKey];

                const newFeaturesAndEnhancements = releaseNotesForDate
                  .filter(
                    (note) => note.WorkItemType === ReleaseNoteType.Feature
                  )
                  .sort(sortWorkItemsAlphabetically);
                const fixes = releaseNotesForDate
                  .filter((note) => note.WorkItemType === ReleaseNoteType.Fix)
                  .sort(sortWorkItemsAlphabetically);

                return (
                  <Grid key={dateKey} item xs={12}>
                    <StyledPageSubheader dense>
                      {formattedDate}
                    </StyledPageSubheader>
                    {!!newFeaturesAndEnhancements.length && (
                      <>
                        <NoteTitle variant="h6">
                          {t(
                            'ui.releaseNotes.newFeaturesAndEnhancements',
                            'New Features and Enhancements'
                          )}
                        </NoteTitle>
                        <ul>
                          {newFeaturesAndEnhancements.map((note, index) => (
                            <li key={index}>
                              <Typography>
                                {note.WorkItemReleaseNotes}{' '}
                                {!!note.WorkItemId && `[${note.WorkItemId}]`}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                    {!!fixes.length && (
                      <>
                        <NoteTitle variant="h6">
                          {t('ui.releaseNotes.fixes', 'Fixes')}
                        </NoteTitle>
                        <ul>
                          {fixes.map((note, index) => (
                            <li key={index}>
                              <Typography>
                                {note.WorkItemReleaseNotes}{' '}
                                {!!note.WorkItemId && `[${note.WorkItemId}]`}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item xs={12} md={6} style={{ position: 'relative' }}>
            <Grid container spacing={2}>
              <Grid item>
                <StyledPageSubheader dense>
                  {t('ui.events.note', 'Note')}
                </StyledPageSubheader>
                <Typography>
                  {t(
                    'ui.releaseNotes.note.primary',
                    'These release notes describe functionality that may not be available for all users. Depending on your user role, you might not see all items described in these release notes.'
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ReleaseNotes;
