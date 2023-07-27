import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { DomainAssetGroupsDTO, DomainUserRolesDTO } from 'api/admin/api';
import EmptyContentBlock from 'components/EmptyContentBlock';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import MultiSelect from 'components/forms/form-fields/MultiSelect';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageSubHeader from 'components/PageSubHeader';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import { Field, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectIsCurrentDomainDataOnline } from 'redux-app/modules/app/selectors';
import styled, { css } from 'styled-components';
import { buildApplicationUserRoleTypeTextMapping } from 'utils/i18n/enum-to-text';
import { AssetGroupIdToNameMapping } from '../../types';
import { DomainAndAssetGroupValues, DomainsError } from '../types';

const PaddedHeadCell = styled(TableHeadCell)`
  padding: 12px 16px;
  line-height: 18px;
  min-height: 40px;
  ${(props) =>
    props.width !== undefined &&
    `
    min-width: ${props.width}px;
  `}
`;

const FormControlCheckboxText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const ParentDomainText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const ChildDomainText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  min-width: 1100px;
`;

const IndentedDomainText = styled.span`
  padding-left: ${({ level }: { level: number }) => 16 * level}px;
`;

const secondaryTextCss = css`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
`;

const SubChildDomainText = styled(Typography)`
  ${secondaryTextCss}
`;

const SecondaryText = styled(Typography)`
  ${secondaryTextCss}
`;

const CustomSizedTable = styled(Table)`
  min-width: 1100px;
`;

const FullWidthFormControlLabel = styled(FormControlLabel)`
  display: block;
  margin: 0;
`;

const DomainAssetGroupErrorText = styled(Typography)`
  color: #ed2d2d;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

interface Props {
  domainsWithAssetGroups?: DomainAssetGroupsDTO[];
  domainsWithUserRoles?: DomainUserRolesDTO[];
  defaultDomainId: DomainAndAssetGroupValues['defaultDomainId'];
  domainsValue: DomainAndAssetGroupValues['domains'];
  assetGroupIdToNameMapping?: AssetGroupIdToNameMapping;
  domainsError?: DomainsError;
  setFieldValue: FormikProps<DomainAndAssetGroupValues>['setFieldValue'];
}

