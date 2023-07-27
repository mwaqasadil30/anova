import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { QuickEditRtuNotesDTO } from 'api/admin/api';
import ContentGrids, { TableCellInfo } from '../ContentGrids';

type RtuNotesProps = {
  information?: QuickEditRtuNotesDTO;
};

const RtuNotes = ({ information }: RtuNotesProps) => {
  const { t } = useTranslation();
  const dataByOrder: TableCellInfo[] = useMemo(() => {
    const {
      installationDate,
      modelDescription,
      functionalLocation,
      simIccId,
      temporaryNotes,
      permanentNotes,
    } =
      {
        ...information,
        temporaryNotes:
          !information?.temporaryNotes ||
          information?.temporaryNotes.trim() === ''
            ? '-'
            : information?.temporaryNotes,
        permanentNotes:
          !information?.permanentNotes ||
          information?.permanentNotes.trim() === ''
            ? '-'
            : information?.permanentNotes,
      } || {};
    return [
      {
        label: t('ui.rtu.installationdate', 'Installation Date'),
        value: installationDate?.toDateString(),
      },
      {
        label: t('ui.rtu.modeldescription', 'Model Description'),
        value: modelDescription,
      },
      {
        label: t('ui.rtu.functionallocation', 'Functional Location'),
        value: functionalLocation,
      },
      { label: t('ui.rtu.simiccid', 'SIM ICCID'), value: simIccId },
      {
        label: t('ui.rtu.temporarynotes', 'Temporary Notes'),
        value: (
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {temporaryNotes.replaceAll('\r', '\n')}
          </span>
        ),
        width: 6,
      },
      {
        label: t('ui.rtu.permanentnotes', 'Permanent Notes'),
        value: (
          <span style={{ whiteSpace: 'pre-wrap' }}>
            {permanentNotes.replaceAll('\r', '\n')}
          </span>
        ),
        width: 6,
      },
    ];
  }, [information]);

  return <ContentGrids dataByOrder={dataByOrder} />;
};
export default RtuNotes;
