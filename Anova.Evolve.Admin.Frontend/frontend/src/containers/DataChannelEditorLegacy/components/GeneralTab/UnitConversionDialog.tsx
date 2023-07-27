/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  ConversionInfoRequestWithTankDimensions,
  EventRuleType,
} from 'api/admin/api';
import Button from 'components/Button';
import CircularProgress from 'components/CircularProgress';
import DialogTitle from 'components/dialog/DialogTitle';
import MessageBlock from 'components/MessageBlock';
import { useUnitConverter } from 'containers/DataChannelEditorLegacy/hooks/useUnitConverter';
import {
  ConfirmedUnitConversions,
  UnitConversionDetails,
  UnitConversionType,
} from 'containers/DataChannelEditorLegacy/types';
import { TFunction } from 'i18next';
import React, { Fragment, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { isInteger, isNumber } from 'utils/format/numbers';
import { buildUnitsOfMeasureTextMapping } from 'utils/i18n/enum-to-text';
import { eventRuleFormValueToUnitConversionPayload } from '../ObjectForm/helpers';
import { DCEditorEventRule } from '../ObjectForm/types';
import UnitConversionEventRuleData from './UnitConversionEventRuleData';
import UnitOldToNewValueRow from './UnitOldToNewValueRow';

const StyledArrowForwardIcon = styled(ArrowForwardIcon)`
  font-size: 20px;
  vertical-align: middle;
`;

const StyledDialogActions = styled(DialogActions)`
  justify-content: center;
`;

const BoldedText = styled(Typography)`
  font-weight: 500;
`;

const BoldedAndUnderlinedText = styled(Typography)`
  font-weight: 500;
  text-decoration: underline;
`;

const DialogActionButton = styled(Button)`
  width: 150px;
`;

const getEventRuleFieldLabel = (
  field: keyof DCEditorEventRule,
  t: TFunction
) => {
  switch (field) {
    case 'eventValue':
      return t('ui.common.value', 'Value');
    case 'hysteresis':
      return t('ui.datachanneleventrule.hysteresis.nounits', 'Hysteresis');
    case 'usageRate':
      // Since "Usage Rate" is the only field that can be converted, we don't
      // display it since they're already placed under a "Usage Rate" heading
      return '';
    default:
      return '';
  }
};

const getUnitConversionTypeText = (
  t: TFunction,
  unitConversionType: UnitConversionType
) => {
  const displayUnitsText = t('ui.datachannel.displayunits', 'Display Units');
  switch (unitConversionType) {
    case UnitConversionType.DisplayUnits:
      return t('ui.datachannel.displayunits', 'Display Units');
    case UnitConversionType.Product:
      return t('ui.common.product', 'Product');
    case UnitConversionType.TankDimension:
      return t('ui.common.tankdimension', 'Tank Dimension');
    default:
      return displayUnitsText;
  }
};

export interface UnitConversionDialogProps extends DialogProps {
  errorMessage?: React.ReactNode;
  conversionDetails: UnitConversionDetails;
  open: boolean;
  isDeleting?: boolean;
  hasError?: boolean;
  showUsageRate?: boolean;
  handleConfirm: (payload: ConfirmedUnitConversions) => void;
  handleCancel: () => void;
}

const UnitConversionDialog = ({
  open,
  isDeleting,
  hasError,
  errorMessage,
  conversionDetails,
  handleConfirm,
  handleCancel,
  ...dialogProps
}: UnitConversionDialogProps) => {
  const { t } = useTranslation();
  const unitsOfMeasureTextMapping = buildUnitsOfMeasureTextMapping(t);

  const {
    productId,
    productInfo,
    tankDimensionId,
    tankDimensionInfo,
    unitConversionType,
    fromUnit,
    toUnit,
    scaledUnit,
    fromTextValue,
    toTextValue,
    showUsageRate,
    displayDecimalPlaces,
    displayMaxProductHeight,
    graphMin,
    graphMax,
    maxDeliveryQuantity,
    usageRate,
    values,
  } = conversionDetails;

  const formattedDisplayDecimalPlaces =
    isInteger(displayDecimalPlaces) && Number(displayDecimalPlaces) >= 0
      ? Number(displayDecimalPlaces)
      : 0;

  const unitConverterApi = useUnitConverter();

  useEffect(() => {
    const eventRuleConversionPayload = eventRuleFormValueToUnitConversionPayload(
      values
    );

    unitConverterApi
      .makeRequest({
        fromUnit: isNumber(fromUnit) ? String(fromUnit) : null,
        toUnit: String(toUnit),
        values: {
          ...(isNumber(displayMaxProductHeight) && {
            displayMaxProductHeight: [displayMaxProductHeight as number],
          }),
          ...(isNumber(graphMin) && { graphMin: [graphMin as number] }),
          ...(isNumber(graphMax) && { graphMax: [graphMax as number] }),
          ...(isNumber(maxDeliveryQuantity) && {
            maxDeliveryQuantity: [maxDeliveryQuantity as number],
          }),
          ...(isNumber(usageRate) && { usageRate: [usageRate as number] }),
          ...eventRuleConversionPayload,
        },
        conversionInfoWithTankDimension: {
          displayUnit: toUnit,
          maxProductHeightInDisplayUnits: isNumber(displayMaxProductHeight)
            ? displayMaxProductHeight!
            : undefined,
          productId,
          tankDimensionId,
          scaledUnit,
        } as ConversionInfoRequestWithTankDimensions,
      })
      .catch(() => {});
  }, [fromUnit, toUnit, productId, tankDimensionId, scaledUnit]);

  const fromUnitText = isNumber(fromUnit)
    ? unitsOfMeasureTextMapping[fromUnit!]
    : t('ui.datachannel.noUnit', 'no unit');
  const toUnitText = unitsOfMeasureTextMapping[toUnit];

  if (!unitConversionType) {
    return null;
  }

  const unitConversionTypeText = getUnitConversionTypeText(
    t,
    unitConversionType
  );

  const convertedValues = unitConverterApi.data?.values;

  const newDisplayMaxProductHeight =
    convertedValues?.displayMaxProductHeight?.[0];
  const newGraphMin = convertedValues?.graphMin?.[0];
  const newGraphMax = convertedValues?.graphMax?.[0];
  const newMaxDeliveryQuantity = convertedValues?.maxDeliveryQuantity?.[0];
  const newUsageRate = convertedValues?.usageRate?.[0];

  const convertedEventRuleEntries = convertedValues
    ? Object.entries(convertedValues).filter(
        ([key]) =>
          key.startsWith('levelEventRules') ||
          key.startsWith('usageRateEventRules')
      )
    : [];

  const updatedEventRuleValues = convertedEventRuleEntries
    ? convertedEventRuleEntries.map(([key, [value]]) => {
        const splitFieldName = key.split('.');
        const eventRuleArrayName = splitFieldName[0];
        const eventRuleIndex = Number(splitFieldName[1]);
        const eventRuleField = splitFieldName[2] as keyof DCEditorEventRule;
        // @ts-ignore
        const eventRule = values[eventRuleArrayName]?.[eventRuleIndex];
        const oldEventRuleValue = eventRule?.[eventRuleField];
        const fieldLabel = getEventRuleFieldLabel(eventRuleField, t);

        const labelParts = [eventRule?.description, fieldLabel];
        return {
          label: labelParts.filter(Boolean).join(' '),
          oldValue: oldEventRuleValue,
          newValue: value,
          type: eventRule?.eventRuleType,
        };
      })
    : [];

  const updatedValues = [
    {
      label: t(
        'ui.datachannel.displayMaxProductHeight',
        'Display Max Product Height'
      ),
      oldValue: displayMaxProductHeight,
      newValue: newDisplayMaxProductHeight,
    },
    {
      label: t('ui.datachannel.graphmin', 'Graph Min'),
      oldValue: graphMin,
      newValue: newGraphMin,
    },
    {
      label: t('ui.datachannel.graphmax', 'Graph Max'),
      oldValue: graphMax,
      newValue: newGraphMax,
    },
    {
      label: t(
        'ui.datachannel.maxdeliverquantitywithoutunit',
        'Max Delivery Quantity'
      ),
      oldValue: maxDeliveryQuantity,
      newValue: newMaxDeliveryQuantity,
    },
    {
      label: t('ui.datachanneleventrule.usagerate', 'Usage Rate'),
      oldValue: usageRate,
      newValue: newUsageRate,
      hidden: !showUsageRate,
    },
  ];

  const handleConfirmUnitConversionChanges = () => {
    const eventRuleFieldNameValuePairs = convertedEventRuleEntries.map(
      ([key, [value]]) => {
        return {
          fieldName: key,
          value,
        };
      }
    );

    const payload: ConfirmedUnitConversions = {
      displayMaxProductHeight: newDisplayMaxProductHeight,
      graphMin: newGraphMin,
      graphMax: newGraphMax,
      maxDeliveryQuantity: newMaxDeliveryQuantity,
      usageRate: newUsageRate,
      productInfo,
      tankDimensionInfo,
      displayUnits: toUnit,
      eventRuleFieldNameValuePairs,
    };

    handleConfirm(payload);
  };

  const updatedLevelEventRuleValues = updatedEventRuleValues
    .filter((eventRuleData) => eventRuleData.type === EventRuleType.Level)
    .filter(
      ({ oldValue, newValue }) => isNumber(oldValue) && isNumber(newValue)
    );
  const updatedUsageRateEventRuleValues = updatedEventRuleValues
    .filter((eventRuleData) => eventRuleData.type === EventRuleType.UsageRate)
    .filter(
      ({ oldValue, newValue }) => isNumber(oldValue) && isNumber(newValue)
    );

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={open}
      onClose={handleCancel}
      PaperProps={{
        style: { minHeight: 500 },
      }}
      {...dialogProps}
    >
      <Box m={3}>
        <Box p={2} pb={0}>
          <Grid
            container
            spacing={2}
            direction="column"
            style={{ minHeight: 425 }}
          >
            <Grid item xs={12}>
              <DialogTitle align="center">
                {t(
                  'ui.unitConversionDialog.title',
                  'Are you sure you want to change {{unitConversionType}} from {{fromTextValue}} to {{toTextValue}}?',
                  {
                    unitConversionType: unitConversionTypeText,
                    fromTextValue: fromTextValue || t('ui.common.none', 'None'),
                    toTextValue,
                  }
                )}
              </DialogTitle>
            </Grid>
            {unitConverterApi.isFetching ? (
              <Grid item xs={12}>
                <Box
                  display="flex"
                  minHeight={350}
                  alignItems="center"
                  justifyContent="center"
                >
                  <CircularProgress />
                </Box>
              </Grid>
            ) : unitConverterApi.error ? (
              <Grid item xs={12}>
                <MessageBlock height={280}>
                  <Typography variant="body2" color="error">
                    {t(
                      'ui.common.retrieveDataError',
                      'Unable to retrieve data'
                    )}
                  </Typography>
                </MessageBlock>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Grid
                  container
                  spacing={2}
                  justify="center"
                  style={{ minHeight: 300 }}
                >
                  <Grid item xs={12}>
                    <Typography align="center">
                      {t(
                        'ui.unitConversionDialog.description',
                        'The following fields will be impacted and the new values will be applied.'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={4} />
                      <Grid item xs>
                        <Typography align="right">
                          {t('ui.unitConversionDialog.oldValue', 'Old value')}
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <Box textAlign="center">
                          <StyledArrowForwardIcon />
                        </Box>
                      </Grid>
                      <Grid item xs>
                        <BoldedText align="left">
                          {t('ui.unitConversionDialog.newValue', 'New value')}
                        </BoldedText>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={10}>
                    <Grid container spacing={1} alignItems="center">
                      {updatedValues
                        .filter(
                          ({ oldValue, newValue, hidden }) =>
                            isNumber(oldValue) && isNumber(newValue) && !hidden
                        )
                        .map((valueDetails, index) => {
                          const isLast = index === updatedValues.length - 1;
                          return (
                            <Fragment key={index}>
                              <UnitOldToNewValueRow
                                label={valueDetails.label}
                                oldValue={valueDetails.oldValue!}
                                oldUnit={fromUnitText}
                                newValue={valueDetails.newValue!}
                                newUnit={toUnitText}
                                decimalPlaces={formattedDisplayDecimalPlaces}
                              />
                              {!isLast && (
                                <Grid item xs={12}>
                                  <Divider />
                                </Grid>
                              )}
                            </Fragment>
                          );
                        })}
                    </Grid>
                  </Grid>
                  {updatedLevelEventRuleValues.length && (
                    <>
                      <Grid item xs={10}>
                        <BoldedAndUnderlinedText align="left">
                          {t(
                            'ui.datachanneleventrule.levelevents',
                            'Level Events'
                          )}
                        </BoldedAndUnderlinedText>
                      </Grid>
                      <Grid item xs={10}>
                        <UnitConversionEventRuleData
                          eventRuleValues={updatedLevelEventRuleValues}
                          fromUnitText={fromUnitText}
                          toUnitText={toUnitText}
                          decimalPlaces={formattedDisplayDecimalPlaces}
                        />
                      </Grid>
                    </>
                  )}
                  {updatedUsageRateEventRuleValues.length && (
                    <>
                      <Grid item xs={10}>
                        <BoldedAndUnderlinedText align="left">
                          {t(
                            'ui.datachanneleventrule.usagerateevents',
                            'Usage Rate Events'
                          )}
                        </BoldedAndUnderlinedText>
                      </Grid>
                      <Grid item xs={10}>
                        <UnitConversionEventRuleData
                          eventRuleValues={updatedUsageRateEventRuleValues}
                          fromUnitText={fromUnitText}
                          toUnitText={toUnitText}
                          decimalPlaces={formattedDisplayDecimalPlaces}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            )}
            {!unitConverterApi.isFetching && (
              <Grid item xs={12}>
                <StyledDialogActions>
                  {unitConverterApi.error ? (
                    <DialogActionButton
                      variant="outlined"
                      onClick={handleCancel}
                    >
                      {t('ui.common.cancel', 'Cancel')}
                    </DialogActionButton>
                  ) : (
                    <>
                      <DialogActionButton
                        variant="outlined"
                        onClick={handleCancel}
                      >
                        {t('ui.common.no', 'No')}
                      </DialogActionButton>
                      <DialogActionButton
                        variant="contained"
                        onClick={handleConfirmUnitConversionChanges}
                        disabled={isDeleting}
                      >
                        {t('ui.common.yes', 'Yes')}
                      </DialogActionButton>
                    </>
                  )}
                </StyledDialogActions>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};

export default UnitConversionDialog;
