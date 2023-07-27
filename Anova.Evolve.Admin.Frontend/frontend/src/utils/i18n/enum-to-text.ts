import {
  APCITankFunctionType,
  APCIUnitType,
  AssetType,
  AuditType,
  TelecommunicationsCarrier,
  DataChannelDataSource,
  DataChannelType,
  EventComparatorType,
  EventImportanceLevelType,
  EventInventoryStatusType,
  EventRuleInventoryStatus,
  EventRuleType,
  ForecastModeType,
  ForecastMode,
  FtpFileFormatCategory,
  GasMixerDataChannelType,
  GeoAreaCategory,
  HornerRtuCategory,
  HornerRtuMode,
  OverallPasswordStrength,
  RtuPacketStatus,
  RtuPacketType,
  RtuPacketCategory,
  ProblemReportPriorityEnum,
  RcmJournalItemStatusEnum,
  RTUAutoTimingCorrectionSourceEnum,
  RTUCategoryType,
  RTUPollScheduleType,
  RtuProtocolTypeEnum,
  RTUTransportTypeEnum,
  RTUType,
  ScalingModeType,
  SupportedUOMType,
  TankType,
  TransferAssetResultStatusType,
  UnitConversionModeEnum,
  UnitType,
  UnitTypeEnum,
  UserRoleTypeEnum,
  UserType,
  VirtualChannelOperatorType,
  RtuCallDirection,
  RtuDeviceType,
  RtuDevicePollFilter,
  Metron2RTUChannelInputSignalType,
} from 'api/admin/api';
import { AssetSubTypeEnum } from 'apps/freezers/types';
import { ProblemReportStatusFilterEnum } from 'apps/ops/types';
import { TFunction } from 'i18next';
import { ReadingsChartZoomLevel, UnitDisplayType } from 'types';

export enum RtuPacketsChannelTypeForFilter {
  Any = -1,
  Inbound = 0,
  Outbound = 1,
}

export const buildRTUCommunicationDirectionTextMapping = (
  t: TFunction
): Record<RtuPacketsChannelTypeForFilter, string> => {
  return {
    [RtuPacketsChannelTypeForFilter.Any]: t(
      'enum.commdirectiontype.any',
      'Any'
    ),
    [RtuPacketsChannelTypeForFilter.Inbound]: t(
      'enum.rtucommunicationdirection.inbound',
      'Inbound'
    ),
    [RtuPacketsChannelTypeForFilter.Outbound]: t(
      'enum.rtucommunicationdirection.outbound',
      'Outbound'
    ),
  };
};

export const buildMetronRTUCommunicationDirectionTextMapping = (
  t: TFunction
): Record<RtuCallDirection, string> => {
  return {
    [RtuCallDirection.Both]: t('enum.commdirectiontype.both', 'Both'),
    [RtuCallDirection.Inbound]: t(
      'enum.rtucommunicationdirection.inbound',
      'Inbound'
    ),
    [RtuCallDirection.Outbound]: t(
      'enum.rtucommunicationdirection.outbound',
      'Outbound'
    ),
  };
};

export const buildMetronRTOChannelInputSignalTypeTextMapping = (
  t: TFunction
): Record<Metron2RTUChannelInputSignalType, string> => {
  return {
    [Metron2RTUChannelInputSignalType.MAmps4To20]: t(
      'enum.inputsignaltype.4to20mA',
      '4 to 20 mA'
    ),
    [Metron2RTUChannelInputSignalType.Volts0To10]: t(
      'enum.inputsignaltype.0to10Volts',
      '0 to 10 Volts'
    ),
  };
};

export const buildPacketTypeGroupTextMapping = (t: TFunction) => {
  return {
    [RtuPacketCategory.Configuration]: t(
      'enum.packettypegroup.configuration',
      'Configuration'
    ),
    [RtuPacketCategory.Data]: t('enum.packettypegroup.data', 'Data'),
    [RtuPacketCategory.Initial]: t('enum.packettypegroup.initial', 'Initial'),
    [RtuPacketCategory.Unknown]: t('enum.packettypegroup.unknown', 'Unknown'),
  };
};

export enum RtuPacketsChannelType {
  ChannelOne = '1',
  ChannelTwo = '2',
  ChannelThree = '3',
  ChannelFour = '4',
  ChannelFive = '5',
  ChannelSix = '6',
  ChannelSeven = '7',
  ChannelEight = '8',
  GpsChannel = 'Gps',
}

export const buildRtuChannelTypeTextMapping = (t: TFunction) => {
  return {
    [RtuPacketsChannelType.ChannelOne]: t('enum.rtuchannelnumbertype.one', '1'),
    [RtuPacketsChannelType.ChannelTwo]: t('enum.rtuchannelnumbertype.two', '2'),
    [RtuPacketsChannelType.ChannelThree]: t(
      'enum.rtuchannelnumbertype.three',
      '3'
    ),
    [RtuPacketsChannelType.ChannelFour]: t(
      'enum.rtuchannelnumbertype.four',
      '4'
    ),
    [RtuPacketsChannelType.ChannelFive]: t(
      'enum.rtuchannelnumbertype.five',
      '5'
    ),
    [RtuPacketsChannelType.ChannelSix]: t('enum.rtuchannelnumbertype.six', '6'),
    [RtuPacketsChannelType.ChannelSeven]: t(
      'enum.rtuchannelnumbertype.seven',
      '7'
    ),
    [RtuPacketsChannelType.ChannelEight]: t(
      'enum.rtuchannelnumbertype.eight',
      '8'
    ),
    [RtuPacketsChannelType.GpsChannel]: t(
      'enum.rtuchannelnumbertype.gps',
      'GPS'
    ),
  };
};

export const buildRtuStatusTypeTextMapping = (t: TFunction) => {
  return {
    [RcmJournalItemStatusEnum.Complete]: t(
      'enum.rcmjournalstatustype.complete',
      'Complete'
    ),
    [RcmJournalItemStatusEnum.Failed]: t(
      'enum.rcmjournalstatustype.failed',
      'Failed'
    ),
    [RcmJournalItemStatusEnum.Initialized]: t(
      'enum.rcmjournalstatustype.initialized',
      'Initialized'
    ),
    [RcmJournalItemStatusEnum.Partial]: t(
      'enum.rcmjournalstatustype.partial',
      'Partial'
    ),
    [RcmJournalItemStatusEnum.Processing]: t(
      'enum.rcmjournalstatustype.processing',
      'Processing'
    ),
  };
};

export const buildPacketTypeTextMapping = (t: TFunction) => {
  return {
    [RtuPacketType.AdditionalConfigurationAndStatusTransmission]: t(
      'enum.packettype.additionalconfigurationtransmission',
      'Additional Configuration Transmission'
    ),
    [RtuPacketType.AdHocDataPacket]: t(
      'enum.packettype.adhocdatatransmission',
      'Adhoc Data Transmission'
    ),
    [RtuPacketType.CommunicationsUpdate]: t(
      'enum.packettype.communicationsupdate',
      'Communications Update'
    ),
    [RtuPacketType.CounterPacket]: t(
      'enum.packettype.counterpackettransmission',
      'Counter Packet Transmission'
    ),
    [RtuPacketType.CurrentConfigurationTransmission]: t(
      'enum.packettype.currentconfigurationtransmission',
      'Current Configuration Transmission'
    ),
    [RtuPacketType.FourHundredSeriesAdHocLoggedDataReport]: t(
      'enum.packettype.400seriesadhocloggeddatareport',
      '400 Series Ad-hoc Logged Data Report'
    ),
    [RtuPacketType.FourHundredSeriesAnalogInputAdditionalConfig]: t(
      'enum.packettype.400seriesanaloginputadditionalconfig',
      '400 Series Analog Input Additional Config'
    ),
    [RtuPacketType.FourHundredSeriesAnalogInputAdditionalConfigResponse]: t(
      'enum.packettype.400seriesanaloginputadditionalconfigresponse',
      '400 Series Analog Input Additional Config Response'
    ),
    [RtuPacketType.FourHundredSeriesAnalogInputConfig]: t(
      'enum.packettype.400seriesanaloginputconfig',
      '400 Series Analog Input Config'
    ),
    [RtuPacketType.FourHundredSeriesAnalogInputConfigResponse]: t(
      'enum.packettype.400seriesanaloginputconfigresponse',
      '400 Series Analog Input Config Response'
    ),
    [RtuPacketType.FourHundredSeriesAnalogInputStrappingChart]: t(
      'enum.packettype.400seriesanaloginputstrappingchart',
      '400 Series Analog Input Strapping Chart'
    ),
    [RtuPacketType.FourHundredSeriesAnalogInputStrappingChartResponse]: t(
      'enum.packettype.400seriesanaloginputstrappingchartresponse',
      '400 Series Analog Input Strapping Chart Response'
    ),
    [RtuPacketType.FourHundredSeriesAnalogLoggedDataReport]: t(
      'enum.packettype.400seriesanalogloggeddatareport',
      '400 Series Analog Logged Data Report'
    ),
    [RtuPacketType.FourHundredSeriesAnalogOutputConfig]: t(
      'enum.packettype.400seriesanalogoutputconfig',
      '400 Series Analog Output Config'
    ),
    [RtuPacketType.FourHundredSeriesAnalogOutputConfigResponse]: t(
      'enum.packettype.400seriesanalogoutputconfigresponse',
      '400 Series Analog Output Config Response'
    ),
    [RtuPacketType.FourHundredSeriesCounterInputConfig]: t(
      'enum.packettype.400seriescounterinputconfig',
      '400 Series Counter Input Config'
    ),
    [RtuPacketType.FourHundredSeriesCounterInputConfigResponse]: t(
      'enum.packettype.400seriescounterinputconfigresponse',
      '400 Series Counter Input Config Response'
    ),
    [RtuPacketType.FourHundredSeriesCounterLoggedDataReport]: t(
      'enum.packettype.400seriescounterloggeddatareport',
      '400 Series Counter Logged Data Report'
    ),
    [RtuPacketType.FourHundredSeriesDataNetworkAccessCommunicationsConfig]: t(
      'enum.packettype.400seriesdatanetworkaccesscommunicationsconfig',
      '400 Series Data Network Access Communications Config'
    ),
    [RtuPacketType.FourHundredSeriesDataNetworkAccessCommunicationsConfigResponse]: t(
      'enum.packettype.400seriesdatanetworkaccesscommunicationsconfigresponse',
      '400 Series Data Network Access Communications Config Response'
    ),
    [RtuPacketType.FourHundredSeriesDigitalInputConfig]: t(
      'enum.packettype.400seriesdigitalinputconfig',
      '400 Series Digital Input Config'
    ),
    [RtuPacketType.FourHundredSeriesDigitalInputConfigResponse]: t(
      'enum.packettype.400seriesdigitalinputconfigresponse',
      '400 Series Digital Input Config Response'
    ),
    [RtuPacketType.FourHundredSeriesDigitalLoggedDataReport]: t(
      'enum.packettype.400seriesdigitalloggeddatareport',
      '400 Series Digital Logged Data Report'
    ),
    [RtuPacketType.FourHundredSeriesDigitalOutputConfig]: t(
      'enum.packettype.400seriesdigitaloutputconfig',
      '400 Series Digital Output Config'
    ),
    [RtuPacketType.FourHundredSeriesDigitalOutputConfigResponse]: t(
      'enum.packettype.400seriesdigitaloutputconfigresponse',
      '400 Series Digital Output Config Response'
    ),
    [RtuPacketType.FourHundredSeriesDolv3AccessCommunicationsConfig]: t(
      'enum.packettype.400seriesdolv3accesscommunicationsconfig',
      '400 Series DOLv3 Access Communications Config'
    ),
    [RtuPacketType.FourHundredSeriesDolv3AccessCommunicationsConfigResponse]: t(
      'enum.packettype.400seriesdolv3accesscommunicationsconfigresponse',
      '400 Series DOLv3 Access Communications Config Response'
    ),
    [RtuPacketType.FourHundredSeriesGprsTerminationRequest]: t(
      'enum.packettype.400seriesgprsterminationrequest',
      '400 Series GPRS Termination Request'
    ),
    [RtuPacketType.FourHundredSeriesGpsConfig]: t(
      'enum.packettype.400seriesgpsconfig',
      '400 Series Gps Config'
    ),
    [RtuPacketType.FourHundredSeriesGpsConfigResponse]: t(
      'enum.packettype.400seriesgpsconfigresponse',
      '400 Series Gps Config Response'
    ),
    [RtuPacketType.FourHundredSeriesGpsLocationLoggedDataReport]: t(
      'enum.packettype.400seriesgpslocationloggeddatareport',
      '400 Series Gps Location Logged Data Report'
    ),
    [RtuPacketType.FourHundredSeriesInitialConfig]: t(
      'enum.packettype.400seriesinitialconfig',
      '400 Series Initial Config'
    ),
    [RtuPacketType.FourHundredSeriesIridiumSatelliteCommunicationsConfig]: t(
      'enum.packettype.400seriesiridiumsatellitecommunicationsconfig',
      '400 Series Iridium Satellite Communications Config'
    ),
    [RtuPacketType.FourHundredSeriesIridiumSatelliteCommunicationsConfigResponse]: t(
      'enum.packettype.400seriesiridiumsatellitecommunicationsconfigresponse',
      '400 Series Iridium Satellite Communications Config Response'
    ),
    [RtuPacketType.FourHundredSeriesPollRequest]: t(
      'enum.packettype.400seriespollrequest',
      '400 Series Poll Request'
    ),
    [RtuPacketType.FourHundredSeriesRealtimeOutputDataReport]: t(
      'enum.packettype.400seriesrealtimeoutputdatareport',
      '400 Series Realtime Output Data Report'
    ),
    [RtuPacketType.FourHundredSeriesRealtimeRtuStatusInputDataReport]: t(
      'enum.packettype.400seriesrealtimertustatusinputdatareport',
      '400 Series Realtime RTU Status Input Data Report'
    ),
    [RtuPacketType.FourHundredSeriesSmsCommunicationsConfig]: t(
      'enum.packettype.400seriessmscommunicationconfig',
      '400 Series Sms Communication Config'
    ),
    [RtuPacketType.FourHundredSeriesSmsCommunicationsConfigResponse]: t(
      'enum.packettype.400seriessmscommunicationconfigresponse',
      '400 Series Sms Communication Config Response'
    ),
    [RtuPacketType.FourHundredSeriesSystemConfigResponse]: t(
      'enum.packettype.400seriessystemconfigresponse',
      '400 Series System Config Response'
    ),
    [RtuPacketType.FourHundredSeriesSystemConfigUpdate]: t(
      'enum.packettype.400seriessystemconfigupdate',
      '400 Series System Config Update'
    ),
    [RtuPacketType.FourHundredSeriesTimeUpdateRequest]: t(
      'enum.packettype.400seriestimeupdaterequest',
      '400 Series Time Update Request'
    ),
    [RtuPacketType.FourHundredSeriesTimeUpdateResponse]: t(
      'enum.packettype.400seriestimeupdateresponse',
      '400 Series Time Update Response'
    ),
    [RtuPacketType.GpsLocationTransmission]: t(
      'enum.packettype.gpslocationtransmission',
      'GPS Location Transmission'
    ),
    [RtuPacketType.Kt09InitializeSimRequest]: t(
      'enum.packettype.kt09initializesimrequest',
      'KT09 Initialize Request'
    ),
    [RtuPacketType.Kt09PollRequest]: t(
      'enum.packettype.kt09pollrequest',
      'KT09 Poll Request'
    ),
    [RtuPacketType.None]: t('ui.common.none', 'None'),
    [RtuPacketType.NetworkTimeSync]: t(
      'enum.packettype.networktimesync',
      'Network Time Sync'
    ),
    [RtuPacketType.PeriodicDataTransmission]: t(
      'enum.packettype.periodicdatatransmission',
      'Periodic Data Transmission'
    ),
    [RtuPacketType.RcmConfig]: t(
      'enum.packettype.rcmconfiguration',
      'Rcm RTU Configuration'
    ),
    [RtuPacketType.RcmReadings]: t(
      'enum.packettype.rcmreadings',
      'Rcm Readings'
    ),
    [RtuPacketType.ReadingsService]: t(
      'enum.packettype.readingsservice',
      'Readings Service Data Transmission'
    ),
    [RtuPacketType.TestConfigurationDataTransmission]: t(
      'enum.packettype.testconfigurationtransmission',
      'Test Configuration Transmission'
    ),
    [RtuPacketType.UpdateAdditionalConfiguration]: t(
      'enum.packettype.updateadditionalconfiguration',
      'Update Additional Configuration'
    ),
    [RtuPacketType.UpdateSystemConfiguration]: t(
      'enum.packettype.updatesystemconfiguration',
      'Update System Configuration'
    ),
    [RtuPacketType.UserRequestedDataTransmission]: t(
      'enum.packettype.userrequesteddatatransmission',
      'User Requested Data Transmission'
    ),
    [RtuPacketType.VistarAlarmDataTransmission]: t(
      'enum.packettype.vistarconfigurationrequest',
      'Vistar Configuration Request'
    ),
    [RtuPacketType.VistarConfigurationRecordType1]: t(
      'enum.packettype.vistarconfigurationupdate',
      'Vistar Configuration Update'
    ),
    [RtuPacketType.VistarConfigurationRecordType2]: t(
      'enum.packettype.vistarcurrentconfig1transmission',
      'Vistar Current Config 1 Transmission'
    ),
    [RtuPacketType.VistarConfigurationRequest]: t(
      'enum.packettype.vistarcurrentconfig2transmission',
      'Vistar Current Config 2 Transmission'
    ),
    [RtuPacketType.VistarConfigurationUpdate]: t(
      'enum.packettype.vistargpslocationtransmission',
      'Vistar GPS Location Transmission'
    ),
    [RtuPacketType.VistarDataRequest]: t(
      'enum.packettype.vistarleveleventdatatransmission',
      'Vistar Level Event Data Transmission'
    ),
    [RtuPacketType.VistarGpsLocationTransmission]: t(
      'enum.packettype.vistarperiodicdatatransmission',
      'Vistar Periodic Data Transmission'
    ),
    [RtuPacketType.VistarPeriodicDataTransmission]: t(
      'enum.packettype.vistarpollrequest',
      'Vistar Poll Request'
    ),
    [RtuPacketType.VistarTerminalAcknowledgment]: t(
      'enum.packettype.vistarterminalacknowledgement',
      'Vistar Terminal Acknowledgement'
    ),
    [RtuPacketType.VistarTerminalRegistration]: t(
      'enum.packettype.vistarterminalregistration',
      'Vistar Terminal Registration'
    ),
    // Manually translated enums
    [RtuPacketType.AlarmFillDataTransmission]: t(
      'enum.packettype.alarmFillDataTransmission',
      'Alarm Fill Data Transmission'
    ),
    [RtuPacketType.AlarmLowLevelTransmission]: t(
      'enum.packettype.alarmLowLevelTransmission',
      'Alarm Low Level Transmission'
    ),
    [RtuPacketType.FourHundredSeriesRtuCommand]: t(
      'enum.packettype.400SeriesRtuCommand',
      '400 Series Rtu Command'
    ),
    [RtuPacketType.FourHundredSeriesRtuCommandAcknowledge]: t(
      'enum.packettype.400seriessmscommunicationconfig',
      '400 Series Sms Communication Config'
    ),
    [RtuPacketType.RequestAdditionalConfigurationAndStatus]: t(
      'enum.packettype.requestAdditionalConfigurationAndStatus',
      'Request Additional Configuration and Status'
    ),
    [RtuPacketType.RequestCurrentConfiguration]: t(
      'enum.packettype.requestCurrentConfiguration',
      'Request Current Configuration'
    ),
    [RtuPacketType.RequestDataTransmission]: t(
      'enum.packettype.requestDataTransmission',
      'Request Data Configuration'
    ),
  };
};

