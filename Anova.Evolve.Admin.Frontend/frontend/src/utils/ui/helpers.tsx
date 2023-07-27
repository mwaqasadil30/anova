import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {
  DataChannelDTO,
  DataChannelType,
  EventImportanceLevelType,
  EventRuleImportanceLevel,
  EventInventoryStatusType,
  EventRuleInventoryStatus,
  EventRuleModel,
  EvolveAssetDetailDataChannelInfo,
  TankType,
  TankTypeEnum,
  DataChannelCategory,
} from 'api/admin/api';
import { ReactComponent as BatteryIcon } from 'assets/icons/battery.svg';
import { ReactComponent as BellUrgentColoredIcon } from 'assets/icons/bell-urgent-colored.svg';
import { ReactComponent as BellUrgentIcon } from 'assets/icons/bell-urgent.svg';
import { ReactComponent as ChargeCurrentIcon } from 'assets/icons/charge-current.svg';
import { ReactComponent as DiagnosticIcon } from 'assets/icons/diagnostic.svg';
import { ReactComponent as FlowMeterIcon } from 'assets/icons/flow-meter.svg';
import { ReactComponent as GPSIcon } from 'assets/icons/gps.svg';
import { ReactComponent as InformationColoredIcon } from 'assets/icons/information-colored.svg';
import { ReactComponent as InformationIcon } from 'assets/icons/information.svg';
import { ReactComponent as OtherAnalogIcon } from 'assets/icons/other-analog.svg';
import { ReactComponent as RTUIcon } from 'assets/icons/rtu-dc.svg';
import { ReactComponent as ShockIcon } from 'assets/icons/shock-sensor.svg';
import { ReactComponent as HorizontalWith2to1EllippsoidalEndsImage } from 'assets/icons/tank-types/horizontal-2-1-ellipsoidal-ends.svg';
import { ReactComponent as HorizontalWithFlatEndsImage } from 'assets/icons/tank-types/horizontal-with-flat-ends.svg';
import { ReactComponent as HorizontalWithHemisphericalEndsImage } from 'assets/icons/tank-types/horizontal-with-hemispherical-ends.svg';
import { ReactComponent as HorizontalWithVariableDishedEndsImage } from 'assets/icons/tank-types/horizontal-with-variable-dished-ends.svg';
import { ReactComponent as RectangularTankImage } from 'assets/icons/tank-types/rectangular-tank.svg';
import { ReactComponent as SphericalTankImage } from 'assets/icons/tank-types/spherical-tank.svg';
import { ReactComponent as VerticalWithConicalBottomEndImage } from 'assets/icons/tank-types/v-conical-ends.svg';
import { ReactComponent as VerticalWith2to1EllipsoidalEndsImage } from 'assets/icons/tank-types/v-ellipsoidal-ends.svg';
import { ReactComponent as VerticalWithFlatEndsImage } from 'assets/icons/tank-types/v-flat-ends.svg';
import { ReactComponent as VerticalWithHemisphericalEndsImage } from 'assets/icons/tank-types/v-hemi-ends.svg';
import { ReactComponent as VerticalWithVariableDishedEndsImage } from 'assets/icons/tank-types/v-variable-ends.svg';
import { ReactComponent as UsageRateIcon } from 'assets/icons/usage-rate-dc.svg';
import { ReactComponent as VirtualIcon } from 'assets/icons/virtual-dc.svg';
import { ReactComponent as HighColoredIcon } from 'assets/icons/warning-high-colored.svg';
import { ReactComponent as HighIcon } from 'assets/icons/warning-high.svg';
import { ReactComponent as WarningMediumColoredIcon } from 'assets/icons/warning-medium-colored.svg';
import { ReactComponent as WarningMediumIcon } from 'assets/icons/warning-medium.svg';
import DynamicDigitalCounter from 'components/icons/DynamicDigitalCounter';
import DynamicDigitalInputTextBox from 'components/icons/DynamicDigitalInputTextBox';
import DynamicPressureGauge from 'components/icons/DynamicPressureGauge';
import DynamicSignalStrengthIcon from 'components/icons/DynamicSignalStrengthIcon';
import DynamicThermometerIcon from 'components/icons/DynamicThermometerIcon';
import HorizontalFillableTankIcon from 'components/icons/HorizontalFillableTankIcon';
import TotalizedFillableTankIcon from 'components/icons/TotalizedFillableTankIcon';
import VerticalFillableTankIcon from 'components/icons/VerticalFillableTankIcon';
import round from 'lodash/round';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  criticalColor,
  criticalColorDark,
  criticalOrEmptyTankColor,
  criticalOrEmptyTankColorDark,
  emptyColor,
  emptyColorDark,
  fullColor,
  fullColorDark,
  informationColor,
  missingDataColor,
  normalTankColor,
  normalTankColorDark,
  reorderColor,
  reorderColorDark,
  reorderTankColor,
  userDefinedColor,
  userDefinedTankColor,
  warningColor,
} from 'styles/colours';
import { isNumber } from 'utils/format/numbers';

