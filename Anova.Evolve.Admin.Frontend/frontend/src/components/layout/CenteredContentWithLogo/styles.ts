import CircularProgress from 'components/CircularProgress';
import Link from 'components/Link';
import PageHeader from 'components/PageHeader';
import styled from 'styled-components';
import { getCustomDomainContrastText } from 'styles/colours';

export const StyledPageHeader = styled(PageHeader)`
  && {
    color: ${(props) => props.theme.palette.text.secondary};
  }
`;

export const StyledCircularProgress = styled(CircularProgress)`
  color: ${(props) =>
    getCustomDomainContrastText(props.theme.custom.domainColor)};
  margin-right: 16px;
`;

export const StyledLink = styled(Link)`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.palette.text.secondary};
`;

// Box to add spacing around fields that have the error helper text appear
// under them (eg: "Password is required"). This is to prevent the content from
// being shifted so the user can click on the Back button once, instead of
// clicking on it twice (the first one to blur the field, which would've moved
// the Back button away from the user's mouse b/c of the validation error, the
// second one to click on where the Back button moved).
export const SpacedBoxToHandleErrorHelperText = styled.div`
  display: flex;
  align-items: center;
  min-height: 70px;
`;
