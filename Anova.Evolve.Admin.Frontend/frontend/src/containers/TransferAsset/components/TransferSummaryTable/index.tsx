import React from 'react';
import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import {
  TransferAssetResult,
  TransferAssetInfo,
  TransferAssetResultStatusType,
} from 'api/admin/api';
import { useTranslation } from 'react-i18next';
import { buildTransferAssetResultTextMapping } from 'utils/i18n/enum-to-text';
import Alert from '@material-ui/lab/Alert';

type AssetToTransferData = {
  [key: string]: TransferAssetResult | undefined;
};

interface Props {
  assetsToTransfer: TransferAssetInfo[] | null | undefined;
  transferredAssets: TransferAssetResult[] | null | undefined;
}

const TransferSummaryTable = ({
  assetsToTransfer,
  transferredAssets,
}: Props) => {
  const { t } = useTranslation();

  const assetColumns = [
    t('ui.common.assettitle', 'Asset Title'),
    t('ui.common.datachannels', 'Data Channels'),
    t('ui.common.rtu_plural', 'RTUs'),
    t('ui.common.product', 'Product'),
    t('ui.common.site', 'Site'),
    t('ui.assetTransfer.result', 'Result'),
    t('ui.assetTransfer.firstError', 'First Error'),
  ];
  const transferResultTextMapping = buildTransferAssetResultTextMapping(t);

  const assetsWithTransferData = assetsToTransfer?.reduce((prev, current) => {
    prev[current.assetId!] = transferredAssets?.find(
      (transferredAsset) => transferredAsset.assetId === current.assetId
    );
    return prev;
  }, {} as AssetToTransferData);

  const successfullyTransferredAssets = transferredAssets?.filter(
    (asset) => asset.status === TransferAssetResultStatusType.Transferred
  );
  const wasTransferredSuccessfully =
    successfullyTransferredAssets?.length === assetsToTransfer?.length &&
    assetsToTransfer?.length;

  return (
    <>
      <Box mb={2}>
        {wasTransferredSuccessfully ? (
          <Alert severity="success">
            {t(
              'ui.assetTransfer.assetsTransferredSuccessfully',
              'Asset(s) Transferred Successfully.'
            )}
          </Alert>
        ) : (
          <Alert severity="info">
            {t('ui.assetTransfer.assetsTransferred', 'Asset(s) Transferred.')}
          </Alert>
        )}
      </Box>

      <TableContainer>
        <Table aria-label="transferred assets table" style={{ minWidth: 1300 }}>
          <TableHead>
            <TableHeadRow>
              {assetColumns.map((columnText) => (
                <TableHeadCell key={columnText}>{columnText}</TableHeadCell>
              ))}
            </TableHeadRow>
          </TableHead>
          <TableBody>
            {assetsToTransfer?.map((asset) => {
              const transferStatus =
                assetsWithTransferData?.[asset.assetId!]?.status;
              // TODO: This back-end error message may need to be localized on
              // the front-end via some sort of text mapping
              const errorMessage =
                assetsWithTransferData?.[asset.assetId!]?.errorMessage;

              return (
                <TableBodyRow key={asset.assetId}>
                  <TableCell>{asset.assetTitle}</TableCell>
                  <TableCell>{asset.dataChannels?.length}</TableCell>
                  <TableCell>
                    {Array.from(
                      new Set(
                        asset.dataChannels?.map((channel) => channel.deviceId)
                      )
                    )
                      .filter(Boolean)
                      .join(', ')}
                  </TableCell>
                  <TableCell>
                    {Array.from(
                      new Set(
                        asset.dataChannels?.map(
                          (channel) => channel.productName
                        )
                      )
                    )
                      .filter(Boolean)
                      .join(', ')}
                  </TableCell>
                  <TableCell>{asset.siteAddress}</TableCell>
                  <TableCell>
                    {transferResultTextMapping[transferStatus!]}
                  </TableCell>
                  <TableCell>{errorMessage}</TableCell>
                </TableBodyRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TransferSummaryTable;
