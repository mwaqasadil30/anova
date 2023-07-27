import Grid from '@material-ui/core/Grid';
import { DataChannelDTO, UnitTypeEnum } from 'api/admin/api';
import {
  buildUOMOptions,
  canShowUnitOfMeasureOptionsForDataChannel,
} from 'apps/ops/containers/AssetDetail/helpers';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cell } from 'react-table';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import { getUnitOfMeasureTypeOptions } from 'utils/i18n/enum-to-text';
import { CommonGraphDataChannelProps } from '../../../../types';

const StyledSmallTextField = styled(StyledTextField)`
  max-width: 120px;

  & .MuiInput-root {
    /* background: rgba(240, 240, 240, 0.75); */
    height: 22px;
    overflow: hidden;
    font-size: 14px;
  }

  && [class*='MuiSelect-root'] {
    /* Additional right padding to account for the dropdown caret */
    padding: 5px 21px 4px 8px;
  }

  &&
    [class*='MuiInput-root'][class*='Mui-focused']
    > [class*='MuiSelect-select'] {
    padding: 3px 21px 3px 7px;
  }

  && [class*='MuiSelect-icon'] {
    width: 8px;
    height: 7px;
    margin-right: 4px;
    color: ${(props) => props.theme.palette.text.primary};
  }

  && [class*='MuiSelect-icon'][class*='Mui-disabled'] {
    opacity: 0.3;
  }
`;

interface Props<T extends DataChannelDTO> extends Cell<T> {
  isBeingGraphed?: boolean;
  disableUnitOfMeasureButtons?: boolean;
  handleChangeDataChannelToUnitMapping?: CommonGraphDataChannelProps['handleChangeDataChannelToUnitMapping'];
}

function DataChannelLatestReadingCell<T extends DataChannelDTO>({
  // react-table props
  row,
  value,
  // Custom props
  disableUnitOfMeasureButtons,
  handleChangeDataChannelToUnitMapping,
}: Props<T>) {
  const { t } = useTranslation();

  const allUnitOptions = getUnitOfMeasureTypeOptions({
    supportedUOMType: row.original.uomParams?.supportedUOMTypeId,
    scaledUnit: row.original.scaledUnit,
    t,
  });
  const unitOfMeasureOptions = buildUOMOptions(
    row.original.uomParams?.supportedUOMTypeId,
    allUnitOptions,
    t
  );

  const handleChangeUnitOfMeasure = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    if (row.original.dataChannelId) {
      const unit = isNumber(event.target.value)
        ? (event.target.value as UnitTypeEnum)
        : null;
      handleChangeDataChannelToUnitMapping?.(row.original.dataChannelId, unit);
    }
  };

  const units = row.original.uomParams?.unit;
  const selectedUnitOfMeasureValue = isNumber(
    row.original.uomParams?.unitTypeId
  )
    ? row.original.uomParams?.unitTypeId
    : '';
  const canShowUnitOfMeasureOptions = canShowUnitOfMeasureOptionsForDataChannel(
    row.original
  );

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        {value}{' '}
        {!canShowUnitOfMeasureOptions ? (
          units
        ) : (
          <StyledSmallTextField
            id={`${row.original.dataChannelId}-uom-input`}
            select
            fullWidth={false}
            disabled={disableUnitOfMeasureButtons}
            onChange={handleChangeUnitOfMeasure}
            value={selectedUnitOfMeasureValue}
            SelectProps={{ displayEmpty: true }}
          >
            {unitOfMeasureOptions}
          </StyledSmallTextField>
        )}
      </Grid>
    </Grid>
  );
}

export default DataChannelLatestReadingCell;
