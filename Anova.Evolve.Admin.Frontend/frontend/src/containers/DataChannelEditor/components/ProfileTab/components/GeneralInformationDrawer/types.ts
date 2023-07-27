import { DataChannelDataSource, GasMixerCategory } from 'api/admin/api';

export interface Values {
  dataChannelDescription: string;
  dataChannelTemplateId: string;
  serialNumber: string;
  dataChannelDataSourceTypeId: DataChannelDataSource | '';

  // Additional asset properties
  gasMixerDataChannelTypeId: GasMixerCategory | '';

  // Fields shown when the data source is RTU
  rtuId: string;
  rtuChannelId: string;

  // Fields shown when the data source is PublishedDataChannel
  publishedDataChannelSourceDataChannelId: string;
  publishedDataChannelSourceDomainId: string;
  publishedCommentsId: number | '';

  // Remaining fields
  // "Set As Primary" field, was previously named setAsMaster
  setAsPrimary: boolean;
}

export type MockDataChannelTemplate = any;
export type RetrieveDataChannelGeneralInfo = any;
export type SaveDataChannelGeneralInfo = any;
