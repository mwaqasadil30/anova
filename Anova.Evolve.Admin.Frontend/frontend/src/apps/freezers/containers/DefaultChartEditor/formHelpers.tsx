import {
  ChartDefaultDto,
  ChartDefaultTagDto,
  ReasonCodeEnum,
} from 'api/admin/api';
import { AssetSubTypeEnum } from 'apps/freezers/types';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';
import { errorReasonCodeToMessage } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import {
  fieldAlreadyExists,
  fieldIsRequired,
  fieldMustBeNumber,
} from 'utils/forms/errors';
import * as Yup from 'yup';
import { ChartYAxisPosition, Values } from './types';

export const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const maximumAxisItemsMessage = t(
    'validate.freezer.chartEditor.axisMaxLength',
    'A maximum of {{numItems}} items are allowed',
    { numItems: 4 }
  );

  const minimumAxisItemsMessage = t(
    'validate.freezer.chartEditor.axisMinLength',
    'At least 1 item is required'
  );

  const sortIndexMustBeGreaterThanText = t(
    'validate.freezer.defaultChart.sortIndex.mustBeGreater',
    'Sort Index must be greater than 0'
  );

  return Yup.object().shape({
    name: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.chartNameText))
      .required(fieldIsRequired(t, translationTexts.chartNameText))
      .max(20),

    leftAxis: Yup.array()
      .max(4, maximumAxisItemsMessage)
      .test(
        'at-least-one-graph-series-selected-in-either-axis',
        minimumAxisItemsMessage,
        function isValid() {
          const { leftAxis, rightAxis } = this.parent;
          const leftAxisHasAtLeastOneItem = leftAxis && leftAxis.length > 0;
          const rightAxisHasAtLeastOneItem = rightAxis && rightAxis.length > 0;

          return leftAxisHasAtLeastOneItem || rightAxisHasAtLeastOneItem;
        }
      ),
    rightAxis: Yup.array().max(4, maximumAxisItemsMessage),
    sortIndex: Yup.number()
      .min(1, sortIndexMustBeGreaterThanText)
      .required(fieldIsRequired(t, translationTexts.sortIndexText))
      .typeError(fieldMustBeNumber(t, translationTexts.sortIndexText)),
  });
};

export const formatInitialValues = (
  values?: ChartDefaultDto | null
): Values => {
  const leftAxis = values?.chartDefaultTags?.filter(
    (chartTag) => chartTag.chartYaxisPosition === ChartYAxisPosition.Left
  );
  const rightAxis = values?.chartDefaultTags?.filter(
    (chartTag) => chartTag.chartYaxisPosition === ChartYAxisPosition.Right
  );

  return {
    name: values?.name || '',
    assetSubTypeId: isNumber(values?.assetSubTypeId!)
      ? values?.assetSubTypeId!
      : AssetSubTypeEnum.CompactSpiral,
    sortIndex: values?.sortIndex || '',
    leftAxis: leftAxis || [],
    rightAxis: rightAxis || [],
  };
};

interface FormatValuesForApiOptions {
  defaultChartId?: string;
}

export const formatValuesForApi = (
  values: Values,
  options: FormatValuesForApiOptions
): ChartDefaultDto => {
  const leftDataChannels = values.leftAxis.map<ChartDefaultTagDto>(
    (chartDataChannel) => {
      return {
        chartDefaultTagId: chartDataChannel.chartDefaultTagId,
        tagName: chartDataChannel.tagName,
        chartYaxisPosition: ChartYAxisPosition.Left,
      } as ChartDefaultTagDto;
    }
  );

  const rightDataChannels = values.rightAxis.map<ChartDefaultTagDto>(
    (chartDataChannel) => {
      return {
        chartDefaultTagId: chartDataChannel.chartDefaultTagId,
        tagName: chartDataChannel.tagName,
        chartYaxisPosition: ChartYAxisPosition.Right,
      } as ChartDefaultTagDto;
    }
  );

  const combinedDataChannels = leftDataChannels.concat(rightDataChannels);

  return {
    ...(isNumber(options.defaultChartId) && {
      chartDefaultId: Number(options.defaultChartId),
    }),
    name: values.name,
    chartDefaultTags: combinedDataChannels,
    sortIndex: values.sortIndex,
    assetSubTypeId: values.assetSubTypeId,
  } as ChartDefaultDto;
};

export const mapApiErrorsToFields = (t: TFunction, errors: any) => {
  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    return errors.reduce((prev, current) => {
      const fieldName = camelCase(current?.propertyName) || '';
      const errorMessage = errorReasonCodeToMessage(
        t,
        current?.reasonCodeTypeId,
        current?.errorMessage
      );

      // TODO: Back-end doesn't return the field name for some reason. For now
      // just handle the case when only ReasonCodeEnum.RecordAlreadyExists is
      // returned.
      if (
        !fieldName &&
        current?.reasonCodeTypeId === ReasonCodeEnum.RecordAlreadyExists
      ) {
        const chartNameText = t(
          'ui.freezers.chartEditor.chartName',
          'Chart name'
        );
        prev.name = fieldAlreadyExists(t, chartNameText);
      }

      if (!fieldName || !errorMessage) {
        return prev;
      }

      if (!prev[fieldName]) {
        prev[fieldName] = [];
      }

      prev[fieldName].push(errorMessage);

      return prev;
    }, {});
  }

  // If we got to this point, we received an error that we can't map to a field
  return null;
};
