import { MessageTemplateDto } from 'api/admin/api';
import { FormikProps } from 'formik';
import { useEffect } from 'react';

interface Props {
  selectedMessageTemplateId?: number;
  templateApiData?: MessageTemplateDto[];
  setValues: FormikProps<{}>['setValues'];
}

const FormEffect = ({
  selectedMessageTemplateId,
  templateApiData,
  setValues,
}: Props) => {
  // Set only the fields that the user can actually select, after a 'Template'
  // (field label) is selected.
  useEffect(() => {
    const selectedTemplate = templateApiData?.find(
      (template) => template.messageTemplateId === selectedMessageTemplateId
    );

    setValues({
      messageTemplateId: selectedTemplate?.messageTemplateId || '',
      subjectTemplate: selectedTemplate?.subjectTemplate || '',
      bodyTemplate: selectedTemplate?.bodyTemplate || '',
      replyTo: selectedTemplate?.replyTo || '',
      sendToAddressList: selectedTemplate?.sendToAddressList || '',
      sendToCcAddressList: selectedTemplate?.sendToCcAddressList || '',
      sendToBccAddressList: selectedTemplate?.sendToBccAddressList || '',
    });
  }, [selectedMessageTemplateId]);

  return null;
};

export default FormEffect;
