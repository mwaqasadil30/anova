import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import FieldLabel from 'components/forms/labels/FieldLabel';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatSearchText } from 'utils/api/helpers';

interface Props {
  setGlobalFilter: (filterText: string) => void;
}

const FilterForm = ({ setGlobalFilter }: Props) => {
  const { t } = useTranslation();

  const [filterText, setFilterText] = useState('');

  const handleFilterByInputChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setFilterText(event.target.value);
  };

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setGlobalFilter(formatSearchText(filterText));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <FieldLabel>{t('ui.common.filterby', 'Filter By')}</FieldLabel>
        </Grid>
        <Grid item>
          <StyledTextField
            id="filterText-input"
            fullWidth={false}
            placeholder={t(
              'ui.common.filtering.placeholder',
              'Enter filtering criteria'
            )}
            onChange={handleFilterByInputChange}
            value={filterText}
            style={{ minWidth: 280 }}
            InputProps={{
              style: { overflow: 'hidden' },
            }}
          />
        </Grid>

        <Grid item>
          <Button type="submit" variant="outlined">
            {t('ui.common.apply', 'Apply')}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default FilterForm;
