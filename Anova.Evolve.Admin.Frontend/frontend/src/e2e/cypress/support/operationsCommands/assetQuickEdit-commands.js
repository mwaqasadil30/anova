const routes = require('../../fixtures/routes.json');

Cypress.Commands.add('navToAssetSummaryPage', () => {

  cy.navigateToAppPicker('POST', 'Operations', routes.getAssetSummaryByOptionUrl);
  cy.waitProgressBarToDisappear();
  cy.assetSummaryIcon().click();
  cy.pageHeader().should('have.text', 'Asset Summary');
  cy.url().should('include', 'ops/asset-summary');

})

Cypress.Commands.add('navToAssetAnalogStrata', (assetTitle) => {


  cy.server().route('GET', routes.retrieveAssetDetailById).as('assetDetails');
  cy.server().route('POST', routes.getAssetSummaryByOptionUrl).as('recordAssetWait');

  cy.clearNavItemIfVisible();
  cy.findAllByText('Show Filters').click({ force: true });
  cy.filterByDropdown().click();
  cy.verifyFilterByDropdownFields();
  cy.selectDropdown('Asset Title');
  cy.filterByDropdown().should('have.text', 'Asset Title');

  cy.searchField().clear().type(assetTitle);
  cy.get('[class="MuiButton-label"]')
    .contains('Apply')
    .click();
  cy.wait('@recordAssetWait').should('have.property', 'status', 200);


  cy.assetDescriptionCell().first().click({ force: true });
  cy.wait('@assetDetails').should('have.property', 'status', 200);

  cy.findByRole('tab', { name: /Details/i }).should('exist');
  cy.findByRole('tab', { name: /Readings/i }).should('exist');
  cy.findByRole('tab', { name: /Map/i }).should('exist');
  cy.findByRole('tab', { name: /Events/i }).should('exist');
  cy.findByRole('tab', { name: /Forecast/i }).should('exist');

});

Cypress.Commands.add('clickOnPencilForEditAI', () => {

  cy.server().route('POST', routes.retrieveSiteRecordsOptionsUrl).as('loadAssetInfoEditor')
  cy.get('[class= "MuiAccordionSummary-content"]')
    .find('div[class="MuiGrid-root MuiGrid-item"]')
    .eq(3)
    .click()
  cy.wait('@loadAssetInfoEditor').should('have.property', 'status', 200)
})

Cypress.Commands.add('checkWorkingInst', () => {

  cy.get('[title = "Working Instructions"]')
    .should('not.exist');
})

Cypress.Commands.add('saveAssetInfo', () => {

  cy.intercept('POST', routes.saveEditAssetDetails).as('saveClose')//.get('[type="button"]')
  cy.contains('Save & Close', { timeout: 30000 })
    .click()
  cy.wait('@saveClose').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('changeTheDomainToAp', (searchAsset, enterData, enterUrl) => {

  cy.intercept('GET', 'https://api-test.transcend.anova.com/User/accessibledomains').as('waitForAccessDom');
  cy.intercept('GET', routes.acessibleDomains).as('records');

  cy.TestAutomationAPDomain()
  cy.get('[style="min-width: 160px;"] > .MuiInputBase-root > .MuiSelect-root').click()
  cy.get('[data-value="0"]').should('have.text', 'Asset Title').click()
  cy.get('#filterText-input').clear().type(searchAsset)
  cy.get('[class="MuiButton-label"]')
    .contains('Apply')
    .click();

  cy.get('[aria-label="Domain Name"]').eq(1).click();

  cy.get('[title = "Working Instructions"]', { timeout: 30000 })
    .should('be.visible');

  cy.get('[id="panel1a-header"]')
    .find('[class="MuiGrid-root MuiGrid-item"]')
    .find('button')
    .eq(1)
    .should('be.visible')
    .click()

  cy.get('#referenceDocumentUrl-input').clear()
  cy.contains('Save & Close')
    .click()



  cy.get('[id="panel1a-header"]')
    .find('[class="MuiGrid-root MuiGrid-item"]')
    .find('button')
    .eq(1)
    .should('be.visible')
    .click()
  cy.get('#referenceDocumentUrl-input').clear().click().type(enterData)

  cy.intercept('POST', routes.saveEditAssetDetails).as('saveClose')
  cy.contains('Save & Close')
    .click()
  cy.wait('@saveClose').its('response.statusCode').should('eq', 400)
  cy.contains('* Invalid Url.')

  cy.get('#referenceDocumentUrl-input').clear().click().type(enterUrl)
  cy.intercept('POST', routes.saveEditAssetDetails).as('saveClose')
  cy.contains('Save & Close')
    .click()
  cy.wait('@saveClose').its('response.statusCode').should('eq', 200)
  cy.contains('Changes saved successfully')
  cy.get('[rel="noopener noreferrer"]').invoke('removeAttr', 'target').click()
  cy.url().should('eq', enterUrl)
})