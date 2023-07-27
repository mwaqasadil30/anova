import { DomainDetailDto } from 'api/admin/api';
import FilterBox from 'components/FilterBox';
import React from 'react';
import { FilterByData, RouteState } from '../../types';
import SearchForm from '../SearchForm';

interface Props {
  handleFilterFormSubmit: (filterData: FilterByData) => void;
  onSelectDomain: (domainOrNull?: DomainDetailDto | null) => void;
  isLoadingOrFetching: boolean;
  includeSubDomain: boolean;
  routeState?: RouteState;
  setIncludeSubDomain: (includeSubDomain: boolean) => void;
  showDeleted: boolean;
  setShowDeletedRTU: (showDeletedRtu: boolean) => void;
  selectedDomain?: DomainDetailDto | null;

  startDate?: Date;
  setStartDate?: React.Dispatch<React.SetStateAction<Date>>;
  endDate?: Date;
  setEndDate?: React.Dispatch<React.SetStateAction<Date>>;
}

const TableOptions = ({
  selectedDomain,
  onSelectDomain,
  handleFilterFormSubmit,
  isLoadingOrFetching,
  includeSubDomain,
  routeState,
  setIncludeSubDomain,
  showDeleted,
  setShowDeletedRTU,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: Props) => {
  return (
    <FilterBox>
      <SearchForm
        routeState={routeState}
        isLoadingOrFetching={isLoadingOrFetching}
        includeSubDomain={includeSubDomain}
        onSubmit={handleFilterFormSubmit}
        selectedDomain={selectedDomain}
        onSelectDomain={onSelectDomain}
        setIncludeSubDomain={setIncludeSubDomain}
        showDeleted={showDeleted}
        setShowDeletedRTU={setShowDeletedRTU}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
    </FilterBox>
  );
};

export default TableOptions;
