import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
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

const LinearCalibrationSummaryDetails = ({
  values,
  scaledUnitsText,
}: Props) => {
  const { t } = useTranslation();

  const underRangeText = t('ui.tankdimension.underRange', 'Under Range');
  const overRangeText = t('ui.tankdimension.overRange', 'Over Range');
  const underRangeDescription = values.rawUnits
    ? `${underRangeText} (${values.rawUnits})`
    : underRangeText;
  const overRangeDescription = values.rawUnits
    ? `${overRangeText} (${values.rawUnits})`
    : overRangeText;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <StyledCalibrationDetailsBox p={3}>
          <CalibrationDetailsHeader>
            {t('ui.datachannel.rawunitstext', 'Raw Units')}
          </CalibrationDetailsHeader>

          <CalibrationUnitAndValue
            description={t(
              'ui.tankdimension.unitsofmeasure',
              'Units of Measure'
            )}
            value={values.rawUnits}
          />
          <CalibrationUnitAndValue
            description={t('ui.common.min', 'Min')}
            value={values.rawUnitsAtScaledMin}
          />
          <CalibrationUnitAndValue
            description={t('ui.common.max', 'Max')}
            value={values.rawUnitsAtScaledMax}
          />
          <CalibrationUnitAndValue
            description={t('ui.datachannel.zeroScale', 'Zero Scale')}
            value={values.rawUnitsAtZero}
          />
          <CalibrationUnitAndValue
            description={t('ui.datachannel.fullScale', 'Full Scale')}
            value={values.rawUnitsAtFullScale}
          />
          <CalibrationUnitAndValue
            description={t('ui.datachannel.invertdata', 'Invert Data')}
            value={formatBooleanToYesOrNoString(values.isDataInverted, t)}
          />
        </StyledCalibrationDetailsBox>
      </Grid>
      <Grid item xs={12} md={4}>
        <StyledCalibrationDetailsBox p={3}>
          <CalibrationDetailsHeader>
            {t(
              'ui.datachannel.outOfRangeReadingRules',
              'Out of Range Reading Rules'
            )}
          </CalibrationDetailsHeader>
          <CalibrationUnitAndValue
            description={underRangeDescription}
            value={values.rawUnitsAtUnderRange}
          />
          <CalibrationUnitAndValue
            description={overRangeDescription}
            value={values.rawUnitsAtOverRange}
          />
        </StyledCalibrationDetailsBox>
      </Grid>
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

export default LinearCalibrationSummaryDetails;
