/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MuiLink from '@material-ui/core/Link';
import {
  DataChannelCategory,
  DataChannelDTO,
  UnitTypeEnum,
} from 'api/admin/api';
import routes from 'apps/admin/routes';
import {
  buildUOMOptions,
  getReadingValueDisplayText,
} from 'apps/ops/containers/AssetDetail/helpers';
import {
  CardDateText,
  CardMajorText,
  CardMinorText,
} from 'apps/ops/containers/AssetDetail/styles';
import { ReactComponent as EllipsisIcon } from 'assets/icons/ellipsis.svg';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import MajorText from 'components/typography/MajorText';
import { IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED } from 'env';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, Link } from 'react-router-dom';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import { selectCanAccessAdminDataChannelEditor } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { canAccessDataChannelEditorByDataChannelType } from 'utils/api/helpers';
import { formatModifiedDatetime } from 'utils/format/dates';
import { isNumber } from 'utils/format/numbers';
import {
  getUnitOfMeasureTypeOptions,
  UnitOfMeasureCategory,
} from 'utils/i18n/enum-to-text';
import {
  getDataChannelDTODescription,
  renderDataChannelIcon,
  renderImportance,
  renderImportanceTextColor,
} from 'utils/ui/helpers';
import { canShowUnitOfMeasureOptionsForDataChannel } from '../../../../helpers';
import { DataChannelForGraph, ReadingsHookData } from '../../../../types';
import DataChannelsActionsMenu from '../../../DataChannelsActionsMenu';

const StyledEventImportanceText = styled(
  ({ highestEventImportanceLevel, ...props }) => <MajorText {...props} />
)`
  color: ${(props) =>
    renderImportanceTextColor(props.highestEventImportanceLevel)};
`;

const StyledCardMajorText = styled(CardMajorText)`
  text-decoration: underline;
`;

const StyledSmallTextField = styled(StyledTextField)`
  min-width: 115px;
  max-width: 170px;
  & .MuiInput-root {
    height: 20px;
    overflow: hidden;
    font-size: 11px;
  }

  && [class*='MuiSelect-root'] {
    /* Additional right padding to account for the dropdown caret */
    padding: 4px 21px 4px 8px;
  }

  &&
    [class*='MuiInput-root'][class*='Mui-focused']
    > [class*='MuiSelect-select'] {
    padding: 3px 7px;
  }

  && [class*='MuiSelect-icon'] {
    width: 8px;
    height: 8px;
    margin-right: 0;
    color: ${(props) => props.theme.palette.text.primary};
  }

  && [class*='MuiSelect-icon'][class*='Mui-disabled'] {
    opacity: 0.3;
  }
`;

const StyledMenuButton = styled(IconButton)`
  padding: 0;
`;

