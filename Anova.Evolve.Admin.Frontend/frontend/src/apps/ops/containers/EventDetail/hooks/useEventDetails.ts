import {
  DataChannelType,
  EditEventNote,
  EventImportanceLevelType,
  EventRosterDetailInfo,
  EventRuleType,
  EventStatusType,
  EvolveRetrieveEventDetailByIdRequest,
  EvolveRetrieveEventDetailByIdResponse,
  RetrieveEventDetailResult,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'utils/format/numbers';
import { buildDataChannelTypeTextMapping } from 'utils/i18n/enum-to-text';

// helper methods to translate API terms into UI terms
const getAckBy = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.acknowledgeUserName;
const getAckOn = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.acknowledgedOn;
const getAssetName = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.assetTitle; // FIXME: assetTitle
const getAssetId = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.assetId;
const getEventCreatedDate = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.createdDate;
const getDataChannel = (
  data: RetrieveEventDetailResult,
  textMapping: Record<DataChannelType, string>
) => textMapping[data?.eventInfo?.dataChannelType!];
const getDataChannelDescription = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.dataChannelDescription;
const getEventMessage = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.message;
const getEventName = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.eventRuleDescription;
const getImportance = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.eventImportanceLevel;
const getReadingTimestamp = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.readingTimestamp;
const getStatus = (data: RetrieveEventDetailResult) =>
  data?.eventInfo?.eventStatus;
const getReadingValue = (data: RetrieveEventDetailResult) =>
  isNumber(data?.eventInfo?.readingDisplayValue)
    ? `${data?.eventInfo?.readingDisplayValue} ${data?.eventInfo?.readingDisplayUnit}`
    : '-';
const getRosterNames = (data: RetrieveEventDetailResult) =>
  data.eventInfo?.eventRosters
    ?.map((roster) => roster.rosterName)
    .filter(Boolean);
const getNotes = (data: RetrieveEventDetailResult) => data.eventNotes;
const getNotifications = (data: RetrieveEventDetailResult) =>
  data.eventRosterDetails;
const getEventRuleType = (data: RetrieveEventDetailResult) =>
  data.eventInfo?.eventRuleType;
const getPercentFull = (data: EvolveRetrieveEventDetailByIdResponse) =>
  data.percentFull;
export type EventDetails = {
  acknowledgedBy?: string;
  acknowledgedOn?: Date;
  assetTitle?: string;
  assetName?: string;
  assetId?: string;
  createdDate?: Date;
  dataChannel?: string;
  dataChannelDescription?: string;
  eventMessage?: string;
  eventName?: string;
  importance?: EventImportanceLevelType;
  status: EventStatusType;
  notes: EditEventNote[];
  notifications: EventRosterDetailInfo[];
  readingTimestamp?: Date;
  readingValue?: string;
  eventRosters?: string[];
  eventRuleType?: EventRuleType;
  percentFull?: number | null;
};

interface ApiOptions {
  dataChannelTypeTextMapping: Record<DataChannelType, string>;
}

const getEventDetailsFromApi = (eventId: number, options: ApiOptions) =>
  ApiService.EventService.retrieveEventDetailById_RetrieveEventDetailById({
    eventId,
  } as EvolveRetrieveEventDetailByIdRequest)
    .then((res) => res || ({} as EvolveRetrieveEventDetailByIdResponse))
    .then((response) => {
      const result =
        response.retrieveEventDetailByIdResult ||
        ({} as RetrieveEventDetailResult);
      return {
        acknowledgedBy: getAckBy(result),
        acknowledgedOn: getAckOn(result),
        assetName: getAssetName(result),
        assetId: getAssetId(result),
        createdDate: getEventCreatedDate(result),
        dataChannel: getDataChannel(result, options.dataChannelTypeTextMapping),
        dataChannelDescription: getDataChannelDescription(result),
        eventMessage: getEventMessage(result),
        eventName: getEventName(result),
        importance: getImportance(result),
        status: getStatus(result),
        notes: getNotes(result),
        notifications: getNotifications(result),
        readingTimestamp: getReadingTimestamp(result),
        readingValue: getReadingValue(result),
        eventRosters: getRosterNames(result),
        eventRuleType: getEventRuleType(result),
        percentFull: getPercentFull(response),
      } as EventDetails;
    });

export const useEventDetails = (eventId: number) => {
  const { t } = useTranslation();
  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const [eventDetails, setEventDetails] = useState<EventDetails>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchEventDetails = () => {
    setIsLoading(true);
    return getEventDetailsFromApi(eventId, { dataChannelTypeTextMapping })
      .then(setEventDetails)
      .catch(setError)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  return { eventDetails, isLoading, error, refetch: fetchEventDetails };
};
