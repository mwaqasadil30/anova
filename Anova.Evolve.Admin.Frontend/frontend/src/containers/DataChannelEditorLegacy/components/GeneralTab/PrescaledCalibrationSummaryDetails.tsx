import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Values } from '../ObjectForm/types';
import CalibrationUnitAndValue from './CalibrationUnitAndValue';
import {
  CalibrationDetailsHeader,
  StyledCalibrationDetailsBox,
} from './styled';

interface Props {
  values: Values;
  scaledUnitsText?: string;
}

const PrescaledCalibrationSummaryDetails = ({
  values,
  scaledUnitsText,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <StyledCalibrationDetailsBox p={3}>
          <CalibrationDetailsHeader>
            {t('ui.datachannel.scaledunits', 'Scaled Units')}
          </CalibrationDetailsHeader>
          <CalibrationUnitAndValue
            description={t(
              'ui.tankdimension.unitsofmeasure',
              'Units Of Measure'
            )}
            value={scaledUnitsText}
          />
          <CalibrationUnitAndValue
            description={t('ui.common.min', 'Min')}
            value={values.scaledMin}
          />
          <CalibrationUnitAndValue
            description={t('ui.common.max', 'Max')}
            value={values.scaledMax}
          />
        </StyledCalibrationDetailsBox>
      </Grid>
    </Grid>
  );
};

export default PrescaledCalibrationSummaryDetails;
