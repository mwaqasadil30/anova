import '@testing-library/cypress/add-commands';
const routes = require('../../fixtures/routes.json');



Cypress.Commands.add('navigateToAssetDetailsAndToDataChannel', () => {
    const assetTitle = 'Analog Asset Bulk Strata Ltd.';

    cy.server().route('GET', routes.retrieveAssetDetailById).as('assetDetails');

    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({force: true});
    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(assetTitle+ '{enter}');

    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.findByRole('tab', { name: /Details/i }).should('exist');
    cy.findByRole('tab', { name: /Readings/i }).should('exist');
    cy.findByRole('tab', { name: /Map/i }).should('exist');

    cy.assetInfoHeaderPanel()
      .findAllByText('Asset Information')
      .should('be.visible');


    cy.verifyDCTimeStamp(2);

    cy.intercept('GET',routes.dataChannelEditor).as("editor")
    cy.get("[aria-label = 'Data channels layout']").eq(0).click();
    cy.get('[aria-label="Description"]').eq(1).click();
    cy.wait("@editor");
  });


  Cypress.Commands.add('generalInformationFields', () => {

    cy.findAllByText("General Information").should("be.visible");
    cy.findAllByText("Data Channel Description").should("be.visible");
    cy.findAllByText("Data Channel Template").should("be.visible");
    cy.findAllByText("Serial #").should("be.visible");
    cy.findAllByText("RTU ID").should("be.visible");
    cy.findAllByText("RTU Channel ID").should("be.visible");
    cy.findAllByText("Priority Level").should("be.visible");
    cy.findAllByText("Tank Type").should("be.visible");
    cy.findAllByText("Product").should("be.visible");

  })

  Cypress.Commands.add('sensorCalibrationFields', () => {

    cy.findAllByText("Tank and Sensor Configuration").should("be.visible");
    cy.findAllByText("Units Conversion Mode").should("be.visible");
    cy.findAllByText("Tank Type").should("be.visible");
    cy.findAllByText("Product").should("be.visible");
    cy.findAllByText("Scaling Mode").should("be.visible");
    cy.findAllByText("Max Product Capacity").should("be.visible");
    cy.findAllByText("Raw Min - Max").should("be.visible");
    cy.findAllByText("Invert Raw Data").should("be.visible");
    cy.findAllByText("Graph Min - Max").should("be.visible");
    cy.findAllByText("Sensor Position").should("be.visible");
    cy.findAllByText("Scaled Min - Max").should("be.visible");
    cy.findAllByText("Sensor Position").should("be.visible");

  })

  Cypress.Commands.add('returnGeneralInformation', () => {

    var serial_text = "1122334455";
    cy.get('[class = "MuiButton-label"]').eq(0).click();
    cy.get('[id = "serialNumber-input"]').type(serial_text);
    cy.findAllByText("Save & Close").click();

  })

  Cypress.Commands.add('totalizerDataChannelFields', () => {

    const TotalizerassetTitle = 'E1001939 - CO2 Tank - Totalizer Anova';

    cy.server().route('GET', routes.retrieveAssetDetailById).as('assetDetails');
    cy.login();
    cy.navigateToAppPicker('POST','Operations', routes.getAssetSummaryByOptionUrl);
    cy.waitProgressBarToDisappear();
    cy.assetSummaryIcon().click();
    cy.pageHeader().should('have.text', 'Asset Summary');
    cy.url().should('include', 'ops/asset-summary');
    
    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({force: true});
    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(TotalizerassetTitle+ '{enter}');

    cy.assetDescriptionCell().eq(1).click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.findByRole('tab', { name: /Details/i }).should('exist');
    cy.findByRole('tab', { name: /Readings/i }).should('exist');
    cy.findByRole('tab', { name: /Map/i }).should('exist');

    cy.assetInfoHeaderPanel()
      .findAllByText('Asset Information')
      .should('be.visible');


    cy.verifyDCTimeStamp(2);

    cy.intercept('GET',routes.dataChannelEditor).as("editor")
    cy.get("[aria-label = 'Data channels layout']").eq(0).click();
    cy.get('[aria-label="Description"]').eq(2).click();
    cy.wait("@editor");

    cy.findAllByText("General Information").should("be.visible");
    cy.findAllByText("Data Channel Description").should("be.visible");
    cy.findAllByText("Data Channel Template").should("be.visible");
    cy.findAllByText("Serial #").should("be.visible");
    cy.findAllByText("Data Channel Components").should("be.visible");
    cy.findAllByText("Tank Type").should("be.visible");
    cy.findAllByText("Product").should("be.visible");
      
  })

  Cypress.Commands.add('integrationProfileFieldsInformation', () => {

    cy.findAllByText("Integration Profile").should("be.visible");
    cy.findAllByText("Integration").should("be.visible");
    cy.findAllByText("Status").should("be.visible");
    cy.findAllByText("ID").should("be.visible");
    cy.findAllByText("Destination").should("be.visible"); 
    cy.findAllByText("Format Type").should("be.visible");

  })


  Cypress.Commands.add('verifyRTUs', () => {

    cy.get('[aria-label="back"]').click();
    cy.intercept('GET',routes.dataChannelEditor).as("editor")
    cy.get("[aria-label = 'Data channels layout']", { timeout: 10000 }).eq(0).click();
    cy.get('[aria-label="Description"]').eq(1).click();
    cy.wait("@editor");
    cy.get('[class = "MuiButton-label"]').eq(0).click();
    cy.get('[id = "rtuId-input"]')
    .click()
    .clear()
    .type("E10");

  cy.get('[aria-owns = "rtuId-input-popup"]')
    .should("be.visible");

  })

  Cypress.Commands.add('verifyTankSetupBasicFields', () => {
    cy.findAllByText("Cancel").click();
    cy.get('[class = "MuiButton-label"]').eq(1).click();
    cy.findAllByText("Units Conversion Mode").should("be.visible");
    cy.findAllByText("Raw Units").should("be.visible");
    cy.findAllByText("Raw Min").should("be.visible");
    cy.findAllByText("Raw Max").should("be.visible");
    cy.findAllByText("Cancel").click();
  })

  Cypress.Commands.add('verifyForecastAndDelieveryParametersFields', () => {

    cy.get('[class = "MuiButton-label"]').eq(3).click();
    cy.findAllByText("Forecast Mode").should("be.visible");
    cy.findAllByText("Show High/Low Forecast").should("be.visible");
    cy.findAllByText("Reforecast When Delivery Scheduled").should("be.visible");

  })