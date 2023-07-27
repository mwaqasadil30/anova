/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {
  AssetType,
  DesignCurveType,
  EditAsset,
  SiteInfoRecord,
} from 'api/admin/api';
import Alert from 'components/Alert';
import CloseIconButton from 'components/buttons/CloseIconButton';
import CustomProperties from 'components/CustomProperties';
import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SiteAutocomplete from 'components/forms/form-fields/SiteAutocomplete';
import SiteLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/SiteLabelWithEditorButtons';
import PageSubHeader from 'components/PageSubHeader';
import SiteEditor from 'containers/SiteEditor';
import { Field, FormikProps } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import { selectUser } from 'redux-app/modules/user/selectors';
import { fadedTextColor } from 'styles/colours';
import { EvolveRetrieveAssetEditDetailsByIdResponse as Response } from '../../../api/admin/api';

export const utilizedFieldsNamespace = 'asset';
export const utilizedFields = {
  assetType: 'assetType',
  designCurveType: 'designCurveType',
  description: 'description',
  eventRuleGroupId: 'eventRuleGroupId',
  installedTechName: 'installedTechName',
  integrationName: 'integrationName',
  siteId: 'siteId',
  geoAreaGroupId: 'geoAreaGroupId',
  notes: 'notes',
  isMobile: 'isMobile',
} as Record<keyof EditAsset, string>;
export const customPropertiesFields = {
  value: 'value',
};
const getName = (name: keyof typeof utilizedFields) =>
  `${utilizedFieldsNamespace}.${name}`;

