import { RTUPollScheduleType, EditRtuPollSchedule } from 'api/admin/api';

export interface Values {
  rtuPollScheduleGroupId?: string;
  name?: string | null;
  domainId?: string;
  typeOfSchedule?: RTUPollScheduleType;
  interval?: number;
  offsetTime?: string;
  timeZoneId?: number | null;
  minDataAge?: number;
  rtuPollSchedules?: EditRtuPollSchedule[] | null;
}
