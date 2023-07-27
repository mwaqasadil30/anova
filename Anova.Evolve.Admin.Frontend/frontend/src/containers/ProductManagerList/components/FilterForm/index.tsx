import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Button from 'components/Button';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import { useTranslation } from 'react-i18next';
import FieldLabel from 'components/forms/labels/FieldLabel';
import { formatSearchText } from 'utils/api/helpers';

interface Props {
  setGlobalFilter: (filterText: string) => void;
}

const FilterForm = ({ setGlobalFilter }: Props) => {
  const { t } = useTranslation();

  const [filterByInputText, setFilterByInputText] = useState('');

  const handleFilterByInputChange = (
    event: React.ChangeEvent<{ value: string }>
  ) => {
    setFilterByInputText(event.target.value);
  };
  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setGlobalFilter(formatSearchText(filterByInputText));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        clone
        justifyContent={['space-between', 'space-between', 'flex-start']}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <FieldLabel>{t('ui.common.filterby', 'Filter By')}</FieldLabel>
          </Grid>
          <Box clone flex={[1, 1, 'inherit']}>
            <Grid item>
              <StyledTextField
                id="filterText-input"
                placeholder={t(
                  'ui.common.filtering.placeholder',
                  'Enter filtering criteria'
                )}
                onChange={handleFilterByInputChange}
                value={filterByInputText}
                style={{ minWidth: 280 }}
                InputProps={{
                  style: { overflow: 'hidden' },
                }}
              />
            </Grid>
          </Box>
          <Grid item>
            <Button type="submit" variant="outlined">
              {t('ui.common.apply', 'Apply')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </form>
  );
};

export default FilterForm;
