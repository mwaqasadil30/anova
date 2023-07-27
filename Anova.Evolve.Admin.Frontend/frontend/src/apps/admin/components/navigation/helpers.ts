import adminRoutes, { tabsMap } from 'apps/admin/routes';
import { DrawerContextDefaultValue } from './DrawerContext';

interface GetActiveNavStateData {
  pathname: string;
  isDrawerOpen: boolean;
  currentLinkPathname: string;
  isTopLevelItem?: boolean;
  context: Omit<typeof DrawerContextDefaultValue, 'open'>;
}

export const getActiveNavState = ({
  pathname,
  isDrawerOpen,
  currentLinkPathname,
  isTopLevelItem,
  context,
}: GetActiveNavStateData) => {
  const listOpenFlagsMap: Record<
    typeof adminRoutes[keyof Omit<
      typeof adminRoutes,
      | 'language'
      | 'releaseNotes'
      | 'contactSupport'
      | 'accessDolv3'
      | 'userProfile'
      | 'login'
      | 'resetPassword'
      | 'home'
      | 'ops'
      | 'admin'
      | 'base'
    >]['list'],
    keyof typeof DrawerContextDefaultValue
  > = {
    [adminRoutes.assetManager.list]: 'assetListOpen',
    [adminRoutes.domainManager.list]: 'domainListOpen',
    [adminRoutes.eventManager.list]: 'eventsListOpen',
  };
  const selectedChild = Object.keys(tabsMap).find((key) =>
    pathname.includes(key)
  );
  const selectedPrimaryLink = tabsMap[selectedChild as keyof typeof tabsMap];
  const isPrimaryAndSelected =
    isTopLevelItem && selectedPrimaryLink === currentLinkPathname;
  const isPrimaryAndSelectedAndDrawerIsClosed =
    isPrimaryAndSelected && !isDrawerOpen;
  const correspondsToLocation = pathname.includes(currentLinkPathname);
  const isSelectedListExpanded =
    /* eslint-disable-next-line react/destructuring-assignment */
    context[
      listOpenFlagsMap[
        currentLinkPathname as keyof typeof listOpenFlagsMap
      ] as keyof typeof context
    ];
  const isActive =
    (correspondsToLocation || isPrimaryAndSelectedAndDrawerIsClosed) &&
    !(isSelectedListExpanded && isPrimaryAndSelected);

  return {
    isActive,
    isPrimaryAndSelected,
  };
};