export const buildCommunicationMethodGroupTextMapping = (t: TFunction) => {
  return {
    [TelecommunicationsCarrier.Ais]: t('enum.carrier.ais', 'AIS'),
    [TelecommunicationsCarrier.All]: t('enum.carrier.all', 'All'),
    [TelecommunicationsCarrier.Aql]: t('enum.carrier.aql', 'AQL'),
    [TelecommunicationsCarrier.Att]: t('enum.carrier.att', 'ATT'),
    [TelecommunicationsCarrier.Att4GApci]: t(
      'enum.carrier.att4gapci',
      'AT&T-APCI-4G'
    ),
    [TelecommunicationsCarrier.AttApci]: t('enum.carrier.attapci', 'AT&T-APCI'),
    [TelecommunicationsCarrier.ChinaMobile]: t(
      'enum.carrier.chinamobile',
      'China Mobile'
    ),
    [TelecommunicationsCarrier.ChinaMobileDirect]: t(
      'enum.carrier.chinamobiledirect',
      'China Mobile Direct'
    ),
    [TelecommunicationsCarrier.Dtac]: t('enum.carrier.dtac', 'DTAC'),
    [TelecommunicationsCarrier.Email]: t('enum.carrier.email', 'Email'),
    [TelecommunicationsCarrier.EmailHosted]: t(
      'enum.carrier.email(hosted)',
      'Email (Hosted)'
    ),
    [TelecommunicationsCarrier.Email2]: t('enum.carrier.email2', 'Email2'),
    [TelecommunicationsCarrier.FileTransfer]: t(
      'enum.carrier.filetransfer',
      'File Transfer'
    ),
    [TelecommunicationsCarrier.ICE]: t('enum.carrier.ice', 'ICE'),
    [TelecommunicationsCarrier.Iridium]: t('enum.carrier.iridium', 'Iridium'),
    [TelecommunicationsCarrier.KoreAtt]: t('enum.carrier.koreatt', 'KoreAtt'),
    [TelecommunicationsCarrier.KoreAtt4G]: t(
      'enum.carrier.koreatt4g',
      'KoreAtt-4G'
    ),
    [TelecommunicationsCarrier.KT09]: t('enum.carrier.kt09', 'KT09'),
    [TelecommunicationsCarrier.Modem]: t('enum.carrier.modem', 'Modem'),
    [TelecommunicationsCarrier.Numerex]: t('enum.carrier.numerex', 'Numerex'),
    [TelecommunicationsCarrier.NumerexAtt]: t(
      'enum.carrier.numerexatt',
      'NumerexAtt'
    ),
    [TelecommunicationsCarrier.NxLocate]: t(
      'enum.carrier.nxlocate',
      'NxLocate'
    ),
    [TelecommunicationsCarrier.O2]: t('enum.carrier.o2', 'O2'),
    [TelecommunicationsCarrier.Particle]: t(
      'enum.carrier.particle',
      'Particle'
    ),
    [TelecommunicationsCarrier.Raco]: t('enum.carrier.raco', 'Raco'),
    [TelecommunicationsCarrier.ReadingsService]: t(
      'enum.carrier.readingsservice',
      'Readings Service'
    ),
    [TelecommunicationsCarrier.Rogers]: t('enum.carrier.rogers', 'Rogers'),
    [TelecommunicationsCarrier.Skytel]: t('enum.carrier.skytel', 'Skytel'),
    [TelecommunicationsCarrier.SkyWaveIGWS]: t(
      'enum.carrier.skywaveigws',
      'Sky Wave IGWS'
    ),
    [TelecommunicationsCarrier.Tdc]: t('enum.carrier.tdc', 'TDC'),
    [TelecommunicationsCarrier.Telcel]: t('enum.carrier.telcel', 'Telcel'),
    [TelecommunicationsCarrier.Telenor]: t('enum.carrier.telenor', 'Telenor'),
    [TelecommunicationsCarrier.TelenorSweden]: t(
      'enum.carrier.telenorsweden',
      'Telenor Sweden'
    ),
    [TelecommunicationsCarrier.Telit]: t('enum.carrier.telit', 'Telit'),
    [TelecommunicationsCarrier.Tigo]: t('enum.carrier.tigo', 'Tigo'),
    [TelecommunicationsCarrier.TMobile]: t('enum.carrier.tmobile', 'TMobile'),
    [TelecommunicationsCarrier.Transfer]: t(
      'enum.carrier.transfer',
      'Transfer'
    ),
    [TelecommunicationsCarrier.Udp]: t('enum.carrier.udp', 'Udp'),
    [TelecommunicationsCarrier.Unknown]: t('enum.carrier.unknown', 'Unknown'),
    [TelecommunicationsCarrier.Verizon]: t('enum.carrier.verizon', 'Verizon'),
    [TelecommunicationsCarrier.Vistar]: t('enum.carrier.vistar', 'Vistar'),
    [TelecommunicationsCarrier.Vivo]: t('enum.carrier.vivo', 'Vivo'),
    [TelecommunicationsCarrier.VivoApci]: t(
      'enum.carrier.vivoapci',
      'VivoApci'
    ),
    [TelecommunicationsCarrier.VivoDol]: t('enum.carrier.vivodol', 'VivoDol'),
    [TelecommunicationsCarrier.Vodafone]: t(
      'enum.carrier.vodafone',
      'Vodafone'
    ),
    [TelecommunicationsCarrier.Weblink]: t('enum.carrier.weblink', 'Weblink'),
    [TelecommunicationsCarrier.WorldTextAustralia]: t(
      'enum.carrier.worldtextaustralia',
      'World Text Australia'
    ),
    // Should this translation actually use World Text India?
    [TelecommunicationsCarrier.WorldTextIndia]: t(
      'enum.carrier.worldtextindia',
      'World Text India'
    ),
    [TelecommunicationsCarrier.WorldTextIndiaIdea]: t(
      'enum.carrier.worldtextindiaidea',
      'World Text India Idea'
    ),
    [TelecommunicationsCarrier.WorldTextIndiaTata]: t(
      'enum.carrier.worldtextindiatata',
      'World Text India Tata'
    ),
    [TelecommunicationsCarrier.WorldTextIndonesia]: t(
      'enum.carrier.worldtextindonesia',
      'World Text Indonesia'
    ),
    [TelecommunicationsCarrier.WorldTextUk]: t(
      'enum.carrier.worldtextuk',
      'World Text Uk'
    ),
    [TelecommunicationsCarrier.WorldTextUsa]: t(
      'enum.carrier.worldtextusa',
      'World Text Usa'
    ),
    // Manual Translations (Might need Verification)
    [TelecommunicationsCarrier.AWG]: t('enum.carrier.awg', 'AWG'),
    [TelecommunicationsCarrier.ChinaMobileCmpp090528]: t(
      'enum.carrier.chinaMobileCmpp090528',
      'China Mobile Cmpp 090528'
    ),
    [TelecommunicationsCarrier.ChinaMobileCmpp091430]: t(
      'enum.carrier.chinaMobileCmpp091430',
      'China Mobile Cmpp 091430'
    ),
    [TelecommunicationsCarrier.Dtac2]: t('enum.carrier.dtac2', 'DTAC 2'),
    [TelecommunicationsCarrier.Fieldgate]: t(
      'enum.carrier.fieldGate',
      'Field Gate'
    ),
    [TelecommunicationsCarrier.GDC]: t('enum.carrier.gdc', 'GDC'),
    [TelecommunicationsCarrier.KoreAtt4G2]: t(
      'enum.carrier.koreatt4g2',
      'KoreAtt-4G 2'
    ),
    [TelecommunicationsCarrier.KoreTelstra]: t(
      'enum.carrier.koreTelestra',
      'Kore Telestra'
    ),
    [TelecommunicationsCarrier.KoreTMobile]: t(
      'enum.carrier.koreTMobile',
      'Kore TMobile'
    ),
    [TelecommunicationsCarrier.Raco2]: t('enum.carrier.raco2', 'Raco 2'),
    [TelecommunicationsCarrier.RCM]: t('enum.carrier.rcm', 'RCM'),
    [TelecommunicationsCarrier.Skybitz]: t('enum.carrier.skybitz', 'Skybitz'),
    [TelecommunicationsCarrier.Telcel88449]: t(
      'enum.carrier.telcel88449',
      'Telcel 88449'
    ),
    [TelecommunicationsCarrier.TelitAnova]: t(
      'enum.carrier.telitAnova',
      'Telit ANOVA'
    ),
    [TelecommunicationsCarrier.TestSMPP]: t(
      'enum.carrier.testSmpp',
      'Test SMPP'
    ),
    // NOTE: Removed
    [TelecommunicationsCarrier.UdpKore]: t('enum.carrier.udpKore', 'Udp Kore'),
    [TelecommunicationsCarrier.UdpTurkey]: t(
      'enum.carrier.udpTurkey',
      'Udp Turkey'
    ),
    [TelecommunicationsCarrier.WorldTextBrazil]: t(
      'enum.carrier.worldTextBrazil',
      'World Text Brazil'
    ),
    [TelecommunicationsCarrier.WorldTextGermany]: t(
      'enum.carrier.worldTextGermany',
      'World Text Germany'
    ),
    [TelecommunicationsCarrier.WorldTextHongKong]: t(
      'enum.carrier.worldTextHongKong',
      'World Text Hong Kong'
    ),
    [TelecommunicationsCarrier.WorldTextIndonesiaBackup]: t(
      'enum.carrier.worldTextIndonesiaBackup',
      'World Text Indonesia Backup'
    ),
    [TelecommunicationsCarrier.WorldTextNetherlands]: t(
      'enum.carrier.worldTextNetherlands',
      'World Text Netherlands'
    ),
    [TelecommunicationsCarrier.WorldTextTurkey]: t(
      'enum.carrier.worldTextTurkey',
      'World Text Turkey'
    ),
    [TelecommunicationsCarrier.WorldTextUAE]: t(
      'enum.carrier.worldTextUae',
      'World Text UAE'
    ),
  };
};

