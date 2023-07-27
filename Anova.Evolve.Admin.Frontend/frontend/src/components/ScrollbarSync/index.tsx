import React from 'react';

interface Props {
  syncScrollbarRef: React.RefObject<HTMLDivElement>;
  height: number;
  width: number;
}

/**
 * An additional scrollbar to be synced up with another. Used for virtualizing
 * content.
 */
const ScrollbarSync = ({ syncScrollbarRef, height, width }: Props) => {
  return (
    <div
      ref={syncScrollbarRef}
      style={{
        position: 'absolute',
        overflowY: 'auto',
        top: 0,
        bottom: 0,
        right: 0,
        zIndex: 2,
        // On macOS with the trackpad, the default scrollbar width is calculated as
        // 0px which causes this scrollbar to be cut off a bit. Use a 15 pixel width
        // as a minimum for the scrollbar width if this happens.
        width: width < 15 ? 15 : width,
      }}
    >
      <div style={{ height, width: '100%' }}>&nbsp;</div>
    </div>
  );
};

export default ScrollbarSync;
