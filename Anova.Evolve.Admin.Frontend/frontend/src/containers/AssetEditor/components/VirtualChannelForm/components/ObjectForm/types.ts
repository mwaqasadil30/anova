import { VirtualChannelOperatorType } from 'api/admin/api';

interface Operand {
  dataChannel?: string | null;
  expression?: string | null;
  constant?: string | null;
  operation?: VirtualChannelOperatorType | null;
}

export interface Values {
  description?: string | null;
  dataChannelTemplateId?: string | null;
  eventRuleGroupId?: string | null;
  formulaParts?: Operand[] | null;
}
