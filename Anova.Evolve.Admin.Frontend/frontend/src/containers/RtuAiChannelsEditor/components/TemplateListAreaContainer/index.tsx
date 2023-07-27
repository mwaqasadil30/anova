import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import ApplyButton from 'components/buttons/ApplyButton';
import SaveAsNewTemplateButton from 'components/buttons/SaveAsNewTemplateButton';
import FieldLabel from 'components/forms/labels/FieldLabel';
import useMessageTemplateList from 'containers/RtuAiChannelsEditor/hooks/useMessageTemplateList';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SelectCustomStyled from '../SelectCustomStyled';

type TemplateListAreaContainerProps = {
  onApply: (templateId: number) => void;
  onSaveAsNewTemplate?: () => void;
  currentTemplateId: number;
  templateType?: 'ANALOG_INPUT' | 'TRANSACTION';
};
const TemplateListAreaContainer = ({
  onApply,
  onSaveAsNewTemplate,
  currentTemplateId,
  templateType,
}: TemplateListAreaContainerProps) => {
  const { t } = useTranslation();

  const [templateId, setTemplateId] = useState<number>(currentTemplateId);

  useEffect(() => {
    setTemplateId(currentTemplateId);
  }, [currentTemplateId]);

  const [listChanged, setListChanged] = useState(false);
  const { data } = useMessageTemplateList(templateType);
  const listItems = React.useMemo(
    () =>
      data?.map((item) => ({
        label: item.description,
        value: item.recordTemplateId?.toString(),
      })),
    [data]
  );
  return (
    <Box pb={3}>
      <Grid container spacing={1}>
        <Grid item style={{ display: 'flex', alignItems: 'center' }}>
          <FieldLabel>
            {t(
              'ui.rtuhorner.transactionmessagetemplate',
              'Transaction Message Template'
            )}
          </FieldLabel>
        </Grid>
        <Grid item md={3}>
          <SelectCustomStyled
            itemArray={listItems || []}
            onChange={(event) => {
              setTemplateId(event.target.value as number);
              setListChanged(true);
            }}
            value={templateId}
          />
        </Grid>
        <Grid item>
          <ApplyButton
            disabled={!listChanged}
            onClick={() => {
              onApply(templateId);
            }}
          />
        </Grid>
        <Grid item>
          <SaveAsNewTemplateButton onClick={onSaveAsNewTemplate} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default TemplateListAreaContainer;
