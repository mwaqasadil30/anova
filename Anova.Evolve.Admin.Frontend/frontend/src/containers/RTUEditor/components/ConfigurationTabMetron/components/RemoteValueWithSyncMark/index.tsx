import React from 'react';
import Grid from '@material-ui/core/Grid';
import { ReactComponent as SyncErrorIcon } from 'assets/icons/rtu-sync-error.svg';

type RemoteValueWithSyncMarkProps = {
  text?: string | null | JSX.Element;
  status?: boolean;
};
const RemoteValueWithSyncMark = ({
  text,
  status,
}: RemoteValueWithSyncMarkProps) => {
  if (!text) return <>-</>;

  return (
    <Grid container alignItems="flex-end" spacing={1}>
      <Grid item xs={10} md={11} lg={11} style={{ whiteSpace: 'nowrap' }}>
        {text || '-'}
      </Grid>
      {status ? null : (
        <Grid item xs={2} md={1} lg={1}>
          <SyncErrorIcon />
        </Grid>
      )}
    </Grid>
  );
};
export default RemoteValueWithSyncMark;
