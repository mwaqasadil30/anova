import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import { FtpDomainInfo } from 'api/admin/api';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DataChannelIntegration from './DataChannelIntegration';

interface Props {
  domains?: FtpDomainInfo[] | null;
  selectedDomainId?: string | null;
  showPressureDataChannel?: boolean;
  showBatteryDataChannel?: boolean;
  autoGenerateLevel?: boolean;
  autoGeneratePressure?: boolean;
  autoGenerateBattery?: boolean;
}

const IntegrationParameters = ({
  domains,
  selectedDomainId,
  showBatteryDataChannel,
  showPressureDataChannel,
  autoGenerateLevel,
  autoGeneratePressure,
  autoGenerateBattery,
}: Props) => {
  const { t } = useTranslation();

  const selectedDomain = domains?.find(
    (domain) => domain.targetDomainId === selectedDomainId
  );
  const showAutoGenerateCheckbox = selectedDomain?.autoGenerateFtpId;

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={6}>
        <Field
          id="integrationId-input"
          component={CustomTextField}
          // NOTE: This is different from the data channel specific integration
          // ID (example: levelIntegrationDetails.integrationId)
          name="integrationId"
          label={t('ui.asset.assetintegrationid', 'Asset Integration ID')}
        />
      </Grid>
      <Grid item xs={6}>
        <Field
          id="integrationDomainId-input"
          component={CustomTextField}
          name="integrationDomainId"
          label={t('ui.common.selectDomain', 'Select Domain')}
          select
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="">
            <SelectItem />
          </MenuItem>
          {domains?.map((domain) => (
            <MenuItem key={domain.targetDomainId} value={domain.targetDomainId}>
              {domain.targetDomainName}
            </MenuItem>
          ))}
        </Field>
      </Grid>
      <Grid item xs={12} md={6}>
        <DataChannelIntegration
          headerText={t(
            'ui.integrationParameters.levelDataChannel',
            'Level Data Channel'
          )}
          fieldPrefix="level"
          showAutoGenerateCheckbox={showAutoGenerateCheckbox}
          disableIntegrationId={autoGenerateLevel}
        />
      </Grid>
      {showPressureDataChannel && (
        <Grid item xs={12} md={6}>
          <DataChannelIntegration
            headerText={t(
              'ui.integrationParameters.pressureDataChannel',
              'Pressure Data Channel'
            )}
            fieldPrefix="pressure"
            showAutoGenerateCheckbox={showAutoGenerateCheckbox}
            disableIntegrationId={autoGeneratePressure}
          />
        </Grid>
      )}
      {showBatteryDataChannel && (
        <Grid item xs={12} md={6}>
          <DataChannelIntegration
            headerText={t(
              'ui.integrationParameters.batteryDataChannel',
              'Battery Data Channel'
            )}
            fieldPrefix="battery"
            showAutoGenerateCheckbox={showAutoGenerateCheckbox}
            disableIntegrationId={autoGenerateBattery}
          />
        </Grid>
      )}
    </Grid>
  );
};

export default IntegrationParameters;
