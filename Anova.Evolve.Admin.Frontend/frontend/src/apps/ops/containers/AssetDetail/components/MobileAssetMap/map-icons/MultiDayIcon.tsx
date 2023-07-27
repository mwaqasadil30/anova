import React from 'react';

interface Props {
  color: string;
  bearing: number;
}

const MultiDayIcon = ({ color, bearing }: Props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="23.82"
      height="19.25"
      viewBox="0 0 23.82 19.25"
    >
      <circle
        cx="9.5"
        cy="9.5"
        r="8.75"
        fill={color}
        stroke="#fff"
        strokeWidth="1.5"
      />
      <circle
        cx="14.32"
        cy="9.75"
        r="8.75"
        fill={color}
        stroke="#fff"
        strokeWidth="1.5"
      />
      {(bearing || bearing === 0) && (
        <path
          d="M20.53,14l-1.17,1.19L16.22,12l-3.14,3.21L11.91,14l4.3-4.4Z"
          transform={`translate(-1.9 -2.68) rotate(${bearing}, 16, 12.5)`}
          fill="#fff"
          fillRule="evenodd"
        />
      )}
    </svg>
  );
};

export default MultiDayIcon;
