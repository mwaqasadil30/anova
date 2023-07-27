import { useEffect } from 'react';

interface Props {
  submitForm: () => void;
  shouldSubmitEventForm: boolean;
  setShouldSubmitEventForm: (data: boolean) => void;
}

const HandleSubmitFormEffect = ({
  submitForm,
  shouldSubmitEventForm,
  setShouldSubmitEventForm,
}: Props) => {
  // Immediately submit the event editor form to force validation errors (if any)
  // for the user to make changes that could have been impacted by their changes
  // to specific fields in the <TankAndSensorConfigDrawer />
  useEffect(() => {
    if (shouldSubmitEventForm) {
      submitForm();
    }
    setShouldSubmitEventForm(false);
  }, []);
  return null;
};

export default HandleSubmitFormEffect;
