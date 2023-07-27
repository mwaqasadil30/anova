import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from 'components/tables/components/Table';
import TableBody from 'components/tables/components/TableBody';
import TableBodyRow from 'components/tables/components/TableBodyRow';
import TableCell from 'components/tables/components/TableCell';
import TableContainer from 'components/tables/components/TableContainer';
import TableHead from 'components/tables/components/TableHead';
import TableHeadCell from 'components/tables/components/TableHeadCell';
import TableHeadRow from 'components/tables/components/TableHeadRow';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsUserSystemAdmin } from 'redux-app/modules/user/selectors';

interface Props {
  assetDetailsApiDuration: number | null;
  readingsApiDuration: number | null;
  forecastsApiDuration: number | null;
}

const AssetDetailsApiTimers = ({
  assetDetailsApiDuration,
  readingsApiDuration,
  forecastsApiDuration,
}: Props) => {
  const isSystemAdmin = useSelector(selectIsUserSystemAdmin);

  if (!isSystemAdmin) {
    return null;
  }

  return (
    <Box mb={2}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableHeadRow>
                  <TableHeadCell>API</TableHeadCell>
                  <TableHeadCell>Duration</TableHeadCell>
                </TableHeadRow>
              </TableHead>
              <TableBody>
                <TableBodyRow>
                  <TableCell>
                    <Typography>Get Asset Details</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {assetDetailsApiDuration
                        ? `${assetDetailsApiDuration / 1000} seconds`
                        : 'Pending'}
                    </Typography>
                  </TableCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableCell>
                    <Typography>Readings</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {readingsApiDuration
                        ? `${readingsApiDuration / 1000} seconds`
                        : 'Pending'}
                    </Typography>
                  </TableCell>
                </TableBodyRow>
                <TableBodyRow>
                  <TableCell>
                    <Typography>Forecasts</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>
                      {forecastsApiDuration
                        ? `${forecastsApiDuration / 1000} seconds`
                        : 'Pending'}
                    </Typography>
                  </TableCell>
                </TableBodyRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssetDetailsApiTimers;
