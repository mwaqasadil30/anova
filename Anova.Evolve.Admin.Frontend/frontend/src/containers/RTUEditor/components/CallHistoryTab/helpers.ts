export interface ParametersDrawerDetails {
  label: string;
  value: string;
}

export enum CallHistoryColumnId {
  JournalStatus = 'journalStatus',
  CreatedDate = 'createdDate',
  ConnectTimestamp = 'connectTimestamp',
  ErrorType = 'errorType',
  ErrorDescription = 'errorDescription',
  RtuProtocol = 'rtuProtocol',
  Transport = 'transport',
  Direction = 'isOutbound', // This one might cause some confusion
  Duration = 'duration',
  ByteCount = 'totalDataTransmitted', // This one might cause some confusion
  RemoteAddress = 'remoteAddress',
  LocalAddress = 'localAddress',
  SessionServer = 'sessionServer',
  Expander = 'expander',
  // ConnectTimestamp = 'connectTimestamp', // the hidden column i cant see in the picture
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case CallHistoryColumnId.JournalStatus:
      return 'Status';
    case CallHistoryColumnId.CreatedDate:
      return 'Created date';
    case CallHistoryColumnId.ConnectTimestamp:
      return 'Time of connect';
    case CallHistoryColumnId.ErrorType:
      return 'Error type';
    case CallHistoryColumnId.ErrorDescription:
      return 'Error description';
    case CallHistoryColumnId.RtuProtocol:
      return 'Rtu protocol';
    case CallHistoryColumnId.Transport:
      return 'Transport';
    case CallHistoryColumnId.Direction:
      return 'Direction';
    case CallHistoryColumnId.Duration:
      return 'Duration';
    case CallHistoryColumnId.ByteCount:
      return 'Byte count';
    case CallHistoryColumnId.RemoteAddress:
      return 'Remote address';
    case CallHistoryColumnId.LocalAddress:
      return 'Local address';
    case CallHistoryColumnId.SessionServer:
      return 'Session Server';
    case CallHistoryColumnId.Expander:
      return 'Expander or collapse cell';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case CallHistoryColumnId.ErrorDescription:
      return 300;
    case CallHistoryColumnId.JournalStatus:
      return 100;
    case CallHistoryColumnId.ByteCount:
      return 68;
    case CallHistoryColumnId.Transport:
    case CallHistoryColumnId.SessionServer:
      return 99;
    case CallHistoryColumnId.Direction:
      return 95;
    case CallHistoryColumnId.RtuProtocol:
      return 90;
    case CallHistoryColumnId.Expander:
      return 40;
    default:
      return 165;
  }
};

// Session Journal (Second nested) Table
export enum SessionJournalColumnId {
  SessionType = 'sessionType',
  SessionJournalStatus = 'journalStatus',
  CreatedDate = 'createdDate',
  ErrorType = 'errorType',
  ErrorDescription = 'errorDescription',
  SessionSource = 'sessionSource',
  SessionAttemptCount = 'sessionAttemptCount',
  RequestParameters = 'requestParameters',
  ResponseParameters = 'responseParameters',
  Duration = 'duration',
  CompletedTransactions = 'transactionIndex',
  TotalTransactions = 'transactionTotal',
  Expander = 'expander',
}

export const sessionJournalColumnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case SessionJournalColumnId.SessionType:
      return 'Session type';
    case SessionJournalColumnId.SessionJournalStatus:
      return 'Session journal status';
    case SessionJournalColumnId.CreatedDate:
      return 'Created date';
    case SessionJournalColumnId.ErrorType:
      return 'Error type';
    case SessionJournalColumnId.ErrorDescription:
      return 'Error description';
    case SessionJournalColumnId.SessionSource:
      return 'Session source';
    case SessionJournalColumnId.SessionAttemptCount:
      return 'Session attempt count';
    case SessionJournalColumnId.RequestParameters:
      return 'Request parameters';
    case SessionJournalColumnId.ResponseParameters:
      return 'Response parameters';
    case SessionJournalColumnId.Duration:
      return 'Duration';
    case SessionJournalColumnId.CompletedTransactions:
      return 'Completed transactions';
    case SessionJournalColumnId.TotalTransactions:
      return 'Total transactions';
    case SessionJournalColumnId.Expander:
      return 'Expander or collapse cell';
    default:
      return '';
  }
};

export const getColumnWidthForSessionJournal = (columnId: string) => {
  switch (columnId) {
    case SessionJournalColumnId.RequestParameters:
    case SessionJournalColumnId.ResponseParameters:
    case SessionJournalColumnId.CompletedTransactions:
    case SessionJournalColumnId.TotalTransactions:
      return 105;
    case SessionJournalColumnId.SessionAttemptCount:
    case SessionJournalColumnId.Duration:
      return 80;
    case SessionJournalColumnId.Expander:
      return 40;
    default:
      return 165;
  }
};

export const isRecordDisabledForSessionJournalTable = () => false;

// Transaction Journal (Third nested) Table
export enum TransactionJournalColumnId {
  TransactionType = 'transactionType',
  TransactionJournalStatus = 'journalStatus',
  CreatedDate = 'createdDate',
  ErrorType = 'errorType',
  ErrorDescription = 'errorDescription',
  Duration = 'duration',
  RequestParameters = 'requestParameters',
  ResponseParameters = 'responseParameters',
}

export const TransactionJournalColumnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case TransactionJournalColumnId.TransactionType:
      return 'Transaction type';
    case TransactionJournalColumnId.TransactionJournalStatus:
      return 'Transaction journal status';
    case TransactionJournalColumnId.CreatedDate:
      return 'Created date';
    case TransactionJournalColumnId.ErrorType:
      return 'Error type';
    case TransactionJournalColumnId.ErrorDescription:
      return 'Error description';
    case TransactionJournalColumnId.Duration:
      return 'Duration';
    case TransactionJournalColumnId.RequestParameters:
      return 'Request parameters';
    case TransactionJournalColumnId.ResponseParameters:
      return 'Response parameters';
    default:
      return '';
  }
};

export const getColumnWidthForTransactionJournal = (columnId: string) => {
  switch (columnId) {
    case TransactionJournalColumnId.TransactionType:
      return 300;
    case TransactionJournalColumnId.RequestParameters:
    case TransactionJournalColumnId.ResponseParameters:
      return 105;
    case TransactionJournalColumnId.Duration:
      return 80;
    default:
      return 155;
  }
};

export const isRecordDisabledForTransactionTable = () => false;
