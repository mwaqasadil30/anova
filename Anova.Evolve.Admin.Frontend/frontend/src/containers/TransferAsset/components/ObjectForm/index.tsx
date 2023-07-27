/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import {
  DomainDetailDto,
  EvolveRetrieveTransferAssetTargetDomainInfoByIdRequest,
  TransferAssetDataChannelEventRuleInfo,
  TransferAssetDataChannelInfo,
  TransferAssetEventRuleRosterInfo,
  TransferAssetInfo,
  TransferAssetTargetDomainInfo,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { ReactComponent as GlobeIcon } from 'assets/icons/globe.svg';
import Alert from 'components/Alert';
import FormLinearProgress from 'components/FormLinearProgress';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import FormikEffect from 'components/forms/FormikEffect';
import DropdownAutocomplete from 'components/forms/styled-fields/DropdownAutocomplete';
import PageSubHeader from 'components/PageSubHeader';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import BoldPrimaryText from 'components/typography/BoldPrimaryText';
import { Field, Form, Formik, FormikHelpers, FormikProps, getIn } from 'formik';
import { useRetrieveCurrentUserAccessibleDomains } from 'hooks/useRetrieveCurrentUserAccessibleDomains';
import { TFunction } from 'i18next';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import { fadedTextColor } from 'styles/colours';
import { EMPTY_GUID } from 'utils/api/constants';
import {
  buildDataChannelTypeTextMapping,
  buildEventRuleTypeTextMapping,
} from 'utils/i18n/enum-to-text';
import * as Yup from 'yup';
import CustomFormEffect from '../CustomFormEffect';
import { Values } from './types';

const EmptyBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      display="flex"
      height="50px"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      flexDirection="column"
    >
      {children}
    </Box>
  );
};

const StyledTableCell = styled(TableCell)`
  width: 50%;
`;

const HalfWidthTableHeadCell = styled(TableHeadCell)`
  width: 50%;
`;

const fieldIsRequired = (t: TFunction, field: string) =>
  t('validate.common.isrequired', '{{field}} is required.', { field });

const buildValidationSchema = (
  t: TFunction,
  associatedAssetCount: number | undefined,
  translationTexts: Record<string, string>
) => {
  const transferOtherAssetsUsingTheSameRtuValidation =
    associatedAssetCount && associatedAssetCount > 0
      ? Yup.boolean().oneOf(
          [true],
          t(
            'validate.assetTransfer.requiredTransferOtherAssetsCheckbox',
            'You must check the "{{transferOtherAssetsCheckboxLabel}}" checkbox before transfer.',
            {
              transferOtherAssetsCheckboxLabel:
                translationTexts.transferOtherAssetsText,
            }
          )
        )
      : Yup.mixed();
  return Yup.object().shape({
    transferOtherAssetsUsingTheSameRtu: transferOtherAssetsUsingTheSameRtuValidation,
    targetDomainId: Yup.string()
      .typeError(fieldIsRequired(t, translationTexts.destinationDomainText))
      .required(fieldIsRequired(t, translationTexts.destinationDomainText)),
  });
};

const defaultInitialValues = {
  targetDomainId: '',
  transferRTUIds: [],
  assetIds: [],
  mappedFtpDomainIds: [],
  transferDataChannelReadings: true,
  transferAssetNotes: false,
  transferSiteNotes: false,
  transferCustomPropertyValues: true,
  deleteSourceSiteIfNotUsed: true,
  deleteSourceTankDimensionIfNotUsed: true,
  deleteSourceProductIfNotUsed: false,

  // Not required for the form
  transferOtherAssetsUsingTheSameRtu: false,
};

const formatInitialValues = (values: any) => {
  return {
    ...values,
    ...(!values.transferRTUIds && {
      transferRTUIds: [],
    }),
    ...(!values.assetIds && {
      assetIds: [],
    }),
    ...(!values.mappedFtpDomainIds && {
      mappedFtpDomainIds: [],
    }),
    ...(!values.transferDataChannelReadings && {
      transferDataChannelReadings: true,
    }),
    ...(!values.transferAssetNotes && {
      transferAssetNotes: false,
    }),
    ...(!values.transferSiteNotes && {
      transferSiteNotes: false,
    }),
    ...(!values.transferCustomPropertyValues && {
      transferCustomPropertyValues: true,
    }),
    ...(!values.deleteSourceSiteIfNotUsed && {
      deleteSourceSiteIfNotUsed: true,
    }),
    ...(!values.deleteSourceTankDimensionIfNotUsed && {
      deleteSourceTankDimensionIfNotUsed: true,
    }),
    ...(!values.deleteSourceProductIfNotUsed && {
      deleteSourceProductIfNotUsed: false,
    }),

    // Not required for the form
    ...(!values.transferOtherAssetsUsingTheSameRtu && {
      transferOtherAssetsUsingTheSameRtu: false,
    }),
  };
};

