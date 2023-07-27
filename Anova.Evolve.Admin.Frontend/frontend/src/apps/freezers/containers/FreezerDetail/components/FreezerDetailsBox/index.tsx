import Grid from '@material-ui/core/Grid';
import EmphasizedValue from 'apps/freezers/components/EmphasizedValue';
import GridItemWithBorder from 'apps/freezers/components/GridItemWithBorder';
import SectionHeader from 'apps/freezers/components/SectionHeader';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { freezerCritical, freezerWarning } from 'styles/colours';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { GetFreezerDetailDto } from 'api/admin/api';

interface Props {
  freezerDetails?: GetFreezerDetailDto;
}

const FreezerDetailsBox = ({ freezerDetails }: Props) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isBelowSmBreakpoint = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <CustomBoxRedesign p={3} pt={4}>
      <Grid container spacing={3} alignItems="flex-start" justify="flex-start">
        <GridItemWithBorder item xs={12} sm={3} md={2} lg={2}>
          <SectionHeader>
            {t('ui.freezer.freezerDetails.general', 'General')}
          </SectionHeader>
          <Grid container spacing={1} justify="space-around">
            <Grid item xs={12}>
              <EmphasizedValue
                value={freezerDetails?.cycleRunTime}
                valueType="time"
                label={t(
                  'ui.freezer.freezerDetails.general.cycleRunTime',
                  'Cycle run time'
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <EmphasizedValue
                value={freezerDetails?.cycleIdleTime}
                valueType="time"
                label={t(
                  'ui.freezer.freezerDetails.general.cycleIdleTime',
                  'Idle time'
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <EmphasizedValue
                value={freezerDetails?.workingPercent}
                valueType="percentage"
                label={t(
                  'ui.freezer.freezerDetails.general.cycleWorking',
                  'Working'
                )}
                valueColor={freezerCritical}
              />
            </Grid>
          </Grid>
        </GridItemWithBorder>

        <GridItemWithBorder useLeftBorder item xs={12} sm={5} md={3} lg={3}>
          <SectionHeader>
            {t('ui.freezer.freezerDetails.runs', 'Runs')}
          </SectionHeader>
          <Grid container spacing={1} justify="space-around">
            <Grid item sm={6}>
              <Grid container>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.runsAbove72Hours}
                    textSize="small"
                    // TODO: Determine how these labels, which include
                    // numbers that could differ by locale, will be translated
                    label={t(
                      'ui.freezer.freezerDetails.runs.above72',
                      'Above 72'
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.runsAbove60Hours}
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.runs.above60',
                      'Above 60'
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.runsAbove48Hours}
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.runs.above48',
                      'Above 48'
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item sm={6}>
              <Grid container>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.runsAbove36Hours}
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.runs.above36',
                      'Above 36'
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.runsAbove24Hours}
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.runs.above24',
                      'Above 24'
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </GridItemWithBorder>
        <GridItemWithBorder useLeftBorder item sm={4} xs={8} md={2}>
          <SectionHeader>
            {t('ui.freezer.freezerDetails.temperature', 'Temperature')}
          </SectionHeader>
          <Grid container spacing={1} justify="space-around">
            <Grid item md={12}>
              <Grid container>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.temperatureAverage}
                    valueType="temperature"
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.temperature.average',
                      'Average'
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.temperatureMaximum}
                    valueType="temperature"
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.temperature.max',
                      'Max. temperature'
                    )}
                    valueColor={freezerCritical}
                  />
                </Grid>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.temperatureMinimum}
                    valueType="temperature"
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.temperature.min',
                      'Min. temperature'
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </GridItemWithBorder>
        <GridItemWithBorder
          useLeftBorder={!isBelowSmBreakpoint}
          useRightBorder
          item
          xs={8}
          sm={3}
          md={2}
        >
          <SectionHeader>
            {t('ui.freezer.freezerDetails.fanSpeed', 'Fan Speed')}
          </SectionHeader>
          <Grid container spacing={1} justify="flex-start">
            <Grid item md={12}>
              <Grid container>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.fanSpeedAverage}
                    valueType="rpm"
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.fanSpeed.average',
                      'Average'
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.fanSpeedMaximum}
                    valueType="rpm"
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.fanSpeed.max',
                      'Max. speed'
                    )}
                    valueColor={freezerWarning}
                  />
                </Grid>
                <Grid item xs={12}>
                  <EmphasizedValue
                    value={freezerDetails?.fanSpeedMinimum}
                    valueType="rpm"
                    textSize="small"
                    label={t(
                      'ui.freezer.freezerDetails.fanSpeed.min',
                      'Min. speed'
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </GridItemWithBorder>
      </Grid>
    </CustomBoxRedesign>
  );
};

export default FreezerDetailsBox;
