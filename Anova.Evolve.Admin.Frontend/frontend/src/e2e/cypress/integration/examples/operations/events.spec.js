/// <reference types="cypress" />
import UtilFunctions from '../../../support/utils/UtilFunctions';
const routes = require('../../../fixtures/routes.json');

const utilFunctions = new UtilFunctions();
describe('Operations Events Test suite', function () {
  beforeEach(function () {
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('TC: 8115 - Set UP-1-As Single domain User .',{retries : 10}, function () {
    cy.login();
  });

  it('TC: 8116 - Navigate to Operations-Events List page', function () {

    cy.intercept('GET', routes.retrieveActiveEventByOptionsUrl).as('records');
    cy.navigateToAppPicker2('Operations');
    cy.eventIcon().click();
    cy.wait('@records').then(({response})=> {expect(response.statusCode).to.eq(200)})
    cy.pageHeader().should('have.text', 'Events');
    cy.url().should('include', '/ops/events');
    cy.waitProgressBarToDisappear();
  });

  it('TC: 8119 - Events-View(filter)-Active-Type Select All', function () {
    cy.verifyPageUrl('GET',routes.opsEventsUrl, routes.retrieveActiveEventByOptionsUrl);
    cy.intercept('POST', routes.retrieveInactiveEventByOptionsUrl).as('inactiveEventRecords');
    cy.intercept('GET', routes.retrieveActiveEventByOptionsUrl).as('activeEventRecords');

    cy.clearNavItemIfVisibleOnEvents();
    cy.wait(2000);
    cy.eventView().click();
    cy.verifyViewDropdownFields();
    cy.levelDropdown('Inactive');
    cy.wait('@inactiveEventRecords').then(({response})=> {expect(response.statusCode).to.eq(200)})
    cy.get('[aria-label="Pagination navigation"]').should('be.visible');
    cy.wait(2000)
    cy.eventView().click();
    cy.levelDropdown('Active');
    cy.wait('@activeEventRecords').then(({response})=> {expect(response.statusCode).to.eq(200)})
    cy.wait(2000)
    cy.selectDropdownIfNotSelected(
      '[id="eventTypes-input"]',
      'All',
      'GET',
      routes.retrieveActiveEventByOptionsUrl
    );
    cy.eventTypesDropdown().should('have.text', 'All');

    cy.clickOnAssetTitle();
    cy.assetDetailsTab().should('be.visible').and('have.text', 'Details');
    cy.goBack('GET',routes.retrieveActiveEventByOptionsUrl);
    cy.pageHeader().should('have.text', 'Events');

    cy.verifyMessageDetails(1);

    cy.clickOnAssetTitle();
    cy.assetDetailsTab().should('be.visible').and('have.text', 'Details');
    cy.goBack('POST',routes.retrieveEventByIdUrl);

    cy.acknowledgedByContainer().should('exist');
    cy.acknowledgedOnContainer().should('exist');

    cy.verifyNotesAndNotificationsTabs();
    cy.go('back');
    cy.wait('@activeEventRecords').then(({response})=> {expect(response.statusCode).to.eq(200)})
    cy.waitProgressBarToDisappear();
    cy.wait(3000);
    cy.get('[id="eventTypes-input"]',{timeout:5000}).click();
    cy.findAllByText('Deselect All',{timeout:5000}).click();
    cy.get('[role="listbox"] [type="checkbox"]').should('not.be.checked');
    cy.findAllByText('Select All').should('be.visible');
    cy.closeDropdown();
    cy.eventTypesDropdown().should('have.text', 'None');
    cy.findAllByText('No events found').should('exist');
    cy.eventTypesDropdown().click();
    cy.findAllByText('Select All').should('be.visible').click();
    cy.get('[type="checkbox"]').should('be.checked');
    cy.closeDropdown();
    cy.wait('@activeEventRecords').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.eventTypesDropdown().should('have.text', 'All');
    cy.waitProgressBarToDisappear();
  });

  it('TC: 8769 - Events-Acknowledge & View the details of An event  ', function () {
    cy.verifyPageUrl('GET',routes.opsEventsUrl, routes.retrieveActiveEventByOptionsUrl);
    cy.intercept('POST', routes.eventAckEventUrl).as('eventAck');
    const $checkbox = Cypress.$('input:checkbox');
    cy.wrap($checkbox).each(($el, index) => {
      if (!$el.attr('checked')) {
        cy.verifyAcknowledgeColumnsEmpty(index + 1);
        cy.get('input[type="checkbox"]').eq(index).check({force:true}).should('be.checked',{timeout:9000});
        cy.wait('@eventAck').then(({response})=> {expect(response.statusCode).to.eq(200)});
        cy.wait(1000);
        cy.verifyAllMessageDetailsAfterAcknowledged(index + 1);
        cy.verifyNotesAndNotificationsTabs();
        return false;
      } else {
        cy.verifyAllMessageDetailsAfterAcknowledged(index + 1);
        cy.verifyNotesAndNotificationsTabs();
        return false;
      }
    });
    cy.goBack('GET',routes.retrieveActiveEventByOptionsUrl);
  });

  it('TC: 9187 - Events-Open an event -check Notification details', function () {
    cy.verifyPageUrl('GET',routes.opsEventsUrl, routes.retrieveActiveEventByOptionsUrl);
    cy.viewDropdown().click();
    cy.verifyViewDropdownFields();
    cy.closeDropdown();
    cy.selectRosterIfExistAndVerifyNotificationDetails();
    cy.go('back');
  });

  it('TC: 8768 - Events-Open an event and Add notes', function () {
    cy.verifyPageUrl('GET',routes.opsEventsUrl, routes.retrieveActiveEventByOptionsUrl);
    cy.waitProgressBarToDisappear();
    cy.wait(3000);
    cy.addNotesAndVerifyDetails();
    cy.go('back');
  });

  it('TC: 8773 - Events-Sorting of the Columns', function () {
    cy.verifyPageUrl('GET',routes.opsEventsUrl, routes.retrieveActiveEventByOptionsUrl);
    cy.waitProgressBarToDisappear();
    cy.clickOnGridColumn('Created On');
    utilFunctions.verifyDateAndTimeSortingAsc(
      'tbody tr [aria-label="Created on"]'
    );

    cy.clickOnGridColumn('Created On');
    utilFunctions.verifyDateAndTimeSortingDesc(
      'tbody tr [aria-label="Created on"]'
    );
  });

  it('TC: 8117 - Events - Refresh', function () {
    utilFunctions.clickRefreshIcon('GET',routes.retrieveActiveEventByOptionsUrl);
  });
});
