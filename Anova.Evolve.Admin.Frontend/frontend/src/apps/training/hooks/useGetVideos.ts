import { APIQueryKey } from 'api/react-query/helpers';
import { GetTrainingVideosResponse } from 'apps/training/types';
import axios from 'axios';
import { TRAINING_VIDEO_BASE_API_URL } from 'env';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { selectUserId } from 'redux-app/modules/user/selectors';

interface Request {
  userId: string;
}

const getVideos = (request: Request) => {
  return axios
    .get<GetTrainingVideosResponse>(
      `${TRAINING_VIDEO_BASE_API_URL}/api/v1/videos/`,
      {
        headers: {
          'X-Transcend-User-Id': request.userId,
        },
        params: {
          page_size: 100,
        },
      }
    )
    .then((response) => {
      return response.data.results;
    });
};

export const useGetVideos = () => {
  const userId = useSelector(selectUserId);
  return useQuery([APIQueryKey.getTrainingVideos, userId], () =>
    getVideos({ userId: userId || '' })
  );
};
