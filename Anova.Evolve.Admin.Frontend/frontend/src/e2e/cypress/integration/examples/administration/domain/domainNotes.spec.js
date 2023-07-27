/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();
import moment from 'moment';

const domainNotes = `"Admin -> Asset Manager -> Data Channels tab
Click Add -> Add Data Channel
RTU – start to type in the Device ID
From the dropdown select the RTU Channel ID that you created in the step above (setting up a RTU channel)
Template – Freezer type ie:  Boolean = type alarm/event (0/1)
Type in the name of the tag for Description
Event Rule Group = Freezer"`


describe('User Administration testsuite', function () {

    let customerNameSelector = 'tbody [aria-label="Username"]',
        uniqueUserName,
        editUsername;

  beforeEach(function () {

    cy.viewport(1440, 900);
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('Login Super User',{retries : 10}, function () {
    cy.loginSuperUser();
    cy.navToAssetSummaryPage()
    cy.TestAutomationDomain()
    
  });

  it('TC: 34339 - Domain - Notes - Editor', () =>{
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({force: true});
    cy.domainNav().click();
    cy.domainConfig()
    cy.filterAndOpenTestAutomation()
    cy.enterNotes('Test Notes')
    cy.verifyNotesIcon('be.visible')
    const user = Cypress.env('SUPERUSER')
    const DateTime = moment().format('M/D/YYYY h:mm')
    const DateTimePlus1 = moment().add(1, 'minutes').format('M/D/YYYY h:mm');
    const DateTimePlus2 = moment().add(2, 'minutes').format('M/D/YYYY h:mm');
    cy.updatedBy(user, DateTime, DateTimePlus1, DateTimePlus2)

    cy.deleteNotes()
    cy.verifyNotesIcon('not.exist')
    cy.enterNotes('@')
    cy.verifyNotesIcon('be.visible')
    cy.enterNotes(domainNotes)
    cy.verifyNotesIcon('be.visible')
    cy.updatedBy(user, DateTime, DateTimePlus1, DateTimePlus2)
    cy.readableText()
    cy.logout();
    cy.wait(1000)
    cy.login();
    cy.verifyNotesIcon('not.exist')
  })
})