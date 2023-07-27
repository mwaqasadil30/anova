import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  headerText: React.ReactNode;
  fieldName: string;
  showAutoGenerateCheckbox?: boolean;
  disableIntegrationId?: boolean;
}

const DataChannelIntegrationRow = ({
  headerText,
  fieldName,
  showAutoGenerateCheckbox,
  disableIntegrationId,
}: Props) => {
  const { t } = useTranslation();

  return (
    <TableRow style={{ height: 50 }}>
      <TableCell
        aria-label="Data channel type"
        style={{
          padding: '5px 24px 5px 16px',
        }}
      >
        {headerText}
      </TableCell>
      <TableCell
        aria-label="Enable integration"
        style={{
          padding: 0,
          textAlign: 'center',
        }}
      >
        <Field
          id={`${fieldName}.enableIntegration-input`}
          component={CheckboxWithLabel}
          name={`${fieldName}.enableIntegration`}
          type="checkbox"
          Label={{
            style: {
              display: 'block',
              margin: 0,
            },
          }}
        />
      </TableCell>
      <TableCell
        aria-label="Auto-Generate Data Channel Integration ID"
        style={{
          padding: 0,
          textAlign: 'center',
        }}
      >
        {showAutoGenerateCheckbox && (
          <Field
            id={`${fieldName}.shouldAutoGenerate-input`}
            component={CheckboxWithLabel}
            name={`${fieldName}.shouldAutoGenerate`}
            type="checkbox"
            Label={{
              style: {
                display: 'block',
                margin: 0,
              },
            }}
          />
        )}
      </TableCell>
      <TableCell
        aria-label="Integration ID"
        style={{
          padding: '8px 16px',
        }}
      >
        <Field
          id={`${fieldName}.integrationId-input`}
          component={CustomTextField}
          name={`${fieldName}.integrationId`}
          disabled={disableIntegrationId}
          placeholder={t(
            'ui.integrationParameters.integrationId.placeholder',
            'Enter Integration ID...'
          )}
        />
      </TableCell>
    </TableRow>
  );
};

export default DataChannelIntegrationRow;
