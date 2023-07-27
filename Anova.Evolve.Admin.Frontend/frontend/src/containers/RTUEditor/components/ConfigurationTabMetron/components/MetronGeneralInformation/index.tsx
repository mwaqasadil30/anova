import Grid from '@material-ui/core/Grid';
import { MetronGeneralInformationDTO } from 'api/admin/api';
import ContentGrids, {
  TableCellInfo,
} from 'containers/RTUEditor/components/common/ContentGrids';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isNumber } from 'utils/format/numbers';
import {
  buildRtuDevicePollFilterTextMapping,
  buildRtuDeviceTypeTextMapping,
} from 'utils/i18n/enum-to-text';

type MetronGeneralInformationProps = {
  information?: MetronGeneralInformationDTO;
};

const MetronGeneralInformation = ({
  information,
}: MetronGeneralInformationProps) => {
  const { t } = useTranslation();
  const {
    deviceId,
    description,
    pollFilterId,
    postalCode,
    rtuType,
    siteNumber,
    customerName,
    customerAddress1,
    customerAddress2,
    customerAddress3,
    city,
    state,
    rtuPollScheduleGroupAsText,
  } = information || {};

  const rtuDeviceTypeTextMapping = buildRtuDeviceTypeTextMapping(t);
  const rtuDevicePollFilterTextMapping = buildRtuDevicePollFilterTextMapping(t);

  const addressLine = [
    customerName,
    customerAddress1,
    customerAddress2,
    customerAddress3,
  ]
    .filter(Boolean)
    .join(', ');
  const cityLine = [city, postalCode, state].filter(Boolean).join(', ');
  const dataByOrder: TableCellInfo[] = [
    { label: t('report.common.deviceid', 'Device Id'), value: deviceId },
    { label: t('ui.common.description', 'Description'), value: description },
    {
      label: t('ui.rtu.hardware', 'Hardware'),
      value:
        isNumber(rtuType) && rtuType ? rtuDeviceTypeTextMapping[rtuType] : '-',
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
    {
      label: t('ui.rtu.pollfilter', 'Poll Filter'),
      value: pollFilterId ? rtuDevicePollFilterTextMapping[pollFilterId] : '-',
    },
  ];

  return <ContentGrids dataByOrder={dataByOrder} />;
};
export default MetronGeneralInformation;