export const buildPacketStatusTextMapping = (t: TFunction) => {
  return {
    [RtuPacketStatus.CannotBeProcessed]: t(
      'enum.packetstatus.cannotbeprocessed',
      'Cannot Be Processed'
    ),
    [RtuPacketStatus.Completed]: t('enum.packetstatus.completed', 'Completed'),
    [RtuPacketStatus.DecodeVistarGPSFailed]: t(
      'enum.packetstatus.decodevistargpsfailed',
      'Unable to Decode Vistar GPS data'
    ),
    [RtuPacketStatus.FtpFileNotCreatedNoTimeZoneInfo]: t(
      'enum.packetstatus.ftpfilenotcreatednotimezoneinfo',
      'FTP File Not Created No Timezone Info'
    ),
    [RtuPacketStatus.FtpInvalidDataChannelUnits]: t(
      'enum.packetstatus.ftpinvaliddatachannelunits',
      'The Units for setting the FTP Reading are Invalid'
    ),
    [RtuPacketStatus.FtpOptionSetToNone]: t(
      'enum.packetstatus.ftpoptionsettonone',
      'FTP Option Set To None'
    ),
    [RtuPacketStatus.FtpVolumetricConvertFailed]: t(
      'enum.packetstatus.ftpvolumetricconvertfailed',
      'Unable to Convert Reading for FTP'
    ),
    [RtuPacketStatus.InProcessingQueue]: t(
      'enum.packetstatus.inprocessingqueue',
      'In Processing Queue'
    ),
    [RtuPacketStatus.InvalidAlarmPointsADC]: t(
      'enum.packetstatus.invalidalarmpointsadc',
      'Invalid Alarm Points ADC'
    ),
    [RtuPacketStatus.InvalidAmbientLightLevel]: t(
      'enum.packetstatus.invalidambientlightlevel',
      'Invalid Ambient Light Level'
    ),
    [RtuPacketStatus.InvalidAverageCharge]: t(
      'enum.packetstatus.invalidaveragecharge',
      'Invalid Average Charge'
    ),
    [RtuPacketStatus.InvalidBatteryChargeCurrent]: t(
      'enum.packetstatus.invalidbatterychargecurrent',
      'Invalid Battery Charge Current'
    ),
    [RtuPacketStatus.InvalidBatteryLowSetpoint]: t(
      'enum.packetstatus.invalidbatterylowsetpoint',
      'Invalid Battery Low Setpoint'
    ),
    [RtuPacketStatus.InvalidBatteryNightVolts]: t(
      'enum.packetstatus.invalidbatterynightvolts',
      'Invalid Battery Night Volts'
    ),
    [RtuPacketStatus.InvalidBatteryType]: t(
      'enum.packetstatus.invalidbatterytype',
      'Invalid Battery Type'
    ),
    [RtuPacketStatus.InvalidBatteryVoltReading]: t(
      'enum.packetstatus.invalidbatteryvoltreading',
      'Invalid Battery Volt Reading'
    ),
    [RtuPacketStatus.InvalidCommunicationMethod]: t(
      'enum.packetstatus.invalidcommunicationmethod',
      'Invalid Communication Method'
    ),
    [RtuPacketStatus.InvalidControlFlag]: t(
      'enum.packetstatus.invalidcontrolflag',
      'Invalid Control Flag'
    ),
    [RtuPacketStatus.InvalidCounterData]: t(
      'enum.packetstatus.invalidcounterdata',
      'Invalid Counter Data'
    ),
    [RtuPacketStatus.InvalidDataChannelType]: t(
      'enum.packetstatus.invaliddatachanneltype',
      'Invalid Data Channel Type'
    ),
    [RtuPacketStatus.InvalidDataReading]: t(
      'enum.packetstatus.invaliddatareading',
      'Invalid Data Reading'
    ),
    [RtuPacketStatus.InvalidDestEmail]: t(
      'enum.packetstatus.invaliddestemail',
      'Invalid Dest Email'
    ),
    [RtuPacketStatus.InvalidDestinationPIN]: t(
      'enum.packetstatus.invaliddestinationpin',
      'Invalid Destination PIN'
    ),
    [RtuPacketStatus.InvalidDestNo]: t(
      'enum.packetstatus.invaliddestno',
      'Invalid Destination No'
    ),
    [RtuPacketStatus.InvalidDeviceID]: t(
      'enum.packetstatus.invaliddeviceid',
      'Invalid Device Id'
    ),
    [RtuPacketStatus.InvalidDomain]: t(
      'enum.packetstatus.invaliddomain',
      'Invalid Domain'
    ),
    [RtuPacketStatus.InvalidFillAlarm]: t(
      'enum.packetstatus.invalidfillalarm',
      'Invalid Fill Alarm'
    ),
    [RtuPacketStatus.InvalidFillTime]: t(
      'enum.packetstatus.invalidfilltime',
      'Invalid Fill Time'
    ),
    [RtuPacketStatus.InvalidFillUpdate]: t(
      'enum.packetstatus.invalidfillupdate',
      'Invalid Fill Update'
    ),
    [RtuPacketStatus.InvalidFtpFileFormat]: t(
      'enum.packetstatus.invalidftpfileformat',
      'Invalid FTP File Format'
    ),
    [RtuPacketStatus.InvalidFtpId]: t(
      'enum.packetstatus.invalidftpid',
      'The FTP Id is empty or invalid'
    ),
    [RtuPacketStatus.InvalidFtpTimeZone]: t(
      'enum.packetstatus.invalidftptimezone',
      'Unable to create FTP Record. Invalid Timezone.'
    ),
    [RtuPacketStatus.InvalidLogLength]: t(
      'enum.packetstatus.invalidloglength',
      'Invalid Log Length'
    ),
    [RtuPacketStatus.InvalidLoopVolts]: t(
      'enum.packetstatus.invalidloopvolts',
      'Invalid Loop Volts'
    ),
    [RtuPacketStatus.InvalidNumberDecimalPlaces]: t(
      'enum.packetstatus.invalidnumberdecimalplaces',
      'Invalid Number Decimal Places'
    ),
    [RtuPacketStatus.InvalidOwnNo]: t(
      'enum.packetstatus.invalidownno',
      'Invalid Own No'
    ),
    [RtuPacketStatus.InvalidOwnPIN]: t(
      'enum.packetstatus.invalidownpin',
      'Invalid Own PIN'
    ),
    [RtuPacketStatus.InvalidPacketPrefix]: t(
      'enum.packetstatus.invalidpacketprefix',
      'Invalid Packet Prefix'
    ),
    [RtuPacketStatus.InvalidPacketType]: t(
      'enum.packetstatus.invalidpackettype',
      'Invalid Packet Type'
    ),
    [RtuPacketStatus.InvalidPollHour]: t(
      'enum.packetstatus.invalidpollhour',
      'Invalid Poll Hour'
    ),
    [RtuPacketStatus.InvalidPollMode]: t(
      'enum.packetstatus.invalidpollmode',
      'Invalid Poll Mode'
    ),
    [RtuPacketStatus.InvalidRecordingRate]: t(
      'enum.packetstatus.invalidrecordingrate',
      'Invalid Recording Rate'
    ),
    [RtuPacketStatus.InvalidRtuChannelConfigBlock]: t(
      'enum.packetstatus.invalidrtuchannelconfigblock',
      'Invalid RTU Channel Config Block'
    ),
    [RtuPacketStatus.InvalidRtuChannelDiagnosticBlock]: t(
      'enum.packetstatus.invalidrtuchanneldiagnosticblock',
      'Invalid RTU Channel Diagnostic Block'
    ),
    [RtuPacketStatus.InvalidRtuConfigBlock]: t(
      'enum.packetstatus.invalidrtuconfigblock',
      'Invalid RTU Config Block'
    ),
    [RtuPacketStatus.InvalidRtuTimestamp]: t(
      'enum.packetstatus.invalidrtutimestamp',
      'Invalid RTU Timestamp'
    ),
    [RtuPacketStatus.InvalidRtuTypeInPacket]: t(
      'enum.packetstatus.invalidrtutypeinpacket',
      'Invalid RTU Type In Packet'
    ),
    [RtuPacketStatus.InvalidSensorDelay]: t(
      'enum.packetstatus.invalidsensordelay',
      'Invalid Sensor Delay'
    ),
    [RtuPacketStatus.InvalidSensorSpan]: t(
      'enum.packetstatus.invalidsensorspan',
      'Invalid Sensor Span'
    ),
    [RtuPacketStatus.InvalidSequenceNumber]: t(
      'enum.packetstatus.invalidsequencenumber',
      'Invalid Sequence Number'
    ),
    [RtuPacketStatus.InvalidServCtrNo]: t(
      'enum.packetstatus.invalidservctrno',
      'Invalid Service Centre No'
    ),
    [RtuPacketStatus.InvalidServerTimestamp]: t(
      'enum.packetstatus.invalidservertimestamp',
      'Invalid Server Timestamp'
    ),
    [RtuPacketStatus.InvalidSignalStrength]: t(
      'enum.packetstatus.invalidsignalstrength',
      'Invalid Signal Strength'
    ),
    [RtuPacketStatus.InvalidSite]: t(
      'enum.packetstatus.invalidsite',
      'Invalid Site'
    ),
    [RtuPacketStatus.InvalidSWVersion]: t(
      'enum.packetstatus.invalidswversion',
      'Invalid SW Version'
    ),
    [RtuPacketStatus.InvalidTemperatureReading]: t(
      'enum.packetstatus.invalidtemperaturereading',
      'Invalid Temperature Reading'
    ),
    [RtuPacketStatus.InvalidTimeUpdateFlag]: t(
      'enum.packetstatus.invalidtimeupdateflag',
      'Invalid Time Update Flag'
    ),
    [RtuPacketStatus.InvalidTxHour]: t(
      'enum.packetstatus.invalidtxhour',
      'Invalid Tx Hour'
    ),
    [RtuPacketStatus.InvalidTxRate]: t(
      'enum.packetstatus.invalidtxrate',
      'Invalid Tx Rate'
    ),
    [RtuPacketStatus.InvalidZeroOffset]: t(
      'enum.packetstatus.invalidzerooffset',
      'Invalid Zero Offset'
    ),
    [RtuPacketStatus.ManualSettingNotProcessed]: t(
      'enum.packetstatus.manualsettingnotprocessed',
      'Manual Setting Not Processed'
    ),
    [RtuPacketStatus.NoCounterDataChannelFound]: t(
      'enum.packetstatus.nocounterdatachannelfound',
      'No Counter Type DataChannel Found'
    ),
    [RtuPacketStatus.NoDataChannelFound]: t(
      'enum.packetstatus.nodatachannelfound',
      'No Data Channel Found'
    ),
    [RtuPacketStatus.NoGPSDataChannelFound]: t(
      'enum.packetstatus.nogpsdatachannelfound',
      'No GPS Data Channel Found'
    ),
    [RtuPacketStatus.NoRtuChannelFound]: t(
      'enum.packetstatus.nortuchannelfound',
      'No RTU Channel Found'
    ),
    [RtuPacketStatus.NoRtuFound]: t(
      'enum.packetstatus.nortufound',
      'No RTU Found'
    ),
    [RtuPacketStatus.NotProcessed]: t(
      'enum.packetstatus.notprocessed',
      'Not Processed'
    ),
    [RtuPacketStatus.NotSupported]: t(
      'enum.packetstatus.notsupported',
      'Packet Type Not Supported'
    ),
    [RtuPacketStatus.OutdatedConfigPacket]: t(
      'enum.packetstatus.outdatedconfigpacket',
      'Outdated Config Packet'
    ),
    [RtuPacketStatus.Processed]: t('enum.packetstatus.processed', 'Processed'),
    [RtuPacketStatus.ProcessedWithErrors]: t(
      'enum.packetstatus.processedwitherrors',
      'Processed With Errors'
    ),
    [RtuPacketStatus.Processing]: t(
      'enum.packetstatus.processing',
      'Processing'
    ),
    [RtuPacketStatus.RtuChannelCreationFailed]: t(
      'enum.packetstatus.rtuchannelcreationfailed',
      'RTU Channel Creation Failed'
    ),
    [RtuPacketStatus.RtuCreationFailed]: t(
      'enum.packetstatus.rtucreationfailed',
      'RTU Creation Failed'
    ),
    [RtuPacketStatus.RtuIsDeleted]: t(
      'enum.packetstatus.rtuisdeleted',
      'RTU Is Deleted'
    ),
    [RtuPacketStatus.RtuTypeNoLongerSupported]: t(
      'enum.packetstatus.rtutypenolongersupported',
      'RTU Type No Longer Supported'
    ),
    [RtuPacketStatus.UnknownError]: t(
      'enum.packetstatus.unknownerror',
      'Unknown Error - Packet Cannot Be Processed'
    ),
    [RtuPacketStatus.UnknownPacketType]: t(
      'enum.packetstatus.unknownpackettype',
      'Unknown Packet Type'
    ),
    // Manually Translated
    [RtuPacketStatus.FtpFileFormatSetToNone]: t(
      'enum.packetstatus.ftpFileFormatSetToNone',
      'FTP File Format Set To None'
    ),
  };
};

export const buildUserTypeTextMapping = (
  t: TFunction
): Record<UserType, string> => {
  return {
    [UserType.WebUser]: t('enum.userType.webUser', 'Web User'),
    [UserType.WebServiceUser]: t(
      'enum.userType.webServiceUser',
      'Web Service User'
    ),
    [UserType.WebUserAndWebServiceUser]: t(
      'enum.userType.webUserAndWebServiceUser',
      'Web User and Web Service User'
    ),
    [UserType.FTPUser]: t('enum.userType.ftpUser', 'FTP User'),
    // Subsystem user isn't used in the app, keeping it here to keep TypeScript
    // happy with the Record<UserType, string> type
    [UserType.SubsystemUser]: '',
  };
};

