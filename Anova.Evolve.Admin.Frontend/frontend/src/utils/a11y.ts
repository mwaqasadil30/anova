import { UsePaginationItem } from '@material-ui/lab/Pagination';

export const getPaginationLabel = (type: UsePaginationItem['type']) => {
  switch (type) {
    case 'first':
      return 'First page';
    case 'last':
      return 'Last page';
    case 'next':
      return 'Next page';
    case 'previous':
      return 'Previous page';
    default:
      return '';
  }
};
