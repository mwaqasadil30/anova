const routes = require('../../../../fixtures/routes.json');
import '@testing-library/cypress/add-commands';
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const utilFunctions = new UtilFunctions();

describe('Roster Test suite', function () {


  let domainId = null,

    userID = null,
    uniqueRosterName = null,
    editRosterName = null,
    rosterUserName = 'qa',
    messageTemplate = 'default',
    demoUserName = 'newdemo';

  const URL = Cypress.config('baseUrl')
  var environment = URL.match("https://(.*).transcend");
  switch (environment[1]) {
    case 'test':
      userID = '0b5eef82-8d7e-40ae-9b06-d87cdfe43208';
      break;
    case 'staging':
      userID = '8a0e8691-a61f-4df4-9286-acd4851d1d7f';
      break;
  }

  const emailAddress = 'demo@testautomation.com';

  beforeEach(function () {

    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('API TEST - Login User', { retries: 10 }, () => {
    var loginPayload = {
      "username": Cypress.env('USERNAME'),
      "password": Cypress.env('PASS')
    }
    cy.request(
      'POST', Cypress.config('apiUrl') + '/AuthenticateAndRetrieveApplicationInfo',
      loginPayload,
    ).then(response => {
      expect(response.status).equal(200);
      expect(response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.username.toLowerCase()).equal(loginPayload.username.toLowerCase())
      domainId = response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.domainId;
    });
  });

  it('API TEST - to check for DEMO user.', function () {
    cy.request(
      'GET', Cypress.config('apiUrl') + '/User/bydomain/' + domainId,
    ).then(response => {
      expect(response.status).equal(200)
      cy.request(
        'GET', Cypress.config('apiUrl') + '/User/' + userID,
      ).then(response => {
      });
    });
  });

  it('Set UP-1-As Single domain User .', function () {
    cy.login();
  });

  it('Creation of DEMO user .', function () {

    cy.CheckAndCreateUser(demoUserName, emailAddress);
  });

  it('Navigate to Administration app -  Events - Roster ', function () {

    cy.server();
    cy.route('GET', routes.getRosters).as('rosterRecords');
    cy.waitProgressBarToDisappear();

    cy.get('[aria-label="events nav"]').click();
    cy.findAllByText('Roster').click({ force: true });
    cy.wait('@rosterRecords').should('have.property', 'status', 200);
    cy.pageHeader().should('have.text', 'Roster')


  });

  it('Add Roster and assign user to roster', () => {

    cy.clickButton('Add Roster');
    uniqueRosterName = utilFunctions.suffixWithDate('Test Roster_');
    cy.rosterDescription().type(uniqueRosterName);
    cy.isEnabledToggle().should('be.checked');

    cy.clickAddButton('Save', routes.saveRoster);
    cy.addRosterUser('Add Contact', rosterUserName, messageTemplate);
    cy.verifyColumnDetails('tbody [aria-label="First name"]', rosterUserName);

    //Add another roster User
    cy.addRosterUser('Add Contact', demoUserName, messageTemplate);
    cy.verifyColumnDetails('tbody [aria-label="First name"]', demoUserName);

  });

  it('Update Roster and User Roster Details', () => {

    //Enable Mobile to Phone Email on update
    cy.editRosterUser(messageTemplate);
    editRosterName = utilFunctions.suffixWithDate('Edit Roster_');
    cy.editRoster(editRosterName);

  });

  it('Delete Roster by 3 dot menu', () => {

    cy.verifyPageUrl('POST',
      routes.rosterUrl,
      routes.getRosters
    );
    cy.searchField().clear().type(editRosterName, { force: true });
    cy.clickButton('Apply');
    cy.deleteObjectByThreeDot('DELETE', routes.deleteRoster, 'tbody [aria-label="Description"]', editRosterName);
    cy.verifyRosterDeletedItem(editRosterName, 'No rosters found');

  })

});