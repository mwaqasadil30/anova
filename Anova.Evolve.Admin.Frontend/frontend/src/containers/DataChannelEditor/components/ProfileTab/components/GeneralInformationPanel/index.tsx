/* eslint-disable indent, react/jsx-indent */
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  AssetDeviceType,
  DataChannelCategory,
  DataChannelDataSource,
  DataChannelReportDTO,
} from 'api/admin/api';
import AccordionDetails from 'components/AccordionDetails';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import { StaticAccordion } from 'components/StaticAccordion';
import {
  AdditionalPropertiesAccordion,
  AdditionalPropertiesAccordionDetails,
} from 'containers/DataChannelEditor/styles';
import { IS_DATA_CHANNEL_GENERAL_INFO_EDIT_FEATURE_ENABLED } from 'env';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { canEditDataChannelType } from 'utils/api/helpers';
import {
  BoxTitle,
  StyledAccordionButtonText,
  StyledAccordionSummary,
  StyledAdditionalDetailsAccordionSummary,
  StyledEditButton,
  StyledExpandCaret,
  StyledEditIcon,
} from '../../styles';
import GeneralInformationDrawer from '../GeneralInformationDrawer';
import StyledLabelWithValue from '../StyledLabelWithValue';

const AdditionalPropertiesEditorBox = styled(EditorBox)`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  padding: 0;
  box-shadow: none;
`;

const StyledSerialNumberGrid = styled(Grid)`
  overflow-wrap: break-word;
`;

const AdditionalPropertiesText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledAdditionalPropertiesAccordion = styled(
  AdditionalPropertiesAccordion
)`
  border-top: 0;
`;
const StyledAdditionalPropertiesAccordionDetails = styled(
  AdditionalPropertiesAccordionDetails
)`
  padding-top: 0;
`;

interface Props {
  dataChannelDetails?: DataChannelReportDTO | null;
  canUpdateDataChannel?: boolean;
}

