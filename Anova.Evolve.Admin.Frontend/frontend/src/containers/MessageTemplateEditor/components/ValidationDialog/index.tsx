/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UpdatedConfirmationDialog from 'components/dialog/UpdatedConfirmationDialog';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { TemplateValidation } from '../../types';

const StyledValidationTitle = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize.commonFontSize};
`;

const StyledValidationHeaderText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

const StyledValidationMessage = styled(Typography)`
  font-size: 13px;
`;

interface ErrorMessageGridItemProps {
  placement: 'start' | 'end';
  positions?: string;
}

const ErrorMessageGridItem = ({
  placement,
  positions,
}: ErrorMessageGridItemProps) => {
  const { t } = useTranslation();
  if (!positions) {
    return null;
  }

  const message =
    placement === 'start'
      ? t(
          'ui.messageTemplateEditor.startBraceMismatch',
          'Start Brace mismatch at position(s): {{positions}}.',
          {
            positions,
          }
        )
      : t(
          'ui.messageTemplateEditor.endBraceMismatch',
          'End Brace mismatch at position(s): {{positions}}.',
          {
            positions,
          }
        );

  return (
    <Grid item xs={12}>
      <StyledValidationMessage>{message}</StyledValidationMessage>
    </Grid>
  );
};

interface Props {
  open: boolean;
  close: () => void;
  templateValidation: TemplateValidation | null;
}

const ValidationDialog = ({ open, close, templateValidation }: Props) => {
  const { t } = useTranslation();

  const isSubjectValid = templateValidation?.subject.isValid;
  const isBodyValid = templateValidation?.body.isValid;
  const subjectStartErrorPositions = templateValidation?.subject.startErrorPositions?.join(
    ', '
  );
  const subjectEndErrorPositions = templateValidation?.subject.endErrorPositions?.join(
    ', '
  );
  const bodyStartErrorPositions = templateValidation?.body.startErrorPositions?.join(
    ', '
  );
  const bodyEndErrorPositions = templateValidation?.body.endErrorPositions?.join(
    ', '
  );
  const subjectInvalidVariables = templateValidation?.subject.invalidVariables;
  const bodyInvalidVariables = templateValidation?.body.invalidVariables;

  const mainTitle =
    isSubjectValid && isBodyValid
      ? t('ui.messageTemplateEditor.validTemplate', 'Valid Message Template')
      : t(
          'ui.messageTemplateEditor.validationFailed',
          'Message Validation Failed'
        );

  return (
    <UpdatedConfirmationDialog
      open={open}
      maxWidth="xs"
      mainTitle={mainTitle}
      content={
        <Box p={2}>
          {isSubjectValid && isBodyValid ? (
            <>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <StyledValidationTitle>
                    {t(
                      'ui.messageTemplateEditor.validationSuccess',
                      'Subject and body templates are valid'
                    )}
                  </StyledValidationTitle>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid container spacing={2} justify="flex-start">
                <Grid item xs={10}>
                  <Grid container spacing={2}>
                    {!isSubjectValid && (
                      <>
                        <Grid item xs={12}>
                          <StyledValidationHeaderText>
                            {t(
                              'ui.messageTemplateEditor.subjectValidationFailed',
                              'Subject Template:'
                            )}
                          </StyledValidationHeaderText>
                        </Grid>
                        <ErrorMessageGridItem
                          placement="start"
                          positions={subjectStartErrorPositions}
                        />
                        <ErrorMessageGridItem
                          placement="end"
                          positions={subjectEndErrorPositions}
                        />
                        {!!subjectInvalidVariables?.length && (
                          <Grid item xs={12}>
                            <StyledValidationMessage>
                              {t(
                                'ui.messageTemplateEditor.subjectInvalidVariables',
                                'Invalid variable(s) in subject:'
                              )}{' '}
                              {subjectInvalidVariables
                                .map((variable) => `"${variable}"`)
                                .join(', ')}
                            </StyledValidationMessage>
                          </Grid>
                        )}
                      </>
                    )}

                    {!isBodyValid && (
                      <>
                        <Grid item xs={12}>
                          <StyledValidationHeaderText>
                            {t(
                              'ui.messageTemplateEditor.bodyValidationFailed',
                              'Body Template:'
                            )}
                          </StyledValidationHeaderText>
                        </Grid>
                        <ErrorMessageGridItem
                          placement="start"
                          positions={bodyStartErrorPositions}
                        />
                        <ErrorMessageGridItem
                          placement="end"
                          positions={bodyEndErrorPositions}
                        />
                        {!!bodyInvalidVariables?.length && (
                          <Grid item xs={12}>
                            <StyledValidationMessage>
                              {t(
                                'ui.messageTemplateEditor.bodyInvalidVariables',
                                'Invalid variable(s) in body:'
                              )}{' '}
                              {bodyInvalidVariables
                                .map((variable) => `"${variable}"`)
                                .join(', ')}
                            </StyledValidationMessage>
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      }
      onConfirm={close}
      hideCancelButton
    />
  );
};

export default ValidationDialog;
