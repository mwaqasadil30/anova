export enum DomainListColumnId {
  Name = 'name',
  ParentDomainName = 'parentDomainName',
  ScreenTitle = 'screenTitle',
  DisableUserLogins = 'disableUserLogins',
  FtpFileFormat = 'ftpFileFormat',
  IsDomainDeleted = 'isDomainDeleted',
  IsFtpProcessingEnabled = 'isFtpProcessingEnabled',
  Action = 'action',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case DomainListColumnId.Name:
      return 'Name';
    case DomainListColumnId.ParentDomainName:
      return 'Parent domain name';
    case DomainListColumnId.ScreenTitle:
      return 'Screen title';
    case DomainListColumnId.DisableUserLogins:
      return 'Disable user logins';
    case DomainListColumnId.FtpFileFormat:
      return 'FTP file format';
    case DomainListColumnId.IsDomainDeleted:
      return 'Is domain deleted';
    case DomainListColumnId.IsFtpProcessingEnabled:
      return 'Is FTP processing enabled';
    case DomainListColumnId.Action:
      return 'Action';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case DomainListColumnId.Name:
      return 220;
    case DomainListColumnId.ParentDomainName:
      return 220;
    case DomainListColumnId.ScreenTitle:
      return 180;
    case DomainListColumnId.DisableUserLogins:
      return 110;
    case DomainListColumnId.FtpFileFormat:
      return 115;
    case DomainListColumnId.IsDomainDeleted:
      return 120;
    case DomainListColumnId.IsFtpProcessingEnabled:
      return 110;
    case DomainListColumnId.Action:
      return 220;
    default:
      return 130;
  }
};

// NOTE: Assumes that record cannot be disabled. Method required by GenericeDataTable component
export const isRecordDisabled = () => false;
