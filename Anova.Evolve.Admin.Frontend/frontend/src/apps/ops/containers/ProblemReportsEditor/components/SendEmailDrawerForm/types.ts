export interface Values {
  messageTemplateId?: number | undefined;
  subjectTemplate: string;
  bodyTemplate: string;
  replyTo?: string;
  sendToAddressList: string;
  sendToCcAddressList: string;
  sendToBccAddressList: string;
}
