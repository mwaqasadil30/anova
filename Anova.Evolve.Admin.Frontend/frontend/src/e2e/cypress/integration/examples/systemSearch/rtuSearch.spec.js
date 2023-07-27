/// <reference types="cypress" />

const routes = require('../../../fixtures/routes.json');

describe('System Search', function () {

  beforeEach(function () {

    cy.viewport(1440, 900);
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('Login',{retries : 10}, function () {
    cy.login();
  });

  it('Verify Search Tab Cannot be accessed by Domain users', function () {
    cy.applicationLaunchPanel().click();
    cy.SystemSearchIcon('not.exist')
    cy.closeLaunchPanel()
    cy.logout();
  });


  it('Login Super User',{retries : 10},function () {
    cy.loginSuperUser();
  });

  it('35302 - System Search - RTU Search - List page', function () {
    cy.navToAssetSummaryPage()
    cy.TestAutomationAPDomain()
    cy.applicationLaunchPanel().click();
    cy.findAllByText('System Search').click({force: true});
    cy.searchDeviceID('E100')
    cy.searchAppears('E100')
    cy.selectDomain()
    cy.selectSubDomain()
    cy.searchDeviceID('*')
    cy.verifyDomainInGrid('TestAutomation', 'TestAutomation-AP')
    cy.isDelColumn('No', 'No')
    cy.showDeleCheck()
    cy.isDelColumn('Yes', 'No')
    cy.openRTU()
    cy.back()
    cy.RTUSearchReset()
  });

})