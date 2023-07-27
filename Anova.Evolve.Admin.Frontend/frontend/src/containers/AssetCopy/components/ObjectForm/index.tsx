/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Fade from '@material-ui/core/Fade';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import {
  EditAssetCopy,
  EvolveRetrieveRtuChannelUsageInfoListByRtuRequest,
  RTUChannelUsageInfo,
  RTUDeviceInfo,
  SiteInfoRecord,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import Alert from 'components/Alert';
import CloseIconButton from 'components/buttons/CloseIconButton';
import FormLinearProgress from 'components/FormLinearProgress';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SiteAutocomplete from 'components/forms/form-fields/SiteAutocomplete';
import FormikEffect from 'components/forms/FormikEffect';
import SiteLabelWithEditorButtons from 'components/forms/labels/LabelWithEditorButtons/SiteLabelWithEditorButtons';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import PageSubHeader from 'components/PageSubHeader';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import SiteEditor from 'containers/SiteEditor';
import {
  FastField,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikProps,
} from 'formik';
import { TFunction } from 'i18next';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fadedTextColor } from 'styles/colours';
import { isNumber } from 'utils/format/numbers';
import * as Yup from 'yup';
import RTUAutocomplete from '../RTUAutocomplete';
import { Values } from './types';

const StyledDrawerContent = styled.div`
  max-width: 673px;
  width: 673px;
  padding: 0 32px 32px;
`;

const StyledTableCell = styled(TableCell)`
  width: 50%;
`;

const StyledTableBodyRow = styled(TableBodyRow)`
  height: 40px;
`;

const fieldIsRequired = (t: TFunction, field: string) =>
  t('validate.common.isrequired', '{{field}} is required.', { field });

const fieldMaxLength = (t: TFunction) => ({ max }: { max: number }) =>
  t(
    'validate.customproperties.greaterthanmaxlength',
    `Input is beyond maximum length of {{max}}.`,
    { max }
  );

const buildValidationSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const requiredDescription = fieldIsRequired(
    t,
    translationTexts.descriptionText
  );
  const requiredRtu = fieldIsRequired(t, translationTexts.rtuText);
  const requiredChannelNumber = fieldIsRequired(
    t,
    translationTexts.rtuChannelText
  );
  return Yup.object().shape({
    targetDescription: Yup.string()
      .typeError(requiredDescription)
      .required(requiredDescription)
      .max(80, fieldMaxLength(t)),
    targetTechnician: Yup.string().max(80, fieldMaxLength(t)),
    targetNotes: Yup.string().max(1000, fieldMaxLength(t)),
    targetSiteId: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.siteText))
      .required(fieldIsRequired(t, translationTexts.siteText)),
    dataChannels: Yup.array().of(
      Yup.object().shape({
        targetDeviceId: Yup.mixed().when('sourceDeviceId', {
          is: (val) => !!val,
          then: Yup.string().typeError(requiredRtu).required(requiredRtu),
          otherwise: Yup.string().nullable(),
        }),
        targetChannelNumber: Yup.mixed().when('sourceChannelNumber', {
          is: (val) => isNumber(val),
          then: Yup.string()
            .typeError(requiredChannelNumber)
            .required(requiredChannelNumber),
          otherwise: Yup.string().nullable(),
        }),
      })
    ),
  });
};

const defaultInitialValues = {
  targetDescription: '',
  targetSiteId: '',
  targetTechnician: '',
  targetNotes: '',
  // isMobile: '',
  // geoAreaGroupId: '',
  dataChannels: [],
  targetAssetId: '',
};

const formatInitialValues = (values: any) => {
  return {
    ...values,
    ...(!values.targetDescription && { targetDescription: '' }),
    ...(!values.targetSiteId && { targetSiteId: '' }),
    ...(!values.targetTechnician && { targetTechnician: '' }),
    ...(!values.targetNotes && { targetNotes: '' }),
    ...(!values.dataChannels && { dataChannels: [] }),
    ...(!values.targetAssetId && { targetAssetId: '' }),
  };
};

interface Props {
  initialValues: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  editDetails: EditAssetCopy | null | undefined;
  domainId?: string;
  userId?: string;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
}

