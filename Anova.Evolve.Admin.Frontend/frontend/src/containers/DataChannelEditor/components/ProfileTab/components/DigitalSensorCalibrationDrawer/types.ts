import {
  DigitalStateProfileDTO,
  DigitalInputSensorCalibrationInfoDTO,
} from 'api/admin/api';

export interface Values {
  digitalInputSensorCalibration?: DigitalInputSensorCalibrationInfoDTO | null;
  digitalStateProfiles?: DigitalStateProfileDTO[] | null;
  dataChannelId?: string;
  state0Limit?: number | null;
  state0Text?: string | null;
  state0IsConfigured?: boolean;
  state1Limit?: number | null;
  state1Text?: string | null;
  state1IsConfigured?: boolean;
  state2Limit?: number | null;
  state2Text?: string | null;
  state2IsConfigured?: boolean;
  state3Limit?: number | null;
  state3Text?: string | null;
  state3IsConfigured?: boolean;
  isRawDataInverted?: boolean;
  invertData?: boolean;
}
