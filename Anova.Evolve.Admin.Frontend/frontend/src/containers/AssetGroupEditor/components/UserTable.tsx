import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import TableFooterCell from 'components/tables/components/TableFooterCell';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableFooter from 'components/tables/components/TableFooter';
import TableHead from 'components/tables/components/TableHead';
import { Field, FieldArray, FormikProps } from 'formik';
import uniqBy from 'lodash/uniqBy';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import {
  ButtonBesideSelect,
  CellTextValue,
  CustomSizedTable,
  Option,
  PaddedCell,
  PaddedHeadCell,
  RemoveIconHeadCell,
  ResponsePayload,
  StyledRemoveIcon,
} from '../constants';
import EmptyContent from './EmptyContent';
import { Select } from './FormSelect';

interface Props {
  formik: FormikProps<ResponsePayload>;
}

export default function UserTable({ formik }: Props) {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<string>('');
  const formAssignedUsers =
    formik.values.retrieveAssetGroupEditComponentsByIdResult?.editObject
      ?.assignedUsers;

  const initialAssignedUsers =
    formik.initialValues.retrieveAssetGroupEditComponentsByIdResult?.editObject
      ?.assignedUsers || [];
  const initialUnassignedUsers =
    formik.initialValues.retrieveAssetGroupEditComponentsByIdResult
      ?.unassignedUsers || [];
  const allUsers = initialAssignedUsers.concat(initialUnassignedUsers);
  const uniqueUsers = uniqBy(allUsers, 'userId');

  return (
    <TableContainer>
      <CustomSizedTable>
        <TableHead>
          <TableRow>
            <PaddedHeadCell width={300}>
              {t('ui.common.user', 'User')}
            </PaddedHeadCell>
            <PaddedHeadCell width={120}>
              {t('ui.assetgroup.defaultsecurity', 'Default Security')}
            </PaddedHeadCell>
            <PaddedHeadCell width={146}>
              {t('report.userlist.rolename', 'Role Name')}
            </PaddedHeadCell>
            <PaddedHeadCell width={150}>
              {t('report.userlist.firstname', 'First Name')}
            </PaddedHeadCell>
            <PaddedHeadCell width={180}>
              {t('report.userlist.lastname', 'Last Name')}
            </PaddedHeadCell>
            <PaddedHeadCell width={50}>
              {t('ui.common.default', 'Default')}
            </PaddedHeadCell>
            <RemoveIconHeadCell />
          </TableRow>
        </TableHead>
        <FieldArray
          name="retrieveAssetGroupEditComponentsByIdResult.editObject.assignedUsers"
          render={(arrayHelpers) => {
            const remainingUnassignedUsers = uniqueUsers?.filter(
              (user) =>
                !formAssignedUsers?.find(
                  (assignedUser) => assignedUser.userId === user.userId
                )
            );
            return (
              <>
                <TableBody>
                  {!formAssignedUsers?.length ? (
                    <TableCell colSpan={7} style={{ borderBottom: 0 }}>
                      <EmptyContent>
                        {t(
                          'ui.assetgroup.nousersadded',
                          'No users have been added to this asset group'
                        )}
                      </EmptyContent>
                    </TableCell>
                  ) : (
                    formAssignedUsers?.map((user, index) => (
                      <TableRow key={user.username || index}>
                        <PaddedCell>
                          <CellTextValue>{user.username}</CellTextValue>
                        </PaddedCell>
                        <PaddedCell>
                          <CellTextValue>
                            {user.isModifiedFromDefaultPermissions !==
                              undefined &&
                              formatBooleanToYesOrNoString(
                                user.isModifiedFromDefaultPermissions,
                                t
                              )}
                          </CellTextValue>
                        </PaddedCell>
                        <PaddedCell>
                          <CellTextValue>{user.roleName}</CellTextValue>
                        </PaddedCell>
                        <PaddedCell>
                          <CellTextValue>{user.firstName}</CellTextValue>
                        </PaddedCell>
                        <PaddedCell>
                          <CellTextValue>{user.lastName}</CellTextValue>
                        </PaddedCell>
                        <TableCell padding="none">
                          <CellTextValue>
                            <Box textAlign="center">
                              <Field
                                component={CheckboxWithLabel}
                                name={`retrieveAssetGroupEditComponentsByIdResult.editObject.assignedUsers[${index}].isDefault`}
                                type="checkbox"
                                Label={{ style: { margin: 0 } }}
                              />
                            </Box>
                          </CellTextValue>
                        </TableCell>
                        <TableCell padding="none">
                          <Box textAlign="center" p={1}>
                            <IconButton
                              size="small"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              <StyledRemoveIcon />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableFooterCell variant="footer" colSpan={7}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <Select
                            name="random"
                            options={[
                              {
                                fieldName: '',
                                displayName: t(
                                  'ui.assetGroup.selectUserPlaceholder',
                                  'Select User'
                                ),
                              },
                              ...(remainingUnassignedUsers?.map(
                                (user): Option => ({
                                  fieldName: user.username || '',
                                  displayName: user.username || '',
                                })
                              ) || []),
                            ]}
                            value={selection}
                            onChange={(event) => {
                              setSelection(event.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item xs={7}>
                          <ButtonBesideSelect
                            variant="outlined"
                            onClick={() => {
                              setSelection('');

                              const selectedUser = uniqueUsers?.find(
                                (user) => user.username === selection
                              );
                              if (selectedUser) {
                                arrayHelpers.push(selectedUser);
                              }
                            }}
                            disabled={!selection}
                          >
                            {t('ui.common.add', 'Add')}
                          </ButtonBesideSelect>
                        </Grid>
                      </Grid>
                    </TableFooterCell>
                  </TableRow>
                </TableFooter>
              </>
            );
          }}
        />
      </CustomSizedTable>
    </TableContainer>
  );
}
