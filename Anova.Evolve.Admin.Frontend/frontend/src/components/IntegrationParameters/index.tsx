import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import MenuItem from '@material-ui/core/MenuItem';
import { FtpDomainInfo } from 'api/admin/api';
import EditorBox from 'components/EditorBox';
import CustomTextField from 'components/forms/form-fields/CustomTextField';
import SelectItem from 'components/forms/styled-fields/SelectItem';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import IntegrationParametersAsBoxes from './IntegrationParametersAsBoxes';
import IntegrationParametersAsTable from './IntegrationParametersAsTable';

interface DataChannelIntegrationParams {
  description: string;
  fieldName: string;
  shouldAutoGenerate?: boolean;
  hideAutoGenerateCheckbox?: boolean;
  hide?: boolean;
}

interface Props {
  assetIntegrationFieldName: string;
  domains?: FtpDomainInfo[] | null;
  selectedDomainId?: string | null;
  dataChannels?: DataChannelIntegrationParams[];
}

const IntegrationParameters = ({
  assetIntegrationFieldName,
  domains,
  selectedDomainId,
  dataChannels,
}: Props) => {
  const { t } = useTranslation();

  const selectedDomain = domains?.find(
    (domain) => domain.targetDomainId === selectedDomainId
  );
  const canDomainAutoGenerateIntegrationIds = selectedDomain?.autoGenerateFtpId;

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12}>
        <EditorBox>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Field
                id={`${assetIntegrationFieldName}-input`}
                component={CustomTextField}
                // NOTE: This is different from the data channel specific integration
                // ID
                name={assetIntegrationFieldName}
                label={t('ui.asset.assetintegrationid', 'Asset Integration ID')}
              />
            </Grid>
            <Grid item xs={6}>
              <Field
                id="integrationDomainId-input"
                component={CustomTextField}
                name="integrationDomainId"
                label={t('ui.common.domain', 'Domain')}
                select
                SelectProps={{ displayEmpty: true }}
              >
                <MenuItem value="">
                  <SelectItem />
                </MenuItem>
                {domains?.map((domain) => (
                  <MenuItem
                    key={domain.targetDomainId}
                    value={domain.targetDomainId}
                  >
                    {domain.targetDomainName}
                  </MenuItem>
                ))}
              </Field>
            </Grid>
          </Grid>
        </EditorBox>
      </Grid>
      <Grid item xs={12}>
        <Hidden smDown>
          <IntegrationParametersAsTable
            dataChannels={dataChannels}
            canDomainAutoGenerateIntegrationIds={
              canDomainAutoGenerateIntegrationIds
            }
          />
        </Hidden>
        <Hidden mdUp>
          <IntegrationParametersAsBoxes
            dataChannels={dataChannels}
            canDomainAutoGenerateIntegrationIds={
              canDomainAutoGenerateIntegrationIds
            }
          />
        </Hidden>
      </Grid>
    </Grid>
  );
};

export default IntegrationParameters;
