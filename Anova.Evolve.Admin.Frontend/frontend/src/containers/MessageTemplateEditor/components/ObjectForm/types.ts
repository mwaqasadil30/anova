import { MessageTemplateCategory, TimeZoneTypeEnum } from 'api/admin/api';

export interface Values {
  messageTemplateId?: number;
  description?: string | null;
  rosterCount?: number;
  messageTemplateTypeId?: MessageTemplateCategory;
  domainId?: string;
  timeZoneTypeId?: TimeZoneTypeEnum | '';
  timeZoneId?: number | null | '';
  dateFormat?: string | null;
  timeFormat?: string | null;
  subjectTemplate: string;
  bodyTemplate: string;
  replyTo?: string | null;
  sendToAddressList?: string | null;
  sendToCcAddressList?: string | null;
  sendToBccAddressList?: string | null;
}

export interface FormattedTemplates {
  subject: string;
  body: string;
}
