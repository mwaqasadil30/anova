import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import {
  ChannelType,
  FieldTypeInfo,
  HornerRtuChannelTableInfo,
} from 'containers/RtuAiChannelsEditor/types';
import { FormikErrors } from 'formik';
import {
  HornerRtuAnalogInputChannelDTO,
  HornerRtuTransactionChannelDTO,
} from 'api/admin/api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Checkbox from '@material-ui/core/Checkbox';
import RtuAiChannelsTableRow from './components/RtuAiChannelsTableRow';

type RtuAiChannelsTableProps = {
  name: string;
  aiChannels: HornerRtuChannelTableInfo[];
  handleChange: (e: React.ChangeEvent<any>) => void;
  uomList: { label?: string | null; value?: string | null }[];
  fieldTypeList: FieldTypeInfo[];
  errors: FormikErrors<{
    channels:
      | HornerRtuAnalogInputChannelDTO[]
      | HornerRtuTransactionChannelDTO[];
  }>;
  onTableDataChanged: (data: HornerRtuChannelTableInfo[]) => void;
  channelType?: ChannelType;
  rowServerErrors?: Record<string, string>[];
};
const RtuAiChannelsTable = ({
  name,
  aiChannels,
  handleChange,
  uomList,
  fieldTypeList,
  errors,
  onTableDataChanged,
  channelType,
  rowServerErrors,
}: RtuAiChannelsTableProps) => {
  const { t } = useTranslation();

  const [tableAiChannels, setTableAiChannels] = useState(aiChannels);
  const [allRowsSelected, setAllRowsSelected] = useState(false);

  useEffect(() => {
    let counter = 0;
    if (aiChannels[0]?.id) setTableAiChannels(aiChannels);
    else
      setTableAiChannels(
        aiChannels.map((item) => {
          counter += 1;
          return { ...item, id: counter.toString() };
        })
      );
    setAllRowsSelected(aiChannels?.every((ch) => ch.isRowSelected === true));
  }, [aiChannels]);

  const Header = useMemo(
    () => (
      <TableHeadRow>
        <TableHeadCell />
        <TableHeadCell>
          <Checkbox
            checked={allRowsSelected}
            name="allRowsSelect"
            id="allRowsSelect"
            onChange={() => {
              const all = allRowsSelected;
              setAllRowsSelected(!all);
              const newSelectedState = tableAiChannels.map((item) => {
                return { ...item, isRowSelected: !all };
              });
              onTableDataChanged(newSelectedState);
            }}
          />
        </TableHeadCell>
        <TableHeadCell>
          {t('report.common.description', 'Description')}
        </TableHeadCell>
        <TableHeadCell>
          {t('ui.hornermessagetemplate.fieldtype', 'Field Type')}
        </TableHeadCell>
        <TableHeadCell>
          {t('ui.hornermessagetemplate.channelnumber', 'Channel')}
        </TableHeadCell>
        <TableHeadCell>
          {t('ui.hornermessagetemplate.rawmin', 'Raw Min')}
        </TableHeadCell>
        <TableHeadCell>
          {t('ui.hornermessagetemplate.rawmax', 'Raw Max')}
        </TableHeadCell>
        <TableHeadCell>
          {t('ui.hornermessagetemplate.scaledmin', 'Scaled Min')}
        </TableHeadCell>
        <TableHeadCell>
          {t('ui.hornermessagetemplate.scaledmax', 'Scaled Max')}
        </TableHeadCell>
        <TableHeadCell>
          {t('ui.hornermessagetemplate.uom', 'UOM')}
        </TableHeadCell>
        <TableHeadCell>
          <span style={{ whiteSpace: 'nowrap' }}>
            {t('ui.hornermessagetemplate.decimalplaces', 'Decimal Places')}
          </span>
        </TableHeadCell>
        <TableHeadCell>{t('ui.rtuhorner.display', 'Display')}</TableHeadCell>
      </TableHeadRow>
    ),
    [allRowsSelected]
  );

  // a little function to help us with reordering the result
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
  });

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      tableAiChannels,
      result.source.index,
      result.destination.index
    );
    setTableAiChannels(items);
    onTableDataChanged(items);
  };

  return (
    <TableContainer style={{ height: '100%' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="table">
          {(droppableProvided, droppableSnapshot) => (
            <div
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              style={{
                ...getListStyle(droppableSnapshot.isDraggingOver),
                height: '100%',
              }}
            >
              <Table stickyHeader>
                <TableHead>{Header}</TableHead>
                <TableBody>
                  {tableAiChannels?.map((item, index) => (
                    <Draggable
                      key={index}
                      draggableId={index.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          <RtuAiChannelsTableRow
                            rowData={item}
                            index={index}
                            name={name}
                            handleChange={handleChange}
                            uomList={uomList}
                            fieldTypeList={fieldTypeList}
                            errors={errors}
                            channelType={channelType}
                            serverErrors={rowServerErrors?.[index]}
                          />
                        </tr>
                      )}
                    </Draggable>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </TableContainer>
  );
};
export default RtuAiChannelsTable;
