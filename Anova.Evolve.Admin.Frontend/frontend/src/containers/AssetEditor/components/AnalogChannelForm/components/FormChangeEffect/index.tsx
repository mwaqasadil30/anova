import React, { useCallback, useEffect } from 'react';
import {
  EvolveRetrieveRtuChannelUsageInfoListByRtuRequest,
  EvolveRetrieveSourceDataChannelDefaultsByIdRequest,
  RTUChannelUsageInfo,
  SourceDataChannelDefaultsInfo,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { Values } from '../ObjectForm/types';

interface FormChangeEffectProps {
  values: Values;
  setRtuChannelsFromRtu: React.Dispatch<
    React.SetStateAction<RTUChannelUsageInfo[] | null | undefined>
  >;
  setSourceDataChannelDetails: React.Dispatch<
    React.SetStateAction<SourceDataChannelDefaultsInfo | null | undefined>
  >;
}

const FormChangeEffect = ({
  values,
  setRtuChannelsFromRtu,
  setSourceDataChannelDetails,
}: FormChangeEffectProps) => {
  const { rtuId, sourceDataChannelId } = values;

  const fetchRtuDetails = useCallback(
    (request: EvolveRetrieveRtuChannelUsageInfoListByRtuRequest) => {
      return AdminApiService.RTUService.retrieveRtuChannelUsageInfoListByRtu_RetrieveRtuChannelUsageInfoListByRtu(
        request
      )
        .then((response) => {
          setRtuChannelsFromRtu(
            response.retrieveRTUChannelUsageInfoListByRTUResult
          );
        })
        .catch((error) => {
          console.error('Unable to fetch RTU details', error);
        });
    },
    []
  );

  const fetchDataChannelDetails = useCallback(
    (request: EvolveRetrieveSourceDataChannelDefaultsByIdRequest) => {
      return AdminApiService.DataChannelService.retrieveSourceDataChannelDefaultsById_RetrieveSourceDataChannelDefaultsById(
        request
      )
        .then((response) => {
          setSourceDataChannelDetails(
            response.retrieveSourceDataChannelDefaultsByIdResult
          );
        })
        .catch((error) => {
          console.error('Unable to fetch source data channel', error);
        });
    },
    []
  );

  useEffect(() => {
    if (rtuId) {
      fetchRtuDetails({
        rtuId,
        dataChannelId: null,
        excludeNonNumericChannelNumbers: false,
      } as EvolveRetrieveRtuChannelUsageInfoListByRtuRequest);
    }
  }, [rtuId]);

  useEffect(() => {
    if (sourceDataChannelId) {
      fetchDataChannelDetails({
        sourceDataChannelId,
      } as EvolveRetrieveSourceDataChannelDefaultsByIdRequest);
    } else {
      setSourceDataChannelDetails(null);
    }
  }, [sourceDataChannelId]);

  return null;
};

export default FormChangeEffect;