export const buildApplicationUserRoleTypeTextMapping = (
  t: TFunction
): Record<UserRoleTypeEnum, string> => {
  return {
    [UserRoleTypeEnum.SystemAdministrator]: t(
      'enum.appUserRoleType.systemAdmin',
      'System Administrator'
    ),
    [UserRoleTypeEnum.SystemUser]: t(
      'enum.appUserRoleType.systemUser',
      'System User'
    ),
    [UserRoleTypeEnum.DomainAdministrator]: t(
      'enum.appUserRoleType.domainAdmin',
      'Domain Administrator'
    ),
    [UserRoleTypeEnum.DomainUser]: t(
      'enum.appUserRoleType.domainUser',
      'Domain User'
    ),
    [UserRoleTypeEnum.Unauthenticated]: t(
      'enum.appUserRoleType.unauthenticated',
      'Unauthenticated'
    ),
  };
};

export const buildForecastModeTypeTextMapping = (t: TFunction) => {
  return {
    [ForecastModeType.NoForecast]: t(
      'enum.forecastmodetype.noforecast',
      'No Forecast'
    ),
    [ForecastModeType.HistoricalUsageRate]: t(
      'enum.forecastmodetype.historicalusageratesmoothed',
      'Historical Usage Rate Smoothed'
    ),
    [ForecastModeType.ManualUsageRate]: t(
      'enum.forecastmodetype.manualusagerate',
      'Manual Usage Rate'
    ),
    [ForecastModeType.Unsmoothed]: t(
      'enum.forecastmodetype.historicalusagerateunsmoothed',
      'Historical Usage Rate Unsmoothed'
    ),
  };
};

export const buildSupportedUOMTypeTextMapping = (t: TFunction) => {
  return {
    [SupportedUOMType.Basic]: t('enum.supportedUOMType.basic', 'Basic'),
    [SupportedUOMType.BasicWithPercentFull]: t(
      'enum.supportedUOMType.basicWithPercentFull',
      'Basic with % Full'
    ),
    [SupportedUOMType.SimplifiedVolumetric]: t(
      'enum.supportedUOMType.simplifiedVolumetric',
      'Simplified Volumetric'
    ),
    [SupportedUOMType.Volumetric]: t(
      'enum.supportedUOMType.volumetric',
      'Volumetric'
    ),
  };
};

export const buildScalingModeTypeTextMapping = (t: TFunction) => {
  return {
    [ScalingModeType.NotSet]: t('enum.scalingmodetype.notset', 'Not Set'),
    [ScalingModeType.Linear]: t('enum.scalingmodetype.linear', 'Linear'),
    [ScalingModeType.Ratio]: t('enum.scalingmodetype.ratio', 'Ratio'),
    [ScalingModeType.Mapped]: t('enum.scalingmodetype.mapped', 'Mapped'),
    [ScalingModeType.Prescaled]: t(
      'enum.scalingmodetype.noScaling',
      'No Scaling'
    ),
  };
};

export const buildUnitDisplayTypeTextMapping = (t: TFunction) => {
  return {
    [UnitDisplayType.Scaled]: t('ui.datachannel.scaled', 'Full'),
    [UnitDisplayType.Display]: t('enum.unitDisplayType.display', 'Display'),
    [UnitDisplayType.PercentFull]: t('enum.unittype.percentfull', '% Full'),
  };
};

export const eventComparatorTypeTextMapping = {
  [EventComparatorType.EqualTo]: '=',
  [EventComparatorType.GreaterThan]: '>',
  [EventComparatorType.GreaterThanEqualTo]: '>=',
  [EventComparatorType.LessThan]: '<',
  [EventComparatorType.LessThanEqualTo]: '<=',
};

export const buildInventoryStatusTypeTextMaping = (t: TFunction) => {
  return {
    [EventInventoryStatusType.Full]: t(
      'enum.eventinventorystatustype.full',
      'Full'
    ),
    [EventInventoryStatusType.Reorder]: t(
      'enum.eventinventorystatustype.reorder',
      'Reorder'
    ),
    [EventInventoryStatusType.Critical]: t(
      'enum.eventinventorystatustype.critical',
      'Critical'
    ),
    [EventInventoryStatusType.UserDefined]: t(
      'enum.eventinventorystatustype.userdefined',
      'User Defined'
    ),
    [EventInventoryStatusType.Empty]: t(
      'enum.eventinventorystatustype.empty',
      'Empty'
    ),
  };
};

export const buildInventoryStatusTypeEnumTextMapping = (t: TFunction) => {
  return {
    [EventRuleInventoryStatus.Normal]: t(
      'enum.eventinventorystatustype.normal',
      'Normal'
    ),
    [EventRuleInventoryStatus.Full]: t(
      'enum.eventinventorystatustype.full',
      'Full'
    ),
    [EventInventoryStatusType.Reorder]: t(
      'enum.eventinventorystatustype.reorder',
      'Reorder'
    ),
    [EventInventoryStatusType.Critical]: t(
      'enum.eventinventorystatustype.critical',
      'Critical'
    ),
    [EventInventoryStatusType.UserDefined]: t(
      'enum.eventinventorystatustype.userdefined',
      'User Defined'
    ),
    [EventInventoryStatusType.Empty]: t(
      'enum.eventinventorystatustype.empty',
      'Empty'
    ),
  };
};

export const buildAuditTypeTextMapping = (t: TFunction) => {
  return {
    [AuditType.DataChannel]: t(
      'enum.auditHistoryType.dataChannel',
      'Data Channel'
    ),
    [AuditType.Asset]: t('enum.auditHistoryType.asset', 'Asset'),
    [AuditType.RTU]: t('enum.auditHistoryType.rtu', 'RTU'),
    [AuditType.RTUChannel]: t(
      'enum.auditHistoryType.rtuChannel',
      'RTU Channel'
    ),
    [AuditType.CustomProperty]: t(
      'enum.auditHistoryType.customProperty',
      'Custom Property'
    ),
    [AuditType.DataChannelEventRule]: t(
      'enum.auditHistoryType.dataChannelEventRule',
      'Data Channel Event Rule'
    ),
    [AuditType.DcRawToScaledMapPoint]: t(
      'enum.auditHistoryType.dcRawToScaledMapPoint',
      'Data Channel Raw To Scaled Map Point'
    ),
    [AuditType.None]: t('enum.auditHistoryType.none', 'None'),
  };
};

export const buildTransferAssetResultTextMapping = (t: TFunction) => {
  return {
    [TransferAssetResultStatusType.Pending]: t(
      'enum.transferAssetResultStatusType.pending',
      'Pending'
    ),
    [TransferAssetResultStatusType.Transferred]: t(
      'enum.transferAssetResultStatusType.transferred',
      'Transferred'
    ),
    [TransferAssetResultStatusType.Error]: t(
      'enum.transferAssetResultStatusType.error',
      'Error'
    ),
    [TransferAssetResultStatusType.Rollback]: t(
      'enum.transferAssetResultStatusType.rollback',
      'Rollback'
    ),
  };
};
export const buildImportanceLevelTextMapping = (
  t: TFunction
): Record<EventImportanceLevelType, string> => {
  return {
    [EventImportanceLevelType.High]: t(
      'enum.eventimportanceleveltype.high',
      'High'
    ),
    [EventImportanceLevelType.Information]: t(
      'enum.eventimportanceleveltype.Information',
      'Information'
    ),
    [EventImportanceLevelType.Normal]: t(
      'enum.eventimportanceleveltype.normal',
      'Normal'
    ),
    [EventImportanceLevelType.Urgent]: t(
      'enum.eventimportanceleveltype.urgent',
      'Urgent'
    ),
    [EventImportanceLevelType.Warning]: t(
      'enum.eventimportanceleveltype.warning',
      'Warning'
    ),
  };
};

export const buildDataChannelTypeTextMapping = (t: TFunction) => {
  return {
    [DataChannelType.None]: t('enum.datachanneltype.notype', 'No Type'),
    [DataChannelType.Level]: t('enum.datachanneltype.level', 'Level'),
    [DataChannelType.Pressure]: t('enum.datachanneltype.pressure', 'Pressure'),
    [DataChannelType.DigitalInput]: t(
      'enum.datachanneltype.digitalinput',
      'Digital Input'
    ),
    [DataChannelType.BatteryVoltage]: t(
      'enum.datachanneltype.batteryvoltage',
      'Battery Voltage'
    ),
    [DataChannelType.Gps]: t('enum.datachanneltype.gps', 'GPS'),
    [DataChannelType.FlowMeter]: t(
      'enum.datachanneltype.flowmeter',
      'Flow Meter'
    ),
    [DataChannelType.Counter]: t('enum.datachanneltype.counter', 'Counter'),
    [DataChannelType.Temperature]: t(
      'enum.datachanneltype.temperature',
      'Temperature'
    ),
    [DataChannelType.OtherAnalog]: t(
      'enum.datachanneltype.otheranalog',
      'Other Analog'
    ),
    [DataChannelType.RtuCaseTemperature]: t(
      'enum.datachanneltype.rtucasetemperature',
      'RTU Case Temperature'
    ),
    [DataChannelType.Diagnostic]: t(
      'enum.datachanneltype.diagnostic',
      'Diagnostic'
    ),
    [DataChannelType.TotalizedLevel]: t(
      'enum.datachanneltype.totalizedlevel',
      'Totalized Level'
    ),
    [DataChannelType.VirtualChannel]: t(
      'enum.datachanneltype.virtualchannel',
      'Virtual Channel'
    ),
    [DataChannelType.Rtu]: t('enum.datachanneltype.rtu', 'RTU'),
    [DataChannelType.Shock]: t('enum.datachanneltype.shock', 'Shock'),
    [DataChannelType.RateOfChange]: t(
      'enum.datachanneltype.rateofchange',
      'Rate of Change'
    ),
    [DataChannelType.SignalStrength]: t(
      'enum.datachanneltype.signalstrength',
      'Signal Strength'
    ),
    [DataChannelType.ChargeCurrent]: t(
      'enum.datachanneltype.chargecurrent',
      'Average Charge Current'
    ),
  };
};

export const buildAssetTypeTextMapping = (t: TFunction) => {
  return {
    [AssetType.None]: t('enum.assettype.none', 'None'),
    [AssetType.Tank]: t('enum.assettype.tank', 'Tank'),
    [AssetType.HeliumIsoContainer]: t(
      'enum.assettype.heliumisocontainer',
      'Helium ISO Container'
    ),
    [AssetType.Vaporizer]: t('enum.assettype.vaporizer', 'Vaporizer'),
    [AssetType.PressurePump]: t('enum.assettype.pressurepump', 'Pressure Pump'),
    [AssetType.CompositeAsset]: t(
      'enum.assettype.compositeasset',
      'Composite Asset'
    ),
    [AssetType.FlowMeter]: t('enum.assettype.flowmeter', 'Flow Meter'),
    [AssetType.GasMixer]: t('enum.assettype.gasmixer', 'Gas Mixer'),
    [AssetType.Plant]: t('enum.assettype.plant', 'Plant'),
    [AssetType.TubeTrailer]: t('enum.assettype.tubetrailer', 'Tube Trailer'),
    [AssetType.Pipeline]: t('enum.assettype.pipeline', 'Pipeline'),
    [AssetType.HVAC]: t('enum.assettype.hvac', 'HVAC'),
    [AssetType.CFM]: t('enum.assettype.cfm', 'CFM'),
    [AssetType.EM]: t('enum.assettype.em', 'EM'),
    [AssetType.MkLine]: t('enum.assettype.mkline', 'MKLINE'),
    [AssetType.FoodFreezer]: t('enum.assettype.foodFreezer', 'Food Freezer'),
  };
};

export const buildEventRuleTypeTextMapping = (
  t: TFunction
): Record<EventRuleType, string> => {
  return {
    [EventRuleType.Level]: t('enum.eventruletype.level', 'Level'),
    [EventRuleType.MissingData]: t(
      'enum.eventruletype.missingdata',
      'Missing Data'
    ),
    [EventRuleType.ScheduledDeliveryTooEarly]: t(
      'enum.eventruletype.earlydelivery',
      'Early Delivery'
    ),
    [EventRuleType.ScheduledDeliveryTooLate]: t(
      'enum.eventruletype.latedelivery',
      'Late Delivery'
    ),
    [EventRuleType.ScheduledDeliveryMissed]: t(
      'enum.eventruletype.misseddelivery',
      'Missed Delivery'
    ),
    [EventRuleType.RTUChannelEvent]: t(
      'enum.eventruletype.rtuchannelevents',
      'RTU/RTU Channel Event'
    ),
    [EventRuleType.UsageRate]: t('enum.eventruletype.usagerate', 'Usage Rate'),
    [EventRuleType.GeoFencing]: t(
      'enum.eventruletype.geofencing',
      'Geofencing'
    ),
  };
};

export const buildTankTypeTextMapping = (t: TFunction) => {
  return {
    [TankType.None]: t('enum.tanktype.none', 'None'),
    [TankType.RectangularBox]: t('enum.tanktype.rectangular', 'Rectangular'),
    [TankType.SphericalTank]: t('enum.tanktype.spherical', 'Spherical'),
    [TankType.TotalizedTank]: t(
      'enum.tanktype.totalizedtank',
      'Totalized Tank'
    ),
    [TankType.HorizontalWith2To1EllipsoidalEnds]: t(
      'enum.tanktype.horizontalwith2-1ellipsoidalends',
      'Horizontal with 2:1 Ellipsoidal Ends'
    ),
    [TankType.HorizontalWithFlatEnds]: t(
      'enum.tanktype.horizontalwithflatends',
      'Horizontal with Flat Ends'
    ),
    [TankType.HorizontalWithHemisphericalEnds]: t(
      'enum.tanktype.horizontalwithhemisphericalends',
      'Horizontal with Hemispherical Ends'
    ),
    [TankType.HorizontalWithVariableDishedEnds]: t(
      'enum.tanktype.horizontalwithvariabledishedends',
      'Horizontal with Variable Dished Ends'
    ),
    [TankType.VerticalWith2To1EllipsoidalEnds]: t(
      'enum.tanktype.verticalwith2-1ellipsodialend',
      'Vertical with 2:1 Ellipsoidal Ends'
    ),
    [TankType.VerticalWithConicalBottomEnd]: t(
      'enum.tanktype.verticalwithconicalbottomend',
      'Vertical with Conical Bottom End'
    ),
    [TankType.VerticalWithFlatEnds]: t(
      'enum.tanktype.verticalwithflatends',
      'Vertical with Flat Ends'
    ),
    [TankType.VerticalWithHemisphericalEnds]: t(
      'enum.tanktype.verticalwithhemisphericalends',
      'Vertical with Hemispherical Ends'
    ),
    [TankType.VerticalWithVariableDishedEnds]: t(
      'enum.tanktype.verticalwithvariabledishedends',
      'Vertical with Variable Dished Ends'
    ),
  };
};

