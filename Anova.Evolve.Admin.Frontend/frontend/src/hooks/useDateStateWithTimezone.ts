import moment from 'moment';
import momentTimezone from 'moment-timezone';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import usePrevious from 'react-use/lib/usePrevious';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';

function useDateStateWithTimezone(
  initialState: moment.Moment | (() => moment.Moment)
): [moment.Moment, Dispatch<SetStateAction<moment.Moment>>] {
  const [date, setDate] = useState<moment.Moment>(initialState);

  // Update the date when the app's timezone changes
  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);
  const prevIanaTimezoneId = usePrevious(ianaTimezoneId);
  useEffect(() => {
    if (prevIanaTimezoneId && ianaTimezoneId) {
      const previousDate = momentTimezone(date).tz(prevIanaTimezoneId);
      const newDate = momentTimezone(previousDate).tz(ianaTimezoneId, true);

      if (newDate) {
        setDate(newDate);
      }
    }
  }, [ianaTimezoneId]);

  return [date, setDate];
}

export default useDateStateWithTimezone;
