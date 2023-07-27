import {
  DomainEventsDto,
  EventInfoRecord,
  EvolveUpdateEventToAcknowledgeEventRequest,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import moment from 'moment';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Row } from 'react-table';
import { selectUser } from 'redux-app/modules/user/selectors';
import { formatModifiedDatetime } from 'utils/format/dates';

export const useUpdateEventToAcknowledgeEvent = () => {
  const user = useSelector(selectUser);
  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;
  const userName =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.username;

  const [setAcknowledgeError] = useState<any | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const acknowledgeUpdate = (
    eventId: number,
    rows: Row<EventInfoRecord>[] | Row<DomainEventsDto>[]
  ) => {
    const acknowledgeTime = formatModifiedDatetime(moment().utc().toDate());

    // NOTE: Previously this was using a rowIndex to update the acknowlegement
    // values which was causing issues. It's now using the eventId instead
    // which works, but is still mutating data. In the future it might be
    // better to update the data source directly, instead of updating the table
    // state.
    // @ts-ignore
    const updatedRow = rows.find((row) => row.original.eventId === eventId);
    if (updatedRow) {
      updatedRow.values.acknowledgedOn = acknowledgeTime;
      updatedRow.values.acknowledgeUserName = userName;
      updatedRow.values.acknowledgeUserId = userId;
    }
  };

  const updateEventToAcknowledgeEvent = (
    eventId: number,
    rows: Row<EventInfoRecord>[] | Row<DomainEventsDto>[]
  ) => {
    setIsFetching(true);
    AdminApiService.EventService.updateEventToAcknowledgeEvent_UpdateEventToAcknowledgeEvent(
      {
        acknowledgedUserId: userId,
        eventId,
      } as EvolveUpdateEventToAcknowledgeEventRequest
    )
      .then((response) => {
        if (response.updateEventToAcknowledgeEventResult) {
          acknowledgeUpdate(eventId, rows);
        }
      })
      .catch((error) => {
        setAcknowledgeError(error);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return { isFetching, makeRequest: updateEventToAcknowledgeEvent };
};
