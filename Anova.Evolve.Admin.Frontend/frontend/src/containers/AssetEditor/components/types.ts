import { ReactNode } from 'react';
import {
  EvolveDataChannelTemplateDetail,
  EventRuleGroupInfo,
  EditAssetDataChannel,
  DataChannelType,
} from 'api/admin/api';

export interface CommonDataChannelFormProps {
  assetId?: string | null;
  dataChannelTemplates?: EvolveDataChannelTemplateDetail[] | null;
  dataChannels?: EditAssetDataChannel[] | null;
  eventRuleGroups?: EventRuleGroupInfo[] | null;
  levelDataChannels?: EditAssetDataChannel[];
  headerNavButton?: ReactNode;
  validTotalizerLevelDataChannels?: EditAssetDataChannel[];
  handleCancel?: () => void;
  addDataChannels: (newDataChannels?: any[] | null) => void;
}

export interface DataChannelFormPageIntroProps {
  title: React.ReactNode;
  isSubmitting: boolean;
  headerNavButton?: React.ReactNode;
  handleSave?: () => void;
  handleCancel?: () => void;
}

export const analogChannelTypes = [
  DataChannelType.Level,
  DataChannelType.Pressure,
  DataChannelType.Counter,
  DataChannelType.FlowMeter,
  DataChannelType.OtherAnalog,
  DataChannelType.Temperature,
];

export const digitalChannelTypes = [DataChannelType.DigitalInput];
