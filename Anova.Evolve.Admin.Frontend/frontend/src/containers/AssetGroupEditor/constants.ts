import Box from '@material-ui/core/Box';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import {
  AssetGroupCriteriaFilterAutoCompleteOptions,
  AssetGroupFilterSearchType,
  AssetGroupSearchCriteria,
  EvolveAssetGroupCriteriaOptionInfo,
  EvolveRetrieveAssetGroupEditComponentsByIdRequest,
  EvolveRetrieveAssetGroupEditComponentsByIdResponse,
  EvolveRetrieveAssetSummaryFromAssetGroupLoadByOptionsRequest,
  EvolveSaveAssetGroupRequest,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import routes from 'apps/admin/routes';
import { ReactComponent as RemoveIcon } from 'assets/icons/cancel.svg';
import { ReactComponent as EntityInfoIcon } from 'assets/icons/entity-info.svg';
import { ReactComponent as WorldIcon } from 'assets/icons/world.svg';
import Button from 'components/Button';
import Table from 'components/tables/components/Table';
import TableContainer from 'components/tables/components/TableContainer';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import { TFunction } from 'i18next';
import memoize from 'lodash/memoize';
import styled from 'styled-components';
import { gray100, gray900 } from 'styles/colours';

export interface ResponsePayload
  extends EvolveRetrieveAssetGroupEditComponentsByIdResponse {}

export enum Operator {
  OR = 'OR',
  AND = 'AND',
}
export enum Comparator {
  LIKE = 'LIKE',
  '=' = '=',
  '<>' = '<>',
  EMPTY = 'EMPTY',
}

export const FilterTypesToAssetGroupFilterSearchTypeConverter: Record<
  string,
  AssetGroupFilterSearchType
> = {
  AssetDescription: AssetGroupFilterSearchType.AssetDescription,
  ProductName: AssetGroupFilterSearchType.ProductName,
  CustomerName: AssetGroupFilterSearchType.CustomerName,
  Country: AssetGroupFilterSearchType.Country,
  State: AssetGroupFilterSearchType.State,
  City: AssetGroupFilterSearchType.City,
  PostalCode: AssetGroupFilterSearchType.PostalCode,
  DataChannelTypeName: AssetGroupFilterSearchType.DataChannelTypeName,
  RTUDeviceId: AssetGroupFilterSearchType.RTUDeviceID,
  ChannelNumber: AssetGroupFilterSearchType.ChannelNumber,
  CarrierName: AssetGroupFilterSearchType.CarrierName,
  FtpEnabled: AssetGroupFilterSearchType.FTPEnabled,
  FtpDomain: AssetGroupFilterSearchType.FTPDomain,
  CustomerContactName: AssetGroupFilterSearchType.CustomerContactName,
  InstalledTechName: AssetGroupFilterSearchType.InstallationTechName,
  CustomProperties: AssetGroupFilterSearchType.CustomProperties,
  ProductGroup: AssetGroupFilterSearchType.ProductGroup,
  None: AssetGroupFilterSearchType.None,
};

export enum BooleanEnum {
  True = 'True',
  False = 'False',
}

type Enum = {
  [id in number | string]: string | number;
};
export const ButtonBox = styled(Box)`
  padding: 4px 0;
`;
export interface Option {
  displayName: string;
  fieldName: string | AssetGroupFilterSearchType;
}

export function getCriteriaOptions(enum_: Enum): Option[] {
  // noinspection SuspiciousTypeOfGuard ts has another opinion on this
  return Object.keys(enum_)
    .filter((key) => typeof key === 'string')
    .map((o) => ({ displayName: enum_[o], fieldName: o })) as Option[];
}

export enum DataChannelType_ {
  Level = 'Level',
  Pressure = 'Pressure',
  DigitalInput = 'DigitalInput',
  BatteryVoltage = 'BatteryVoltage',
  Gps = 'Gps',
  FlowMeter = 'FlowMeter',
  Counter = 'Counter',
  Temperature = 'Temperature',
  OtherAnalog = 'OtherAnalog',
  RtuCaseTemperature = 'RtuCaseTemperature',
  Diagnostic = 'Diagnostic',
  TotalizedLevel = 'TotalizedLevel',
  VirtualChannel = 'VirtualChannel',
  Rtu = 'Rtu',
  Shock = 'Shock',
  RateOfChange = 'RateOfChange',
  SignalStrength = 'SignalStrength',
  ChargeCurrent = 'ChargeCurrent',
}

export const Options = {
  filter: (
    assetGroupCriteriaOptions?: EvolveAssetGroupCriteriaOptionInfo[] | null
  ): Option[] => {
    const safeOptions = assetGroupCriteriaOptions || [];
    return [...safeOptions] as Option[];
  },
  comparator: getCriteriaOptions(Comparator),
  value: [],
  valueEnum: (_enum: Enum) => getCriteriaOptions(_enum),
  valueArray: (options: string[]) =>
    getCriteriaOptions(
      options.reduce<Record<string, string>>((mem, option) => {
        mem[option] = option;
        return mem;
      }, {})
    ),
  operator: [
    ...getCriteriaOptions(Operator),
    {
      displayName: 'None',
      fieldName: '',
    },
  ],
};

export abstract class SelectionCriteria {
  filter!: string;
  comparator!: string;
  value!: string;
  operator!: string;

  static equals(one: SelectionCriteria, another: SelectionCriteria) {
    return (
      one.value === another.value &&
      one.comparator === another.comparator &&
      one.filter === another.filter &&
      one.operator === another.operator
    );
  }
}

export function getClearCriteria(): SelectionCriteria {
  return {
    filter: '',
    comparator: '',
    value: '',
    operator: '',
  } as SelectionCriteria;
}

export interface RequestPayload
  extends EvolveRetrieveAssetGroupEditComponentsByIdRequest {}

export interface SaveRequestPayload extends EvolveSaveAssetGroupRequest {}

export const CREATE_PATH = routes.assetGroupManager.create;

export const { AssetService } = AdminApiService;
export const callApiSaveData = AssetService.saveAssetGroup_SaveAssetGroup.bind(
  AssetService
);
export const callApiForEditData = AssetService.retrieveAssetGroupEditComponentsById_RetrieveAssetGroupEditComponentsById.bind(
  AssetService
);
export const callApiForSelectedAssets = memoize(
  AssetService.retrieveAssetSummaryFromAssetGroupLoadByOptions_RetrieveAssetSummaryFromAssetGroupLoadByOptions.bind(
    AssetService
  ),
  (req: EvolveRetrieveAssetSummaryFromAssetGroupLoadByOptionsRequest) => {
    return JSON.stringify([
      req.assetGroupSearchCriteria,
      req.options?.domainId,
      req.options?.assetGroupDomainId,
      req.options?.userId,
    ]);
  }
);
export const getOptionsHashKey = (
  options: AssetGroupCriteriaFilterAutoCompleteOptions
) =>
  `${options.searchType}${options.prefixText}${
    options.fieldName || ''
  }`.toLowerCase();
export const callApiForValueOptions = memoize(
  AssetService.retrieveAssetGroupCriteriaAutoCompleteFilterItemsByOptions_RetrieveAssetGroupCriteriaAutoCompleteFilterItemsByOptions.bind(
    AssetService
  ),
  // Weird typescript error after a non-breaking upgrade for lodash
  // @ts-ignore
  ({ options }: { options: AssetGroupCriteriaFilterAutoCompleteOptions }) => {
    return getOptionsHashKey(options);
  }
);

/**
 * Dangerously converts string to enum keys
 */
export function convertSearchCriteriaToSelection(
  criteria: AssetGroupSearchCriteria | undefined | null,
  i: 1 | 2 | 3 | 4
): SelectionCriteria {
  if (!criteria) {
    return getClearCriteria();
  }
  const getElement = <Enum>(key: string) =>
    (criteria[key as keyof AssetGroupSearchCriteria] as unknown) as Enum;

  const filter =
    getElement<keyof typeof FilterTypesToAssetGroupFilterSearchTypeConverter>(
      `filter${i}`
    ) || '';
  const comparator = getElement<Comparator>(`comparator${i}`) || '';
  const value = getElement<string>(`value${i}`) || '';
  const operator = getElement<Operator>(`operator${i}`) || '';
  return {
    filter,
    comparator,
    value,
    operator,
  };
}

export function convertSelectionToPartialSearchCriteria(
  selection: SelectionCriteria,
  i: number
): Partial<AssetGroupSearchCriteria> {
  return {
    [`value${i}`]: selection.value,
    [`comparator${i}`]: selection.comparator,
    [`filter${i}`]: selection.filter,
    [`operator${i}`]: selection.operator,
  } as Partial<AssetGroupSearchCriteria>;
}

function makeSearchCriteriaSafe(
  searchCriteria?: AssetGroupSearchCriteria | null | undefined
): AssetGroupSearchCriteria | null | undefined {
  if (!searchCriteria) {
    return searchCriteria;
  }

  let newSearchCriteria = {};

  for (let i = 1; i <= 4; i += 1) {
    const selectionCriteria = convertSearchCriteriaToSelection(
      searchCriteria,
      i as 1 | 2 | 3 | 4
    );
    newSearchCriteria = {
      ...newSearchCriteria,
      ...convertSelectionToPartialSearchCriteria(selectionCriteria, i),
    };
  }

  return newSearchCriteria as AssetGroupSearchCriteria;
}

export function massage(response: ResponsePayload): ResponsePayload {
  const newResponse = {
    ...response,
    assetGroupSearchCriteria: makeSearchCriteriaSafe(
      response.assetGroupSearchCriteria
    ),
  } as ResponsePayload;

  const editObject = newResponse.retrieveAssetGroupEditComponentsByIdResult
    ?.editObject || { name: '' };
  editObject.name = editObject?.name || '';

  return newResponse;
}

export function prepareValueOptions(data: SelectionCriteria[]) {
  return data.reduce((mem, el) => {
    mem[
      getOptionsHashKey({
        prefixText: el.value,
        searchType: (el.filter as unknown) as AssetGroupFilterSearchType,
      } as AssetGroupCriteriaFilterAutoCompleteOptions)
    ] = [el.value];
    return mem;
  }, {} as Record<string, string[]>);
}

export const ButtonBesideSelect = styled(Button)`
  color: ${(props) => props.theme.palette.text.primary};
`;

export const CellTextValue = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.primary};
`;

export const CellDarkText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${gray900};
`;

