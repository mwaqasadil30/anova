/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();

let uniquePollName,
  uniquePollName8,
  uniquePollName9,
  uniqueEditPollName1,
  uniqueEditPollName2;

describe('Poll Schedule testsuite', function () {
  beforeEach(function () {
    cy.fixture('example').then(function (data) {
      this.data = data;
    });
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('TC: 7207 - Login Portal', { retries: 10 }, function () {
    cy.login();
  });

  it('TC: 7209 - Poll Schedule Manager View ', function () {
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });

    cy.viewAsset(
      '[href="/admin/poll-schedule-manager"]',
      'Poll Schedule Manager',
      routes.retrievePollByOptionsUrl
    );
  });

  it('TC: 7210 - Add Poll Schedule-Type-1- Interval -Save', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );

    utilFunctions.itemsCountPaginationBefore();
    cy.clickAddButton('Add Poll Schedule', routes.retrievePollEditByIdUrl);

    uniquePollName = utilFunctions.suffixWithDate(this.data.pollName);

    cy.enterPollIntervalDetails(
      uniquePollName,
      '@intervalDropdown',
      '0',
      '(UTC-05:00) Indiana (East)',
      'Add RTU Poll Schedule Group',
      '180',
      '0000'
    );

    cy.clickAddButton('Save', routes.savePollScheduleUrl);

    cy.goBack('POST', routes.retrievePollByOptionsUrl);

    cy.findByText('Poll Schedule Manager').should('exist');

    cy.waitProgressBarToDisappear();

    utilFunctions.verifyItemsCountPaginationAfter(1);
  });

  it('TC: 7215 - Add Poll Schedule -Type-2- Time Of day  -Save & Exit', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.clickAddButton('Add Poll Schedule', routes.retrievePollEditByIdUrl);

    uniquePollName8 = utilFunctions.suffixWithDate(this.data.pollName8);

    cy.enterPollDayTimeDetails(
      uniquePollName8,
      '@timeDropdown',
      '0',
      '(UTC-08:00) Pacific Time (US & Canada)',
      'Add RTU Poll Schedule Group',
      '0000',
      '0300',
      '0600'
    );

    cy.clickAddButton('Save & Close', routes.retrievePollByOptionsUrl);

    cy.findByText('Poll Schedule Manager').should('exist');
  });

  it('TC: 7289 - Add Poll Schedule -Type-2- Time Of day  -Save & Exit-Error(-ve)', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.clickAddButton('Add Poll Schedule', routes.retrievePollEditByIdUrl);

    cy.clickButton('Save');

    cy.findAllByText('Name is required.').should('exist');

    cy.findAllByText('Time Zone is required.').should('exist');

    uniquePollName9 = utilFunctions.suffixWithDate(this.data.pollName9);

    cy.enterPollDayTimeDetails(
      uniquePollName9,
      '@timeDropdown',
      '0',
      '(UTC) Dublin, Edinburgh, Lisbon, London',
      'Add RTU Poll Schedule Group',
      '0300',
      '0900',
      '1500'
    );
    cy.clickAddButton('Save & Close', routes.retrievePollByOptionsUrl);

    cy.findByText('Poll Schedule Manager').should('exist');
  });

  it('TC: 7216 - Add Poll Schedule -Type -2-Time of day -Cancel', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.clickAddButton('Add Poll Schedule', routes.retrievePollEditByIdUrl);

    cy.enterPollDayTimeDetails(
      'Poll interval -3 hrs',
      '@timeDropdown',
      '0',
      '(UTC-08:00) Pacific Time (US & Canada)',
      'Add RTU Poll Schedule Group',
      '0000',
      '0300',
      '0600'
    );

    cy.clickCancelButton(routes.retrievePollEditByIdUrl);

    cy.verifyAllPollFieldsAreClear();

    cy.goBack('POST', routes.retrievePollByOptionsUrl);

    cy.findByText('Poll Schedule Manager').should('exist');
  });

  it('TC: 7241 - Edit-Poll schedule -Interval-Save-error-Save', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.waitProgressBarToDisappear();
    cy.wait(2000);
    cy.get('#filterText-input').clear().type(uniquePollName8)
    cy.findAllByText('Apply').click({ force: true })
    cy.wait(2000);
    cy.log(uniquePollName8);
    cy.clickOnRecordName(uniquePollName8);
    cy.log(uniquePollName8);
    cy.enterPollIntervalDetails(
      ' ',
      '@intervalDropdown',
      '0',
      '(UTC) Coordinated Universal Time',
      'Edit RTU Poll Schedule Group',
      '180',
      '0000'
    );
    cy.log(uniquePollName8);

    cy.clickAddButton('Save', routes.savePollScheduleUrl);
    cy.log(uniquePollName8);

    cy.findAllByText('Name required.').should('exist');

    uniqueEditPollName1 = utilFunctions.suffixWithDate(this.data.editPollName1);

    cy.pollName().clear().type(uniqueEditPollName1);

    // cy.clickAddButton('Save', routes.savePollScheduleUrl);
    cy.findAllByText('Save & Close').click({ force: true });

    cy.goBack('POST', routes.retrievePollByOptionsUrl);

    cy.findByText('Poll Schedule Manager').should('exist');
  });

  it('TC: 7250 - Edit Poll Schedule -Type -2-Time Of day  -Save & Exit', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.waitProgressBarToDisappear();
    cy.server();
    cy.route('POST', routes.retrievePollByOptionsUrl).as('qtRecords');
    cy.searchField().clear().type(utilFunctions.getCurrentDate());
    cy.applyButton().click();
    cy.wait('@qtRecords').should('have.property', 'status', 200);
    cy.clickOnRecordName(uniquePollName9);

    uniqueEditPollName2 = utilFunctions.suffixWithDate(this.data.editPollName2);

    cy.enterPollDayTimeFieldsDetails(
      uniqueEditPollName2,
      '@timeDropdown',
      '0',
      '(UTC) Coordinated Universal Time',
      'Edit RTU Poll Schedule Group',
      '0000',
      '0800',
      '1600',
      '0200',
      '0400',
      '0600'
    );

    cy.clickAddButton('Save & Close', routes.retrievePollByOptionsUrl);
  });

  it('TC: 7259 - Edit Poll Schedule -Type-2- Time Of day  -Cancel', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.waitProgressBarToDisappear();
    cy.server();
    cy.route('POST', routes.retrievePollByOptionsUrl).as('qtRecords');
    cy.searchField().clear().type(utilFunctions.getCurrentDate());
    cy.applyButton().click();

    cy.wait('@qtRecords').should('have.property', 'status', 200);
    cy.clickOnRecordName(uniqueEditPollName2);

    cy.enterPollDayTimeDetails(
      'Poll Cancel',
      '@timeDropdown',
      '0',
      '(UTC-06:00) Central America',
      'Edit RTU Poll Schedule Group',
      '0000',
      '0800',
      '1600'
    );
    cy.findAllByText('Cancel').click({ force: true });
    cy.visit('/admin/poll-schedule-manager');

  });

  it('TC: 7264 - Poll schedule  -Filter By -Name- Few alphabets from middle of Poll schedule title ', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    const myString = utilFunctions.splitStrings(uniqueEditPollName2);

    cy.verifyFilterScenarios(myString[1]);
  });

  it('TC: 7266 - Poll Schedule -Filter By-Name - Full poll schedule name', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.verifyFilterScenarios(uniqueEditPollName2);
  });

  it('TC: 7587 - Poll Schedule-Pagination-with Page Numbers', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.intercept('POST', routes.retrievePollByOptionsUrl).as('nextPageWait');
    cy.searchField().clear();
    cy.applyButton().click();

    cy.wait(2000);
    cy.itemCount()
      .eq(0)
      .then(function (siteCount) {
        const site = siteCount.text();
        var siteList = site.split('f');
        siteList = siteList[1].trim();
        this.siteList = siteList;
      });

    var sum = 0;
    cy.get('nav ul')
      .first()
      .find('li')
      .its('length')
      .then((page) => {
        const cp = Number(page) - 4;

        var i;

        for (i = 0; i < cp; i++) {
          if (
            cy
              .get('nav ul')
              .first()
              .find('li button')
              .eq(i + 2)
              .should('be.enabled')
              .click()
          ) {
            cy.wait('@nextPageWait');
            cy.get('tr a')
              .its('length')
              .then((len) => {
                sum += parseInt(len);
              });
          } else {
            cy.log('fail');
          }
        }
      })
      .then(() => {
        expect(sum).to.be.equal(Number(this.siteList));
      });
  });

  it('TC: 7269 - Poll schedule -Delete- 1-Three dot Menu', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.server();
    cy.route('POST', routes.retrievePollByOptionsUrl).as('pollRecords');
    cy.searchField().type(uniquePollName);
    cy.applyButton().click();
    cy.wait('@pollRecords').should('have.property', 'status', 200);

    cy.deleteRecordByThreeDot(uniquePollName, routes.retrievePollByOptionsUrl);
    cy.wait(2000)
    cy.findAllByText('Delete Confirmation').parent().parent().next().find('span').eq(0).click({force:true})
    cy.wait(2000)
    cy.verifyDeletedItem(uniquePollName, 'No Poll Schedules found');
  });

  it('TC: 7268 - Poll schedule Delete all newly created schedules during test -2-With Delete selected', function () {
    cy.verifyPageUrl('POST',
      routes.pollScheduleManagerUrl,
      routes.retrievePollByOptionsUrl
    );
    cy.server();
    cy.route('POST', routes.retrievePollByOptionsUrl).as('qtRecords');
    cy.searchField().clear().type(utilFunctions.getCurrentDate());
    cy.applyButton().click();

    cy.wait('@qtRecords').should('have.property', 'status', 200);

    const pollNames = [uniqueEditPollName1, uniqueEditPollName2];
    pollNames.forEach((element) => {
      cy.deleteRecord(element);
    });
    cy.deleteSelectedButton(routes.retrievePollByOptionsUrl);
    cy.wait(2000)
    cy.findAllByText('Delete Confirmation').parent().parent().next().find('span').eq(0).click({force:true})
    cy.wait(2000)
    

    pollNames.forEach((element) => {
      cy.verifyDeletedItem(element, 'No Poll Schedules found');
    });

    cy.applyButton().click();
  });

  it('TC: 7271 - Poll Schedule - Refresh', function () {
    utilFunctions.clickRefreshIcon('POST', routes.retrievePollByOptionsUrl);
  });

  it('TC: 7588 - Poll Schedule-Pagination-with Arrows <,>,|<,>|', function () {
    cy.itemCount()
      .eq(0)
      .then(function (siteCount) {
        const site = siteCount.text();
        var siteList = site.split('f');
        siteList = siteList[1].trim();
        this.siteList = siteList;
      })
      .then(() => {
        cy.get('nav').first().find('button').eq(0).should('be.disabled');
        cy.get('nav').first().find('button').eq(1).should('be.disabled');

        if (Number(this.siteList) > 50) {
          cy.get('nav').first().find('button').eq(-2).should('be.enabled');
          cy.get('nav')
            .first()
            .find('button')
            .eq(-1)
            .should('be.enabled')
            .click({
              force: true,
            });
          cy.get('nav').first().find('button').eq(1).should('be.enabled');
          cy.get('nav')
            .first()
            .find('button')
            .eq(0)
            .should('be.enabled')
            .click({
              force: true,
            });
        }
      });
  });
});
