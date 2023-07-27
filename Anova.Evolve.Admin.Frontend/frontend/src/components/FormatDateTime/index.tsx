import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentIanaTimezoneId } from 'redux-app/modules/app/selectors';
import { formatModifiedDatetime } from 'utils/format/dates';

interface Props {
  date: moment.MomentInput;
}

const FormatDateTime = ({ date }: Props) => {
  const ianaTimezoneId = useSelector(selectCurrentIanaTimezoneId);
  const formattedTime = formatModifiedDatetime(date, ianaTimezoneId);
  // NOTE: Workaround for typescript not allowing functional components to
  // return strings
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20544#issuecomment-638661565
  return (formattedTime as unknown) as ReactElement;
};

export default FormatDateTime;