export const StyledEmptyText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  font-weight: 500;
  color: ${(props) => props.theme.palette.text.secondary};
`;
export const StyledGroupedRowText = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
  color: ${gray900};
`;

export const StyledEntityInfoIcon = styled(EntityInfoIcon)`
  vertical-align: middle;
  color: ${(props) => props.theme.palette.text.secondary};
`;

export const CustomSizedSpan = styled('div')`
  width: ${({ width }: { width: number }) => `${width}px`};
`;
export const PaddedBox = styled(Box)`
  padding: 5px 15px 5px 0;
`;
export const PaddedHeadCell = styled(TableHeadCell)`
  padding: 12px 16px;
  width: ${({ width }: { width: number }) => `${width}px`};
`;
export const StyledWorldIcon = styled(WorldIcon)`
  margin-top: 4px;
`;
export const StyledRemoveIcon = styled(RemoveIcon)`
  width: 32px;
  height: 32px;
`;
export const DomainNameCell = styled(TableCell)`
  padding: 8px 16px;
`;
export const RemoveIconHeadCell = styled(TableHeadCell)`
  padding: 0;
  max-width: 35px;
  width: 35px;
  min-width: 35px;
`;

export const PaddedCell = styled(TableCell)`
  padding: 16px 14px;
`;
export const TopAlignedPaddedCell = styled(PaddedCell)`
  vertical-align: top;
`;
export const GroupedCell = styled(TableCell)`
  padding: 9px 14px;
  background: ${gray100};
`;
export const CustomSizedTable = styled(Table)`
  min-width: 1100px;
`;
export const SelectedAssetsTableContainer = styled(TableContainer)`
  max-height: 500px;
`;
export const SelectedAssetsTable = styled(Table)`
  min-width: 1500px;
`;
export const CustomSizedTableBorderlessCells = styled(CustomSizedTable)`
  td {
    border-right: 0;
    border-bottom: 0;
  }
  tr > td:not(:last-child) {
    border-right: 0;
  }
`;

