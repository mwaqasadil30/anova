import { useSessionProbe } from 'hooks/useSessionProbe';

const SessionProbe = () => {
  useSessionProbe();

  // Previously this component was displaying a dialog if the session probe
  // received a 401 response. Since it's now being handled with an axios
  // interceptor that checks for 401 responses, this component is now just
  // continuously calling the probe API to extend sessions.
  // Leaving this component here for now if we'd like to show a dialog if the
  // probe API call fails.
  return null;
};

export default SessionProbe;
