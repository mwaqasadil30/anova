export interface Values {
  sourceDomainId?: string;
  targetDomainId?: string | null;
  transferRTUIds?: string[] | null;
  assetIds?: string[] | null;
  mappedFtpDomainIds?: string[] | null;
  eventRuleGroupMappings?: { [key: string]: number } | null;
  eventRuleMappings?: { [key: string]: number } | null;
  productMappings?: { [key: string]: string } | null;
  tankDimensionMappings?: { [key: string]: string } | null;
  rosterMappings?: { [key: string]: number } | null;
  siteMappings?: { [key: string]: string } | null;
  assetIdMappings?: { [key: string]: string } | null;
  dataChannelMappings?: { [key: string]: string } | null;
  dataChannelTemplateMappings?: { [key: string]: string } | null;
  transferDataChannelReadings?: boolean;
  transferAssetNotes?: boolean;
  transferSiteNotes?: boolean;
  transferCustomPropertyValues?: boolean;
  deleteSourceSiteIfNotUsed?: boolean;
  deleteSourceTankDimensionIfNotUsed?: boolean;
  deleteSourceProductIfNotUsed?: boolean;

  // Not included on the API call
  transferOtherAssetsUsingTheSameRtu?: boolean;
}