const StyledImportanceIcon = styled.svg<{ $color?: string }>`
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;

  ${(props) => props.$color && `color: ${props.$color};`}
`;

const RenderedDataChannelIconWrapper = styled.span`
  color: ${(props) => props.theme.custom.palette.dataChannelIcon};
`;

const StyledTankIcon = styled.div`
  & .tank-icon-text-color {
    fill: ${(props) => props.theme.palette.text.primary};
  }
`;

interface RenderImportanceOptions {
  // Optionally allow the color to be overridden for backwards compatibility.
  // Older pages always want the colored-specific version of the icon, for
  // example, the information icon was always blue. For some new pages, the
  // color needs to be changed to appear better on a darker background color.
  allowColorOverride?: boolean;
}

export const renderImportance = (
  eventImportanceLevel:
    | EventImportanceLevelType
    | EventRuleImportanceLevel
    | undefined
    | null,
  options?: RenderImportanceOptions
) => {
  switch (eventImportanceLevel) {
    case EventImportanceLevelType.Information:
      return (
        <StyledImportanceIcon
          // Use this class name if we need to access and  customize the icon's color.
          className="custom-importance-icon"
          as={
            options?.allowColorOverride
              ? InformationIcon
              : InformationColoredIcon
          }
          aria-label="Event importance information icon"
          $color="#5D97DA"
        />
      );
    case EventImportanceLevelType.Warning:
      return (
        <StyledImportanceIcon
          // Use this class name if we need to access and  customize the icon's color.
          className="custom-importance-icon"
          as={
            options?.allowColorOverride
              ? WarningMediumIcon
              : WarningMediumColoredIcon
          }
          aria-label="Event importance warning icon"
          $color="#EA9C27"
        />
      );
    case EventImportanceLevelType.High:
      return (
        <StyledImportanceIcon
          // Use this class name if we need to access and  customize the icon's color.
          className="custom-importance-icon"
          as={options?.allowColorOverride ? HighIcon : HighColoredIcon}
          aria-label="Event importance high icon"
          $color="#DD4534"
        />
      );
    case EventImportanceLevelType.Urgent:
      return (
        <StyledImportanceIcon
          // Use this class name if we need to access and  customize the icon's color.
          className="custom-importance-icon"
          as={
            options?.allowColorOverride ? BellUrgentIcon : BellUrgentColoredIcon
          }
          aria-label="Event importance urgent icon"
          $color="#B93B42"
        />
      );
    default:
      return null;
  }
};

export const renderImportanceTextColor = (
  eventImportanceLevel:
    | EventImportanceLevelType
    | EventRuleImportanceLevel
    | undefined
    | null
) => {
  switch (eventImportanceLevel) {
    case EventImportanceLevelType.Information:
      return '#5D97DA';
    case EventImportanceLevelType.Warning:
      return '#EA9C27';
    case EventImportanceLevelType.High:
      return '#DD4534';
    case EventImportanceLevelType.Urgent:
      return '#B93B42';
    default:
      return 'inherit';
  }
};

