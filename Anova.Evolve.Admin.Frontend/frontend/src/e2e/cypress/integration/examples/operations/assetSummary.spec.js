/// <reference types="cypress" />
import UtilFunctions from '../../../support/utils/UtilFunctions';
const routes = require('../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();
describe('Asset Summary Test suite', function () {
  let myString;
  let assetSelector = '[aria-label="Asset Description"]';
  let assetDescSelector = '[aria-label="Asset Title"]';
  let countrySelector = '[aria-label="Country"]';
  let customerNameSelector = '[aria-label="Customer Name"]';

  beforeEach(function () {
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('TC: 7987 - Set UP-1-As Single domain User.', {retries : 10},function () {
    cy.login();
    cy.navToAssetSummaryPage()
  });

  it('Verify Asset Summary list loads immediately', () => {
    cy.AssetSummaryLoad()
  })
  
  it('TC: 7989 - Navigate to Operations app -Asset summary ', function () {
    cy.navigateToAppPicker2('Operations');
    cy.assetSummaryIcon({force:true}).click();
    cy.pageHeader().should('have.text', 'Asset Summary');
    cy.url().should('include', 'ops/asset-summary');
  });


  it('TC: 7991 - A.S  -Filter By -Customer Name -Initial few alphabets from customer names  -Group by none ', function () {
    
    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );
    
    const customerName = 'Anova';

    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click();
    cy.assetSummaryTable().should('exist');
    cy.filterByDropdown().should('have.text', 'All Fields').click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Customer Name');
    cy.filterByDropdown().should('have.text', 'Customer Name');

    //check 'unable to sort' functionality
    cy.get('[aria-label="Reading Time"] [role="button"]', {
      timeout: 5000,
    }).click({ force: true });
    cy.findByRole('dialog')
      .should('exist')
      .and('contain.text', 'Unable to sort')
      .and('contain.text', 'Sorting not available when assets are grouped');

    cy.get('span').contains('OK').click({ force: true });

    myString = utilFunctions.splitStrings(customerName);
    cy.enterName('*' + myString[0] + '*' + '{enter}');
    cy.verifyGridFilters(customerNameSelector, myString[0]);

    cy.enterName(customerName + '{enter}');
    cy.verifyGridFilters(customerNameSelector, customerName);

    cy.groupByDropdown().should('have.text', 'Asset').click();
    cy.verifyGroupByDropdownFields();
    cy.selectDropdown('None');
    cy.groupByDropdown().should('have.text', 'None');
    cy.closeDropdown();

    cy.enterName(myString[0] + '{enter}');
    cy.verifyGridFilters(customerNameSelector, customerName);

    cy.unitsDropdown().should('have.text', 'Display');
    cy.dataChannelDropdown().should('have.text', 'All');

  });

  it('TC: 7992 - A.S-Filter By -Asset Titles- Few alphabets from middle of Asset title-Group By -Assets And Level DC ', function () {
   
    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    const assetTitle = 'Helium ISO';


    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    myString = utilFunctions.splitStrings(assetTitle);
    cy.enterName('*' + myString[0] + '*' + '{enter}');
    cy.verifyGridFilters(assetDescSelector, myString[0]);

    cy.enterName(myString[0] + '{enter}');
    cy.verifyGridFilters(assetDescSelector, myString[0]);

    cy.groupByDropdown().click();
    cy.verifyGroupByDropdownFields();
    cy.selectDropdown('Asset');
    cy.groupByDropdown().should('have.text', 'Asset');

    myString = utilFunctions.splitStrings(assetTitle);
    cy.enterName(myString[1] + '{enter}');
    cy.verifyGridFilters(assetDescSelector, myString[1]);

    cy.dataChannelDropdown().click();
    cy.get('[role="listbox"]').findAllByText('Deselect All').click();
    cy.selectCheckBox('Level');
    cy.closeDropdown();
    cy.dataChannelDropdown().should('have.text', 'Level');

    cy.enterName(assetTitle + '{enter}');
    cy.verifyGridFilters(assetDescSelector, assetTitle);
    cy.verifyGridFilters(assetSelector, 'Level');
    cy.unitsDropdown().should('have.text', 'Display');
  });

  it('TC: 7993 - A.S-Filter By-Product -Few alphabets from end of prod Name-Group by Customer name & units =Scaled', function () {
    const productName = 'Nitrogen';
    const productSelector = '[aria-label="Product"]';
    const readingSelector = '[aria-label="Reading"]';
    const deliverableSelector = '[aria-label="Deliverable"]';
    const alarmLevelSelector = '[aria-label="Alarm Level"]';

    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Product');
    cy.filterByDropdown().should('have.text', 'Product');

    myString = utilFunctions.splitStrings(productName);
    cy.enterName('*' + myString[0] + '*' + '{enter}');
    cy.verifyGridFilters(productSelector, myString[0]);

    cy.enterName(myString[0] + '{enter}');
    cy.verifyGridFilters(productSelector, myString[0]);

    cy.groupByDropdown().click();
    cy.verifyGroupByDropdownFields();
    cy.selectDropdown('Customer Name');
    cy.groupByDropdown().should('have.text', 'Customer Name');

    myString = utilFunctions.splitStrings(productName);
    cy.enterName(myString[1] + '{enter}');
    cy.verifyGridFilters(productSelector, myString[1]);

    cy.dataChannelDropdown().click();
    cy.findAllByText('Select All').click();
    cy.closeDropdown();

    cy.unitsDropdown().should('have.text', 'Display').click();
    cy.selectDropdown('Scaled');
    cy.unitsDropdown().should('have.text', 'Scaled');

    cy.verifyIncludesFilters(readingSelector, 'Ins WC', 'InsWC');
    cy.verifyIncludesFilters(deliverableSelector, 'Ins WC', 'InsWC');
    cy.verifyIncludesFilters(alarmLevelSelector, 'R:', 'C:');

    cy.dataChannelDropdown().should('have.text', 'All');
    cy.inventoryStatesDropdown().should('have.text', 'All');

    cy.unitsDropdown().click();
    cy.selectDropdown('% Full');
    cy.unitsDropdown().should('have.text', '% Full');

    cy.verifyIncludesFilters(readingSelector, '%', 'InsWC');
    cy.verifyIncludesFilters(deliverableSelector, '%', '');
    cy.verifyIncludesFilters(alarmLevelSelector, 'R:', 'C:');
  });

  it('TC: 7994 - A.S -Filter By-Asset location-Full name-Inventory level-Critical,Empty,Reorder', function () {
    const assetLocation = 'Canada';
    const inventoryStateSelector = '[aria-label="Inventory State"]';

    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Location');
    cy.filterByDropdown().should('have.text', 'Asset Location');
    cy.waitProgressBarToDisappear();

    cy.groupByDropdown().click();
    cy.selectDropdown('None');

    cy.enterName('*' + assetLocation + '*' + '{enter}');
    cy.verifyGridFilters(countrySelector, assetLocation);

    cy.enterName(assetLocation + '{enter}');
    cy.verifyGridFilters(countrySelector, assetLocation);

    cy.inventoryStatesDropdown().click();
    cy.checkBox().uncheck({force:true});

    const units = ['Critical', 'Empty', 'Reorder'];

    units.forEach((element) => {
      cy.selectSpecificCheckBox(element);
    });
    cy.closeDropdown();

    cy.dataChannelDropdown().should('have.text', 'All');

    cy.unitsDropdown().click();
    cy.selectDropdown('Display');
    cy.unitsDropdown().should('have.text', 'Display');

    cy.verifyInventoryStateFilters(
      inventoryStateSelector,
      'Critical',
      'Empty',
      'Reorder'
    );
  });

  it('TC: 8783 - A.S -Filter By -All Fields.', function () {
    const allFields = 'Strata';
    const productSelector = '[aria-label="Product"]';

    cy.inventoryStatesDropdown().click();
    cy.findAllByText('Select All').click();
    cy.closeDropdown();

    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('All Fields');
    cy.filterByDropdown().should('have.text', 'All Fields');

    cy.enterName('*' + allFields + '*' + '{enter}');
    const allFieldsLocators = [
      assetDescSelector,
      assetSelector,
      countrySelector,
      customerNameSelector,
      productSelector,
    ];

    allFieldsLocators.forEach((element) => {
      cy.verifyAllFieldsFilters(element, allFields);
    });

    cy.enterName(allFields + '{enter}');
    allFieldsLocators.forEach((element) => {
      cy.verifyAllFieldsFilters(element, allFields);
    });

    cy.groupByDropdown().should('have.text', 'None');
    cy.dataChannelDropdown().should('have.text', 'All');
    cy.inventoryStatesDropdown().should('have.text', 'All');
    cy.unitsDropdown().should('have.text', 'Display');
  });

  it('TC: 8010 - A.S -Filter By -RTU -Full ID', function () {
    const RtuID = 'F0000646';

    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('RTU');
    cy.enterName(RtuID + '{enter}');

    //Verify all the defaults values
    cy.unitsDropdown().should('have.text', 'Display');
    cy.dataChannelDropdown().should('have.text', 'All');
    cy.inventoryStatesDropdown().should('have.text', 'All');
    cy.groupByDropdown().should('have.text', 'None');
    cy.sortDirectionIcon().should('not.exist');

    //Verify RTU list
    cy.verifyRTUData(RtuID);
  });

  it('TC: 8789 - A.S -Filter By -FTP -Full ID', function () {
    const FTPID = 'E1001939';

    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('FTP ID');
    cy.enterName(FTPID + '{enter}');

    //Verify RTU list
    cy.verifyFTPData('test FTP');

    //Verify all the defaults values
    cy.unitsDropdown().should('have.text', 'Display');
    cy.dataChannelDropdown().should('have.text', 'All');
    cy.inventoryStatesDropdown().should('have.text', 'All');
    cy.groupByDropdown().should('have.text', 'None');
  });

  it.skip('TC: 8016 - A.S-Sort by -Ascending/Descending order', function () {
    cy.enterName('{enter}');

    cy.groupByDropdown().click();
    cy.selectDropdown('Customer Name');

    cy.clickOnGroupBySortFilterSymbol();
    utilFunctions.verifyColumnSortingDesc(customerNameSelector);

    cy.clickOnGroupBySortFilterSymbol();
    utilFunctions.verifyColumnSortingAsc(customerNameSelector);
  });

  it.skip('TC: 8774 - A.S-Sorting of the Columns', function () {
    let readingTimeLocator =
      '[aria-label="asset summary table"] div:nth-child(2) [aria-label="Reading Time"]';
    cy.groupByDropdown().click();
    cy.selectDropdown('None');

    cy.clickOnAssetSummaryColumn('Customer');
    utilFunctions.verifyColumnSortingAsc(customerNameSelector);

    cy.clickOnAssetSummaryColumn('Reading Time');
    utilFunctions.verifyDateAndTimeSortingAsc(readingTimeLocator);
    
    cy.clickOnAssetSummaryColumn('Reading Time');
    utilFunctions.verifyDateAndTimeSortingDesc(readingTimeLocator);
  });

  it('TC: 8012 - A.S-Pagination-navigate with Arrows <,>,|<,>|', function () {
    cy.get('[aria-label="Pagination navigation"]').find('li').eq(2).click();
    cy.get('[aria-label="First page"]').first().should('be.disabled');
    cy.get('[aria-label="Previous page"]').first().should('be.disabled');
    cy.get('[aria-label="Item count"]')
      .eq(0)
      .then(function (siteCount) {
        const site = siteCount.text();
        var siteList = site.split('f');
        siteList = siteList[1].trim();
        this.siteList = siteList;
      })
      .then(() => {
        if (Number(this.siteList) > 100) {
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
        }
      });
  });

  it('TC: 8011 - A.S -Pagination-navigate with Page Numbers', function () {
    cy.server();
    cy.route('POST', routes.getAssetSummaryByOptionUrl).as('assetRecords');

    cy.searchField().clear().type('{enter}');
    cy.waitProgressBarToDisappear()
    cy.groupByDropdown().click();
    cy.selectDropdown('None');
    cy.wait('@assetRecords').should('have.property', 'status', 200);
    cy.waitProgressBarToDisappear();

    cy.get('@assetRecords').then((xhr) => {
      cy.log(xhr.response.body.count);

      cy.get('[aria-label="Item count"]')
        .first()
        .then((itemsCount) => {
          const item = itemsCount.text();
          var expItemList = item.split('f');
          expItemList = expItemList[1].trim();

          expect(Number(expItemList)).to.be.equal(xhr.response.body.count);
        });
    });
  });

  it('TC:8849 - A.S - Refresh', function () {
    utilFunctions.clickRefreshIcon('POST',routes.getAssetSummaryByOptionUrl);
  });

  it('TC:9801 - A.S-Navigation Control (Nav Bar)', () => {
    cy.navigateToAppPicker2('Operations');
    cy.assetSummaryIcon().click({force:true});
    cy.pageHeader().should('have.text', 'Asset Summary');
    cy.url().should('include', 'ops/asset-summary');
    cy.openNav();
    cy.findByRole('tab', { name: /Watch List/i })
      .should('exist')
      .click({ force: true });
    cy.findByRole('tab', { name: /Favorites/i }).should('exist');
    cy.findByRole('tab', { name: /Tree/i }).should('exist');
    cy.findByRole('tab', { name: /Group/i }).should('exist');
  });
});
