import {
  FtpDomainInfo,
  RetrieveSiteEditComponentsResult,
  RTUChannelUsageInfo,
  RTUDeviceInfo,
  SourceDataChannelDefaultsInfo,
  UnitType,
} from 'api/admin/api';
import { FormikProps } from 'formik';
import { Dispatch, SetStateAction } from 'react';
import { Values } from './components/TankForm/types';

export interface FormChangeEffectProps {
  values: Values;
  selectedRtu: RTUDeviceInfo | null;
  rtuChannelsFromRtu?: RTUChannelUsageInfo[] | null;
  integrationDomains?: FtpDomainInfo[] | null;
  sourceDataChannelDetails?: SourceDataChannelDefaultsInfo | null;
  unitTypeTextToEnumMapping?: Record<string, UnitType>;
  setFieldValue: FormikProps<Values>['setFieldValue'];
  setRtuChannelsFromRtu: Dispatch<
    SetStateAction<RTUChannelUsageInfo[] | null | undefined>
  >;
  setSiteDetails: Dispatch<
    SetStateAction<RetrieveSiteEditComponentsResult | null | undefined>
  >;
}
