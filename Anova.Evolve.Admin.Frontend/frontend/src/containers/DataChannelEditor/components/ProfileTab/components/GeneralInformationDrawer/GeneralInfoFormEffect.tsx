import {
  DataChannelPublishedCommentsDTO,
  RtuChannelInfoDto,
} from 'api/admin/api';
import { useGetPublishedCommentsByDomainId } from 'containers/DataChannelEditor/hooks/useGetPublishedCommentsByDomainId';
import { FormikProps } from 'formik';
import { useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { Values } from './types';

interface Props {
  values: Values;
  rtuChannelData?: RtuChannelInfoDto[];
  setFieldValue: FormikProps<{}>['setFieldValue'];
  setPublishedComments: (
    publishedComments: DataChannelPublishedCommentsDTO[]
  ) => void;
  openSetAsPrimaryWarningDialog: () => void;
}

const GeneralInfoFormEffect = ({
  values,
  rtuChannelData,
  setFieldValue,
  setPublishedComments,
  openSetAsPrimaryWarningDialog,
}: Props) => {
  const getPublishedCommentsByDomainIdApi = useGetPublishedCommentsByDomainId(
    values.publishedDataChannelSourceDomainId
  );

  const selectedRtuChannel = rtuChannelData?.find(
    (rtuChannel) => rtuChannel.id === values.rtuChannelId
  );

  // Once the getPublishedComments api gets data, set the published comments options
  useEffect(() => {
    const publishedCommentsOptions = getPublishedCommentsByDomainIdApi.data;
    if (values.publishedDataChannelSourceDomainId) {
      setPublishedComments(publishedCommentsOptions!);
    }
  }, [getPublishedCommentsByDomainIdApi.data]);

  // Clear the rtuChannelId field value if the rtuId is changed
  // (rtuId is selected via the RtuAutoComplete / "rtuId" form field)
  useUpdateEffect(() => {
    setFieldValue('rtuChannelId', '');
  }, [values.rtuId]);

  // Show user the setAsPrimary warning dialog if they toggle it from "No" to "Yes"
  useUpdateEffect(() => {
    if (values.setAsPrimary && selectedRtuChannel?.isInUse) {
      openSetAsPrimaryWarningDialog();
    }
  }, [values.setAsPrimary]);

  // Clear the setAsPrimary boolean field value if the selected rtuChannelId is "in use"
  useUpdateEffect(() => {
    if (selectedRtuChannel?.isInUse) {
      setFieldValue('setAsPrimary', false);
    } else {
      setFieldValue('setAsPrimary', true);
    }
  }, [values.rtuChannelId]);

  // Clear the publishedCommentsId field value if the publishedDataChannelSourceDomainId
  // is changed
  useUpdateEffect(() => {
    setFieldValue('publishedCommentsId', '');
    setPublishedComments([]);
  }, [values.publishedDataChannelSourceDomainId]);

  return null;
};

export default GeneralInfoFormEffect;
