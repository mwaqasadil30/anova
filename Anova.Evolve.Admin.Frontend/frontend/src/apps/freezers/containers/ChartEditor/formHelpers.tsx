import {
  ChartDataChannelDto,
  ReasonCodeEnum,
  UserChartDto,
} from 'api/admin/api';
import { TFunction } from 'i18next';
import camelCase from 'lodash/camelCase';
import { errorReasonCodeToMessage } from 'utils/format/errors';
import { isNumber } from 'utils/format/numbers';
import { fieldAlreadyExists, fieldIsRequired } from 'utils/forms/errors';
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
  });
};

// TODO: Replace `any` with types from the API
export const formatInitialValues = (values?: UserChartDto | null): Values => {
  const leftAxis = values?.chartDataChannels?.filter(
    (chartDataChannel) =>
      chartDataChannel.chartYAxisPosition === ChartYAxisPosition.Left
  );
  const rightAxis = values?.chartDataChannels?.filter(
    (chartDataChannel) =>
      chartDataChannel.chartYAxisPosition === ChartYAxisPosition.Right
  );

  return {
    name: values?.name || '',
    leftAxis: leftAxis || [],
    rightAxis: rightAxis || [],
  };
};

interface FormatValuesForApiOptions {
  chartId?: string;
  assetId: string;
}

export const formatValuesForApi = (
  values: Values,
  options: FormatValuesForApiOptions
): UserChartDto => {
  const leftDataChannels = values.leftAxis.map<ChartDataChannelDto>(
    (chartDataChannel) => {
      return ChartDataChannelDto.fromJS({
        ...chartDataChannel,
        chartYAxisPosition: ChartYAxisPosition.Left,
      } as ChartDataChannelDto);
    }
  );

  const rightDataChannels = values.rightAxis.map<ChartDataChannelDto>(
    (chartDataChannel) => {
      return ChartDataChannelDto.fromJS({
        ...chartDataChannel,
        chartYAxisPosition: ChartYAxisPosition.Right,
      } as ChartDataChannelDto);
    }
  );

  const combinedDataChannels = leftDataChannels.concat(rightDataChannels);

  return {
    ...(isNumber(options.chartId) && { chartId: Number(options.chartId) }),
    assetId: options.assetId,
    name: values.name,
    chartDataChannels: combinedDataChannels,
  } as UserChartDto;
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
        current?.reasonCodeTypeId
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

  return errors;
};
