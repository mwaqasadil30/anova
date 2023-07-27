import React from 'react';
import { render, fireEvent } from 'utils/test-utils';
import adminRoutes from 'apps/admin/routes';
import {
  ApplicationUserRoleType,
  EvolveAuthenticateAndRetrieveApplicationInfoResponse,
  UserPermissionType,
} from 'api/admin/api';
import App from './App';

describe('App', () => {
  // This test is skipped since it's broken after setting up code splitting.
  // There are ways around it that involve running tests without a cache (which
  // isn't that great):
  // https://stackoverflow.com/questions/44643340/code-splitting-import-breaks-jest-tests
  it.skip('renders the expandable asset navigation with a configuration link', () => {
    const { getByLabelText, getByText } = render(<App />, {
      route: adminRoutes.base,
      initialState: {
        // Mock the user being logged in to prevent the redirect to the Login
        // page
        user: {
          loaded: true,
          isAuthenticated: true,
          data: {
            authenticateAndRetrieveApplicationInfoResult: {
              userPermissions: {
                roleType: ApplicationUserRoleType.SystemAdministrator,
                permissions: [
                  {
                    permissionType: UserPermissionType.AdministrationTabAsset,
                    isEnabled: true,
                  },
                ],
              },
            },
          } as EvolveAuthenticateAndRetrieveApplicationInfoResponse,
          hasConfirmedWelcomeDialog: true,
        },
      },
    });
    const assetNavButton = getByLabelText('asset nav');
    fireEvent.click(assetNavButton);

    const assetConfigurationLink = getByText('Configuration');
    expect(assetConfigurationLink).toBeInTheDocument();

    fireEvent.click(assetConfigurationLink);
    expect(getByText('Download')).toBeInTheDocument();
  });
});
