import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
  KeyboardTimePicker,
  KeyboardTimePickerProps,
} from '@material-ui/pickers';
import { ReactComponent as ClockIcon } from 'assets/icons/icn-clock.svg';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledTimePickerTextField = styled(StyledTextField)`
  & [class*='MuiInputBase-root'],
  & [class*='MuiInputBase-root']:hover {
    padding-right: 4px;
  }
  /* Prevent jittering caused by the field being wider when focused */
  & [class*='MuiInputBase-root'][class*='Mui-focused'] {
    padding-right: 3px;
  }
  /* Hide the built-in clock picker from @material-ui/pickers */
  & .MuiInputAdornment-positionStart {
    display: none;
  }
`;

const StyledIconButton = styled(IconButton)`
  padding: 8px;
`;

const StyledClockIcon = styled(ClockIcon)`
  width: 17px;
  height: 17px;
`;

const StyledTimeField = (props: KeyboardTimePickerProps) => {
  const { t } = useTranslation();

  // #region Menu state
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenMenu = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget.parentElement);
    },
    []
  );
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const handleSelectTime = (time: moment.Moment | null) => () => {
    props.onChange(time);
    handleCloseMenu();
  };
  // #endregion Menu state

  const { value } = props;
  const { ampm, ...propsWithoutAMPM } = props;

  // Use 24-hour clock if not provided (the package's default is the
  // 12-hour clock)
  const formattedAMPMValue = ampm || false;

  const menuOptions = useMemo(() => {
    const formattedValue =
      value && moment(value).isValid() ? moment(value) : moment();
    const startDate = formattedValue.startOf('day');
    const intervalInMinutes = 30;
    const minutesInOneDay = 60 * 24;
    const numberOfOptions = Math.floor(minutesInOneDay / intervalInMinutes);
    const options = Array(numberOfOptions)
      .fill(0)
      .map((_, index) => {
        const intervalDate = moment(startDate).add(
          index * intervalInMinutes,
          'minutes'
        );
        const timeFormat = formattedAMPMValue ? 'hh:mm A' : 'HH:mm';
        return {
          label: intervalDate.format(timeFormat),
          value: intervalDate,
        };
      });

    return options;
  }, [formattedAMPMValue, value]);

  const formattedValue = moment(value);

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            maxHeight: 300,
          },
        }}
      >
        {menuOptions.map((option) => {
          const isSelected = formattedValue.isSame(option.value);
          return (
            <MenuItem
              key={option.label}
              selected={isSelected}
              onClick={handleSelectTime(option.value)}
            >
              {option.label}
            </MenuItem>
          );
        })}
      </Menu>
      <KeyboardTimePicker
        // Place the built-in popover on the start so we can hide it manually.
        // We show our own adornment at the end, which opens a dropdown when
        // clicked on showing time intervals that can be easily selected.
        InputAdornmentProps={{
          position: 'start',
        }}
        InputProps={{
          startAdornment: null,
          endAdornment: (
            <InputAdornment position="end">
              <StyledIconButton onClick={handleOpenMenu}>
                <StyledClockIcon />
              </StyledIconButton>
            </InputAdornment>
          ),
        }}
        TextFieldComponent={StyledTimePickerTextField as typeof StyledTextField}
        invalidDateMessage={t(
          'validate.timeField.invalidFormat',
          'Invalid Time Format'
        )}
        disableToolbar
        KeyboardButtonProps={{
          disabled: true,
        }}
        ampm={formattedAMPMValue}
        {...propsWithoutAMPM}
      />
    </>
  );
};

export default StyledTimeField;
