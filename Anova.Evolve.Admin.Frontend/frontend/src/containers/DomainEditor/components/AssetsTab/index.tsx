import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import {
  DataChannelTemplateDetail,
  DataChannelType,
  EventRuleGroupInfo,
  HeliumISOContainerDataChannelTemplate,
  ProductDetail,
  SiteInfoRecord,
} from 'api/admin/api';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import ProductAutocompleteLegacy from 'components/forms/form-fields/ProductAutocompleteLegacy';
import SiteAutocomplete from 'components/forms/form-fields/SiteAutocomplete';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import PageSubHeader from 'components/PageSubHeader';
import Tab from 'components/Tab';
import Tabs from 'components/Tabs';
import { Field, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUserId } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { boxBorderColor, gray900 } from 'styles/colours';
import DisplayPriorityField from '../DisplayPriorityField';
import { DisplayPriorityItem } from '../DisplayPriorityField/types';
import { Values } from '../ObjectForm/types';

const formatDisplayPrioritiesForForm = (
  displayPriorities: DisplayPriorityItem[]
) => {
  return displayPriorities.map((priority) => priority.id);
};

const BoxWithBorder = styled(Box)`
  border: 1px solid ${(props) => props.theme.custom.palette.table.borderColor};
  background-color: ${(props) => props.theme.palette.background.paper};
  && {
    color: ${(props) => props.theme.palette.text.primary};
  }
`;

const BoxWithDefaultBg = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
  border-right: 1px solid
    ${(props) => props.theme.custom.palette.table.borderColor};
`;

const StyledTab = styled(Tab)`
  text-align: left;
  font-size: 14px;
  padding: ${(props) => props.theme.spacing(1.5, 2.5)};
  margin-right: 0;
  border-right: 1px solid ${boxBorderColor};

  && {
    color: ${(props) => props.theme.palette.text.primary};
  }

  &.Mui-selected {
    border-right: 0;
  }

  & .MuiTab-wrapper {
    align-items: flex-start;
  }
`;

const StyledTabs = styled(Tabs)`
  width: 100%;
  & .MuiTabs-indicator {
    left: 0;
    background-color: ${gray900};
    width: 5px;
  }

  & .MuiTab-root:not(:last-child) {
    border-bottom: 1px solid ${boxBorderColor};
  }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={4}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `vertical-asset-tab-${index}`,
    'aria-controls': `vertical-asset-tabpanel-${index}`,
  };
}

const getDefaultValue = (
  currentIdValue: string | undefined | null,
  defaultIdValue: string | undefined | null,
  currentValue: any,
  defaultValue: any
) => {
  return currentIdValue === defaultIdValue ? defaultValue : currentValue;
};

const defaultDisplayPriorities: DisplayPriorityItem[] = [];

interface Props {
  // Formik props
  values?: Values;
  setFieldValue: FormikProps<Values>['setFieldValue'];

  // Regular props
  editingDomainId: string;
  isoContainerDefaultSiteInfo?: SiteInfoRecord | null;
  isoContainerDefaultHeliumProductInfo?: ProductDetail | null;
  isoContainerDefaultNitrogenProductInfo?: ProductDetail | null;
  eventRuleGroups: EventRuleGroupInfo[];
  dataChannelTemplates: DataChannelTemplateDetail[];
  selectedHeliumProduct: ProductDetail | null;
  selectedNitrogenProduct: ProductDetail | null;
  selectedDefaultSite: SiteInfoRecord | null;
  heliumISOContainerDataChannel?:
    | HeliumISOContainerDataChannelTemplate[]
    | null;
  setSelectedHeliumProduct: (product: ProductDetail) => void;
  setSelectedNitrogenProduct: (product: ProductDetail) => void;
  setSelectedDefaultSite: (site: SiteInfoRecord) => void;
}

