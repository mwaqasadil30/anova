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

const VerticalFillableTankIcon = ({
  color,
  percentFull,
  importanceLevel,
}: Props) => {
  return (
    <GenericModernFillableTankIcon
      color={color}
      percentFull={percentFull}
      importanceLevel={importanceLevel}
      height={39}
      width={27}
    />
  );
};

export default VerticalFillableTankIcon;
