import '@testing-library/cypress/add-commands';
const routes = require('../../../fixtures/routes.json');

Cypress.Commands.add('productName', () => {
  cy.get('[id="name-input"]', { timeout: 5000 });
});

Cypress.Commands.add('productDescription', () => {
  cy.get('[id="description-input"]');
});

Cypress.Commands.add('specificGravity', () => {
  cy.get('[id="specificGravity-input"]');
});

Cypress.Commands.add('productGroup', () => {
  cy.get('[id="productGroup-input"]');
});

Cypress.Commands.add('inputSCM', () => {
  cy.get('[id="standardVolumePerCubicMeter-input"]');
});

Cypress.Commands.add('productDisplayUnits', () => {
  cy.get('[id="displayUnit-input"]');
});

Cypress.Commands.add('specificGravityErrorText', () => {
  cy.get("[id='specificGravity-input-helper-text']", { timeout: 5000 });
});

Cypress.Commands.add('productNameErrorText', () => {
  cy.get('[id="name-input-helper-text"]', { timeout: 5000 });
});

Cypress.Commands.add('inputSCMErrorText', () => {
  cy.get("[id='standardVolumePerCubicMeter-input-helper-text']", {
    timeout: 5000,
  });
});

Cypress.Commands.add('verifyProductCountFromAPI', () => {
  //Count of product items from API response
  cy.get('@productRecords').then((xhr) => {
    cy.get('tbody[role="rowgroup"] tr')
      .its('length')
      .then((table) => {
        expect(table).to.be.equal(
          xhr.response.body.retrieveProductRecordsByDomainResult.length
        );
      });
  });
});

Cypress.Commands.add('clickSaveOrExitButton', (btn, url) => {
  cy.server();
  cy.route('POST', url).as('saveRecords');

  cy.wait(1000);
  cy.get('span')
    .contains(btn)
    .should('be.visible')
    .trigger('mouseover')
    .click({ force: true });

  cy.wait('@saveRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('verifyAllProductFieldsAreClear', () => {
  cy.productName().should('have.value', '');
  cy.specificGravity().should('have.value', '');
  cy.productDescription().should('have.value', '');
  cy.inputSCM().should('have.value', '');
  cy.productGroup().should('have.value', '');
  cy.productDisplayUnits().should('have.value', '');
});

Cypress.Commands.add(
  'enterProductDetails',
  (name, gravity, SCM, productGroup, headerText) => {
    cy.findByText(headerText, { timeout: 10000 }).should('exist');

    cy.productName()
      .clear()
      .type(name)
      .should('be.visible')
      .and('have.attr', 'type', 'text');

    cy.specificGravity()
      .clear()
      .type(gravity)
      .should('be.visible')
      .and('have.attr', 'type', 'number');

    cy.productDescription()
      .clear()
      .type(name)
      .should('be.visible')
      .and('have.attr', 'type', 'text');

    cy.inputSCM()
      .clear()
      .type(SCM)
      .should('be.visible')
      .and('have.attr', 'type', 'number');

    cy.productGroup().clear().should('be.visible').type(productGroup);

    cy.productDisplayUnits().should('be.visible').click();

    cy.get('[data-value="40"]').click();
  }
);

Cypress.Commands.add('verifyValidationError', (name, buttonType) => {
  cy.server();
  cy.route('POST', routes.retrieveProductEditUrl).as('productScreen');
  cy.route('POST', routes.retrieveProductByDomainUrl).as('productRecords');

  cy.findByText('Add Product').click({ force: true });
  cy.wait('@productScreen').should('have.property', 'status', 200);

  //Check Null validation
  cy.productName().as('productName');
  cy.wait(1000);
  cy.clickButton(buttonType);

  //validation error
  cy.productNameErrorText().should('have.text', 'Product Name is required.');

  //Product already exist validation
  cy.get('@productName').type(name);

  cy.clickButton(buttonType);

  cy.productNameErrorText().should('have.text', 'Product already exists.');

  cy.go('back');
  cy.wait('@productRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('verifyAddProductFieldsErrorTexts', (gravity, scm) => {
  //Gravity validation error
  cy.specificGravity()
    .type(gravity)
    .should('be.visible')
    .and('have.attr', 'type', 'number');

  //SCM validation error
  cy.inputSCM()
    .type(scm)
    .should('be.visible')
    .and('have.attr', 'type', 'number');

  cy.clickButton('Save');

  //Error message validation
  cy.specificGravityErrorText().should(
    'have.text',
    'Specific Gravity must be between 0 and 9999.'
  );

  cy.inputSCMErrorText().should(
    'have.text',
    'SCM/M3 must be between 0 and 999999.'
  );
});

Cypress.Commands.add('deleteProductBy3dotsMenu', (productName) => {
  cy.server();
  cy.route('POST', routes.deleteProductUrl).as('deleteProduct');
  cy.recordName().each(($el, index) => {
    const name = $el.text();

    if (name === productName) {
      cy.get('[aria-label="Actions button"]').eq(index).click({
        force: true,
      });
      cy.findAllByText('Delete').eq(index).should('be.visible').click({
        force: true,
      });
      cy.wait('@deleteProduct').should('have.property', 'status', 200);
    }
  });
});


Cypress.Commands.add('deleteProductRecord', (recordName) => {
  cy.recordName().each(($el, index) => {
    const name = $el.text();

    if (name === recordName) {
      cy.get('input[type="checkbox"]')
        .eq(index + 1)
        .click({
          force: true,
        });
    }
  });
});
