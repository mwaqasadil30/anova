/* eslint-disable indent, react/jsx-indent*/
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelDataSource,
  DataChannelDisplayUnitDTO,
  DataChannelReportDTO,
  DataChannelSaveTankSetupInfoDTO,
  DataChannelCategory,
  ProductInfoDto,
  TankDimensionInfoDto,
  TankSetupInfoDTO,
  UnitConversionModeEnum,
  UnitTypeEnum,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import ProductAutocomplete from 'components/forms/form-fields/ProductAutocomplete';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import TankDimensionAutocomplete from 'components/forms/form-fields/TankDimensionAutocomplete';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { useGetDisplayUnitsByUnitConversionMode } from 'containers/DataChannelEditor/hooks/useGetDisplayUnitsByUnitConversionMode';
import { useSaveTankSetupInfo } from 'containers/DataChannelEditor/hooks/useSaveTankSetupInfo';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import {
  buildUnitConversionModeTextMapping,
  buildUnitTypeEnumTextMapping,
  getTankDimensionTypeOptions,
  getUnitConversionModeEnumOptionsForTankSetupInfo,
} from 'utils/i18n/enum-to-text';
import { labelWithOptionalText } from '../../helpers';
import { StyledValueText } from '../../styles';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import OldTankSetupInfoFormEffect from './OldTankSetupInfoFormEffect';
import { Values } from './types';

const StyledFieldLabelText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  dataChannelId?: string;
  tankSetupInfo?: TankSetupInfoDTO | null;
  scaledUnits?: string | null;
  cancelCallback: () => void;
  saveAndExitCallback?: () => void;
}

