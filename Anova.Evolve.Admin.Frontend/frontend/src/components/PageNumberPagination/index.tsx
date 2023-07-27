/* eslint-disable indent */
import { UsePaginationItem } from '@material-ui/lab/Pagination';
import {
  StyledPaginationItem,
  usePaginationItemStyles,
  usePaginationStyles,
} from 'components/pagination/styles';
import findLastIndex from 'lodash/findLastIndex';
import React from 'react';
import styled from 'styled-components';
import { getPaginationLabel } from 'utils/a11y';

const CustomPaginationItem = styled(StyledPaginationItem)`
  && {
    /* Make the beginning and end buttons circular */
    ${(props) =>
      ['first', 'last', 'previous', 'next'].includes(props.type!) &&
      `
      border-radius: 50%;
    `}
  }
`;

export interface Props {
  items: UsePaginationItem[];
}

const PageNumberPagination = ({ items }: Props) => {
  const paginationClasses = usePaginationStyles();
  const paginationItemClasses = usePaginationItemStyles();

  const firstPageItemIndex = items.findIndex((item) => item.type === 'page');
  const lastPageItemIndex = findLastIndex(
    items,
    (item) => item.type === 'page'
  );

  return (
    <nav aria-label="Pagination navigation">
      <ul className={paginationClasses.ul}>
        {items.map(
          (
            { page: pageNumber, type, selected, ...item }: any,
            index: number
          ) => {
            const isStartOrEndType =
              type === 'first' ||
              type === 'last' ||
              type === 'next' ||
              type === 'previous';

            const a11yLabel = getPaginationLabel(type);

            return (
              <li key={index}>
                <CustomPaginationItem
                  type={type}
                  page={pageNumber}
                  selected={selected}
                  {...item}
                  classes={paginationItemClasses}
                  style={{
                    ...(isStartOrEndType && { backgroundColor: 'transparent' }),
                    ...(index === firstPageItemIndex && {
                      borderTopLeftRadius: 5,
                      borderBottomLeftRadius: 5,
                    }),
                    ...(index === lastPageItemIndex && {
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }),
                  }}
                  {...(a11yLabel && { 'aria-label': a11yLabel })}
                />
              </li>
            );
          }
        )}
      </ul>
    </nav>
  );
};

export default PageNumberPagination;
