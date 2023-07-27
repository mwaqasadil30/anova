import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import appI18NDefaults from './defaults';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  lng: 'en',
  resources: {
    en: {},
  },

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  react: {
    // Disable suspense for tests to assume the default translation is used
    useSuspense: false,
  },

  ...appI18NDefaults,
});

export default i18n;
