import { makeStyles } from '@material-ui/core/styles';
import PaginationItem from '@material-ui/lab/PaginationItem';
import styled from 'styled-components';
import { white } from 'styles/colours';

export const usePaginationStyles = makeStyles({
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
  },
});

export const usePaginationItemStyles = makeStyles({
  root: {
    borderRadius: 0,
    margin: 0,
  },
});

export const StyledPaginationItem = styled(PaginationItem)`
  && {
    ${(props) => `
    background-color: ${props.theme.custom.palette.background.paginationItemInactive};
    color: ${props.theme.palette.text.secondary};
    `};
    font-weight: 600;
    font-size: 12px;
  }

  &&&.Mui-selected {
    ${(props) => `
    background-color: ${props.theme.custom.palette.background.paginationItemActive};
    `};
    color: ${white};
  }
`;