const GeneralInformationPanel = ({
  dataChannelDetails,
  canUpdateDataChannel,
}: Props) => {
  const { t } = useTranslation();

  const [
    isAdditionalPropertiesExpanded,
    setIsAdditionalPropertiesExpanded,
  ] = React.useState(false);

  const handleToggleAdditionalPropertiesAccordion = (
    event: React.ChangeEvent<{}>,
    newExpanded: boolean
  ) => {
    setIsAdditionalPropertiesExpanded(newExpanded);
  };

  const [
    isGeneralInformationDrawerOpen,
    setIsGeneralInformationDrawerOpen,
  ] = useState(false);

  const closeGeneralInformationDrawer = () => {
    setIsGeneralInformationDrawerOpen(false);
  };

  const saveAndExitCallback = () => {
    setIsGeneralInformationDrawerOpen(false);
  };

  const openGeneralInformationDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsGeneralInformationDrawerOpen(true);
  };

  const formattedDataChannelType = dataChannelDetails?.dataChannelTypeAsText
    ? `(${dataChannelDetails?.dataChannelTypeAsText})`
    : '';

  const isGasMixer =
    dataChannelDetails?.assetInfo?.assetTypeId === AssetDeviceType.GasMixer;

  const isHeliumIso =
    dataChannelDetails?.assetInfo?.assetTypeId ===
      AssetDeviceType.HeliumIsoContainer &&
    dataChannelDetails?.dataChannelTypeId === DataChannelCategory.Pressure;

  return (
    <>
      <Drawer
        anchor="right"
        open={isGeneralInformationDrawerOpen}
        onClose={closeGeneralInformationDrawer}
        variant="temporary"
      >
        <DrawerContent>
          <GeneralInformationDrawer
            dataChannelDetails={dataChannelDetails}
            isHeliumIso={isHeliumIso}
            cancelCallback={closeGeneralInformationDrawer}
            saveAndExitCallback={saveAndExitCallback}
          />
        </DrawerContent>
      </Drawer>
      <Grid item xs={12}>
        <StaticAccordion>
          <StyledAccordionSummary>
            <Grid
              container
              alignItems="center"
              spacing={0}
              justify="space-between"
            >
              <Grid item>
                <BoxTitle>
                  {t('ui.common.generalinfo', 'General Information')}
                </BoxTitle>
              </Grid>

              {canUpdateDataChannel &&
                IS_DATA_CHANNEL_GENERAL_INFO_EDIT_FEATURE_ENABLED &&
                // NOTE: Hide edit button for specific data channel types
                canEditDataChannelType(
                  dataChannelDetails?.dataChannelTypeId
                ) && (
                  <Grid item>
                    <StyledEditButton onClick={openGeneralInformationDrawer}>
                      <StyledEditIcon />
                    </StyledEditButton>
                  </Grid>
                )}
            </Grid>
          </StyledAccordionSummary>
          <AccordionDetails
            style={{
              paddingBottom: isGasMixer || isHeliumIso ? 0 : 'default',
            }}
          >
            <Grid container spacing={3}>
              <Grid item md={2} xs={3}>
                <StyledLabelWithValue
                  label={t(
                    'ui.common.datachanneldescription',
                    'Data Channel Description'
                  )}
                  value={dataChannelDetails?.dataChannelDescription}
                />
              </Grid>
              <Grid item md={2} xs={3}>
                <StyledLabelWithValue
                  label={t(
                    'ui.common.datachanneltemplate',
                    'Data Channel Template'
                  )}
                  value={`${dataChannelDetails?.dataChannelTemplateDescription} ${formattedDataChannelType}`}
                />
              </Grid>
              {dataChannelDetails?.dataChannelTypeId ===
                DataChannelCategory.TotalizedLevel && (
                <StyledSerialNumberGrid item md={2} xs={3}>
                  <StyledLabelWithValue
                    label="Serial #"
                    value={dataChannelDetails?.serialNumber}
                  />
                </StyledSerialNumberGrid>
              )}

              {dataChannelDetails?.dataChannelTypeId ===
                DataChannelCategory.Level && (
                <StyledSerialNumberGrid item md={2} xs={3}>
                  <StyledLabelWithValue
                    label="Serial #"
                    value={dataChannelDetails?.serialNumber}
                  />
                </StyledSerialNumberGrid>
              )}
              {dataChannelDetails?.dataSourceInfo
                ?.dataChannelDataSourceTypeId === DataChannelDataSource.RTU && (
                <Grid item md={2} xs={3}>
                  <StyledLabelWithValue
                    label={t('ui.rtu.rtuid', 'RTU ID')}
                    value={
                      dataChannelDetails?.dataSourceInfo?.rtuDataSourceTypeInfo
                        ?.rtuDeviceId
                    }
                  />
                </Grid>
              )}
              {dataChannelDetails?.dataChannelTypeId ===
                DataChannelCategory.TotalizedLevel && (
                <>
                  <Grid item md={2} xs={3}>
                    <StyledLabelWithValue
                      label={t(
                        'ui.dataChannelEditor.dataChannelComponents',
                        'Data Channel Components'
                      )}
                    />
                  </Grid>
                  {dataChannelDetails.dataSourceInfo?.dataChannelDataSourceTypeInfo?.components?.map(
                    (componentInfo) => {
                      return (
                        <Grid
                          item
                          md={2}
                          xs={3}
                          key={componentInfo.dataChannelId}
                        >
                          <StyledLabelWithValue
                            label={componentInfo.description}
                          />
                        </Grid>
                      );
                    }
                  )}
                </>
              )}

              {dataChannelDetails?.dataSourceInfo
                ?.dataChannelDataSourceTypeId === DataChannelDataSource.RTU && (
                <>
                  <Grid item md={2} xs={3}>
                    <StyledLabelWithValue
                      label={t('ui.datachannel.rtuChannelId', 'RTU Channel ID')}
                      value={
                        dataChannelDetails?.dataSourceInfo
                          ?.rtuDataSourceTypeInfo?.rtuChannelNumber
                      }
                    />
                  </Grid>
                  <Grid item md={2} xs={3}>
                    <StyledLabelWithValue
                      label={t(
                        'ui.datachannel.prioritylevel',
                        'Priority Level'
                      )}
                      value={
                        dataChannelDetails?.dataSourceInfo
                          ?.rtuDataSourceTypeInfo?.rtuPriorityLevelTypeAsText
                      }
                    />
                  </Grid>
                </>
              )}
              {dataChannelDetails?.dataSourceInfo
                ?.dataChannelDataSourceTypeId ===
                DataChannelDataSource.Manual && (
                <Grid item md={2} xs={3}>
                  <StyledLabelWithValue
                    label={t('ui.rtu.noRtuConfigured', 'No RTU Configured')}
                    value=""
                  />
                </Grid>
              )}

              {dataChannelDetails?.dataSourceInfo
                ?.dataChannelDataSourceTypeId ===
                DataChannelDataSource.PublishedDataChannel && (
                <>
                  <Grid item md={2} xs={3}>
                    <StyledLabelWithValue
                      label={t(
                        'ui.datachannel.publishedDataChannelDomain',
                        'Published Data Channel Domain'
                      )}
                      value={
                        dataChannelDetails?.dataSourceInfo
                          ?.publishedDataSourceTypeInfo
                          ?.publishedDataChannelSourceDomainName
                      }
                    />
                  </Grid>
                  <Grid item md={2} xs={3}>
                    <StyledLabelWithValue
                      label={t(
                        'ui.datachannel.publishedComments',
                        'Published Comments'
                      )}
                      value={
                        dataChannelDetails?.dataSourceInfo
                          ?.publishedDataSourceTypeInfo?.publishedComments
                      }
                    />
                  </Grid>
                </>
              )}
            </Grid>

            {/* <Grid
              item
              style={{
                position: 'absolute',
                right: '10px',
                bottom: isAdditionalPropertiesExpanded ? '80px' : '0px',
              }}
            >
              <StyledEditButton
                onClick={toggleAdditionalPropertiesAccordion}
                useDomainColorForIcon
              >
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <StyledExpandCaret
                      style={{
                        transform: isAdditionalPropertiesExpanded
                          ? 'none'
                          : 'rotate(180deg)',
                      }}
                    />
                  </Grid>
                  <Grid item>
                    {isAdditionalPropertiesExpanded ? (
                      <StyledAccordionButtonText>
                        {t(
                          'ui.dataChannelEditor.hideAdditionalAssetProperties',
                          'Hide Additional Asset Properties'
                        )}
                      </StyledAccordionButtonText>
                    ) : (
                      <StyledAccordionButtonText>
                        {t(
                          'ui.dataChannelEditor.showAdditionalAssetProperties',
                          'Show Additional Asset Properties'
                        )}
                      </StyledAccordionButtonText>
                    )}
                  </Grid>
                </Grid>
              </StyledEditButton>
            </Grid> */}
          </AccordionDetails>

          {(isGasMixer || isHeliumIso) && (
            <AdditionalPropertiesEditorBox>
              <StyledAdditionalPropertiesAccordion
                square
                expanded={isAdditionalPropertiesExpanded}
                onChange={handleToggleAdditionalPropertiesAccordion}
              >
                <StyledAdditionalDetailsAccordionSummary
                  disableRipple
                  aria-controls="additional-asset-properties-content"
                  id="additional-asset-properties-header"
                  style={{ padding: '0 24px 16px 24px' }}
                >
                  <AdditionalPropertiesText>
                    <Grid
                      container
                      spacing={1}
                      alignItems="center"
                      justify="flex-end"
                    >
                      <Grid item>
                        <StyledExpandCaret
                          style={{
                            transform: isAdditionalPropertiesExpanded
                              ? 'rotate(180deg)'
                              : 'none',
                          }}
                        />
                      </Grid>
                      <Grid item>
                        {isAdditionalPropertiesExpanded ? (
                          <StyledAccordionButtonText>
                            {t(
                              'ui.dataChannelEditor.hideAdditionalAssetProperties',
                              'Hide Additional Asset Properties'
                            )}
                          </StyledAccordionButtonText>
                        ) : (
                          <StyledAccordionButtonText>
                            {t(
                              'ui.dataChannelEditor.showAdditionalAssetProperties',
                              'Show Additional Asset Properties'
                            )}
                          </StyledAccordionButtonText>
                        )}
                      </Grid>
                    </Grid>
                  </AdditionalPropertiesText>
                </StyledAdditionalDetailsAccordionSummary>
                <StyledAdditionalPropertiesAccordionDetails>
                  <Grid container spacing={3}>
                    {dataChannelDetails?.assetInfo?.assetTypeId ===
                      AssetDeviceType.GasMixer && (
                      <Grid item md={2} xs={3}>
                        <StyledLabelWithValue
                          label={t(
                            'ui.dataChannelEditor.gasMixerDataChannelType',
                            'Gas Mixer Data Channel Type'
                          )}
                          value={
                            dataChannelDetails.assetInfo.gasMixerAssetInfo
                              ?.gasMixerDataChannelTypeAsText
                          }
                        />
                      </Grid>
                    )}

                    {dataChannelDetails?.assetInfo?.assetTypeId ===
                      AssetDeviceType.HeliumIsoContainer &&
                      dataChannelDetails.dataChannelTypeId ===
                        DataChannelCategory.Pressure && (
                        <Grid item xs={12}>
                          <StyledLabelWithValue
                            label={t(
                              'ui.dataChannelEditor.designCurve',
                              'Design Curve'
                            )}
                            value={
                              dataChannelDetails.assetInfo.heliumIsoAssetInfo
                                ?.designCurveTypeAsText
                            }
                          />
                        </Grid>
                      )}
                  </Grid>
                </StyledAdditionalPropertiesAccordionDetails>
              </StyledAdditionalPropertiesAccordion>
            </AdditionalPropertiesEditorBox>
          )}
        </StaticAccordion>
      </Grid>
    </>
  );
};

export default GeneralInformationPanel;