export const buildUnitsOfMeasureTextMapping = (
  t: TFunction
): Record<UnitType, string> => {
  return {
    [UnitType.WaterColumnMillimeters]: t('enum.unittype.mmwc', 'mm WC'),
    [UnitType.WaterColumnCentimeters]: t('enum.unittype.cmwc', 'cm WC'),
    [UnitType.WaterColumnMeters]: t('enum.unittype.mwc', 'm WC'),
    [UnitType.HydrogenMillimeters]: t('enum.unittype.mh2', 'mm H2'),
    [UnitType.HydrogenCentimeters]: t('enum.unittype.cmh2', 'cm H2'),
    [UnitType.HydrogenMeters]: t('enum.unittype.mmh2', 'm H2'),
    [UnitType.WaterColumnInches]: t('enum.unittype.inswc', 'Ins WC'),
    [UnitType.HydrogenInches]: t('enum.unittype.insh2', 'Ins H2'),
    [UnitType.Millimeters]: t('enum.unittype.mm', 'mm'),
    [UnitType.Centimeters]: t('enum.unittype.cm', 'cm'),
    [UnitType.Meters]: t('enum.unittype.m', 'm'),
    [UnitType.Inches]: t('enum.unittype.in', 'in'),
    [UnitType.Feet]: t('enum.unittype.ft', 'ft'),
    [UnitType.Yards]: t('enum.unittype.yd', 'yd'),
    [UnitType.Liters]: t('enum.unittype.l', 'l'),
    [UnitType.KiloLiters]: t('enum.unittype.kl', 'kl'),
    [UnitType.CubicMeters]: t('enum.unittype.m3', 'm3'),
    [UnitType.Default]: t('enum.unittype.default', 'default'),
    [UnitType.USGallons]: t('enum.unittype.galus', 'gal US'),
    [UnitType.UKGallons]: t('enum.unittype.galimp', 'gal Imp'),
    [UnitType.CubicInches]: t('enum.unittype.in3', 'in3'),
    [UnitType.CubicFeet]: t('enum.unittype.ft3', 'ft3'),
    [UnitType.CubicYards]: t('enum.unittype.yd3', 'yd3'),
    [UnitType.Kilograms]: t('enum.unittype.kg', 'kg'),
    [UnitType.MetricTonne]: t('enum.unittype.t', 't'),
    [UnitType.Pounds]: t('enum.unittype.lbs', 'lbs'),
    [UnitType.TonUS]: t('enum.unittype.ton', 'tons'),
    [UnitType.StandardCubicMeter]: t('enum.unittype.scm', 'SCM'),
    [UnitType.StandardCubicFoot]: t('enum.unittype.scf', 'SCF'),
    [UnitType.PercentFull]: t('enum.unittype.percentfull', '% Full'),
  };
};

export const buildUnitTypeEnumTextMapping = (
  t: TFunction
): Record<UnitTypeEnum, string> => {
  return {
    [UnitTypeEnum.WaterColumnMillimeters]: t('enum.unittype.mmwc', 'mm WC'),
    [UnitTypeEnum.WaterColumnCentimeters]: t('enum.unittype.cmwc', 'cm WC'),
    [UnitTypeEnum.WaterColumnMeters]: t('enum.unittype.mwc', 'm WC'),
    [UnitTypeEnum.HydrogenMillimeters]: t('enum.unittype.mh2', 'mm H2'),
    [UnitTypeEnum.HydrogenCentimeters]: t('enum.unittype.cmh2', 'cm H2'),
    [UnitTypeEnum.HydrogenMeters]: t('enum.unittype.mmh2', 'm H2'),
    [UnitTypeEnum.WaterColumnInches]: t('enum.unittype.inswc', 'Ins WC'),
    [UnitTypeEnum.HydrogenInches]: t('enum.unittype.insh2', 'Ins H2'),
    [UnitTypeEnum.Millimeters]: t('enum.unittype.mm', 'mm'),
    [UnitTypeEnum.Centimeters]: t('enum.unittype.cm', 'cm'),
    [UnitTypeEnum.Meters]: t('enum.unittype.m', 'm'),
    [UnitTypeEnum.Inches]: t('enum.unittype.in', 'in'),
    [UnitTypeEnum.Feet]: t('enum.unittype.ft', 'ft'),
    [UnitTypeEnum.Yards]: t('enum.unittype.yd', 'yd'),
    [UnitTypeEnum.Liters]: t('enum.unittype.l', 'l'),
    [UnitTypeEnum.KiloLiters]: t('enum.unittype.kl', 'kl'),
    [UnitTypeEnum.CubicMeters]: t('enum.unittype.m3', 'm3'),
    [UnitTypeEnum.Default]: t('enum.unittype.default', 'default'),
    [UnitTypeEnum.USGallons]: t('enum.unittype.galus', 'gal US'),
    [UnitTypeEnum.UKGallons]: t('enum.unittype.galimp', 'gal Imp'),
    [UnitTypeEnum.CubicInches]: t('enum.unittype.in3', 'in3'),
    [UnitTypeEnum.CubicFeet]: t('enum.unittype.ft3', 'ft3'),
    [UnitTypeEnum.CubicYards]: t('enum.unittype.yd3', 'yd3'),
    [UnitTypeEnum.Kilograms]: t('enum.unittype.kg', 'kg'),
    [UnitTypeEnum.MetricTonne]: t('enum.unittype.t', 't'),
    [UnitTypeEnum.Pounds]: t('enum.unittype.lbs', 'lbs'),
    [UnitTypeEnum.TonUS]: t('enum.unittype.ton', 'tons'),
    [UnitTypeEnum.StandardCubicMeter]: t('enum.unittype.scm', 'SCM'),
    [UnitTypeEnum.StandardCubicFoot]: t('enum.unittype.scf', 'SCF'),
    [UnitTypeEnum.PercentFull]: t('enum.unittype.percentfull', '% Full'),
    [UnitTypeEnum.DefaultScaled]: t(
      'enum.unittype.defaultScaled',
      'Default Scaled'
    ),
  };
};

export const buildOperatorTypeMapping = () => {
  return {
    [VirtualChannelOperatorType.None]: '',
    [VirtualChannelOperatorType.Addition]: '+',
    [VirtualChannelOperatorType.Subtraction]: '-',
    [VirtualChannelOperatorType.Multiplication]: '*',
    [VirtualChannelOperatorType.Division]: '/',
    [VirtualChannelOperatorType.And]: '&',
    [VirtualChannelOperatorType.Or]: '|',
    [VirtualChannelOperatorType.Expoentiation]: '^',
  };
};

export const buildPollScheduleTypeMapping = (t: TFunction) => {
  return {
    [RTUPollScheduleType.None]: t('enum.typeOfSchedule.none', 'None'),
    [RTUPollScheduleType.Interval]: t(
      'enum.typeOfSchedule.interval',
      'Interval'
    ),
    [RTUPollScheduleType.PointInTime]: t(
      'enum.typeOfSchedule.timeOfDay',
      'Time of Day'
    ),
  };
};

export const buildGeoAreaCategoryTypeTextMapping = (t: TFunction) => {
  return {
    [GeoAreaCategory.None]: t('enum.geoAreaCategoryType.none', 'None'),
    [GeoAreaCategory.Port]: t('enum.geoAreaCategoryType.port', 'Port'),
    [GeoAreaCategory.MaintenanceArea]: t(
      'enum.geoAreaCategoryType.maintenanceArea',
      'Maintenance Area'
    ),
    [GeoAreaCategory.ParkingLot]: t(
      'enum.geoAreaCategoryType.parkingLot',
      'Parking Lot'
    ),
    [GeoAreaCategory.CustomerLocation]: t(
      'enum.geoAreaCategoryType.customerLocation',
      'Customer Location'
    ),
    [GeoAreaCategory.FillSite]: t(
      'enum.geoAreaCategoryType.fillSite',
      'Fill Site'
    ),
  };
};

export const buildZoomRangeOptionsMapping = (t: TFunction) => {
  return {
    [ReadingsChartZoomLevel.NotSet]: t(
      'enum.readingschartzoomlevel.notset',
      'Custom'
    ),
    [ReadingsChartZoomLevel.TwoYears]: t(
      'enum.readingschartzoomlevel.twoyears',
      '2 Years'
    ),
    [ReadingsChartZoomLevel.OneYear]: t(
      'enum.readingschartzoomlevel.oneyear',
      '1 Year'
    ),
    [ReadingsChartZoomLevel.TwelveWeeks]: t(
      'enum.readingschartzoomlevel.twelveweeks',
      '12 Weeks'
    ),
    [ReadingsChartZoomLevel.FourWeeks]: t(
      'enum.readingschartzoomlevel.fourweeks',
      '4 Weeks'
    ),
    [ReadingsChartZoomLevel.TwoWeeks]: t(
      'enum.readingschartzoomlevel.twoweeks',
      '2 Weeks'
    ),
    [ReadingsChartZoomLevel.OneWeek]: t(
      'enum.readingschartzoomlevel.oneweek',
      '1 Week'
    ),
    [ReadingsChartZoomLevel.FourDays]: t(
      'enum.readingschartzoomlevel.fourdays',
      '4 Days'
    ),
    [ReadingsChartZoomLevel.TwoDays]: t(
      'enum.readingschartzoomlevel.twodays',
      '2 Days'
    ),
    [ReadingsChartZoomLevel.OneDay]: t(
      'enum.readingschartzoomlevel.oneday',
      '1 Day'
    ),
    [ReadingsChartZoomLevel.TwelveHours]: t(
      'enum.readingschartzoomlevel.twelvehours',
      '12 Hours'
    ),
    [ReadingsChartZoomLevel.SixHours]: t(
      'enum.readingschartzoomlevel.sixhours',
      '6 Hours'
    ),
    [ReadingsChartZoomLevel.ThreeHour]: t(
      'enum.readingschartzoomlevel.threehour',
      '3 Hours'
    ),
  };
};

export const buildProblemReportPriorityTextMapping = (
  t: TFunction
): Record<ProblemReportPriorityEnum, string> => {
  return {
    [ProblemReportPriorityEnum.High]: t(
      'enum.problemreportpriority.high',
      'Very High'
    ),
    [ProblemReportPriorityEnum.Medium]: t(
      'enum.problemreportpriority.medium',
      'High'
    ),
    [ProblemReportPriorityEnum.Low]: t(
      'enum.problemreportpriority.low',
      'Medium'
    ),
  };
};

export const buildAPCIUnitTypeTextMapping = (
  t: TFunction
): Record<APCIUnitType, string> => {
  return {
    [APCIUnitType.WaterColumnMillimeters]: t('enum.unittype.mmwc', 'mm WC'),
    [APCIUnitType.WaterColumnCentimeters]: t('enum.unittype.cmwc', 'cm WC'),
    [APCIUnitType.WaterColumnMeters]: t('enum.unittype.mwc', 'm WC'),
    [APCIUnitType.HydrogenMillimeters]: t('enum.unittype.mh2', 'mm H2'),
    [APCIUnitType.HydrogenCentimeters]: t('enum.unittype.cmh2', 'cm H2'),
    [APCIUnitType.HydrogenMeters]: t('enum.unittype.mmh2', 'm H2'),
    [APCIUnitType.WaterColumnInches]: t('enum.unittype.inswc', 'Ins WC'),
    [APCIUnitType.HydrogenInches]: t('enum.unittype.insh2', 'Ins H2'),
    [APCIUnitType.Millimeters]: t('enum.unittype.mm', 'mm'),
    [APCIUnitType.Centimeters]: t('enum.unittype.cm', 'cm'),
    [APCIUnitType.Meters]: t('enum.unittype.m', 'm'),
    [APCIUnitType.Inches]: t('enum.unittype.in', 'in'),
    [APCIUnitType.Liters]: t('enum.unittype.l', 'l'),
    [APCIUnitType.USGallons]: t('enum.unittype.galus', 'gal US'),
    [APCIUnitType.Kilograms]: t('enum.unittype.kg', 'kg'),
    [APCIUnitType.Pounds]: t('enum.unittype.lbs', 'lbs'),
    [APCIUnitType.StandardCubicFoot]: t('enum.unittype.scf', 'SCF'),
    [APCIUnitType.PercentageFull]: t('enum.unittype.percentfull', '% Full'),
    [APCIUnitType.GaugePressureBarg]: t('enum.apciunittype.barg', 'BARG'),
    [APCIUnitType.GaugePressurePSI]: t('enum.apciunittype.psig', 'PSIG'),
    [APCIUnitType.Volt]: t('enum.apciunittype.volt', 'Volt'),
    [APCIUnitType.Amp]: t('enum.apciunittype.amp', 'A'),
    [APCIUnitType.Counts]: t('enum.apciunittype.counts', 'Counts'),
    [APCIUnitType.DegreeCelcius]: t('enum.apciunittype.degc', 'Deg C'),
    [APCIUnitType.DegreeFahrenheit]: t('enum.apciunittype.degf', 'Deg F'),
    [APCIUnitType.DegreeKelvin]: t('enum.apciunittype.degk', 'Deg K'),
    [APCIUnitType.Hours]: t('enum.apciunittype.hrs', 'Hrs'),
    [APCIUnitType.KilogramPerHour]: t('enum.apciunittype.kgperh', 'KG/H'),
    [APCIUnitType.KilogramMin]: t('enum.apciunittype.kgm', 'KGM'),
    [APCIUnitType.KiloWatt]: t('enum.apciunittype.kw', 'KW'),
    [APCIUnitType.KiloWattHour]: t('enum.apciunittype.kwh', 'KWH'),
    [APCIUnitType.MilliAmp]: t('enum.apciunittype.ma', 'MA'),
    [APCIUnitType.MilliBar]: t('enum.apciunittype.mbar', 'mBAR'),
    [APCIUnitType.Minute]: t('enum.apciunittype.min', 'Min'),
    [APCIUnitType.NormalCubicMeter]: t('enum.apciunittype.nm3', 'NM3'),
    [APCIUnitType.NormalCubicMeterPerHr]: t(
      'enum.apciunittype.nm3perh',
      'NM3/H'
    ),
    [APCIUnitType.Ohms]: t('enum.apciunittype.ohms', 'Ohms'),
    [APCIUnitType.PartPerMillion]: t('enum.apciunittype.ppm', 'PPM'),
    [APCIUnitType.PartPerMillionO2]: t('enum.apciunittype.ppmo2', 'ppmO2'),
    [APCIUnitType.GaugePressurePSIAbsolute]: t(
      'enum.apciunittype.psia',
      'PSIA'
    ),
    [APCIUnitType.StandardCubicFootPerHr]: t('enum.apciunittype.scfh', 'SCFH'),
    [APCIUnitType.Tonne]: t('enum.apciunittype.tonne', 'Tonne'),
    [APCIUnitType.Second]: t('enum.apciunittype.sec', 'Sec'),
  };
};

