/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const utilFunctions = new UtilFunctions();
const routes = require('../../../../fixtures/routes.json');

let treeNameLocator = 'tbody [aria-label="Name"] a',
    uniqueTreeDesc,
    uniqueTreeDesc3,
    uniqueTreeDesc4,
    uniqueTreeDesc5,
    uniqueEditTreeDesc1,
    uniqueEditTreeDesc2;

describe('Tree test suite', function () {
  beforeEach(function () {
    cy.fixture('example').then((data) => {
      this.data = data;
    });
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('TC: 7290 - Set UP -Single domain user ',{retries : 10}, function () {
    cy.login();
  });

  it('TC: 7291 - Asset Tree Manager View', function () {
    cy.applicationLaunchPanel().click({ force: true });
    cy.findAllByText('Administration').click({ force: true });
    cy.viewAsset('[href="/admin/asset-tree-manager"]', 'Asset Tree Manager', routes.retrieveTreeByDomainUrl);

  });

  it('TC: 7337 - Add Asset Tree-Select all types of DC-With out Tree Hierarchy-Save-error-Save', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    cy.clickAddButton('Add Asset Tree', routes.retrieveTreeEditComponentsUrl);

    cy.clickButton('Save');

    cy.findAllByText('Description is required.').should('exist');

    uniqueTreeDesc = utilFunctions.suffixWithDate(this.data.treeDesc);

    cy.description().type(uniqueTreeDesc);

    cy.verifySelectAllDCType();

    cy.clickAddButton('Save', routes.retrieveTreeEditComponentsUrl);

    cy.findByText('Edit Tree').should('exist');
    cy.goBack('POST',routes.retrieveTreeByDomainUrl);
  });

  it('TC:7341 - Add Asset Tree-Select all types of DC-With Tree Hierarchy -two levels(any) -Save', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    cy.clickAddButton('Add Asset Tree', routes.retrieveTreeEditComponentsUrl);

    uniqueTreeDesc3 = utilFunctions.suffixWithDate(this.data.treeDesc3);

    cy.enterTreeDetails2Levels(
      uniqueTreeDesc3,
      'Product Name',
      'Product Group'
    );

    //Verifying all Data channel types should be selected
    cy.verifyDataChannelTypeDropdown('be.checked');

    cy.clickAddButton('Save', routes.retrieveTreeEditComponentsUrl);

    cy.findByText('Edit Tree', { timeout: 5000 }).should('exist');

    cy.goBack('POST',routes.retrieveTreeByDomainUrl);
  });

  it('TC: 7342 - Add Asset Tree- Without selecting all types of DC-With Tree Hierarchy All Levels -Save', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    cy.getProductItemsListCountVerified();

    cy.clickAddButton('Add Asset Tree', routes.retrieveTreeEditComponentsUrl);
    uniqueTreeDesc4 = utilFunctions.suffixWithDate(this.data.treeDesc4);

    cy.enterTreeDetails(
      uniqueTreeDesc4,
      'Customer Name',
      'Product Group',
      'City',
      'Customer Contact'
    );

    cy.selectDataChannelType();

    cy.clickAddButton('Save', routes.retrieveTreeEditComponentsUrl);

    cy.findByText('Edit Tree').should('exist');

    cy.goBack('POST',routes.retrieveTreeByDomainUrl);
  });

  it('TC:7345 - Add Asset Tree-Select all types of DC-With Tree Hierarchy -all levels -Save & Exit', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    cy.clickAddButton('Add Asset Tree', routes.retrieveTreeEditComponentsUrl);

    uniqueTreeDesc5 = utilFunctions.suffixWithDate(this.data.treeDesc5);

    cy.enterTreeDetails(
      uniqueTreeDesc5,
      'Country',
      'State or Province',
      'City',
      'Customer Name'
    );

    //Verifying all Data channel types should be selected
    cy.verifyDataChannelTypeDropdown('be.checked');

    cy.clickAddButton('Save & Close', routes.saveTreeUrl);

    cy.findByText('Asset Tree Manager').should('exist');
  });

  it('TC: 7351 - Add Asset Tree-Select all types of DC-With Tree Hierarchy -all levels -Cancel', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    utilFunctions.itemsCountBefore();

    cy.clickAddButton('Add Asset Tree', routes.retrieveTreeEditComponentsUrl);

    cy.enterTreeDetails(
      'Test Tree Cancel Scenario',
      'Country',
      'State or Province',
      'City',
      'Customer Name'
    );

    //Verifying all the types should be selected
    cy.verifyDataChannelTypeDropdown('be.checked');

    cy.clickCancelButton(routes.retrieveTreeEditComponentsUrl);

    cy.verifyTreeFieldsAreClear();

    cy.goBack('POST',routes.retrieveTreeByDomainUrl);

    utilFunctions.verifyItemsCountAfter(0);
  });

  it('TC: 7356 -  Edit-Tree-Save-error-Save', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    utilFunctions.itemsCountBefore();

    cy.selectItemfromList(treeNameLocator,uniqueTreeDesc, routes.retrieveTreeEditComponentsUrl);

    //Duplicate description
    cy.description().clear().type(uniqueTreeDesc5);

    //change the selections of DC
    cy.selectDataChannelType();

    cy.wait(3000);

    cy.findByText('Save & Close').click({force:true})

    cy.wait(3000);

    cy.findAllByText('Tree already exists.').should('exist');

    uniqueEditTreeDesc1 = utilFunctions.suffixWithDate(this.data.editTreeDesc1);

    //change tree value types
    cy.enterTreeDetails(
      uniqueEditTreeDesc1,
      'Country',
      'Product Group',
      'City',
      'Description'
    );

    
    cy.findByText('Save & Close').click({force:true})

    cy.goBack('POST',routes.retrieveTreeByDomainUrl);

    utilFunctions.verifyItemsCountAfter(0);
  });

  it('TC: 7357 -  Edit-Tree-Save& Exit-error-Save&Exit', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    utilFunctions.itemsCountBefore();

    cy.selectItemfromList(
      treeNameLocator,
      uniqueTreeDesc4,
      routes.retrieveTreeEditComponentsUrl
    );

    //Duplicate description
    cy.description().clear().type(uniqueTreeDesc3);

    cy.clickAddButton('Save', routes.saveTreeUrl);

    cy.findAllByText('Tree already exists.').should('exist');

    uniqueEditTreeDesc2 = utilFunctions.suffixWithDate(this.data.editTreeDesc2);

    //change tree value types or leave empty
    cy.enterTreeDetails(
      uniqueEditTreeDesc2,
      'Country',
      'Product Group',
      'City',
      'Description'
    );
  
    cy.findByText('Save & Close').click({force:true})
    cy.goBack('POST',routes.retrieveTreeByDomainUrl);
    utilFunctions.verifyItemsCountAfter(0);
  });

  it('TC: 7358 -  Edit-Tree-Cancel', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    utilFunctions.itemsCountBefore();

    cy.selectItemfromList(
      treeNameLocator,
      uniqueTreeDesc3,
      routes.retrieveTreeEditComponentsUrl
    );

    //change DC type
    cy.selectDataChannelType();

    cy.enterTreeDetails(
      'Test edit tree scenario',
      'Country',
      'Product Group',
      'City',
      'Description'
    );
    cy.findAllByText('Cancel').click({force:true});
    cy.wait(1000);
    cy.visit('/admin/asset-tree-manager');
    utilFunctions.verifyItemsCountAfter(0);
  });

  it('TC: 7331 - Delete- 1-Three dot Menu', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    cy.deleteRecordByThreeDotForTree(uniqueTreeDesc3, routes.retrieveTreeByDomainUrl);
    cy.verifyTreeDeleted(uniqueTreeDesc3);

  });

  it('TC: 7330 - Delete All -created during tree testing -2-With Delete selected', function () {
    cy.verifyPageUrl('POST',routes.treeManagerUrl, routes.retrieveTreeByDomainUrl);
    const treeNames = [
      uniqueTreeDesc5,
      uniqueEditTreeDesc1,
      uniqueEditTreeDesc2,
    ];

    treeNames.forEach((element) => {
      cy.deleteTreeRecord(element);
    });

    cy.deleteSelectedButtonForTree(routes.retrieveTreeByDomainUrl);

    treeNames.forEach((element) => {
      cy.verifyTreeDeleted(element);
    });
  });

  it('TC: 7292 - Tree - Refresh', function () {
    utilFunctions.clickRefreshIcon('POST',routes.retrieveTreeByDomainUrl);
  });
});
