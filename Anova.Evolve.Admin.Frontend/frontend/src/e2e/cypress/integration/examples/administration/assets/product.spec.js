/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();

let assetNameLocator = 'tbody [aria-label="Name"]',
    editProductUniqueName,
    editProductUniqueName2,
    uniqueProductName,
    uniqueProductName2;

describe('Product Administration testsuite', function () {
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

  

  it('TC: 7169 - Login',{retries : 10}, function () {
    cy.login();
  });

  it('TC: 7170 - Product Manager View', function () {
    cy.server();
    cy.route('POST', routes.retrieveProductByDomainUrl).as('productRecords');

    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });

    cy.assetNav().should('be.visible').click();
    cy.get('[href="/admin/product-manager"]').click();
    cy.wait('@productRecords').should('have.property', 'status', 200);
    cy.findByText('Product Manager').should('exist');
    cy.verifyProductCountFromAPI();
  });

  it('TC: 7171 - Add Product - Cancel', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );

    utilFunctions.itemsCountBefore();
    cy.findByText('Add Product').click({ force: true });
    cy.enterProductDetails(
      this.data.productName,
      this.data.gravity,
      this.data.SCM,
      this.data.productGroup,
      'Add Product'
    );

    cy.clickButton('Cancel');
    cy.url().should('includes', 'product-manager/create');
    cy.verifyAllProductFieldsAreClear();
    cy.goBack('POST',routes.retrieveProductByDomainUrl);
    utilFunctions.verifyItemsCountAfter(0);
  });

  it('Validations of Add Product Page input fields', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );
    cy.findByText('Add Product').click({ force: true });
    cy.verifyAddProductFieldsErrorTexts(
      this.data.negativeProductInputValues.gravity,
      this.data.negativeProductInputValues.SCM
    );
    cy.goBack('POST',routes.retrieveProductByDomainUrl);
  });

  it('TC: 7172 - Add Product - Save', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );
    cy.server();
    cy.route('POST', routes.saveProductUrl).as('saveProduct');
    cy.getProductItemsListCountVerified();
    utilFunctions.itemsCountBefore();
    cy.findByText('Add Product').click({ force: true });

    uniqueProductName = utilFunctions.suffixWithDate(this.data.productName);
    cy.enterProductDetails(
      uniqueProductName,
      this.data.gravity,
      this.data.SCM,
      this.data.productGroup,
      'Add Product'
    );

    cy.clickButton('Save');
    cy.wait('@saveProduct').should('have.property', 'status', 200);
    cy.goBack('POST',routes.retrieveProductByDomainUrl);
    utilFunctions.verifyItemsCountAfter(1);
  });

  it('TC: 7176 - Add Product - Save & Exit', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );
    cy.server();
    cy.route('POST', routes.saveProductUrl).as('save&ExitProduct');

    cy.getProductItemsListCountVerified();
    utilFunctions.itemsCountBefore();

    cy.findByText('Add Product').click({ force: true });
    uniqueProductName2 = utilFunctions.suffixWithDate(this.data.productName2);

    cy.enterProductDetails(
      uniqueProductName2,
      this.data.gravity,
      this.data.SCM,
      this.data.productGroup,
      'Add Product'
    );

    cy.clickButton('Save & Close');
    cy.wait('@save&ExitProduct').should('have.property', 'status', 200);
    utilFunctions.verifyItemsCountAfter(1);
  });

  it('TC: 7199 - Edit Product - Cancel', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );
    cy.waitProgressBarToDisappear();
    cy.getProductItemsListCountVerified();

    utilFunctions.itemsCountBefore();
    cy.recordName().first().click({force: true});
    cy.productName()
      .invoke('val')
      .then((sometext) => {
        cy.log(sometext);
        this.someText = sometext;
      });

    cy.enterProductDetails(
      this.data.editedName,
      this.data.editedSpecGravity,
      this.data.editedSCM,
      this.data.productGroup,
      'Edit Product'
    );

    cy.clickButton('Cancel');
    cy.goBack('POST',routes.retrieveProductByDomainUrl);
    utilFunctions.verifyItemsCountAfter(0);

    cy.recordName()
      .first()
      .then(function (productName) {
        const pName = productName.text();
        expect(pName).to.equal(this.someText);
      });
  });

  it('TC: 7196 - Edit Product - save', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );
    utilFunctions.itemsCountBefore();

    cy.clickOnRecordName(uniqueProductName);
    editProductUniqueName = utilFunctions.suffixWithDate(this.data.editedName);
    cy.enterProductDetails(
      editProductUniqueName,
      this.data.editedSpecGravity,
      this.data.editedSCM,
      this.data.productGroup,
      'Edit Product'
    );

    cy.clickSaveOrExitButton('Save', routes.saveProductUrl);
    cy.goBack('POST',routes.retrieveProductByDomainUrl);
    cy.url().should('includes', '/admin/product-manager');
    utilFunctions.verifyItemsCountAfter(0);

    cy.searchField().type(editProductUniqueName);
    cy.clickButton('Apply');
    cy.recordName().each(($el) => {
      expect($el.text()).to.equal(editProductUniqueName);
    });
  });

  it('TC: 7197 - Edit Product - Save And Exit', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );
    cy.searchField().clear();

    cy.clickButton('Apply', { timeout: 1000 });
    utilFunctions.itemsCountBefore();
    cy.clickOnRecordName(uniqueProductName2);

    editProductUniqueName2 = utilFunctions.suffixWithDate(
      this.data.editedName2
    );

    cy.enterProductDetails(
      editProductUniqueName2,
      this.data.editedSpecGravity,
      this.data.editedSCM,
      this.data.productGroup,
      'Edit Product'
    );

    cy.clickSaveOrExitButton('Save & Close', routes.retrieveProductByDomainUrl);
    cy.url().should('includes', '/admin/product-manager');
    utilFunctions.verifyItemsCountAfter(0);

    cy.searchField().type(editProductUniqueName2);
    cy.clickButton('Apply');
    cy.recordName().each(($el) => {
      expect($el.text()).to.equal(editProductUniqueName2);
    });
  });

  it('TC: 7187 - Product -Filter By - Few alphabets from middle of Prod name ', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );
    const myString = utilFunctions.splitStrings(editProductUniqueName);
    cy.verifyFilterScenarios(myString[1]);
  });

  it('TC: 7483 - Delete All -created during Product testing -2-With Delete selected', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );
    cy.searchField().clear();
    cy.applyButton().click();

    const productNames = [
      editProductUniqueName2    
    ];

    productNames.forEach((element) => {
      cy.deleteProductRecord(element);
    });
    cy.clickOndeleteSelectedButton(routes.retrieveProductByDomainUrl);
    cy.verifyDeletedItem(editProductUniqueName2, 'No products found');
  });

  it('TC: 7201 - Delete 2-three dot Menu ', function () {
    cy.verifyPageUrl('POST',
      routes.productManagerUrl,
      routes.retrieveProductByDomainUrl
    );
    cy.searchField().clear().type(editProductUniqueName, {force: true});
    cy.clickButton('Apply');
    cy.deleteObjectByThreeDot('POST',routes.retrieveProductByDomainUrl,assetNameLocator,editProductUniqueName);
    cy.verifyDeletedItem(editProductUniqueName, 'No products found');
  });

  it('TC: 7202 - Refresh', function () {
    utilFunctions.clickRefreshIcon('POST',routes.retrieveProductByDomainUrl);
  });
});
