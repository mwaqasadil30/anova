import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { EditEventNote, EventRosterDetailInfo } from 'api/admin/api';
import Avatar from 'components/Avatar';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import FormatDateTime from 'components/FormatDateTime';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AddNote from './AddNote';
import { Notifications } from './Notifications';

const StyledAuthorName = styled(Typography)`
  font-weight: 500;
  font-size: 16px;
`;

const StyledUserAndDate = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

const StyledNoteText = styled(Typography)`
  font-size: 14px;
  line-height: 26px;
`;

interface NoteProps {
  note: EditEventNote;
}

const Note = ({ note }: NoteProps) => (
  <Box marginTop={3}>
    <Grid container spacing={1}>
      <Grid item xs={12} md="auto">
        <Grid container spacing={1} style={{ marginRight: 50 }}>
          <Grid item>
            <Box marginRight={2}>
              <Avatar>{note.createdByUsername?.charAt(0).toUpperCase()}</Avatar>
            </Box>
          </Grid>
          <Grid item xs>
            <StyledAuthorName aria-label="Note author username">
              {note.createdByUsername}
            </StyledAuthorName>

            <StyledUserAndDate aria-label="Note create date">
              <FormatDateTime date={note.createdDate} />
            </StyledUserAndDate>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md>
        <Box marginTop={{ xs: 1, md: 0 }}>
          <StyledNoteText aria-label="Note text">{note.note}</StyledNoteText>
        </Box>
      </Grid>
    </Grid>
  </Box>
);

type NotesProps = {
  eventId: number;
  notes?: EditEventNote[];
  handleSave(note?: EditEventNote | null): void;
};

const Notes = ({ eventId, notes, handleSave }: NotesProps) => {
  return (
    <CustomBoxRedesign pt={1} pb={2} px={2}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {!!notes?.length && notes?.map((note) => <Note note={note} />)}
        </Grid>
        {notes?.length !== 0 && (
          <Grid item xs={12}>
            <Divider />
          </Grid>
        )}
        <Grid item xs={12}>
          <AddNote onSave={handleSave} eventId={eventId} />
        </Grid>
      </Grid>
    </CustomBoxRedesign>
  );
};

interface EventTabsProps {
  eventId: number;
  notes?: EditEventNote[];
  notifications?: EventRosterDetailInfo[];
  setNotes(notes: EditEventNote[]): void;
}

export const EventTabs = ({
  eventId,
  notes,
  notifications,
  setNotes,
}: EventTabsProps) => {
  const { t } = useTranslation();

  const tabs = [
    {
      label: t('ui.common.notes', 'Notes'),
      component: () => (
        <Notes
          eventId={eventId}
          notes={notes}
          handleSave={(note) => {
            if (note) {
              setNotes([note, ...(notes || [])]);
            }
          }}
        />
      ),
    },
    {
      label: t('ui.events.notifications', 'Notifications'),
      component: () => <Notifications rosterInfo={notifications} />,
    },
  ];
  const [active, setActive] = useState(0);
  const handleChange = (event: React.ChangeEvent<{}>, selectedTab: number) =>
    setActive(selectedTab);
  return (
    <Box>
      <Tabs
        value={active}
        onChange={handleChange as React.ComponentProps<typeof Tabs>['onChange']}
      >
        {tabs.map(({ label }) => (
          <Tab label={label} />
        ))}
      </Tabs>
      {tabs.map(({ component: Content }, idx) =>
        active === idx ? (
          <Box mt={3}>
            <Content />
          </Box>
        ) : null
      )}
    </Box>
  );
};
