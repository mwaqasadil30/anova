/* eslint-disable no-bitwise */
import {
  DataChannelCategory,
  DataChannelType,
  EventComparatorType,
  EventRuleComparator,
  EventRuleType,
  FtpFileFormat,
  RTUCategoryType,
  RTUDeviceInfo,
  RTUType,
} from 'api/admin/api';
import trimStart from 'lodash/trimStart';
import type { PartialDataChannel, PartialEventRule } from './types';

/**
 * Add wildcard characters to searchable text so the end users don't have to.
 * @param searchText The user's search string
 */
export const wildcardSearchText = (searchText: string | null | undefined) => {
  return searchText &&
    searchText[0] !== '*' &&
    searchText[searchText.length - 1] !== '*'
    ? `*${searchText}*`
    : searchText;
};

interface FormatSearchTextOptions {
  trimWhitespace?: boolean;
  addWildcardAsterisks?: boolean;
}

export const formatSearchText = (
  searchText: string | null | undefined,
  options?: FormatSearchTextOptions
): string => {
  if (!searchText) {
    return '';
  }

  const formattedOptions: FormatSearchTextOptions = {
    ...options,
    // Default trimWhitespace to true if not provided
    trimWhitespace:
      options?.trimWhitespace !== undefined ? options.trimWhitespace : true,
  };

  let formattedSearchText = searchText;

  if (formattedOptions?.trimWhitespace) {
    formattedSearchText = formattedSearchText.trim();
  }

  if (formattedOptions?.addWildcardAsterisks) {
    formattedSearchText = wildcardSearchText(formattedSearchText) || '';
  }

  return formattedSearchText;
};

// From: https://stackoverflow.com/a/2117523/7752479
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Logic replicated from the C# back-end via this code snippet:
// https://dev.azure.com/anovateam/Evolve/_wiki/wikis/Evolve.wiki/1304/Enhancements-Custom-Props-and-Integration-Params-(Aug-17-2020)?anchor=auto-generate-integration-id
export const getFtpId = (
  ftpFileFormat: FtpFileFormat,
  rtuDeviceId: string,
  channelNumber: number,
  dataChannelFtpTankId: string,
  channelPrefix: string | null = null
) => {
  let ftpId = '';
  let countOfZeroesToPrepend = 0;
  let paddedString = '';
  let strChannelNumber = '';

  switch (ftpFileFormat) {
    case FtpFileFormat.Praxair:
    case FtpFileFormat.EndressHauser: {
      strChannelNumber = String(channelNumber);
      const charCountChannelNumber = strChannelNumber.length;
      const channelPrefixLength =
        channelPrefix !== null ? channelPrefix.length : 0;
      countOfZeroesToPrepend = 3 - charCountChannelNumber - channelPrefixLength; // 3 for prax
      if (countOfZeroesToPrepend > 0)
        paddedString = '0'.repeat(countOfZeroesToPrepend);
      if (channelPrefix !== null) {
        strChannelNumber = `${paddedString}${channelPrefix}${strChannelNumber}`;
      } else {
        strChannelNumber = `${paddedString}${strChannelNumber}`;
      }

      ftpId = `${rtuDeviceId}${strChannelNumber}`;
      break;
    }

    case FtpFileFormat.Boc:
    case FtpFileFormat.PraxairHelium:
      ftpId = dataChannelFtpTankId.trim();
      if (ftpId.length > 0) {
        // then a configured dataChannel ftpIdentifier is being used for this dc, prepad with zeroes if necessary
        if (ftpId.length > 10) {
          // take only first 10 chars
          ftpId = ftpId.substring(0, 10);
        }
        // prepend with '0's to get 10 char
        else {
          countOfZeroesToPrepend = 10 - ftpId.length; // should be 10 chars
          if (countOfZeroesToPrepend > 0)
            paddedString = '0'.repeat(countOfZeroesToPrepend);
          ftpId = paddedString + ftpId;
        }
      } else {
        // no configured ftpidentifier found so generate one based on device id and channel number.
        let decimalDeviceId = parseInt(rtuDeviceId, 16);
        if (Number.isNaN(decimalDeviceId)) {
          decimalDeviceId = 0;
        }
        decimalDeviceId = decimalDeviceId + channelNumber - 1;
        const strDecimalDeviceId = String(decimalDeviceId);
        const charCountDecimalDeviceId = strDecimalDeviceId.length;
        countOfZeroesToPrepend = 10 - charCountDecimalDeviceId;
        if (countOfZeroesToPrepend > 0) {
          paddedString = '0'.repeat(countOfZeroesToPrepend);
        }
        ftpId = `${paddedString}${strDecimalDeviceId}`;
      }
      break;

    case FtpFileFormat.Apci: {
      // Set Channel Number part
      const countOfZeroesToPrependApci = 2 - String(channelNumber).length;
      let paddedStringApci = '';
      if (countOfZeroesToPrependApci > 0) {
        paddedStringApci = '0'.repeat(countOfZeroesToPrependApci);
      }
      const channelNumberApci = paddedStringApci + String(channelNumber);

      // Set Device Id part
      ftpId = dataChannelFtpTankId.trim();
      // If the length is greater than 5, characters will be removed starting from the right until the length is equal to 5
      // Remove any leading 0s before truncation
      if (ftpId.length > 5) {
        ftpId = trimStart(ftpId, '0');
        const len = ftpId.length >= 5 ? 5 : ftpId.length;
        ftpId = ftpId.substring(0, len);
      }
      // If the above process shortened the length to less than 5, prepend 0s
      // Use the built in method instead of reinventing the wheel
      if (ftpId.length < 5) {
        ftpId = ftpId.padStart(5, '0');
      }

      ftpId = `${ftpId}${channelNumberApci}`;
      break;
    }

    case FtpFileFormat.Generic:
    case FtpFileFormat.Generic2:
      ftpId = dataChannelFtpTankId.trim();
      break;

    case FtpFileFormat.Yara:
      ftpId = dataChannelFtpTankId.trim();
      break;

    case FtpFileFormat.Intellitrans:
      ftpId = dataChannelFtpTankId.trim();
      break;

    case FtpFileFormat.None:
      break;
    default:
      break;
  }

  return ftpId;
};

