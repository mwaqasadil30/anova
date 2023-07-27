import { usePagination } from '@material-ui/lab/Pagination';
import { AssetMapInfo } from 'api/admin/api';
import { useState } from 'react';
import { PaginateAssetsHookData } from './types';

interface Props {
  assets?: AssetMapInfo[] | null;
  initialPageNumber?: number;
}

const usePaginateAssets = ({
  assets,
  initialPageNumber,
}: Props): PaginateAssetsHookData => {
  const pageSize = 20;
  const [pageNumber, setPageNumber] = useState(initialPageNumber || 1);
  const pageIndex = pageNumber - 1;

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPageNumber(newPage);
  };

  const paginationStartIndex = pageIndex * pageSize;
  const paginationEndIndex = pageIndex * pageSize + pageSize;
  const paginatedAssets = assets?.slice(
    paginationStartIndex,
    paginationEndIndex
  );

  const totalRecords = assets?.length || 0;
  const { items } = usePagination({
    showFirstButton: false,
    showLastButton: false,
    boundaryCount: 0,
    siblingCount: 0,
    count: Math.ceil(totalRecords / pageSize),
    page: pageNumber,
    onChange: handleChangePage,
  });

  const startRange = totalRecords === 0 ? 0 : pageIndex * pageSize + 1;
  const endRange =
    totalRecords !== -1
      ? Math.min(totalRecords, pageNumber * pageSize)
      : pageNumber * pageSize;

  return {
    pageNumber,
    startRange,
    endRange,
    totalRecords,
    pageControlItems: items,
    paginatedRecords: paginatedAssets,
    setPageNumber,
  };
};

export default usePaginateAssets;
