import MenuItem from '@material-ui/core/MenuItem';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEventImportanceLevelOptions } from 'utils/i18n/enum-to-text';
import { renderImportance } from 'utils/ui/helpers';

interface Props {
  index: number;
}

const ScheduledDeliveryEventRuleBox = ({ index }: Props) => {
  const { t } = useTranslation();

  const eventImportanceLevelOptions = getEventImportanceLevelOptions(t);

  return (
    <TableContainer>
      <Table style={{ minWidth: 800 }}>
        <TableHead>
          <TableHeadRow>
            <TableHeadCell style={{ width: '50%' }}>
              {t('ui.datachanneleventrule.importance', 'Importance')}
            </TableHeadCell>
            <TableHeadCell style={{ width: '50%' }}>
              {t('ui.datachanneleventrule.integrationid', 'Integration ID')}
            </TableHeadCell>
          </TableHeadRow>
        </TableHead>
        <TableBody>
          <TableBodyRow>
            <TableCell aria-label="Event Importance">
              <Field
                id={`scheduledDeliveryEventRules.${index}.importanceLevel-input`}
                name={`scheduledDeliveryEventRules.${index}.importanceLevel`}
                component={CustomTextField}
                select
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="" disabled>
                  <SelectItem />
                </MenuItem>

                {eventImportanceLevelOptions?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {renderImportance(option.value)}&nbsp;{option.label}
                  </MenuItem>
                ))}
              </Field>
            </TableCell>

            <TableCell aria-label="Integration ID">
              <Field
                id={`scheduledDeliveryEventRules.${index}.integrationId-input`}
                name={`scheduledDeliveryEventRules.${index}.integrationId`}
                component={CustomTextField}
              />
            </TableCell>
          </TableBodyRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScheduledDeliveryEventRuleBox;
