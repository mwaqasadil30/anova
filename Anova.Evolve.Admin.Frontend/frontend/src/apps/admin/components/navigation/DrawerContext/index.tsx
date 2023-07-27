import { createContext } from 'react';

export const DrawerContextDefaultValue = {
  open: false,
  assetListOpen: false,
  domainListOpen: false,
  eventsListOpen: false,
};

const DrawerContext = createContext(DrawerContextDefaultValue);

export default DrawerContext;
