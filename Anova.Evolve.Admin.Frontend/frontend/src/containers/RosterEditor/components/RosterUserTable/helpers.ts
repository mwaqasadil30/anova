export enum RosterUserColumnId {
  FirstName = 'firstName',
  LastName = 'lastName',
  Company = 'companyName',
  Enabled = 'isEnabled',
  NotificationByEmail = 'isEmailSelected',
  IsEmailToPhoneSelected = 'isEmailToPhoneSelected',
  ContactAddresses = 'contactAddresses',
  MessageTemplates = 'messageTemplates',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case RosterUserColumnId.FirstName:
      return 'First name';
    case RosterUserColumnId.LastName:
      return 'Last name';
    case RosterUserColumnId.Company:
      return 'Company';
    case RosterUserColumnId.Enabled:
      return 'Enabled';
    case RosterUserColumnId.NotificationByEmail:
      return 'Notification by email';
    case RosterUserColumnId.IsEmailToPhoneSelected:
      return 'Email to phone';
    case RosterUserColumnId.ContactAddresses:
      return 'Contact address(es)';
    case RosterUserColumnId.MessageTemplates:
      return 'Message template';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case RosterUserColumnId.FirstName:
      return 220;
    case RosterUserColumnId.LastName:
      return 130;
    case RosterUserColumnId.Company:
      return 130;
    case RosterUserColumnId.Enabled:
      return 140;
    case RosterUserColumnId.NotificationByEmail:
      return 175;
    case RosterUserColumnId.IsEmailToPhoneSelected:
      return 130;
    case RosterUserColumnId.ContactAddresses:
      return 200;
    case RosterUserColumnId.MessageTemplates:
      return 200;
    default:
      return 130;
  }
};
