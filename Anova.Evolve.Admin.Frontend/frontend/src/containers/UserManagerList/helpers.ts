export enum UserListColumnId {
  UserName = 'userName',
  CompanyName = 'companyName',
  EmailAddress = 'emailAddress',
  FirstName = 'firstName',
  LastName = 'lastName',
  RoleName = 'roleName',
  UserTypeValue = 'userTypeValue',
  IsDeleted = 'isDeleted',
  LastLoginDate = 'lastLoginDate',
  AuthenticationProfileDescription = 'authenticationProfileDescription',
  TranscendLoggedInDate = 'transcendLoggedInDate',
}

export const columnIdToAriaLabel = (columnId: string) => {
  switch (columnId) {
    case UserListColumnId.UserName:
      return 'Username';
    case UserListColumnId.CompanyName:
      return 'Company name';
    case UserListColumnId.EmailAddress:
      return 'Email address';
    case UserListColumnId.FirstName:
      return 'First name';
    case UserListColumnId.LastName:
      return 'Last name';
    case UserListColumnId.RoleName:
      return 'Role name';
    case UserListColumnId.UserTypeValue:
      return 'Type';
    case UserListColumnId.IsDeleted:
      return 'Is deleted';
    case UserListColumnId.AuthenticationProfileDescription:
      return 'Authentication profile description';
    case UserListColumnId.LastLoginDate:
      return 'Last login date';
    case UserListColumnId.TranscendLoggedInDate:
      return 'Transcend logged in date';
    default:
      return '';
  }
};

export const getColumnWidth = (columnId: string) => {
  switch (columnId) {
    case UserListColumnId.EmailAddress:
      return 275;
    case UserListColumnId.UserName:
      return 235;
    case UserListColumnId.CompanyName:
    case UserListColumnId.LastLoginDate:
    case UserListColumnId.TranscendLoggedInDate:
    case UserListColumnId.AuthenticationProfileDescription:
      return 170;
    case UserListColumnId.RoleName:
      return 150;
    case UserListColumnId.IsDeleted:
      return 100;
    case UserListColumnId.FirstName:
    case UserListColumnId.LastName:
    case UserListColumnId.UserTypeValue:
    default:
      return 125;
  }
};

// NOTE: Assumes that record cannot be disabled. Method required by GenericeDataTable component
export const isRecordDisabled = () => false;
