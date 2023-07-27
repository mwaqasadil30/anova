import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column, useTable } from 'react-table';
import {
  HornerRtuAnalogInputChannelDTO,
  HornerRtuTransactionChannelDTO,
} from 'api/admin/api';
import GenericDataTable from 'components/GenericDataTable';
import IsDisplayedIcon from '../IsDisplayedIcon';
import {
  ChannelsTableColumnId,
  channelsTablecolumnIdToAriaLabel,
} from '../../helpers';

type HornerRtuChannelTableInfo = {
  fieldName?: string | null;
  fieldType?: string | null;
  channelNumber?: string | null;
  rawMinimumValue?: number | null;
  rawMaximumValue?: number | null;
  scaledMinimumValue?: number | null;
  scaledMaximumValue?: number | null;
  unitOfMeasure?: string | null;
  decimalPlaces?: number | null;
  isDisplayed?: any | null;
};
type HornerRtuChannelsTableProps = {
  hornerRtuChannels?:
    | HornerRtuTransactionChannelDTO[]
    | HornerRtuAnalogInputChannelDTO[]
    | null;
  rowsToDisplay: number;
  tableAriaLabel: string;
};
const HornerRtuChannelsTable = ({
  hornerRtuChannels,
  rowsToDisplay,
  tableAriaLabel,
}: HornerRtuChannelsTableProps) => {
  const { t } = useTranslation();
  const columns = useMemo<Column<HornerRtuChannelTableInfo>[]>(
    () => [
      {
        id: ChannelsTableColumnId.FieldName,
        Header: t('report.common.description', 'Description') as string,
        accessor: ChannelsTableColumnId.FieldName, // accessor is the "key" in the data
      },
      {
        id: ChannelsTableColumnId.FieldType,
        Header: t('ui.hornermessagetemplate.fieldtype', 'Field Type') as string,
        accessor: ChannelsTableColumnId.FieldType,
      },
      {
        id: ChannelsTableColumnId.ChannelNumber,
        Header: t(
          'ui.hornermessagetemplate.channelnumber',
          'Channel'
        ) as string,
        accessor: ChannelsTableColumnId.ChannelNumber,
      },
      {
        id: ChannelsTableColumnId.RawMinimumValue,
        Header: t('ui.hornermessagetemplate.rawmin', 'Raw Min') as string,
        accessor: ChannelsTableColumnId.RawMinimumValue,
      },
      {
        id: ChannelsTableColumnId.RawMaximumValue,
        Header: t('ui.hornermessagetemplate.rawmax', 'Raw Max') as string,
        accessor: ChannelsTableColumnId.RawMaximumValue,
      },
      {
        id: ChannelsTableColumnId.ScaledMinimumValue,
        Header: t('ui.hornermessagetemplate.scaledmin', 'Scaled Min') as string,
        accessor: ChannelsTableColumnId.ScaledMinimumValue,
      },
      {
        id: ChannelsTableColumnId.ScaledMaximumValue,
        Header: t('ui.hornermessagetemplate.scaledmax', 'Scaled Max') as string,
        accessor: ChannelsTableColumnId.ScaledMaximumValue,
      },
      {
        id: ChannelsTableColumnId.UnitOfMeasure,
        Header: t('ui.hornermessagetemplate.uom', 'UOM') as string,
        accessor: ChannelsTableColumnId.UnitOfMeasure,
      },
      {
        id: ChannelsTableColumnId.DecimalPlaces,
        Header: t(
          'ui.hornermessagetemplate.decimalplaces',
          'Decimal Places'
        ) as string,
        accessor: ChannelsTableColumnId.DecimalPlaces,
      },
      {
        id: ChannelsTableColumnId.IsDisplayed,
        Header: t('ui.rtuhorner.display', 'Display') as string,
        accessor: ChannelsTableColumnId.IsDisplayed,
        Cell: ({ value }) => <IsDisplayedIcon isDisplayed={value} />,
      },
    ],
    []
  );

  const data: HornerRtuChannelTableInfo[] = React.useMemo<
    HornerRtuChannelTableInfo[]
  >(() => {
    const result = hornerRtuChannels?.slice(0, rowsToDisplay) || [];
    return result;
  }, [hornerRtuChannels, rowsToDisplay]);

  const tableInstance = useTable<HornerRtuChannelTableInfo>({
    columns,
    data,
  });
  return (
    <GenericDataTable<HornerRtuChannelTableInfo>
      tableInstance={tableInstance}
      disableActions={false}
      tableAriaLabelText={tableAriaLabel}
      isRecordDisabled={() => false}
      columnIdToAriaLabel={channelsTablecolumnIdToAriaLabel}
      getColumnWidth={() => 100}
      handleRowClick={() => {}}
      minWidth={1300}
    />
  );
};
export default HornerRtuChannelsTable;
