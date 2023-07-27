/// <reference types="cypress" />
import UtilFunctions from '../../support/utils/UtilFunctions';
const routes = require('../../fixtures/routes.json');
const example = require('../../fixtures/example.json');
const utilFunctions = new UtilFunctions();

let editProductUniqueName2, uniqueProductName2;

describe('Smoke Authentication Test Suite', function () {
  beforeEach(function () {
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('TC: 10590 - Login Failure', function () {
    cy.server();
    cy.route('POST', routes.authenticateAppUrl).as('authentication');

    cy.visit(Cypress.env('url'));

    //Scenario#1: Valid Username and invalid password
    cy.username().type(Cypress.env('USERNAME'));
    cy.findAllByText('Next').click();
    cy.password().type(example.invalidPassword);
    cy.submitButton().click();
    cy.wait('@authentication').should('have.property', 'status', 401);
    cy.findByRole('alert').should(
      'have.text',
      'Incorrect Username or Password'
    );
    cy.get('[aria-label="back"]').click();

    //Scenario#2: Invalid username and invalid password
    cy.username().clear().type(example.invalidUsername);
    cy.findAllByText('Next').click();
    cy.password().clear().type(example.invalidPassword);
    cy.submitButton().click();
    cy.wait('@authentication').should('have.property', 'status', 401);
    cy.findByRole('alert').should(
      'have.text',
      'Incorrect Username or Password'
    );
  });

  it('TC: 10591 - Login Success', function () {
    cy.login();
  });

  it('Add Product', function () {
    cy.server();
    cy.route('POST', routes.saveProductUrl).as('save&ExitProduct');
    cy.route('POST', routes.retrieveProductByDomainUrl).as('productRecords');



    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });
    cy.assetNav().click();
    cy.get('[href="/admin/product-manager"]').click();
    cy.wait('@productRecords').should('have.property', 'status', 200);
    cy.findByText('Product Manager', { timeout: 5000 }).should('exist');


    //Add product
    cy.findByText('Add Product', { timeout: 5000 }).click({ force: true });
    uniqueProductName2 = utilFunctions.suffixWithDate(example.productName2);
    cy.enterProductDetails(
      uniqueProductName2,
      example.gravity,
      example.SCM,
      example.productGroup,
      'Add Product'
    );

    cy.clickButton('Save & Close');
    cy.wait('@save&ExitProduct').should('have.property', 'status', 200);
  });

  it('Edit Product', function () {
    cy.searchField().clear();
    cy.clickButton('Apply', { timeout: 1000 });
    cy.clickOnRecordName(uniqueProductName2);
    editProductUniqueName2 = utilFunctions.suffixWithDate(example.editedName2);
    cy.enterProductDetails(
      editProductUniqueName2,
      example.editedSpecGravity,
      example.editedSCM,
      example.productGroup,
      'Edit Product'
    );

    cy.clickSaveOrExitButton('Save & Close', routes.retrieveProductByDomainUrl);
    cy.url().should('includes', '/admin/product-manager');

    cy.searchField().type(editProductUniqueName2);
    cy.clickButton('Apply');
    cy.recordName().each(($el) => {
      expect($el.text()).to.equal(editProductUniqueName2);
    });
  });

  it('Delete Product', function () {
    cy.searchField().clear();
    cy.applyButton().click();
    cy.deleteRecord(editProductUniqueName2);
    cy.clickOndeleteSelectedButton(routes.retrieveProductByDomainUrl);
  });

  it('Verify User is able to logout successfully', function () {
    cy.logout();
    cy.username().should('be.visible');
    cy.url().should('include', '/login');
  });
});
