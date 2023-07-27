export interface RowIdentifier {
  rowIndex?: string | null;
  pageIndex?: number | null;
  assetId?: string;
}

export interface RouteState {
  clickedRowIdentifier?: RowIdentifier | null;
  pageNumber?: number;
}