export const buildAPCITankFunctionTypeTextMapping = (
  t: TFunction
): Record<APCITankFunctionType, string> => {
  return {
    [APCITankFunctionType.Main]: t('enum.apcitankfunctiontype.main', 'Main'),
    [APCITankFunctionType.Reserve1]: t(
      'enum.apcitankfunctiontype.reserve1',
      'Reserve1'
    ),
    [APCITankFunctionType.Reserve2]: t(
      'enum.apcitankfunctiontype.reserve2',
      'Reserve2'
    ),
    [APCITankFunctionType.Reserve3]: t(
      'enum.apcitankfunctiontype.reserve3',
      'Reserve3'
    ),
    [APCITankFunctionType.Reserve4]: t(
      'enum.apcitankfunctiontype.reserve4',
      'Reserve4'
    ),
    [APCITankFunctionType.Reserve5]: t(
      'enum.apcitankfunctiontype.reserve5',
      'Reserve5'
    ),
    [APCITankFunctionType.Reserve6]: t(
      'enum.apcitankfunctiontype.reserve6',
      'Reserve6'
    ),
    [APCITankFunctionType.Reserve7]: t(
      'enum.apcitankfunctiontype.reserve7',
      'Reserve7'
    ),
    [APCITankFunctionType.Reserve8]: t(
      'enum.apcitankfunctiontype.reserve8',
      'Reserve8'
    ),
    [APCITankFunctionType.Reserve9]: t(
      'enum.apcitankfunctiontype.reserve9',
      'Reserve9'
    ),
  };
};

export const buildUnitConversionModeTextMapping = (
  t: TFunction
): Record<UnitConversionModeEnum, string> => {
  return {
    [UnitConversionModeEnum.Basic]: t('enum.unitConversionMode.Basic', 'Basic'),
    [UnitConversionModeEnum.SimplifiedVolumetric]: t(
      'enum.unitConversionMode.simplifiedVolumetric',
      'Simplified Volumetric'
    ),
    [UnitConversionModeEnum.Volumetric]: t(
      'enum.unitConversionMode.volumetric',
      'Volumetric'
    ),
  };
};

// TODO: These translations should probably be verified?
export const buildGasMixerDataChannelTypeTextMapping = (t: TFunction) => {
  return {
    [GasMixerDataChannelType.None]: t('enum.assettype.none', 'None'),
    [GasMixerDataChannelType.Gas1Pressure]: t(
      'enum.gasMixer.gas1Pressure',
      'Gas 1 Pressure'
    ),
    [GasMixerDataChannelType.Gas2Pressure]: t(
      'enum.gasMixer.gas2Pressure',
      'Gas 2 Pressure'
    ),
    [GasMixerDataChannelType.Gas3Pressure]: t(
      'enum.gasMixer.gas3Pressure',
      'Gas 3 Pressure'
    ),
    [GasMixerDataChannelType.DigitalGasInValve]: t(
      'enum.gasMixer.digitalGasInletValve',
      'Digital Gas Inlet Valve'
    ),
    [GasMixerDataChannelType.MixingTankPressure]: t(
      'enum.gasMixer.mixingTankPressure',
      'Mixing Tank Pressure'
    ),
    [GasMixerDataChannelType.GasOutAnalyzer]: t(
      'enum.gasMixer.gasOutAnalyzer',
      'Gas Out Analyzer'
    ),
    [GasMixerDataChannelType.MixerOutputPressure]: t(
      'enum.gasMixer.mixerOutputPressure',
      'Mixer Output Pressure'
    ),
  };
};

export const buildFtpFileFormatCategoryTextMapping = (t: TFunction) => {
  return {
    [FtpFileFormatCategory.None]: t('enum.ftpFileFormat.none', 'None'),
    [FtpFileFormatCategory.Praxair]: t('enum.ftpFileFormat.praxair', 'Praxair'),
    [FtpFileFormatCategory.Apci]: t('enum.ftpFileFormat.apci', 'APCI'),
    [FtpFileFormatCategory.Intellitrans]: t(
      'enum.ftpFileFormat.intellitrans',
      'Intellitrans'
    ),
    [FtpFileFormatCategory.Yara]: t('enum.ftpFileFormat.yara', 'Yara'),
    [FtpFileFormatCategory.Generic]: t('enum.ftpFileFormat.generic', 'Generic'),
    [FtpFileFormatCategory.Linde]: t('enum.ftpFileFormat.linde', 'Linde'),
    [FtpFileFormatCategory.Generic2]: t(
      'enum.ftpFileFormat.generic2',
      'Generic 2'
    ),
    [FtpFileFormatCategory.WhiteMartins]: t(
      'enum.ftpFileFormat.whiteMartins',
      'White Martins'
    ),
    [FtpFileFormatCategory.EndressHauser]: t(
      'enum.ftpFileFormat.endressHauser',
      'Endress Hauser'
    ),
    [FtpFileFormatCategory.PraxairHelium]: t(
      'enum.ftpFileFormat.praxairHelium',
      'Praxair Helium'
    ),
    [FtpFileFormatCategory.GenericJson]: t(
      'enum.ftpFileFormat.genericJson',
      'Generic Json'
    ),
    [FtpFileFormatCategory.Ortec]: t('enum.ftpFileFormat.ortec', 'Ortec'),
  };
};

export const buildDataSourceTypeTextMapping = (t: TFunction) => {
  return {
    [DataChannelDataSource.Manual]: t(
      'enum.datachanneldatasourcetype.manual',
      'Manual'
    ),
    [DataChannelDataSource.RTU]: t('ui.common.rtu', 'RTU'),
    [DataChannelDataSource.PublishedDataChannel]: t(
      'enum.datachanneldatasourcetype.publisheddatachannel',
      'Published Data Channel'
    ),
    [DataChannelDataSource.DataChannel]: t(
      'enum.datachanneldatasourcetype.dataChannels',
      'Data Channels'
    ),
  };
};

export const buildForecastModeTextMapping = (t: TFunction) => {
  return {
    [ForecastMode.NoForecast]: t(
      'enum.forecastmodetype.noforecast',
      'No Forecast'
    ),
    [ForecastMode.HistoricalUsageRate]: t(
      'enum.forecastmodetype.historicalusageratesmoothed',
      'Historical Usage Rate Smoothed'
    ),
    [ForecastMode.ManualUsageRate]: t(
      'enum.forecastmodetype.manualusagerate',
      'Manual Usage Rate'
    ),
    [ForecastMode.Unsmoothed]: t(
      'enum.forecastmodetype.historicalusagerateunsmoothed',
      'Historical Usage Rate Unsmoothed'
    ),
  };
};

export const buildHornerRtuModeTextMapping = (t: TFunction) => {
  return {
    [HornerRtuMode.Compressor]: t(
      'enum.hornerrtutype.compressor',
      'Compressor'
    ),
    [HornerRtuMode.Dispenser]: t('enum.hornerrtutype.dispenser', 'Dispenser'),
  };
};

export const buildHornerRtuCategoryTextMapping = (t: TFunction) => {
  return {
    [HornerRtuCategory.Ip]: t('enum.hornermodeltype.ip', 'IP'),
    [HornerRtuCategory.Serial]: t('enum.hornermodeltype.serial', 'Serial'),
  };
};
export const buildHornerRtuTransportTypeEnumTextMapping = (t: TFunction) => {
  return {
    [RTUTransportTypeEnum.Tcp]: t(
      'enum.rtutransporttype.tcpipcellular',
      'TCP/IP Cellular'
    ),
  };
};
export const buildHornerRtuCarrierTypeEnumTextMapping = (t: TFunction) => {
  return {
    [TelecommunicationsCarrier.AttApci]: t('enum.carrier.attapci', 'AT&T-APCI'),
    [TelecommunicationsCarrier.Att4GApci]: t(
      'enum.carrier.att4gapci',
      'AT&T-APCI-4G'
    ),
  };
};
export const buildRTUAutoTimingCorrectionSourceEnumTextMapping = (
  t: TFunction
) => {
  return {
    [RTUAutoTimingCorrectionSourceEnum.None]: t(
      'enum.rtuautotimingcorrectionsource.none',
      'None'
    ),
    [RTUAutoTimingCorrectionSourceEnum.InitialCorrection]: t(
      'enum.rtuautotimingcorrectionsource.initialcorrection',
      'Initial Correction'
    ),
    [RTUAutoTimingCorrectionSourceEnum.LazyCorrection]: t(
      'enum.rtuautotimingcorrectionsource.lazycorrection',
      'Lazy Correction'
    ),
    [RTUAutoTimingCorrectionSourceEnum.UseServerTimestamp]: t(
      'enum.rtuautotimingcorrectionsource.useservertimestamp',
      'Use Server Timestamp'
    ),
  };
};

export const validScalingModeTypes = [
  ScalingModeType.Linear,
  ScalingModeType.Prescaled,
];

export const validScalingModeTypesForSensorCalibration = [
  ScalingModeType.Linear,
  ScalingModeType.Mapped,
  ScalingModeType.Prescaled,
];

export const allZoomRangeOptions = [
  ReadingsChartZoomLevel.NotSet,
  ReadingsChartZoomLevel.TwoYears,
  ReadingsChartZoomLevel.OneYear,
  ReadingsChartZoomLevel.TwelveWeeks,
  ReadingsChartZoomLevel.FourWeeks,
  ReadingsChartZoomLevel.TwoWeeks,
  ReadingsChartZoomLevel.OneWeek,
  ReadingsChartZoomLevel.FourDays,
  ReadingsChartZoomLevel.TwoDays,
  ReadingsChartZoomLevel.OneDay,
  ReadingsChartZoomLevel.TwelveHours,
  ReadingsChartZoomLevel.SixHours,
  ReadingsChartZoomLevel.ThreeHour,
];
export const nonCustomZoomRangeOptions = allZoomRangeOptions.filter(
  (option) => option !== ReadingsChartZoomLevel.NotSet
);

const supportedAssetTypes = [AssetType.Tank, AssetType.HeliumIsoContainer];

const operatorTypes = [
  VirtualChannelOperatorType.Addition,
  VirtualChannelOperatorType.Subtraction,
  VirtualChannelOperatorType.Multiplication,
  VirtualChannelOperatorType.Division,
  VirtualChannelOperatorType.And,
  VirtualChannelOperatorType.Or,
  VirtualChannelOperatorType.Expoentiation,
];

const pollScheduleTypes = [
  RTUPollScheduleType.Interval,
  RTUPollScheduleType.PointInTime,
];

const simplifiedVolumetricUnits = [
  UnitType.Liters,
  UnitType.KiloLiters,
  UnitType.CubicMeters,
  UnitType.USGallons,
  UnitType.UKGallons,
  UnitType.CubicInches,
  UnitType.CubicFeet,
  UnitType.CubicYards,
  UnitType.Kilograms,
  UnitType.MetricTonne,
  UnitType.Pounds,
  UnitType.TonUS,
  UnitType.StandardCubicMeter,
  UnitType.StandardCubicFoot,
  UnitType.PercentFull,
];

const volumetricDisplayUnits = [
  UnitType.WaterColumnMillimeters,
  UnitType.WaterColumnCentimeters,
  UnitType.WaterColumnMeters,
  UnitType.HydrogenMillimeters,
  UnitType.HydrogenCentimeters,
  UnitType.HydrogenMeters,
  UnitType.WaterColumnInches,
  UnitType.HydrogenInches,
  UnitType.Millimeters,
  UnitType.Centimeters,
  UnitType.Meters,
  UnitType.Inches,
  UnitType.Feet,
  UnitType.Yards,
  UnitType.Liters,
  UnitType.KiloLiters,
  UnitType.CubicMeters,
  // Default seems to no longer be used
  // UnitType.Default,
  UnitType.USGallons,
  UnitType.UKGallons,
  UnitType.CubicInches,
  UnitType.CubicFeet,
  UnitType.CubicYards,
  UnitType.Kilograms,
  UnitType.MetricTonne,
  UnitType.Pounds,
  UnitType.TonUS,
  UnitType.StandardCubicMeter,
  UnitType.StandardCubicFoot,
  UnitType.PercentFull,
];

const unitsOfMeasure = [
  UnitType.Centimeters,
  UnitType.Feet,
  UnitType.Inches,
  UnitType.Meters,
  UnitType.Millimeters,
  UnitType.Yards,
];

const unitsOfVolume = [
  UnitType.CubicFeet,
  UnitType.UKGallons,
  UnitType.USGallons,
  UnitType.CubicInches,
  UnitType.KiloLiters,
  UnitType.Liters,
  UnitType.CubicMeters,
  UnitType.CubicYards,
];

const unitsOfVolumeAndMass = [
  UnitType.Liters,
  UnitType.KiloLiters,
  UnitType.CubicMeters,
  UnitType.USGallons,
  UnitType.UKGallons,
  UnitType.CubicInches,
  UnitType.CubicFeet,
  UnitType.CubicYards,
  UnitType.Kilograms,
  UnitType.MetricTonne,
  UnitType.Pounds,
  UnitType.TonUS,
  UnitType.StandardCubicMeter,
  UnitType.StandardCubicFoot,
];

export enum UnitOfMeasureCategory {
  Volume = 'volume',
  Mass = 'mass',
  Distance = 'distance',
  Other = 'other',
}

