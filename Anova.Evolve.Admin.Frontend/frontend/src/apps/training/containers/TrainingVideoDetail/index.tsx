import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import VideoCard from 'apps/training/components/VideoCard';
import { useGetVideos } from 'apps/training/hooks/useGetVideos';
import routes from 'apps/training/routes';
import DefaultTransition from 'components/common/animations/DefaultTransition';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import EmptyContentBlock from 'components/EmptyContentBlock';
import FullHeightWrapper from 'components/layout/FullHeightWrapper';
import debounce from 'lodash/debounce';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { AnalyticsEvent } from 'types';
import { ai } from 'utils/app-insights';

const SidebarHeading = styled.div`
  font-family: Work Sans;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 28px;
  letter-spacing: -0.005em;
  color: #000000;
  text-align: left;
  padding: 16px 0 10px 0;
  margin: 0;
  align-self: flex-start;
  border-bottom: 1px solid #cfcfcf;
`;

const PlaylistItemTitle = styled.h2`
  font-family: Work Sans;
  font-style: normal;
  font-weight: 600;
  // TODO convertto rems
  font-size: 20px;
  line-height: 20px;
  letter-spacing: -0.005em;
  color: #161616;
`;

const VideoMetadata = styled.div`
  font-family: Work Sans;
  font-style: normal;
  font-weight: normal;
  // TODO convertto rems
  font-size: 16px;
  line-height: 20px;
  letter-spacing: -0.005em;
  color: #767676;
`;

const VideoSummary = styled.div`
  font-family: Work Sans;
  font-style: normal;
  font-weight: normal;
  // TODO convertto rems
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.005em;
  color: #1a1a1a;
  white-space: pre-line;
`;

interface RouteParams {
  slug: string;
}

