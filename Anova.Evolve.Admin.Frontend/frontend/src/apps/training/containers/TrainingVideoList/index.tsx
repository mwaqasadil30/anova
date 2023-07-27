import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import VideoCard from 'apps/training/components/VideoCard';
import { useGetVideos } from 'apps/training/hooks/useGetVideos';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-family: Work Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 2.125rem;
  line-height: 3rem;
  text-align: center;
  letter-spacing: -0.005em;
  color: #ffffff;
  display: block;
  margin: 0;
  margin-bottom: 16px;
`;

const Subtitle = styled.h2`
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.625rem;
  letter-spacing: -0.005em;
  color: #ffffff;
  display: block;
  text-align: center;
`;

const CTA = styled.div`
  font-family: Work Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 1.75rem;
  text-align: center;
  letter-spacing: -0.005em;
  color: #000000;
  text-align: center;
  padding: 32px 0;
`;

const TrainingVideoList = () => {
  const getVideosApi = useGetVideos();

  const trainingBackgroundurl =
    'https://ucarecdn.com/904e6105-d8f6-45bf-b86f-f99a22c933f5/-/quality/smart/-/progressive/yes/';

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12}>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{
            padding: 40,
            maxHeight: 245,
            backgroundImage: `url(${trainingBackgroundurl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        >
          <Grid item xs={12}>
            <Title>Welcome to the Anova Training Hub</Title>
          </Grid>
          <Grid item md={8} lg={6}>
            <Subtitle>
              Anova is firmly committed to offering maximum support to our
              customers so they can optimize the use of Anova applications.
              Below is a suite of free training materials.
            </Subtitle>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <TransitionLoadingSpinner in={getVideosApi.isFetching} />
        <TransitionErrorMessage
          in={!getVideosApi.isFetching && getVideosApi.isError}
        />

        <DefaultTransition
          in={!getVideosApi.isFetching && getVideosApi.isSuccess}
          unmountOnExit
        >
          <div>
            <Grid container justify="center" alignItems="center">
              <Grid item xs={12}>
                <CTA>
                  Start by clicking on one of the training videos below:
                </CTA>
              </Grid>
              <Grid item sm={10}>
                <Grid container spacing={4}>
                  {/* 
                    NOTE: We filter for videos with an order lower than 101 to only get
                    videos that are for the anova transcend (Evolve) app 
                  */}
                  {getVideosApi.data
                    ?.filter(
                      (video) => video.order !== null && video.order <= 100
                    )
                    .map((video) => (
                      <Grid item md={4} sm={6} key={video.id}>
                        <VideoCard video={video} />
                      </Grid>
                    ))}
                </Grid>
              </Grid>
              <Grid item sm={10}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs
                    style={{
                      paddingTop: 64,
                      paddingBottom: 64,
                      paddingLeft: 16,
                      paddingRight: 16,
                    }}
                  >
                    <Divider
                      style={{
                        height: 3,
                        backgroundColor: '#303030',
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={10}>
                <Grid container spacing={4}>
                  {/* 
                    NOTE: We filter for videos with an order higher than 100 to only get
                    videos that are for the legacy DOLV3 app 
                  */}
                  {getVideosApi.data
                    ?.filter(
                      (video) => video.order !== null && video.order >= 101
                    )
                    .map((video) => (
                      <Grid item md={4} sm={6} key={video.id}>
                        <VideoCard video={video} />
                      </Grid>
                    ))}
                </Grid>
              </Grid>
            </Grid>
          </div>
        </DefaultTransition>
      </Grid>
    </Grid>
  );
};

export default TrainingVideoList;
