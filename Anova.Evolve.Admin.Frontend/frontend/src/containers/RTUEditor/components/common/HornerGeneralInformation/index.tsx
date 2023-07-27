import Grid from '@material-ui/core/Grid';
import { HornerGeneralInformationDTO } from 'api/admin/api';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  buildHornerRtuCategoryTextMapping,
  buildHornerRtuModeTextMapping,
} from 'utils/i18n/enum-to-text';
import ContentGrids, { TableCellInfo } from '../ContentGrids';

type GeneralInformationProps = {
  information?: HornerGeneralInformationDTO;
};

const HornerGeneralInformation = ({ information }: GeneralInformationProps) => {
  const { t } = useTranslation();
  const {
    deviceId,
    description,
    hornerModelType,
    hornerRTUType,
    siteNumber,
    customerAddress1,
    customerAddress2,
    customerAddress3,
    city,
    state,
    country,
    rtuPollScheduleGroupAsText,
  } = information || {};

  const HornerRtuModeTextMapping = buildHornerRtuModeTextMapping(t);
  const HornerRtuCategoryTextMapping = buildHornerRtuCategoryTextMapping(t);
  const addressLine = [customerAddress1, customerAddress2, customerAddress3]
    .filter(Boolean)
    .join(', ');
  const cityLine = [city, state, country].filter(Boolean).join(', ');
  const dataByOrder: TableCellInfo[] = [
    { label: t('report.common.deviceid', 'Device Id'), value: deviceId },
    {
      label: t('ui.common.rtudescription', 'RTU Description'),
      value: description,
    },
    {
      label: t('ui.common.type', 'Type'),
      value:
        hornerRTUType || hornerRTUType === 0
          ? HornerRtuModeTextMapping[hornerRTUType]
          : '-',
    },
    {
      label: t('ui.hornerrtueditor.model', 'Model'),
      value:
        hornerModelType || hornerModelType === 0
          ? HornerRtuCategoryTextMapping[hornerModelType]
          : '-',
    },
    {
      label: t('ui.hornerrtueditor.sitenumber', 'Site Number'),
      value: siteNumber,
    },
    {
      label: t('ui.common.siteinformation', 'Site Information'),
      value:
        addressLine || cityLine ? (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {addressLine}
            </Grid>
            <Grid item xs={12}>
              {cityLine}
            </Grid>
          </Grid>
        ) : (
          '-'
        ),
    },
    {
      label: t('ui.rtu.pollschedule', 'Poll Schedule'),
      value: rtuPollScheduleGroupAsText,
    },
  ];

  return <ContentGrids dataByOrder={dataByOrder} />;
};
export default HornerGeneralInformation;
