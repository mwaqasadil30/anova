/* eslint no-console: ["error", { allow: ["time", "timeEnd", "error"] }] */
import {
  EvolveRetrieveTreeNodeInfoListBranchByParentNodeRequest,
  RetrieveTreeNodeInfoListResult,
  TreeNodeInfo,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';

export interface NodeDetails {
  isFetching: boolean;
  children?: TreeNodeInfo[];
}

export const useAssetTreeParentNodeInfo = () => {
  const { t } = useTranslation();

  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState<
    RetrieveTreeNodeInfoListResult | null | undefined
  >();

  const [nodeIdToDetailsMapping, setNodeIdToDetailsMapping] = useState<
    Record<string, NodeDetails>
  >({});

  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;

  const fetchAssetTreeParentNodeRecords = (
    selectedParentNode?: TreeNodeInfo | null
  ) => {
    console.time('children API Duration');
    setIsFetching(true);
    setNodeIdToDetailsMapping({
      ...nodeIdToDetailsMapping,
      [selectedParentNode?.breadCrumb!]: {
        ...nodeIdToDetailsMapping[selectedParentNode?.breadCrumb!],
        isFetching: true,
      },
    });

    const data = {
      domainId,
      parentNode: selectedParentNode,
    } as EvolveRetrieveTreeNodeInfoListBranchByParentNodeRequest;

    return ApiService.GeneralService.retrieveTreeNodeInfoListBranchByParentNode_RetrieveTreeNodeInfoListBranchByParentNode(
      data
    )
      .then((response) => {
        console.time('children Render Duration');
        const result =
          response.retrieveTreeNodeInfoListBranchByParentNodeResult;
        setResponseData(result);

        setNodeIdToDetailsMapping((prevState) => ({
          ...prevState,
          [selectedParentNode?.breadCrumb!]: {
            ...prevState[selectedParentNode?.breadCrumb!],
            children: result?.records || [],
            isFetching: false,
          },
        }));
      })
      .catch((responseError) => {
        const commonErrorMessage = t(
          'ui.common.unableToRetrieveDataError',
          'Unable to retrieve data'
        );
        setError(commonErrorMessage);

        setNodeIdToDetailsMapping((prevState) => ({
          ...prevState,
          [selectedParentNode?.breadCrumb!]: {
            ...prevState[selectedParentNode?.breadCrumb!],
            isFetching: false,
          },
        }));
        console.error('Unable to retrieve data', responseError);
      })
      .finally(() => {
        setIsFetching(false);
        console.timeEnd('children API Duration');
        console.timeEnd('children Render Duration');
      });
  };

  return {
    isFetching,
    error,
    data: responseData,
    fetchNodes: fetchAssetTreeParentNodeRecords,
    nodeIdToDetailsMapping,
  };
};