interface CustomEventRuleGroup
  extends Omit<TransferAssetInfo, 'init' | 'toJSON'> {
  uniqueEventRules: (
    | TransferAssetDataChannelEventRuleInfo
    | null
    | undefined
  )[];
}

interface Props {
  initialValues: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  selectedOriginalAssets?: TransferAssetInfo[] | null;
  associatedAssets?: TransferAssetInfo[] | null;
  eventRuleGroups?: CustomEventRuleGroup[];
  rosters?: (TransferAssetEventRuleRosterInfo | null | undefined)[];
  products: (TransferAssetDataChannelInfo | null | undefined)[];
  tankDimensions: (TransferAssetDataChannelInfo | null | undefined)[];
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
  selectedOriginalAssets,
  associatedAssets,
  eventRuleGroups,
  rosters,
  products,
  tankDimensions,
}: Props) => {
  const { t } = useTranslation();

  const retrieveCurrentUserAccessibleDomainsApi = useRetrieveCurrentUserAccessibleDomains();
  const accessibleDomains = retrieveCurrentUserAccessibleDomainsApi.data;

  const activeDomain = useSelector(selectActiveDomain);
  const activeDomainId = activeDomain?.domainId;
  const filteredDomains = useMemo(
    () =>
      accessibleDomains?.filter((domain) => domain.domainId !== activeDomainId),
    [accessibleDomains, activeDomainId]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsFetchingTransferTargetDetails] = useState(false);
  const [
    transferTargetDetails,
    setTransferTargetDetails,
  ] = useState<TransferAssetTargetDomainInfo | null>();

  const formInitialValues = initialValues || defaultInitialValues;
  const formattedInitialValues = formatInitialValues(formInitialValues);

  const destinationDomainText = t(
    'ui.assetTransfer.destinationDomain',
    'Destination Domain'
  );
  const descriptionText = t('ui.common.description', 'Description');
  const siteText = t('ui.common.site', 'Site');
  const rtuText = t('ui.common.rtu', 'RTU');
  const rtuChannelText = t('ui.datachannel.rtuchannel', 'RTU Channel');
  const transferOtherAssetsText = t(
    'ui.assetTransfer.transferOtherAssetsUsingTheSameRtu',
    'Transfer other Assets using the same RTU(s)'
  );
  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  const eventRuleTypeTextMapping = buildEventRuleTypeTextMapping(t);

  const assetColumns = [
    t('ui.common.assettitle', 'Asset Title'),
    t('ui.common.datachannels', 'Data Channels'),
    t('ui.common.rtu_plural', 'RTUs'),
    t('ui.common.product', 'Product'),
    t('ui.common.site', 'Site'),
    t('ui.common.tankdimension_plural', 'Tank Dimensions'),
    t('ui.common.eventrulegroup', 'Event Rule Group'),
  ];

  const validationSchema = useMemo(
    () =>
      buildValidationSchema(t, associatedAssets?.length, {
        destinationDomainText,
        descriptionText,
        siteText,
        rtuText,
        rtuChannelText,
        transferOtherAssetsText,
      }),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    [t]
  );

  const fetchTransferTargetDetails = useCallback(
    (selectedDomainId: string, { setFieldValue }: any) => {
      setIsFetchingTransferTargetDetails(true);
      return AdminApiService.AssetService.retrieveTransferAssetTargetDomainInfoById_RetrieveTransferAssetTargetDomainInfoById(
        {
          domainId: selectedDomainId,
        } as EvolveRetrieveTransferAssetTargetDomainInfoByIdRequest
      )
        .then((response) => {
          const result =
            response.retrieveTransferAssetTargetDomainInfoByIdResult;
          setTransferTargetDetails(result);

          const transferEventRuleGroups = result?.eventRuleGroups;
          const transferRosters = result?.rosters;
          const transferProducts = result?.products;
          const transferTankDimensions = result?.tankDimensions;

          eventRuleGroups?.forEach((eventRuleGroup) => {
            const sourceEventRuleGroupName = eventRuleGroup.eventRuleGroupName;

            const associatedEventRuleGroup = transferEventRuleGroups?.find(
              (transferEventRuleGroup) =>
                transferEventRuleGroup.description === sourceEventRuleGroupName
            );

            const selectedValue = associatedEventRuleGroup
              ? associatedEventRuleGroup.eventRuleGroupId
              : 0;

            setFieldValue(
              `eventRuleGroupMappings.'${eventRuleGroup.eventRuleGroupId}'`,
              selectedValue
            );

            eventRuleGroup.uniqueEventRules.forEach((eventRule) => {
              const sourceDescription = eventRule?.description;
              const associatedEventRule = associatedEventRuleGroup?.eventRules?.find(
                (transferEventRule) =>
                  transferEventRule?.description === sourceDescription
              );
              const selectedRuleValue = associatedEventRule
                ? associatedEventRule.eventRuleId
                : 0;

              setFieldValue(
                `eventRuleMappings.'${eventRule?.eventRuleId}'`,
                selectedRuleValue
              );
            });
          });

          rosters?.forEach((roster) => {
            const sourceRosterDescription = roster?.description;

            const associatedRoster = transferRosters?.find(
              (transferRoster) =>
                transferRoster.rosterName === sourceRosterDescription
            );
            const selectedValue = associatedRoster
              ? associatedRoster.rosterId
              : 0;

            setFieldValue(
              `rosterMappings.'${roster?.rosterId}'`,
              selectedValue
            );
          });

          products.forEach((product) => {
            const sourceProductName = product?.productName;

            const associatedProduct = transferProducts?.find(
              (transferProduct) =>
                transferProduct.productName === sourceProductName
            );
            const selectedValue = associatedProduct
              ? associatedProduct.productId
              : EMPTY_GUID;

            setFieldValue(
              `productMappings.${product?.productId}`,
              selectedValue
            );
          });

          tankDimensions.forEach((tankDimension) => {
            const sourceName = tankDimension?.tankDimensionName;

            const associatedTankDimension = transferTankDimensions?.find(
              (transferTankDimension) =>
                transferTankDimension.description === sourceName
            );
            const selectedValue = associatedTankDimension
              ? associatedTankDimension.tankDimensionId
              : EMPTY_GUID;

            setFieldValue(
              `tankDimensionMappings.${tankDimension?.tankDimensionId}`,
              selectedValue
            );
          });
        })
        .finally(() => {
          setIsFetchingTransferTargetDetails(false);
        });
    },
    []
  );

  const transferEventRuleGroups = transferTargetDetails?.eventRuleGroups;
  const transferRosters = transferTargetDetails?.rosters;
  const transferProducts = transferTargetDetails?.products;
  const transferTankDimensions = transferTargetDetails?.tankDimensions;

  return (
    <div>
      <Formik
        initialValues={formattedInitialValues}
        validateOnChange
        validateOnBlur
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, isValid, values, errors, setFieldValue }) => (
          <>
            <FormikEffect
              onChange={handleFormChange}
              isValid={isValid}
              restoreTouchedFields={restoreTouchedFields}
              restoreInitialValues={restoreInitialValues}
            />

            <CustomFormEffect
              eventRuleGroups={eventRuleGroups}
              transferEventRuleGroups={transferEventRuleGroups}
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
                      {t(
                        'ui.assetTransfer.transferError',
                        'Unable to transfer asset'
                      )}
                    </Alert>
                  </Grid>
                </Fade>
                <Grid item xs={12}>
                  <FormLinearProgress in={isSubmitting} />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DropdownAutocomplete<DomainDetailDto>
                    options={filteredDomains || []}
                    getOptionLabel={(option) => option?.name || ''}
                    onChange={(__: any, domain) => {
                      if (!domain || !domain.domainId) {
                        return setFieldValue('targetDomainId', '');
                      }

                      fetchTransferTargetDetails(domain.domainId, {
                        setFieldValue,
                      });

                      return setFieldValue('targetDomainId', domain.domainId);
                    }}
                    label={destinationDomainText}
                    textFieldProps={{ required: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GlobeIcon />
                        </InputAdornment>
                      ),
                    }}
                    renderOption={(option) => (
                      <Typography>{option.name}</Typography>
                    )}
                    style={{ maxWidth: 350 }}
                    fieldError={errors.targetDomainId}
                  />
                </Grid>
                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t('ui.common.assets', 'Assets')}
                  </PageSubHeader>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table
                      aria-label="selected assets for transfer table"
                      style={{ minWidth: 1000 }}
                    >
                      <TableHead>
                        <TableHeadRow>
                          <TableHeadCell colSpan={assetColumns.length}>
                            {t(
                              'ui.assetTransfer.assetsSelectedForTransfer',
                              'Assets Selected for transfer'
                            )}{' '}
                            ({selectedOriginalAssets?.length || 0})
                          </TableHeadCell>
                        </TableHeadRow>
                        <TableHeadRow>
                          {assetColumns.map((columnText) => (
                            <TableHeadCell key={columnText}>
                              {columnText}
                            </TableHeadCell>
                          ))}
                        </TableHeadRow>
                      </TableHead>
                      <TableBody>
                        {selectedOriginalAssets?.map((asset) => (
                          <TableBodyRow key={asset.assetId}>
                            <TableCell>{asset.assetTitle}</TableCell>
                            <TableCell>{asset.dataChannels?.length}</TableCell>
                            <TableCell>
                              {Array.from(
                                new Set(
                                  asset.dataChannels?.map(
                                    (channel) => channel.deviceId
                                  )
                                )
                              )
                                .filter(Boolean)
                                .join(', ')}
                            </TableCell>
                            <TableCell>
                              {Array.from(
                                new Set(
                                  asset.dataChannels?.map(
                                    (channel) => channel.productName
                                  )
                                )
                              )
                                .filter(Boolean)
                                .join(', ')}
                            </TableCell>
                            <TableCell>{asset.siteAddress}</TableCell>
                            <TableCell>
                              {Array.from(
                                new Set(
                                  asset.dataChannels?.map(
                                    (channel) => channel.tankDimensionName
                                  )
                                )
                              )
                                .filter(Boolean)
                                .join(', ')}
                            </TableCell>
                            <TableCell>{asset.eventRuleGroupName}</TableCell>
                          </TableBodyRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {associatedAssets && associatedAssets.length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <TableContainer>
                        <Table
                          aria-label="associated assets for transfer table"
                          style={{ minWidth: 1000 }}
                        >
                          <TableHead>
                            <TableHeadRow>
                              <TableHeadCell colSpan={assetColumns.length}>
                                {t(
                                  'ui.assetTransfer.associatedAssetsForTransfer',
                                  'Other Assets using the same RTUs as the Assets selected for transfer, these will need to be transferred as well'
                                )}{' '}
                                ({associatedAssets?.length || 0})
                              </TableHeadCell>
                            </TableHeadRow>
                            <TableHeadRow>
                              {assetColumns.map((columnText) => (
                                <TableHeadCell key={columnText}>
                                  {columnText}
                                </TableHeadCell>
                              ))}
                            </TableHeadRow>
                          </TableHead>
                          <TableBody>
                            {associatedAssets?.map((asset) => (
                              <TableBodyRow key={asset.assetId}>
                                <TableCell>{asset.assetTitle}</TableCell>
                                <TableCell>
                                  {asset.dataChannels?.length}
                                </TableCell>
                                <TableCell>
                                  {Array.from(
                                    new Set(
                                      asset.dataChannels?.map(
                                        (channel) => channel.deviceId
                                      )
                                    )
                                  )
                                    .filter(Boolean)
                                    .join(', ')}
                                </TableCell>
                                <TableCell>
                                  {Array.from(
                                    new Set(
                                      asset.dataChannels?.map(
                                        (channel) => channel.productName
                                      )
                                    )
                                  )
                                    .filter(Boolean)
                                    .join(', ')}
                                </TableCell>
                                <TableCell>{asset.siteAddress}</TableCell>
                                <TableCell>
                                  {Array.from(
                                    new Set(
                                      asset.dataChannels?.map(
                                        (channel) => channel.tankDimensionName
                                      )
                                    )
                                  )
                                    .filter(Boolean)
                                    .join(', ')}
                                </TableCell>
                                <TableCell>
                                  {asset.eventRuleGroupName}
                                </TableCell>
                              </TableBodyRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        component={CheckboxWithLabel}
                        name="transferOtherAssetsUsingTheSameRtu"
                        type="checkbox"
                        required
                        Label={{
                          label: t(
                            'ui.assetTransfer.transferOtherAssetsUsingTheSameRtu',
                            'Transfer other Assets using the same RTU(s)'
                          ),
                        }}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t('ui.common.events', 'Events')}
                  </PageSubHeader>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table aria-label="event rule group mapping table">
                      <TableHead>
                        <TableHeadRow>
                          <TableHeadCell colSpan={2}>
                            {t(
                              'ui.assetTransfer.eventRuleGroupMapping',
                              'Event Rule Group Mapping'
                            )}
                          </TableHeadCell>
                        </TableHeadRow>
                        <TableHeadRow>
                          <TableHeadCell>
                            {t('ui.assetTransfer.source', 'Source')}
                          </TableHeadCell>
                          <TableHeadCell>
                            {t('ui.assetTransfer.destination', 'Destination')}
                          </TableHeadCell>
                        </TableHeadRow>
                      </TableHead>
                      <TableBody>
                        {eventRuleGroups?.map((eventRuleGroup) => {
                          // NOTE: The field name is quoted because in some cases the values
                          // (like eventRuleGroup.eventRuleGroupId) are integers. Formik
                          // treats integers in nested fields as arrays instead of objects.
                          // This is a workaround.
                          const eventRuleGroupFieldWithFormikPathWorkaround = `eventRuleGroupMappings.'${eventRuleGroup.eventRuleGroupId}'`;
                          const eventRuleGroupValue = getIn(
                            values,
                            eventRuleGroupFieldWithFormikPathWorkaround
                          );
                          const reactKey = `${eventRuleGroup.eventRuleGroupId}-${eventRuleGroupValue}`;

                          return (
                            <TableBodyRow
                              // NOTE: Key is important since this entire JSX may
                              // not re-render when changing the value
                              key={reactKey}
                            >
                              <StyledTableCell>
                                {eventRuleGroup.eventRuleGroupName}
                              </StyledTableCell>
                              <StyledTableCell>
                                <Field
                                  id={`${eventRuleGroupFieldWithFormikPathWorkaround}-input`}
                                  component={CustomTextField}
                                  name={
                                    eventRuleGroupFieldWithFormikPathWorkaround
                                  }
                                  select
                                  SelectProps={{ displayEmpty: true }}
                                  disabled={!values.targetDomainId}
                                >
                                  <MenuItem value="" disabled>
                                    <span style={{ color: fadedTextColor }}>
                                      {t('ui.common.select', 'Select')}
                                    </span>
                                  </MenuItem>
                                  <MenuItem value={0}>
                                    {t(
                                      'ui.assetTransfer.createACopy',
                                      'Create a Copy'
                                    )}
                                  </MenuItem>
                                  {transferEventRuleGroups?.map(
                                    (transferEventRuleGroup) => (
                                      <MenuItem
                                        key={
                                          transferEventRuleGroup.eventRuleGroupId
                                        }
                                        value={
                                          transferEventRuleGroup.eventRuleGroupId
                                        }
                                      >
                                        {transferEventRuleGroup.description}
                                      </MenuItem>
                                    )
                                  )}
                                </Field>
                              </StyledTableCell>
                            </TableBodyRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                {eventRuleGroups?.map((eventRuleGroup) => {
                  const eventRuleGroupMappingPath = `eventRuleGroupMappings.'${eventRuleGroup.eventRuleGroupId!}'`;
                  const selectedEventRuleGroupId = getIn(
                    values,
                    eventRuleGroupMappingPath
                  );

                  if (!selectedEventRuleGroupId) {
                    return null;
                  }

                  const hasUniqueEventRules =
                    !eventRuleGroup.uniqueEventRules ||
                    eventRuleGroup.uniqueEventRules.length === 0;

                  return (
                    <Grid item xs={12}>
                      <TableContainer>
                        <Table aria-label="event rule mapping table">
                          <TableHead>
                            <TableHeadRow>
                              <TableHeadCell colSpan={4}>
                                {t(
                                  'ui.assetTransfer.eventRuleMapping',
                                  'Event Rule Mapping'
                                )}
                                {' - '}
                                {t(
                                  'ui.assetTransfer.eventRuleGroupOnlyContainsRules',
                                  '{{ruleName}} (Only contains Rules that are used by Assets being transferred)',
                                  {
                                    ruleName: eventRuleGroup.eventRuleGroupName,
                                  }
                                )}
                              </TableHeadCell>
                            </TableHeadRow>
                            <TableHeadRow>
                              <TableHeadCell>
                                {t('ui.assetTransfer.source', 'Source')}
                              </TableHeadCell>
                              <TableHeadCell>
                                {t(
                                  'ui.datachanneleventrule.datachanneltype',
                                  'Data Channel Type'
                                )}
                              </TableHeadCell>
                              <TableHeadCell>
                                {t(
                                  'ui.assetTransfer.eventRuleType',
                                  'Event Rule Type'
                                )}
                              </TableHeadCell>
                              <TableHeadCell>
                                {t(
                                  'ui.assetTransfer.destination',
                                  'Destination'
                                )}
                              </TableHeadCell>
                            </TableHeadRow>
                          </TableHead>
                          <TableBody>
                            {hasUniqueEventRules ? (
                              <TableBodyRow>
                                <TableCell colSpan={4}>
                                  <EmptyBlock>
                                    <BoldPrimaryText>
                                      {t(
                                        'ui.assetTransfer.noEventRulesForMapping',
                                        'No event rules for mapping'
                                      )}
                                    </BoldPrimaryText>
                                  </EmptyBlock>
                                </TableCell>
                              </TableBodyRow>
                            ) : (
                              eventRuleGroup.uniqueEventRules.map(
                                (eventRule) => {
                                  const eventRuleFieldWithFormikPathWorkaround = `eventRuleMappings.'${eventRule?.eventRuleId}'`;
                                  const eventRuleValue = getIn(
                                    values,
                                    eventRuleFieldWithFormikPathWorkaround
                                  );
                                  const reactKey = `${eventRule?.eventRuleId}-${eventRuleValue}`;

                                  return (
                                    <TableBodyRow key={reactKey}>
                                      <TableCell>
                                        {eventRule?.description}
                                      </TableCell>
                                      <TableCell>
                                        {
                                          dataChannelTypeTextMapping[
                                            eventRule?.dataChannelType!
                                          ]
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {
                                          eventRuleTypeTextMapping[
                                            eventRule?.eventRuleType!
                                          ]
                                        }
                                      </TableCell>
                                      <TableCell>
                                        <Field
                                          id={`eventRuleMappings.${eventRule?.eventRuleId}-input`}
                                          component={CustomTextField}
                                          name={`eventRuleMappings.'${eventRule?.eventRuleId}'`}
                                          select
                                          SelectProps={{ displayEmpty: true }}
                                          disabled={!values.targetDomainId}
                                          style={{ minWidth: 250 }}
                                        >
                                          <MenuItem value="" disabled>
                                            <span
                                              style={{ color: fadedTextColor }}
                                            >
                                              {t('ui.common.select', 'Select')}
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={0}>
                                            {t(
                                              'ui.assetTransfer.doNotUse',
                                              'Do Not Use'
                                            )}
                                          </MenuItem>
                                          {transferEventRuleGroups
                                            ?.find(
                                              (transferEventRuleGroup) =>
                                                transferEventRuleGroup.eventRuleGroupId ===
                                                selectedEventRuleGroupId
                                            )
                                            ?.eventRules?.filter(
                                              (transferEventRule) =>
                                                transferEventRule.eventRuleType ===
                                                  eventRule?.eventRuleType &&
                                                transferEventRule.dataChannelType ===
                                                  eventRule?.dataChannelType
                                            )
                                            .map((transferEventRuleGroup) => {
                                              return (
                                                <MenuItem
                                                  key={
                                                    transferEventRuleGroup.eventRuleId
                                                  }
                                                  value={
                                                    transferEventRuleGroup.eventRuleId
                                                  }
                                                >
                                                  {
                                                    transferEventRuleGroup.description
                                                  }
                                                </MenuItem>
                                              );
                                            })}
                                        </Field>
                                      </TableCell>
                                    </TableBodyRow>
                                  );
                                }
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t('ui.common.rosters', 'Rosters')}
                  </PageSubHeader>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table aria-label="rosters mapping table">
                      <TableHead>
                        <TableHeadRow>
                          <TableHeadCell colSpan={2}>
                            {t(
                              'ui.assetTransfer.rosterMapping',
                              'Roster Mapping'
                            )}
                          </TableHeadCell>
                        </TableHeadRow>
                        <TableHeadRow>
                          <HalfWidthTableHeadCell>
                            {t('ui.assetTransfer.source', 'Source')}
                          </HalfWidthTableHeadCell>
                          <HalfWidthTableHeadCell>
                            {t('ui.assetTransfer.destination', 'Destination')}
                          </HalfWidthTableHeadCell>
                        </TableHeadRow>
                      </TableHead>
                      <TableBody>
                        {!rosters || rosters.length === 0 ? (
                          <TableBodyRow>
                            <TableCell colSpan={2}>
                              <EmptyBlock>
                                <BoldPrimaryText>
                                  {t(
                                    'ui.assetTransfer.noRostersForMapping',
                                    'No rosters available for mapping'
                                  )}
                                </BoldPrimaryText>
                              </EmptyBlock>
                            </TableCell>
                          </TableBodyRow>
                        ) : (
                          rosters?.map((roster) => (
                            <TableBodyRow
                              // NOTE: Key is important since this entire JSX may
                              // not re-render when changing the value
                              key={`${roster?.rosterId}-${
                                values.rosterMappings?.[`'${roster?.rosterId}'`]
                              }`}
                            >
                              <StyledTableCell>
                                {roster?.description}
                              </StyledTableCell>
                              <StyledTableCell>
                                <Field
                                  id={`rosterMappings.'${roster?.rosterId}'-input`}
                                  component={CustomTextField}
                                  name={`rosterMappings.'${roster?.rosterId}'`}
                                  select
                                  disabled={!values.targetDomainId}
                                >
                                  <MenuItem value="" disabled>
                                    <span style={{ color: fadedTextColor }}>
                                      {t('ui.common.select', 'Select')}
                                    </span>
                                  </MenuItem>
                                  <MenuItem value={0}>
                                    {t('ui.common.none', 'None')}
                                  </MenuItem>
                                  {transferRosters?.map((transferRoster) => (
                                    <MenuItem
                                      key={transferRoster.rosterId}
                                      value={transferRoster.rosterId}
                                    >
                                      {transferRoster.rosterName}
                                    </MenuItem>
                                  ))}
                                </Field>
                              </StyledTableCell>
                            </TableBodyRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t(
                      'ui.assetTransfer.tankAndProductHeader',
                      'Tank & Product'
                    )}
                  </PageSubHeader>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table aria-label="product mapping table">
                      <TableHead>
                        <TableHeadRow>
                          <TableHeadCell colSpan={2}>
                            {t(
                              'ui.assetTransfer.productMapping',
                              'Product Mapping'
                            )}
                          </TableHeadCell>
                        </TableHeadRow>
                        <TableHeadRow>
                          <HalfWidthTableHeadCell>
                            {t('ui.assetTransfer.source', 'Source')}
                          </HalfWidthTableHeadCell>
                          <HalfWidthTableHeadCell>
                            {t('ui.assetTransfer.destination', 'Destination')}
                          </HalfWidthTableHeadCell>
                        </TableHeadRow>
                      </TableHead>
                      <TableBody>
                        {!products || products.length === 0 ? (
                          <TableBodyRow>
                            <TableCell colSpan={2}>
                              <EmptyBlock>
                                <BoldPrimaryText>
                                  {t(
                                    'ui.assetTransfer.noProductsForMapping',
                                    'No products available for mapping'
                                  )}
                                </BoldPrimaryText>
                              </EmptyBlock>
                            </TableCell>
                          </TableBodyRow>
                        ) : (
                          products?.map((product) => (
                            <TableBodyRow
                              // NOTE: Key is important since this entire JSX may
                              // not re-render when changing the value
                              key={`${product?.productId!}-${
                                values.productMappings?.[product?.productId!]
                              }`}
                            >
                              <StyledTableCell>
                                {product?.productName}
                              </StyledTableCell>
                              <StyledTableCell>
                                <Field
                                  id={`productMappings.${product?.productId}-input`}
                                  component={CustomTextField}
                                  name={`productMappings.${product?.productId}`}
                                  select
                                  disabled={!values.targetDomainId}
                                >
                                  <MenuItem value="" disabled>
                                    <span style={{ color: fadedTextColor }}>
                                      {t('ui.common.select', 'Select')}
                                    </span>
                                  </MenuItem>
                                  <MenuItem value={EMPTY_GUID}>
                                    {t(
                                      'ui.assetTransfer.createACopy',
                                      'Create a Copy'
                                    )}
                                  </MenuItem>
                                  {transferProducts?.map((transferProduct) => (
                                    <MenuItem
                                      key={transferProduct.productId}
                                      value={transferProduct.productId}
                                    >
                                      {transferProduct.productName}
                                    </MenuItem>
                                  ))}
                                </Field>
                              </StyledTableCell>
                            </TableBodyRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}>
                  <TableContainer>
                    <Table aria-label="tank dimension mapping table">
                      <TableHead>
                        <TableHeadRow>
                          <TableHeadCell colSpan={2}>
                            {t(
                              'ui.assetTransfer.tankDimensionsMapping',
                              'Tank Dimensions Mapping'
                            )}
                          </TableHeadCell>
                        </TableHeadRow>
                        <TableHeadRow>
                          <HalfWidthTableHeadCell>
                            {t('ui.assetTransfer.source', 'Source')}
                          </HalfWidthTableHeadCell>
                          <HalfWidthTableHeadCell>
                            {t('ui.assetTransfer.destination', 'Destination')}
                          </HalfWidthTableHeadCell>
                        </TableHeadRow>
                      </TableHead>
                      <TableBody>
                        {!tankDimensions || tankDimensions.length === 0 ? (
                          <TableBodyRow>
                            <TableCell colSpan={2}>
                              <EmptyBlock>
                                <BoldPrimaryText>
                                  {t(
                                    'ui.assetTransfer.noTankDimensionsForMapping',
                                    'No tank dimensions for mapping'
                                  )}
                                </BoldPrimaryText>
                              </EmptyBlock>
                            </TableCell>
                          </TableBodyRow>
                        ) : (
                          tankDimensions?.map((tankDimension) => (
                            <TableBodyRow
                              // NOTE: Key is important since this entire JSX may
                              // not re-render when changing the value
                              key={`${tankDimension?.tankDimensionId}-${
                                values.tankDimensionMappings?.[
                                  tankDimension?.tankDimensionId!
                                ]
                              }`}
                            >
                              <StyledTableCell>
                                {tankDimension?.tankDimensionName}
                              </StyledTableCell>
                              <StyledTableCell>
                                <Field
                                  id={`tankDimensionMappings.${tankDimension?.tankDimensionId}-input`}
                                  component={CustomTextField}
                                  name={`tankDimensionMappings.${tankDimension?.tankDimensionId}`}
                                  select
                                  disabled={!values.targetDomainId}
                                >
                                  <MenuItem value="" disabled>
                                    <span style={{ color: fadedTextColor }}>
                                      {t('ui.common.select', 'Select')}
                                    </span>
                                  </MenuItem>
                                  <MenuItem value={EMPTY_GUID}>
                                    {t(
                                      'ui.assetTransfer.createACopy',
                                      'Create a Copy'
                                    )}
                                  </MenuItem>
                                  {transferTankDimensions
                                    ?.filter(
                                      (transferTankDimension) =>
                                        transferTankDimension.tankDimensionHash ===
                                        tankDimension?.tankDimensionHash
                                    )
                                    .map((transferTankDimension) => (
                                      <MenuItem
                                        key={
                                          transferTankDimension.tankDimensionId
                                        }
                                        value={
                                          transferTankDimension.tankDimensionId
                                        }
                                      >
                                        {transferTankDimension.description}
                                      </MenuItem>
                                    ))}
                                </Field>
                              </StyledTableCell>
                            </TableBodyRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12}>
                  <PageSubHeader dense>
                    {t('ui.common.options', 'Options')}
                  </PageSubHeader>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="transferDataChannelReadings"
                    type="checkbox"
                    Label={{
                      label: t(
                        'ui.assetTransfer.transferDataChannelReadings',
                        'Transfer Data Channel Readings'
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="transferAssetNotes"
                    type="checkbox"
                    Label={{
                      label: t(
                        'ui.assetTransfer.transferAssetNotes',
                        'Transfer Asset Notes'
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="transferSiteNotes"
                    type="checkbox"
                    Label={{
                      label: t(
                        'ui.assetTransfer.transferSiteNotes',
                        'Transfer Site Notes'
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="transferCustomPropertyValues"
                    type="checkbox"
                    Label={{
                      label: t(
                        'ui.assetTransfer.transferCustomPropertyValues',
                        'Transfer Custom Property Values'
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="deleteSourceSiteIfNotUsed"
                    type="checkbox"
                    Label={{
                      label: t(
                        'ui.assetTransfer.deleteSourceSiteIfNotUsed',
                        'Delete Sites of transferred Assets if no longer used'
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="deleteSourceTankDimensionIfNotUsed"
                    type="checkbox"
                    Label={{
                      label: t(
                        'ui.assetTransfer.deleteSourceTankDimensionIfNotUsed',
                        'Delete Tank Dimensions of transferred Assets if no longer used'
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    component={CheckboxWithLabel}
                    name="deleteSourceProductIfNotUsed"
                    type="checkbox"
                    Label={{
                      label: t(
                        'ui.assetTransfer.deleteSourceProductIfNotUsed',
                        'Delete Products of transferred Assets if no longer used'
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default SiteFormWrapper;
