/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Popover from '@material-ui/core/Popover';
import { TextFieldProps } from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Calendar, useStaticState } from '@material-ui/pickers';
import { ReactComponent as CalendarIcon } from 'assets/icons/calendar.svg';
import Button from 'components/Button';
import StyledTextField from 'components/forms/styled-fields/StyledTextField';
import StyledTimeField from 'components/forms/styled-fields/StyledTimeField';
import moment, { Moment } from 'moment';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { darkTheme } from 'styles/theme';

const dateTimeFormat12Hour = 'YYYY-MM-DD hh:mm A';
const dateTimeFormat24Hour = 'YYYY-MM-DD HH:mm';

const isoDateOnlyFormat = 'YYYY-MM-DD';

const StyledTextFieldForDatePicker = styled(StyledTextField)<{
  $isActuallyDisabled?: boolean;
}>`
  & [class*='MuiInputBase-root'],
  & [class*='MuiInputBase-root'] [class*='MuiInputBase-input'] {
    background: ${(props) =>
      props.theme.palette.type === 'light'
        ? '#F0F0F0'
        : 'rgba(255, 255, 255, 0.26)'};
    cursor: ${(props) =>
      props.$isActuallyDisabled ? 'not-allowed' : 'pointer'};
  }

  ${(props) =>
    !props.$isActuallyDisabled &&
    `
  & [class*='MuiInputBase-root'][class*='Mui-disabled'],
  &
    [class*='MuiInputBase-root']
    [class*='MuiInputBase-input'][class*='Mui-disabled'] {
      background: ${
        props.theme.palette.type === 'light'
          ? '#F0F0F0'
          : 'rgba(255, 255, 255, 0.26)'
      };
    color: ${props.theme.palette.text.primary};
  }

  &
    [class*='MuiInputBase-root']
    [class*='MuiInputBase-input'][class*='Mui-disabled'] {
      background: none;
  }
`}
`;

const StyledCalendarIcon = styled(CalendarIcon)`
  width: 18px;
  height: 18px;
`;

const DarkBox = styled(Box)`
  background: ${darkTheme.custom?.palette?.background?.drawerHeader};
  color: ${darkTheme.palette?.text?.primary};
`;

const StyledTypography = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

const StyledFieldLabelText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

type Props = Omit<TextFieldProps, 'value' | 'onChange'> & {
  value: moment.MomentInput | null;
  ampm?: boolean; // 12-hour or 24-hour clock for the time picker
  disableFuture?: boolean;
  minDate?: Moment;
  maxDate?: Moment;
  disableTimeOfDay?: boolean;
  onChange?: (date: moment.Moment | null) => void;
  // Used to trigger things like marking fields as touched in Formik
  handleClose?: () => void;
};

const DateTimePicker = ({
  ampm,
  value,
  disableTimeOfDay,
  onChange,
  handleClose,
  disableFuture,
  maxDate,
  minDate,
  ...textFieldProps
}: Props) => {
  const { t } = useTranslation();

  // #region Date state
  const initialUnsavedDate = value ? moment(value) : null;

  const [unsavedDate, setUnsavedDate] = useState<moment.Moment | null>(
    initialUnsavedDate
  );

  // you can pass mostly all available props, like minDate, maxDate, autoOk and so on
  // https://material-ui-pickers.dev/guides/static-components
  const { pickerProps, wrapperProps } = useStaticState({
    value: unsavedDate,
    onChange: setUnsavedDate,
  });
  // #endregion Date state

  // #region Popover anchor
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleOpenPopover = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      // @ts-ignore
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const closePopover = useCallback(() => {
    setAnchorEl(null);
    handleClose?.();
  }, [handleClose]);

  const handleCancel = useCallback(() => {
    closePopover();
    setUnsavedDate(initialUnsavedDate);
  }, [closePopover, initialUnsavedDate]);
  const handleApply = useCallback(() => {
    closePopover();
    onChange?.(unsavedDate);
  }, [closePopover, onChange, unsavedDate]);
  // #endregion Popover anchor

  // The text field is always disabled to prevent focusing on the input. If the
  // input is actually disabled, we need to apply the disabled styles.
  const isActuallyDisabled = textFieldProps.disabled;

  const dateTimeFormat = !disableTimeOfDay
    ? ampm
      ? dateTimeFormat12Hour
      : dateTimeFormat24Hour
    : isoDateOnlyFormat;

  return (
    <>
      <StyledTextFieldForDatePicker
        $isActuallyDisabled={isActuallyDisabled}
        onFocus={(event) => {
          event.stopPropagation();
          event.preventDefault();
        }}
        InputProps={{
          readOnly: true,
          // The input is disabled to prevent focusing on the input. It would
          // trigger the field to be touched in Formik which would show error
          // messages immediately when the popover is shown which isn't great
          // UX.
          disabled: true,
          onClick: isActuallyDisabled ? undefined : handleOpenPopover,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                disabled={isActuallyDisabled}
                onClick={isActuallyDisabled ? undefined : handleOpenPopover}
              >
                <StyledCalendarIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        value={
          value && moment(value).isValid()
            ? moment(value).format(dateTimeFormat)
            : ''
        }
        placeholder={t('ui.common.selectDateAndTime', 'Select Date and Time')}
        {...textFieldProps}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCancel}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <DarkBox px={2} py={1}>
          <StyledTypography align="center">
            {!unsavedDate || !unsavedDate.isValid() || value === unsavedDate
              ? t('ui.common.selectDateAndTime', 'Select Date and Time')
              : moment(unsavedDate).format(dateTimeFormat)}
          </StyledTypography>
        </DarkBox>
        <Box pt={0.5} p={2}>
          <Calendar
            {...pickerProps}
            disableFuture={disableFuture}
            maxDate={maxDate}
            minDate={minDate}
            allowKeyboardControl={false}
          />
        </Box>

        {!disableTimeOfDay && (
          <>
            <Divider />
            <Box p={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <StyledFieldLabelText>
                    {t('ui.common.time', 'Time')}
                  </StyledFieldLabelText>
                </Grid>
                <Grid item xs>
                  <StyledTimeField
                    ampm={ampm}
                    value={unsavedDate}
                    onChange={(date) => {
                      if (date?.isValid()) {
                        const dateToUse = unsavedDate || undefined;
                        const newDate = moment(dateToUse)
                          .set('hour', date.hour())
                          .set('minute', date.minute())
                          .set('seconds', 0)
                          .set('milliseconds', 0);
                        setUnsavedDate(newDate);
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        <Divider />

        <Box p={2}>
          <Grid container spacing={1} justify="space-between">
            <Grid item>
              <Button variant="text" onClick={handleCancel}>
                {t('ui.common.cancel', 'Cancel')}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="text" onClick={wrapperProps.onClear}>
                {t('ui.common.clear', 'Clear')}
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={handleApply}>
                {t('ui.common.apply', 'Apply')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};

export default DateTimePicker;
