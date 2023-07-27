import { UsePaginationItem } from '@material-ui/lab/Pagination';
import {
  AssetMapInfo,
  EvolveAssetLocationDto,
  EvolveInventoryState,
} from 'api/admin/api';

export interface MapFiltersData {
  inventoryStates: EvolveInventoryState[];
  filterButtonActiveMapping: Record<string, boolean | undefined>;
  inventoryStateCountMapping: Record<string, number | undefined>;
  filteredMapRecords: EvolveAssetLocationDto[] | undefined;
  getSiteForAssetId: (assetId?: string) => EvolveAssetLocationDto | null;
  setFilterButtonActiveMapping: React.Dispatch<
    React.SetStateAction<Record<string, boolean | undefined>>
  >;
  selectAllInventoryStates: () => void;
  deselectAllInventoryStates: () => void;
}

export interface PaginateAssetsHookData {
  pageNumber: number;
  startRange: number;
  endRange: number;
  totalRecords: number;
  pageControlItems: UsePaginationItem[];
  paginatedRecords?: AssetMapInfo[] | undefined;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}
