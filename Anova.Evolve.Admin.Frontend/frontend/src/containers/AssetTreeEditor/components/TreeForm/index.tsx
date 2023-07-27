import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { CustomPropertyTypeInfo, DataChannelType } from 'api/admin/api';
import Alert from 'components/Alert';
import EditorBox from 'components/EditorBox';
import FormLinearProgress from 'components/FormLinearProgress';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import MultiSelect from 'components/forms/form-fields/MultiSelect';
import FormikEffect from 'components/forms/FormikEffect';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import FolderIcon from 'components/icons/FolderIcon';
import PageSubHeader from 'components/PageSubHeader';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { TFunction } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { entityDetailBorderColor } from 'styles/colours';
import { buildDataChannelTypeTextMapping } from 'utils/i18n/enum-to-text';
import * as Yup from 'yup';
import { Values } from './types';

const VertialAlignedFolderIcon = styled(FolderIcon)`
  vertical-align: middle;
`;

const StyledLevelText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  line-height: 18px;
`;

const StyledCustomTextField = styled(CustomTextField)`
  & .MuiInput-root {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
`;

const buildDefaultLevelListOptions = (t: TFunction) => [
  {
    alias: 'AssetDescription',
    name: t('ui.common.description', 'Description'),
  },
  { alias: 'CustomerName', name: t('ui.common.customername', 'Customer Name') },
  { alias: 'ProductName', name: t('ui.product.productname', 'Product Name') },
  {
    alias: 'Address1',
    name: t('ui.assetTree.streetAddress1', 'Street Address 1'),
  },
  {
    alias: 'Address2',
    name: t('ui.assetTree.streetAddress2', 'Street Address 2'),
  },
  { alias: 'City', name: t('ui.common.city', 'City') },
  {
    alias: 'State',
    name: t('ui.assetTree.stateOrProvince', 'State or Province'),
  },
  { alias: 'Country', name: t('ui.common.country', 'Country') },
  {
    alias: 'PostalCode',
    name: t('ui.assetTree.zipOrPostalCode', 'Zip or Postal Code'),
  },
  {
    alias: 'DataChannelTypeName',
    name: t('ui.assetTree.dataChannelType', 'DataChannel Type'),
  },
  { alias: 'RTUDeviceId', name: t('ui.common.deviceid', 'Device Id') },
  {
    alias: 'ChannelNumber',
    name: t('ui.datachannel.rtuchannel', 'RTU Channel'),
  },
  { alias: 'CarrierName', name: t('ui.common.carrier', 'Carrier') },
  { alias: 'FtpEnabled', name: t('ui.common.FTPEnabled', 'FTP Enabled') },
  { alias: 'FtpDomain', name: t('ui.datachannel.ftpdomain', 'FTP Domain') },
  {
    alias: 'CustomerContactName',
    name: t('ui.assetTree.customerContact', 'Customer Contact'),
  },
  {
    alias: 'InstalledTechName',
    name: t('ui.assetTree.installationTech', 'Installation Tech'),
  },
  {
    alias: 'ProductGroup',
    name: t('ui.product.productgroup', 'Product Group'),
  },
];
// validation
const buildTreeSchema = (
  t: TFunction,
  translationTexts: Record<string, string>
) => {
  const treeNameRequiredText = t(
    'validate.common.isrequired',
    '{{field}} is required.',
    {
      field: translationTexts.treeNameText,
    }
  );

  return Yup.object().shape({
    name: Yup.string()
      .typeError(treeNameRequiredText)
      .required(treeNameRequiredText),
  });
};

const defaultInitialValues = {
  name: '',
  description: '',
  dataChannelTypes: '',
  availbleDomainCustomPropetyList: '',
  level1: '',
  level2: '',
  level3: '',
  level4: '',
};

interface TreeFormProps
  extends Pick<
    FormikProps<Values>,
    | 'isSubmitting'
    | 'isValid'
    | 'errors'
    | 'touched'
    | 'setFieldTouched'
    | 'values'
    | 'setFieldValue'
  > {
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  submissionError?: any;
  expression?: string;
  handleFormChange: (formik: FormikProps<Values>) => void;
  availableDataChannelTypeList: number[] | null | undefined;
  availableDomainCustomPropertyList:
    | CustomPropertyTypeInfo[]
    | null
    | undefined;
}

const TreeForm = ({
  isSubmitting,
  availableDataChannelTypeList,
  availableDomainCustomPropertyList,
  submissionError,
}: TreeFormProps) => {
  const { t } = useTranslation();
  const treeNameRequiredText = t('ui.common.description', 'Description');
  const [dataChannelTypesList, setDataChannelTypesList] = useState([
    DataChannelType.Level,
    DataChannelType.BatteryVoltage,
    DataChannelType.RtuCaseTemperature,
  ]);
  useEffect(() => {
    // set initial data channel types for drop down
    // ts ignore because the api spec says it can be null but the business logic doesnt acutally allow it. causing these type errors.
    // @ts-ignore
    setDataChannelTypesList(availableDataChannelTypeList);
  }, []);

  // pull out names and alias from customProperties
  const domainCustomPropertyResult =
    availableDomainCustomPropertyList?.map(({ name, alias }) => ({
      name,
      alias,
      displayLabel: `${name} (Custom ${alias})`,
    })) || [];

  const defaultLevelListOptions = buildDefaultLevelListOptions(t);
  // add custom properties to levellist
  const levelList = [...defaultLevelListOptions, ...domainCustomPropertyResult];
  // sort levellist options alphabetically
  const sortedLevelList = [...levelList]?.sort(function sorter(a, b) {
    const nameA = a.name?.toLowerCase();
    const nameB = b.name?.toLowerCase();
    if (!nameA) {
      return -1;
    }
    if (!nameB) {
      return 1;
    }
    if (nameA < nameB) {
      // sort string ascending
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0; // default return value (no sorting)
  });

  // mapping for data channels mult select
  const dataChannelTypeTextMapping = buildDataChannelTypeTextMapping(t);
  // will need to set up a wrapper for the expression

  return (
    <Form>
      <Grid container spacing={2}>
        {/*
          TODO: Find a better way to handle errors + loading state. At the
          moment the shift is too jarring where the error appears and takes up
          space pushing the loading spinner down
        */}
        <Fade in={!!submissionError} unmountOnExit>
          <Grid item xs={12}>
            <Alert severity="error">
              {t('ui.assetTree.saveError', 'Unable to save asset tree')}
            </Alert>
          </Grid>
        </Fade>
        <Grid item xs={12}>
          <FormLinearProgress in={isSubmitting} />
        </Grid>
        <Grid item xs={12}>
          <PageSubHeader dense>
            {t('ui.assetTree.assetTreeInformation', 'Tree Information')}
          </PageSubHeader>
        </Grid>
        <Grid item xs={12}>
          <EditorBox>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={3} direction="column">
                  <Grid item>
                    <Field
                      id="description-input"
                      component={CustomTextField}
                      required
                      name="name"
                      label={treeNameRequiredText}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={0} direction="column">
                  <Grid item xs={12}>
                    <Field
                      id="dataChannelTypes-input"
                      component={MultiSelect}
                      select
                      fullWidth
                      options={dataChannelTypesList}
                      renderValue={(option: DataChannelType) => {
                        // @ts-ignore
                        return dataChannelTypeTextMapping[option];
                      }}
                      name="dataChannelTypes"
                      label={t(
                        'ui.assetTree.dataChannelType',
                        'Data Channel Types'
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </EditorBox>
        </Grid>

        <Grid item xs={12}>
          <PageSubHeader dense>
            {t('ui.assetTree.assetTreeHierarchy', 'Tree Hierarchy')}
          </PageSubHeader>
        </Grid>
        <Grid item xs={12}>
          <EditorBox>
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((fieldNumber) => {
                const fieldName = `level${fieldNumber}`;
                return (
                  <Grid item xs={12} key={fieldNumber}>
                    <Grid container alignItems="stretch">
                      <Grid item>
                        <Box p={1} height="100%">
                          <Grid
                            container
                            alignItems="center"
                            spacing={2}
                            style={{
                              height: '100%',
                              border: `1px solid ${entityDetailBorderColor}`,
                              padding: '0 8px',
                              borderRadius: '10px 0 0 10px',
                            }}
                          >
                            <Grid item>
                              <VertialAlignedFolderIcon />
                            </Grid>
                            <Grid item>
                              <StyledLevelText>
                                {t('ui.assetTree.level', 'Level {{number}}', {
                                  number: fieldNumber,
                                })}
                              </StyledLevelText>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid item xs>
                        <Field
                          id={`${fieldName}-input`}
                          component={StyledCustomTextField}
                          select
                          name={fieldName}
                          SelectProps={{ displayEmpty: true }}
                        >
                          <MenuItem value="">
                            <SelectItem />
                          </MenuItem>
                          {sortedLevelList.map((option) => (
                            <MenuItem key={option.alias!} value={option.alias!}>
                              {/* 
                      //@ts-ignore */}
                              {option.displayLabel || option.name!}
                            </MenuItem>
                          ))}
                        </Field>
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </EditorBox>
        </Grid>
      </Grid>
    </Form>
  );
};

const formatInitialValues = (
  values: any,
  initialDataChannelTypes: number[] | null | undefined
) => {
  const parsedLevels = values.expression?.split('/');
  const parsedDataChannelTypes = values.dataChannelTypes
    ?.split(';')
    .map(Number);

  return {
    ...values,
    level1: parsedLevels?.[0] || '',
    level2: parsedLevels?.[1] || '',
    level3: parsedLevels?.[2] || '',
    level4: parsedLevels?.[3] || '',
    dataChannelTypes: initialDataChannelTypes || parsedDataChannelTypes,
  };
};

interface Props {
  initialValues: any;
  restoreInitialValues?: any;
  restoreTouchedFields?: any;
  dataChannelTypes?: string | null | undefined;
  submissionError?: any;
  isCreating?: boolean;
  onSubmit: (values: Values, formikBag: FormikHelpers<Values>) => void;
  handleFormChange: (formik: FormikProps<Values>) => void;
  availableDataChannelTypeList: number[] | null | undefined;
  availableDomainCustomPropertyList:
    | CustomPropertyTypeInfo[]
    | null
    | undefined;
}

const TreeFormWrapper = ({
  initialValues,
  restoreInitialValues,
  handleFormChange,
  restoreTouchedFields,
  availableDataChannelTypeList,
  availableDomainCustomPropertyList,
  onSubmit,
  submissionError,
  isCreating,
}: Props) => {
  const { t } = useTranslation();
  const formInitialValues = initialValues || defaultInitialValues;
  const formattedInitialValues = formatInitialValues(
    formInitialValues,
    isCreating ? availableDataChannelTypeList : undefined
  );
  const treeNameText = t('ui.assetTree.description', 'Description');
  const validationSchema = buildTreeSchema(t, { treeNameText });

  return (
    <Formik
      // NOTE: Using `enableReinitialize` could cause the resetForm method to
      // not work. Instead, we're resetting the form by re-fetching the
      // required data to edit the form, and unmounting then mounting the form
      // again so that the initialValues passed from the parent are used
      // correctly
      initialValues={formattedInitialValues}
      validateOnChange
      validateOnBlur
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => (
        <>
          <FormikEffect
            onChange={handleFormChange}
            // NOTE: Adding additional props here like isValid may cause the
            // restoring of tabbed form values to screw up. Just something to
            // be aware of if values stop being restored properly
            isValid={formikProps.isValid}
            restoreTouchedFields={restoreTouchedFields}
            restoreInitialValues={restoreInitialValues}
          />
          <TreeForm
            {...formikProps}
            restoreInitialValues={restoreInitialValues}
            handleFormChange={handleFormChange}
            restoreTouchedFields={restoreTouchedFields}
            availableDataChannelTypeList={availableDataChannelTypeList}
            availableDomainCustomPropertyList={
              availableDomainCustomPropertyList
            }
            submissionError={submissionError}
          />
        </>
      )}
    </Formik>
  );
};

export default TreeFormWrapper;
