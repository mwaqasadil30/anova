/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DataChannelDisplayUnitDTO,
  DataChannelDisplayUnitsDTO,
  DataChannelReportDTO,
  DataChannelCategory,
  UnitConversionModeEnum,
  UnitTypeEnum,
} from 'api/admin/api';
import EditorBox from 'components/EditorBox';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageSubHeader from 'components/PageSubHeader';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UseQueryResult } from 'react-query';
import { isNumber } from 'utils/format/numbers';
import { buildUnitTypeEnumTextMapping } from 'utils/i18n/enum-to-text';
import { labelWithOptionalText } from '../../../helpers';
import { StyledFieldLabelText } from '../../../styles';
import { Values } from '../types';

interface Props {
  values: Values;
  isSubmitting: boolean;
  displayUnitApi: UseQueryResult<DataChannelDisplayUnitsDTO, unknown>;
  displayUnitOptions: DataChannelDisplayUnitDTO[];
  dataChannelDetails?: DataChannelReportDTO | null;
}

const ReadingAndDisplayContainer = ({
  values,
  isSubmitting,
  displayUnitApi,
  displayUnitOptions,
  dataChannelDetails,
}: Props) => {
  const { t } = useTranslation();

  const isPressureDataChannel =
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Pressure;

  const unitTypeEnumTextMapping = buildUnitTypeEnumTextMapping(t);

  const scaledUnits = dataChannelDetails?.sensorCalibration?.scaledUnitsAsText;
  const maxProductCapacityLabel = labelWithOptionalText(
    t('ui.datachannel.maxProductCapacity', 'Max Product Capacity'),
    scaledUnits
  );
  const displayUnitsText = isNumber(values.displayUnitsId)
    ? unitTypeEnumTextMapping[values.displayUnitsId as UnitTypeEnum]
    : '';
  const displayMaxProductCapacityLabel = labelWithOptionalText(
    t(
      'ui.datachannel.displayMaxProductCapacity',
      'Display Max Product Capacity'
    ),
    displayUnitsText
  );

  const graphMinText =
    values.unitConversionModeId === UnitConversionModeEnum.Basic
      ? scaledUnits
      : values.unitConversionModeId ===
          UnitConversionModeEnum.SimplifiedVolumetric ||
        values.unitConversionModeId === UnitConversionModeEnum.Volumetric
      ? unitTypeEnumTextMapping[values.displayUnitsId as UnitTypeEnum]
      : '';

  const graphMinLabel = labelWithOptionalText(
    t('ui.datachannel.graphmin', 'Graph Min'),
    graphMinText
  );

  const graphMaxText =
    values.unitConversionModeId === UnitConversionModeEnum.Basic
      ? scaledUnits
      : values.unitConversionModeId ===
          UnitConversionModeEnum.SimplifiedVolumetric ||
        values.unitConversionModeId === UnitConversionModeEnum.Volumetric
      ? unitTypeEnumTextMapping[values.displayUnitsId as UnitTypeEnum]
      : '';

  const graphMaxLabel = labelWithOptionalText(
    t('ui.datachannel.graphmax', 'Graph Max'),
    graphMaxText
  );

  // Tank setup related below

  // NOTE: Temporarily commenting out as this might end up being used in some way
  // and might include a rename
  // const calculateMaxProductHeightText =
  //   values.unitConversionModeId === UnitConversionModeEnum.Volumetric
  //     ? unitTypeEnumTextMapping[values.displayUnitsId as UnitTypeEnum]
  //     : '';

  // const calculateMaxProductHeightLabel = labelWithOptionalText(
  //   t(
  //     'ui.datachannel.calculatedMaxProductHeight',
  //     'Calculated Max Product Height'
  //   ),
  //   calculateMaxProductHeightText
  // );

  const isBasicTank =
    values.unitConversionModeId === UnitConversionModeEnum.Basic;
  const isSimplifiedVolumetricTank =
    values.unitConversionModeId === UnitConversionModeEnum.SimplifiedVolumetric;
  const isVolumetricTank =
    values.unitConversionModeId === UnitConversionModeEnum.Volumetric;

  const getFormattedContainerTitle = () => {
    if (isPressureDataChannel) {
      return t('ui.dataChannel.displayOptions', 'Display Options');
    }
    return t('ui.dataChannel.readingAndDisplay', 'Reading and Display');
  };

  const formattedContainerTitle = getFormattedContainerTitle();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <PageSubHeader dense>{formattedContainerTitle}</PageSubHeader>
      </Grid>
      <Grid item xs={12}>
        <EditorBox>
          <Grid container spacing={2} alignItems="center">
            {(isBasicTank || isSimplifiedVolumetricTank) &&
              !isPressureDataChannel && (
                <>
                  <Grid item xs={4}>
                    <StyledFieldLabelText>
                      {maxProductCapacityLabel}
                    </StyledFieldLabelText>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      id="maxProductCapacity-input"
                      name="maxProductCapacity"
                      component={CustomTextField}
                      type="number"
                    />
                  </Grid>
                </>
              )}

            {(isSimplifiedVolumetricTank || isVolumetricTank) &&
              !isPressureDataChannel && (
                <>
                  <Grid item xs={4}>
                    <StyledFieldLabelText>
                      {t('ui.datachannel.displayunits', 'Display Units')}
                    </StyledFieldLabelText>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      id="displayUnitsId-input"
                      name="displayUnitsId"
                      component={CustomTextField}
                      select
                      SelectProps={{ displayEmpty: true }}
                      disabled={displayUnitApi.isFetching || isSubmitting}
                    >
                      <MenuItem value="" disabled>
                        <SelectItem />
                      </MenuItem>
                      {displayUnitOptions?.map((option) => (
                        <MenuItem key={option.id!} value={option.id!}>
                          {option.name}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  <Grid item xs={4}>
                    <StyledFieldLabelText>
                      {displayMaxProductCapacityLabel}
                    </StyledFieldLabelText>
                  </Grid>
                  <Grid item xs={8}>
                    <Field
                      id="displayMaxProductCapacity-input"
                      name="displayMaxProductCapacity"
                      component={CustomTextField}
                    />
                  </Grid>
                </>
              )}

            {/* {values.unitConversionModeId ===
                      UnitConversionModeEnum.Volumetric && (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {calculateMaxProductHeightLabel}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="calculatedMaxProductHeight-input"
                            name="calculatedMaxProductHeight"
                            component={CustomTextField}
                          />
                        </Grid>
                      </>
                    )} */}

            <Grid item xs={4}>
              <StyledFieldLabelText>{graphMinLabel}</StyledFieldLabelText>
            </Grid>
            <Grid item xs={8}>
              <Field
                id="graphMin-input"
                name="graphMin"
                component={CustomTextField}
                type="number"
              />
            </Grid>

            <Grid item xs={4}>
              <StyledFieldLabelText>{graphMaxLabel}</StyledFieldLabelText>
            </Grid>
            <Grid item xs={8}>
              <Field
                id="graphMax-input"
                name="graphMax"
                component={CustomTextField}
                type="number"
              />
            </Grid>
          </Grid>
        </EditorBox>
      </Grid>
    </Grid>
  );
};

export default ReadingAndDisplayContainer;
