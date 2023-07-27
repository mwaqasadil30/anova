/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import {
  DataChannelReportDTO,
  UnitConversionModeEnum,
  UnitTypeEnum,
} from 'api/admin/api';
import EditorBox from 'components/EditorBox';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import PageSubHeader from 'components/PageSubHeader';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { buildUnitTypeEnumTextMapping } from 'utils/i18n/enum-to-text';
import { labelWithOptionalText } from '../../../helpers';
import { StyledFieldLabelText } from '../../../styles';
import { Values } from '../types';

interface Props {
  dataChannelDetails?: DataChannelReportDTO | null;
  values: Values;
}
const DeliverySettingsContainer = ({ dataChannelDetails, values }: Props) => {
  const { t } = useTranslation();

  const scaledUnits = dataChannelDetails?.sensorCalibration?.scaledUnitsAsText;

  const unitTypeEnumTextMapping = buildUnitTypeEnumTextMapping(t);

  const unitsText =
    values.unitConversionModeId === UnitConversionModeEnum.Basic
      ? scaledUnits
      : values.unitConversionModeId ===
          UnitConversionModeEnum.SimplifiedVolumetric ||
        values.unitConversionModeId === UnitConversionModeEnum.Volumetric
      ? unitTypeEnumTextMapping[values.displayUnitsId as UnitTypeEnum]
      : '';

  const minDeliveryAmountLabelWithUnit = labelWithOptionalText(
    t(
      'ui.datachannel.minDeliveryAmountToDetermineFill',
      'Min Delivery Amount To Determine Fill'
    ),
    unitsText
  );

  const maxTruckCapacity = labelWithOptionalText(
    t('ui.datachannel.maxTruckCapacity', 'Max Truck Capacity'),
    unitsText
  );
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <PageSubHeader dense>
          {t('ui.dataChannel.deliverySettings', 'Delivery Settings')}
        </PageSubHeader>
      </Grid>
      <Grid item xs={12}>
        <EditorBox>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <StyledFieldLabelText>
                {minDeliveryAmountLabelWithUnit}
              </StyledFieldLabelText>
            </Grid>
            <Grid item xs={8}>
              <Field
                id="displayMinFillThreshold-input" // Min Delivery Amount
                name="displayMinFillThreshold"
                type="number"
                component={CustomTextField}
              />
            </Grid>

            <Grid item xs={4}>
              <StyledFieldLabelText>{maxTruckCapacity}</StyledFieldLabelText>
            </Grid>
            <Grid item xs={8}>
              <Field
                id="displayMaxTruckCapacity-input"
                name="displayMaxTruckCapacity"
                type="number"
                component={CustomTextField}
              />
            </Grid>
          </Grid>
        </EditorBox>
      </Grid>
    </Grid>
  );
};

export default DeliverySettingsContainer;