export const getTankDimensionImage = (tankType: TankType) => {
  const commonProps = {
    'aria-role': 'img',
  };
  const renderTankImage = () => {
    switch (Number(tankType)) {
      case TankType.HorizontalWith2To1EllipsoidalEnds:
        return (
          <HorizontalWith2to1EllippsoidalEndsImage
            {...commonProps}
            aria-label="Horizontal with 2:1 Ellipsoidal Ends tank"
          />
        );
      case TankType.HorizontalWithFlatEnds:
        return (
          <HorizontalWithFlatEndsImage
            {...commonProps}
            aria-label="Horizontal with Flat Ends tank"
          />
        );
      case TankType.HorizontalWithHemisphericalEnds:
        return (
          <HorizontalWithHemisphericalEndsImage
            {...commonProps}
            aria-label="Horizontal with Hemispherical Ends tank"
          />
        );
      case TankType.HorizontalWithVariableDishedEnds:
        return (
          <HorizontalWithVariableDishedEndsImage
            {...commonProps}
            aria-label="Horizontal with Variable Dished Ends tank"
          />
        );
      case TankType.RectangularBox:
        return (
          <RectangularTankImage
            {...commonProps}
            aria-label="Rectangular tank"
          />
        );
      case TankType.None:
        return null;
      case TankType.SphericalTank:
        return (
          <SphericalTankImage {...commonProps} aria-label="Spherical tank" />
        );
      case TankType.VerticalWithConicalBottomEnd:
        return (
          <VerticalWithConicalBottomEndImage
            {...commonProps}
            aria-label="Vertical with Conical Bottom End tank"
          />
        );
      case TankType.VerticalWith2To1EllipsoidalEnds:
        return (
          <VerticalWith2to1EllipsoidalEndsImage
            {...commonProps}
            aria-label="Vertical with 2:1 Ellipsoidal Ends tank"
          />
        );
      case TankType.VerticalWithFlatEnds:
        return (
          <VerticalWithFlatEndsImage
            {...commonProps}
            aria-label="Vertical with Flat Ends tank"
          />
        );
      case TankType.VerticalWithHemisphericalEnds:
        return (
          <VerticalWithHemisphericalEndsImage
            {...commonProps}
            aria-label="Vertical with Hemispherical Ends tank"
          />
        );
      case TankType.VerticalWithVariableDishedEnds:
        return (
          <VerticalWithVariableDishedEndsImage
            {...commonProps}
            aria-label="Vertical with Variable Dished Ends tank"
          />
        );
      default:
        return null;
    }
  };
  return <StyledTankIcon>{renderTankImage()}</StyledTankIcon>;
};

export const getLabelWithUnits = (label: string, units?: string | null) => {
  return units ? `${label} (${units})` : label;
};

export const formatPhoneNumber = (phoneNumber?: string | null) => {
  if (!phoneNumber) {
    return '';
  }

  if (phoneNumber.length !== 10) {
    return phoneNumber;
  }

  const areaCode = phoneNumber.slice(0, 3);
  const midDigits = phoneNumber.slice(3, 6);
  const endDigits = phoneNumber.slice(6, 10);
  return `(${areaCode})-${midDigits}-${endDigits}`;
};

/**
 * Get the scrollbar width for the user's browser. Retrieved from
 * react-table's virtualized rows example:
 * https://react-table-omega.vercel.app/docs/examples/virtualized-rows
 */
