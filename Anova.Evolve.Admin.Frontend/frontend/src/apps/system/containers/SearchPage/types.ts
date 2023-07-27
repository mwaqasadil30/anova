import {
  DomainDetailDto,
  RtuDeviceCategory,
  RTUSearchInfoListFilterOptionsEnum,
} from 'api/admin/api';

export interface DomainDetailDtoSearchListOption extends DomainDetailDto {
  isAllDomains?: boolean;
}

export enum NavigateToOptions {
  Rtu = 0,
  Asset = 1,
}

export interface RowIdentifier {
  rowIndex?: string | null;
  pageIndex?: number | null;
  domainId?: string | null;
  deviceId?: string | null;
  rtuCategoryId?: RtuDeviceCategory | null;
  naviagteTo?: NavigateToOptions;
  cellAssetId?: string;
}

export interface FilterByData {
  includeSubDomain: boolean;
  showDeleted: boolean;
  filterByColumn: RTUSearchInfoListFilterOptionsEnum;
  filterTextValue: string;
  sortByColumn?: string | null;
  domainId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface RouteState extends FilterByData {
  selectedDomain?: DomainDetailDto | null;
  searchSubmitted?: boolean;
  clickedRowIdentifier?: RowIdentifier | null;
  pageNumber?: number;
}

export enum RtuSearchResultDTOColumnId {
  Selection = 'selection',
  DeviceId = 'deviceId',
  AssetId = 'assetId',
  AssetTitle = 'assetTitle',
  CarrierId = 'carrierId',
  CarrierName = 'carrierName',
  DeviceNetworkAddress = 'deviceNetworkAddress',
  DomainName = 'domainName',
  NetworkAddress = 'networkAddress',
  SiteTitle = 'siteTitle',
  SiteId = 'siteId',
  RtuChannelCount = 'rtuChannelCount',
  DataChannelCount = 'dataChannelCount',
  LatestPacketTimeStamp = 'latestPacketTimeStamp',
  LastBatteryVoltage = 'lastBatteryVoltage',
  LastBatteryVoltageTimestamp = 'lastBatteryVoltageTimestamp',
  IsDeleted = 'isDeleted',
}
