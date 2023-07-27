import { DataChannelType } from 'api/admin/api';

export interface Values {
  deviceId?: string | null;
  diagnosticChannel?: DataChannelType[] | null;
}
