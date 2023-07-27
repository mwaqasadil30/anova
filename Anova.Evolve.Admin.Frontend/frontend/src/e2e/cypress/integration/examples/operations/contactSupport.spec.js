/// <reference types="cypress" />

import UtilFunctions from '../../../support/utils/UtilFunctions';
const routes = require('../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();

describe('Contact Support Test suite', function(){
    beforeEach(function () {
        // Preserve only the session cookie in every test
        Cypress.Cookies.defaults({
          preserve: (cookie) => {
            return cookie && cookie.name === '.AspNetCore.Session';
          },
        });
      });

      it('Set UP-1-As Single domain User .',{retries : 10}, function () {
        cy.login();
      });

      it('Verify Contact Support Icon', function() {

        cy.contactSupportIcon()
      });

      it('Verify Contact Support dropdown items', function() {

        cy.contactSupportDropdown()
      });
});