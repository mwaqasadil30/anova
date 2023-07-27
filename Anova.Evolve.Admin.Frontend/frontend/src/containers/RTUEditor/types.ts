export enum RTUEditorTab {
  Configuration = 'configuration',
  History = 'history',
  PacketsAndCallHistory = 'packets-and-call-history',
  TransactionDetails = 'transactionDetails',
}

export interface RTUEditorLocationState {
  tab?: RTUEditorTab;
}

export type CommunicationTableType = {
  parameter?: string | null;
  local?: string | null;
  remote?: string | null;
};
