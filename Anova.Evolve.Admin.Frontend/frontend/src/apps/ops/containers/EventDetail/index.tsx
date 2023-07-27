import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useParams } from 'react-router-dom';
import CircularProgress from 'components/CircularProgress';
import MessageBlock from 'components/MessageBlock';
import Fade from '@material-ui/core/Fade';
import { useEventDetails } from './hooks/useEventDetails';
import { DetailsCard } from './components/DetailsCard';
import { Heading } from './components/Heading';
import { EventTabs } from './components/EventTabs';

type EventDetailProps = { eventId: number };
const EventDetail = ({ eventId }: EventDetailProps) => {
  const { eventDetails, isLoading } = useEventDetails(eventId);
  const [notes, setNotes] = useState(eventDetails?.notes);

  useEffect(() => {
    setNotes(eventDetails?.notes);
  }, [eventDetails?.notes]);

  return (
    <>
      <Fade in={isLoading} unmountOnExit>
        <div>
          {isLoading && (
            <MessageBlock>
              <CircularProgress />
            </MessageBlock>
          )}
        </div>
      </Fade>
      <Fade in={!isLoading}>
        <div>
          {!isLoading && (
            <>
              <Heading {...eventDetails} />
              <Box marginTop={4}>
                <DetailsCard {...eventDetails} />
              </Box>
              <Box marginTop={3}>
                <EventTabs
                  eventId={eventId}
                  notes={notes}
                  setNotes={setNotes}
                  notifications={eventDetails?.notifications}
                />
              </Box>
            </>
          )}
        </div>
      </Fade>
    </>
  );
};

type RouteProps = Omit<React.ComponentProps<typeof EventDetail>, 'eventId'>;
const RouteHandler = (props: RouteProps) => {
  const { eventId } = useParams();
  return <EventDetail eventId={Number(eventId)} {...props} />;
};

export default RouteHandler;
