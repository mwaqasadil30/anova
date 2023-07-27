import type { AppConfig } from 'types';

declare global {
  interface Window {
    __config?: AppConfig;
  }
}
