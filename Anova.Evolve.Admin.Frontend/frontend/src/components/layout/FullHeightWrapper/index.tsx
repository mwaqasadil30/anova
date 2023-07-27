import React from 'react';
import { selectTopOffset } from 'redux-app/modules/app/selectors';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Wrapper = styled.div`
  ${(props: { $topOffset: number }) =>
    props.$topOffset &&
    `
    display: flex;
    flex-direction: column;
    height: calc(100vh - ${props.$topOffset}px);
    padding: 0;
    `};
`;

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  $topOffset?: number;
}

const FullHeightWrapper = (props: Props) => {
  const topOffset = useSelector(selectTopOffset);
  return <Wrapper $topOffset={topOffset} {...props} />;
};

export default FullHeightWrapper;
