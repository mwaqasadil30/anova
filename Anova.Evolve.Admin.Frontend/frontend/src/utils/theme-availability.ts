import adminRoutes from 'apps/admin/routes';
import freezersRoutes from 'apps/freezers/routes';
import opsRoutes from 'apps/ops/routes';

export const getIsLightOrDarkThemeForPathname = (pathname: string) => {
  return (
    pathname.startsWith(opsRoutes.base) || pathname.startsWith(adminRoutes.base)
  );
};

export const getIsDarkThemeOnlyPathname = (pathname: string) => {
  return pathname.startsWith(freezersRoutes.base);
};

export const getIsLightThemeOnlyPathname = (pathname: string) => {
  // The light theme is the default, so if the current page isn't a dark-mode
  // only page, and doesn't allow changing the theme, it must be a light theme
  // only page.
  const isDarkThemeOnlyPathname = getIsDarkThemeOnlyPathname(pathname);
  const canChangeThemeForPathname = getIsLightOrDarkThemeForPathname(pathname);
  return !isDarkThemeOnlyPathname && !canChangeThemeForPathname;
};
