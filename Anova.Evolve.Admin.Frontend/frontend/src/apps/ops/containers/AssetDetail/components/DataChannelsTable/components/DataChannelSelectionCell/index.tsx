import { DataChannelDTO } from 'api/admin/api';
import {
  ChangeSelectedDataChannelFunction,
  CommonGraphDataChannelProps,
} from 'apps/ops/containers/AssetDetail/types';
import TableCellCheckbox from 'components/forms/styled-fields/TableCellCheckbox';
import React from 'react';
import { Cell } from 'react-table';

interface Props<T extends DataChannelDTO> extends Cell<T> {
  disableCheckbox?: boolean;
  isBeingGraphed?: boolean;
  canSelectDataChannel?: CommonGraphDataChannelProps['canSelectDataChannel'];
  handleChangeSelectedDataChannel?: ChangeSelectedDataChannelFunction;
}

function DataChannelSelectionCell<T extends DataChannelDTO>({
  disableCheckbox,
  row,
  isBeingGraphed,
  canSelectDataChannel,
  handleChangeSelectedDataChannel,
}: Props<T>) {
  if (!canSelectDataChannel?.(row.original)) {
    return null;
  }

  return (
    <>
      <TableCellCheckbox
        onChange={(event, checked) =>
          handleChangeSelectedDataChannel?.(row.original, checked)
        }
        checked={isBeingGraphed}
        disabled={disableCheckbox}
      />
    </>
  );
}

export default DataChannelSelectionCell;
