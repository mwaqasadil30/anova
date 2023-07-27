// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

const crypto = require('crypto');

// Fix an issue preventing the following error due to using MSAL:
// BrowserAuthError: crypto_nonexistent: The crypto object or function is not available. Detail:Browser crypto or msCrypto object not available.
// https://stackoverflow.com/a/52612372/7752479
Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
  },
});

// Mock this function for react-map-gl-geocoder to work
if (typeof window.URL.createObjectURL === 'undefined') {
  // https://stackoverflow.com/a/57944238/7752479
  // @ts-ignore
  window.URL.createObjectURL = () => {
    // Do nothing
  };
}
