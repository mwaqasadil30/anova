import { ApiService } from 'api/admin/ApiService';
import { useQuery } from 'react-query';
import { TransactionDateRange } from '../types';

const useTransactionJournals = (
  rtuDeviceId: string,
  transactionDateRange: TransactionDateRange
) => {
  return useQuery(
    [
      'hornertrtutransactiondetails',
      rtuDeviceId,
      transactionDateRange.startDate,
      transactionDateRange.endDate,
    ],
    () => {
      return ApiService.HornerRtuService.hornerRtu_RetrieveTransactionJournals(
        rtuDeviceId!,
        transactionDateRange.startDate!,
        transactionDateRange.endDate!
      );
    },
    {
      enabled:
        !!transactionDateRange?.startDate && !!transactionDateRange?.endDate,
    }
  );
};
export default useTransactionJournals;
