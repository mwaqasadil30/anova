import DefaultLogo from 'components/icons/Logo';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';

// TODO: large and regular logo sizes are the same for the time being for a
// quick deployment
// eslint-disable-next-line jsx-a11y/alt-text
const StyledLogo = styled(({ size, ...props }) => <img {...props} />)`
  max-width: ${(props) => (props.size === 'large' ? 123 : 123)}px;
  max-height: ${(props) => (props.size === 'large' ? 60 : 60)}px;
`;

const StyledDefaultLogo = styled(({ size, ...props }) => (
  <DefaultLogo {...props} />
))`
  width: ${(props) => (props.size === 'large' ? 123 : 123)}px;
`;

interface Props extends React.ComponentPropsWithoutRef<any> {
  size?: 'large';
}

const DomainLogo = (props: Props) => {
  const activeDomain = useSelector(selectActiveDomain);
  return activeDomain?.logo ? (
    <StyledLogo
      src={`data:image;base64,${activeDomain.logo}`}
      alt="Logo"
      {...props}
    />
  ) : (
    <StyledDefaultLogo {...props} />
  );
};

export default DomainLogo;
