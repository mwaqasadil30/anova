import React from 'react';
import {
  EventImportanceLevelType,
  EventRuleImportanceLevel,
} from 'api/admin/api';
import GenericModernFillableTankIcon from '../GenericModernFillableTankIcon';

interface Props {
  color: string;
  percentFull: number | null | undefined;
  importanceLevel?:
    | EventImportanceLevelType
    | EventRuleImportanceLevel
    | undefined
    | null;
}

const HorizontalFillableTankIcon = ({
  color,
  percentFull,
  importanceLevel,
}: Props) => {
  return (
    <GenericModernFillableTankIcon
      color={color}
      percentFull={percentFull}
      importanceLevel={importanceLevel}
      height={24}
      width={37}
    />
  );
};

export default HorizontalFillableTankIcon;
