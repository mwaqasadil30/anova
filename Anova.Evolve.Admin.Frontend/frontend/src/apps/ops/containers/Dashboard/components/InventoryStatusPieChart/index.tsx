import React, { useState } from 'react';
import { EventInventoryStatusType, EvolveInventoryEvent } from 'api/admin/api';
import { buildAssetSummaryLink } from 'apps/ops/utils/routes';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { buildInventoryStatusTypeTextMaping } from 'utils/i18n/enum-to-text';
import renderLegend from './renderLegend';
import renderTooltip from './renderTooltip';
import NoDataFound from '../NoDataFound';

// TODO: The colours were shifted since the figma design has only 5 colours
// instead of the 6 used from the Vue app
const INVENTORY_COLORS = {
  fullColor: 'rgb(43, 149, 248)',
  reorderColor: 'rgb(76, 160, 47)',
  criticalColor: 'rgb(239, 57, 42)',
  emptyColor: 'rgb(55, 55, 55)',
  userDefinedColor: 'rgb(255, 226, 104)',
  normalColor: 'rgb(76, 160, 47)',

  // 50% alpha colors based on actual colors
  fullColorAlpha: 'rgba(43, 149, 248, 0.25)',
  reorderColorAlpha: 'rgba(76, 160, 47, 0.25)',
  criticalColorAlpha: 'rgba(239, 57, 42, 0.25)',
  emptyColorAlpha: 'rgba(55, 55, 55, 0.25)',
  userDefinedColorAlpha: 'rgba(255, 226, 104, 0.25)',
  normalColorAlpha: 'rgba(76, 160, 47, 0.25)',
};

const getInventoryStateColor = (inventoryState?: string | null) => {
  switch (inventoryState) {
    case 'Full':
      return INVENTORY_COLORS.fullColor;
    case 'Reorder':
      return INVENTORY_COLORS.reorderColor;
    case 'Critical':
      return INVENTORY_COLORS.criticalColor;
    case 'Empty':
      return INVENTORY_COLORS.emptyColor;
    case 'Normal':
      return INVENTORY_COLORS.normalColor;
    default:
      return INVENTORY_COLORS.userDefinedColor;
  }
};

const getLabelForInventoryLevelCount = (
  levelCountName: string,
  textMapping: Record<EventInventoryStatusType, string>
) => {
  switch (levelCountName) {
    case 'fullCount':
      return textMapping[EventInventoryStatusType.Full];
    case 'emptyCount':
      return textMapping[EventInventoryStatusType.Empty];
    case 'criticalCount':
      return textMapping[EventInventoryStatusType.Critical];
    case 'reorderCount':
      return textMapping[EventInventoryStatusType.Reorder];
    default:
      return '';
  }
};

const formatData = (
  data: EvolveInventoryEvent,
  inventoryStatusTypeTextMapping: Record<EventInventoryStatusType, string>
) => {
  return Object.entries(data).map(([key, value]) => {
    const name = getLabelForInventoryLevelCount(
      key,
      inventoryStatusTypeTextMapping
    );

    return {
      name,
      value: value || 0,
    };
  });
};

interface Props {
  data: EvolveInventoryEvent;
}

const InventoryStatusPieChart = ({ data }: Props) => {
  const { t } = useTranslation();
  const history = useHistory();

  const inventoryStatusTypeTextMapping = buildInventoryStatusTypeTextMaping(t);
  const chartData = formatData(data, inventoryStatusTypeTextMapping);

  const hasAtLeastOneTotal = chartData.some((datum) => datum.value > 0);

  const [cellOpacity, setCellOpacity] = useState(() => {
    return Object.keys(data).reduce((prev, currentKey) => {
      // @ts-ignore
      prev[currentKey] = 1;
      return prev;
    }, {});
  });

  const handleMouseEnter = (key: string) => {
    setCellOpacity((prevState) => ({
      ...prevState,
      [key]: 0.5,
    }));
  };

  const handleMouseLeave = (key: string) => {
    setCellOpacity((prevState) => ({
      ...prevState,
      [key]: 1,
    }));
  };

  if (!hasAtLeastOneTotal) {
    return <NoDataFound />;
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={chartData}
          labelLine={false}
          outerRadius={80}
          dataKey="value"
          onClick={(entry) => {
            history.push(
              buildAssetSummaryLink({ inventoryStatusLevel: entry.name })
            );
          }}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getInventoryStateColor(entry.name)}
              // @ts-ignore
              opacity={cellOpacity[entry.name!] || 1}
              onMouseEnter={() => handleMouseEnter(entry.name!)}
              onMouseLeave={() => handleMouseLeave(entry.name!)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </Pie>
        <Legend
          // TODO: May need to customize these props based on the viewport size
          // layout="vertical"
          // verticalAlign="top"
          // align="right"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          content={renderLegend}
        />
        <Tooltip content={renderTooltip} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default InventoryStatusPieChart;
