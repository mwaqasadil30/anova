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

export interface Values extends DomainAndAssetGroupValues {}