const SiteFormWrapper = ({
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  onSubmit,
  submissionError,
  editDetails,
  domainId,
  userId,
}: Props) => {
  const { t } = useTranslation();

  const [selectedSite, setSelectedSite] = useState<SiteInfoRecord | null>();
  const [editingSiteId, setEditingSiteId] = useState<string | null>();
  const [
    selectedRtuChannel,
    setSelectedRtuChannel,
  ] = useState<RTUDeviceInfo | null>();
  const [isSameRtuForAllChecked, setIsSameRtuForAllChecked] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsFetchingRtuChannels] = useState(false);
  const [rtuChannels, setRtuChannels] = useState<
    RTUChannelUsageInfo[] | null
  >();
  const [isSiteDrawerOpen, setIsSiteDrawerOpen] = useState(false);

  const formInitialValues = initialValues || defaultInitialValues;
  const formattedInitialValues = formatInitialValues(formInitialValues);

  const originalValueText = t('ui.assetCopy.originalValue', 'Original Value');
  const newValueText = t('ui.assetCopy.newValue', 'New Value');
  const descriptionText = t('ui.common.description', 'Description');
  const siteText = t('ui.common.site', 'Site');
  const rtuText = t('ui.common.rtu', 'RTU');
  const rtuChannelText = t('ui.datachannel.rtuchannel', 'RTU Channel');

  const validationSchema = useMemo(
    () =>
      buildValidationSchema(t, {
        descriptionText,
        siteText,
        rtuText,
        rtuChannelText,
      }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [t]
  );

  const fetchRtuChannels = useCallback((rtuId?: string) => {
    setIsFetchingRtuChannels(true);
    return AdminApiService.RTUService.retrieveRtuChannelUsageInfoListByRtu_RetrieveRtuChannelUsageInfoListByRtu(
      {
        rtuId,
        // dataChannelId?: string | null;
        // excludeNonNumericChannelNumbers?: boolean;
      } as EvolveRetrieveRtuChannelUsageInfoListByRtuRequest
    )
      .then((response) => {
        setRtuChannels(response.retrieveRTUChannelUsageInfoListByRTUResult);
      })
      .finally(() => {
        setIsFetchingRtuChannels(false);
      });
  }, []);

  const handleSameRtuForAll = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: FormikHelpers<Values>['setFieldValue'],
    setFieldTouched: FormikHelpers<Values>['setFieldTouched']
  ) => {
    const isChecked = event.target.checked;

    editDetails?.dataChannels?.forEach((channel, index) => {
      const hasMatchingChannelNumber =
        selectedRtuChannel &&
        rtuChannels?.find(
          (rtuChannel) =>
            rtuChannel.channelNumber === channel.sourceChannelNumber
        );

      setFieldValue(
        `dataChannels[${index}].targetChannelNumber`,
        isChecked && hasMatchingChannelNumber ? channel.sourceChannelNumber : ''
      );

      // Formik Bug: Setting the field value doesn't run it through validation
      // again so we need to touch the fields as well:
      // https://github.com/jaredpalmer/formik/issues/2059#issuecomment-612733378
      setTimeout(() => {
        setFieldTouched(`dataChannels[${index}].targetChannelNumber`, true);
      }, 0);
    });
  };

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

  useEffect(() => {
    setIsSameRtuForAllChecked(false);
  }, [selectedRtuChannel]);

  return (
    <Formik
      initialValues={formattedInitialValues}
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, isValid, setFieldValue, setFieldTouched, values }) => (
        <>
          <FormikEffect
            onChange={handleFormChange}
            isValid={isValid}
            restoreTouchedFields={restoreTouchedFields}
            restoreInitialValues={restoreInitialValues}
          />

          <Form>
            <Grid container spacing={3}>
              {/*
                TODO: Find a better way to handle errors + loading state. At the
                moment the shift is too jarring where the error appears and takes up
                space pushing the loading spinner down
              */}
              <Fade in={!!submissionError} unmountOnExit>
                <Grid item xs={12}>
                  <Alert severity="error">
                    {t('ui.site.saveError', 'Unable to save site')}
                  </Alert>
                </Grid>
              </Fade>
              <Grid item xs={12}>
                <FormLinearProgress in={isSubmitting} />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <PageSubHeader dense>
                  {t('ui.assetsummary.assetinformation', 'Asset Information')}
                </PageSubHeader>
              </Grid>
              <Grid item xs={12}>
                <Table aria-label="asset information table">
                  <TableHead>
                    <TableHeadRow>
                      <TableHeadCell dense>{originalValueText}</TableHeadCell>
                      <TableHeadCell dense>{newValueText}</TableHeadCell>
                    </TableHeadRow>
                  </TableHead>
                  <TableBody>
                    <StyledTableBodyRow grayBackground>
                      <TableHeadCell dense colSpan={2}>
                        {descriptionText} *
                      </TableHeadCell>
                    </StyledTableBodyRow>
                    <TableBodyRow>
                      <StyledTableCell>
                        {editDetails?.assetTitle}
                      </StyledTableCell>
                      <StyledTableCell>
                        <FastField
                          id="targetDescription-input"
                          component={CustomTextField}
                          name="targetDescription"
                        />
                      </StyledTableCell>
                    </TableBodyRow>

                    <StyledTableBodyRow grayBackground>
                      <TableHeadCell dense colSpan={2}>
                        {siteText} *
                      </TableHeadCell>
                    </StyledTableBodyRow>
                    <TableBodyRow>
                      <StyledTableCell>
                        {editDetails?.sourceSiteName}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Field
                              id="targetSiteId-input"
                              component={SiteAutocomplete}
                              name="targetSiteId"
                              required
                              domainId={domainId}
                              userId={userId}
                              selectedOption={selectedSite}
                              textFieldProps={{
                                placeholder: t(
                                  'ui.common.enterSearchCriteria',
                                  'Enter Search Criteria...'
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Grid container spacing={1} justify="flex-end">
                              <Grid item>
                                <SiteLabelWithEditorButtons
                                  label=""
                                  isEditButtonDisabled={!values.targetSiteId}
                                  onClickEdit={toggleDrawer(true, {
                                    siteId: values.targetSiteId,
                                  })}
                                  onClickAdd={toggleDrawer(true, {
                                    siteId: null,
                                  })}
                                />
                                <Drawer
                                  anchor="right"
                                  open={isSiteDrawerOpen}
                                  // @ts-ignore
                                  onClose={toggleDrawer(false)}
                                  variant="temporary"
                                  disableBackdropClick
                                >
                                  <StyledDrawerContent>
                                    <SiteEditor
                                      editingSiteId={editingSiteId}
                                      isInlineForm
                                      headerNavButton={
                                        <CloseIconButton
                                          onClick={toggleDrawer(false)}
                                        />
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
                                  </StyledDrawerContent>
                                </Drawer>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    </TableBodyRow>

                    <StyledTableBodyRow grayBackground>
                      <TableHeadCell dense colSpan={2}>
                        {t('ui.asset.technician', 'Technician')}
                      </TableHeadCell>
                    </StyledTableBodyRow>
                    <TableBodyRow>
                      <StyledTableCell>
                        {editDetails?.sourceTechnician}
                      </StyledTableCell>
                      <StyledTableCell>
                        <FastField
                          id="targetTechnician-input"
                          component={CustomTextField}
                          name="targetTechnician"
                        />
                      </StyledTableCell>
                    </TableBodyRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={5} alignItems="center">
                  <Grid item>
                    <PageSubHeader dense>
                      {t('ui.common.datachannels', 'Data Channels')} (
                      {editDetails?.dataChannels?.length || 0})
                    </PageSubHeader>
                  </Grid>
                  {editDetails?.dataChannels?.length !== 0 && (
                    <Grid item>
                      <FormControlLabel
                        control={
                          <Checkbox
                            name="sameRtuForAll"
                            checked={isSameRtuForAllChecked}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setIsSameRtuForAllChecked(event.target.checked);
                              handleSameRtuForAll(
                                event,
                                setFieldValue,
                                setFieldTouched
                              );
                            }}
                            disabled={editDetails?.dataChannels?.length === 0}
                          />
                        }
                        label={t(
                          'ui.assetcopy.sameRtuForAll',
                          'Same RTU for all'
                        )}
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              {editDetails?.dataChannels?.map((channel, index) => (
                <Fragment key={channel.dataChannelId}>
                  <Grid item xs={12}>
                    <PageSubHeader dense>{channel.description}</PageSubHeader>
                  </Grid>
                  <Grid item xs={12}>
                    <Table aria-label="asset information table">
                      <TableHead>
                        <TableHeadRow>
                          <TableHeadCell dense>
                            {originalValueText}
                          </TableHeadCell>
                          <TableHeadCell dense>{newValueText}</TableHeadCell>
                        </TableHeadRow>
                      </TableHead>
                      <TableBody>
                        <StyledTableBodyRow grayBackground>
                          <TableHeadCell dense colSpan={2}>
                            {rtuText} *
                          </TableHeadCell>
                        </StyledTableBodyRow>
                        {channel.sourceDeviceId ? (
                          <>
                            <TableBodyRow>
                              <StyledTableCell>
                                {channel.sourceDeviceId}
                              </StyledTableCell>
                              <StyledTableCell>
                                <Field
                                  id={`dataChannels[${index}].targetDeviceId-input`}
                                  component={RTUAutocomplete}
                                  name={`dataChannels[${index}].targetDeviceId`}
                                  onChange={(
                                    newValue: RTUDeviceInfo | null
                                  ) => {
                                    if (newValue) {
                                      fetchRtuChannels(newValue.rtuId);
                                    }

                                    setSelectedRtuChannel(newValue);

                                    editDetails?.dataChannels?.forEach(
                                      (__, dataChannelIndex) => {
                                        const targetDeviceIdValue =
                                          newValue?.deviceId || null;
                                        setFieldValue(
                                          `dataChannels[${dataChannelIndex}].targetDeviceId`,
                                          targetDeviceIdValue
                                        );

                                        // Reset the target channel number when the
                                        // rtu is changed
                                        setFieldValue(
                                          `dataChannels[${dataChannelIndex}].targetChannelNumber`,
                                          null
                                        );
                                      }
                                    );
                                  }}
                                  required
                                  domainId={domainId}
                                  selectedOption={selectedRtuChannel}
                                  textFieldProps={{
                                    placeholder: t(
                                      'ui.common.enterSearchCriteria',
                                      'Enter Search Criteria...'
                                    ),
                                  }}
                                />
                              </StyledTableCell>
                            </TableBodyRow>

                            <StyledTableBodyRow grayBackground>
                              <TableHeadCell dense colSpan={2}>
                                {rtuChannelText} *
                              </TableHeadCell>
                            </StyledTableBodyRow>
                            <TableBodyRow>
                              <StyledTableCell>
                                {channel.sourceChannelNumber}
                              </StyledTableCell>
                              <StyledTableCell>
                                {isNumber(channel.sourceChannelNumber) ? (
                                  <Field
                                    id={`dataChannels[${index}].targetChannelNumber-input`}
                                    component={CustomTextField}
                                    name={`dataChannels[${index}].targetChannelNumber`}
                                    select
                                  >
                                    <MenuItem value="" disabled>
                                      <span style={{ color: fadedTextColor }}>
                                        {t('ui.common.select', 'Select')}
                                      </span>
                                    </MenuItem>
                                    {rtuChannels?.map((rtuChannel) => (
                                      <MenuItem
                                        key={rtuChannel.rtuChannelId}
                                        // @ts-ignore
                                        value={rtuChannel.channelNumber}
                                      >
                                        {rtuChannel.channelNumber}
                                        &nbsp;
                                        <em>
                                          {rtuChannel.dataChannelCount
                                            ? t(
                                                'ui.datachannel.channelinuse',
                                                '(in use)'
                                              )
                                            : t(
                                                'ui.datachannel.channelnotinuse',
                                                '(not in use)'
                                              )}
                                        </em>
                                      </MenuItem>
                                    ))}
                                  </Field>
                                ) : (
                                  channel.sourceChannelNumber
                                )}
                              </StyledTableCell>
                            </TableBodyRow>
                          </>
                        ) : (
                          <TableBodyRow>
                            <StyledTableCell colSpan={2}>
                              <Box textAlign="center">
                                {t(
                                  'ui.assetCopy.noRtuConfiguration',
                                  'No RTU Configuration'
                                )}
                              </Box>
                            </StyledTableCell>
                          </TableBodyRow>
                        )}
                      </TableBody>
                    </Table>
                  </Grid>
                </Fragment>
              ))}
              <Grid item xs={12}>
                <PageSubHeader dense>
                  {t('ui.common.notes', 'Notes')}
                </PageSubHeader>
              </Grid>
              <Grid item xs={12}>
                <FastField
                  component={CustomTextField}
                  multiline
                  name="targetNotes"
                  rows={7}
                />
              </Grid>
            </Grid>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default SiteFormWrapper;
