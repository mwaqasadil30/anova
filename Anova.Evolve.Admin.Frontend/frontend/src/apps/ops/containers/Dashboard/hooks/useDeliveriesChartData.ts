import {
  EvolveGetDeliveryPerformanceByDomainIdAndProductIdsRequest,
  EvolveGetDeliveryPerformanceByDomainIdAndProductIdsResponse,
} from 'api/admin/api';
import { ApiService } from 'api/admin/ApiService';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';

type ResponseBody = EvolveGetDeliveryPerformanceByDomainIdAndProductIdsResponse;
type RequestBody = EvolveGetDeliveryPerformanceByDomainIdAndProductIdsRequest;

const GetDeliveryPerformanceByDomainIdAndProductIds = (body: RequestBody) => {
  return ApiService.DashboardService.getDeliveryPerformanceByDomainIdAndProductIds_GetDeliveryPerformanceByDomainIdAndProductIds(
    body
  )
    .then((data: ResponseBody) => data.deliveries || [])
    .then((ds) =>
      ds.map((d) => ({
        date: new Date(d.date!),
        onTime: Number(d.onTime),
        early: Number(d.early),
        late: Number(d.late),
      }))
    );
};

const useDomainId = () => {
  const activeDomain = useSelector(selectActiveDomain);
  const domainId = activeDomain?.domainId;
  return domainId || '';
};

type Delivery = {
  date: Date;
  onTime: number;
  early: number;
  late: number;
};
type HookParams = {
  productIds?: string[] | null;
  year: number;
  month: number;
};
export type HookData = {
  deliveries: Delivery[];
  isLoading: boolean;
  error: null;
};
export const useDeliveriesChartData = ({
  productIds,
  year,
  month,
}: HookParams) => {
  const domainId = useDomainId();
  // XXX: create a stable string to check value equality
  const productsKey = productIds?.sort()?.join(',');
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    GetDeliveryPerformanceByDomainIdAndProductIds({
      domainId,
      productIds,
      year,
      month,
    } as RequestBody)
      .then(setDeliveries)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [domainId, productsKey, year, month]);

  return { deliveries, isLoading, error };
};
