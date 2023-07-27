import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import routes from 'apps/training/routes';
import { TrainingVideo } from 'apps/training/types';
import DolveLogo from 'assets/images/dolve-logo.svg';
import TranscendLogo from 'components/icons/Logo';
import React from 'react';
import { generatePath, Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledTranscendLogo = styled(TranscendLogo)`
  height: 20px;
`;

interface Props {
  video: TrainingVideo;
}

const VideoCard = ({ video }: Props) => {
  const { order, name, slug } = video;

  const videoDetailRoutePath = slug
    ? generatePath(routes.detail, { slug })
    : '';

  return (
    <Link to={videoDetailRoutePath} style={{ textDecoration: 'none' }}>
      <Card square>
        <CardActionArea>
          <CardContent style={{ padding: 0, minHeight: 200 }}>
            <Grid
              container
              direction="column"
              justify="space-between"
              wrap="nowrap"
              style={{ minHeight: 200 }}
            >
              <Grid item style={{ backgroundColor: '#303030' }}>
                <div
                  style={{
                    height: 40,
                    backgroundColor: '#FFD732',
                    width: 60,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'Work Sans',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: 18,
                    lineHeight: 24,
                  }}
                >
                  <div
                    style={{
                      color: 'black',
                    }}
                  >
                    {order}
                  </div>
                </div>
              </Grid>
              <Grid item style={{ padding: 16 }}>
                <div
                  style={{
                    fontFamily: 'Work Sans',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '18px',
                    lineHeight: '24px',
                    alignItems: 'center',
                    letterSpacing: '-0.005em',
                    color: '#1a1a1a',
                  }}
                >
                  {name}
                </div>
              </Grid>
              <Grid item style={{ alignSelf: 'flex-end', padding: 16 }}>
                {order !== null && order <= 100 ? (
                  <StyledTranscendLogo />
                ) : (
                  <img src={DolveLogo} alt="dolv3 logo" />
                )}
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default VideoCard;