const DomainAndAssetGroupAccessFields = ({
  domainsWithAssetGroups,
  domainsWithUserRoles,
  defaultDomainId,
  domainsValue,
  assetGroupIdToNameMapping,
  domainsError,
  setFieldValue,
}: Props) => {
  const { t } = useTranslation();

  const isCurrentDomainDataOnline = useSelector(
    selectIsCurrentDomainDataOnline
  );

  const applicationUserRoleTypeTextMapping = buildApplicationUserRoleTypeTextMapping(
    t
  );

  const [hideUnassignedDomains, setHideUnassignedDomains] = useState(false);
  const toggleHideUnassignedDomains = () =>
    setHideUnassignedDomains((prevState) => !prevState);

  const setDefaultDomain = (domainId?: string) => {
    if (!domainId) {
      return;
    }

    // Check/uncheck the default domain ID checkbox
    if (domainId === defaultDomainId) {
      setFieldValue('defaultDomainId', '');
    } else {
      setFieldValue('defaultDomainId', domainId);
    }
  };

  const domainsWithUserRoleAssigned = domainsValue.filter(
    (domain) => !!domain.applicationUserRoleId
  );
  const hasAtLeastOneDomainWithRole = domainsWithUserRoleAssigned.length > 0;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center" justify="space-between">
          <Grid item>
            <PageSubHeader dense>
              {t(
                'ui.userEditor.domainAndAssetGroupAccess',
                'Domain and Asset Group Access'
              )}
            </PageSubHeader>
            {domainsError && (
              <DomainAssetGroupErrorText>
                {t(
                  'ui.userEditor.domainAndAssetGroupAccessErrorMessage',
                  'User must be assigned a user role to a minimum of one domain'
                )}
              </DomainAssetGroupErrorText>
            )}
          </Grid>
          {hasAtLeastOneDomainWithRole && (
            <Grid item>
              <FormControlLabel
                value="start"
                control={
                  <Checkbox
                    checked={hideUnassignedDomains}
                    onChange={toggleHideUnassignedDomains}
                  />
                }
                label={
                  <FormControlCheckboxText>
                    {t(
                      'ui.userEditor.hideUnassignedDomains',
                      'Hide unassigned domains'
                    )}
                  </FormControlCheckboxText>
                }
              />
            </Grid>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        {domainsWithUserRoles?.length === 0 ? (
          <EmptyContentBlock
            message={t('ui.domainlist.empty', 'No Domains found')}
          />
        ) : (
          <TableContainer>
            <CustomSizedTable>
              <TableHead>
                <TableRow>
                  <PaddedHeadCell width={175}>
                    {t('ui.common.domain', 'Domain')}
                  </PaddedHeadCell>
                  <PaddedHeadCell width={250}>
                    {t('ui.main.userrole', 'User Role')}
                  </PaddedHeadCell>
                  <PaddedHeadCell width={100}>
                    {t('ui.userEditor.roleType', 'Role Type')}
                  </PaddedHeadCell>
                  {!isCurrentDomainDataOnline && (
                    <>
                      <PaddedHeadCell width={250}>
                        {t('ui.userEditor.assetGroups', 'Asset Groups')}
                      </PaddedHeadCell>
                      <PaddedHeadCell width={250}>
                        {t(
                          'ui.userEditor.defaultAssetGroup',
                          'Default Asset Group'
                        )}
                      </PaddedHeadCell>
                      <PaddedHeadCell width={60}>
                        {t('ui.userEditor.defaultDomain', 'Default Domain')}
                      </PaddedHeadCell>
                    </>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {domainsWithUserRoles?.map((domain, index) => {
                  const domainWithAssetGroups = domainsWithAssetGroups?.find(
                    (assetGroupsDomain) =>
                      assetGroupsDomain.domainId === domain.domainId
                  );
                  const domainFormValue = domainsValue.find(
                    (domainFromFormValue) =>
                      domainFromFormValue.domainId === domain.domainId
                  );

                  // Hide unassigned domains
                  if (
                    hasAtLeastOneDomainWithRole &&
                    hideUnassignedDomains &&
                    !domainFormValue?.applicationUserRoleId
                  ) {
                    return null;
                  }

                  const selectedUserRole = domain.domainRoles?.find(
                    (userRole) =>
                      userRole.applicationUserRoleId ===
                      domainFormValue?.applicationUserRoleId
                  );

                  const domainAssetGroupOptions =
                    domainWithAssetGroups?.domainAssetGroups || [];
                  const selectedAssetGroupIds =
                    domainFormValue?.assetGroupIds || [];

                  const fieldNamePrefix = `domains.${index}`;
                  const userRoleFieldName = `${fieldNamePrefix}.applicationUserRoleId`;
                  const assetGroupsFieldName = `${fieldNamePrefix}.assetGroupIds`;
                  const defaultAssetGroupIdFieldName = `${fieldNamePrefix}.defaultAssetGroupId`;

                  let DomainTextComponent = ParentDomainText;
                  if (domain.level === 1) {
                    DomainTextComponent = ChildDomainText;
                  } else if (domain.level && domain.level > 1) {
                    DomainTextComponent = SubChildDomainText;
                  }

                  return (
                    <TableRow key={domain.domainId}>
                      <TableCell style={{ width: 200, maxWidth: 200 }}>
                        <IndentedDomainText
                          as={DomainTextComponent}
                          level={domain.level}
                        >
                          {domain.indentedName}
                        </IndentedDomainText>
                      </TableCell>
                      <TableCell style={{ width: 250, maxWidth: 250 }}>
                        <Field
                          component={CustomTextField}
                          id={`${userRoleFieldName}-input`}
                          name={userRoleFieldName}
                          select
                          fullWidth
                          SelectProps={{ displayEmpty: true }}
                        >
                          <MenuItem value="">
                            <SelectItem />
                          </MenuItem>
                          {domain.domainRoles?.map((userRole) => (
                            <MenuItem
                              key={userRole.applicationUserRoleId}
                              value={userRole.applicationUserRoleId}
                            >
                              {userRole.name}
                            </MenuItem>
                          ))}
                        </Field>
                      </TableCell>
                      <TableCell style={{ width: 100, maxWidth: 100 }}>
                        <SecondaryText>
                          {selectedUserRole?.userRoleTypeEnumId !== undefined &&
                            applicationUserRoleTypeTextMapping[
                              selectedUserRole.userRoleTypeEnumId
                            ]}
                        </SecondaryText>
                      </TableCell>

                      {!isCurrentDomainDataOnline && (
                        <>
                          <TableCell style={{ width: 250, maxWidth: 250 }}>
                            <Field
                              id={`${assetGroupsFieldName}-input`}
                              name={assetGroupsFieldName}
                              component={MultiSelect}
                              select
                              fullWidth
                              options={domainAssetGroupOptions.map(
                                (assetGroup) => assetGroup.id
                              )}
                              renderValue={(option: string) => {
                                return (
                                  assetGroupIdToNameMapping?.[option] || ''
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell style={{ width: 250, maxWidth: 250 }}>
                            <Field
                              component={CustomTextField}
                              id={`${defaultAssetGroupIdFieldName}-input`}
                              name={defaultAssetGroupIdFieldName}
                              select
                              fullWidth
                              SelectProps={{
                                displayEmpty: true,
                              }}
                            >
                              <MenuItem value="">
                                <SelectItem />
                              </MenuItem>
                              {selectedAssetGroupIds.map((assetGroupId) => (
                                <MenuItem
                                  key={assetGroupId}
                                  value={assetGroupId}
                                >
                                  {assetGroupIdToNameMapping?.[assetGroupId]}
                                </MenuItem>
                              ))}
                            </Field>
                          </TableCell>
                          <TableCell
                            padding="none"
                            align="center"
                            style={{ width: 60, maxWidth: 60 }}
                          >
                            <FullWidthFormControlLabel
                              value="start"
                              control={
                                <Checkbox
                                  checked={defaultDomainId === domain.domainId}
                                  onChange={() =>
                                    setDefaultDomain(domain.domainId)
                                  }
                                />
                              }
                              label=""
                            />
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </CustomSizedTable>
          </TableContainer>
        )}
      </Grid>
    </Grid>
  );
};

export default DomainAndAssetGroupAccessFields;
