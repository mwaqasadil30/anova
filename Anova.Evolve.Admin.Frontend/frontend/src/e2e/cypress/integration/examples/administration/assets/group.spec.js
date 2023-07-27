/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const config = require('../../../../fixtures/example.json');
const utilFunctions = new UtilFunctions();

let uniqueGroupDesc, uniqueGroupDesc2, uniqueGroupDesc3, editGroupUniqueName,
    groupNameLocator = 'tbody [aria-label="Description"]';
   

describe('Group test suite', function () {
  beforeEach(function () {
    cy.fixture('example.json').as('config');

    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('TC: 7581 - Set UP-As single domain user',{retries : 10}, function () {
    cy.login();
  });

  it('TC: 7582 - Group Manager View ', function () {
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });

    cy.viewAsset(
      '[href="/admin/asset-group-manager"]',
      'Asset Group Manager',
      routes.retrieveGroupByDomainUrl
    );

  });

  it("TC: 7651 - Add Group-(save-error-save)-(Display in tree enabled) -Logic '=', 'OR', ' Is Empty' case", function () {
    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);
    cy.clickAddButton('Add Asset Group', routes.retrieveGroupEditByIdUrl);

    cy.enterAssetSelectionCriteriaIsEmptyCase(
      'Add Asset Group',
      'City',
      '=',
      'Hamler',
      'Or',
      'Product Name',
      'Is Empty',
      config.groupUser
    );

    cy.clickButton('Save');

    cy.verifyDescriptionError();

    uniqueGroupDesc = utilFunctions.suffixWithDate(config.groupDesc);

    cy.groupDescription().type(uniqueGroupDesc);

    cy.displayTreeCheckbox().should('be.checked');

    cy.clickAddButton('Save', routes.retrieveGroupEditByIdUrl);

    cy.findByText('Edit Asset Group').should('exist');

    cy.goBack('POST',routes.retrieveGroupByDomainUrl);
  });

  it("TC: 7658 - Add Group-(save&Exit)-(Display in tree disabled) -Logic '!=', 'And' , Logic'=' case-test authorized user only see the Asset group ", function () {
    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);
    utilFunctions.itemsCountBefore();

    cy.clickAddButton('Add Asset Group', routes.retrieveGroupEditByIdUrl);

    cy.displayTreeCheckbox().should('be.checked');

    uniqueGroupDesc2 = utilFunctions.suffixWithDate(config.groupDesc2);
    cy.groupDescription().type(uniqueGroupDesc2);

    cy.displayTreeCheckbox().uncheck().should('not.be.checked');

    cy.enterAssetSelectionCriteriaEqualCase(
      'Add Asset Group',
      'Country',
      '!=',
      'England',
      'And',
      'Customer Name',
      '=',
      'Hosking Ludlow Ltd',
      config.groupUser
    );
    cy.clickAddButton('Save & Close', routes.retrieveGroupByDomainUrl);

    cy.findByText('Asset Group Manager').should('exist');

    utilFunctions.verifyItemsCountAfter(1);
  });

  it("TC: 7669 - Add Group-(cancel)-(Display in tree enabled) -Logic ' Like ' and None. ", function () {
    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);
    utilFunctions.itemsCountBefore();

    cy.clickAddButton('Add Asset Group', routes.retrieveGroupEditByIdUrl);

    cy.displayTreeCheckbox().should('be.checked');
    uniqueGroupDesc3 = utilFunctions.suffixWithDate(config.groupDesc3);
    cy.groupDescription().type(uniqueGroupDesc3);

    cy.assetSelectionRow1(
      'Add Asset Group',
      'City',
      '=',
      'seeley lake',
      'None'
    );

    cy.selectViewSelectedAssetButton();

    cy.selectUsers(config.groupUser);

    cy.clickCancelButton(routes.retrieveGroupEditByIdUrl);

    cy.verifyEmptyGroupFields();

    cy.url().should('include', '/asset-group-manager/create');

    cy.goBack('POST',routes.retrieveGroupByDomainUrl);

    utilFunctions.verifyItemsCountAfter(0);
  });

  it('TC: 7729 - Add Group-save-Only Description with no selection criteria -(All tanks)-No user added ', function () {
    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);
    cy.clickAddButton('Add Asset Group', routes.retrieveGroupEditByIdUrl);

    cy.displayTreeCheckbox().should('be.checked');

    cy.groupDescription().type(uniqueGroupDesc3);

    cy.selectViewSelectedAssetButton();

    cy.clickAddButton('Save', routes.retrieveGroupEditByIdUrl);

    cy.findByText('Edit Asset Group').should('exist');

    cy.goBack('POST',routes.retrieveGroupByDomainUrl);
  });

  it("TC: 7712 - Edit- Group-(save-error-save & exit )-(Display in tree enabled) -Logic '!=' and 'None' case", function () {
    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);
    utilFunctions.itemsCountBefore();

    cy.selectItemfromList(groupNameLocator,uniqueGroupDesc3, routes.retrieveGroupEditByIdUrl);

    cy.findByText('Edit Asset Group').should('exist');
    cy.groupDescription().clear();
    cy.displayTreeCheckbox().should('be.checked');

    cy.editGroupDetails('State or Province', '=', 'Rhode Island');

    //Clear 2nd parameter
    cy.searchValue1().clear();

    cy.clickButton('Save');

    cy.verifyDescriptionError();

    cy.findByText('Second Parameter is required.').should('exist');

    cy.searchValue1().type('Rhode Island');

    cy.selectViewSelectedAssetButton();

    cy.selectUsers(config.groupUser);

    editGroupUniqueName = utilFunctions.suffixWithDate(config.editGroupName);

    cy.groupDescription().type(editGroupUniqueName);

    cy.clickAddButton('Save & Close', routes.saveGroupUrl);

    utilFunctions.verifyItemsCountAfter(0);
  });

  it("TC: 7717 - Edit- Group-(cancel)-(Display in tree disabled) -Logic ' != '", function () {
    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);
    utilFunctions.itemsCountBefore();

    cy.selectItemfromList(groupNameLocator,uniqueGroupDesc, routes.retrieveGroupEditByIdUrl);

    cy.findByText('Edit Asset Group').should('exist');
    cy.groupDescription().clear().type('Test edit group 3');
    cy.displayTreeCheckbox().should('be.checked');
    cy.displayTreeCheckbox().click().should('not.be.checked');

    cy.editGroupDetails('Country', '!=', 'USA');

    cy.selectViewSelectedAssetButton();

    cy.get('.MuiIconButton-sizeSmall').click({
      force: true,
    });

    cy.selectUsers(config.groupUser);

    cy.clickCancelButton(routes.retrieveGroupEditByIdUrl);

    cy.goBack('POST',routes.retrieveGroupByDomainUrl);

    utilFunctions.verifyItemsCountAfter(0);
  });

  it('TC: 7591 - Group -Filter By - Few alphabets from middle of group name', function () {
    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);
    const myString = utilFunctions.splitStrings(uniqueGroupDesc);
    cy.verifyGroupFilters(groupNameLocator, myString[1]);
  });

  it('TC: 7598 - Delete- 1-Three dot Menu', function () {
    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);
    cy.searchField().clear({force: true});
    cy.applyButton().click({force: true});
    cy.wait(1000);
    cy.deleteObjectByThreeDot('POST',routes.retrieveGroupByDomainUrl,groupNameLocator,uniqueGroupDesc2);
    cy.verifyGroupDeletedItem(uniqueGroupDesc2, 'No asset groups found');
  });

  it('TC: 7597 - Delete All -created during Group testing -2-With Delete selected', function () {
    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);
    cy.get('input[type="text"]').clear().type(utilFunctions.getCurrentDate());
    cy.applyButton().click({force: true});

    const groupNames = [uniqueGroupDesc, editGroupUniqueName];

    groupNames.forEach((element) => {
      cy.deleteGroupRecord(element);
    });

    cy.clickOndeleteSelectedButton(routes.retrieveGroupByDomainUrl);

    groupNames.forEach((element) => {
      cy.verifyGroupDeletedItem(element, 'No asset groups found');
    });
  });

  it('TC: 7583 - Group -Refresh', function () {
    utilFunctions.clickRefreshIcon('POST',routes.retrieveGroupByDomainUrl);
  });

  it('Verify view for published asset groups when viewing on target domain',function(){

    cy.verifyPageUrl('POST',routes.groupManagerUrl, routes.retrieveGroupByDomainUrl);

    cy.selectPublishedGroup();
    cy.findByText('Edit Asset Group').should('exist');

    //Verify Group Name, Asset Selection Criteria and Tree checkbox should be disabled
    cy.get('[id="Description"]').should('be.disabled');
    cy.displayTreeCheckbox().should('be.disabled');
    cy.assetSelectionCriteriaTable().should('not.exist');

  });


});
