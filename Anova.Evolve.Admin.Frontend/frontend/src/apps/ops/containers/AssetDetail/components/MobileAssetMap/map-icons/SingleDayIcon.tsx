import React from 'react';

interface Props {
  color: string;
  bearing: number;
}

const SimpleMarker = ({ color, bearing }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      style={{
        transform: `rotate(${bearing}deg)`,
      }}
    >
      <circle
        cx="9.5"
        cy="9.5"
        r="8.75"
        fill={color}
        stroke="#fff"
        strokeWidth="1.5"
      />
      {(bearing || bearing === 0) && (
        <path
          d="M14.31,11.1l-1.17,1.2L10,9.1,6.86,12.31l-1.17-1.2L10,6.7Z"
          transform="translate(-0.5 -0.5)"
          fill="#fff"
          fillRule="evenodd"
        />
      )}
    </svg>
  );
};

export default SimpleMarker;
