import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { ReactComponent as PencilIcon } from 'assets/icons/pencil.svg';
import Button from 'components/Button';
import CustomBox from 'components/CustomBox';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { defaultTextColor, mediumTextColor } from 'styles/colours';
import { DCEditorEventRule } from '../../ObjectForm/types';
import ScheduledDeliveryEventRuleHorizontalTable from './ScheduledDeliveryEventRuleHorizontalTable';
import ScheduledDeliveryEventRuleVerticalTable from './ScheduledDeliveryEventRuleVerticalTable';
import { TitleText } from './styled';

const MajorText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${defaultTextColor};
`;

const MinorText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${mediumTextColor};
`;

interface Props {
  index: number;
  eventRule: DCEditorEventRule;
  onEdit: () => void;
}

const ScheduledDeliveryEventRuleBox = ({ index, eventRule, onEdit }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <CustomBox pt={2} pb={4} px={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justify="space-between"
            >
              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <TitleText>{eventRule.description}</TitleText>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Field
                      component={CheckboxWithLabel}
                      id={`scheduledDeliveryEventRules.${index}.enabled-input`}
                      name={`scheduledDeliveryEventRules.${index}.enabled`}
                      type="checkbox"
                      Label={{
                        label: t('ui.common.enabled', 'Enabled'),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Hidden smDown>
              <ScheduledDeliveryEventRuleHorizontalTable index={index} />
            </Hidden>
            <Hidden mdUp>
              <ScheduledDeliveryEventRuleVerticalTable index={index} />
            </Hidden>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <CustomBox paddingLeft={2} borderTop={0}>
            <Grid container alignItems="center" justify="space-between">
              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <MajorText>
                      {t('ui.datachanneleventrule.rosters', 'Rosters')}
                    </MajorText>
                  </Grid>

                  <Grid item>
                    {!eventRule.rosters?.length ? (
                      <MinorText>
                        {t('ui.common.notapplicable', 'N/A')}
                      </MinorText>
                    ) : (
                      <MinorText>
                        {eventRule.rosters
                          ?.map((roster) => roster.description)
                          .filter(Boolean)
                          .join(', ')}
                      </MinorText>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Button
                      variant="text"
                      startIcon={<PencilIcon />}
                      fullWidth
                      onClick={onEdit}
                    >
                      {t('ui.common.edit', 'Edit')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CustomBox>
        </Grid>
      </CustomBox>
    </>
  );
};

export default ScheduledDeliveryEventRuleBox;
