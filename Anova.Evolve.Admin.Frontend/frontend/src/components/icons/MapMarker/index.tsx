import React from 'react';

interface Props {
  assetFillLevel?: string | null;
  color: string;
  selected?: boolean | null;
  missingData?: boolean | null;
}

const MapMarker = ({ color, selected, assetFillLevel, missingData }: Props) => {
  return (
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
            fill: color,
          }}
        />

        {!selected ? (
          <circle cx="20" cy="19.56" r="16" style={{ fill: '#fff' }} />
        ) : (
          <circle cx="20" cy="20" r="10" style={{ fillOpacity: 0.2 }} />
        )}
        {!selected && missingData && (
          <circle cx="20" cy="28" r="2" style={{ fill: '#DD4534' }} />
        )}
        {!selected && (
          <text
            x="50%"
            y="33%"
            dominantBaseline="middle"
            textAnchor="middle"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'Work Sans',
            }}
          >
            {assetFillLevel}
          </text>
        )}
      </g>
    </svg>
  );
};

export default MapMarker;
