import IconButton from '@material-ui/core/IconButton';
import MuiLink from '@material-ui/core/Link';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import { ProblemReportAffectedDataChannelDto } from 'api/admin/api';
import routes from 'apps/ops/routes';
import { ReactComponent as DeleteTrashIcon } from 'assets/icons/trash-simple.svg';
import DeletionWarningDialog from 'components/DeletionWarningDialog';
import EmptyContent from 'components/EmptyContent';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import { Field, FieldArray } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, Link } from 'react-router-dom';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import AddAffectedDataChannelDialog from '../AddDataChannelDialog';

const StyledTableContainer = styled(TableContainer)`
  max-height: 300px;
`;

const CustomSizedTable = styled(Table)`
  min-width: 2000px;
`;

const PaddedHeadCell = styled(TableHeadCell)`
  padding: 12px 16px;
  width: ${({ width }: { width: number }) => `${width}px`};
`;

const PaddedCell = styled(TableCell)`
  padding: 0px 16px;
`;

const StyledCheckboxTableCell = styled(TableCell)`
  & .styled-form-control-label {
    /* Remove right margin on checkboxes */
    margin-right: 0;
  }
  padding: 0px 4px 0px 16px;
`;

const CellDarkText = styled(Typography)`
  font-weight: 500;
  font-size: 15px;
  color: ${(props) => props.theme.palette.text.primary};
`;

const CustomTrashIcon = styled(DeleteTrashIcon)`
  height: 17px;
  width: 17px;
  color: ${(props) => props.theme.palette.text.primary};
`;

const DeleteNotePreviewText = styled(Typography)`
  font-size: 14px;
  font-style: italic;
`;

interface Props {
  affectedDataChannels?: ProblemReportAffectedDataChannelDto[] | null;
  isAddAffectedDataChannelsDialogOpen: boolean;
  handleCloseAddAffectedDataChannelsDialog: () => void;
}