export const getScrollbarWidth = () => {
  const scrollDiv = document.createElement('div');
  scrollDiv.setAttribute(
    'style',
    'width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;'
  );
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

/** @deprecated Replaced by `getHighestPriorityEventRuleInventoryStatus` */
export const getHighestPriorityInventoryStatus = (
  dataChannel: EvolveAssetDetailDataChannelInfo | null | undefined
) => {
  const prioritizedEvents = dataChannel?.enabledEvents
    ?.filter((event) => event.isActive)
    .sort((a, b) => {
      const isFirstImportanceLevelSet = isNumber(a.importanceLevel);
      const isSecondImportanceLevelSet = isNumber(b.importanceLevel);
      if (!isFirstImportanceLevelSet && !isSecondImportanceLevelSet) {
        return 0;
      }
      if (isFirstImportanceLevelSet && !isSecondImportanceLevelSet) {
        return -1;
      }
      if (!isFirstImportanceLevelSet && isSecondImportanceLevelSet) {
        return 1;
      }

      return b.importanceLevel! - a.importanceLevel!;
    });

  return prioritizedEvents?.[0]?.inventoryStatus;
};

export const getHighestPriorityEventRuleInventoryStatus = (
  events?: EventRuleModel[] | null
) => {
  const prioritizedEvents = events
    ?.filter((event) => event.isActive)
    .sort((a, b) => {
      const isFirstImportanceLevelSet = isNumber(a.importanceLevel);
      const isSecondImportanceLevelSet = isNumber(b.importanceLevel);
      if (!isFirstImportanceLevelSet && !isSecondImportanceLevelSet) {
        return 0;
      }
      if (isFirstImportanceLevelSet && !isSecondImportanceLevelSet) {
        return -1;
      }
      if (!isFirstImportanceLevelSet && isSecondImportanceLevelSet) {
        return 1;
      }

      return b.importanceLevel! - a.importanceLevel!;
    });

  return prioritizedEvents?.[0]?.inventoryStatus;
};

export const getTankColorForInventoryStatus = (
  inventoryStatus?: EventInventoryStatusType | EventRuleInventoryStatus | null,
  theme?: 'light' | 'dark'
) => {
  // TODO: This and all other 'dark' strings should be replaced with an enum
  // NOTE: Prefer !== comparator over === because 'light' is default
  if (theme !== 'dark') {
    switch (inventoryStatus) {
      case EventInventoryStatusType.UserDefined:
        return userDefinedTankColor;
      case EventInventoryStatusType.Full:
        return fullColor;
      case EventInventoryStatusType.Reorder:
        return reorderTankColor;
      case EventInventoryStatusType.Critical:
      case EventInventoryStatusType.Empty:
        return criticalOrEmptyTankColor;
      default:
        return normalTankColor;
    }
  }
  switch (inventoryStatus) {
    case EventInventoryStatusType.UserDefined:
      return userDefinedTankColor;
    case EventInventoryStatusType.Full:
      return fullColorDark;
    case EventInventoryStatusType.Reorder:
      return reorderColorDark;
    case EventInventoryStatusType.Critical:
    case EventInventoryStatusType.Empty:
      return criticalOrEmptyTankColorDark;
    default:
      return normalTankColorDark;
  }
};

/** @deprecated Replaced by `getDataChannelDTODescription` */
export const getDataChannelDescription = (
  dataChannel: EvolveAssetDetailDataChannelInfo
) => {
  switch (dataChannel.type) {
    case DataChannelType.Pressure:
    case DataChannelType.TotalizedLevel:
    case DataChannelType.Level: {
      // NOTE: The data channel description may already contain the product
      // description since it's completely customizable by the user. Here, we
      // don't show the product description if it's already in the data channel
      // description.
      const productDescription =
        dataChannel.description &&
        dataChannel.description
          .toLowerCase()
          .includes(dataChannel?.productDescription?.toLowerCase()!)
          ? ''
          : dataChannel?.productDescription;

      const productAndDataChannelType = [
        productDescription,
        dataChannel.description,
      ]
        .filter(Boolean)
        .join(' ');

      return productAndDataChannelType;
    }
    default:
      return dataChannel.description || '';
  }
};

export const getDataChannelDTODescription = (dataChannel?: DataChannelDTO) => {
  switch (dataChannel?.dataChannelTypeId) {
    case DataChannelCategory.Pressure:
    case DataChannelCategory.TotalizedLevel:
    case DataChannelCategory.Level: {
      // NOTE: The data channel description may already contain the product
      // description since it's completely customizable by the user. Here, we
      // don't show the product description if it's already in the data channel
      // description.
      const productDescription =
        dataChannel.description &&
        dataChannel.description
          .toLowerCase()
          .includes(dataChannel?.productDescription?.toLowerCase()!)
          ? ''
          : dataChannel?.productDescription;

      const productAndDataChannelType = [
        productDescription,
        dataChannel.description,
      ]
        .filter(Boolean)
        .join(' ');

      return productAndDataChannelType;
    }
    default:
      return dataChannel?.description || '';
  }
};

interface GetGenericDataChannelDescriptionData {
  type: DataChannelCategory | undefined;
  dataChannelDescription: string | null | undefined;
  productDescription: string | null | undefined;
}

export const getGenericDataChannelDescription = ({
  type,
  dataChannelDescription,
  productDescription,
}: GetGenericDataChannelDescriptionData) => {
  switch (type) {
    case DataChannelCategory.Pressure:
    case DataChannelCategory.TotalizedLevel:
    case DataChannelCategory.Level: {
      // NOTE: The data channel description may already contain the product
      // description since it's completely customizable by the user. Here, we
      // don't show the product description if it's already in the data channel
      // description.
      const cleanProductDescription =
        dataChannelDescription &&
        dataChannelDescription
          .toLowerCase()
          .includes(productDescription?.toLowerCase()!)
          ? ''
          : productDescription;

      const productAndDataChannelType = [
        cleanProductDescription,
        dataChannelDescription,
      ]
        .filter(Boolean)
        .join(' ');

      return productAndDataChannelType;
    }
    default:
      return dataChannelDescription || '';
  }
};

export const TankPercentText = styled(Typography)`
  font-weight: 500;
  font-size: 10px;
`;

const renderTankTypeIcon = (
  color: string,
  tankType: TankType | TankTypeEnum | null | undefined,
  percentFull?: number | null,
  importanceLevel?:
    | EventImportanceLevelType
    | EventRuleImportanceLevel
    | null
    | undefined
) => {
  switch (tankType) {
    case TankType.HorizontalWith2To1EllipsoidalEnds:
    case TankType.HorizontalWithFlatEnds:
    case TankType.HorizontalWithVariableDishedEnds:
    case TankType.HorizontalWithHemisphericalEnds:
      return (
        <HorizontalFillableTankIcon
          color={color}
          percentFull={percentFull}
          importanceLevel={importanceLevel}
        />
      );

    case TankType.VerticalWith2To1EllipsoidalEnds:
    case TankType.VerticalWithHemisphericalEnds:
    case TankType.VerticalWithFlatEnds:
    case TankType.VerticalWithVariableDishedEnds:
    case TankType.VerticalWithConicalBottomEnd:
      return (
        <VerticalFillableTankIcon
          color={color}
          percentFull={percentFull}
          importanceLevel={importanceLevel}
        />
      );
    // Treating these cases separately as we do not have icons for these
    // TankTypes designed yet - defaulting to VerticalFillableTankIcon for now
    case TankType.RectangularBox:
    case TankType.SphericalTank:
      return (
        <VerticalFillableTankIcon
          color={color}
          percentFull={percentFull}
          importanceLevel={importanceLevel}
        />
      );
    case TankType.TotalizedTank:
      return (
        <TotalizedFillableTankIcon
          color={color}
          percentFull={percentFull}
          importanceLevel={importanceLevel}
        />
      );
    default:
      return (
        <VerticalFillableTankIcon
          color={color}
          percentFull={percentFull}
          importanceLevel={importanceLevel}
        />
      );
  }
};
interface RenderDataChannelLevelIconProps {
  inventoryStatus?: EventInventoryStatusType | EventRuleInventoryStatus | null;
  tankFillPercentage?: number | null;
  decimalPlaces?: number;
  tankType?: TankType | TankTypeEnum | null;
  hidePercentFullText?: boolean;
  importanceLevel?:
    | EventImportanceLevelType
    | EventRuleImportanceLevel
    | undefined
    | null;
}

export const DataChannelLevelIcon = ({
  inventoryStatus,
  tankFillPercentage,
  tankType,
  hidePercentFullText,
  importanceLevel,
}: RenderDataChannelLevelIconProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  let percentFullAsText = t('ui.common.notapplicable', 'N/A');
  if (isNumber(tankFillPercentage)) {
    const roundedPercent = round(tankFillPercentage!, 1);
    percentFullAsText = `${roundedPercent} %`;
  }

  const color = getTankColorForInventoryStatus(
    inventoryStatus,
    theme.palette.type
  );

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {renderTankTypeIcon(
          color,
          tankType,
          tankFillPercentage,
          importanceLevel
        )}
      </div>
      {!hidePercentFullText && (
        <div aria-label="Data channel level value" style={{ marginTop: 4 }}>
          <TankPercentText>{percentFullAsText}</TankPercentText>
        </div>
      )}
    </>
  );
};

