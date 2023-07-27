export interface Values {
  id?: string;
  name?: string;
  logo?: string;
  parentDomainId?: string;

  domainHeliumIsoContainer: {
    themeColor?: string;
    hasIsoContainer?: boolean;
    isoContainerDefaultSiteId?: string;
    isoContainerDefaultHeliumEventGroupId?: string;
    isoContainerDefaultHeliumProductId?: string;
    isoContainerDefaultHeliumLevelDCTemplateId?: string;
    isoContainerDefaultHeliumPressureDCTemplateId?: string;
    isoContainerDefaultHeliumPressureRoCDCTemplateId?: string;
    isoContainerDefaultNitrogenEventGroupId?: string;
    isoContainerDefaultNitrogenProductId?: string;
    isoContainerDefaultNitrogenLevelDCTemplateId?: string;
    isoContainerDefaultNitrogenPressureDCTemplateId?: string;
    dataChannelsDisplayPriority: number[];
  };

  domainNotes?: string;
}
