import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from 'components/CircularProgress';
import CustomBox from 'components/CustomBox';
import MessageBlock from 'components/MessageBlock';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import AllProductsDropdown from './components/AllProductsDropdown';
import DeliveryPerformanceBarChart from './components/DeliveryPerformanceBarChart';
import EventsLineChart from './components/EventsChart';
import InventoryStatusPieChart from './components/InventoryStatusPieChart';
import NoDataFound from './components/NoDataFound';
import { useAllProductsData } from './hooks/useAllProductsData';
import { useDeliveriesChartData } from './hooks/useDeliveriesChartData';
import { usePieChartData } from './hooks/usePieChartData';

// Since the boxes of charts on the dashboard need to be stretched to their max
// heights, we use `height: 100%`, however, this causes issues with
// material-ui's Grid. We use calc with the a certain value based on the common
// top padding + bottom padding + top and bottom border widths.
const commonBoxHeightCalc = 'calc(100% - 42px)';

const StyledTypography = styled(Typography)`
  font-weight: 500;
  font-size: 17px;
`;

const Dashboard = () => {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(moment().startOf('month'));

  const [selectedInventoryProductId, setSelectedInventoryProductId] = useState(
    ''
  );
  const [selectedDeliveryProductId, setSelectedDeliveryProductId] = useState(
    ''
  );

  const pieChartApi = usePieChartData(selectedInventoryProductId);
  const deliveryChartApi = useDeliveriesChartData({
    year: selectedDate.year(),
    month: selectedDate.month(),
    productIds: selectedDeliveryProductId ? [selectedDeliveryProductId] : [],
  });

  const productsApi = useAllProductsData();

  return (
    <Box mt={3}>
      <Grid container spacing={2} alignItems="stretch">
        <Grid item xs={12} lg={4}>
          <CustomBox
            grayBackground
            px={3}
            pt={2}
            pb={3}
            style={{ height: commonBoxHeightCalc }}
          >
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ height: '100%' }}
            >
              <Grid item xs={6}>
                <StyledTypography>
                  {t('ui.assetdashboard.inventoryLevels', 'Inventory Levels')}
                </StyledTypography>
              </Grid>
              <Grid item xs={6}>
                <AllProductsDropdown
                  products={productsApi.data}
                  value={selectedInventoryProductId}
                  onChange={(event) => {
                    setSelectedInventoryProductId(event.target.value);
                  }}
                  disabled={pieChartApi.isFetching}
                />
              </Grid>
              <Grid item xs={12} style={{ height: commonBoxHeightCalc }}>
                <CustomBox
                  px={3}
                  pt={2}
                  pb={3}
                  height={commonBoxHeightCalc}
                  display="flex"
                  alignItems="center"
                >
                  <Box width="100%">
                    <Fade in={pieChartApi.isFetching} unmountOnExit>
                      <div>
                        {pieChartApi.isFetching && (
                          <MessageBlock>
                            <CircularProgress />
                          </MessageBlock>
                        )}
                      </div>
                    </Fade>
                    <Fade in={!pieChartApi.isFetching} unmountOnExit>
                      <div>
                        {!pieChartApi.isFetching &&
                          (pieChartApi.data ? (
                            <InventoryStatusPieChart data={pieChartApi.data} />
                          ) : (
                            <NoDataFound />
                          ))}
                      </div>
                    </Fade>
                  </Box>
                </CustomBox>
              </Grid>
            </Grid>
          </CustomBox>
        </Grid>

        <Grid item xs={12} lg={8}>
          <CustomBox
            grayBackground
            px={3}
            pt={2}
            pb={3}
            height={commonBoxHeightCalc}
          >
            <Grid
              container
              spacing={2}
              alignItems="center"
              style={{ height: '100%' }}
            >
              <Grid item xs={6}>
                <StyledTypography>
                  {t(
                    'ui.assetdashboard.deliveryPerformance',
                    'Delivery Performance'
                  )}
                </StyledTypography>
              </Grid>
              <Grid item xs={6}>
                <AllProductsDropdown
                  products={productsApi.data}
                  value={selectedDeliveryProductId}
                  onChange={(event) => {
                    setSelectedDeliveryProductId(event.target.value);
                  }}
                  disabled={deliveryChartApi.isLoading}
                />
              </Grid>
              <Grid item xs={12} style={{ height: commonBoxHeightCalc }}>
                <CustomBox height="100%">
                  {deliveryChartApi.isLoading && (
                    <Fade in={deliveryChartApi.isLoading} unmountOnExit>
                      <MessageBlock height="100%">
                        <CircularProgress style={{ margin: 24 }} />
                      </MessageBlock>
                    </Fade>
                  )}
                  <Fade in={!deliveryChartApi.isLoading} unmountOnExit>
                    <Box height="100%">
                      {!deliveryChartApi.isLoading &&
                        (deliveryChartApi.deliveries.length ? (
                          <DeliveryPerformanceBarChart
                            selectedDate={selectedDate}
                            setSelectedDate={setSelectedDate}
                            deliveryApi={deliveryChartApi}
                          />
                        ) : (
                          <Box
                            px={3}
                            pt={2}
                            pb={3}
                            height={commonBoxHeightCalc}
                            display="flex"
                            alignItems="center"
                          >
                            <NoDataFound />
                          </Box>
                        ))}
                    </Box>
                  </Fade>
                </CustomBox>
              </Grid>
            </Grid>
          </CustomBox>
        </Grid>

        <Grid item xs={12}>
          <CustomBox grayBackground px={3} pt={2} pb={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <StyledTypography>
                  {t('ui.common.events', 'Events')}
                </StyledTypography>
              </Grid>
              <Grid item xs={12}>
                <EventsLineChart />
              </Grid>
            </Grid>
          </CustomBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
