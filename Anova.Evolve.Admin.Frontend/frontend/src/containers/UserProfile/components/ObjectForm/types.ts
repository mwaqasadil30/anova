import { UserDto } from 'api/admin/api';

export type UserProfileEditDTO = UserDto;

export interface UserProfileSaveDTO {
  // firstName: string;
  // lastName: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  emailAddress: string;
}

export interface Values {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: string | null;
  isPasswordChangeRequired?: boolean;
}
