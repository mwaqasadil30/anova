/* eslint-disable indent */
import styled from 'styled-components';

const GenericPageWrapper = styled.div<{
  $topOffset: number;
  $isFullPageHeight?: boolean;
}>`
  ${(props) =>
    props.$topOffset &&
    `
    display: flex;
    flex-direction: column;
    ${
      props.$isFullPageHeight &&
      `
    height: calc(100vh - ${props.$topOffset}px - 16px);
    `
    }
  `};
`;

export default GenericPageWrapper;
