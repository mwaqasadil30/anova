import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { EvolveRtuChannelSetPoint } from 'api/admin/api';
import { ReactComponent as PencilIcon } from 'assets/icons/pencil.svg';
import Button from 'components/Button';
import CustomBox from 'components/CustomBox';
import CheckboxWithLabel from 'components/forms/form-fields/CheckboxWithLabel';
import { Field } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { buildInventoryStatusTypeTextMaping } from 'utils/i18n/enum-to-text';
import { DCEditorEventRule } from '../../ObjectForm/types';
import LevelEventRuleHorizontalTable from './LevelEventRuleHorizontalTable';
import LevelEventRuleVerticalTable from './LevelEventRuleVerticalTable';
import { TitleText } from './styled';

const MajorText = styled(Typography)`
  font-weight: 500;
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const MinorText = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
`;

const InventoryStatusText = styled(Typography)`
  font-weight: 500;
  font-size: 14px;
`;

interface Props {
  index: number;
  eventRule: DCEditorEventRule;
  onEdit: () => void;
  displayUnitsText: string;
  setPoints?: EvolveRtuChannelSetPoint[] | null;
}

const LevelEventRuleBox = ({
  index,
  eventRule,
  onEdit,
  displayUnitsText,
  setPoints,
}: Props) => {
  const { t } = useTranslation();

  const inventoryStatusTypeTextMapping = buildInventoryStatusTypeTextMaping(t);

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

                  <Grid item>
                    <InventoryStatusText>
                      {t(
                        'ui.datachanneleventrule.inventorystatus',
                        'Inventory Status'
                      )}
                      {': '}
                      <span aria-label="Inventory status">
                        {inventoryStatusTypeTextMapping[
                          eventRule.inventoryStatus!
                        ] || t('ui.common.none', 'None')}
                      </span>
                    </InventoryStatusText>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <Field
                      id={`levelEventRules.${index}.enabled-input`}
                      name={`levelEventRules.${index}.enabled`}
                      component={CheckboxWithLabel}
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
            <Hidden mdDown>
              <LevelEventRuleHorizontalTable
                index={index}
                eventRule={eventRule}
                displayUnitsText={displayUnitsText}
                setPoints={setPoints}
              />
            </Hidden>

            <Hidden lgUp>
              <LevelEventRuleVerticalTable
                index={index}
                eventRule={eventRule}
                displayUnitsText={displayUnitsText}
                setPoints={setPoints}
              />
            </Hidden>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <CustomBox px={2} py={1} borderBottom={0} borderTop={0}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Field
                  component={CheckboxWithLabel}
                  id={`levelEventRules.${index}.graphed-input`}
                  name={`levelEventRules.${index}.graphed`}
                  type="checkbox"
                  Label={{
                    label: t('ui.datachanneleventrule.graphed', 'Graphed'),
                  }}
                />
              </Grid>
              <Grid item>
                <Field
                  component={CheckboxWithLabel}
                  id={`levelEventRules.${index}.summarized-input`}
                  name={`levelEventRules.${index}.summarized`}
                  type="checkbox"
                  Label={{
                    label: t(
                      'ui.datachanneleventrule.summarized',
                      'Summarized'
                    ),
                  }}
                />
              </Grid>
              <Grid item>
                <Field
                  component={CheckboxWithLabel}
                  id={`levelEventRules.${index}.alwaysTriggered-input`}
                  name={`levelEventRules.${index}.alwaysTriggered`}
                  type="checkbox"
                  Label={{
                    label: t(
                      'ui.datachanneleventrule.alwaystriggered',
                      'Always Triggered'
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CustomBox>
        </Grid>
        <Grid item xs={12}>
          <CustomBox paddingLeft={2}>
            <Grid container alignItems="center" justify="space-between">
              <Grid item xs>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <MajorText>
                      {t('ui.datachanneleventrule.rosters', 'Rosters')}
                    </MajorText>
                  </Grid>

                  <Grid item xs>
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
          </CustomBox>
        </Grid>
      </CustomBox>
    </>
  );
};

export default LevelEventRuleBox;
