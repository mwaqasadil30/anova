import React, { useMemo } from 'react';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import TableCell from 'components/tables/components/TableCell';
import {
  ChannelType,
  FieldTypeInfo,
  HornerRtuChannelTableInfo,
} from 'containers/RtuAiChannelsEditor/types';
import { Field, FormikErrors } from 'formik';
import { HornerRtuAnalogInputChannelDTO } from 'api/admin/api';
import SwitchWithLabel from 'components/forms/form-fields/SwitchWithLabel';
import styled from 'styled-components';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import DragHandleOutlinedIcon from '@material-ui/icons/DragHandleOutlined';
import { brandYellow } from 'styles/colours';
import { SelectProps } from '@material-ui/core/Select';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import SelectCustomStyled from '../../SelectCustomStyled';

const StyledTextFieldResponsive = styled(StyledTextField)`
  width: 300px;
  @media (max-width: 1536px) {
    width: 250px;
  }
`;
const StyledAutoComplete = styled(Autocomplete)`
  width: 110px;
  & > div > div {
    padding: 1px 39px 1px 8px !important;
    border-radius: 5px;
    background-color: #f0f0f0;
    font-size: 0.8125rem;
  }
`;
const ChannelSelectField = ({
  channelType,
  ...props
}: SelectProps & { channelType?: ChannelType }) => {
  if (channelType === 'TCHANNEL') {
    const list = [];
    for (let i = 1; i < 31; i++) {
      list.push({ label: `${i}`, value: `T${i}` });
    }
    return (
      <Grid container style={{ minWidth: 80 }} alignItems="center">
        <Grid item style={{ marginRight: '5px' }}>
          T
        </Grid>
        <Grid item>
          <SelectCustomStyled itemArray={list} {...props} />
        </Grid>
      </Grid>
    );
  }
  const list = [];
  for (let i = 1; i < 31; i++) {
    list.push({ label: `${i}`, value: `${i}` });
  }
  return <SelectCustomStyled itemArray={list} {...props} />;
};
const defaultValue = (value?: string | number | null): number | string => {
  if (!value && value !== 0) return '';
  return value;
};

const ErrorMessageBox = styled.div`
  font-size: 0.7rem;
  padding-top: 5px;
  color: ${(props) => props.theme.palette.error.main};
`;

const ErrorMessage = ({ fieldvalue }: { fieldvalue?: string | null }) => {
  if (typeof fieldvalue === 'string')
    return <ErrorMessageBox>{fieldvalue}</ErrorMessageBox>;
  return null;
};

const HiddenInput = ({
  isHidden,
  width,
  maxWidth,
}: {
  isHidden: boolean;
  width?: number;
  maxWidth?: number;
}) => {
  if (isHidden)
    return (
      <input
        style={{
          width: width ? `${width}px` : '100%',
          border: 'none',
          backgroundColor: 'transparent',
          maxWidth: maxWidth ? `${maxWidth}px` : 'auto',
        }}
        disabled
        value=""
      />
    );
  return null;
};

const getChannelNoServerError = (
  t: TFunction,
  serverErrors?: Record<string, string>
) => {
  let channelNoServerError: string | undefined = '';
  if (serverErrors?.['ChannelNumber'] === 'Record already exists') {
    channelNoServerError = t(
      'validate.hornermessagetemplate.uniquechannelnumber',
      'There is already another Field with the same Channel Number.'
    );
  } else {
    channelNoServerError = serverErrors?.['ChannelNumber'];
  }
  return channelNoServerError;
};

