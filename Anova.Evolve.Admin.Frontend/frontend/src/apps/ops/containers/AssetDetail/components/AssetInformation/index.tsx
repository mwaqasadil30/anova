/* eslint-disable indent */
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {
  AssetDetailDto,
  CustomPropertyDataType,
  EvolveAssetDetails,
  UserPermissionType,
} from 'api/admin/api';
import {
  StyledEditIcon,
  StyledExpandIcon,
} from 'apps/ops/components/icons/styles';
import { ReactComponent as DarkExpandIcon } from 'assets/icons/doubleArrow.svg';
import { ReactComponent as WorkingInstructionsIcon } from 'assets/icons/working-instructions-note.svg';
import Button from 'components/Button';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import React, { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import useWindowSize from 'react-use/lib/useWindowSize';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import { selectHasPermission } from 'redux-app/modules/user/selectors';
import styled from 'styled-components';
import { AccessType } from 'types';
import { massageCustomProperties } from 'utils/api/custom-properties';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import { formatPhoneNumber } from 'utils/ui/helpers';
import { StyledAccordionSummary } from '../../styles';
import AssetInformationDrawer from '../AssetInformationDrawer';
import ListComponent from '../ListComponent';

const StyledAccordion = styled(Accordion)`
  width: inherit;
  border-radius: ${(props) =>
    `${props.theme.shape.borderRadius}px 0 0 ${props.theme.shape.borderRadius}px`};
`;

const StyledAssetInformationAccordionSummary = styled(StyledAccordionSummary)`
  padding-left: 12px;
  padding-right: 8px;
  border-radius: ${(props) => `${props.theme.shape.borderRadius}px 0 0 0`};

  background-color: ${(props) =>
    props.theme.palette.type === 'light' && '#EBEBEB'};

  && .MuiTypography-root {
    color: ${(props) =>
      props.theme.palette.type === 'light' &&
      props.theme.palette.text.secondary};
  }
`;

const StyledAssetInformationAccordionDetails = styled(AccordionDetails)`
  border-top: 0px solid;
  border-radius: ${(props) => `0 0 0 ${props.theme.shape.borderRadius}px`};
  box-shadow: ${(props) =>
    props.theme.palette.type === 'light' &&
    '0px 3px 10px rgba(159, 178, 189, 0.2)'};
  padding: 16px 38px;
  overflow: hidden;
  position: relative;
`;

const MajorText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const MinorText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const StyledTitleText = styled(Typography)`
  &&& {
    color: ${(props) => props.theme.palette.text.primary};
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    font-weight: 500;
  }
`;

const StyledButton = styled(Button)`
  min-width: 36px;
`;

const StyledWorkingInstructionsButton = styled(StyledButton)`
  padding: 4px 8px 4px 8px;
`;

const StyledAssetInformationButton = styled(StyledButton)`
  margin-right: 10px;
  padding: 6px 8px 6px 8px;
`;

const StyledExpandDetailsButton = styled(Button)`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  justify-content: flex-end;
  && {
    padding: 8px 12px;
  }
`;

const GradientOverlay = styled.div`
  background: ${(props) => `
    linear-gradient(
      180deg,
      ${props.theme.custom.palette?.gradient?.gradientEnd} 60%,
      ${props.theme.custom.palette?.gradient?.gradientStart} 100%
    );
  `};

  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 0px;
  pointer-events: none;
`;

const StyledList = styled(List)`
  padding-top: 0px;
`;

const StyledTooltip = styled((props) => (
  <Tooltip arrow classes={{ popper: props.className }} {...props} />
))`
  & .MuiTooltip-tooltip {
    background-color: ${(props) => props.theme.palette.background.paper};
    color: ${(props) => props.theme.palette.text.secondary};
    font-size: 14px;
    font-weight: 400;
    padding: 8px 16px;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.25);
  }
  & .MuiTooltip-arrow {
    color: ${(props) => props.theme.palette.background.paper};
  }
  & .MuiTooltip-tooltipPlacementBottom {
    margin: 4px 0;
  }
`;

interface Props {
  assetResult?: AssetDetailDto | null;
  updateAssetInformation: (asset?: EvolveAssetDetails | null) => void;
}

const AssetInformation = ({ assetResult, updateAssetInformation }: Props) => {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();

  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const hasPermission = useSelector(selectHasPermission);
  const canReadSiteNotes = hasPermission(
    UserPermissionType.SiteNotes,
    AccessType.Read
  );
  const canReadAssetNotes = hasPermission(
    UserPermissionType.AssetNotes,
    AccessType.Read
  );
  const canReadCustomProperties = hasPermission(
    UserPermissionType.AssetCustomProperties,
    AccessType.Read
  );
  const canReadAssetInfo = hasPermission(
    UserPermissionType.AssetGlobal,
    AccessType.Read
  );

  const canAccessAssetInfoDrawer =
    canReadAssetNotes ||
    canReadCustomProperties ||
    canReadSiteNotes ||
    canReadAssetInfo;

  const result = assetResult;
  // Expand the asset information panel by default
  const [expanded, setExpanded] = useState<boolean>(true);
  const handleChange = () => {
    setExpanded(!expanded);
  };

  const joinedAddress = [
    result?.siteInfo?.address1,
    result?.siteInfo?.city,
    result?.siteInfo?.state,
  ]
    .filter(Boolean)
    .join(', ');

  // Asset Information Drawer
  const [isAssetInfoDrawerOpen, setIsAssetInfoDrawerOpen] = useState(false);

  const closeAssetInfoDrawer = () => {
    setIsAssetInfoDrawerOpen(false);
  };

  const openAssetInfoDrawer = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsAssetInfoDrawerOpen(true);
  };

  const customProperties = result?.customProperties;
  const formattedCustomProperties = massageCustomProperties(customProperties);

  // Expand Asset Information Details related things
  const assetDetailsContentEl = useRef<HTMLElement>(null);
  const [
    showExpandAssetDetailsButton,
    setShowExpandAssetDetailsButton,
  ] = useState(false);
  const [isAssetInfoDetailsExpanded, setIsAssetInfoDetailsExpanded] = useState(
    false
  );
  useLayoutEffect(() => {
    if (assetDetailsContentEl.current) {
      const { clientHeight, scrollHeight } = assetDetailsContentEl.current;

      if (scrollHeight > clientHeight) {
        setShowExpandAssetDetailsButton(true);
      } else {
        setShowExpandAssetDetailsButton(false);
      }
    }
  }, [width, height]);

  const toggleExpandAssetInfoDetails = () =>
    setIsAssetInfoDetailsExpanded(!isAssetInfoDetailsExpanded);

  const handleAssetInfoSave = (asset?: EvolveAssetDetails | null) => {
    closeAssetInfoDrawer();
    updateAssetInformation(asset);
  };

  const workingInstructionsUrl = result?.referenceDocumentUrl;

  const formattedPhoneNumber = formatPhoneNumber(
    result?.siteInfo?.customerContactPhone
  );

  const contactInfo = [
    formattedPhoneNumber,
    result?.siteInfo?.customerContactName,
  ]
    .filter(Boolean)
    .join(' | ');

  const postalCodeAndCountry = [
    result?.siteInfo?.postalCode,
    result?.siteInfo?.country,
  ]
    .filter(Boolean)
    .join(' | ');

  return (
    <Grid item>
      <Box>
        {/* Asset Information drawer */}
        <Drawer
          anchor="right"
          open={isAssetInfoDrawerOpen}
          onClose={closeAssetInfoDrawer}
          variant="temporary"
        >
          <DrawerContent>
            <AssetInformationDrawer
              assetResult={assetResult}
              closeAssetInfoDrawer={closeAssetInfoDrawer}
              customProperties={customProperties}
              onSaveSuccess={handleAssetInfoSave}
            />
          </DrawerContent>
        </Drawer>
        <Grid container direction="row" alignItems="center">
          <StyledAccordion
            elevation={0}
            expanded={expanded}
            onChange={handleChange}
          >
            <StyledAssetInformationAccordionSummary
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Grid
                container
                alignItems="center"
                spacing={0}
                justify="space-between"
              >
                <Grid item>
                  <Grid
                    container
                    alignItems="center"
                    spacing={1}
                    justify="space-between"
                  >
                    <Grid item>
                      <StyledExpandIcon
                        style={{
                          transform: expanded
                            ? 'rotate(0deg)'
                            : 'rotate(-180deg)',
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <StyledTitleText>
                        {t(
                          'ui.assetsummary.assetinformation',
                          'Asset Information'
                        )}
                      </StyledTitleText>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container spacing={1} alignItems="center">
                    {isAirProductsEnabledDomain && workingInstructionsUrl && (
                      <Grid item>
                        <StyledTooltip
                          title={t(
                            'ui.apci.workingInstructions',
                            'Working Instructions'
                          )}
                        >
                          <div>
                            <a
                              href={workingInstructionsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <StyledWorkingInstructionsButton>
                                <WorkingInstructionsIcon />
                              </StyledWorkingInstructionsButton>
                            </a>
                          </div>
                        </StyledTooltip>
                      </Grid>
                    )}
                    {canAccessAssetInfoDrawer && (
                      <Grid item>
                        <StyledAssetInformationButton
                          onClick={openAssetInfoDrawer}
                        >
                          <StyledEditIcon />
                        </StyledAssetInformationButton>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </StyledAssetInformationAccordionSummary>
            <StyledAssetInformationAccordionDetails
              ref={assetDetailsContentEl}
              style={{
                height: isAssetInfoDetailsExpanded ? undefined : '110px',
                paddingBottom: isAssetInfoDetailsExpanded ? 32 : undefined,
              }}
            >
              {/* container for all components */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      {result?.assetDescription && (
                        <MajorText aria-label="Asset description">
                          {result?.assetDescription}
                        </MajorText>
                      )}
                      <MinorText aria-label="Customer name">
                        {result?.siteInfo?.customerName ||
                          t('ui.common.none', 'None')}
                      </MinorText>
                      {joinedAddress && (
                        <MinorText aria-label="Site address">
                          {joinedAddress}
                        </MinorText>
                      )}
                      {postalCodeAndCountry && (
                        <MinorText aria-label="Postal code and country">
                          {postalCodeAndCountry}
                        </MinorText>
                      )}
                      {contactInfo && (
                        <MinorText aria-label="Contact info">
                          {contactInfo}
                        </MinorText>
                      )}
                    </Grid>
                    {result?.technician && (
                      <Grid item xs={12}>
                        <MajorText>
                          {t('ui.asset.technician', 'Technician')}
                        </MajorText>
                        <MinorText aria-label="Technician">
                          {result?.technician}
                        </MinorText>
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                {canReadSiteNotes && (
                  <Grid item xs={12} md={6} lg>
                    <MajorText>
                      {t('ui.assetdetail.sitenotes', 'Site Notes')}
                    </MajorText>
                    {result?.siteInfo?.siteNotes && (
                      <MinorText
                        aria-label="Site notes"
                        style={{ overflowWrap: 'anywhere' }}
                      >
                        {result?.siteInfo?.siteNotes}
                      </MinorText>
                    )}
                  </Grid>
                )}

                {canReadAssetNotes && (
                  <Grid item xs={12} md={6} lg>
                    <MajorText>
                      {t('ui.assetdetail.assetnotes', 'Asset Notes')}
                    </MajorText>
                    {result?.assetNotes && (
                      <MinorText
                        aria-label="Asset notes"
                        style={{ overflowWrap: 'anywhere' }}
                      >
                        {result?.assetNotes}
                      </MinorText>
                    )}
                  </Grid>
                )}

                {(canReadCustomProperties || result?.integrationId) && (
                  <Grid item xs={12} md={6} lg>
                    <Grid container spacing={2}>
                      {canReadCustomProperties && (
                        <Grid item xs={12}>
                          <StyledList
                            // @ts-ignore
                            component="nav"
                            aria-label="asset information list"
                            dense
                          >
                            {formattedCustomProperties.map(
                              (customProperty, index, array) => {
                                const showDivider =
                                  array.length === 1 ||
                                  index !== array.length - 1;
                                return (
                                  <Fragment key={index}>
                                    <ListComponent
                                      titleText={customProperty.name}
                                      contentText={
                                        customProperty.dataType ===
                                        CustomPropertyDataType.Boolean
                                          ? formatBooleanToYesOrNoString(
                                              customProperty.value,
                                              t
                                            )
                                          : customProperty.value
                                      }
                                      noTopPadding
                                      noBottomPadding
                                    />
                                    {showDivider && <Divider />}
                                  </Fragment>
                                );
                              }
                            )}
                          </StyledList>
                        </Grid>
                      )}
                      {result?.integrationId && (
                        <Grid item xs={12}>
                          <StyledList
                            // @ts-ignore
                            component="nav"
                            aria-label="Asset integration id"
                            dense
                          >
                            <>
                              <ListComponent
                                titleText={t(
                                  'ui.asset.assetintegrationid',
                                  'Asset Integration ID'
                                )}
                                contentText={result.integrationId}
                                noTopPadding
                                noBottomPadding
                              />
                              <Divider />
                            </>
                          </StyledList>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                )}
              </Grid>

              {showExpandAssetDetailsButton && (
                <>
                  {!isAssetInfoDetailsExpanded && <GradientOverlay />}
                  <StyledExpandDetailsButton
                    variant="text"
                    onClick={toggleExpandAssetInfoDetails}
                  >
                    {isAssetInfoDetailsExpanded ? (
                      <DarkExpandIcon
                        style={{
                          transform: 'rotate(-90deg)',
                        }}
                      />
                    ) : (
                      <DarkExpandIcon
                        style={{
                          transform: 'rotate(90deg)',
                        }}
                      />
                    )}
                  </StyledExpandDetailsButton>
                </>
              )}
            </StyledAssetInformationAccordionDetails>
          </StyledAccordion>
        </Grid>
      </Box>
    </Grid>
  );
};
export default AssetInformation;
