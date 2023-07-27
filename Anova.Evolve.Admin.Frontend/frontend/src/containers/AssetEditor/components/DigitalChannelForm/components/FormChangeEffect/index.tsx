import React, { useCallback, useEffect } from 'react';
import {
  EvolveRetrieveRtuChannelUsageInfoListByRtuRequest,
  RTUChannelUsageInfo,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { Values } from '../ObjectForm/types';

interface FormChangeEffectProps {
  values: Values;
  setRtuChannelsFromRtu: React.Dispatch<
    React.SetStateAction<RTUChannelUsageInfo[] | null | undefined>
  >;
}

const FormChangeEffect = ({
  values,
  setRtuChannelsFromRtu,
}: FormChangeEffectProps) => {
  const { rtuId } = values;

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

  useEffect(() => {
    if (rtuId) {
      fetchRtuDetails({
        rtuId,
        dataChannelId: null,
        excludeNonNumericChannelNumbers: false,
      } as EvolveRetrieveRtuChannelUsageInfoListByRtuRequest);
    }
  }, [rtuId]);

  return null;
};

export default FormChangeEffect;
