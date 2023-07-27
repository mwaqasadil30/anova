import { HornerRtuTimeCorrectionDTO } from 'api/admin/api';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { buildRTUAutoTimingCorrectionSourceEnumTextMapping } from 'utils/i18n/enum-to-text';
import ContentGrids, { TableCellInfo } from '../../../common/ContentGrids';

type HornerRtuTimeCorrectionProps = {
  information?: HornerRtuTimeCorrectionDTO;
};

const HornerRtuTimeCorrection = ({
  information,
}: HornerRtuTimeCorrectionProps) => {
  const { t } = useTranslation();

  const timeCorrectionEnumMapping = buildRTUAutoTimingCorrectionSourceEnumTextMapping(
    t
  );

  const dataByOrder: TableCellInfo[] = useMemo(() => {
    const { timeCorrectionMode } = information || {};
    return [
      {
        label: t('ui.rtu.timecorrectionmode', 'Time Correction Mode'),
        value:
          timeCorrectionMode || timeCorrectionMode === 0
            ? timeCorrectionEnumMapping[timeCorrectionMode]
            : '-',
      },
    ];
  }, [information]);

  return <ContentGrids dataByOrder={dataByOrder} />;
};

export default HornerRtuTimeCorrection;
