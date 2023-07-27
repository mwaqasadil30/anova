/* eslint no-console: ["error", { allow: ["warn"] }] */
type DarkThemePreferences = Record<string, boolean | undefined>;

const localStorageKey = 'transcend:darkThemePreferences';

const getDarkThemePreferences = (): DarkThemePreferences => {
  const darkThemePreferencesString = localStorage.getItem(localStorageKey);
  if (!darkThemePreferencesString) {
    return {};
  }

  try {
    const darkThemePreferences = JSON.parse(darkThemePreferencesString);

    if (!darkThemePreferences || typeof darkThemePreferences !== 'object') {
      return {};
    }

    return darkThemePreferences;
  } catch (error) {
    console.warn('Failed to retrieve dark theme preferences', error);
    return {};
  }
};

const setDarkThemePreferences = (preferences: DarkThemePreferences) => {
  try {
    const preferencesAsJSONString = JSON.stringify(preferences);
    localStorage.setItem(localStorageKey, preferencesAsJSONString);
  } catch (error) {
    console.warn('Failed to set dark theme preferences', error);
  }
};

export const getDarkThemePreferenceForUser = (username: string): boolean => {
  const preferences = getDarkThemePreferences();

  try {
    const encodedUsername = btoa(username);
    return !!preferences?.[encodedUsername];
  } catch (error) {
    console.warn("Failed to retrieve user's dark theme preferences", error);
    return false;
  }
};

export const setDarkThemePreferenceForUser = (
  username: string,
  prefersDarkTheme: boolean
) => {
  const darkThemePreferences = getDarkThemePreferences();

  // Encode the username so it doesn't appear as raw text in localStorage
  try {
    const encodedUsername = btoa(username);
    const updatedDarkThemePreferences = {
      ...darkThemePreferences,
      [encodedUsername]: prefersDarkTheme,
    };
    setDarkThemePreferences(updatedDarkThemePreferences);
  } catch (error) {
    console.warn("Failed to set user's dark theme preferences", error);
  }
};