const criteriaField = 'assetGroupSearchCriteria';
export const PropertyPath: Record<
  keyof SelectionCriteria,
  (i: number) => string
> = {
  value: (i: number) => `${criteriaField}.value${i + 1}`,
  comparator: (i: number) => `${criteriaField}.comparator${i + 1}`,
  filter: (i: number) => `${criteriaField}.filter${i + 1}`,
  operator: (i: number) => `${criteriaField}.operator${i + 1}`,
};

export const unassignedUsersPath =
  'retrieveAssetGroupEditComponentsByIdResult.unassignedUsers';
export const assignedUsersPath =
  'retrieveAssetGroupEditComponentsByIdResult.editObject.assignedUsers';
export const publishedDomainsPath =
  'retrieveAssetGroupEditComponentsByIdResult.editObject.publishedDomains';
export const unassignedDomainsPath =
  'retrieveAssetGroupEditComponentsByIdResult.unassignedDomains';

export interface TranslationText
  extends Record<
    keyof (keyof typeof FilterTypesToAssetGroupFilterSearchTypeConverter &
      Operator &
      Comparator),
    string
  > {}

export function getCopy(t: TFunction): TranslationText {
  return {
    AssetDescription: t('ui.assetgroup.AssetDescription', 'Asset Description'),
    ProductName: t('ui.assetgroup.ProductName', 'Product Name'),
    CustomerName: t('ui.assetgroup.CustomerName', 'Customer Name'),
    Country: t('ui.assetgroup.Country', 'Country'),
    State: t('ui.assetgroup.State', 'State'),
    City: t('ui.assetgroup.City', 'City'),
    PostalCode: t('ui.assetgroup.PostalCode', 'Postal Code'),
    DataChannelTypeName: t(
      'ui.assetgroup.DataChannelTypeName',
      'Data Channel Type Name'
    ),
    RTUDeviceId: t('ui.assetgroup.RTUDeviceID', 'RTU Device ID'),
    ChannelNumber: t('ui.assetgroup.ChannelNumber', 'Channel Number'),
    CarrierName: t('ui.assetgroup.CarrierName', 'Carrier Name'),
    FtpEnabled: t('ui.assetgroup.FTPEnabled', 'FTP Enabled'),
    FtpDomain: t('ui.assetgroup.FTPDomain', 'FTP Domain'),
    CustomerContactName: t(
      'ui.assetgroup.CustomerContactName',
      'Customer Contact Name'
    ),
    InstalledTechName: t(
      'ui.assetgroup.InstallationTechName',
      'Installation Tech Name'
    ),
    CustomProperties: t('ui.assetgroup.CustomProperties', 'Custom Properties'),
    ProductGroup: t('ui.assetgroup.ProductGroup', 'Product Group'),
    OR: t('ui.common.Or', 'Or'),
    AND: t('ui.common.And', 'And'),
    LIKE: t('ui.common.Like', 'Like'),
    // These are the same display values used in the designs + legacy app
    '=': '=',
    '<>': '!=',
    EMPTY: t('ui.common.IsEmpty', 'Is Empty'),
    NONE: t('ui.assetgroup.None', 'None'),
  };
}

export const DUPLICATE_DESCRIPTION_MESSAGE =
  'Asset Group Description is already in used. Please choose another.';

export const buildErrorMessageTextMapping = (t: TFunction) => {
  return {
    [DUPLICATE_DESCRIPTION_MESSAGE]: t(
      'validate.assetGroup.descriptionIsAlreadyUsed',
      DUPLICATE_DESCRIPTION_MESSAGE
    ),
  };
};
