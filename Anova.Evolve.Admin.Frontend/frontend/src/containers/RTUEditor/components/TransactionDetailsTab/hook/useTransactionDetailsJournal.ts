import { useQuery } from 'react-query';
import { ApiService } from 'api/admin/ApiService';

const useTransactionDetailsJournal = (
  hornerTransactionJournalId?: number,
  startDate?: Date | null,
  endDate?: Date | null
) => {
  return useQuery(
    [
      'hornerRtu_RetrieveDetailJournals',
      hornerTransactionJournalId,
      startDate,
      endDate,
    ],
    () => {
      if (!(!!startDate || !!endDate)) return null;

      return ApiService.HornerRtuService.hornerRtu_RetrieveDetailJournals(
        hornerTransactionJournalId!,
        startDate!,
        endDate!
      );
    }
  );
};
export default useTransactionDetailsJournal;