export const buildUnitOfMeasureCategoryMapping = (t: TFunction) => {
  return {
    [UnitOfMeasureCategory.Volume]: t(
      'enum.unitOfMeasureCategory.volume',
      'Volume'
    ),
    [UnitOfMeasureCategory.Mass]: t('enum.unitOfMeasureCategory.mass', 'Mass'),
    [UnitOfMeasureCategory.Distance]: t(
      'enum.unitOfMeasureCategory.distance',
      'Distance'
    ),
    [UnitOfMeasureCategory.Other]: t(
      'enum.unitOfMeasureCategory.other',
      'Other'
    ),
  };
};

const unitToCategoryMapping: Record<UnitType, UnitOfMeasureCategory> = {
  [UnitType.WaterColumnMillimeters]: UnitOfMeasureCategory.Distance,
  [UnitType.WaterColumnCentimeters]: UnitOfMeasureCategory.Distance,
  [UnitType.WaterColumnMeters]: UnitOfMeasureCategory.Distance,
  [UnitType.HydrogenMillimeters]: UnitOfMeasureCategory.Distance,
  [UnitType.HydrogenCentimeters]: UnitOfMeasureCategory.Distance,
  [UnitType.HydrogenMeters]: UnitOfMeasureCategory.Distance,
  [UnitType.WaterColumnInches]: UnitOfMeasureCategory.Distance,
  [UnitType.HydrogenInches]: UnitOfMeasureCategory.Distance,
  [UnitType.Millimeters]: UnitOfMeasureCategory.Distance,
  [UnitType.Centimeters]: UnitOfMeasureCategory.Distance,
  [UnitType.Meters]: UnitOfMeasureCategory.Distance,
  [UnitType.Inches]: UnitOfMeasureCategory.Distance,
  [UnitType.Feet]: UnitOfMeasureCategory.Distance,
  [UnitType.Yards]: UnitOfMeasureCategory.Distance,
  [UnitType.Liters]: UnitOfMeasureCategory.Volume,
  [UnitType.KiloLiters]: UnitOfMeasureCategory.Volume,
  [UnitType.CubicMeters]: UnitOfMeasureCategory.Volume,
  [UnitType.Default]: UnitOfMeasureCategory.Other,
  [UnitType.USGallons]: UnitOfMeasureCategory.Volume,
  [UnitType.UKGallons]: UnitOfMeasureCategory.Volume,
  [UnitType.CubicInches]: UnitOfMeasureCategory.Volume,
  [UnitType.CubicFeet]: UnitOfMeasureCategory.Volume,
  [UnitType.CubicYards]: UnitOfMeasureCategory.Volume,
  [UnitType.Kilograms]: UnitOfMeasureCategory.Mass,
  [UnitType.MetricTonne]: UnitOfMeasureCategory.Mass,
  [UnitType.Pounds]: UnitOfMeasureCategory.Mass,
  [UnitType.TonUS]: UnitOfMeasureCategory.Mass,
  [UnitType.StandardCubicMeter]: UnitOfMeasureCategory.Volume,
  [UnitType.StandardCubicFoot]: UnitOfMeasureCategory.Volume,
  [UnitType.PercentFull]: UnitOfMeasureCategory.Other,
};

export const buildFreezerAssetSubTypeMapping = (
  t: TFunction
): Record<AssetSubTypeEnum, string> => {
  return {
    [AssetSubTypeEnum.CompactSpiral]: t(
      'enum.assetSubType.compactSpiral',
      'Compact Spiral'
    ),
    [AssetSubTypeEnum.SuperContact]: t(
      'enum.assetSubType.superContact',
      'Super Contact'
    ),
    [AssetSubTypeEnum.Cryowave]: t('enum.assetSubType.cryowave', 'Cryowave'),
    [AssetSubTypeEnum.ModularTunnel]: t(
      'enum.assetSubType.modularTunnel',
      'Modular Tunnel'
    ),
  };
};

// TODO: The code below could instead start with the filtered array, instead of
// getting all units of measure, then filtering using the filtered array
// todo: model related stuff should not be in utils, and should live on model or beside it instead
export const getSimplifiedVolumetricUnits = (t: TFunction) => {
  const unitsOfMeasureMapping = buildUnitsOfMeasureTextMapping(t);
  return simplifiedVolumetricUnits
    .filter((unit) => !!unitsOfMeasureMapping[unit])
    .map((unit) => ({
      label: unitsOfMeasureMapping[unit],
      value: unit,
      type: unitToCategoryMapping[unit],
    }));
};

export const getVolumetricDisplayUnits = (t: TFunction) => {
  const unitsOfMeasureMapping = buildUnitsOfMeasureTextMapping(t);
  return volumetricDisplayUnits
    .filter((unit) => !!unitsOfMeasureMapping[unit])
    .map((unit) => ({
      label: unitsOfMeasureMapping[unit],
      value: unit,
      type: unitToCategoryMapping[unit],
    }));
};

export const getUnitTypeOptions = (
  t: TFunction,
  unitTypes?: UnitType[] | null
) => {
  const unitsOfMeasureMapping = buildUnitsOfMeasureTextMapping(t);
  return (
    Object.keys(unitsOfMeasureMapping)
      .filter((unit) =>
        unitTypes ? unitTypes.includes(Number(unit) as UnitType) : true
      )
      // @ts-ignore
      .map((unit) => ({ label: unitsOfMeasureMapping[unit], value: unit }))
      .sort((a, b) => a.label.localeCompare(b.label))
  );
};

export const getTankDimensionTypeOptions = (t: TFunction) => {
  const tankTypeMapping = buildTankTypeTextMapping(t);
  return (
    Object.keys(tankTypeMapping)
      .filter((type) => Number(type) !== TankType.TotalizedTank)
      // @ts-ignore
      .map((type) => ({ label: tankTypeMapping[type], value: Number(type) }))
      .sort((a, b) => a.label.localeCompare(b.label))
  );
};

export const getTankDimensionUnitsOfMeasureOptions = (t: TFunction) => {
  const unitsOfMeasureMapping = buildUnitsOfMeasureTextMapping(t);
  return (
    Object.keys(unitsOfMeasureMapping)
      .filter((unit) => unitsOfMeasure.includes(Number(unit) as UnitType))
      // @ts-ignore
      .map((unit) => ({ label: unitsOfMeasureMapping[unit], value: unit }))
      .sort((a, b) => a.label.localeCompare(b.label))
  );
};