const CenteredBlock = styled.div`
  display: flex;
  justify-content: center;
`;
interface RenderDataChannelIconOptions {
  hideTankPercentFullText?: boolean;
}

export const renderDataChannelIcon = (
  dataChannel: DataChannelDTO | null | undefined,
  options?: RenderDataChannelIconOptions
) => {
  const renderIcon = () => {
    switch (dataChannel?.dataChannelTypeId) {
      case DataChannelCategory.TotalizedLevel:
      case DataChannelCategory.Level: {
        const inventoryStatus = getHighestPriorityEventRuleInventoryStatus(
          dataChannel.uomParams?.eventRules
        );
        return (
          <DataChannelLevelIcon
            importanceLevel={dataChannel?.eventImportanceLevel}
            inventoryStatus={inventoryStatus}
            tankFillPercentage={
              dataChannel.uomParams?.latestReadingValueInPercentFull
            }
            decimalPlaces={dataChannel?.uomParams?.decimalPlaces}
            tankType={dataChannel.tankType}
            hidePercentFullText={options?.hideTankPercentFullText}
          />
        );
      }
      case DataChannelCategory.Pressure:
        return (
          <CenteredBlock>
            <DynamicPressureGauge
              value={dataChannel.uomParams?.latestReadingValue}
              min={dataChannel.uomParams?.graphMin}
              max={dataChannel.uomParams?.graphMax}
            />
          </CenteredBlock>
        );
      case DataChannelCategory.BatteryVoltage:
        return <BatteryIcon />;
      case DataChannelCategory.VirtualChannel:
        return <VirtualIcon />;
      case DataChannelCategory.SignalStrength:
        return (
          <DynamicSignalStrengthIcon
            value={dataChannel.uomParams?.latestReadingValue}
            min={dataChannel.uomParams?.graphMin}
            max={dataChannel.uomParams?.graphMax}
          />
        );
      case DataChannelCategory.RtuCaseTemperature:
      case DataChannelCategory.Temperature:
        return (
          <DynamicThermometerIcon
            value={dataChannel.uomParams?.latestReadingValue}
            min={dataChannel.uomParams?.graphMin}
            max={dataChannel.uomParams?.graphMax}
          />
        );
      case DataChannelCategory.DigitalInput:
        return (
          <DynamicDigitalInputTextBox
            value={dataChannel.uomParams?.latestReadingValue}
            stateZeroText={dataChannel.digitalState0Text}
            stateOneText={dataChannel.digitalState1Text}
            stateTwoText={dataChannel.digitalState2Text}
            stateThreeText={dataChannel.digitalState3Text}
          />
        );
      case DataChannelCategory.Counter:
        return (
          <DynamicDigitalCounter
            value={dataChannel.uomParams?.latestReadingValue}
          />
        );
      case DataChannelCategory.Rtu:
        return <RTUIcon />;
      case DataChannelCategory.RateOfChange:
        return <UsageRateIcon />;
      case DataChannelCategory.Gps:
        return <GPSIcon />;
      case DataChannelCategory.ChargeCurrent:
        return <ChargeCurrentIcon />;
      case DataChannelCategory.Diagnostic:
        return <DiagnosticIcon />;
      case DataChannelCategory.FlowMeter:
        return <FlowMeterIcon />;
      case DataChannelCategory.OtherAnalog:
        return <OtherAnalogIcon />;
      case DataChannelCategory.Shock:
        return <ShockIcon />;
      case DataChannelCategory.None:
        return <OtherAnalogIcon />;
      default:
        return <OtherAnalogIcon />;
    }
  };

  return (
    <RenderedDataChannelIconWrapper>
      {renderIcon()}
    </RenderedDataChannelIconWrapper>
  );
};