const TankSetupDrawer = ({
  dataChannelDetails,
  dataChannelId,
  tankSetupInfo,
  scaledUnits,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();

  const formattedInitialValues = formatInitialValues(tankSetupInfo);

  const queryClient = useQueryClient();
  const updateTankSetupInfoApi = useSaveTankSetupInfo({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getDataChannelDetailsById);
    },
  });

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateTankSetupInfoApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);

    return updateTankSetupInfoApi
      .mutateAsync({
        ...formattedValuesForApi,
        dataChannelId: dataChannelId!,
      } as DataChannelSaveTankSetupInfoDTO)
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const [
    displayUnitRequest,
    setDisplayUnitRequest,
  ] = useState<UnitConversionModeEnum>();

  const displayUnitApi = useGetDisplayUnitsByUnitConversionMode(
    displayUnitRequest
  );

  const [displayUnitOptions, setDisplayUnitOptions] = useState<
    DataChannelDisplayUnitDTO[]
  >([]);

  const unitTypeEnumTextMapping = buildUnitTypeEnumTextMapping(t);

  const tankTypeOptions = useMemo(() => getTankDimensionTypeOptions(t), [t]);

  const initialSelectedProductId = dataChannelDetails?.tankSetupInfo?.productId
    ? ProductInfoDto.fromJS({
        id: dataChannelDetails?.tankSetupInfo.productId,
        name: dataChannelDetails?.tankSetupInfo.productName,
      })
    : null;
  const [
    selectedProductId,
    setSelectedProductId,
  ] = useState<ProductInfoDto | null>(initialSelectedProductId);

  const initialSelectedTankDimensionId = dataChannelDetails?.tankSetupInfo
    ?.tankTypeInfo?.tankDimensionId
    ? TankDimensionInfoDto.fromJS({
        id: dataChannelDetails?.tankSetupInfo?.tankTypeInfo?.tankDimensionId,
        description:
          dataChannelDetails?.tankSetupInfo?.tankTypeInfo
            ?.tankDimensionDescription,
      })
    : null;
  const [
    selectedTankDimensionId,
    setSelectedTankDimensionId,
  ] = useState<TankDimensionInfoDto | null>(initialSelectedTankDimensionId);

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, values, submitForm, setFieldValue }) => {
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

        const { isTankProfileSet } = values;

        const allUnitConversionModeEnumOptions = getUnitConversionModeEnumOptionsForTankSetupInfo(
          t
        );

        const unitConversionModeOptions = isTankProfileSet
          ? allUnitConversionModeEnumOptions.filter(
              (options) => options.value === UnitConversionModeEnum.Volumetric
            )
          : allUnitConversionModeEnumOptions.filter(
              (options) => options.value !== UnitConversionModeEnum.Volumetric
            );

        const unitConversionModeTextMapping = buildUnitConversionModeTextMapping(
          t
        );

        return (
          <>
            {/* NOTE: Additional business logic is included in this form effect */}
            <OldTankSetupInfoFormEffect
              values={values}
              dataChannelId={dataChannelId}
              displayUnitApi={displayUnitApi}
              setFieldValue={setFieldValue}
              setDisplayUnitOptions={setDisplayUnitOptions}
              setDisplayUnitRequest={setDisplayUnitRequest}
            />

            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  showSaveOptions
                  title={t('ui.dataChannel.tankSetup', 'Tank Setup')}
                  cancelCallback={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={updateTankSetupInfoApi.data}
                  submissionError={updateTankSetupInfoApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                  disableSaveAndExit={
                    displayUnitApi.isFetching || displayUnitApi.isError
                  }
                />
              </PageIntroWrapper>
            </CustomThemeProvider>

            <Box mt={3} />

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={2} alignItems="center">
                    {dataChannelDetails?.dataChannelTypeId ===
                      DataChannelCategory.Level && (
                      <>
                        {dataChannelDetails?.dataSourceInfo
                          ?.dataChannelDataSourceTypeId !==
                          DataChannelDataSource.Manual && (
                          <>
                            <Grid item xs={4}>
                              <StyledFieldLabelText>
                                {t(
                                  'ui.datachannel.selectTankProfile',
                                  'Select Tank Profile'
                                )}
                              </StyledFieldLabelText>
                            </Grid>
                            <Grid item xs={8}>
                              <Field
                                id="isTankProfileSet-input"
                                name="isTankProfileSet"
                                component={SwitchWithLabel}
                                type="checkbox"
                              />
                            </Grid>
                          </>
                        )}
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {values.isTankProfileSet
                              ? t('ui.tankSetup.tankProfile', 'Tank Profile')
                              : t('ui.datachannel.tanktype', 'Tank Type')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          {values.isTankProfileSet ? (
                            <Field
                              id="tankDimensionId-input"
                              name="tankDimensionId"
                              component={TankDimensionAutocomplete}
                              selectedOption={selectedTankDimensionId}
                              onChange={setSelectedTankDimensionId}
                              textFieldProps={{
                                placeholder: t(
                                  'ui.common.enterSearchCriteria',
                                  'Enter Search Criteria...'
                                ),
                              }}
                            />
                          ) : (
                            <Field
                              id="tankTypeId-input"
                              name="tankTypeId"
                              component={CustomTextField}
                              select
                              SelectProps={{ displayEmpty: true }}
                            >
                              <MenuItem value="" disabled>
                                <SelectItem />
                              </MenuItem>

                              {tankTypeOptions?.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Field>
                          )}
                        </Grid>
                      </>
                    )}

                    {/*
                      (Read-only label)
                      Totalized level data channel types only show a tank type,
                      back-end will always send back its a totalized level
                    */}
                    {dataChannelDetails?.dataChannelTypeId ===
                      DataChannelCategory.TotalizedLevel && (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.datachannel.tanktype', 'Tank Type')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <StyledValueText>
                            {tankSetupInfo?.tankTypeInfo?.tankTypeAsText}
                          </StyledValueText>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.common.product', 'Product')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={8}>
                      <Field
                        id="productId-input"
                        name="productId"
                        component={ProductAutocomplete}
                        selectedOption={selectedProductId}
                        onChange={setSelectedProductId}
                        textFieldProps={{
                          placeholder: t(
                            'ui.common.enterSearchCriteria',
                            'Enter Search Criteria...'
                          ),
                        }}
                      />
                    </Grid>

                    {dataChannelDetails?.dataChannelTypeId ===
                    DataChannelCategory.TotalizedLevel ? (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t(
                              'ui.dataChannel.unitsConversionMode',
                              'Units Conversion Mode'
                            )}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <StyledValueText>
                            {
                              unitConversionModeTextMapping[
                                values.unitConversionModeId as UnitConversionModeEnum
                              ]
                            }
                          </StyledValueText>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t(
                              'ui.dataChannel.unitsConversionMode',
                              'Units Conversion Mode'
                            )}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          {isTankProfileSet ? (
                            <StyledValueText>
                              {
                                unitConversionModeTextMapping[
                                  values.unitConversionModeId as UnitConversionModeEnum
                                ]
                              }
                            </StyledValueText>
                          ) : (
                            <Field
                              id="unitConversionModeId-input"
                              name="unitConversionModeId"
                              component={CustomTextField}
                              select
                              SelectProps={{ displayEmpty: true }}
                            >
                              <MenuItem value="" disabled>
                                <SelectItem />
                              </MenuItem>
                              {unitConversionModeOptions?.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Field>
                          )}
                        </Grid>
                      </>
                    )}

                    {(values.unitConversionModeId ===
                      UnitConversionModeEnum.Basic ||
                      values.unitConversionModeId ===
                        UnitConversionModeEnum.SimplifiedVolumetric) && (
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

                    {(values.unitConversionModeId ===
                      UnitConversionModeEnum.SimplifiedVolumetric ||
                      values.unitConversionModeId ===
                        UnitConversionModeEnum.Volumetric) && (
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
                      <StyledFieldLabelText>
                        {graphMinLabel}
                      </StyledFieldLabelText>
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
                      <StyledFieldLabelText>
                        {graphMaxLabel}
                      </StyledFieldLabelText>
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
          </>
        );
      }}
    </Formik>
  );
};

export default TankSetupDrawer;