export const getUnitsOfVolumeOptions = (t: TFunction) => {
  const unitsOfMeasureMapping = buildUnitsOfMeasureTextMapping(t);
  return unitsOfVolume
    .map((unit) => ({
      label: unitsOfMeasureMapping[unit],
      value: unit,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};

export const buildRTUCategoryTypeTextMapping = (t: TFunction) => {
  return {
    [RTUCategoryType.Unknown]: t('enum.rtucategorytype.unknown', 'Unknown'),
    [RTUCategoryType.SMS]: t('enum.rtucategorytype.sms', 'SMS'),
    [RTUCategoryType.Modbus]: t('enum.rtucategorytype.modbus', 'Modbus'),
    [RTUCategoryType.Clover]: t('enum.rtucategorytype.clover', 'Clover'),
    [RTUCategoryType.Metron2]: t('enum.rtucategorytype.metron', 'Metron 2'),
    [RTUCategoryType.Horner]: t('enum.rtucategorytype.horner', 'Horner'),
    [RTUCategoryType.File]: t('enum.rtucategorytype.file', 'File'),
    [RTUCategoryType.FourHundredSeries]: t(
      'enum.rtucategorytype.FourHundredSeries',
      '400 Series'
    ),
  };
};
export const buildRTUTypeTextMapping = (t: TFunction) => {
  return {
    [RTUType.Compak]: t('enum.rtutype.compak', 'Compak'),
    [RTUType.Infact]: t('enum.rtutype.infact', 'Infact'),
    [RTUType.GGPlant]: t('enum.rtutype.ggplant', 'GG Plant'),
    [RTUType.Demo4Channel]: t('enum.rtutype.demo4channel', 'Demo 4 Channel'),
    [RTUType.FA]: t('enum.rtutype.fa', 'Class 1'),
    [RTUType.FakeWired4Channel]: t(
      'enum.rtutype.fakewired4channel',
      'Fake Wired 4 Channel'
    ),
    [RTUType.FE]: t('enum.rtutype.fe', 'FE'),
    [RTUType.FE0]: t('enum.rtutype.fe0', 'FE0'),
    [RTUType.FF1]: t('enum.rtutype.ff1', 'FF1'),
    [RTUType.FF4]: t('enum.rtutype.ff4', 'FF4'),
    [RTUType.FF5]: t('enum.rtutype.ff5', 'FF5'),
    [RTUType.FF6]: t('enum.rtutype.ff6', 'FF6'),
    [RTUType.FF70]: t('enum.rtutype.ff70', 'FF70'),
    [RTUType.FF71]: t('enum.rtutype.ff71', 'FF71'),
    [RTUType.FF72]: t('enum.rtutype.ff72', 'FF72'),
    [RTUType.FF74]: t('enum.rtutype.ff74', 'FF74'),
    [RTUType.FF75]: t('enum.rtutype.ff75', 'FF75'),
    [RTUType.FF78]: t('enum.rtutype.ff78', 'FF78'),
    [RTUType.FF79]: t('enum.rtutype.ff79', 'FF79'),
    [RTUType.FF7A]: t('enum.rtutype.ff7a', 'FF7A'),
    [RTUType.FF7B]: t('enum.rtutype.ff7b', 'FF7B'),
    [RTUType.FF7D]: t('enum.rtutype.ff7d', 'FF7D'),
    [RTUType.FF7E]: t('enum.rtutype.ff7e', 'FF7E'),
    [RTUType.FF7F]: t('enum.rtutype.ff7f', 'FF7F'),
    [RTUType.FF8]: t('enum.rtutype.ff8', 'FF8'),
    [RTUType.FF9]: t('enum.rtutype.ff9', 'FF9'),
    [RTUType.FFA]: t('enum.rtutype.ffa', 'FFA'),
    [RTUType.FFB]: t('enum.rtutype.ffb', 'FFB'),
    [RTUType.FFD]: t('enum.rtutype.ffd', 'FFD'),
    [RTUType.FFE]: t('enum.rtutype.ffe', 'FFE'),
    [RTUType.File]: t('enum.rtutype.file', 'File'),
    [RTUType.Horner]: t('enum.rtutype.horner', 'Horner'),
    [RTUType.Metron2]: t('enum.rtutype.metron2', 'Metron 2'),
    [RTUType.None]: t('enum.rtutype.none', 'None'),
    [RTUType.TrippleHash]: t('enum.rtutype.tripplehash', 'Tripple Hash'),
    [RTUType.DP489]: t('enum.rtutype.dp489', 'DP489'),
    [RTUType.BC474]: t('enum.rtutype.bc474', 'BC474'),
    [RTUType.FF73]: t('enum.rtutype.ff73', 'FF73'),
    [RTUType.LC490]: t('enum.rtutype.lc490', 'LC490'),
    [RTUType.GU476]: t('enum.rtutype.gu476', 'GU476'),
    [RTUType.FF7C]: t('enum.rtutype.ff7c', 'FF7C'),
    [RTUType.FF17]: t('enum.rtutype.ff17', 'FF17'),
    [RTUType.EaglePaymeter]: t('enum.rtutype.eaglepaymeter', 'Eagle Paymeter'),
    [RTUType.KT09]: t('enum.rtutype.kt09', 'KT09'),
    [RTUType.EG501]: t('enum.rtutype.eg501', 'EG501'),
  };
};

export const buildRtuDeviceTypeTextMapping = (t: TFunction) => {
  return {
    [RtuDeviceType.Compak]: t('enum.rtutype.compak', 'Compak'),
    [RtuDeviceType.Infact]: t('enum.rtutype.infact', 'Infact'),
    [RtuDeviceType.GGPlant]: t('enum.rtutype.ggplant', 'GG Plant'),
    [RtuDeviceType.Demo4Channel]: t(
      'enum.rtutype.demo4channel',
      'Demo 4 Channel'
    ),
    [RtuDeviceType.FA]: t('enum.rtutype.fa', 'Class 1'),
    [RtuDeviceType.FakeWired4Channel]: t(
      'enum.rtutype.fakewired4channel',
      'Fake Wired 4 Channel'
    ),
    [RtuDeviceType.FE]: t('enum.rtutype.fe', 'FE'),
    [RtuDeviceType.FE0]: t('enum.rtutype.fe0', 'FE0'),
    [RtuDeviceType.FF1]: t('enum.rtutype.ff1', 'FF1'),
    [RtuDeviceType.FF4]: t('enum.rtutype.ff4', 'FF4'),
    [RtuDeviceType.FF5]: t('enum.rtutype.ff5', 'FF5'),
    [RtuDeviceType.FF6]: t('enum.rtutype.ff6', 'FF6'),
    [RtuDeviceType.FF70]: t('enum.rtutype.ff70', 'FF70'),
    [RtuDeviceType.FF71]: t('enum.rtutype.ff71', 'FF71'),
    [RtuDeviceType.FF72]: t('enum.rtutype.ff72', 'FF72'),
    [RtuDeviceType.FF74]: t('enum.rtutype.ff74', 'FF74'),
    [RtuDeviceType.FF75]: t('enum.rtutype.ff75', 'FF75'),
    [RtuDeviceType.FF78]: t('enum.rtutype.ff78', 'FF78'),
    [RtuDeviceType.FF79]: t('enum.rtutype.ff79', 'FF79'),
    [RtuDeviceType.FF7A]: t('enum.rtutype.ff7a', 'FF7A'),
    [RtuDeviceType.FF7B]: t('enum.rtutype.ff7b', 'FF7B'),
    [RtuDeviceType.FF7D]: t('enum.rtutype.ff7d', 'FF7D'),
    [RtuDeviceType.FF7E]: t('enum.rtutype.ff7e', 'FF7E'),
    [RtuDeviceType.FF7F]: t('enum.rtutype.ff7f', 'FF7F'),
    [RtuDeviceType.FF8]: t('enum.rtutype.ff8', 'FF8'),
    [RtuDeviceType.FF9]: t('enum.rtutype.ff9', 'FF9'),
    [RtuDeviceType.FFA]: t('enum.rtutype.ffa', 'FFA'),
    [RtuDeviceType.FFB]: t('enum.rtutype.ffb', 'FFB'),
    [RtuDeviceType.FFD]: t('enum.rtutype.ffd', 'FFD'),
    [RtuDeviceType.FFE]: t('enum.rtutype.ffe', 'FFE'),
    [RtuDeviceType.File]: t('enum.rtutype.file', 'File'),
    [RtuDeviceType.Horner]: t('enum.rtutype.horner', 'Horner'),
    [RtuDeviceType.Metron2]: t('enum.rtutype.metron2', 'Metron 2'),
    [RtuDeviceType.None]: t('enum.rtutype.none', 'None'),
    [RtuDeviceType.TrippleHash]: t('enum.rtutype.tripplehash', 'Tripple Hash'),
    [RtuDeviceType.DP489]: t('enum.rtutype.dp489', 'DP489'),
    [RtuDeviceType.BC474]: t('enum.rtutype.bc474', 'BC474'),
    [RtuDeviceType.FF73]: t('enum.rtutype.ff73', 'FF73'),
    [RtuDeviceType.LC490]: t('enum.rtutype.lc490', 'LC490'),
    [RtuDeviceType.GU476]: t('enum.rtutype.gu476', 'GU476'),
    [RtuDeviceType.FF7C]: t('enum.rtutype.ff7c', 'FF7C'),
    [RtuDeviceType.FF17]: t('enum.rtutype.ff17', 'FF17'),
    [RtuDeviceType.EaglePaymeter]: t(
      'enum.rtutype.eaglepaymeter',
      'Eagle Paymeter'
    ),
    [RtuDeviceType.KT09]: t('enum.rtutype.kt09', 'KT09'),
    [RtuDeviceType.EG501]: t('enum.rtutype.eg501', 'EG501'),
  };
};

export const buildRtuProtocolTypeEnumTextMapping = (t: TFunction) => {
  return {
    [RtuProtocolTypeEnum.None]: t('ui.common.none', 'None'),
    [RtuProtocolTypeEnum.ModbusGeneric]: t(
      'enum.modbusprotocoltype.modbusgeneric',
      'Modbus Generic'
    ),
    [RtuProtocolTypeEnum.ModbusApci]: t(
      'enum.modbusprotocoltype.modbusa',
      'Modbus A'
    ),
    [RtuProtocolTypeEnum.ModbusPraxair]: t(
      'enum.modbusprotocoltype.modbusp',
      'Modbus P'
    ),
    [RtuProtocolTypeEnum.CloverGeneric]: t(
      'enum.modbusprotocoltype.clovergeneric',
      'Clover Generic'
    ),
    [RtuProtocolTypeEnum.CloverInfAct]: t(
      'enum.modbusprotocoltype.cloverinfack',
      'Clover InfAck'
    ),
    [RtuProtocolTypeEnum.CloverCompak]: t(
      'enum.modbusprotocoltype.clovercompak',
      'Clover Compak'
    ),
    [RtuProtocolTypeEnum.Unknown]: t(
      'enum.modbusprotocoltype.unknown',
      'Unknown'
    ),
    [RtuProtocolTypeEnum.Mertron2]: t(
      'enum.modbusprotocoltype.metron2',
      'Metron 2'
    ),
    [RtuProtocolTypeEnum.Horner]: t('enum.modbusprotocoltype.horner', 'Horner'),
    [RtuProtocolTypeEnum.KT09]: t('enum.rtuprotocoltype.kt09', 'KT09'),
    [RtuProtocolTypeEnum.Echo]: t('ui.rtuProtocolType.echo', 'Echo'),
  };
};

export const buildRtuTransportTypeEnumTextMapping = (t: TFunction) => {
  return {
    [RTUTransportTypeEnum.None]: t('ui.common.none', 'None'),
    [RTUTransportTypeEnum.Pstn]: t('enum.rtutransporttype.pstn', 'PSTN'),
    [RTUTransportTypeEnum.Tcp]: t('enum.rtutransporttype.tcpip', 'TCP/IP'),
    [RTUTransportTypeEnum.Udp]: t('enum.rtutransporttype.udp', 'UDP'),
  };
};

export const buildPasswordStrengthTextMapping = (t: TFunction) => {
  return {
    [OverallPasswordStrength.None]: t('ui.common.notapplicable', 'N/A'),
    [OverallPasswordStrength.Weak]: t('enum.passwordStrength.weak', 'Weak'),
    [OverallPasswordStrength.Fair]: t('enum.passwordStrength.fair', 'Fair'),
    [OverallPasswordStrength.Good]: t('enum.passwordStrength.good', 'Good'),
    [OverallPasswordStrength.Strong]: t(
      'enum.passwordStrength.strong',
      'Strong'
    ),
    [OverallPasswordStrength.Excellent]: t(
      'enum.passwordStrength.excellent',
      'Excellent'
    ),
  };
};

export const buildRtuDevicePollFilterTextMapping = (t: TFunction) => {
  return {
    [RtuDevicePollFilter.InstantaneousAndHistoricalReadings]: t(
      'enum.pollfiltertype.instantaneousandhistoricalreadings',
      'Instantaneous & Historical Readings'
    ),
    [RtuDevicePollFilter.InstantaneousReadingsOnly]: t(
      'enum.pollfiltertype.instantaneousreadingsonly',
      'Instantaneous Readings Only'
    ),
  };
};

export const getTextForPasswordStrengthLevel = (
  t: TFunction,
  level: OverallPasswordStrength
) => {
  const textMapping = buildPasswordStrengthTextMapping(t);
  return textMapping[level] || textMapping[OverallPasswordStrength.None];
};

export const getUnitDisplayTypeOptions = (t: TFunction) => {
  const textMapping = buildUnitDisplayTypeTextMapping(t);
  return Object.keys(textMapping).map((type) => ({
    label: textMapping[Number(type) as UnitDisplayType],
    value: Number(type) as UnitDisplayType,
  }));
};

export const getPollScheduleTypeOptions = (t: TFunction) => {
  const pollScheduleTypeMapping = buildPollScheduleTypeMapping(t);
  return pollScheduleTypes.map((item) => ({
    label: pollScheduleTypeMapping[item],
    value: item,
  }));
};

export const getOperatorTypeOptions = () => {
  const operatorTypeMapping = buildOperatorTypeMapping();
  return operatorTypes.map((item) => ({
    label: operatorTypeMapping[item],
    value: item,
  }));
};

export const getAssetTypeOptions = (t: TFunction) => {
  const mapping = buildAssetTypeTextMapping(t);
  return Object.keys(AssetType).map((type) => ({
    label: mapping[Number(type) as AssetType],
    value: Number(type) as AssetType,
  }));
};

export const getEventImportanceLevelOptions = (t: TFunction) => {
  const textMapping = buildImportanceLevelTextMapping(t);
  return Object.keys(textMapping).map((type) => ({
    label: textMapping[Number(type) as EventImportanceLevelType],
    value: Number(type) as EventImportanceLevelType,
  }));
};

export const getSupportedAssetTypeOptions = (t: TFunction) => {
  const assetTypeOptions = getAssetTypeOptions(t);
  return assetTypeOptions.filter((option) =>
    supportedAssetTypes.includes(option.value)
  );
};

function getOptionsFromArray<T>(
  t: TFunction,
  // @ts-ignore
  textMappingFn: (t: TFunction) => Record<T, string>,
  arrayOfEnums: T[]
) {
  const textMapping = textMappingFn(t);
  return arrayOfEnums
    .map((enumValue) => ({
      label: textMapping[enumValue],
      value: enumValue,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function getOptionsForTextMapping<T>(
  t: TFunction,
  // @ts-ignore
  textMappingFn: (t: TFunction) => { [key: T]: string }
) {
  const textMapping = textMappingFn(t);
  return Object.entries(textMapping).map(([key, value]) => ({
    label: value as string,
    value: (Number(key) as unknown) as T,
  }));
}

export const getForecastModeTypeOptions = (t: TFunction) => {
  return getOptionsForTextMapping<ForecastModeType>(
    t,
    buildForecastModeTypeTextMapping
  );
};

export const getSupportedUOMTypeOptionsForTankSetup = (t: TFunction) => {
  return getOptionsForTextMapping<SupportedUOMType>(
    t,
    buildSupportedUOMTypeTextMapping
  ).filter((option) => option.value !== SupportedUOMType.BasicWithPercentFull);
};

export const getGeoAreaCategoryTypeOptions = (t: TFunction) => {
  const mappings = getOptionsForTextMapping<GeoAreaCategory>(
    t,
    buildGeoAreaCategoryTypeTextMapping
  );
  return mappings.sort((itemA: any, itemB: any) =>
    itemA.label.localeCompare(itemB.label)
  );
};

export const getAllUnitOptions = (t: TFunction) => {
  return getOptionsForTextMapping<UnitType>(
    t,
    buildUnitsOfMeasureTextMapping
  ).map((option) => ({
    ...option,
    type: unitToCategoryMapping[option.value],
  }));
};

export const getUnitsOfVolumeAndMassOptions = (t: TFunction) => {
  return getOptionsFromArray(
    t,
    buildUnitsOfMeasureTextMapping,
    unitsOfVolumeAndMass
  );
};

export const getScalingModeTypeOptions = (t: TFunction) => {
  return getOptionsForTextMapping<ScalingModeType>(
    t,
    buildScalingModeTypeTextMapping
  ).filter((option) => validScalingModeTypes.includes(option.value));
};

export const getScalingModeTypeOptionsForSensorCalibration = (t: TFunction) => {
  return getOptionsForTextMapping<ScalingModeType>(
    t,
    buildScalingModeTypeTextMapping
  ).filter((option) =>
    validScalingModeTypesForSensorCalibration.includes(option.value)
  );
};

interface GetUnitOfMeasureTypeOptions {
  supportedUOMType?: SupportedUOMType;
  scaledUnit?: string | null;
  t: TFunction;
}

export const getUnitOfMeasureTypeOptions = ({
  supportedUOMType,
  scaledUnit,
  t,
}: GetUnitOfMeasureTypeOptions) => {
  const scaledUnitOption = {
    label: scaledUnit || '',
    value: '',
    type: UnitOfMeasureCategory.Other,
  };

  switch (supportedUOMType) {
    case SupportedUOMType.Basic:
      return [scaledUnitOption];
    case SupportedUOMType.BasicWithPercentFull:
      return [
        scaledUnitOption,
        {
          label: t('enum.unittype.percentfull', '% Full'),
          value: UnitType.PercentFull,
          type: UnitOfMeasureCategory.Other,
        },
      ];
    case SupportedUOMType.SimplifiedVolumetric: {
      const unitOptions = getSimplifiedVolumetricUnits(t);
      return [scaledUnitOption, ...unitOptions];
    }
    case SupportedUOMType.Volumetric:
      return getVolumetricDisplayUnits(t);
    default:
      return [];
  }
};

// Problem Report Status Options
export const buildProblemReportStatusEnumTextMapping = (t: TFunction) => {
  return {
    [ProblemReportStatusFilterEnum.Open]: t(
      'enum.problemreportstatus.open',
      'Open'
    ),
    [ProblemReportStatusFilterEnum.Closed]: t(
      'enum.problemreportstatus.closed',
      'Closed'
    ),
    [ProblemReportStatusFilterEnum.Both]: t(
      'enum.problemreportstatus.both',
      'Both'
    ),
  };
};
export const getProblemReportStatusEnumOptions = (t: TFunction) => {
  return getOptionsForTextMapping<ProblemReportStatusFilterEnum>(
    t,
    buildProblemReportStatusEnumTextMapping
  );
};

export const getProblemReportPriorityLevelOptions = (t: TFunction) => {
  const textMapping = buildProblemReportPriorityTextMapping(t);
  return Object.keys(textMapping).map((type) => ({
    label: textMapping[Number(type) as ProblemReportPriorityEnum],
    value: Number(type) as ProblemReportPriorityEnum,
  }));
};

export const getAPCIUnitTypeOptionsForIntegrationInfo = (t: TFunction) => {
  return getOptionsForTextMapping<APCIUnitType>(
    t,
    buildAPCIUnitTypeTextMapping
  );
};

export const getAPCITankFunctionTypeOptionsForIntegrationInfo = (
  t: TFunction
) => {
  return getOptionsForTextMapping<APCIUnitType>(
    t,
    buildAPCITankFunctionTypeTextMapping
  );
};

export const getUnitConversionModeEnumOptionsForTankSetupInfo = (
  t: TFunction
) => {
  return getOptionsForTextMapping<UnitConversionModeEnum>(
    t,
    buildUnitConversionModeTextMapping
  );
};

export const getUnitTypeEnumOptionsForDataChannelEditor = (t: TFunction) => {
  return getOptionsForTextMapping<UnitTypeEnum>(
    t,
    buildUnitTypeEnumTextMapping
  );
};

export const getGasMixerDataChannelTypeOptions = (t: TFunction) => {
  return getOptionsForTextMapping<GasMixerDataChannelType>(
    t,
    buildGasMixerDataChannelTypeTextMapping
  );
};

export const getFtpFileFormatCategoryOptions = (t: TFunction) => {
  return getOptionsForTextMapping<FtpFileFormatCategory>(
    t,
    buildFtpFileFormatCategoryTextMapping
  );
};

export const getDataSourceTypeOptions = (t: TFunction) => {
  return getOptionsForTextMapping<DataChannelDataSource>(
    t,
    buildDataSourceTypeTextMapping
  );
};

export const getFreezerAssetSubTypeOptions = (t: TFunction) => {
  return getOptionsForTextMapping<AssetSubTypeEnum>(
    t,
    buildFreezerAssetSubTypeMapping
  );
};

export const getForecastModeOptions = (t: TFunction) => {
  return getOptionsForTextMapping<ForecastMode>(
    t,
    buildForecastModeTextMapping
  );
};

export const getInventoryStatusTypeOptions = (t: TFunction) => {
  return getOptionsForTextMapping<EventInventoryStatusType>(
    t,
    buildInventoryStatusTypeEnumTextMapping
  );
};

export const getRtuPacketCategoryOptions = (t: TFunction) => {
  return getOptionsForTextMapping<RtuPacketCategory>(
    t,
    buildPacketTypeGroupTextMapping
  );
};

export const getRTUCommunicationDirectionEnumOptions = (t: TFunction) => {
  return getOptionsForTextMapping<RtuPacketsChannelTypeForFilter>(
    t,
    buildRTUCommunicationDirectionTextMapping
  );
};

export const getRtuChannelTypeOptions = (t: TFunction) => {
  return getOptionsForTextMapping<RtuPacketsChannelType>(
    t,
    buildRtuChannelTypeTextMapping
  );
};

export const getRtuStatusTypeOptions = (t: TFunction) => {
  return getOptionsForTextMapping<RcmJournalItemStatusEnum>(
    t,
    buildRtuStatusTypeTextMapping
  );
};