interface GetRowColourProps {
  eventInventoryStatus:
    | EventInventoryStatusType
    | EventRuleInventoryStatus
    | undefined
    | null;
  eventImportanceLevel:
    | EventImportanceLevelType
    | EventRuleImportanceLevel
    | undefined
    | null;
  hasMissingData: boolean | undefined;
  themeType?: string;
}

export const getRowColour = ({
  eventInventoryStatus,
  eventImportanceLevel,
  hasMissingData,
  themeType,
}: GetRowColourProps) => {
  const isEventInventoryStatusDefined = isNumber(eventInventoryStatus);

  if (hasMissingData) {
    return missingDataColor;
  }

  if (isEventInventoryStatusDefined) {
    if (themeType !== 'dark') {
      switch (eventInventoryStatus) {
        case EventInventoryStatusType.Critical:
          return criticalColor;
        case EventInventoryStatusType.Empty:
          return emptyColor;
        case EventInventoryStatusType.Reorder:
          return reorderColor;
        case EventInventoryStatusType.Full:
          return fullColor;
        default:
          break;
      }
    }
    switch (eventInventoryStatus) {
      case EventInventoryStatusType.Critical:
        return criticalColorDark;
      case EventInventoryStatusType.Empty:
        return emptyColorDark;
      case EventInventoryStatusType.Reorder:
        return reorderColorDark;
      case EventInventoryStatusType.Full:
        return fullColorDark;
      default:
        break;
    }
  }

  if (
    eventInventoryStatus === EventInventoryStatusType.UserDefined ||
    !isEventInventoryStatusDefined
  ) {
    switch (eventImportanceLevel) {
      case EventImportanceLevelType.Urgent:
        return criticalColor;
      case EventImportanceLevelType.High:
        return userDefinedColor;
      case EventImportanceLevelType.Warning:
        return warningColor;
      case EventImportanceLevelType.Information:
        return informationColor;
      case EventImportanceLevelType.Normal:
        return '';
      default:
        break;
    }
  }

  return '';
};
