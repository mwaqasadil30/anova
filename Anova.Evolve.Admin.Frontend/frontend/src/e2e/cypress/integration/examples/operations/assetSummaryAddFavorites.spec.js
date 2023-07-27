/// <reference types="cypress" />
import UtilFunctions from '../../../support/utils/UtilFunctions';
const routes = require('../../../fixtures/routes.json');
const config = require('../../../fixtures/example.json');
const utilFunctions = new UtilFunctions();
describe('Asset Add Favourites Test suite', function () {
  let uniqueFavouriteName1,
    uniqueFavouriteName2,
    uniqueFavouriteName3,
    uniqueEditFavouriteName,
    uniqueGroupDesc,
    groupUser,
    uniqueTreeDesc,
    uniqueGroupDesc1,
    isPublishGroup,
    customerNameSelector = '[aria-label="Customer Name"]',
    productSelector = '[aria-label="Product"]',
    readingSelector = '[aria-label="Reading"]',
    inventoryStateSelector = '[aria-label="Inventory State"]',
    deliverableSelector = '[aria-label="Deliverable"]',
    alarmLevelSelector = '[aria-label="Alarm Level"]';

  beforeEach(() => {
    cy.fixture('example.json').as('config');
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });
  it('TC: 10181 - Set UP-1-As Single domain User.',{retries : 10}, () => {
    cy.login();
  });

  it('Add asset group and tree for favourite cases.', function () {
    cy.applicationLaunchPanel().click({ force: true });
    cy.contains('Administration').click({ force: true });
    groupUser = config.groupUser;
    uniqueGroupDesc = utilFunctions.suffixWithDate(config.groupDesc);
    isPublishGroup = 'false';
    cy.createGroup(uniqueGroupDesc, groupUser, isPublishGroup);
    uniqueTreeDesc = utilFunctions.suffixWithDate(config.treeDesc);
    cy.createTree(uniqueTreeDesc);
  });

  it('TC: 10182 - Navigate to Operations app -Asset summary -Fav', function () {
    cy.navigateToAppPicker('POST','Operations', routes.getAssetSummaryByOptionUrl);
    cy.assetSummaryIcon().click({ force: true });
    cy.pageHeader().should('have.text', 'Asset Summary');
    cy.url().should('include', 'ops/asset-summary');
  });

  it('TC: 10183 - A.S.Fav-Select Asset Group -Filter By -Customer Name -Group by none-DC Level-Inventory Level Critical-display as units -Add Fav-Cancel-Add Fav -save -make default-save', function () {
    cy.verifyPageUrl('POST',routes.assetSummaryUrl, routes.getAssetSummaryByOptionUrl);

    uniqueFavouriteName1 = utilFunctions.suffixWithDate(config.favoriteName1);
    const customerName = 'bulk',
      units = ['Normal', 'Refill'];

    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click();
    cy.filterByDropdown()
      .should('have.text', 'All Fields')
      .click({ force: true });
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Customer Name');
    cy.filterByDropdown().should('have.text', 'Customer Name');
    cy.enterName(customerName + '{enter}');
    cy.verifyGridFilters(customerNameSelector, customerName);

    cy.groupByDropdown().should('have.text', 'Asset').click({ force: true });
    cy.verifyGroupByDropdownFields();
    cy.selectDropdown('None');
    cy.groupByDropdown().should('have.text', 'None');
    cy.closeDropdown();

    cy.dataChannelDropdown().click({ force: true });
    cy.deselectAllInListbox(
      '[aria-labelledby="dataChannel-input-label"] button'
    );
    cy.levelDropdown('Level');
    cy.closeDropdown();
    cy.dataChannelDropdown().should('have.text', 'Level');

    cy.inventoryStatesDropdown().click({ force: true });
    cy.deselectAllInListbox(
      '[aria-labelledby="inventoryStates-input-label"] button'
    );
    units.forEach((element) => {
      cy.selectSpecificCheckBox(element);
    });
    cy.closeDropdown();
    cy.verifyAllFieldsFilters(inventoryStateSelector, 'Normal');
    cy.verifyAllFieldsFilters(inventoryStateSelector, 'Refill');
    cy.unitsDropdown().should('have.text', 'Display');
    cy.dataChannelDropdown().should('have.text', 'Level');
    cy.clearNavItemIfVisible();
    cy.navigationBar().click({ force: true });
    cy.clickOnTab('Group');
    cy.selectGroup(uniqueGroupDesc);
    cy.clickAddFavorite();
    cy.verifyFavoritesPopUp();
    cy.cancelFavoriteModal();
    cy.wait(1000);
    cy.clickAddFavorite();

    cy.favouriteAssetName().type(uniqueFavouriteName1);
    cy.setDefaultFavourite();
    cy.saveFavorite();
    cy.clickButtonInDialogBox('Save', routes.getFavouritesUrl);

    cy.navBreadcrumb().findAllByText(uniqueFavouriteName1);
    cy.navigationBar().click({ force: true });
    cy.clickOnTab('Favorites');
    cy.verifyAndSelectDefaultFavourite(
      uniqueFavouriteName1,
      routes.getAssetSummaryByOptionUrl
    );
    cy.wait(2000);

    cy.findAllByText('Favourite').click({ force: true });
    cy.findByText('Delete').should('exist');
    cy.findByText('Edit').should('exist').click({ force: true });
    cy.get('[id="isDefaultFavorite-input"]').should('be.checked');
    cy.cancelFavoriteModal();
    cy.tearGroup(uniqueGroupDesc);
  });

  //skipping it just to confirm that the server issue is happening because of this test case or due to someother reason. will revert it back after confirming
  it.skip('TC: 10184 - A.S.FAV-Select Asset Tree-Filter By -Asset Titles- Group By -Assets -level ,Pressure,Battery ,GPS DCs-Normal ,Full,Empty,Reorder-Scaled as units -Add-view-Edit-save-view-delete ', function () {
    uniqueFavouriteName2 = utilFunctions.suffixWithDate(config.favoriteName2);
    uniqueEditFavouriteName = utilFunctions.suffixWithDate(
      config.editfavoriteName
    );

    let nameTxt,
      customerName = 'Anova',
      editCustomerName = 'Test Edit',
      unitsDisplay = 'Display',
      inventoryStates = ['Full', 'Empty', 'Reorder'];

    cy.server();
    cy.route('POST', routes.getAssetSummaryByOptionUrl).as('records');

    cy.navigateToAppPicker('POST','Operations', routes.getAssetSummaryByOptionUrl);
    cy.clearNavItemIfVisible();
    cy.navigationBar().click({ force: true });
    cy.clickOnTab('Tree');
    cy.selectTree(uniqueTreeDesc);

    cy.findAllByText('Show Filters').click();
    cy.filterByDropdown().click({ force: true });
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(customerName + '{enter}');
    cy.verifyGridFilters(customerNameSelector, customerName);

    cy.groupByDropdown().click({ force: true });
    cy.verifyGroupByDropdownFields();
    cy.selectDropdown('Asset');
    cy.groupByDropdown().should('have.text', 'Asset');
    cy.closeDropdown();

    cy.dataChannelDropdown().click({ force: true });
    cy.levelDropdown('Level');
    cy.levelDropdown('Pressure');
    cy.levelDropdown('Battery Voltage');
    cy.levelDropdown('GPS');
    cy.closeDropdown();
    cy.wait('@records').should('have.property', 'status', 200);
    cy.waitProgressBarToDisappear();
    cy.dataChannelDropdown().then((dcName) => {
      nameTxt = dcName.text();
      expect(nameTxt.includes('Pressure', 'Battery Voltage', 'GPS', 'Level')).to
        .be.true;
    });

    cy.inventoryStatesDropdown().click({ force: true });
    cy.checkBox().uncheck({force:true});
    inventoryStates.forEach((element) => {
      cy.selectSpecificCheckBox(element);
    });
    cy.closeDropdown();
    cy.wait('@records').should('have.property', 'status', 200);

    cy.unitsDropdown().click({ force: true });
    cy.selectDropdown('Scaled');
    cy.unitsDropdown().should('have.text', 'Scaled');
    cy.wait(3000);
    utilFunctions.itemsCountPaginationBefore();

    cy.clickAddFavorite();
    cy.verifyFavoritesPopUp();
    cy.cancelFavoriteModal();
    cy.wait(1000);
    cy.clickAddFavorite();
    cy.favouriteAssetName().type(uniqueFavouriteName2);
    cy.setDefaultFavourite();
    cy.saveFavorite();
    cy.clickButtonInDialogBox('Save', routes.getFavouritesUrl);
    cy.wait(1000);
    cy.navBreadcrumb().findAllByText(uniqueFavouriteName2);

    cy.clearNavItem().click({ force: true });
    cy.clearNavItemIfVisible();

    cy.navigationBar().click({ force: true });
    cy.clickOnTab('Favorites');
    cy.verifyAndSelectDefaultFavourite(
      uniqueFavouriteName2,
      routes.getAssetSummaryByOptionUrl
    );
    cy.wait(2000);

    //Edit Favourite
    cy.enterName(editCustomerName + '{enter}');
    cy.verifyGridFilters(customerNameSelector, editCustomerName);
    cy.unitsDropdown().click({ force: true });
    cy.selectDropdown(unitsDisplay);
    cy.unitsDropdown().should('have.text', unitsDisplay);

    cy.findAllByText('Favourite', { timeout: 7000 }).click({ force: true });
    cy.findByText('Delete').should('exist');
    cy.findByText('Edit').should('exist').click({ force: true });

    cy.verifyEditFavouritePopUp(uniqueEditFavouriteName);
    cy.clickButtonInDialogBox('Save', routes.saveFavoriteUrl);
    cy.wait(1000);
    cy.navBreadcrumb().findAllByText(uniqueEditFavouriteName);
    cy.clearNavItemIfVisible();

    cy.navigationBar().click({ force: true });
    cy.clickOnTab('Favorites');
    cy.selectFavItemFromNavigationBar(
      uniqueEditFavouriteName,
      routes.getAssetSummaryByOptionUrl
    );
    cy.wait(2000);

    //Verify Changes after editing the favourite
    cy.unitsDropdown().should('have.text', unitsDisplay);
    cy.dataChannelDropdown().then((dcName) => {
      nameTxt = dcName.text();
      expect(nameTxt.includes('Pressure', 'Battery Voltage', 'GPS')).to.be.true;
    });

    cy.fetchInputFieldText('[id="filterText-input"]', editCustomerName);

    cy.findAllByText('Favourite', { timeout: 20000 }).click({ force: true });
    cy.findByText('Delete').should('exist').click({ force: true });
    cy.verifyDeleteFavouritePopUp(uniqueEditFavouriteName);
    cy.clickButtonInDialogBox('Delete', routes.deleteFavouriteById);

    cy.tearTree(uniqueTreeDesc);
  });

  it('TC: 10377 - A.S Favorites Tear Down', function () {
    cy.verifyPageUrl('POST',routes.assetSummaryUrl, routes.getAssetSummaryByOptionUrl);

    cy.clearNavItemIfVisible();

    cy.navigationBar().click({ force: true });
    cy.clickOnTab('Favorites');
    cy.selectFavItemFromNavigationBar(
      uniqueFavouriteName1,
      routes.getAssetSummaryByOptionUrl
    );
    cy.wait(2000);

    cy.findAllByText('Favourite').click({ force: true });
    cy.findByText('Edit').should('exist');
    cy.findByText('Delete').should('exist').click({ force: true });

    cy.verifyDeleteFavouritePopUp(uniqueFavouriteName1);
    cy.clickButtonInDialogBox('Delete', routes.getFavouritesUrl);
  });

  it('TC: 10210 - A.S.FAV-Select Published asset Group -Filter By-Product -Group by Customer name - units = %Full -Add Fav-Save', function () {
    const productName = 'Nitrogen';
    (uniqueFavouriteName3 = utilFunctions.suffixWithDate(config.favoriteName3)),
      (uniqueGroupDesc1 = 'Helium');

    cy.server();
    cy.route('POST', routes.getAssetSummaryByOptionUrl).as('records');

    cy.navigateToAppPicker2('Operations');
    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click();
    cy.filterByDropdown().click({ force: true });
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Product');
    cy.filterByDropdown().should('have.text', 'Product');
    cy.enterName(productName + '{enter}');
    cy.verifyGridFilters(productSelector, productName);

    cy.groupByDropdown().click({ force: true });
    cy.verifyGroupByDropdownFields();
    cy.selectDropdown('Customer Name');

    cy.wait('@records').should('have.property', 'status', 200);
    cy.groupByDropdown().should('have.text', 'Customer Name');
    cy.closeDropdown();

    cy.unitsDropdown().click({ force: true });
    cy.selectDropdown('% Full');
    cy.unitsDropdown().should('have.text', '% Full');
    cy.verifyIncludesFilters(readingSelector, '%', 'InsWC');
    cy.verifyIncludesFilters(deliverableSelector, '%', '');
    cy.verifyIncludesFilters(alarmLevelSelector, 'R:', 'C:');

    cy.clearNavItemIfVisible();
    cy.navigationBar().click({ force: true });
    cy.clickOnTab('Group');
    cy.selectGroup(uniqueGroupDesc1);
    utilFunctions.itemsCountPaginationBefore();

    cy.clickAddFavorite();
    cy.verifyFavoritesPopUp();
    cy.favouriteAssetName().type(uniqueFavouriteName3);

    cy.clickButtonInDialogBox('Save', routes.getFavouritesUrl);
    cy.navBreadcrumb().findAllByText(uniqueFavouriteName3);

    cy.clearNavItem().click({ force: true });
    cy.navBreadcrumb().should('have.text', 'All Assets');

    cy.navigationBar().click({ force: true });
    cy.clickOnTab('Favorites');
    cy.selectFavItemFromNavigationBar(
      uniqueFavouriteName3,
      routes.getAssetSummaryByOptionUrl
    );
    cy.wait(2000);
    cy.findAllByText('Favourite').click({ force: true });
    cy.findByText('Edit').should('exist');
    cy.findByText('Delete').should('exist').click({ force: true });

    cy.verifyDeleteFavouritePopUp(uniqueFavouriteName3);
    cy.clickButtonInDialogBox('Delete', routes.getFavouritesUrl);
  });
});
