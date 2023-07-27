import { UsePaginationItem } from '@material-ui/lab/Pagination';
import {
  StyledPaginationItem,
  usePaginationItemStyles,
  usePaginationStyles,
} from 'components/pagination/styles';
import React from 'react';
import { getPaginationLabel } from 'utils/a11y';

interface Props {
  items: UsePaginationItem[];
}

const SimplePagination = ({ items }: Props) => {
  const paginationClasses = usePaginationStyles();
  const paginationItemClasses = usePaginationItemStyles();
  return (
    <nav aria-label="Pagination navigation">
      <ul className={paginationClasses.ul}>
        {items
          .filter(
            (item: UsePaginationItem) =>
              item.type === 'previous' || item.type === 'next'
          )
          .map(
            (
              { page: pageNumber, type, selected, ...item }: UsePaginationItem,
              index: number
            ) => {
              const a11yLabel = getPaginationLabel(type);

              return (
                <li key={index}>
                  <StyledPaginationItem
                    type={type}
                    page={pageNumber}
                    selected={selected}
                    {...item}
                    classes={paginationItemClasses}
                    style={{ backgroundColor: 'transparent' }}
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

export default SimplePagination;
