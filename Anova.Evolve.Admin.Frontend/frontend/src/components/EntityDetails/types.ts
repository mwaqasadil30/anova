export interface ExtraDetail {
  label: string;
  value: React.ReactNode;
}

export interface DetailsProps {
  createdDate?: Date | null;
  createdByUsername?: string | null;
  createdByUserName?: string | null; // For the older, inconsistently named props in back-end apis
  lastUpdatedDate?: Date | null;
  lastUpdateUsername?: string | null;
  lastUpdateUserName?: string | null; // For the older, inconsistently named props in back-end apis
  // NOTE:
  // Example below of which types are used for the inconsistent prop names
  // lastUpdateUsername?: EditBase['lastUpdateUsername'];
  // lastUpdateUserName?:
  //   | BaseDTO['lastUpdateUserName']
  //   | LevelDataChannelGeneralInfo['lastUpdateUserName'];
}
