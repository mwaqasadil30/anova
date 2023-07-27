import { ReactComponent as TotalizedTankGrayBGIcon } from 'assets/icons/fillable-totalized-gray-tank.svg';
import React from 'react';
import styled from 'styled-components';
import {
  EventImportanceLevelType,
  EventRuleImportanceLevel,
} from 'api/admin/api';
import GenericModernFillableTankIcon from '../GenericModernFillableTankIcon';

const StyledTotalizedFillableGrayBGTankIcon = styled(TotalizedTankGrayBGIcon)`
  position: absolute;
  right: 7px;
  bottom: 8px;
  color: ${(props) =>
    props.theme.palette.type === 'dark' ? '#9c9c9c' : '#C0C0C0'};
`;

const CenteredBlock = styled.div`
  display: flex;
  justify-content: center;
`;

const DimensionsWrapper = styled.div`
  position: relative;
  width: 49px;
  height: 48px;
`;

const FrontTankPositioning = styled.div`
  position: absolute;
  left: 7px;
  bottom: 2px;
`;

interface Props {
  color: string;
  percentFull: number | null | undefined;
  importanceLevel?:
    | EventImportanceLevelType
    | EventRuleImportanceLevel
    | undefined
    | null;
}

const TotalizedFillableTankIcon = ({
  color,
  percentFull,
  importanceLevel,
}: Props) => {
  return (
    <CenteredBlock>
      <DimensionsWrapper>
        <StyledTotalizedFillableGrayBGTankIcon />
        <FrontTankPositioning>
          <GenericModernFillableTankIcon
            color={color}
            percentFull={percentFull}
            importanceLevel={importanceLevel}
            height={34}
            width={27}
          />
        </FrontTankPositioning>
      </DimensionsWrapper>
    </CenteredBlock>
  );
};

export default TotalizedFillableTankIcon;
