import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { APPLICATION_INSIGHTS_INSTRUMENTATION_KEY } from 'env';
import { History } from 'history';
import round from 'lodash/round';
import { AnyAction, Store } from 'redux';
import { selectActiveDomainId } from 'redux-app/modules/app/selectors';
import { selectUserId, selectUsername } from 'redux-app/modules/user/selectors';
import { getPageTitleForPathname } from 'utils/routes';

export const ai = new ApplicationInsights({
  config: {
    instrumentationKey: APPLICATION_INSIGHTS_INSTRUMENTATION_KEY,
  },
});

export const initializeAppInsights = (
  history: History,
  store: Store<any, AnyAction>
) => {
  const reactPlugin = new ReactPlugin();
  // NOTE: Extenstions are configured after since we have access to history here
  ai.config.extensions = [...(ai.config.extensions || []), reactPlugin];
  ai.config.extensionConfig = {
    ...ai.config.extensionConfig,
    [reactPlugin.identifier]: { history },
  };

  if (APPLICATION_INSIGHTS_INSTRUMENTATION_KEY) {
    ai.loadAppInsights();
    ai.addTelemetryInitializer((envelope) => {
      const reduxState = store.getState();
      const userId = selectUserId(reduxState);
      const username = selectUsername(reduxState);
      const domainId = selectActiveDomainId(reduxState);

      const pageTitle = getPageTitleForPathname(window.location.pathname);

      // To prevent the weird issue where application insights sends the
      // default HTML title, we override `baseData.name` to always provide the
      // correct HTML title for the current page.
      const isPageSpecificEvent =
        envelope.baseType === 'PageviewData' ||
        envelope.baseType === 'PageviewPerformanceData';
      if (envelope.baseData && isPageSpecificEvent) {
        // NOTE: Application insights might track a page view before the HTML title
        // is updated via react-helmet. Their source code tries to get around this
        // by tracking page views 500ms after the url changes:
        // https://github.com/microsoft/ApplicationInsights-JS/pull/970/files
        // https://github.com/Azure/react-appinsights/issues/83
        // https://github.com/microsoft/ApplicationInsights-JS/blob/master/extensions/applicationinsights-react-js/src/ReactPlugin.ts#L93-L102
        envelope.baseData.name = pageTitle;
      }

      // Custom properties for application insights
      envelope.data = {
        ...envelope.data,
        ...(userId && { UserId: userId }),
        ...(username && { WcfProxyUsername: username }),
        ...(domainId && { WcfProxyEffectiveDomainId: domainId }),
        // Track screen properties: This is the full width, height and pixel
        // density of the user's SCREEN, not the browser dimensions. Note that
        // the density is affected by the browser's zoom level as well.
        // NOTE: For some reason, properties with number values causes App
        // Insights to treat the property like a "measurement", which prevents
        // using "Split by" on App Insight's "Usage" section. This makes it
        // harder to count the number of users using a certain width/height.
        // So instead, we send a string.
        screenWidth: window.screen.width.toString(),
        screenHeight: window.screen.height.toString(),
        screenDensity: round(window.devicePixelRatio, 3).toString(),
        // Track browser-specific dimensions, which may change based on
        // resizing the browser window. If this information isn't useful we
        // could remove it in the future.
        // Calculating viewport dimensions in different browsers:
        // https://stackoverflow.com/a/8876069/7752479
        browserWidth: Math.max(
          document.documentElement.clientWidth || 0,
          window.innerWidth || 0
        ).toString(),
        browserHeight: Math.max(
          document.documentElement.clientHeight || 0,
          window.innerHeight || 0
        ).toString(),
      };
    });
  }
};
