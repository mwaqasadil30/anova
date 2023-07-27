const routes = require('../../../fixtures/routes.json');
let serial_number = 112233;
describe('Data Channel Editor & General Editor Toast Notifications Test suite', function () {


  beforeEach(function () {

    cy.viewport(1440, 900);
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it(' Set UP-1-As Single domain User .', { retries: 10 }, function () {
    cy.login();
  });

  it(' Navigate to Operations app -Asset summary ', function () {

    cy.navigateToAppPicker('POST', 'Operations', routes.getAssetSummaryByOptionUrl);
    cy.waitProgressBarToDisappear();
    cy.assetSummaryIcon().click();
    cy.pageHeader().should('have.text', 'Asset Summary');
    cy.url().should('include', 'ops/asset-summary');
  });

  it('Navigate to asset ', function () {

    const assetTitle = 'Analog Asset Bulk Strata Ltd.';

    cy.server().route('GET', routes.retrieveAssetDetailById).as('assetDetails');

    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({ force: true });
    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(assetTitle + '{enter}');

    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.findByRole('tab', { name: /Details/i }).should('exist');
    cy.findByRole('tab', { name: /Readings/i }).should('exist');
    cy.findByRole('tab', { name: /Map/i }).should('exist');

    cy.assetInfoHeaderPanel()
      .findAllByText('Asset Information')
      .should('be.visible');

  });

  it(' Select a Data Channel ', function () {
    cy.intercept('GET', routes.dataChannelEditor).as("dataChannelEditor");
    cy.get('[aria-label="Description"]').eq(1).click();
    cy.wait('@dataChannelEditor');
  });

  it(' Data Channel Editor - General Information - Change Serial Number ', function () {
    cy.intercept('GET', routes.generalInfoDCEditor).as("generalInfo");
    cy.intercept('GET', routes.dataChannelEditor).as("dataChannelEditor");
    cy.get('[class = "MuiButton-label"]').eq(0).click();
    cy.wait("@generalInfo");
    cy.get('[id = "serialNumber-input"]').clear().type(serial_number);
    cy.findAllByText('Save & Close').click();
    cy.wait('@dataChannelEditor');
  });

  it(' Data Channel Editor - Verify toast Notification ', function () {
    cy.get('[id="notistack-snackbar"]').should("be.visible").contains('Changes saved successfully');
  });

  it(' Data Channel Editor - General Information - Verify Updated Serial Number ', function () {
    cy.findAllByText(serial_number).should("be.visible");
  });

  it(' Data Channel Editor - Verify the Change to User Name for Created By and Create date/Time and Last By and last updated date/time ', function () {
    cy.contains('Last Updated').should("be.visible");
    cy.contains('qa@TestAutomation').should("be.visible");
  });

  it(' Data Channel Editor - Show a dash if field is null ', function () {
    cy.intercept('GET', routes.generalInfoDCEditor).as("generalInfo");
    cy.intercept('GET', routes.dataChannelEditor).as("dataChannelEditor");
    cy.get('[class = "MuiButton-label"]').eq(0).click();
    cy.wait("@generalInfo");
    cy.get('[id = "serialNumber-input"]').clear();
    cy.findAllByText('Save & Close').click();
    cy.wait('@dataChannelEditor');
    cy.get('[role="region"]').eq(0).contains("-");
  });

  it('Pressure Type Data Channels - Report - Sensor Configuration Panel  ', function () {
    cy.intercept('GET', '/Asset/Detail/*').as('assetDetails')
    cy.get('.MuiSvgIcon-root').click();
    cy.wait('@assetDetails');
  });



});  