const GeneralTab = ({
  formik,
  submissionError,
}: {
  submissionError: boolean;
  formik: FormikProps<Response>;
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isBelowMdBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  // Site drawer state
  const [selectedSite, setSelectedSite] = useState<SiteInfoRecord | null>();
  const [editingSiteId, setEditingSiteId] = useState<string | null>();
  const [isSiteDrawerOpen, setIsSiteDrawerOpen] = useState(false);

  const activeDomain = useSelector(selectActiveDomain);
  const user = useSelector(selectUser);
  const userId =
    user.data?.authenticateAndRetrieveApplicationInfoResult?.userInfo?.userId;
  const domainId = activeDomain?.domainId;
  const customProperties = formik.values.asset?.customProperties || [];

  const editOptions = formik.values.assetEditOptions;
  const eventRuleGroups = editOptions?.eventRuleGroups;
  const geoAreaGroups = editOptions?.geoAreaGroups;
  const formEditObjectValues = formik.values.asset;

  const toggleDrawer = (open: boolean, options?: any) => (
    event?: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsSiteDrawerOpen(open);

    if (open && options) {
      setEditingSiteId(options?.siteId);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Fade in={submissionError} unmountOnExit>
            <Grid item xs={12}>
              <Alert severity="error">
                {t('ui.asset.genericSaveError', 'Unable to save asset')}
              </Alert>
            </Grid>
          </Fade>
          <Grid item xs={12}>
            <FormLinearProgress in={formik.isSubmitting} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t('ui.asset.assetdetails', 'Asset Details')}
              </PageSubHeader>
            </Grid>

            <Grid item xs={12}>
              <EditorBox>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      select
                      name={getName('assetType')}
                      label={t('ui.common.type', 'Type')}
                    >
                      {[
                        {
                          label: t('enum.assettype.none', 'None'),
                          value: AssetType.None,
                        },
                        {
                          label: t('enum.assettype.tank', 'Tank'),
                          value: AssetType.Tank,
                        },
                        {
                          label: t(
                            'enum.assettype.heliumisocontainer',
                            'Helium ISO Container'
                          ),
                          value: AssetType.HeliumIsoContainer,
                        },
                      ].map((option) => (
                        <MenuItem key={option.label} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>

                  {formEditObjectValues?.assetType ===
                    AssetType.HeliumIsoContainer && (
                    <Grid item xs={12}>
                      <Field
                        component={CustomTextField}
                        select
                        name={getName('designCurveType')}
                        label={t(
                          'ui.asset.designcurvetype',
                          'Design Curve Type'
                        )}
                      >
                        {[
                          {
                            label: t('enum.designcurvetype.none', 'None'),
                            value: DesignCurveType.None,
                          },
                          {
                            label: t(
                              'enum.designcurvetype.tank1',
                              'Gardner 64 psig'
                            ),
                            value: DesignCurveType.Tank1,
                          },
                          {
                            label: t(
                              'enum.designcurvetype.tank2',
                              'Gardner 91 psig'
                            ),
                            value: DesignCurveType.Tank2,
                          },
                          {
                            label: t(
                              'enum.designcurvetype.tank3',
                              'Gardner 175 psig'
                            ),
                            value: DesignCurveType.Tank3,
                          },
                        ].map((option) => (
                          <MenuItem key={option.label} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      name={getName('description')}
                      type="text"
                      label={t('ui.common.description', 'Description')}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Box m={2} />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      select
                      name={getName('eventRuleGroupId')}
                      label={t('ui.common.eventrulegroup', 'Event Rule Group')}
                      SelectProps={{ displayEmpty: true }}
                    >
                      <MenuItem value="" disabled>
                        <span style={{ color: fadedTextColor }}>
                          {t('ui.common.select', 'Select')}
                        </span>
                      </MenuItem>
                      {eventRuleGroups?.map((eventRuleGroup) => (
                        <MenuItem
                          key={eventRuleGroup.eventRuleGroupId}
                          value={eventRuleGroup.eventRuleGroupId}
                        >
                          {eventRuleGroup.description}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      name={getName('installedTechName')}
                      type="text"
                      label={t('ui.asset.technician', 'Technician')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={CustomTextField}
                      name={getName('integrationName')}
                      type="text"
                      label={t(
                        'ui.asset.assetintegrationid',
                        'Asset Integration ID'
                      )}
                    />
                  </Grid>
                </Grid>
              </EditorBox>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t('ui.common.location', 'Location')}
              </PageSubHeader>
            </Grid>

            <Grid item xs={12}>
              <EditorBox>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Drawer
                      anchor="right"
                      open={isSiteDrawerOpen}
                      // @ts-ignore
                      onClose={toggleDrawer(false)}
                      variant="temporary"
                      disableBackdropClick
                    >
                      <DrawerContent>
                        <SiteEditor
                          editingSiteId={editingSiteId}
                          isInlineForm
                          headerNavButton={
                            <CloseIconButton onClick={toggleDrawer(false)} />
                          }
                          saveCallback={(response: any) => {
                            const editObject =
                              response?.saveSiteResult?.editObject;

                            setSelectedSite(editObject);
                            setEditingSiteId(editObject?.siteId);
                          }}
                          saveAndExitCallback={(response: any) => {
                            const editObject =
                              response?.saveSiteResult?.editObject;

                            setSelectedSite(editObject);
                            setEditingSiteId(editObject?.siteId);
                            toggleDrawer(false)();
                          }}
                        />
                      </DrawerContent>
                    </Drawer>
                    <Field
                      id="siteId-input"
                      component={SiteAutocomplete}
                      name={getName('siteId')}
                      select
                      domainId={domainId}
                      userId={userId}
                      initialInputValue={formEditObjectValues?.siteInfo}
                      selectedOption={selectedSite}
                      textFieldProps={{
                        label: (
                          <SiteLabelWithEditorButtons
                            isEditButtonDisabled={!formEditObjectValues?.siteId}
                            onClickEdit={toggleDrawer(true, {
                              siteId: formEditObjectValues?.siteId,
                            })}
                            onClickAdd={toggleDrawer(true, {
                              siteId: null,
                            })}
                          />
                        ),
                      }}
                    >
                      <MenuItem value="">
                        <span style={{ color: fadedTextColor }}>
                          {t('ui.common.select', 'Select')}
                        </span>
                      </MenuItem>
                    </Field>
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      component={CheckboxWithLabel}
                      name={getName('isMobile')}
                      type="checkbox"
                      Label={{
                        label: t('ui.asset.ismobile', 'Mobile'),
                      }}
                    />
                  </Grid>
                  {formEditObjectValues?.isMobile && (
                    <Grid item xs={12}>
                      <Field
                        component={CustomTextField}
                        select
                        name={getName('geoAreaGroupId')}
                        label={t('ui.asset.geoareagroup', 'Geo Area Group')}
                        SelectProps={{ displayEmpty: true }}
                      >
                        <MenuItem value="">
                          <span style={{ color: fadedTextColor }}>
                            {t('ui.common.select', 'Select')}
                          </span>
                        </MenuItem>
                        {geoAreaGroups?.map((geoAreaGroup) => (
                          <MenuItem
                            key={geoAreaGroup.geoAreaGroupId}
                            value={geoAreaGroup.geoAreaGroupId}
                          >
                            {geoAreaGroup.description}
                          </MenuItem>
                        ))}
                      </Field>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <PageSubHeader>
                      {t('ui.common.notes', 'Notes')}
                    </PageSubHeader>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Field
                        component={CustomTextField}
                        multiline
                        rows={
                          formEditObjectValues?.isMobile && !isBelowMdBreakpoint
                            ? 9
                            : 14
                        }
                        name={getName('notes')}
                      />
                    </div>
                  </Grid>
                </Grid>
              </EditorBox>
            </Grid>
          </Grid>
        </Grid>
        {!!customProperties?.length && (
          <>
            <Grid item xs={12}>
              <Hidden smDown>
                <Box my={2}>
                  <Divider />
                </Box>
              </Hidden>
            </Grid>
            <Grid item xs={12}>
              <PageSubHeader dense>
                {t('ui.asset.customproperties', 'Custom Properties')}
              </PageSubHeader>
            </Grid>
            <Grid item xs={12}>
              <EditorBox>
                <CustomProperties
                  customProperties={customProperties}
                  fieldNamePrefix={getName('customProperties')}
                />
              </EditorBox>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default GeneralTab;