export const canAddBatteryChannelForRtu = (rtu?: RTUDeviceInfo | null) =>
  rtu?.category === RTUCategoryType.SMS ||
  rtu?.category === RTUCategoryType.Clover ||
  rtu?.category === RTUCategoryType.FourHundredSeries ||
  rtu?.rtuType === RTUType.FE0;

export const canAddRtuTemperatureChannelForRtu = (rtu?: RTUDeviceInfo | null) =>
  rtu?.category === RTUCategoryType.SMS;

export const isHeliumDataChannel = (dataChannel: PartialDataChannel) =>
  dataChannel.description?.toLowerCase().includes('helium');

export const isNitrogenDataChannel = (dataChannel: PartialDataChannel) =>
  dataChannel.description?.toLowerCase().includes('nitrogen');

export const isTelemetryEventRule = (
  eventRule: PartialEventRule | undefined,
  dataChannelType: DataChannelType | undefined
) =>
  eventRule?.eventRuleType === EventRuleType.Level &&
  dataChannelType === DataChannelType.BatteryVoltage;

export const getEventComparatorOutcome = (
  value1: number,
  comparator: EventComparatorType | EventRuleComparator | undefined,
  value2: number
) => {
  switch (comparator) {
    case EventComparatorType.EqualTo:
      return value1 === value2;
    case EventComparatorType.GreaterThan:
      return value1 > value2;
    case EventComparatorType.GreaterThanEqualTo:
      return value1 >= value2;
    case EventComparatorType.LessThan:
      return value1 < value2;
    case EventComparatorType.LessThanEqualTo:
      return value1 <= value2;
    default:
      return null;
  }
};

export const canEditDataChannelType = (
  dataChannelType?: DataChannelCategory
) => {
  return (
    dataChannelType !== DataChannelCategory.TotalizedLevel &&
    dataChannelType !== DataChannelCategory.RateOfChange &&
    dataChannelType !== DataChannelCategory.Rtu
  );
};

export const canAccessDataChannelEditorByDataChannelType = (
  dataChannelType?: DataChannelCategory
) => {
  return dataChannelType !== DataChannelCategory.Rtu;
};
