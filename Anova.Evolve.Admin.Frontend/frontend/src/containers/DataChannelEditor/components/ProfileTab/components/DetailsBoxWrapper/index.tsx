import styled from 'styled-components';

const DetailsBoxWrapper = styled.div`
  & > :not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

export default DetailsBoxWrapper;