const AffectedDataChannelsTable = ({
  affectedDataChannels,
  isAddAffectedDataChannelsDialogOpen,
  handleCloseAddAffectedDataChannelsDialog,
}: Props) => {
  const { t } = useTranslation();

  const [
    selectedAffectedDataChannelToDelete,
    setSelectedAffectedDataChannelToDelete,
  ] = useState<ProblemReportAffectedDataChannelDto | null>();
  const [
    selectedIndexForAffectedDataChannelToDelete,
    setSelectedIndexForAffectedDataChannelToDelete,
  ] = useState<number | null>();

  // Delete Affected Data Channels Dialog and API
  const [
    isDeleteAffectedDataChannelDialogOpen,
    setIsDeleteAffectedDataChannelDialogOpen,
  ] = React.useState(false);

  const handleOpenDeleteAffectedDataChannelDialog = (
    affectedDataChannel: ProblemReportAffectedDataChannelDto,
    index: number
  ) => {
    setIsDeleteAffectedDataChannelDialogOpen(true);
    setSelectedAffectedDataChannelToDelete(affectedDataChannel);
    setSelectedIndexForAffectedDataChannelToDelete(index);
  };

  const handleCloseDeleteAffectedDataChannelDialog = () => {
    setIsDeleteAffectedDataChannelDialogOpen(false);
    setSelectedAffectedDataChannelToDelete(null);
    setSelectedIndexForAffectedDataChannelToDelete(null);
  };

  return (
    <FieldArray
      name="affectedDataChannels"
      render={(arrayHelpers) => {
        return (
          <>
            <DeletionWarningDialog
              open={isDeleteAffectedDataChannelDialogOpen}
              handleCancel={handleCloseDeleteAffectedDataChannelDialog}
              handleConfirm={() => {
                if (isNumber(selectedIndexForAffectedDataChannelToDelete)) {
                  arrayHelpers.remove(
                    selectedIndexForAffectedDataChannelToDelete!
                  );
                  handleCloseDeleteAffectedDataChannelDialog();
                }
              }}
              errorMessage={t('ui.common.failedToDelete', 'Failed to delete')}
              recordCount={1}
            >
              <DeleteNotePreviewText>
                {selectedAffectedDataChannelToDelete?.description}
              </DeleteNotePreviewText>
            </DeletionWarningDialog>

            <AddAffectedDataChannelDialog
              open={isAddAffectedDataChannelsDialogOpen}
              handleClose={handleCloseAddAffectedDataChannelsDialog}
              arrayHelpers={arrayHelpers}
            />

            <StyledTableContainer>
              <CustomSizedTable stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableHeadCell style={{ width: 10 }} />
                    <PaddedHeadCell width={45}>
                      {t('ui.problemreport.primary', 'Primary')}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={45}>
                      {t('ui.problemreport.faulty', 'Faulty')}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={70}>
                      {t(
                        'enum.problemreportdatachannelfilterby.siteNumber',
                        'Site #'
                      )}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={300}>
                      {t('ui.common.asset', 'Asset')}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={150}>
                      {t('ui.common.description', 'Description')}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={100}>
                      {t('ui.common.rtu', 'RTU')}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={100}>
                      {t('ui.common.channel', 'Channel')}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={100}>
                      {t('ui.common.scaledmax', 'Scaled Max')}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={150}>
                      {t(
                        'ui.problemreport.devicenetworkaddress',
                        'Device Network Address'
                      )}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={130}>
                      {t('ui.problemreport.businessunit', 'Business Unit')}
                    </PaddedHeadCell>
                    <PaddedHeadCell width={100}>
                      {t('ui.problemreport.region', 'Region')}
                    </PaddedHeadCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {!affectedDataChannels?.length ? (
                    <TableCell colSpan={12}>
                      <EmptyContent>
                        {t(
                          'ui.problemReportsEditor.noAffectedDataChannels',
                          'No affected data channels'
                        )}
                      </EmptyContent>
                    </TableCell>
                  ) : (
                    affectedDataChannels?.map((affectedDataChannel, index) => {
                      return (
                        <TableRow style={{ height: 42 }}>
                          <TableCell style={{ padding: 0 }} align="center">
                            {!affectedDataChannel.isPrimary && (
                              <IconButton
                                onClick={() => {
                                  handleOpenDeleteAffectedDataChannelDialog(
                                    affectedDataChannel,
                                    index
                                  );
                                }}
                              >
                                <CustomTrashIcon />
                              </IconButton>
                            )}
                          </TableCell>
                          <StyledCheckboxTableCell align="center">
                            <Field
                              id={`affectedDataChannels[${index}].isPrimary-input`}
                              name={`affectedDataChannels[${index}].isPrimary`}
                              component={CheckboxWithLabel}
                              type="checkbox"
                              // The current data channel is the primary data channel, and
                              // therefore cannot be toggled/switched or deleted.
                              disabled
                            />
                          </StyledCheckboxTableCell>
                          <StyledCheckboxTableCell align="center">
                            <Field
                              id={`affectedDataChannels[${index}].isFaulty-input`}
                              name={`affectedDataChannels[${index}].isFaulty`}
                              component={CheckboxWithLabel}
                              type="checkbox"
                            />
                          </StyledCheckboxTableCell>
                          <PaddedCell>
                            {affectedDataChannel.shipToNumber}
                          </PaddedCell>
                          <PaddedCell>
                            {affectedDataChannel.assetId ? (
                              <CellDarkText>
                                <MuiLink
                                  component={Link}
                                  to={generatePath(routes.assetSummary.detail, {
                                    assetId: affectedDataChannel.assetId!,
                                  })}
                                  color="inherit"
                                  underline="always"
                                >
                                  {affectedDataChannel.assetTitle}
                                </MuiLink>
                              </CellDarkText>
                            ) : (
                              <CellDarkText>-</CellDarkText>
                            )}
                          </PaddedCell>
                          <PaddedCell>
                            {affectedDataChannel.description}
                          </PaddedCell>
                          <PaddedCell>
                            {/* NOTE/TODO: will need a linkTo/styling once RTU editor is implemented */}
                            <CellDarkText>
                              {affectedDataChannel.deviceId}
                            </CellDarkText>
                          </PaddedCell>
                          <PaddedCell>
                            {affectedDataChannel.channelNumber}
                          </PaddedCell>
                          <PaddedCell>
                            {affectedDataChannel.scaledMax}
                          </PaddedCell>
                          <PaddedCell>
                            {affectedDataChannel.deviceNetworkAddress}
                          </PaddedCell>
                          <PaddedCell>
                            {affectedDataChannel.businessUnit}
                          </PaddedCell>
                          <PaddedCell>{affectedDataChannel.region}</PaddedCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </CustomSizedTable>
            </StyledTableContainer>
          </>
        );
      }}
    />
  );
};

export default AffectedDataChannelsTable;
