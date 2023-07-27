import { RosterDto } from 'api/admin/api';

export interface SaveCallbackOptions {
  openDrawer?: boolean;
}

export type SaveCallbackFunction = (
  response: RosterDto,
  options?: SaveCallbackOptions
) => void;
