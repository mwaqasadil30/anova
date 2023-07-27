import { RtuSearchResultDTOColumnId } from './types';

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case RtuSearchResultDTOColumnId.Selection:
      return 'Selection';
    case RtuSearchResultDTOColumnId.DeviceId:
      return 'Device ID';
    case RtuSearchResultDTOColumnId.AssetId:
      return 'Asset ID';
    case RtuSearchResultDTOColumnId.AssetTitle:
      return 'Asset Title';
    case RtuSearchResultDTOColumnId.CarrierId:
      return 'Carrier ID';
    case RtuSearchResultDTOColumnId.CarrierName:
      return 'Carrier Name';
    case RtuSearchResultDTOColumnId.DeviceNetworkAddress:
      return 'Device Network Address';
    case RtuSearchResultDTOColumnId.DomainName:
      return 'Domain';
    case RtuSearchResultDTOColumnId.NetworkAddress:
      return 'Network Address';
    case RtuSearchResultDTOColumnId.SiteTitle:
      return 'Site Title';
    case RtuSearchResultDTOColumnId.SiteId:
      return 'Site ID';
    case RtuSearchResultDTOColumnId.RtuChannelCount:
      return 'RTU Channels';
    case RtuSearchResultDTOColumnId.DataChannelCount:
      return 'Data Channels';
    case RtuSearchResultDTOColumnId.LatestPacketTimeStamp:
      return 'Latest Packet Stamp';
    case RtuSearchResultDTOColumnId.LastBatteryVoltage:
      return 'Last Battery Voltage';
    case RtuSearchResultDTOColumnId.LastBatteryVoltageTimestamp:
      return 'Last Battery Voltage Timestamp';
    case RtuSearchResultDTOColumnId.IsDeleted:
      return 'Deleted';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case RtuSearchResultDTOColumnId.Selection:
      return 50;
    case RtuSearchResultDTOColumnId.AssetTitle:
      return 200;
    case RtuSearchResultDTOColumnId.SiteTitle:
      return 200;
    case RtuSearchResultDTOColumnId.RtuChannelCount:
      return 50;
    case RtuSearchResultDTOColumnId.DataChannelCount:
      return 50;
    case RtuSearchResultDTOColumnId.LatestPacketTimeStamp:
      return 150;
    case RtuSearchResultDTOColumnId.LastBatteryVoltageTimestamp:
      return 150;
    default:
      return 130;
  }
};
