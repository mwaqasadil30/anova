import {
  EvolveFavourite,
  EvolveGetDomainAdditionalByIdRequest,
  EvolveGetDomainAdditionalByIdResponse,
  EvolveRetrieveDomainApplicationInfoByIdRequest,
  EvolveRetrieveDomainApplicationInfoByIdResponse,
} from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import { SagaIterator } from 'redux-saga';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { setDarkThemePreferenceForUser } from 'utils/theme-preference';
import { InitializeUserRoutine } from '../user/routines';
import { selectUsername } from '../user/selectors';
import {
  setActiveDomain,
  setCurrentTimezone,
  setHasSetDefaultFavourite,
  setOpsNavigationItem,
  setTimezones,
} from './actions';
import {
  FetchActiveDomainRoutine,
  FetchTimezonesRoutine,
  InitializeAppRoutine,
} from './routines';
import {
  selectDefaultFavourites,
  selectHasSetDefaultFavourite,
  selectUserPreferredTimezoneId,
} from './selectors';
import {
  ApplicationActionType,
  SetActiveDomainByIdAction,
  SetIsDarkThemeEnabledAction,
} from './types';

function* initializeAppWorker() {
  yield put(InitializeUserRoutine.trigger());
}

const fetchDomainDetails = (
  request: EvolveRetrieveDomainApplicationInfoByIdRequest
) =>
  AdminApiService.BaseService.retrieveDomainApplicationInfoById_RetrieveDomainApplicationInfoById(
    request as EvolveRetrieveDomainApplicationInfoByIdRequest
  );

const fetchDomainAdditionalDetails = (
  request: EvolveGetDomainAdditionalByIdRequest
) =>
  AdminApiService.GeneralService.getDomainAdditionalById_RetrieveDomainAdditionalById(
    request
  );

function* setActiveDomainByIdWorker(action: SetActiveDomainByIdAction) {
  if (!action.payload.domainId) {
    return;
  }

  const { domainId } = action.payload;

  try {
    yield put(FetchTimezonesRoutine.request());
    yield put(FetchActiveDomainRoutine.request());
    const response: EvolveRetrieveDomainApplicationInfoByIdResponse = yield call(
      // @ts-ignore
      fetchDomainDetails,
      { domainId }
    );
    const domainAdditionalResponse: EvolveGetDomainAdditionalByIdResponse = yield call(
      // @ts-ignore
      fetchDomainAdditionalDetails,
      { domainId }
    );

    const { ianaTimezones } = response;

    const filteredTimezones = ianaTimezones?.filter(
      // "Asset Local Time Zone" has an id of -2, we currently do not support
      // selecting it
      (timezone) => timezone.timezoneId !== -2
    );

    const effectiveDomain =
      response.retrieveDomainApplicationInfoByIdResult?.effectiveDomain;
    const assetSummaryTemplates =
      response.effectiveDomainAssetSummaryTemplate?.fields;

    yield put(
      setActiveDomain({
        domain: effectiveDomain,
        assetSummaryTemplateFields: assetSummaryTemplates,
        domainAdditionalInfo: domainAdditionalResponse.domainAdditionalInfo,
      })
    );
    yield put(setTimezones(filteredTimezones));

    const userPreferredTimezoneId = yield select(selectUserPreferredTimezoneId);

    // Set active timezone
    if (filteredTimezones) {
      const userPreferredTimezone = filteredTimezones.find(
        (ianaTimezone) => ianaTimezone.timezoneId === userPreferredTimezoneId
      );

      const localTimezone = filteredTimezones[0];
      const newCurrentTimezone = userPreferredTimezone || localTimezone;
      yield put(setCurrentTimezone(newCurrentTimezone));
    }

    const defaultFavourites:
      | EvolveFavourite[]
      | null
      | undefined = yield select(selectDefaultFavourites);
    const hasSetDefaultFavourite = yield select(selectHasSetDefaultFavourite);

    // Set default favourite (if any)
    if (!hasSetDefaultFavourite) {
      const defaultFavourite = defaultFavourites?.find(
        (favourite) => favourite.domainId === domainId
      );
      // NOTE: Here, TypeScript doesn't detect that `defaultFavourite` is of
      // type EvolveFavourite. We need to type it so when the
      // setOpsNavigationItem action checks for
      // `navItem instanceof EvolveFavourite`, it will correctly return true.
      const typedFavourite = defaultFavourite
        ? EvolveFavourite.fromJS(defaultFavourite)
        : null;
      yield put(setOpsNavigationItem(typedFavourite));
      yield put(setHasSetDefaultFavourite(true));
    }
  } catch (error) {
    console.error(`Unable to set domain details by ID ${error}`);
  }

  yield put(FetchTimezonesRoutine.fulfill());
  yield put(FetchActiveDomainRoutine.fulfill());
}

function* setIsDarkThemeEnabledWorker(action: SetIsDarkThemeEnabledAction) {
  const { isEnabled } = action.payload;

  // Preserve the user's dark theme preference so we can restore it if they log
  // in again or if they switch back to an app that supports theming.
  const username = yield select(selectUsername);
  if (username) {
    setDarkThemePreferenceForUser(username, isEnabled);
  }
}

function* appWatcher(): SagaIterator {
  yield all([
    takeLatest(InitializeAppRoutine.TRIGGER, initializeAppWorker),
    takeLatest(
      ApplicationActionType.SetActiveDomainById,
      setActiveDomainByIdWorker
    ),
    takeLatest(
      ApplicationActionType.SetIsDarkThemeEnabled,
      setIsDarkThemeEnabledWorker
    ),
  ]);
}

export { appWatcher };