const renderReadingValueDisplayText = (
  t: TFunction,
  dataChannel: DataChannelDTO,
  text: string,
  digitalInputValue?: number | null
) => {
  if (
    text &&
    isNumber(digitalInputValue) &&
    dataChannel.dataChannelTypeId === DataChannelCategory.DigitalInput
  ) {
    return (
      <Grid container alignItems="center">
        <Grid
          item
          style={{
            maxWidth: '85%',
          }}
        >
          <div
            style={{
              marginRight: 4,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </div>
        </Grid>
        <Grid item>({digitalInputValue})</Grid>
      </Grid>
    );
  }

  return text || <em>{t('ui.assetdetail.noreadings', 'No Readings')}</em>;
};

interface UOMOption {
  label: string;
  value: any;
  type: UnitOfMeasureCategory;
}

interface Props {
  cardHeight?: number;
  dataChannel: DataChannelDTO;
  dataChannels?: DataChannelDTO[];
  isSelected: boolean;
  disableCheckbox?: boolean;
  disableUnitOfMeasureButtons?: boolean;
  hideUnitOfMeasureButtons?: boolean;
  showCheckbox?: boolean;
  isPublishedAsset?: boolean;
  selectedDataChannels: DataChannelDTO[];
  readingsData?: ReadingsHookData;
  handleChangeSelectedDataChannel: (
    dataChannel: DataChannelForGraph,
    checked: boolean
  ) => void;
  handleChangeDataChannelToUnitMapping?: (
    dataChannelId: string,
    unit?: UnitTypeEnum | null
  ) => void;
  openUpdateDisplayPriorityDialog: () => void;
  setDataChannelsResult?: (dataChannels: DataChannelDTO[]) => void;
  fetchRecords: () => void;
}

const CarouselCard = ({
  cardHeight = 132,
  dataChannel,
  dataChannels,
  isSelected,
  disableCheckbox,
  disableUnitOfMeasureButtons,
  hideUnitOfMeasureButtons,
  showCheckbox,
  isPublishedAsset,
  selectedDataChannels,
  readingsData,
  handleChangeSelectedDataChannel,
  handleChangeDataChannelToUnitMapping,
  openUpdateDisplayPriorityDialog,
  setDataChannelsResult,
  fetchRecords,
}: Props) => {
  const { t } = useTranslation();

  const canAccessDataChannelEditor = useSelector(
    selectCanAccessAdminDataChannelEditor
  );

  const allUnitOptions = getUnitOfMeasureTypeOptions({
    supportedUOMType: dataChannel.uomParams?.supportedUOMTypeId,
    scaledUnit: dataChannel.scaledUnit,
    t,
  });

  const unitOfMeasureOptions = buildUOMOptions(
    dataChannel.uomParams?.supportedUOMTypeId,
    allUnitOptions,
    t
  );

  const enabledEvents = dataChannel?.uomParams?.eventRules;

  const activeEvents = enabledEvents?.filter(
    (activeEvent) => activeEvent.isActive
  );

  const activeEventDescriptions = activeEvents?.map((item) => item.description);

  const joinedEventDescriptions = activeEventDescriptions?.join(', ');

  const eventImportanceLevels = activeEvents
    ?.map((item) => item.importanceLevel)
    .filter(isNumber)
    .sort((a, b) => b! - a!);

  const highestEventImportanceLevel = eventImportanceLevels?.[0];
  const highestEventImportanceIcon = renderImportance(
    highestEventImportanceLevel
  );

  const handleChangeCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    handleChangeSelectedDataChannel(dataChannel, checked);
  };

  const handleChangeUnitOfMeasure = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    if (dataChannel.dataChannelId) {
      const unit = isNumber(event.target.value)
        ? (event.target.value as UnitTypeEnum)
        : null;
      handleChangeDataChannelToUnitMapping?.(dataChannel.dataChannelId, unit);
    }
  };

  const valueAndUnitsAsText = getReadingValueDisplayText(dataChannel);

  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);
  const latestReadingTimestamp = formatModifiedDatetime(
    dataChannel?.latestReadingTimestamp,
    ianaTimezoneId
  );

  const canShowUnitOfMeasureOptions = canShowUnitOfMeasureOptionsForDataChannel(
    dataChannel
  );
  const dataChannelDescription = getDataChannelDTODescription(dataChannel);
  const selectedUnitOfMeasureValue = isNumber(dataChannel.uomParams?.unitTypeId)
    ? dataChannel.uomParams?.unitTypeId
    : '';

  const canAccessDataChannelEditorLink =
    !isPublishedAsset &&
    canAccessDataChannelEditor &&
    // NOTE: Temporarily disable links for specific data channel types
    canAccessDataChannelEditorByDataChannelType(
      dataChannel.dataChannelTypeId
    ) &&
    IS_NEW_DATA_CHANNEL_EDITOR_FEATURE_ENABLED;

  return (
    <CustomBoxRedesign
      aria-label="data channel card"
      width={250}
      height={cardHeight}
      display="inline-block"
      position="relative"
    >
      <Box p="6px" height="calc(100% - 10px)">
        <Grid
          container
          alignItems="flex-start"
          justify="flex-start"
          style={{ height: '100%' }}
        >
          <Grid item xs={12}>
            <Grid container alignItems="center" justify="flex-end">
              <Grid item xs={highestEventImportanceIcon ? 11 : 12}>
                {!!joinedEventDescriptions && !!highestEventImportanceIcon ? (
                  <Box
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textAlign="right"
                    mr="4px"
                  >
                    <StyledEventImportanceText
                      display="inline"
                      title={joinedEventDescriptions || ''}
                      aria-label="Event descriptions"
                      highestEventImportanceLevel={highestEventImportanceLevel}
                    >
                      {joinedEventDescriptions}
                    </StyledEventImportanceText>
                  </Box>
                ) : (
                  <>&nbsp;</>
                )}
              </Grid>
              {highestEventImportanceIcon && (
                <Grid item xs={1} style={{ textAlign: 'center' }}>
                  {highestEventImportanceIcon}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginBottom: 25 }}>
            <Grid container justify="space-between">
              <Grid item xs={4}>
                <Box textAlign="center" mx="auto" mt="4px">
                  {renderDataChannelIcon(dataChannel)}
                </Box>
              </Grid>

              <Grid item xs={8} style={{ margin: '0 auto' }}>
                {canAccessDataChannelEditorLink ? (
                  <StyledCardMajorText
                    title={dataChannelDescription}
                    aria-label="Data channel description"
                    noWrap
                  >
                    <MuiLink
                      component={Link}
                      to={generatePath(routes.dataChannelManager.edit, {
                        dataChannelId: dataChannel.dataChannelId,
                      })}
                      color="inherit"
                      underline="none"
                    >
                      {dataChannelDescription}
                    </MuiLink>
                  </StyledCardMajorText>
                ) : (
                  <CardMajorText
                    title={dataChannelDescription}
                    aria-label="Data channel description"
                  >
                    {dataChannelDescription}
                  </CardMajorText>
                )}

                <CardMinorText
                  title={valueAndUnitsAsText}
                  aria-label="Value and units"
                  // @ts-ignore
                  component="div"
                >
                  {renderReadingValueDisplayText(
                    t,
                    dataChannel,
                    valueAndUnitsAsText,
                    dataChannel.uomParams?.latestReadingValue
                  )}
                </CardMinorText>
                <CardDateText
                  title={latestReadingTimestamp}
                  aria-label="Latest reading timestamp"
                >
                  {latestReadingTimestamp || <>&nbsp;</>}
                </CardDateText>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box position="absolute" bottom={3} left={8} right={5}>
          <Grid
            container
            alignItems="center"
            justify={hideUnitOfMeasureButtons ? 'flex-end' : 'space-between'}
          >
            {!hideUnitOfMeasureButtons && (
              <Grid item xs>
                {canShowUnitOfMeasureOptions && (
                  <StyledSmallTextField
                    id={`${dataChannel.dataChannelId}-uom-input`}
                    select
                    fullWidth={false}
                    disabled={disableUnitOfMeasureButtons}
                    onChange={handleChangeUnitOfMeasure}
                    value={selectedUnitOfMeasureValue}
                    SelectProps={{ displayEmpty: true }}
                  >
                    {unitOfMeasureOptions}
                  </StyledSmallTextField>
                )}
              </Grid>
            )}
            <Grid item>
              <Grid container spacing={0} alignItems="center">
                {/* 
                  Show/Hide the ellipsis on the carousel card with logic 
                  wrapping the grid below if required 
                */}
                <Grid item>
                  <DataChannelsActionsMenu
                    record={dataChannel}
                    dataChannels={dataChannels}
                    isPublishedAsset={isPublishedAsset}
                    selectedDataChannels={selectedDataChannels}
                    readingsData={readingsData}
                    openUpdateDisplayPriorityDialog={
                      openUpdateDisplayPriorityDialog
                    }
                    setDataChannelsResult={setDataChannelsResult}
                    fetchRecords={fetchRecords}
                  >
                    <StyledMenuButton>
                      <EllipsisIcon />
                    </StyledMenuButton>
                  </DataChannelsActionsMenu>
                </Grid>

                {showCheckbox && (
                  <Grid item>
                    <Checkbox
                      style={{ padding: 3 }}
                      checked={isSelected}
                      disabled={disableCheckbox}
                      onChange={handleChangeCheckbox}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </CustomBoxRedesign>
  );
};

export default CarouselCard;
