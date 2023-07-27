import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { GetFreezerDetailDto } from 'api/admin/api';
import EmphasizedValue from 'apps/freezers/components/EmphasizedValue';
import GridItemWithBorder from 'apps/freezers/components/GridItemWithBorder';
import SectionHeader from 'apps/freezers/components/SectionHeader';
import { ReactComponent as CleanDriedIcon } from 'assets/icons/clean-dried-icon.svg';
import { ReactComponent as DoorsopenIcon } from 'assets/icons/doorsopen-event.svg';
import { ReactComponent as LowtempIcon } from 'assets/icons/lowtemp-event.svg';
import { ReactComponent as OxygenIcon } from 'assets/icons/oxygen-event.svg';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { freezerCritical } from 'styles/colours';

interface Props {
  freezerDetails?: GetFreezerDetailDto;
}

const FreezerEventsBox = ({ freezerDetails }: Props) => {
  const { t } = useTranslation();

  const theme = useTheme();
  const isBelowMdBreakpoint = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <CustomBoxRedesign p={3} pt={4}>
      <Grid container spacing={3} alignItems="flex-start" justify="flex-start">
        <GridItemWithBorder
          useRightBorder={!isBelowMdBreakpoint}
          item
          xs={12}
          lg={7}
          xl={5}
        >
          <SectionHeader>
            {t('ui.freezer.freezerDetails.events', 'Events')}
          </SectionHeader>
          <Grid container spacing={4} justify="flex-start">
            <Grid item xs={6} lg={3}>
              <EmphasizedValue
                value={freezerDetails?.oxygenCount}
                icon={<OxygenIcon />}
                label={t('ui.freezer.freezerDetails.events.oxygen', 'Oxygen')}
              />
            </Grid>
            <Grid item xs={6} lg={3}>
              <EmphasizedValue
                value={freezerDetails?.lowTemperatureCount}
                icon={<LowtempIcon />}
                label={t(
                  'ui.freezer.freezerDetails.events.lowTemperature',
                  'Low temp.'
                )}
              />
            </Grid>
            <Grid item xs={6} lg={3}>
              <EmphasizedValue
                value={freezerDetails?.cleanDriedCount}
                icon={<CleanDriedIcon />}
                label={t(
                  'ui.freezer.freezerDetails.events.cleanDried',
                  'Clean dried'
                )}
              />
            </Grid>
            <Grid item xs={6} lg={3}>
              <EmphasizedValue
                value={freezerDetails?.doorsOpenCount}
                icon={<DoorsopenIcon />}
                label={t(
                  'ui.freezer.freezerDetails.events.doorsOpen',
                  'Doors open'
                )}
                valueColor={freezerCritical}
              />
            </Grid>
          </Grid>
        </GridItemWithBorder>
      </Grid>
    </CustomBoxRedesign>
  );
};

export default FreezerEventsBox;
