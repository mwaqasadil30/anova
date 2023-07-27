


Cypress.Commands.add('domainDropdown', () => {
    cy.get('[id="domain-dropdown-button"]')
})

Cypress.Commands.add('clickOnSites', () => {
    cy.get('[href="/admin/site-manager"]').click();
})

Cypress.Commands.add('clickOnDropDown', () => {
    cy.get("[aria-labelledby = 'filterColumn-input']").click();
})

Cypress.Commands.add('searchInputField', () => {
    cy.get("[id='filterText-input']");
})

Cypress.Commands.add('switchToFitzgibbon', () => {
    cy.intercept('POST', '/GetAssetSummaryRecordsByOptions').as("domainSwitch");
    cy.domainDropdown().type("FITZGIBBON" + '{enter}');
    cy.wait('@domainSwitch');
});

Cypress.Commands.add('goToSitesManager', () => {
    cy.intercept('POST', '/RetrieveSiteInfoRecordsByOptions').as("siteManager");
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
        force: true,
    });
    cy.findAllByText('Asset Configuration Manager').should('be.visible');
    cy.clickOnSites();
    cy.wait('@siteManager');
});

Cypress.Commands.add('checkAddNewSiteOption', () => {
    cy.get("body").then($body => {
        if ($body.find("[href='/admin/site-manager/create']").length == 0) {
            cy.log("No 'ADD SITE' button found")
        }
    });
})

Cypress.Commands.add('checkSiteNumberFilter', () => {
    cy.clickOnDropDown()
    cy.findAllByText("Site Number").should("be.visible");
})

Cypress.Commands.add('applySiteNumberFilter', () => {
    cy.intercept('POST', '/RetrieveSiteInfoRecordsByOptions').as("searchResults");
    cy.intercept('POST', '/RetrieveSiteLocationInfoAutoCompleteListByOptions').as("siteEdit")
    var siteNumber = '123456';
    cy.get("[aria-selected = 'true']").contains("Site Number").click({ force: true });
    cy.searchInputField().type(siteNumber + '{enter}');
    cy.wait('@searchResults');
    cy.get("[aria-label='Site number']").eq(1).should('have.text', siteNumber).click();
    cy.wait('@siteEdit');
})







