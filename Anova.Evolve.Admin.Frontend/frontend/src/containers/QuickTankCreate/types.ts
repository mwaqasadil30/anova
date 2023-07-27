import {
  EventRuleInfo,
  EvolveDataChannelTemplateDetail,
  ProductDetail,
  RetrieveSiteEditComponentsResult,
  RTUChannelUsageInfo,
  SourceDataChannelDefaultsInfo,
  TankDimensionDetail,
  UnitType,
  FtpDomainInfo,
  RTUDeviceInfo,
} from 'api/admin/api';
import { FormikProps } from 'formik';
import { Dispatch, SetStateAction } from 'react';
import { Values } from './components/TankForm/types';

export interface FormChangeEffectProps {
  values: Values;
  selectedRtu: RTUDeviceInfo | null;
  rtuChannelsFromRtu?: RTUChannelUsageInfo[] | null;
  integrationDomains?: FtpDomainInfo[] | null;
  selectedLevelSensor?: EvolveDataChannelTemplateDetail;
  scaledUnitTypeOption?: {
    label: any;
    value: string;
  };
  sourceDataChannelDetails?: SourceDataChannelDefaultsInfo | null;
  unitTypeTextToEnumMapping?: Record<string, UnitType>;
  setFieldValue: FormikProps<Values>['setFieldValue'];
  setEventRuleGroupInfoDetails: Dispatch<
    SetStateAction<EventRuleInfo[] | null | undefined>
  >;
  setRtuChannelsFromRtu: Dispatch<
    SetStateAction<RTUChannelUsageInfo[] | null | undefined>
  >;
  setTankDimensionDetails: Dispatch<
    SetStateAction<TankDimensionDetail | null | undefined>
  >;
  setProductDetails: Dispatch<SetStateAction<ProductDetail | null | undefined>>;
  setSourceDataChannelDetails: Dispatch<
    SetStateAction<SourceDataChannelDefaultsInfo | null | undefined>
  >;
  setSiteDetails: Dispatch<
    SetStateAction<RetrieveSiteEditComponentsResult | null | undefined>
  >;
}
