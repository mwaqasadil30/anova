import { EditTree, DataChannelType } from 'api/admin/api';

export interface Values {
  name: string;
  id: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  selectedDataChannelTypes: string;
  expression?: string;
  dataChannelTypes?: DataChannelType[];
  customDomainPropertyTypes?: EditTree['domainCustomPropertyList'];
}
