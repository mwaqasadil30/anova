import React, { ReactNode } from 'react';
import { CombinedState } from 'redux';
import TestRenderer from 'react-test-renderer';
import AllTheProviders from 'utils/test-providers';
import { createMemoryHistory, History, MemoryHistory } from 'history';
import type { State, ApplicationStore } from 'redux-app/types';
import configureStore from 'redux-app/configureStore';

interface RenderOptions {
  route?: string;
  history?: MemoryHistory<History.PoorMansUnknown>;
  initialState?: CombinedState<State>;
  storePackage?: { store: ApplicationStore };
}

// Helper function for react-test-renderer
const fullRender = (
  component: ReactNode,
  {
    route = '/',
    history = createMemoryHistory({ initialEntries: [route], initialIndex: 0 }),
    initialState,
    // TODO: Fix typescript issue
    // @ts-ignore
    storePackage = configureStore(initialState, history),
  }: RenderOptions = {}
) => {
  const Providers = AllTheProviders({ history, store: storePackage.store });
  return TestRenderer.create(<Providers>{component}</Providers>);
};

export { fullRender };
