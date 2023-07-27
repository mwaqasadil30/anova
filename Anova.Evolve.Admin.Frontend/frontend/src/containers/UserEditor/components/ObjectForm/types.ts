import { DomainAndAssetGroupValues } from 'containers/UserEditorBase/components/types';
import { FormikErrors } from 'formik';

export type DomainsError =
  | string
  | string[]
  | FormikErrors<DomainWithRoleAndAssetGroup>[]
  | undefined;

export interface DomainWithRoleAndAssetGroup {
  domainId: string;
  applicationUserRoleId?: number | '';
  // Typing the list of assetGroups as undefined since Formik has a bug where
  // calling setFieldValue with an empty list removes it from the list of form
  // values. Also, we use a list of strings representing asset group IDs since
  // the Material UI select requires referential equality on each option's
  // value (https://material-ui.com/api/select/).
  // With Formik, referential equality may not be possible since the selected
  // options comes internally from Formik, and the total list of options is
  // outside of Formik.
  assetGroupIds?: string[];
  defaultAssetGroupId?: string;
}

export interface Values extends DomainAndAssetGroupValues {
  userName: string;
  newPassword: string;
  confirmNewPassword?: string | null; // API doesn't include this
  firstName: string;
  lastName: string;
  emailAddress?: string | null;
  companyName: string;
  emailToSmsaddress?: string | null; // Previously emailToPhone
  smsNumber?: string | null; // API uses smsnumber
  homePhoneNumber?: string | null;
  workPhoneNumber?: string | null;
  mobilePhoneNumber?: string | null;
  faxNumber?: string | null;
  isWebLogin?: boolean | null;
  isPasswordChangeRequired?: boolean;
  lastUpdatedDate?: Date | null;
  lastUpdateUserId?: string | null;
  // Our TimePicker component uses a Date, not a number, so we differentiate
  // the applicationTimeoutInSeconds property name
  // applicationTimeoutInSeconds?: number | null;
  applicationTimeout?: Date | null;
  userTypeId: number | '';
  lastLoginDate?: Date | null;
  isPrimary?: boolean;
  isFederatedAuthentication?: boolean;
  showPreviewPage?: boolean;
  migratedToNewUi?: boolean;
}