type RtuAiChannelsTableRowProps = {
  rowData: HornerRtuChannelTableInfo;
  index: number;
  name: string;
  handleChange: (e: React.ChangeEvent<any>) => void;
  uomList: { label?: string | null; value?: string | null }[];
  fieldTypeList: FieldTypeInfo[];
  errors: FormikErrors<{
    channels: HornerRtuAnalogInputChannelDTO[];
  }>;
  channelType?: ChannelType;
  serverErrors?: Record<string, string>;
};
const RtuAiChannelsTableRow = ({
  rowData,
  index,
  name,
  handleChange,
  uomList,
  fieldTypeList,
  errors,
  channelType,
  serverErrors,
}: RtuAiChannelsTableRowProps) => {
  const { t } = useTranslation();
  const result = useMemo(() => {
    const {
      fieldName,
      fieldType,
      channelNumber,
      rawMinimumValue,
      rawMaximumValue,
      scaledMinimumValue,
      scaledMaximumValue,
      unitOfMeasure,
      decimalPlaces,
      isDisplayed,
      isRowSelected,
    } = rowData;
    const currentFieldType = fieldTypeList.find((d) => d.value === fieldType);

    const channelNoError = (errors.channels as FormikErrors<HornerRtuAnalogInputChannelDTO>[])?.[
      index
    ]?.channelNumber;

    return (
      <>
        <TableCell>
          <DragHandleOutlinedIcon htmlColor={brandYellow} />
        </TableCell>
        <TableCell>
          <Checkbox
            checked={isRowSelected}
            name={`${name}.${index}.isRowSelected`}
            id={`${name}.${index}.isRowSelected`}
            onChange={handleChange}
          />
        </TableCell>
        <TableCell>
          <StyledTextFieldResponsive
            value={fieldName || ''}
            name={`${name}.${index}.fieldName`}
            onChange={handleChange}
            error={!!serverErrors?.['FieldName']}
          />
        </TableCell>
        <TableCell>
          <SelectCustomStyled
            itemArray={fieldTypeList}
            value={fieldType || ''}
            name={`${name}.${index}.fieldType`}
            onChange={handleChange}
          />
        </TableCell>
        <TableCell>
          <ChannelSelectField
            value={defaultValue(channelNumber)}
            name={`${name}.${index}.channelNumber`}
            onChange={handleChange}
            channelType={channelType}
            error={!!serverErrors?.['ChannelNumber']}
          />
          <ErrorMessage
            fieldvalue={
              channelNoError || getChannelNoServerError(t, serverErrors)
            }
          />
        </TableCell>
        <TableCell minWidth="88px">
          {currentFieldType?.isRawMinDisplayed && (
            <StyledTextField
              value={defaultValue(rawMinimumValue)}
              name={`${name}.${index}.rawMinimumValue`}
              onChange={handleChange}
            />
          )}
          <HiddenInput
            isHidden={currentFieldType?.isRawMinDisplayed !== true}
          />
          <ErrorMessage
            fieldvalue={
              (errors.channels as FormikErrors<HornerRtuAnalogInputChannelDTO>[])?.[
                index
              ]?.rawMinimumValue
            }
          />
        </TableCell>
        <TableCell minWidth="88px">
          {currentFieldType?.isRawMaxDisplayed && (
            <StyledTextField
              value={defaultValue(rawMaximumValue)}
              name={`${name}.${index}.rawMaximumValue`}
              onChange={handleChange}
            />
          )}
          <HiddenInput
            isHidden={currentFieldType?.isRawMaxDisplayed !== true}
          />
        </TableCell>
        <TableCell minWidth="88px">
          {currentFieldType?.isScaledMinDisplayed && (
            <StyledTextField
              value={defaultValue(scaledMinimumValue)}
              name={`${name}.${index}.scaledMinimumValue`}
              onChange={handleChange}
            />
          )}
          <HiddenInput
            isHidden={currentFieldType?.isScaledMinDisplayed !== true}
          />
          <ErrorMessage
            fieldvalue={
              (errors.channels as FormikErrors<HornerRtuAnalogInputChannelDTO>[])?.[
                index
              ]?.scaledMinimumValue
            }
          />
        </TableCell>
        <TableCell minWidth="88px">
          {currentFieldType?.isScaledMaxDisplayed && (
            <StyledTextField
              value={defaultValue(scaledMaximumValue)}
              name={`${name}.${index}.scaledMaximumValue`}
              onChange={handleChange}
            />
          )}
          <HiddenInput
            isHidden={currentFieldType?.isScaledMaxDisplayed !== true}
          />
          <ErrorMessage
            fieldvalue={
              (errors.channels as FormikErrors<HornerRtuAnalogInputChannelDTO>[])?.[
                index
              ]?.scaledMaximumValue
            }
          />
        </TableCell>
        <TableCell>
          {currentFieldType?.isUomDisplayed && (
            <Field
              name={`${name}.${index}.unitOfMeasure`}
              id={`${name}.${index}.unitOfMeasure`}
              onChange={handleChange}
              component={StyledAutoComplete}
              options={uomList.map((a) => a.label)}
              freeSolo
              disablePortal
              onBlur={handleChange}
              value={unitOfMeasure || ''}
              renderInput={(params: any) => <StyledTextField {...params} />}
            />
          )}
        </TableCell>
        <TableCell>
          {currentFieldType?.isDecimalPlacesDisplayed && (
            <StyledTextField
              value={defaultValue(decimalPlaces)}
              name={`${name}.${index}.decimalPlaces`}
              onChange={handleChange}
              style={{ maxWidth: 103 }}
              error={!!serverErrors?.['DecimalPlaces']}
            />
          )}
          <HiddenInput
            isHidden={currentFieldType?.isDecimalPlacesDisplayed !== true}
            maxWidth={103}
          />
          <ErrorMessage
            fieldvalue={
              (errors.channels as FormikErrors<HornerRtuAnalogInputChannelDTO>[])?.[
                index
              ]?.decimalPlaces
            }
          />
        </TableCell>
        <TableCell>
          <Field
            value={isDisplayed}
            name={`${name}.${index}.isDisplayed`}
            component={SwitchWithLabel}
            type="checkbox"
          />
        </TableCell>
      </>
    );
  }, [rowData, fieldTypeList, errors, serverErrors]);
  return result;
};
export default RtuAiChannelsTableRow;
