import { RosterUserSummaryDto } from 'api/admin/api';

export interface Values {
  description: string;
  isEnabled: boolean;
  userCount?: number;
  dataChannelCount?: number;
  rosterUsers?: RosterUserSummaryDto[] | null;
}
