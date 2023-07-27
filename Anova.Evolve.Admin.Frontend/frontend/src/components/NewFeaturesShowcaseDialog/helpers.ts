import moment from 'moment';

const startingDateString = '2022-05-21'; // yyyy-mm-dd

// To test the new features dialog use the code below in your browsers console
// with the updated startingDateString
// For Example:
// localStorage.removeItem('hasShownNewFeaturesShowcaseDialog-2022-05-21')
export const hasShownNewFeaturesShowcaseDialogKey = `hasShownNewFeaturesShowcaseDialog-${startingDateString}`;

export const getHasShownNewFeaturesShowcaseDialog = () => {
  const stringValue = localStorage.getItem(
    hasShownNewFeaturesShowcaseDialogKey
  );

  // TypeScript incorrectly uses type `string` for localStorage.getItem. If the
  // item doesn't exist, `null` can also be returned
  return stringValue === 'true';
};

export const setHasShownNewFeaturesShowcaseDialog = (newValue: boolean) => {
  return localStorage.setItem(
    hasShownNewFeaturesShowcaseDialogKey,
    String(newValue)
  );
};

export const getShouldShowNewFeaturesShowcaseDialogBasedOnDate = () => {
  const now = moment();
  // We only show the new features showcase dialog for a certain amount of time
  const limit = moment(startingDateString, 'YYYY-MM-DD')
    .add(2, 'weeks')
    .endOf('day');

  return now.isBefore(limit);
};