const TrainingVideoDetail = () => {
  const { slug } = useParams<RouteParams>();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPlayedVideo, setHasPlayedVideo] = useState(false);

  const getVideosApi = useGetVideos();

  // It's possible a video error may constantly happen. At the moment we don't
  // detect if the error is a 404 (invalid video URL) or a 403 (expired video
  // URL). If its a 403, this correctly refetches the video list with fresh
  // non-expired URLs. If its a 404, this will continuously fetch the video
  // URLs (which is why this is debounced).
  // TODO: Find a way to detect 404s on the video URLs.
  const delayedRefetch = useCallback(
    debounce(() => {
      const videoCurrentTimeWhenExpired = videoRef.current?.currentTime;
      return getVideosApi.refetch().then(() => {
        if (videoRef.current && videoCurrentTimeWhenExpired !== undefined) {
          videoRef.current.currentTime = videoCurrentTimeWhenExpired;
          videoRef.current?.load();
          videoRef.current?.play().catch((error) => {
            // Chrome throws an error when attempting to play a video, without
            // an interaction from the user on the document first.
            console.error(error);
          });
        }
      });
    }, 5000),
    []
  );

  // If an error occurs on the video, then it may have expired. This usually
  // happens when the video is playing (since the browser needs to request the
  // video, but may receive a 403). Re-fetch the video to receive a new
  // non-expired token and automatically play the video.
  const handleVideoError = useCallback(() => {
    delayedRefetch();
  }, []);

  const currentVideo = useMemo(
    () => getVideosApi.data?.find((video) => video.slug === slug),
    [getVideosApi.data, slug]
  );

  useEffect(() => {
    setHasPlayedVideo(false);
  }, [currentVideo?.id]);

  useEffect(() => {
    const videoFile = currentVideo?.file;
    const match = videoFile?.match(/exp=(\d+)/);
    const expiryUnixTimestamp = match?.[1];

    // Polling to check if the video has expired. If the video doesn't have an
    // expiry timestamp, the list of video's aren't re-fetched.
    const intervalId = setInterval(() => {
      if (expiryUnixTimestamp) {
        const expiresOn = moment.unix(Number(expiryUnixTimestamp));
        const now = moment();

        const differenceInSeconds = expiresOn.diff(now, 'seconds');

        // The video is about to expire, or has expired
        if (differenceInSeconds <= 10) {
          const videoCurrentTimeWhenExpired = videoRef.current?.currentTime;

          // Re-fetch a new video with a new non-expired token ONLY when the
          // video is paused. The video may still be playable even if its
          // expired (the browser may be caching portions of the video)
          const isVideoPaused = videoRef.current?.paused;
          if (isVideoPaused) {
            getVideosApi.refetch().then(() => {
              if (
                videoRef.current &&
                videoCurrentTimeWhenExpired !== undefined
              ) {
                videoRef.current.currentTime = videoCurrentTimeWhenExpired;
              }
            });
          }
        }
      }
    }, 1000 * 30);

    return () => clearInterval(intervalId);
  }, [currentVideo?.file]);

  const playedVideo = () => {
    // @ts-ignore
    if (currentVideo && !hasPlayedVideo) {
      setHasPlayedVideo(true);

      ai.appInsights.trackEvent({
        name: AnalyticsEvent.VideoPlayed,
        properties: {
          category: 'Training Videos',
          videoId: currentVideo.id,
          videoName: currentVideo.name,
          videoOrder: currentVideo.order,
        },
      });
    }
  };

  return (
    <Box mx={-4} mb={-2}>
      <TransitionLoadingSpinner in={getVideosApi.isLoading} />
      <TransitionErrorMessage
        in={!getVideosApi.isLoading && getVideosApi.isError}
      />

      <DefaultTransition
        in={!getVideosApi.isLoading && getVideosApi.isSuccess}
        unmountOnExit
      >
        <Grid container wrap="nowrap" style={{ display: 'flex', flex: 1 }}>
          <Grid item xs={3}>
            <FullHeightWrapper
              style={{ overflowY: 'auto', background: '#f1f1f1' }}
            >
              <Box p={2}>
                <Grid
                  container
                  justify="flex-start"
                  alignItems="center"
                  direction="column"
                  spacing={4}
                >
                  <Grid item style={{ padding: '16px 0' }}>
                    <Typography
                      component={Link}
                      to={routes.list}
                      display="inline"
                      style={{ textDecoration: 'none' }}
                    >
                      <SidebarHeading>Training Videos</SidebarHeading>
                    </Typography>
                  </Grid>
                  {!!getVideosApi.data?.length && (
                    <Grid item xs={12} style={{ width: '100%' }}>
                      <Grid container spacing={3}>
                        {getVideosApi.data?.map((video) => (
                          <Grid key={video.id} item xs={12}>
                            <VideoCard video={video} />
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </FullHeightWrapper>
          </Grid>
          <Grid item xs={9}>
            <FullHeightWrapper style={{ overflowY: 'auto' }}>
              <Grid
                container
                justify="center"
                alignItems="flex-start"
                style={{ padding: 65 }}
              >
                {!currentVideo?.file ? (
                  <Grid item xs={12}>
                    <EmptyContentBlock message="Unable to find video" />
                  </Grid>
                ) : (
                  <>
                    <Grid
                      item
                      xs={12}
                      style={{
                        alignSelf: 'center',
                        width: '100%',
                        background: 'black',
                      }}
                    >
                      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                      <video
                        ref={videoRef}
                        onPlay={playedVideo}
                        key={currentVideo.file!}
                        controls
                        controlsList="nodownload"
                        width="100%"
                        height="100%"
                        preload="metadata"
                        poster={currentVideo.photo || undefined}
                        onError={handleVideoError}
                      >
                        <source src={currentVideo?.file || undefined} />
                        Sorry, your browser doesn&rsquo;t support embedded
                        videos.
                      </video>
                    </Grid>
                    <Grid item xs={12}>
                      <br />
                      <PlaylistItemTitle>
                        {currentVideo.order}. {currentVideo.name}
                      </PlaylistItemTitle>
                      <br />
                      <VideoMetadata>
                        Created on :{' '}
                        {moment(currentVideo.created).format('MMMM D, YYYY')}
                      </VideoMetadata>
                      <br />
                      <VideoSummary>{currentVideo.summary}</VideoSummary>
                    </Grid>
                  </>
                )}
              </Grid>
            </FullHeightWrapper>
          </Grid>
        </Grid>
      </DefaultTransition>
    </Box>
  );
};

export default TrainingVideoDetail;
