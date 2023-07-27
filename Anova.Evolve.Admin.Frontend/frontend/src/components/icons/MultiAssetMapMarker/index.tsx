import React from 'react';

interface Slice {
  cumulativePercent: number;
  percent: number;
  color: string;
}

interface Props {
  theme: string;
  selected?: boolean | null;
  assetDataChannelsLength: number;
  slices?: Slice[];
  missingData?: boolean | null;
}
const getCoordinatesForPercent = (percent: number) => {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
};
const SvgSlice = ({ percent, color, cumulativePercent }: Slice) => {
  const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
  const endPercent = cumulativePercent + percent;
  const [endX, endY] = getCoordinatesForPercent(endPercent);
  const largeArcFlag = percent > 0.5 ? 1 : 0;
  const pathData = `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`;
  return <path fill={color} d={pathData} style={{ transform: 'scale(0.9)' }} />;
};
const MultiAssetMapMarker = ({
  selected,
  assetDataChannelsLength,
  slices,
  missingData,
  theme,
}: Props) => {
  return (
    <span style={{ position: 'relative' }}>
      <svg
        data-name="map-marker"
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="60"
        viewBox="0 0 40 60"
      >
        <g>
          <path
            d="M40,20c0,11.05-20,40-20,40S0,31.05,0,20a20,20,0,0,1,40,0Z"
            style={{
              fill: theme !== 'dark' ? '#505050' : '#A0A0A0',
            }}
          />

          {!selected ? (
            <circle
              cx="20"
              cy="19.56"
              r="16"
              style={{ fill: theme !== 'dark' ? '#fff' : '#666666' }}
            />
          ) : (
            <circle cx="20" cy="20" r="10" style={{ fillOpacity: 0.2 }} />
          )}
        </g>
      </svg>
      {!selected && (
        <svg
          data-name="map-marker"
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="-1 -1 2 2"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: '-46px',
          }}
        >
          <g>
            <circle cx="0" cy="0" r="0.975" style={{ fill: '#fff' }} />
            {slices?.map((slice, key) => (
              <SvgSlice
                key={key}
                percent={slice.percent}
                color={slice.color}
                cumulativePercent={slice.cumulativePercent}
              />
            ))}
            <circle cx="0" cy="0" r="0.6875" style={{ fill: '#fff' }} />
            {missingData && (
              <circle
                cx="0"
                cy="0.5125"
                r="0.125"
                style={{ fill: '#DD4534' }}
              />
            )}
            {!selected && (
              <text
                x="0"
                y="0"
                dominantBaseline="middle"
                textAnchor="middle"
                fill="#505050"
                style={{
                  fontSize: '1px',
                  fontWeight: 600,
                  fontFamily: 'Work Sans',
                }}
              >
                {assetDataChannelsLength > 9
                  ? '9+'
                  : `${assetDataChannelsLength}`}
              </text>
            )}
          </g>
        </svg>
      )}
    </span>
  );
};

export default MultiAssetMapMarker;
