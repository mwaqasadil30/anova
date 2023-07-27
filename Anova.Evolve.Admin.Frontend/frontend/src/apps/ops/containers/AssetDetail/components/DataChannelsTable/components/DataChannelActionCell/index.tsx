import { DataChannelDTO } from 'api/admin/api';
import { ReadingsHookData } from 'apps/ops/containers/AssetDetail/types';
import ActionsButton from 'components/buttons/ActionsButton';
import React from 'react';
import { Cell } from 'react-table';
import DataChannelsActionsMenu from '../../../DataChannelsActionsMenu';
import {
  DataChannelColumnId,
  getColumnWidth,
  tableRowHeight,
} from '../../helpers';

interface Props extends Cell<DataChannelDTO> {
  isPublishedAsset?: boolean;
  openUpdateDisplayPriorityDialog: () => void;
  dataChannels?: DataChannelDTO[];
  readingsData: ReadingsHookData;
  selectedDataChannels?: DataChannelDTO[];
  setDataChannelsResult?: (dataChannels: DataChannelDTO[]) => void;
  fetchRecords: () => void;
}

function DataChannelActionCell({
  row,
  isPublishedAsset,
  dataChannels,
  readingsData,
  selectedDataChannels,
  setDataChannelsResult,
  openUpdateDisplayPriorityDialog,
  fetchRecords,
}: Props) {
  return (
    <>
      <DataChannelsActionsMenu
        record={row.original}
        isPublishedAsset={isPublishedAsset}
        dataChannels={dataChannels}
        readingsData={readingsData}
        selectedDataChannels={selectedDataChannels}
        setDataChannelsResult={setDataChannelsResult}
        openUpdateDisplayPriorityDialog={openUpdateDisplayPriorityDialog}
        fetchRecords={fetchRecords}
      >
        <ActionsButton
          style={{
            width: getColumnWidth(DataChannelColumnId.Action),
            height: tableRowHeight - 1,
          }}
        />
      </DataChannelsActionsMenu>
    </>
  );
}

export default DataChannelActionCell;
