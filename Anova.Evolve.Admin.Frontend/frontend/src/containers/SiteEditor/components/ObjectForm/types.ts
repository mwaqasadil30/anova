export interface Values {
  siteId?: string;
  domainId?: string;
  siteDescription?: string | null;
  customerName?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  notes?: string | null;
  status?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  isGeoCodeManual?: boolean;
  address1?: string | null;
  address2?: string | null;
  address3?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  timeZoneId?: number | null;
  rtuCount?: number;
  assetCount?: number;
  companyName?: string | null;
  siteNumber?: string | null;
  isReadOnly?: boolean;
  isFromExternalSource?: boolean;
  productClass?: string | null;
}
