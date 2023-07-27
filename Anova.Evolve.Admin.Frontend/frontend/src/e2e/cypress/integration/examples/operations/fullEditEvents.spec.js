const routes = require('../../../fixtures/routes.json');
describe('Full Edit Events Test suite', function () {


    beforeEach(function () {
      
      cy.viewport(1440, 900);
      // Preserve only the session cookie in every test
      Cypress.Cookies.defaults({
        preserve: (cookie) => {
          return cookie && cookie.name === '.AspNetCore.Session';
        },
      });
    });
  
    it(' Set UP-1-As Single domain User .',{retries : 10}, function () {
      cy.login();
    });
  
    it(' Navigate to Operations app -Asset summary ', function () {
     
      cy.navigateToAppPicker('POST','Operations', routes.getAssetSummaryByOptionUrl);
      cy.waitProgressBarToDisappear();
      cy.assetSummaryIcon().click();
      cy.pageHeader().should('have.text', 'Asset Summary');
      cy.url().should('include', 'ops/asset-summary');
    });
  
    it('Navigate to asset ', function () {
  
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

    });

    it(' Select a Data Channel ', function () {
        cy.intercept('GET',routes.dataChannelEditor).as("dataChannelEditor");
        cy.get('[aria-label="Description"]').eq(1).click();
        cy.wait('@dataChannelEditor');
    });

    it(' Full Edit Event -Non API Site - Verify the Column names on data channel editor for Events ', function () {
        cy.verifyTableColumnsEvents();
    });

    it(' Full Edit Event -Non API Site - Verify the Column names on data channel editor for ScheduleDelivery ', function () {
        cy.verifyTableColumnsScheduleDelivery();
    });

    it(' Full Edit Event -Non API Site - Navigate to Event Editor ', function () {
        cy.navigateToEventEditor();
    });

    it(' Edit Data Channel Events -Non API Site - Change value of Level Events ', function () {
        cy.changeValuesOfLevelEvents();
    });

    it(' Edit Data Channel Events -Non API Site - Assign Set Points ', function () {
        cy.changeValuesOfSetPoints();
    });

    it(' Edit Data Channel Events -Non API Site - Assign Hysteresis ', function () {
        cy.changeValuesOfhysteresisEvents();
    });

    it(' Edit Data Channel Events -Non API Site - Enable Usage Rate Event ', function () {
        cy.enableUsageRateEvent();
    });

    it(' Edit Data Channel Events -Non API Site - Enable Schedule Delivary Event ', function () {
        cy.enableScheduleDeliveryEventAndAssignImportance();
    });

    it(' Edit Data Channel Events -Non API Site - Check Disabled Fields Cannot Be Edited ', function () {
        cy.checkDisableFieldsCannotBeEdited();
    });

    it(' Edit Data Channel Events -Non API Site -Add Roster To Event Rule ', function () {
        cy.addRosterToLevelEvent();
    });

    it(' Full Edit Event -Non API Site - Verify Values of Level Events ', function () {
        cy.verifyValueOfLevelEvents();
    });

    it(' Full Edit Event -Non API Site - Verify Values of Level Events ', function () {
        cy.verifyValueOfSetPointsOfLevelEvents();
    });   

});    