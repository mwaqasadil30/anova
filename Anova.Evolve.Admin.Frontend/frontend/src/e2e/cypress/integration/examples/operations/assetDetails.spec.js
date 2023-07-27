const routes = require('../../../fixtures/routes.json');
import UtilFunctions from '../../../support/utils/UtilFunctions';
const utilFunctions = new UtilFunctions();

describe('Asset Details Test suite', function () {

  beforeEach(function () {

    cy.viewport(1440, 900);
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('TC: 11685 - Set UP-1-As Single domain User .', { retries: 10 }, function () {
    cy.login();
  });

  it('TC: 11686 - Navigate to Operations app -Asset summary ', function () {

    cy.navigateToAppPicker('POST', 'Operations', routes.getAssetSummaryByOptionUrl);
    cy.waitProgressBarToDisappear();
    cy.assetSummaryIcon().click();
    cy.pageHeader().should('have.text', 'Asset Summary');
    cy.url().should('include', 'ops/asset-summary');
  });
  it('TC: 32168 - Data channel - Mapped - cannot generate scaling map when updating scaling parameters', function () {

    const assetTitle = 'Asset with Scaling options';

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
    cy.openLevelMAppedPrescaling()
    cy.openConfiguration(4, 20, 0, 300)
    cy.verifyScalingMap(4, 20, 0, 300)
    cy.wait(2000)
    cy.openLevelMAppedPrescaling()
    cy.openConfiguration(3, 19, 5, 500)
    cy.verifyScalingMap(3, 19, 5, 500)
    cy.wait(2000)
    cy.openLevelMAppedPrescaling()
    cy.rawValuesOnReport()
    cy.scaleValuesOnReport()

  })

  it('UC: 30223 - Problem Report - Front End - Open Manual Problem report', function () {
    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    cy.waitProgressBarToDisappear();
    cy.CreateProblemReportdoesnotappear();
  });

  it('A.D-Asset Information ', function () {

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


    cy.verifyDCTimeStamp(2);


  });

  it('Verify latest time under Readings tab with DC Card', function () {

    cy.verifyNewReadingTimeWithDataChannelCard(2);

  });

  it('Verify latest time for missing data events', function () {
    cy.verifyPageUrl('GET', routes.opsEventsUrl, routes.retrieveActiveEventByOptionsUrl);
    cy.server();
    cy.route('POST', routes.getAssetSummaryByOptionUrl).as('records');
    cy.clearNavItemIfVisible();
    cy.wait(1000);
    cy.viewDropdown().should('have.text', 'Active');
    cy.selectDropdownIfNotSelected('[id="eventTypes-input"]', 'All', 'GET', routes.retrieveActiveEventByOptionsUrl)
    cy.eventTypesDropdown().should('have.text', 'All').click({ force: true });
    cy.get('[role="listbox"]').findAllByText('Deselect All').click();
    cy.selectEventsCheckBox('Missing Data');
    cy.closeDropdown();
    cy.wait('@records').should('have.property', 'status', 200);

    cy.verifyTimeForMissingDataEvent();

  });

  it('Verify latest time for Level events', function () {

    cy.server();
    cy.route('GET', routes.retrieveActiveEventByOptionsUrl).as('records');
    // cy.executeRTUReading(280)
    cy.verifyPageUrl('GET', routes.opsEventsUrl, routes.retrieveActiveEventByOptionsUrl);
    cy.eventView().click();
    cy.wait(1000)
    cy.levelDropdown('Active');
    cy.viewDropdown().should('have.text', 'Active');
    cy.wait(2000)
    cy.eventTypesDropdown().click();
    cy.selectDropdownIfNotSelected('[id="eventTypes-input"]', 'All', 'GET', routes.retrieveActiveEventByOptionsUrl);
    cy.wait(3000);
    cy.get('[id="eventTypes-input"]').should('have.text', 'All').click({ force: true });
    cy.get('[role="listbox"]').findAllByText('Deselect All').click();
    cy.selectEventsCheckBox('Level');
    cy.closeDropdown();
    cy.wait('@records').should('have.property', 'status', 200);
    cy.verifyActiveTimeForLevelEvent(2);
  });

  it.skip('Deactivate and check in Inactive events', function () {
    // cy.executeRTUReading(320);
    cy.verifyPageUrl('GET', routes.opsEventsUrl, routes.retrieveActiveEventByOptionsUrl);
    cy.verifyLatestTimeForInactiveEvents(2);
  })

  it('Verify Asset Information details from API and maps details tab', function () {
    const assetTitle = 'E1001939 - CO2 Tank - Totalizer Anova';

    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');

    cy.waitProgressBarToDisappear();
    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({ force: true });
    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');
    cy.enterName(assetTitle + '{enter}');

    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.verifyAssetInformationDetails();
    cy.assetInformationContent().should('be.hidden')

    cy.assetInformationPanel()
      .should('have.text', 'Asset Information')
      .click({ force: true });
    cy.getDataChannelCardDetails();
    cy.findByRole('tab', { name: /Map/i }).click({ force: true })
    cy.verifyMapsAssetDetailsPanelRecords()

    cy.findAllByText('Asset Details').click({ force: true })
    cy.assetDetailsPanelHeader().should('have.text', 'Asset Details').and('exist');
  })

  it('Verify data channel table from API', function () {

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');

    cy.findByRole('tab', { name: /Details/i }).click({ force: true })
    cy.dataChannelTable().should('exist')

    cy.findAllByText('Refresh').click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);
    cy.verifyDataChannelTableFromAPI();
  })

  it('Verify Events and rtu from API', function () {
    var count = 0;
    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');

    cy.wait(2000);
    cy.findAllByText('Refresh').click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);
    cy.verifyRTUPanelDetails();
    cy.eventsDescription().each(($el) => {
      if (count < 1) {
        cy.verifyEventsPanelDetails($el.text());
        count++;
      }
    })
    // cy.emptyEventDescription();

    cy.goBack('POST', routes.getAssetSummaryByOptionUrl);
  })

  it(`Verify collapse functionality should work on Asset Details Screen || 
      Verify user is able to change and modify site on asset details view || Verify Remove setpoint column on Report if DC is not Master`, function () {

    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    const assetTitle = 'Analog Asset Bulk Strata Ltd.';

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');
    cy.route('GET', routes.getReadingsByDataChannelId).as('dcReadings');
    cy.route('POST', routes.retrieveSiteByIdUrl).as('assetSiteWait');
    cy.route('POST', routes.saveSiteUrl).as('saveSite');


    cy.waitProgressBarToDisappear();
    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({ force: true });
    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(assetTitle + '{enter}');
    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.findByRole('tab', { name: /Details/i }).click();
    cy.rtuPanelContent().click();
    cy.verifyCollapseFunctionality('Events & Delivery', 'Asset Information');
    cy.linkedToSetpoints();
    cy.backToAssetDetail()
    cy.notLinkedToSetpoints()
    cy.backToAssetDetail()
    cy.goBack('POST', routes.getAssetSummaryByOptionUrl);

  })

  it('Readings Tab: Verify user is able to check/un-check the Data Channel Card and column headers should reflect accordingly', function () {

    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    const assetTitle = 'E1001939 - CO2 Tank - Totalizer Anova';

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');
    cy.route('GET', routes.getReadingsByDataChannelId).as('dcReadings');
    cy.waitProgressBarToDisappear();
    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({ force: true });
    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(assetTitle + '{enter}');
    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);
    cy.findByRole('tab', { name: /Readings/i }).click();
    cy.verifyCheckAndUnCheckDataChannels();
  })

  it('Verify latest time for Published Data Channel', function () {

    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    const assetTitle = 'Test Published DC from dolv3qa Anova';

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');

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

    //Time should be within 24 hrs
    cy.verifyDCTimeStamp(24);
    cy.verifyReadingTimeWithDataChannelCard(24);


  });

  //skipping it because there is no published asset present for qa@testautomation user. Will ask hendrik to add that
  //and will then change the status of this test case
  it.skip('Verify latest time and Quick Edit Events(Disabled) for Published Asset', function () {

    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    const assetTitle = 'Tank - Published Asset from dolv3qa to Testautomation Dataonline';

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');

    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({ force: true });
    cy.filterByDropdown().click();
    cy.verifyFilterByDropdownFields();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');
    cy.wait(2000);
    cy.enterName(assetTitle + '{enter}');
    cy.wait(2000);
    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.findByRole('tab', { name: /Details/i }).should('exist');
    cy.findByRole('tab', { name: /Readings/i }).should('exist');
    cy.findByRole('tab', { name: /Map/i }).should('exist');

    //Verify the Edit Event Rules should be disabled for a published asset by default
    cy.verifyQuickEditEventDisabledFunctionality();

    //Verify asset and site notes should be hidden and should not update
    cy.assetInfoHeaderPanel().findAllByText('Asset Information').should('be.visible');
    cy.verifySiteAndAssetNotesHiddenFunctionality();

    //Time should be within 24 hrs
    cy.verifyDCTimeStamp(24);
    cy.verifyReadingTimeWithDataChannelCard(24);

    cy.goBack('POST', routes.getAssetSummaryByOptionUrl)


  });

  it('Display Active Data Channel Events', function () {
    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    const assetTitle = 'Helium ISO container Anova';

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');
    cy.route('GET', routes.retrieveActiveEventByOptionsUrl).as('eventRecs');
    cy.route('POST', routes.activeEventByEventTypeUrl).as('activeEvents');

    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({ force: true });
    cy.filterByDropdown().click();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(assetTitle + '{enter}');
    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.findByRole('tab', { name: /Events/i })
      .should('exist')
      .click({ force: true })
    cy.wait('@activeEvents').should('have.property', 'status', 200);

    cy.verifyActiveOrInactiveEventsFromAPI('@activeEvents', 1)
    cy.getEventsFields(1);
    cy.eventIcon().click();
    cy.wait('@eventRecs').should('have.property', 'status', 200);
    cy.verifyFieldsFromEventsScreen(assetTitle);
    cy.assetSummaryIcon().click();
  });

  it('Display Inactive Data Channel Events', function () {


    cy.navigateToAppPicker('POST', 'Operations', routes.getAssetSummaryByOptionUrl);
    cy.waitProgressBarToDisappear();

    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    const assetTitle = 'E1001939 - CO2 Tank - Totalizer Anova';

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');
    cy.route('POST', routes.retrieveInactiveEventByOptionsUrl).as('eventRecs');
    cy.route('GET', routes.retrieveActiveEventByOptionsUrl).as('activeEventWait');
    cy.route('POST', routes.activeEventByEventTypeUrl).as('activeEvents');
    cy.route('POST', routes.inactiveEventByEventTypeUrl).as('inactiveEvents');

    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({ force: true });
    cy.wait(2000);
    cy.filterByDropdown().click();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(assetTitle + '{enter}');
    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.findByRole('tab', { name: /Events/i })
      .should('exist')
      .click({ force: true })
    cy.wait('@activeEvents').should('have.property', 'status', 200);
    cy.selectDesiredDropdownIfNotSelected('[id="eventTypes-input"]', 'All')

    cy.get('[type="checkbox"]').eq(1).click()
    cy.wait(2000)
    cy.get('[id = "view-input"]').click();
    cy.findAllByText('Inactive').click();
    cy.wait('@inactiveEvents').should('have.property', 'status', 200);

    cy.verifyInactiveEventsCountFromAPI()
    cy.verifyActiveOrInactiveEventsFromAPI('@inactiveEvents', 1)
    cy.getEventsFields(1);
    cy.eventIcon().click();
    cy.wait('@activeEventWait').should('have.property', 'status', 200);
    cy.get('[id = "view-input"]').click();
    cy.findAllByText('Inactive').click();

    cy.wait('@eventRecs').should('have.property', 'status', 200);
    cy.verifyFieldsFromEventsScreen(assetTitle);
  });

  //covered this test case in API testing so skipping it FOR UI to minimize time for CI Build
  it.skip('Quick Edit Event Rules - Edit and verify level and Inventory events rules', function () {

    cy.navigateToAppPicker('POST', 'Operations', routes.getAssetSummaryByOptionUrl);
    cy.waitProgressBarToDisappear();

    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    const assetTitle = 'Analog Asset Bulk Strata Ltd.';

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');
    cy.route('GET', routes.quickEditEvents).as('retrieveQuickEvents');

    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({ force: true });
    cy.wait(2000);
    cy.filterByDropdown().click();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(assetTitle + '{enter}');
    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.get('[id="events-panel-header"] button').click();
    cy.wait(2000);
    cy.wait('@retrieveQuickEvents').should('have.property', 'status', 200);

    //Verify updated inventory and level event rules on Asset Details screen
    cy.enterAndVerifyEventRules();

  });

  //Skipped because of the defect found by Steven, will enable it once that defect will get resolved.
  it.skip('Quick Edit Event Rules - Display and edit integration ID', function () {

    cy.goToQuickEditEventsPanel();
    cy.enterAndVerifyIntegrationID();

  });

  it('Events - Rosters  -  Add', function () {

    cy.verifyPageUrl('POST',
      routes.assetSummaryUrl,
      routes.getAssetSummaryByOptionUrl
    );

    const assetTitle = 'Analog Asset Bulk Strata Ltd.';

    cy.server();
    cy.route('GET', routes.retrieveAssetDetailById).as('assetDetails');
    cy.route('GET', routes.quickEditEvents).as('retrieveQuickEvents');
    cy.route('GET', routes.addRosters).as('addRosters');
    cy.route('POST', routes.dataChannelEventRule).as('dataChannelEventRule');

    cy.clearNavItemIfVisible();
    cy.findAllByText('Show Filters').click({ force: true });
    cy.wait(2000);
    cy.filterByDropdown().click();
    cy.selectDropdown('Asset Title');
    cy.filterByDropdown().should('have.text', 'Asset Title');

    cy.enterName(assetTitle + '{enter}');
    cy.assetDescriptionCell().first().click({ force: true });
    cy.wait('@assetDetails').should('have.property', 'status', 200);

    cy.get('[id="events-panel-header"] button').click();
    cy.wait('@retrieveQuickEvents').should('have.property', 'status', 200);

    cy.editnewRosters().click({ force: true });
    cy.wait('@addRosters').should('have.property', 'status', 200);
    cy.checkForAvailableRosters();

    cy.findAllByText('Add Roster').click();
    cy.addRosters();
    cy.findAllByText('Save & Close').eq(1).click();
    cy.wait('@dataChannelEventRule').should('have.property', 'status', 200);

  });

  it('Events - Rosters  -  Edit', function () {

    cy.server();
    cy.route('GET', routes.addRosters).as('addRosters');
    cy.route('POST', routes.dataChannelEventRule).as('dataChannelEventRule');

    cy.editnewRosters().click({ force: true });
    cy.wait('@addRosters').should('have.property', 'status', 200);
    cy.editRosters();
    cy.findAllByText('Save & Close').eq(1).click();
    cy.wait('@dataChannelEventRule').should('have.property', 'status', 200);

  });

  it('Events - Rosters  -  Delete', function () {

    cy.server();
    cy.route('POST', routes.dataChannelEventRule).as('dataChannelEventRule');

    cy.editnewRosters().click({ force: true });
    cy.wait(3000);

    cy.deleteRosters();
    cy.findAllByText('Save & Close').eq(1).click();
    cy.wait('@dataChannelEventRule').should('have.property', 'status', 204);

  });

  it('US: 24800 CSV Download - Reading Times Not Converting to Time Zone in extract', () => {
    cy.get('#custom_transcend_logo_id').click({ force: true })
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
    cy.CSVDownloadReadingNorthAmerica();
    cy.CSVDownloadReadingEurope();
    cy.CSVDownloadForecastReadingNorthAmerica();
    cy.CSVDownloadForecastReadingEurope();
  })
}); 
