import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectActiveDomain } from 'redux-app/modules/app/selectors';

export const useDomainChangeRedirect = (route: string) => {
  const history = useHistory();
  const activeDomain = useSelector(selectActiveDomain);
  const firstRender = useRef(true);
  useEffect(() => {
    if (!firstRender.current) {
      history.push(route);
    }
    firstRender.current = false;
  }, [activeDomain]);
};
