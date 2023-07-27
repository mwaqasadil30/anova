import {
  EventImportanceLevelType,
  EventInfoRecord,
  EventInfoRetrievalOptionsDto,
  EventRecordStatus,
  EventRuleType,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import { TableDataForDownload } from 'utils/format/dataExport';

export interface GetDisplayableValueOptions {
  t: TFunction;
  importanceLevelTextMapping: Record<EventImportanceLevelType, string>;
  eventRuleTypeTextMapping: Record<EventRuleType, string>;
  selectedEventStatus: EventRecordStatus;
}

export interface TableDataForDownloadWithEventStatus<T extends object>
  extends TableDataForDownload<T> {
  eventStatus: EventRecordStatus;
}

export interface InactiveEventSummaryApiHook {
  isLoadingInitial: boolean;
  isFetching: boolean;
  error: any;
  records: EventInfoRecord[];
  totalRows: number;
  pageCount?: number;
  startTimer: Date | null;
  endTimer: Date | null;
  endPageTimer: Date | null;
  apiDuration: number | null;
  makeRequest: (
    request: Omit<EventInfoRetrievalOptionsDto, 'init' | 'toJSON'>
  ) => void;
}
