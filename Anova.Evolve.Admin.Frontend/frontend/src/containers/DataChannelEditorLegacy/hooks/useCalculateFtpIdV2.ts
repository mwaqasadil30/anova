import { FtpFileFormat, FtpDomainInfo } from 'api/admin/api';
import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { getFtpId } from 'utils/api/helpers';
import { isNumber } from 'utils/format/numbers';

interface Props {
  integrationDomains?: FtpDomainInfo[] | null;
  integrationDomainId?: string;
  selectedChannelNumber?: number | string | null;
  integrationId: string;
  shouldAutoGenerate?: boolean;
  fieldName: string;
  rtuDeviceId?: string | null;
  setFieldValue: FormikProps<any>['setFieldValue'];
}

const useCalculateFtpIdV2 = ({
  integrationDomains,
  integrationDomainId,
  integrationId,
  shouldAutoGenerate,
  rtuDeviceId,
  fieldName,
  selectedChannelNumber,
  setFieldValue,
}: Props) => {
  useEffect(() => {
    if (!shouldAutoGenerate) {
      return;
    }

    const selectedIntegrationDomain = integrationDomains?.find(
      (domain) => domain.targetDomainId === integrationDomainId
    );
    const ftpFileFormat = selectedIntegrationDomain?.targetDomainFtpFileFormat;
    const canAutoGenerateFtpId = selectedIntegrationDomain?.autoGenerateFtpId;

    if (
      // Since the user is only able to type into the integrationId field when
      // its NOT auto generated, this useEffect hook shouldnt fire on each
      // time integrationId is updated (eg: user types into it)
      shouldAutoGenerate &&
      canAutoGenerateFtpId &&
      typeof ftpFileFormat === 'number' &&
      rtuDeviceId &&
      selectedChannelNumber
    ) {
      const deviceIdForDataSource = rtuDeviceId || '';
      const channelNumberForDataSource = !isNumber(selectedChannelNumber)
        ? 0
        : Number(selectedChannelNumber);

      const ftpId = getFtpId(
        ftpFileFormat,
        deviceIdForDataSource,
        channelNumberForDataSource,
        ftpFileFormat === FtpFileFormat.Boc ? '' : integrationId
      );
      setFieldValue(fieldName, ftpId);
    }
  }, [
    // IMPORTANT: We only want to re-calculate the field when the following
    // dependencies change.
    // We don't want to re-calculate the integrationId when the integrationId
    // itself changes (which is why it's excluded from the list of the hook's
    // dependencies). It would also cause additional unnecessary executions of
    // this hook.
    shouldAutoGenerate,
    integrationDomainId,
    rtuDeviceId,
    selectedChannelNumber,
  ]);

  return null;
};

export default useCalculateFtpIdV2;
