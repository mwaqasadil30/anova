import {
  EvolveUnitsConverterWithConversionInfoRequest,
  UnitType,
  EvolveQuickAssetCreateUnitsConverterRequest,
  EvolveQuickAssetCreateUnitsConverterResponse,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { FormChangeEffectProps } from 'containers/QuickTankCreate/types';
import { useCallback, useEffect, useState, useRef } from 'react';
import usePrevious from 'react-use/lib/usePrevious';
import { isNumber } from 'utils/format/numbers';

const roundToDecimalPlaces = (
  value: number | string | null | undefined,
  decimalPlaces: number | undefined
) => {
  if (!isNumber(value)) {
    return null;
  }

  const cleanDecimalPlaces =
    decimalPlaces && decimalPlaces >= 0 && decimalPlaces <= 100
      ? decimalPlaces
      : 0;
  const valueWithForcedDecimalPlaces = Number(value).toFixed(
    cleanDecimalPlaces
  );

  const valueWithRemovedTrailingZeroes = parseFloat(
    valueWithForcedDecimalPlaces
  );
  return valueWithRemovedTrailingZeroes;
};

const useConvertUnits = ({
  values,
  selectedLevelSensor,
  unitTypeTextToEnumMapping,
  setFieldValue,
}: FormChangeEffectProps) => {
  const {
    isTankDimensionsSet,
    tankDimensionId,
    productId,
    levelMonitoringMaxProductHeight,
    displayUnits,
    reorderEventValue,
    criticalEventValue,
    _convertedDisplayUnitsProductHeight,
    _convertedReorderEventValue,
    _convertedCriticalEventValue,
  } = values;

  const [storedProductHeight, setStoredProductHeight] = useState<
    number | null
  >();
  const [storedCriticalLevel, setStoredCriticalLevel] = useState<
    number | null
  >();
  const [storedReorderLevel, setStoredReorderLevel] = useState<number | null>();

  const convertUnits = useCallback(
    (request: EvolveQuickAssetCreateUnitsConverterRequest) => {
      return AdminApiService.UnitsConverterService.quickAssetCreateUnitsConverter_QuickAssetCreateUnitsConverter(
        request
      );
    },
    []
  );

  // If any field involved in unit conversion changes, then we reset the more
  // precise + hidden field since the user's input takes priority
  useEffect(() => {
    if (
      isNumber(levelMonitoringMaxProductHeight) &&
      storedProductHeight &&
      Number(storedProductHeight) !== Number(levelMonitoringMaxProductHeight)
    ) {
      setFieldValue('_convertedDisplayUnitsProductHeight', '');
      setStoredProductHeight(null);
    }
  }, [levelMonitoringMaxProductHeight]);
  useEffect(() => {
    if (
      isNumber(reorderEventValue) &&
      storedReorderLevel &&
      Number(storedReorderLevel) !== Number(reorderEventValue)
    ) {
      setFieldValue('_convertedReorderEventValue', '');
      setStoredReorderLevel(null);
    }
  }, [reorderEventValue]);
  useEffect(() => {
    if (
      isNumber(criticalEventValue) &&
      storedCriticalLevel &&
      Number(storedCriticalLevel) !== Number(criticalEventValue)
    ) {
      setFieldValue('_convertedCriticalEventValue', '');
      setStoredCriticalLevel(null);
    }
  }, [criticalEventValue]);

  // A ref to store the last issued pending request. Used to prevent a slow API
  // request to override the result of the most recent one the user sent.
  // More details:
  // https://sebastienlorber.com/handling-api-request-race-conditions-in-react
  const lastPromise = useRef<
    Promise<EvolveQuickAssetCreateUnitsConverterResponse>
  >();
  const previousDisplayUnit = usePrevious(displayUnits);
  useEffect(() => {
    if (
      isNumber(previousDisplayUnit) &&
      isTankDimensionsSet &&
      tankDimensionId &&
      productId &&
      levelMonitoringMaxProductHeight &&
      selectedLevelSensor?.scaledUnits &&
      isNumber(selectedLevelSensor?.scaledMin) &&
      isNumber(selectedLevelSensor?.scaledMax) &&
      unitTypeTextToEnumMapping &&
      displayUnits! in UnitType
    ) {
      const usedProductHeightValue = isNumber(
        _convertedDisplayUnitsProductHeight
      )
        ? _convertedDisplayUnitsProductHeight
        : levelMonitoringMaxProductHeight;
      const usedReorderLevelValue = isNumber(_convertedReorderEventValue)
        ? _convertedReorderEventValue
        : reorderEventValue;
      const usedCriticalLevelValue = isNumber(_convertedCriticalEventValue)
        ? _convertedCriticalEventValue
        : criticalEventValue;

      // @ts-ignore
      const displayUnitsPromise = convertUnits({
        fromUnit: previousDisplayUnit,
        toUnit: displayUnits,
        maxProductHeight: usedProductHeightValue,
        reorderEventValue: usedReorderLevelValue,
        criticalEventValues: usedCriticalLevelValue,
        tankDimensionId,
        productId,
        scaledUnit: unitTypeTextToEnumMapping[selectedLevelSensor.scaledUnits!],
        scaledMin: selectedLevelSensor.scaledMin!,
        scaledMax: selectedLevelSensor.scaledMax!,
      } as EvolveUnitsConverterWithConversionInfoRequest);

      lastPromise.current = displayUnitsPromise;

      displayUnitsPromise
        .then((displayUnitsResponse) => {
          const convertedUnit = displayUnitsResponse.unit;
          if (
            displayUnitsPromise === lastPromise.current &&
            Number(displayUnits) === convertedUnit
          ) {
            const convertedReorderEventLevel =
              displayUnitsResponse.reorderEventValue;
            const convertedCriticalEventLevel =
              displayUnitsResponse.criticalEventValue;
            const convertedProductHeight =
              displayUnitsResponse.maxProductHeight;

            const roundedProductHeight = roundToDecimalPlaces(
              convertedProductHeight,
              displayUnitsResponse.decimalPlaces
            );
            const roundedCriticalLevel = roundToDecimalPlaces(
              convertedCriticalEventLevel,
              displayUnitsResponse.decimalPlaces
            );
            const roundedReorderLevel = roundToDecimalPlaces(
              convertedReorderEventLevel,
              displayUnitsResponse.decimalPlaces
            );

            setStoredProductHeight(roundedProductHeight);
            setStoredCriticalLevel(roundedCriticalLevel);
            setStoredReorderLevel(roundedReorderLevel);

            setFieldValue(
              '_convertedReorderEventValue',
              convertedReorderEventLevel
            );
            setFieldValue(
              '_convertedCriticalEventValue',
              convertedCriticalEventLevel
            );
            setFieldValue(
              '_convertedDisplayUnitsProductHeight',
              convertedProductHeight
            );

            setFieldValue('reorderEventValue', roundedReorderLevel);
            setFieldValue('criticalEventValue', roundedCriticalLevel);
            setFieldValue(
              'levelMonitoringMaxProductHeight',
              roundedProductHeight
            );
          }
        })
        .catch((error) => {
          if (displayUnitsPromise === lastPromise.current) {
            console.error('Unable to convert units', error);
          }
        });
    }
  }, [
    isTankDimensionsSet,
    tankDimensionId,
    productId,
    selectedLevelSensor,
    displayUnits,
  ]);

  return null;
};

export default useConvertUnits;
