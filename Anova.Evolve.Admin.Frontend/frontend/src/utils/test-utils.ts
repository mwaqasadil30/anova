import { ReactNode } from 'react';
import { CombinedState } from 'redux';
import { State, ApplicationStore } from 'redux-app/types';
import { render } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory, History } from 'history';
import configureStore from 'redux-app/configureStore';
import AllTheProviders from './test-providers';

interface RenderOptions {
  route?: string;
  history?: MemoryHistory<History.PoorMansUnknown>;
  initialState?: Partial<CombinedState<State>>;
  storePackage?: { store: ApplicationStore };
}

// Helper function for @testing-library/react
const customRender = (
  ui: ReactNode,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route] }),
    initialState,
    // TODO: Fix typescript issue
    // @ts-ignore
    storePackage = configureStore(initialState, history),
    ...options
  }: RenderOptions = {}
) => ({
  // @ts-ignore
  ...render(ui, {
    wrapper: AllTheProviders({ history, store: storePackage.store }),
    ...options,
  }),
  history,
});

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
