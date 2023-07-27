export enum PacketColumnId {
  DeviceId = 'deviceId',
  ChannelNumber = 'channelNumber',
  CommunicationMethod = 'communicationMethod',
  Address = 'address',
  ServerTimestamp = 'serverTimestamp',
  RtuTimestamp = 'rtuTimestamp',
  PacketId = 'packetId',
  PacketType = 'packetType',
  SequenceNumber = 'sequenceNumber',
  ProcessState = 'processState',
  Payload = 'payload',
  AdditionalInformation = 'additionalInformation',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case PacketColumnId.DeviceId:
      return 'Device ID';
    case PacketColumnId.ChannelNumber:
      return 'Channel number';
    case PacketColumnId.CommunicationMethod:
      return 'Communication method';
    case PacketColumnId.Address:
      return 'Address';
    case PacketColumnId.ServerTimestamp:
      return 'Server timestamp';
    case PacketColumnId.RtuTimestamp:
      return 'RTU timestamp';
    case PacketColumnId.PacketId:
      return 'Packet ID';
    case PacketColumnId.PacketType:
      return 'Packet type';
    case PacketColumnId.SequenceNumber:
      return 'Sequence number';
    case PacketColumnId.ProcessState:
      return 'Process state';
    case PacketColumnId.Payload:
      return 'Payload';
    case PacketColumnId.AdditionalInformation:
      return 'Additional information';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case PacketColumnId.DeviceId:
      return 150;
    case PacketColumnId.ChannelNumber:
      return 120;
    case PacketColumnId.CommunicationMethod:
      return 135;
    case PacketColumnId.Address:
      return 180;
    case PacketColumnId.ServerTimestamp:
      return 211;
    case PacketColumnId.RtuTimestamp:
      return 190;
    case PacketColumnId.PacketId:
      return 140;
    case PacketColumnId.PacketType:
      return 200;
    case PacketColumnId.SequenceNumber:
      return 185;
    case PacketColumnId.Payload:
    case PacketColumnId.AdditionalInformation:
      return 250;
    case PacketColumnId.ProcessState:
    default:
      return 165;
  }
};
