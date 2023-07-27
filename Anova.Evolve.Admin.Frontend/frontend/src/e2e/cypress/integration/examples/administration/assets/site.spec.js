/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const config = require('../../../../fixtures/example.json');
const utilFunctions = new UtilFunctions();
describe('Site testsuite', function () {
let customerNameLocator = 'tbody [aria-label="Customer name"]',
    uniqueCustomerName,
    uniqueCustomerName2,
    uniqueEditCustomerName,
    uniqueEditCustomerName2;

  beforeEach(function () {
    cy.fixture('example.json').as('config');
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('TC: 7363 - Set UP-As single domain user',{retries : 10}, function () {
    cy.login();
  });

  it('TC: 7364 - Site Manager View', function () {
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });

    cy.viewAsset('[href="/admin/site-manager"]', 'Site Manager', routes.retrieveSiteByOptionsUrl);

  });

  it('TC: 7459 - Add-Site-with Lat/long button enabled -Cancel', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    utilFunctions.itemsCountPaginationBefore();
    cy.clickAddButton('Add Site', routes.retrieveSiteByIdUrl);
    uniqueCustomerName = utilFunctions.suffixWithDate(config.customerName);

    cy.enterAllSiteDetails(
      'Add Site',
      uniqueCustomerName,
      'Test site',
      '123-456-7890',
      '133 kerr street',
      config.country,
      config.state,
      config.city,
      'L6K 3A6',
      '(UTC-06:00) Central Time (US & Canada)'
    );

    cy.clickCancelButton(routes.retrieveSiteByIdUrl);
    cy.verifySiteFieldsAreClear();
    cy.url().should('include', '/site-manager/create');
    cy.goBack('POST',routes.retrieveSiteByOptionsUrl);

    utilFunctions.verifyItemsCountPaginationAfter(0);
  });

  it('TC: 7454 - Add-Site-with Lat/long button enabled Save -error- Save& exit', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.waitProgressBarToDisappear();
    cy.clickAddButton('Add Site', routes.retrieveSiteByIdUrl);
    cy.clickButton('Save');
    cy.findAllByText('Customer Name is required.', { timeout: 5000 }).should(
      'exist'
    );
    cy.findAllByText('Time Zone is required.', { timeout: 5000 }).should(
      'exist'
    );

    uniqueCustomerName = utilFunctions.suffixWithDate(config.customerName);

    cy.enterAllSiteDetails(
      'Add Site',
      uniqueCustomerName,
      'Test site',
      '123-456-7890',
      '133 kerr street',
      config.country,
      config.state,
      config.city,
      'L6K 3A6',
      '(UTC-06:00) Central Time (US & Canada)'
    );

    cy.clickOnBtn('Save', routes.saveSiteUrl);
    cy.pageHeader().should('have.text', 'Edit Site', { timeout: 5000 });
    cy.wait(2000);
    cy.clickAddButton('Save & Close', routes.retrieveSiteByOptionsUrl);
    cy.waitProgressBarToDisappear();
  });

  it('TC: 7456 - Add-Site-without lat/long lookup enabled- Save ', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    utilFunctions.itemsCountPaginationBefore();
    cy.clickAddButton('Add Site', routes.retrieveSiteByIdUrl);
    uniqueCustomerName2 = utilFunctions.suffixWithDate(config.customerName2);

    cy.enterSitesDetailsWithoutLatLong(
      'Add Site',
      uniqueCustomerName2,
      'Test site',
      '123-456-7890',
      '133 kerr street',
      config.country,
      config.state,
      config.city,
      'L6K 3A6',
      '(UTC-06:00) Central Time (US & Canada)'
    );

    cy.clickOnBtn('Save', routes.saveSiteUrl);
    cy.goBack('POST',routes.retrieveSiteByOptionsUrl);
    utilFunctions.verifyItemsCountPaginationAfter(1);
  });

  it('TC: 7458 - Edit-Site-with Lat/long button enabled- Save error Save& exit', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.server();
    cy.route('POST', routes.retrieveSiteByOptionsUrl).as('records');
    cy.route('POST', routes.retrieveSiteByIdUrl).as('editRecords');
    cy.route('POST', routes.saveSiteUrl).as('saveSite');

    cy.searchField().type(uniqueCustomerName2);
    cy.applyButton().click();

    cy.wait('@records').should('have.property', 'status', 200);

    cy.cityName().first().click({ force: true });
    cy.wait('@editRecords').should('have.property', 'status', 200);

    cy.editSiteDetails(
      ' ',
      'Test site',
      '123-456-7890',
      '133 kerr street',
      config.country,
      config.state,
      config.city,
      'L6K 3A6',
      '(UTC-05:00) Eastern Time (US & Canada)'
    );

    cy.verifyLatLongEnabled();

    cy.clickButton('Save & Close');
 
    cy.findAllByText('Customer Name is required.', { timeout: 25000 }).should(
      'exist'
    );

    uniqueEditCustomerName = utilFunctions.suffixWithDate(
      config.editCustomerName
    );

    cy.customerName().clear({force:true}).type(uniqueEditCustomerName);

    cy.wait(100);
    cy.contains('Save & Close').click();
    cy.wait('@saveSite').should('have.property', 'status', 200);
    cy.wait('@records').should('have.property', 'status', 200);
  });

  it('TC: 7465 - Edit-Site-without lat/long lookup enabled- Cancel', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.server();
    cy.route('POST', routes.retrieveSiteByIdUrl).as('editRecords');
    cy.route('POST', routes.retrieveSiteByOptionsUrl).as('records');

    cy.waitProgressBarToDisappear();
    utilFunctions.itemsCountPaginationBefore();

    cy.searchField().type(uniqueCustomerName);
    cy.applyButton().click();

    cy.wait('@records').should('have.property', 'status', 200);

    cy.cityName().eq(0).click({ force: true });
    cy.wait('@editRecords').should('have.property', 'status', 200);

    cy.editSiteDetails(
      uniqueCustomerName,
      'Test site',
      '123-456-7890',
      '133 kerr street',
      config.country,
      config.state,
      config.city,
      'L6K 3A6',
      '(UTC-05:00) Eastern Time (US & Canada)'
    );

    cy.verifyLatLongDisabled();

    cy.clickCancelButton(routes.retrieveSiteByIdUrl);
    cy.url().should('include', 'edit');

    cy.goBack('POST',routes.retrieveSiteByOptionsUrl);

    utilFunctions.verifyItemsCountPaginationAfter(0);
  });

  it('TC: 7464 - Edit-Site-without lat/long lookup enabled- Save', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.server();
    cy.route('POST', routes.retrieveSiteByIdUrl).as('editRecords');
    cy.route('POST', routes.retrieveSiteByOptionsUrl).as('records');
    cy.route('POST', routes.saveSiteUrl).as('saveSite');

    utilFunctions.itemsCountPaginationBefore();

    cy.searchField().type(uniqueCustomerName);
    cy.applyButton().click();

    cy.wait('@records').should('have.property', 'status', 200);

    cy.cityName().eq(0).click({ force: true });
    cy.wait('@editRecords').should('have.property', 'status', 200);

    uniqueEditCustomerName2 = utilFunctions.suffixWithDate(
      config.editCustomerName2
    );

    cy.editSiteDetails(
      uniqueEditCustomerName2,
      'Test site',
      '123-456-7890',
      '133 kerr street',
      config.country,
      config.state,
      config.city,
      'L6K 3A6',
      '(UTC-05:00) Eastern Time (US & Canada)'
    );

    cy.verifyLatLongDisabled();
    cy.clickAddButton('Save & Close', routes.retrieveSiteByOptionsUrl);
    utilFunctions.verifyItemsCountPaginationAfter(0);
  });

  it('TC: 7466 - Filter By -Name (Partial and full names)-Group by -None', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.server();
    cy.route('POST', routes.retrieveSiteByOptionsUrl).as('records');

    cy.selectGroupBy('None');

    cy.wait('@records').should('have.property', 'status', 200);

    var myString = utilFunctions.splitStrings(uniqueEditCustomerName2);

    for(var i = 0; i<3 ; i++ )
    {
      cy.verifyFilters(customerNameLocator, myString[i]);
    }
    cy.verifyFilters(customerNameLocator, uniqueEditCustomerName2);
  });

  it('TC: 7554 - Filter By -State (Partial and full names)-Group by -Customer names', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    const stateSelector = '[aria-label="State"]';
    cy.verifyFilterByDropdowns();
    cy.filterByState().click();

    cy.verifyGroupByDropdowns();
    cy.groupByCustomerName().click();

    const myString = utilFunctions.splitStrings(config.state);

    myString.forEach((str) => {
      cy.verifyFilters(stateSelector, str);
    });

    cy.verifyFilters(stateSelector, myString[0] + '*');
    cy.verifyFilters(stateSelector, '*' + myString[1] + '*');
    cy.verifyFilters(stateSelector, config.state);
  });

  it('TC:7568 - Filter By -City (Partial and full names)-Group by -State', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    const citySelector = 'tbody [aria-label="City"]';
    cy.verifyFilterByDropdowns();
    cy.filterByCity().click();

    cy.verifyGroupByDropdowns();
    cy.groupByState().click();

    const myString = utilFunctions.splitStrings(config.city);

    myString.forEach((str) => {
      cy.verifyFilters(citySelector, str);
    });

    cy.verifyFilters(citySelector, config.city);
  });

  it('TC: 7571 - Filter By - Country(Partial and full names)-Group by -Country', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.verifyFilterByDropdowns();
    cy.filterByCountry().click();

    cy.verifyGroupByDropdowns();
    cy.groupByCountry().click();

    const myString = utilFunctions.splitStrings(config.country);

    myString.forEach((str) => {
      cy.verifySiteGridFilters(str);
    });

    cy.verifySiteGridFilters(config.country);
  });

  it('TC: 7584 - Site-Pagination-Page Numbers', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.searchField().clear();
    cy.clickAddButton('Apply', routes.retrieveSiteByOptionsUrl);
    cy.selectGroupBy('None');
    cy.verifyPaginationPageNumbers(routes.retrieveSiteByOptionsUrl);
  });

  it('TC: 7482 - Delete- 1-Three dot Menu', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.server();
    cy.route('POST', routes.retrieveSiteByOptionsUrl).as('records');
    cy.searchField().clear();
    cy.filterByDropdownSite().click();
    cy.filterByCustomerName().click({ force: true });
    cy.groupByDropdownSite().click();
    cy.groupByNone().click();
    // cy.wait('@records').should('have.property', 'status', 200);
    cy.searchField().type(uniqueEditCustomerName);     
    cy.applyButton().click();
    cy.wait('@records').should('have.property', 'status', 200);


    cy.deleteObjectByThreeDot('POST',routes.retrieveSiteByOptionsUrl,customerNameLocator,uniqueEditCustomerName);
    cy.verifySiteDeletedItem(uniqueEditCustomerName, 'No sites found');
    
  });

  it('TC: 7481 - Delete All -created during Site testing -2-With Delete selected', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.server();
    cy.route('POST', routes.retrieveSiteByOptionsUrl).as('records');
    cy.searchField().clear().type(utilFunctions.getCurrentYear());
    cy.applyButton().click();
    cy.wait('@records').should('have.property', 'status', 200);

    cy.get('input[type="checkbox"]').first().click({ force: true });
    cy.clickOndeleteSelectedButton(routes.retrieveSiteByOptionsUrl);

    cy.searchField().clear();
    cy.applyButton().click();

  });

  it('TC: 7480 - Site - Refresh', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    utilFunctions.clickRefreshIcon('POST',routes.retrieveSiteByOptionsUrl);
    cy.contains('li button', '1').click();
    cy.wait(2000);
  });

  it('TC: 7585 - Site-Pagination-with Arrows <,>,|<,>|', function () {

    cy.verifyPageUrl('POST',
      routes.siteManagerUrl,
      routes.retrieveSiteByOptionsUrl
    );

    cy.get('[aria-label="First page"]').first().should('be.disabled');
    cy.get('[aria-label="Previous page"]').first().should('be.disabled');

    cy.get('[aria-label="First page"]').last().should('be.disabled');
    cy.get('[aria-label="Previous page"]').last().should('be.disabled');

    cy.itemCount()
      .eq(0)
      .then(function (siteCount) {
        const site = siteCount.text();
        var siteList = site.split('f');
        siteList = siteList[1].trim();
        this.siteList = siteList;
      })
      .then(() => {
        if (Number(this.siteList) > 50) {
          cy.get('[aria-label="Last page"]').first().should('be.enabled');
          cy.get('[aria-label="Next page"]')
            .first()
            .should('be.enabled')
            .click({
              force: true,
            });

          cy.get('[aria-label="First page"]').first().should('be.enabled');
          cy.get('[aria-label="Previous page"]')
            .first()
            .should('be.enabled')
            .click();

          cy.get('[aria-label="Last page"]').last().should('be.enabled');
          cy.get('[aria-label="Next page"]').last().should('be.enabled').click({
            force: true,
          });

          cy.get('[aria-label="First page"]').last().should('be.enabled');
          cy.get('[aria-label="Previous page"]').last().should('be.enabled');
        }
      });
  });
});
