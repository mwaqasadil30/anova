/* eslint-disable indent */
import Tooltip from '@material-ui/core/Tooltip';
import LinkIcon from '@material-ui/icons/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { white } from 'styles/colours';
import { darkTheme } from 'styles/theme';
import { isNumber } from 'utils/format/numbers';

const StyledCircle = styled.div<{
  $circleBackgroundColor: string;
  $iconColor: string;
}>`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${(props) => props.$circleBackgroundColor};
  color: ${(props) => props.$iconColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: inline-block;
`;

const StyledIcon = styled.svg`
  font-size: 21px;
`;

const StyledTooltip = styled((props) => (
  <Tooltip arrow classes={{ popper: props.className }} {...props} />
))`
  & .MuiTooltip-tooltip {
    background-color: ${darkTheme.palette?.background?.paper};
    color: ${darkTheme.palette?.text?.primary};
    font-size: 14px;
    padding: 8px 16px;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  }
  & .MuiTooltip-arrow {
    color: ${darkTheme.palette?.background?.paper};
  }
`;

interface Props {
  isSetpointUpdateSupported?: boolean;
  isLinkedToEventRule?: boolean;
  rtuChannelSetpointIndex?: number | null;
}

const RTUSyncIcon = ({
  isSetpointUpdateSupported,
  isLinkedToEventRule,
  rtuChannelSetpointIndex,
}: Props) => {
  const { t } = useTranslation();

  const isRtuChannelSetpointIndexSet = isNumber(rtuChannelSetpointIndex);

  const rtuSyncIconDetails = () => {
    if (isLinkedToEventRule) {
      return {
        tooltipText: t(
          'ui.assetDetailEvents.eventRuleIsLinkedToEventRuleGroup',
          'Unable to edit event rule. Event rule is linked to the event rule group.'
        ),
        circleBackgroundColor: '#DD4534',
        iconColor: white,
        icon: LockOutlinedIcon,
      };
    }

    if (
      !isLinkedToEventRule &&
      isSetpointUpdateSupported &&
      isRtuChannelSetpointIndexSet
    ) {
      return {
        tooltipText: t(
          'ui.assetDetailEvents.setpointIndex',
          'Event rule is linked to RTU Setpoint. Setpoint index: {{setpointIndex}}',
          { setpointIndex: rtuChannelSetpointIndex }
        ),
        circleBackgroundColor: '#3BB573',
        iconColor: white,
        icon: LinkIcon,
      };
    }

    if (
      !isLinkedToEventRule &&
      !isSetpointUpdateSupported &&
      isRtuChannelSetpointIndexSet
    ) {
      return {
        tooltipText: t(
          'ui.assetDetailEvents.notLinkedToRtuSetpoint',
          'Unable to edit event rule.  Setpoint is linked to an RTU Category not currently supported.'
        ),
        circleBackgroundColor: '#FFA500',
        iconColor: white,
        icon: LinkIcon,
      };
    }

    return {
      tooltipText: t(
        'ui.assetDetailEvents.noRtuSetpointDefined',
        'No RTU Setpoint defined.'
      ),
      circleBackgroundColor: '#d4d4d4',
      iconColor: '#696969',
      icon: LinkIcon,
    };
  };

  const details = rtuSyncIconDetails();

  return (
    <Wrapper>
      <StyledTooltip title={details.tooltipText} placement="top">
        <StyledCircle
          $circleBackgroundColor={details.circleBackgroundColor}
          $iconColor={details.iconColor}
        >
          <StyledIcon as={details.icon} />
        </StyledCircle>
      </StyledTooltip>
    </Wrapper>
  );
};

export default RTUSyncIcon;