const AssetsTab = ({
  values,
  setFieldValue,
  editingDomainId,
  eventRuleGroups,
  dataChannelTemplates,
  isoContainerDefaultSiteInfo,
  isoContainerDefaultHeliumProductInfo,
  isoContainerDefaultNitrogenProductInfo,
  heliumISOContainerDataChannel,
  selectedHeliumProduct,
  selectedNitrogenProduct,
  selectedDefaultSite,
  setSelectedHeliumProduct,
  setSelectedNitrogenProduct,
  setSelectedDefaultSite,
}: Props) => {
  const { t } = useTranslation();
  const heliumIsoContainerTabTitle = t(
    'enum.assettype.heliumisocontainer_plural',
    'Helium ISO Containers'
  );

  const defaultSiteText = t(
    'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultSiteId.label',
    'Default Site'
  );

  const verticalAssetTabs = [
    {
      label: heliumIsoContainerTabTitle,
      value: 0,
    },
  ];

  const [activeAssetTab, setActiveAssetTab] = useState(0);

  const userId = useSelector(selectUserId);

  const handleSectionChange = (
    event: React.ChangeEvent<{}>,
    newValue: number
  ) => {
    setActiveAssetTab(newValue);
  };

  const handleDisplayPrioritiesChange = (newItems: DisplayPriorityItem[]) => {
    const formattedDisplayPriorities = formatDisplayPrioritiesForForm(newItems);
    setFieldValue(
      'domainHeliumIsoContainer.dataChannelsDisplayPriority',
      formattedDisplayPriorities
    );
  };

  const heliumISOContainerDataChannelMapping: Record<
    number,
    HeliumISOContainerDataChannelTemplate
  > =
    heliumISOContainerDataChannel?.reduce(
      (prev, current) => ({
        ...prev,
        [current.heliumISOContainerDataChannelId!]: current,
      }),
      {}
    ) || {};

  const formattedDisplayPriorities: DisplayPriorityItem[] =
    values?.domainHeliumIsoContainer.dataChannelsDisplayPriority?.map(
      (dataChannelPriorityId) => ({
        id: heliumISOContainerDataChannelMapping[dataChannelPriorityId!]
          .heliumISOContainerDataChannelId!,
        content:
          heliumISOContainerDataChannelMapping[dataChannelPriorityId!]
            .description || '',
      })
    ) || defaultDisplayPriorities;

  const levelDataChannelTemplates = dataChannelTemplates.filter(
    (channel) => channel.dataChannelType === DataChannelType.Level
  );
  const pressureDataChannelTemplates = dataChannelTemplates.filter(
    (channel) => channel.dataChannelType === DataChannelType.Pressure
  );
  const rateOfChangeDataChannelTemplates = dataChannelTemplates.filter(
    (channel) => channel.dataChannelType === DataChannelType.RateOfChange
  );

  // When switching tabs, we need to prevent the initialValue from the API from
  // being used. Without this, if these fields were changed, they would be
  // reset to the initial value when switching tabs and back.
  const initialHeliumProduct = getDefaultValue(
    values?.domainHeliumIsoContainer.isoContainerDefaultHeliumProductId,
    isoContainerDefaultHeliumProductInfo?.productId,
    selectedHeliumProduct,
    isoContainerDefaultHeliumProductInfo
  );
  const initialNitrogenProduct = getDefaultValue(
    values?.domainHeliumIsoContainer.isoContainerDefaultNitrogenProductId,
    isoContainerDefaultNitrogenProductInfo?.productId,
    selectedNitrogenProduct,
    isoContainerDefaultNitrogenProductInfo
  );
  const initialDefaultSite = getDefaultValue(
    values?.domainHeliumIsoContainer.isoContainerDefaultSiteId,
    isoContainerDefaultSiteInfo?.siteId,
    selectedDefaultSite,
    isoContainerDefaultSiteInfo
  );

  return (
    <Grid container spacing={2}>
      <Hidden mdUp>
        <Grid item xs={12}>
          <StyledTextField
            id="activeAssetTab-input"
            select
            label={t(
              'ui.domainEditor.domainHeliumIsoContainer.selectAssetType',
              'Select Asset Type'
            )}
            onChange={(event) =>
              handleSectionChange(event, Number(event.target.value))
            }
            value={activeAssetTab}
          >
            {verticalAssetTabs.map((tab) => (
              <MenuItem key={tab.value} value={tab.value}>
                {tab.label}
              </MenuItem>
            ))}
          </StyledTextField>
        </Grid>
      </Hidden>
      <Grid item xs={12}>
        <BoxWithBorder display="flex">
          <Hidden smDown>
            <Grid container direction="column" style={{ maxWidth: 150 }}>
              <Grid item>
                <StyledTabs
                  orientation="vertical"
                  variant="scrollable"
                  value={activeAssetTab}
                  // @ts-ignore
                  onChange={handleSectionChange}
                  aria-label="Asset tabs"
                >
                  {verticalAssetTabs.map((tab) => (
                    <StyledTab
                      key={tab.label}
                      label={tab.label}
                      {...a11yProps(tab.value)}
                    />
                  ))}
                </StyledTabs>
              </Grid>
              <Grid item style={{ flexGrow: 1 }}>
                <BoxWithDefaultBg height="100%">&nbsp;</BoxWithDefaultBg>
              </Grid>
            </Grid>
          </Hidden>

          <TabPanel value={activeAssetTab} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <PageSubHeader dense>
                  {t(
                    'enum.assettype.heliumisocontainer_plural',
                    'Helium ISO Containers'
                  )}
                </PageSubHeader>
              </Grid>
              <Grid item xs={12}>
                <Field
                  id="domainHeliumIsoContainer.hasIsoContainer-input"
                  name="domainHeliumIsoContainer.hasIsoContainer"
                  component={CheckboxWithLabel}
                  type="checkbox"
                  Label={{
                    label: t(
                      'ui.domainEditor.domainHeliumIsoContainer.hasIsoContainer.label',
                      'Domain has Helium ISO Containers'
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Field
                  id="domainHeliumIsoContainer.isoContainerDefaultSiteId-input"
                  component={SiteAutocomplete}
                  name="domainHeliumIsoContainer.isoContainerDefaultSiteId"
                  label={defaultSiteText}
                  domainId={editingDomainId}
                  userId={userId}
                  initialValue={initialDefaultSite}
                  onChange={setSelectedDefaultSite}
                  textFieldProps={{
                    placeholder: t(
                      'ui.common.enterSearchCriteria',
                      'Enter Search Criteria...'
                    ),
                    label: defaultSiteText,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} lg={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <PageSubHeader dense>
                      {t(
                        'ui.domainEditor.heliumIsoContainers.heliumHeader',
                        'Helium'
                      )}
                    </PageSubHeader>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="domainHeliumIsoContainer.isoContainerDefaultHeliumEventGroupId-input"
                      component={CustomTextField}
                      name="domainHeliumIsoContainer.isoContainerDefaultHeliumEventGroupId"
                      label={t(
                        'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultHeliumEventGroupId.label',
                        'Default Helium Events'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {eventRuleGroups.map((eventRuleGroup) => (
                        <MenuItem
                          value={eventRuleGroup.eventRuleGroupId}
                          key={eventRuleGroup.eventRuleGroupId}
                        >
                          {eventRuleGroup.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="domainHeliumIsoContainer.isoContainerDefaultHeliumProductId-input"
                      component={ProductAutocompleteLegacy}
                      name="domainHeliumIsoContainer.isoContainerDefaultHeliumProductId"
                      freeSolo
                      required
                      domainId={editingDomainId}
                      initialValue={initialHeliumProduct}
                      onChange={setSelectedHeliumProduct}
                      textFieldProps={{
                        placeholder: t(
                          'ui.common.enterSearchCriteria',
                          'Enter Search Criteria...'
                        ),
                        label: t(
                          'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultHeliumProductId.label',
                          'Default Helium Product'
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="domainHeliumIsoContainer.isoContainerDefaultHeliumLevelDCTemplateId-input"
                      component={CustomTextField}
                      name="domainHeliumIsoContainer.isoContainerDefaultHeliumLevelDCTemplateId"
                      label={t(
                        'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultHeliumLevelDCTemplateId.label',
                        'Default Helium Level DC Template'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {levelDataChannelTemplates.map((template) => (
                        <MenuItem
                          value={template.dataChannelTemplateId}
                          key={template.dataChannelTemplateId}
                        >
                          {template.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="domainHeliumIsoContainer.isoContainerDefaultHeliumPressureDCTemplateId-input"
                      component={CustomTextField}
                      name="domainHeliumIsoContainer.isoContainerDefaultHeliumPressureDCTemplateId"
                      label={t(
                        'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultHeliumPressureDCTemplateId.label',
                        'Default Helium Pressure DC Template'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {pressureDataChannelTemplates.map((template) => (
                        <MenuItem
                          value={template.dataChannelTemplateId}
                          key={template.dataChannelTemplateId}
                        >
                          {template.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="domainHeliumIsoContainer.isoContainerDefaultHeliumPressureRoCDCTemplateId-input"
                      component={CustomTextField}
                      name="domainHeliumIsoContainer.isoContainerDefaultHeliumPressureRoCDCTemplateId"
                      label={t(
                        'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultHeliumPressureRoCDCTemplateId.label',
                        'Default Helium Pressure Rate of Change DC Template'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {rateOfChangeDataChannelTemplates.map((template) => (
                        <MenuItem
                          value={template.dataChannelTemplateId}
                          key={template.dataChannelTemplateId}
                        >
                          {template.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={6}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <PageSubHeader dense>
                      {t(
                        'ui.domainEditor.heliumIsoContainers.nitrogenHeader',
                        'Nitrogen'
                      )}
                    </PageSubHeader>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="domainHeliumIsoContainer.isoContainerDefaultNitrogenEventGroupId-input"
                      component={CustomTextField}
                      name="domainHeliumIsoContainer.isoContainerDefaultNitrogenEventGroupId"
                      label={t(
                        'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultNitrogenEventGroupId.label',
                        'Default Nitrogen Events'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {eventRuleGroups.map((eventRuleGroup) => (
                        <MenuItem
                          value={eventRuleGroup.eventRuleGroupId}
                          key={eventRuleGroup.eventRuleGroupId}
                        >
                          {eventRuleGroup.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="domainHeliumIsoContainer.isoContainerDefaultNitrogenProductId-input"
                      component={ProductAutocompleteLegacy}
                      name="domainHeliumIsoContainer.isoContainerDefaultNitrogenProductId"
                      freeSolo
                      required
                      domainId={editingDomainId}
                      initialValue={initialNitrogenProduct}
                      onChange={setSelectedNitrogenProduct}
                      textFieldProps={{
                        placeholder: t(
                          'ui.common.enterSearchCriteria',
                          'Enter Search Criteria...'
                        ),
                        label: t(
                          'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultNitrogenProductId.label',
                          'Default Nitrogen Product'
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="domainHeliumIsoContainer.isoContainerDefaultNitrogenLevelDCTemplateId-input"
                      component={CustomTextField}
                      name="domainHeliumIsoContainer.isoContainerDefaultNitrogenLevelDCTemplateId"
                      label={t(
                        'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultNitrogenLevelDCTemplateId.label',
                        'Default Nitrogen Level DC Template'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {levelDataChannelTemplates.map((template) => (
                        <MenuItem
                          value={template.dataChannelTemplateId}
                          key={template.dataChannelTemplateId}
                        >
                          {template.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      id="domainHeliumIsoContainer.isoContainerDefaultNitrogenPressureDCTemplateId-input"
                      component={CustomTextField}
                      name="domainHeliumIsoContainer.isoContainerDefaultNitrogenPressureDCTemplateId"
                      label={t(
                        'ui.domainEditor.domainHeliumIsoContainer.isoContainerDefaultNitrogenPressureDCTemplateId.label',
                        'Default Nitrogen Pressure DC Template'
                      )}
                      select
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="">
                        <SelectItem />
                      </MenuItem>
                      {pressureDataChannelTemplates.map((template) => (
                        <MenuItem
                          value={template.dataChannelTemplateId}
                          key={template.dataChannelTemplateId}
                        >
                          {template.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <PageSubHeader dense>
                      {t(
                        'ui.domainEditor.heliumIsoContainers.displayPriorityHeader',
                        'Display priority'
                      )}
                    </PageSubHeader>
                  </Grid>
                  <Grid item xs={6}>
                    <DisplayPriorityField<DisplayPriorityItem>
                      id="domainHeliumIsoContainer.dataChannelsDisplayPriority-input"
                      items={formattedDisplayPriorities}
                      onChange={handleDisplayPrioritiesChange}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
        </BoxWithBorder>
      </Grid>
    </Grid>
  );
};

export default AssetsTab;
