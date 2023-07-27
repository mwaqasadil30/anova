import { MessageTemplateDto } from 'api/admin/api';

export type SaveCallbackFunction = (response: MessageTemplateDto) => void;

interface TemplateBodyAndSubject {
  isValid: boolean;
  startErrorPositions?: number[];
  endErrorPositions?: number[];
  invalidVariables?: string[];
}

export interface TemplateValidation {
  subject: TemplateBodyAndSubject;
  body: TemplateBodyAndSubject;
}
