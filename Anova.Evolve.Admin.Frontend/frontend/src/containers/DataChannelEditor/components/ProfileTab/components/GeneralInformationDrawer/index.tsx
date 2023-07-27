/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
  AssetDeviceType,
  DataChannelDataSource,
  DataChannelGeneralInfoDTO,
  DataChannelPublishedCommentsDTO,
  DataChannelReportDTO,
  DomainInfoDto,
  RtuInfoDTO,
} from 'api/admin/api';
import { APIQueryKey } from 'api/react-query/helpers';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EditorBox from 'components/EditorBox';
import EditorPageIntro from 'components/EditorPageIntro';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import RTUAutoComplete from 'components/forms/form-fields/RTUAutoComplete';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import DropdownAutocomplete from 'components/forms/styled-fields/DropdownAutocomplete';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { useGetPublishedDomains } from 'containers/DataChannelEditor/hooks/useGetPublishedDomains';
import { useGetRtuChannelInfoByRtuId } from 'containers/DataChannelEditor/hooks/useGetRtuChannelInfoByRtuId';
import { useSaveGeneralInformation } from 'containers/DataChannelEditor/hooks/useSaveGeneralInformation';
import { Field, Formik, FormikHelpers } from 'formik';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import {
  buildDataSourceTypeTextMapping,
  getDataSourceTypeOptions,
} from 'utils/i18n/enum-to-text';
import { StyledFieldLabelText, StyledValueText } from '../../styles';
import SetAsPrimaryDialog from './components/SetAsPrimaryDialog';
import GeneralInfoFormEffect from './GeneralInfoFormEffect';
import {
  formatInitialValues,
  formatValuesForApi,
  mapApiErrorsToFields,
} from './helpers';
import { Values } from './types';

interface Props {
  dataChannelDetails: DataChannelReportDTO | null | undefined;
  isHeliumIso?: boolean;
  cancelCallback: () => void;
  saveAndExitCallback?: () => void;
}

