import { useEffect } from 'react';
import { setRememberedUsername } from '../../helpers';

interface Props {
  rememberMe: boolean;
}

const RememberMeFormEffect = ({ rememberMe }: Props) => {
  useEffect(() => {
    if (!rememberMe) {
      setRememberedUsername('');
    }
  }, [rememberMe]);

  return null;
};

export default RememberMeFormEffect;
