/* eslint-disable indent */
import { css } from 'styled-components';
import {
  gray200,
  tableHeaderBorderColor,
  tableHeaderColor,
  white,
} from 'styles/colours';

export const commonTableHeadAndFooterCellStyles = css`
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  text-transform: uppercase;
  color: ${(props) => props.theme.palette.text.primary};
`;

export const commonTableHeadAndFooterStyles = css`
  &,
  & > tr > th.MuiTableCell-stickyHeader,
  & > .MuiTableRow-root > .MuiTableCell-stickyHeader {
    background: ${(props) =>
      props.theme.palette.type === 'light' ? '#EBEBEB' : tableHeaderColor};
  }

  /* Change text and checkbox colour in table headers */
  && > tr > th,
  & > tr > th .MuiCheckbox-root,
  && > .MuiTableRow-root > .MuiTableCell-head,
  & > .MuiTableRow-root > .MuiTableCell-head .MuiCheckbox-root {
    color: ${(props) =>
      props.theme.palette.type === 'light'
        ? props.theme.palette.text.secondary
        : white};
  }

  & > tr > th .MuiTableSortLabel-active,
  & > tr > th .MuiTableSortLabel-root:hover,
  & > tr > th .MuiTableSortLabel-root:focus,
  & > .MuiTableRow-root > .MuiTableCell-head .MuiTableSortLabel-active,
  & > .MuiTableRow-root > .MuiTableCell-head .MuiTableSortLabel-root:hover,
  & > .MuiTableRow-root > .MuiTableCell-head .MuiTableSortLabel-root:focus {
    color: ${(props) =>
      props.theme.palette.type === 'light' ? '#5a5a5a' : gray200};
    & .MuiTableSortLabel-icon {
      color: ${(props) =>
        props.theme.palette.type === 'light' ? '#5a5a5a' : gray200} !important;
    }
  }

  & > tr > th:not(:last-child),
  & > .MuiTableRow-root > .MuiTableCell-head:not(:last-child) {
    border-right: 1px solid
      ${(props) =>
        props.theme.palette.type === 'light'
          ? 'rgba(0, 0, 0, 0.15)'
          : tableHeaderBorderColor};
  }
`;
