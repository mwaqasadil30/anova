import { FtpFileFormat } from 'api/admin/api';
import { FormChangeEffectProps } from 'containers/HeliumISOContainerCreate/types';
import { useEffect } from 'react';
import { getFtpId } from 'utils/api/helpers';
import { isNumber } from 'utils/format/numbers';

interface Props
  extends Pick<
    FormChangeEffectProps,
    'integrationDomains' | 'selectedRtu' | 'setFieldValue' | 'values'
  > {
  selectedChannelNumber?: number | string;
  fieldName: string;
}

const useCalculateFtpId = ({
  integrationDomains,
  selectedRtu,
  fieldName,
  selectedChannelNumber,
  values,
  setFieldValue,
}: Props) => {
  const {
    shouldAutoGenerate,
    integrationId,
  }: {
    shouldAutoGenerate?: boolean;
    integrationId: string;
    // @ts-ignore
  } = values[fieldName];

  useEffect(() => {
    if (!shouldAutoGenerate) {
      return;
    }

    const selectedIntegrationDomain = integrationDomains?.find(
      (domain) => domain.targetDomainId === values.integrationDomainId
    );
    const ftpFileFormat = selectedIntegrationDomain?.targetDomainFtpFileFormat;
    const deviceId = selectedRtu?.deviceId;

    const canAutoGenerateFtpId = selectedIntegrationDomain?.autoGenerateFtpId;
    if (
      // Since the user is only able to type into the integrationId field when
      // its NOT auto generated, this useEffect hook shouldnt fire on each
      // time integrationId is updated (eg: user types into it)
      shouldAutoGenerate &&
      canAutoGenerateFtpId &&
      typeof ftpFileFormat === 'number' &&
      deviceId &&
      selectedChannelNumber
    ) {
      const deviceIdForDataSource = deviceId || '';
      const channelNumberForDataSource = !isNumber(selectedChannelNumber)
        ? 0
        : Number(selectedChannelNumber);
      const ftpId = getFtpId(
        ftpFileFormat,
        deviceIdForDataSource,
        channelNumberForDataSource,
        selectedIntegrationDomain?.targetDomainFtpFileFormat ===
          FtpFileFormat.Boc
          ? ''
          : integrationId
      );
      setFieldValue(`${fieldName}.integrationId`, ftpId);
    }
  }, [
    // IMPORTANT: We only want to re-calculate the field when the following
    // dependencies change.
    // We don't want to re-calculate the integrationId when the integrationId
    // itself changes (which is why it's excluded from the list of the hook's
    // dependencies). It would also cause additional unnecessary executions of
    // this hook.
    shouldAutoGenerate,
    values.integrationDomainId,
    selectedRtu,
  ]);

  return null;
};

export default useCalculateFtpId;
