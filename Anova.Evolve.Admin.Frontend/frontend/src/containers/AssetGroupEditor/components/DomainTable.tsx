import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooterCell from 'components/tables/components/TableFooterCell';
import TableFooter from 'components/tables/components/TableFooter';
import { FieldArray, FormikProps } from 'formik';
import uniqBy from 'lodash/uniqBy';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Table from '../../../components/tables/components/Table';
import TableBody from '../../../components/tables/components/TableBody';
import TableContainer from '../../../components/tables/components/TableContainer';
import TableHead from '../../../components/tables/components/TableHead';
import {
  ButtonBesideSelect,
  CellTextValue,
  DomainNameCell,
  Option,
  PaddedHeadCell,
  RemoveIconHeadCell,
  ResponsePayload,
  StyledRemoveIcon,
  StyledWorldIcon,
} from '../constants';
import EmptyContent from './EmptyContent';
import { Select } from './FormSelect';

const CustomSizedTable = styled(Table)`
  min-width: 600px;
`;

interface Props {
  formik: FormikProps<ResponsePayload>;
}

export default function DomainTable({ formik }: Props) {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<string>('');
  const formPublishedDomains =
    formik.values.retrieveAssetGroupEditComponentsByIdResult?.editObject
      ?.publishedDomains;

  const initialPublishedDomains =
    formik.initialValues.retrieveAssetGroupEditComponentsByIdResult?.editObject
      ?.publishedDomains || [];
  const initialUnassignedDomains =
    formik.initialValues.retrieveAssetGroupEditComponentsByIdResult
      ?.unassignedDomains || [];
  const allDomains = initialPublishedDomains.concat(initialUnassignedDomains);
  const uniqueDomains = uniqBy(allDomains, 'domainId');

  return (
    <TableContainer>
      <CustomSizedTable>
        <TableHead style={{ height: 40 }}>
          <TableRow>
            <PaddedHeadCell>{t('ui.common.domain', 'Domain')}</PaddedHeadCell>
            <RemoveIconHeadCell />
          </TableRow>
        </TableHead>
        <FieldArray
          name="retrieveAssetGroupEditComponentsByIdResult.editObject.publishedDomains"
          render={(arrayHelpers) => {
            const remainingUnassignedDomains = uniqueDomains.filter(
              (domain) =>
                !formPublishedDomains?.find(
                  (publishedDomain) =>
                    publishedDomain.domainId === domain.domainId
                )
            );
            return (
              <>
                <TableBody>
                  {!formPublishedDomains?.length ? (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <EmptyContent>
                          {t(
                            'ui.assetgroup.notpublished',
                            'This asset group has not been published'
                          )}
                        </EmptyContent>
                      </TableCell>
                    </TableRow>
                  ) : (
                    formPublishedDomains.map((domain, index) => (
                      <TableRow key={domain.domainId}>
                        <DomainNameCell key={domain.domainId}>
                          <Grid container spacing={1} alignItems="center">
                            <Grid item>
                              <StyledWorldIcon />
                            </Grid>
                            <Grid item>
                              <CellTextValue>{domain.domainName}</CellTextValue>
                            </Grid>
                          </Grid>
                        </DomainNameCell>
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
                    <TableFooterCell variant="footer" colSpan={2}>
                      <Grid container spacing={2}>
                        <Grid item xs={5}>
                          <Select
                            options={[
                              {
                                fieldName: '',
                                displayName: t(
                                  'ui.common.selectDomain',
                                  'Select Domain'
                                ),
                              },
                              ...(remainingUnassignedDomains.map(
                                (domain): Option => ({
                                  fieldName: domain.domainId || '',
                                  displayName: domain.domainName || '',
                                })
                              ) || []),
                            ]}
                            name="random"
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

                              const selectedDomain = uniqueDomains?.find(
                                (domain) => domain.domainId === selection
                              );
                              if (selectedDomain) {
                                arrayHelpers.push(selectedDomain);
                              }
                            }}
                            disabled={!selection}
                          >
                            {t('ui.common.publish', 'Publish')}
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
