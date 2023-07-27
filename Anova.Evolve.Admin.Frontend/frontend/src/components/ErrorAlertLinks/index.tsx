/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import MuiLink from '@material-ui/core/Link';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Alert from 'components/Alert';
import { DataChannelEditorTabs } from 'containers/DataChannelEditorLegacy/types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { defaultTextColor } from 'styles/colours';
import { renderHelperText } from 'utils/forms/renderers';
import ErrorItem from './ErrorItem';

const PopoverTitle = styled(Typography)`
  font-weight: 600;
  color: ${defaultTextColor};
`;

type FormErrorMapping = { [key: string]: string | string[] | FormErrorMapping };

const getErrorCount = (error: string | string[] | FormErrorMapping): number => {
  if (!error) {
    return 0;
  }

  if (typeof error === 'string') {
    return 1;
  }

  if (Array.isArray(error)) {
    return error.length;
  }

  if (typeof error === 'object') {
    return getErrorCount((Object.values(error) as unknown) as FormErrorMapping);
  }

  return 0;
};

/**
 * Convert an error like
 * ```js
 * const error = {
 *   description: 'Required',
 *   nestedObject: {
 *     sampleField: 'Must be a number',
 *     otherField: ['Error one', 'Error two'],
 *   },
 *   arrayField: [
 *     { name: 'Required'},
 *     null,
 *     { value: 'Must be a number' }
 *   ]
 * }
 * ```
 * into something like:
 * ```js
 * const transformedError = {
 *   description: 'Required',
 *   "nestedObject.sampleField": 'Must be a number',
 *   "nestedObject.otherField": ['Error one', 'Error two'],
 *   "arrayField.0.name": 'Required',
 *   "arrayField.2.value": 'Must be a number',
 * }
 * ```
 * @param errors An error structured for a formik form's fields.
 * @param fieldNamePrefix A prefix to use on nested/array fields (recursively).
 */
const getFilteredErrors = (errors: any, fieldNamePrefix = ''): any => {
  if (typeof errors === 'string') {
    return { [fieldNamePrefix]: errors };
  }
  if (!errors) {
    // eslint-disable-next-line consistent-return
    return;
  }

  // @ts-ignore
  return Object.entries(errors)
    .filter(([_, error]) => !!error)
    .reduce((prev, [fieldName, error]) => {
      const isErrorAnArray = Array.isArray(error);
      const isErrorAnObject = typeof error === 'object' && error !== null;

      return {
        ...prev,
        ...(isErrorAnArray
          ? // If this error is a list of strings, then just return it,
            // otherwise, it may contain nested errors, so recursively build
            // errors for the list
            (error as any[]).every(
              (element) => typeof element === 'string' || !element
            )
            ? { [`${fieldNamePrefix}${fieldName}`]: error }
            : (error as any[])
                .map((subError, index) => {
                  const prefix = `${fieldNamePrefix}${fieldName}`;
                  return getFilteredErrors(subError, `${prefix}.${index}.`);
                })
                // Join the objects from each error in the array into one
                // object so it can be flattened into the top-level object
                .reduce((subPrev, current) => ({ ...subPrev, ...current }), {})
          : isErrorAnObject
          ? getFilteredErrors(error as FormErrorMapping, `${fieldName}.`)
          : {
              [`${fieldNamePrefix}${fieldName}`]: error,
            }),
      };
    }, {});
};

interface Props {
  errors: FormErrorMapping;
  handleChangeActiveTab: (
    event: React.ChangeEvent<{}> | undefined,
    newValue: DataChannelEditorTabs
  ) => void;
}

const ErrorAlertLinks = ({ errors, handleChangeActiveTab }: Props) => {
  const { t } = useTranslation();

  // Filter out values from the object that are falsy (undefined, null, etc.)
  const filteredErrors: FormErrorMapping = getFilteredErrors(errors);

  const [
    popoverAnchorEl,
    setPopoverAnchorEl,
  ] = useState<HTMLAnchorElement | null>(null);
  const openPopover = (event: React.MouseEvent<HTMLAnchorElement>) => {
    setPopoverAnchorEl(event.currentTarget);
  };
  const closePopover = () => {
    setPopoverAnchorEl(null);
  };

  const handleClickViewDetails = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    openPopover(event);
  };

  const handleClickError = (fieldName: string) => {
    const isErrorOnEventsTab =
      fieldName.startsWith('levelEventRules') ||
      fieldName.startsWith('missingDataEventRules') ||
      fieldName.startsWith('scheduledDeliveryEventRules') ||
      fieldName.startsWith('usageRateEventRules');

    const tabToSwitchTo = isErrorOnEventsTab
      ? DataChannelEditorTabs.Events
      : DataChannelEditorTabs.General;
    if (isErrorOnEventsTab) {
      handleChangeActiveTab(undefined, tabToSwitchTo);
    }

    setTimeout(() => {
      const elementId = `${fieldName}-input`;
      const element = document.getElementById(elementId);
      if (element) {
        // Some fields don't get scrolled to without the setTimeout for some
        // reason
        setTimeout(() => {
          element.scrollIntoView({ block: 'center' });
          element.focus();
        }, 0);
      }

      closePopover();
    }, 0);
  };

  const errorCount = getErrorCount(
    (Object.values(filteredErrors) as unknown) as FormErrorMapping
  );

  const errorsWithHandlers = Object.entries(filteredErrors).map(
    ([fieldName, errorMessage]) => ({
      message: renderHelperText(errorMessage),
      onClick: () => handleClickError(fieldName),
    })
  );

  if (!errorCount) {
    return null;
  }

  return (
    <>
      <Alert severity="error" variant="filled">
        {t('ui.error.numberofErrorsFound', '{{count}} Errors Found.', {
          count: errorCount,
        })}{' '}
        <MuiLink
          href="#"
          onClick={handleClickViewDetails}
          underline="always"
          color="inherit"
        >
          {t('ui.error.viewDetails', 'View Details')}
        </MuiLink>
      </Alert>
      <Popover
        id="error-alert-links-popover"
        open={!!popoverAnchorEl}
        anchorEl={popoverAnchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{ style: { width: 580, maxWidth: '95%' } }}
        transitionDuration={0}
      >
        <Box p={3}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <PopoverTitle>
                {t('ui.error.numberofErrors', '{{count}} Errors', {
                  count: errorCount,
                })}
              </PopoverTitle>
            </Grid>
            <Grid item xs={12}>
              <Box style={{ overflowY: 'auto' }} maxHeight="300px">
                {errorsWithHandlers.map((errorDetails, index) => (
                  <ErrorItem
                    key={index}
                    {...errorDetails}
                    highlighted={index % 2 === 0}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Popover>
    </>
  );
};

export default ErrorAlertLinks;