const GeneralInformationDrawer = ({
  dataChannelDetails,
  isHeliumIso,
  cancelCallback,
  saveAndExitCallback,
}: Props) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const formattedInitialValues = formatInitialValues(dataChannelDetails);
  const queryClient = useQueryClient();

  const getPublishedDomainsApi = useGetPublishedDomains();
  const updateGeneralInfoApi = useSaveGeneralInformation({
    onSuccess: () => {
      queryClient.invalidateQueries(APIQueryKey.getDataChannelDetailsById);
    },
  });

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    // Clear the error state when submitting
    updateGeneralInfoApi.reset();
    const formattedValuesForApi = formatValuesForApi(values);
    return updateGeneralInfoApi
      .mutateAsync({
        ...formattedValuesForApi,
        dataChannelId: dataChannelDetails?.dataChannelId!,
      } as DataChannelGeneralInfoDTO)
      .then(() => {
        dispatch(enqueueSaveSuccessSnackbar(t));
      })
      .catch((error) => {
        const formattedErrors = mapApiErrorsToFields(t, error as any);
        if (formattedErrors) {
          formikBag.setErrors(formattedErrors as any);
          formikBag.setStatus({ errors: formattedErrors });
        }
      });
  };

  const dataSourceOptions = getDataSourceTypeOptions(t).filter(
    (options) =>
      options.value !== DataChannelDataSource.DataChannel &&
      options.value !== DataChannelDataSource.PublishedDataChannel
  );
  const dataSourceTypeTextMapping = buildDataSourceTypeTextMapping(t);

  const initialSelectedRtuId = dataChannelDetails?.dataSourceInfo
    ?.rtuDataSourceTypeInfo?.rtuId
    ? RtuInfoDTO.fromJS({
        rtuId: dataChannelDetails?.dataSourceInfo?.rtuDataSourceTypeInfo?.rtuId,
        deviceId:
          dataChannelDetails?.dataSourceInfo?.rtuDataSourceTypeInfo
            ?.rtuDeviceId,
      })
    : null;
  const [selectedRtuId, setSelectedRtuId] = useState<RtuInfoDTO | null>(
    initialSelectedRtuId
  );

  const [publishedComments, setPublishedComments] = useState<
    DataChannelPublishedCommentsDTO[] | null
  >([]);

  const publishedDomains = useMemo(() => getPublishedDomainsApi.data || [], [
    getPublishedDomainsApi.data,
  ]);

  const hasAdditionalProperties =
    dataChannelDetails?.assetInfo?.assetTypeId === AssetDeviceType.GasMixer ||
    dataChannelDetails?.assetInfo?.assetTypeId ===
      AssetDeviceType.HeliumIsoContainer;

  const rtuChannelInfoApi = useGetRtuChannelInfoByRtuId(
    selectedRtuId?.rtuId!,
    dataChannelDetails?.dataChannelId!
  );

  const rtuChannelData = rtuChannelInfoApi.data;

  const isFetchingRtuChannel = rtuChannelInfoApi.isFetching;

  const [isSetAsPrimaryWarningOpen, setIsSetAsPrimaryWarningOpen] = useState(
    false
  );
  const closeSetAsPrimaryWarningDialog = () => {
    setIsSetAsPrimaryWarningOpen(false);
  };

  const openSetAsPrimaryWarningDialog = () => {
    setIsSetAsPrimaryWarningOpen(true);
  };

  return (
    <Formik<Values>
      initialValues={formattedInitialValues}
      onSubmit={handleSubmit}
    >
      {({
        isSubmitting,
        errors,
        values,
        setFieldValue,
        submitForm,
        initialValues,
      }) => {
        return (
          <>
            {/* NOTE: Additional business logic is included in this form effect */}
            <GeneralInfoFormEffect
              values={values}
              rtuChannelData={rtuChannelData}
              setFieldValue={setFieldValue}
              setPublishedComments={setPublishedComments}
              openSetAsPrimaryWarningDialog={openSetAsPrimaryWarningDialog}
            />

            <SetAsPrimaryDialog
              setFieldValue={setFieldValue}
              isSetAsPrimaryWarningOpen={isSetAsPrimaryWarningOpen}
              closeSetAsPrimaryWarningDialog={closeSetAsPrimaryWarningDialog}
            />

            <CustomThemeProvider forceThemeType="dark">
              <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                <EditorPageIntro
                  showSaveOptions
                  title={t('ui.common.generalinfo', 'General Information')}
                  cancelCallback={cancelCallback}
                  submitForm={submitForm}
                  isSubmitting={isSubmitting}
                  submissionResult={updateGeneralInfoApi.data}
                  submissionError={updateGeneralInfoApi.error}
                  saveAndExitCallback={saveAndExitCallback}
                />
              </PageIntroWrapper>
            </CustomThemeProvider>
            <Box mt={3} />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <EditorBox>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t(
                          'ui.datachannel.datachanneltype',
                          'Data Channel Type'
                        )}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={8}>
                      <StyledValueText>
                        {dataChannelDetails?.dataChannelTypeAsText}
                      </StyledValueText>
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t(
                          'ui.datachannel.datachanneldescription',
                          'Data Channel Description'
                        )}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={8}>
                      <Field
                        id="dataChannelDescription-input"
                        name="dataChannelDescription"
                        component={CustomTextField}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t(
                          'ui.common.datachanneltemplate',
                          'Data Channel Template'
                        )}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={8}>
                      <StyledValueText>
                        {dataChannelDetails?.dataChannelTemplateDescription}
                      </StyledValueText>
                      {/* <Field
                        id="dataChannelTemplateId-input"
                        name="dataChannelTemplateId"
                        component={Autocomplete}
                        textFieldProps={{
                          placeholder: t('ui.common.select', 'Select'),
                        }}
                        options={dataChannelTemplateOptions}
                        getOptionLabel={(option: MockDataChannelTemplate) =>
                          option.description
                        }
                        getSelectedValue={(
                          newValue: MockDataChannelTemplate | null
                        ) => {
                          return newValue || null;
                        }}
                        isValueSelected={(
                          option: MockDataChannelTemplate | null,
                          currentValue: MockDataChannelTemplate | null
                        ) => {
                          return (
                            option?.dataChannelTemplateId ===
                            currentValue?.dataChannelTemplateId
                          );
                        }}
                        getFormFieldValue={(
                          option: MockDataChannelTemplate | null
                        ) => {
                          return option || null;
                        }}
                      /> */}
                    </Grid>
                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.serialnumber', 'Serial Number')}
                      </StyledFieldLabelText>
                    </Grid>
                    <Grid item xs={8}>
                      <Field
                        id="serialNumber-input"
                        name="serialNumber"
                        component={CustomTextField}
                      />
                    </Grid>

                    {hasAdditionalProperties && (
                      <>
                        {dataChannelDetails?.assetInfo?.assetTypeId ===
                          AssetDeviceType.GasMixer && (
                          <>
                            <Grid item xs={4}>
                              <StyledFieldLabelText>
                                {t(
                                  'ui.dataChannelEditor.gasMixerDataChannelType',
                                  'Gas Mixer Data Channel Type'
                                )}
                              </StyledFieldLabelText>
                            </Grid>
                            <Grid item xs={8}>
                              <StyledValueText>
                                {
                                  dataChannelDetails?.assetInfo
                                    ?.gasMixerAssetInfo
                                    ?.gasMixerDataChannelTypeAsText
                                }
                              </StyledValueText>
                              {/* <Field
                                id="gasMixerDataChannelTypeId-input"
                                name="gasMixerDataChannelTypeId"
                                component={CustomTextField}
                                select
                                SelectProps={{ displayEmpty: true }}
                              >
                                <MenuItem value="" disabled>
                                  <SelectItem />
                                </MenuItem>
                                {scalingModeOptions?.map((option) => (
                                  <MenuItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Field> */}
                            </Grid>
                          </>
                        )}
                        {isHeliumIso && (
                          <>
                            <Grid item xs={4}>
                              <StyledFieldLabelText>
                                {t(
                                  'ui.dataChannelEditor.designCurve',
                                  'Design Curve'
                                )}
                              </StyledFieldLabelText>
                            </Grid>
                            <Grid item xs={8}>
                              <StyledValueText>
                                {
                                  dataChannelDetails?.assetInfo
                                    ?.heliumIsoAssetInfo?.designCurveTypeAsText
                                }
                              </StyledValueText>
                            </Grid>
                          </>
                        )}
                      </>
                    )}

                    <Grid item xs={4}>
                      <StyledFieldLabelText>
                        {t('ui.datachannel.datasource', 'Data Source')}
                      </StyledFieldLabelText>
                    </Grid>
                    {initialValues.dataChannelDataSourceTypeId ===
                    DataChannelDataSource.PublishedDataChannel ? (
                      <Grid item xs={8}>
                        <StyledValueText>
                          {
                            dataSourceTypeTextMapping[
                              dataChannelDetails?.dataSourceInfo
                                ?.dataChannelDataSourceTypeId!
                            ]
                          }
                        </StyledValueText>
                      </Grid>
                    ) : (
                      <Grid item xs={8}>
                        <Field
                          id="dataChannelDataSourceTypeId-input"
                          name="dataChannelDataSourceTypeId"
                          component={CustomTextField}
                          select
                          SelectProps={{ displayEmpty: true }}
                        >
                          {dataSourceOptions.map((option) => (
                            <MenuItem key={option.label} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Field>
                      </Grid>
                    )}

                    {values.dataChannelDataSourceTypeId ===
                      DataChannelDataSource.RTU && (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.rtu.rtuid', 'RTU ID')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="rtuId-input"
                            name="rtuId"
                            component={RTUAutoComplete}
                            selectedOption={selectedRtuId}
                            onChange={setSelectedRtuId}
                            textFieldProps={{
                              placeholder: t(
                                'ui.common.enterSearchCriteria',
                                'Enter Search Criteria...'
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.datachannel.rtuChannelId', 'RTU Channel ID')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            id="rtuChannelId-input"
                            name="rtuChannelId"
                            component={CustomTextField}
                            select
                            SelectProps={{ displayEmpty: true }}
                            disabled={isFetchingRtuChannel || isSubmitting}
                          >
                            <MenuItem value="" disabled>
                              <SelectItem />
                            </MenuItem>
                            {rtuChannelData?.map((option) => (
                              <MenuItem
                                key={option.channelType}
                                value={option.id}
                              >
                                {option.channelNumber}{' '}
                                {option.isInUse
                                  ? t('ui.datachannel.channelinuse', '(in use)')
                                  : t(
                                      'ui.datachannel.channelnotinuse',
                                      '(not in use)'
                                    )}
                              </MenuItem>
                            ))}
                          </Field>
                        </Grid>

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t('ui.datachannel.setAsPrimary', 'Set as Primary')}
                          </StyledFieldLabelText>
                        </Grid>
                        <Grid item xs={8}>
                          <Field
                            // "Set As Primary" field, was previously named setAsMaster
                            id="setAsPrimary-input"
                            name="setAsPrimary"
                            component={SwitchWithLabel}
                            type="checkbox"
                            disabled={values.setAsPrimary || isSubmitting}
                          />
                        </Grid>
                      </>
                    )}

                    {values.dataChannelDataSourceTypeId ===
                      DataChannelDataSource.PublishedDataChannel && (
                      <>
                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t(
                              'ui.datachannel.publishedDataChannelDomain',
                              'Published Data Channel Domain'
                            )}
                          </StyledFieldLabelText>
                        </Grid>

                        {initialValues.dataChannelDataSourceTypeId ===
                        DataChannelDataSource.PublishedDataChannel ? (
                          <Grid item xs={8}>
                            <StyledValueText>
                              {
                                dataChannelDetails?.dataSourceInfo
                                  ?.publishedDataSourceTypeInfo
                                  ?.publishedDataChannelSourceDomainName
                              }
                            </StyledValueText>
                          </Grid>
                        ) : (
                          <Grid item xs={8}>
                            <DropdownAutocomplete<DomainInfoDto>
                              id="publishedDataChannelSourceDomainId-input"
                              options={publishedDomains}
                              getOptionLabel={(domain) => domain?.name || ''}
                              value={
                                publishedDomains.find(
                                  (domain) =>
                                    domain.id ===
                                    values.publishedDataChannelSourceDomainId
                                ) || null
                              }
                              onChange={(__: any, domain) => {
                                if (!domain || !domain.id) {
                                  return setFieldValue(
                                    'publishedDataChannelSourceDomainId',
                                    ''
                                  );
                                }

                                return setFieldValue(
                                  'publishedDataChannelSourceDomainId',
                                  domain.id
                                );
                              }}
                              renderOption={(option) => (
                                <Typography>{option.name}</Typography>
                              )}
                              fieldError={
                                errors.publishedDataChannelSourceDomainId
                              }
                            />
                          </Grid>
                        )}

                        <Grid item xs={4}>
                          <StyledFieldLabelText>
                            {t(
                              'ui.datachannel.publishedComments',
                              'Published Comments'
                            )}
                          </StyledFieldLabelText>
                        </Grid>

                        {initialValues.dataChannelDataSourceTypeId ===
                        DataChannelDataSource.PublishedDataChannel ? (
                          <Grid item xs={8}>
                            <StyledValueText>
                              {
                                dataChannelDetails?.dataSourceInfo
                                  ?.publishedDataSourceTypeInfo
                                  ?.publishedComments
                              }
                            </StyledValueText>
                          </Grid>
                        ) : (
                          <Grid item xs={8}>
                            <DropdownAutocomplete<DataChannelPublishedCommentsDTO>
                              id="publishedCommentsId-input"
                              options={publishedComments || []}
                              getOptionLabel={(comment) =>
                                comment?.publishedComments || ''
                              }
                              value={
                                publishedComments?.find(
                                  (comment) =>
                                    comment.id === values.publishedCommentsId
                                ) || null
                              }
                              onChange={(__: any, comment) => {
                                if (!comment || !comment.id) {
                                  return setFieldValue(
                                    'publishedCommentsId',
                                    ''
                                  );
                                }

                                return setFieldValue(
                                  'publishedCommentsId',
                                  comment.id
                                );
                              }}
                              renderOption={(option) => (
                                <Typography>
                                  {option.publishedComments}
                                </Typography>
                              )}
                              fieldError={errors.publishedCommentsId}
                            />
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>
                </EditorBox>
              </Grid>
            </Grid>
          </>
        );
      }}
    </Formik>
  );
};

export default GeneralInformationDrawer;
