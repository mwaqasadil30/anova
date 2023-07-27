/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import CustomThemeProvider from 'components/CustomThemeProvider';
import EmptyContentBlock from 'components/EmptyContentBlock';
import FormatDateTime from 'components/FormatDateTime';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import round from 'lodash/round';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { isNumber } from 'utils/format/numbers';
import { useGetUsageRateSummaryReport } from './hooks/useGetUsageRateSummaryReport';
import PageIntro from './PageIntro';

const ValueText = styled(Typography)`
  font-weight: 500;
  font-size: 24px;
  line-height: 20px;
`;

const LabelText = styled(Typography)`
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const SmallText = styled(Typography)`
  font-size: 12px;
  color: ${(props) => props.theme.palette.text.secondary};
`;

const roundAndFormatValue = (
  value: number | null | undefined,
  decimalPlaces = 0
) => {
  return isNumber(value) ? round(value!, decimalPlaces).toLocaleString() : '';
};

interface Props {
  assetId?: string | null;
  closeCallback: () => void;
}

const VirtualFlowMeterDrawer = ({ assetId, closeCallback }: Props) => {
  const { t } = useTranslation();

  const getUsageRateSummaryReportApi = useGetUsageRateSummaryReport({
    assetId,
  });
  const is404Error =
    !!getUsageRateSummaryReportApi.error &&
    'status' in (getUsageRateSummaryReportApi.error as any) &&
    (getUsageRateSummaryReportApi.error as any).status === 404;

  return (
    <>
      <CustomThemeProvider forceThemeType="dark">
        <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
          <PageIntro
            title={t('ui.assetdetail.virtualFlowMeter', 'Virtual Flow Meter')}
            closeCallback={closeCallback}
          />
        </PageIntroWrapper>
      </CustomThemeProvider>

      <Box mt={4} />

      <TransitionLoadingSpinner
        in={!!getUsageRateSummaryReportApi.isFetching}
      />
      <TransitionErrorMessage
        in={
          !getUsageRateSummaryReportApi.isFetching &&
          !is404Error &&
          getUsageRateSummaryReportApi.isError
        }
      />

      <DefaultTransition
        in={
          !getUsageRateSummaryReportApi.isFetching &&
          (getUsageRateSummaryReportApi.isSuccess || is404Error)
        }
        unmountOnExit
      >
        <div>
          {is404Error ? (
            <EmptyContentBlock
              message={t('ui.common.noDataFound', 'No data found')}
            />
          ) : (
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12}>
                <ValueText>
                  {roundAndFormatValue(
                    getUsageRateSummaryReportApi.data?.volumeToday
                  )}{' '}
                  SCM
                </ValueText>
                <LabelText>
                  {t('ui.common.currentDayUsage', 'Current Day Usage')}
                </LabelText>
              </Grid>
              <Grid item xs={12}>
                <ValueText>
                  {roundAndFormatValue(
                    getUsageRateSummaryReportApi.data?.volumeYesterday
                  )}{' '}
                  SCM
                </ValueText>
                <LabelText>
                  {t('ui.common.yesterdayUsage', 'Yesterday Usage')}
                </LabelText>
              </Grid>
              <Grid item xs={12}>
                <ValueText>
                  {roundAndFormatValue(
                    getUsageRateSummaryReportApi.data?.volumeMonthToDate
                  )}{' '}
                  SCM
                </ValueText>
                <LabelText>
                  {t('ui.common.monthToDayUsage', 'Month to Day Usage')}
                </LabelText>
              </Grid>
              <Grid item xs={12}>
                <ValueText>
                  {roundAndFormatValue(
                    getUsageRateSummaryReportApi.data?.volumeLastMonth
                  )}{' '}
                  SCM
                </ValueText>
                <LabelText>
                  {t('ui.common.lastMonthUsage', 'Last Month Usage')}
                </LabelText>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <ValueText>
                  {roundAndFormatValue(
                    getUsageRateSummaryReportApi.data?.volumeAllTotal
                  )}{' '}
                  SCM
                </ValueText>
                <LabelText>
                  {t('ui.common.totalUsage', 'Total Usage')}
                </LabelText>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <SmallText>
                  {t('ui.common.lastUpdated', 'Last Updated')}:{' '}
                  <FormatDateTime
                    date={getUsageRateSummaryReportApi.data?.lastUpdatedDate}
                  />
                </SmallText>
                {getUsageRateSummaryReportApi.data?.timeZoneAsText && (
                  <SmallText>
                    {t('ui.common.basedOnTimezone', 'Based on {{timezone}}', {
                      timezone:
                        getUsageRateSummaryReportApi.data?.timeZoneAsText,
                    })}
                  </SmallText>
                )}
              </Grid>
            </Grid>
          )}
        </div>
      </DefaultTransition>
    </>
  );
};

export default VirtualFlowMeterDrawer;
