import styled from 'styled-components';
import WorldMap from 'assets/images/world-map.png';

// Created a component for this to limit the max-width of the image. The image
// was exported at 2x the size for HiDPI displays. The max width is set based
// on half of the exported width.
const WorldMapImage = styled.img.attrs({
  src: WorldMap,
  alt: 'World map',
})`
  max-width: 591px;
`;

export default WorldMapImage;
