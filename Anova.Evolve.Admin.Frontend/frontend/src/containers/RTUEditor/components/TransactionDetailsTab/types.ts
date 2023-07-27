export type TransactionDateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

export type TransactionDetailsTableInfo = {
  hornerTransactionJournalId?: number;
  batchTime?: Date;
  pin?: number;
  startTime?: Date;
  startPressure?: number | null;
  startTankPressure?: number | null;
  startTankTemperature?: number | null;
  product?: number | null;
  endTime?: Date | null;
  endPressure?: number;
  flow?: number;
  communicationType?: number | null;
  shutdownReasonCode?: number;
  duration?: number;
  fuelTemperature?: number | null;
  endTankPressure?: number | null;
  endTankTemperature?: number | null;
  fillCounter?: number;
  nonResettingFlowTotal?: number;
};
