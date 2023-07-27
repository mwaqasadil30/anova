import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { RTUCategoryType, IntegrationProfileType } from 'api/admin/api';
import { useTranslation } from 'react-i18next';
import FieldLabel from 'components/forms/labels/FieldLabel';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';

interface Props {
  // onSubmit: (data: any) => void;
  handleCategoriesChange: (categories: RTUCategoryType[]) => void;
}

interface Option {
  label: string;
  value: number;
}

const CategoryForm = ({ handleCategoriesChange }: Props) => {
  const { t } = useTranslation();
  const activeDomain = useSelector(selectActiveDomain);
  const domainIntegrationProfile = activeDomain?.integrationProfile;
  const unknownText = t('enum.RTUCategoryType.carrier', 'Carrier');
  const smsText = t('enum.RTUCategoryType.sms', 'SMS');
  const modbusText = t('enum.RTUCategoryType.modbus', 'Modbus');
  const cloverText = t('enum.RTUCategoryType.clover', 'Clover');
  const metron2Text = t('enum.RTUCategoryType.metron2', 'Metron 2');
  const hornerText = t('enum.RTUCategoryType.horner', 'Horner');
  const fileText = t('enum.RTUCategoryType.file', 'File');
  const fourHundredSeriesText = t(
    'enum.RTUCategoryType.fourHundredSeries',
    '400 Series'
  );

  const rtuCategoryMapping = {
    [RTUCategoryType.Unknown]: unknownText,
    [RTUCategoryType.SMS]: smsText,
    [RTUCategoryType.Modbus]: modbusText,
    [RTUCategoryType.Clover]: cloverText,
    [RTUCategoryType.Metron2]: metron2Text,
    [RTUCategoryType.Horner]: hornerText,
    [RTUCategoryType.File]: fileText,
    [RTUCategoryType.FourHundredSeries]: fourHundredSeriesText,
  };

  // list of filter options
  const [categoryOptions, setCategoryOptions] = useState({
    sms: {
      label: t('enum.RTUCategoryType.sms', 'SMS'),
      value: RTUCategoryType.SMS,
    },
    modbus: {
      label: t('enum.RTUCategoryType.modbus', 'Modbus'),
      value: RTUCategoryType.Modbus,
    },
    clover: {
      label: t('enum.RTUCategoryType.clover', 'Clover'),
      value: RTUCategoryType.Clover,
    },
    file: {
      label: t('enum.RTUCategoryType.file', 'File'),
      value: RTUCategoryType.File,
    },
    fourHundredSeries: {
      label: t('enum.RTUCategoryType.fourHundredSeries', '400 Series'),
      value: RTUCategoryType.FourHundredSeries,
    },
  });
  const [selectedCategories, setSelectedCategories] = useState([
    RTUCategoryType.SMS,
    RTUCategoryType.Modbus,
    RTUCategoryType.Clover,
    RTUCategoryType.File,
    RTUCategoryType.FourHundredSeries,
  ]);

  // set initial category state for apci domains
  useEffect(() => {
    if (domainIntegrationProfile === IntegrationProfileType.APCI) {
      const amend = {
        Metron: {
          label: t('enum.RTUCategoryType.metron2', 'Metron 2'),
          value: RTUCategoryType.Metron2,
        },
        Horner: {
          label: t('enum.RTUCategoryType.horner', 'Horner'),
          value: RTUCategoryType.Horner,
        },
      };
      setCategoryOptions({ ...categoryOptions, ...amend });
      setSelectedCategories([
        RTUCategoryType.SMS,
        RTUCategoryType.Modbus,
        RTUCategoryType.Clover,
        RTUCategoryType.File,
        RTUCategoryType.FourHundredSeries,
        RTUCategoryType.Metron2,
        RTUCategoryType.Horner,
      ]);
    }
  }, []);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const MenuProps = {
    PaperProps: {
      style: {
        maxMenuHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
        width: 250,
        borderWidth: '2px',
      },
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
    getContentAnchorEl: null,
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
  };

  const [selectAllCheckboxes, setSelectAllCheckboxes] = useState(false);

  const handleCategorySelectClose = () => {
    handleCategoriesChange(selectedCategories);
  };

  const handleCheckAll = () => {
    if (selectAllCheckboxes) {
      const allCategories = Object.values(categoryOptions).map(
        (option: Option) => option.value
      );
      setSelectedCategories(allCategories);
    } else if (!selectAllCheckboxes) {
      setSelectedCategories([]);
    }
    setSelectAllCheckboxes(!selectAllCheckboxes);
  };
  const handleCheckBox = (value: RTUCategoryType, isSelected: boolean) => {
    let allCategories;
    if (isSelected) {
      allCategories = selectedCategories.filter((v) => value !== v);
    } else {
      allCategories = [...selectedCategories];
      allCategories.push(value);
    }
    setSelectedCategories(allCategories);
  };

  const SelectAllText = () => {
    if (selectedCategories.length === 0) {
      return <ListItemText primary="Select All" onClick={handleCheckAll} />;
    }
    return <ListItemText primary="Deselect All" onClick={handleCheckAll} />;
  };

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <FieldLabel>{t('ui.common.categories', 'Categories')}</FieldLabel>
      </Grid>
      <Grid item>
        <Grid container>
          <Grid item>
            <StyledTextField
              select
              SelectProps={{
                multiple: true,
                onClose: handleCategorySelectClose,
                // @ts-ignore
                renderValue: (selected: RTUCategoryType[]) =>
                  selected
                    .map((categoryType) => rtuCategoryMapping[categoryType])
                    .filter(Boolean)
                    .join(', '),
                // @ts-ignore
                MenuProps,
                value: selectedCategories,
              }}
              style={{ minWidth: 440 }}
              InputProps={{
                style: { overflow: 'hidden' },
              }}
            >
              <MenuItem
                key="selectAll"
                value="selectAll"
                onChange={handleCheckAll}
                onClick={handleCheckAll}
              >
                <Checkbox
                  checked={selectAllCheckboxes}
                  onChange={handleCheckAll}
                  name="selectAll"
                />
                <SelectAllText />
              </MenuItem>
              {Object.values(categoryOptions).map((option: Option) => {
                const isSelected = selectedCategories.includes(option.value);
                return (
                  <MenuItem
                    key={`${option.value}${JSON.stringify(isSelected)}`}
                    value={option.value}
                    onClick={() => handleCheckBox(option.value, isSelected)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={() => handleCheckBox(option.value, isSelected)}
                    />

                    <ListItemText
                      primary={option.label}
                      onClick={() => handleCheckBox(option.value, isSelected)}
                    />
                  </MenuItem>
                );
              })}
            </StyledTextField>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CategoryForm;
