/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
import '@testing-library/cypress/add-commands';
const utilFunctions = new UtilFunctions();
let heliumISOCDesc1, heliumISOCDesc2, heliumISOCDesc3, heliumISOCDesc4;
let domain = 'dolv3qa';
let RTUColumn = "[aria-label='data channels table'] tr td:nth-child(3)";
let displayPriorityCellsLocator =
  '[data-rbd-droppable-id="domainHeliumIsoContainer.dataChannelsDisplayPriority-input"] div';
let intParametersDCLocator =
  '[aria-label="Data Channels & Integration Parameters table"] tr td:nth-child(1)';
let rtuid = null;
let rtuid_sec = 'E1002BAB';

describe('Helium ISO Container test suite', function () {
  beforeEach(function () {
    cy.fixture('example').then(function (data) {
      this.data = data;
    });
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  const URL = Cypress.config('baseUrl')
  var environment = URL.match("https://(.*).transcend");
  switch (environment[1]) {
    case 'test':
      rtuid = 'E10070BE';
      break;
    case 'staging':
      rtuid = 'E10070BE';
      break;
  }
  it('TC: 10089 - Set UP-As single domain user ',{retries : 10}, function () {
    cy.login();
  });

  it('Check for the asset having RTU = E10070BE and delete that assest' , function() {

    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });

    cy.findAllByText('Asset Configuration Manager').should('be.visible');
    cy.url().should('include', 'admin/asset-configuration-manager');
    cy.wait(1000);

    cy.filterFortheRTU(rtuid);
    cy.filterFortheRTU(rtuid_sec);
    
    cy.findByText('Apply').click();
    cy.wait(1000);


  })

  it('TC:10091 - HISOC-Quick Add-Helium and Nitrogen levels integration enabled(manual)-Site default-with Rate of change DC-complex Event Rule enabled at domain-with design curve -Save-Create new HISO Asset-Exit', function () {
    let heliumLevelId = 'HL_' + utilFunctions.randomString();
    let heliumPressureId = 'HP_' + utilFunctions.randomString();
    let nitroLevelId = 'NL_' + utilFunctions.randomString();
    let nitroPressureId = 'NP_' + utilFunctions.randomString();

    let heliumLevelId2 = 'HL2_' + utilFunctions.randomString();
    let heliumPressureId2 = 'HP2_' + utilFunctions.randomString();
    let nitroLevelId2 = 'NL2_' + utilFunctions.randomString();
    let nitroPressureId2 = 'NP2_' + utilFunctions.randomString();
    let rtuId1 = rtuid;
    let rtuId2 = 'E1002BAB';
    let assetIntId = 'xyz101' + utilFunctions.randomString();
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.intercept('POST',routes.retrieveQuickAssetCreateHISOContainer).as('retrieveQuickAsset');
    cy.intercept('POST',routes.retrieveHISORtuByPrefix).as('retrieveHISORtu');
    cy.waitProgressBarToDisappear()
    utilFunctions.itemsCountPaginationBefore();
    cy.findAllByText('Quick Add').click({ force: true });
    cy.findAllByText('Tank').should('be.visible');
    cy.get('[role="menuitem"]').siblings().contains('Helium ISO Container').click({ force: true });
    cy.wait('@retrieveQuickAsset').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.wait('@retrieveHISORtu').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.waitProgressBarToDisappear();
    cy.findAllByText('Add Helium ISO Container Asset').should('be.visible');

    heliumISOCDesc1 = utilFunctions.suffixWithDate(
      this.data.heliumISODesc + ' 1_'
    );

    cy.enterHeliumISOContainerAssetDetails(
      heliumISOCDesc1,
      'None',
      'Badar test site',
      rtuId1,
      '1.2',
      'South',
      'xyz101' + utilFunctions.randomString(),
      'dolv3qa',
      heliumLevelId,
      heliumPressureId,
      nitroLevelId,
      nitroPressureId,
      'notes added'
    );

    cy.clickAddButton('Save', routes.saveQuickAssetHISOContainer);
    cy.verifyHeliumAssetContainerCreateTexts(
      'New Helium ISO Container Asset Created',
      heliumISOCDesc1,
      'None',
      'Badar test site OAKVILLE ON',
      rtuId1,
      'South',
      '1.2',
      'true',
      'notes added',
      heliumLevelId,
      heliumPressureId,
      nitroLevelId,
      nitroPressureId
    );
    cy.findAllByText('Exit').should('be.visible');
    cy.clickAddButton(
      'Create New Helium ISO Container',
      routes.retrieveQuickAssetCreateHISOContainer
    );

    heliumISOCDesc2 = utilFunctions.suffixWithDate(
      this.data.heliumISODesc + ' 2_'
    );
    cy.enterHeliumISOContainerAssetDetails(
      heliumISOCDesc2,
      'None',
      'Badar test site Oakville ON',
      rtuId2,
      '1.2',
      'South',
      assetIntId,
      'dolv3qa',
      heliumLevelId2,
      heliumPressureId2,
      nitroLevelId2,
      nitroPressureId2,
      'notes added'
    );
    cy.clickAddButton('Save', routes.saveQuickAssetHISOContainer);
    cy.verifyHeliumAssetContainerCreateTexts(
      'New Helium ISO Container Asset Created',
      heliumISOCDesc2,
      'None',
      'Badar test site Oakville ON',
      rtuId2,
      'South',
      '1.2',
      'true',
      'notes added',
      heliumLevelId2,
      heliumPressureId2,
      nitroLevelId2,
      nitroPressureId2
    );

    cy.clickAddButton('Exit', routes.retrieveAssetByOptionsUrl);
    utilFunctions.verifyItemsCountPaginationAfter(2);

    cy.clickOnAssetDescription(heliumISOCDesc2);
    cy.verifyHeliumISOContainerDetails(
      'Edit Asset',
      'Helium ISO Container',
      heliumISOCDesc2,
      'None',
      assetIntId,
      'Badar test site Oakville ON',
      'notes added',
      'South',
      'true',
      '1.2'
    );
    cy.selectTab('Data Channels');
    cy.dataChannelTable().should('be.visible');

    cy.verifyDataChannelsOnEditAssetScreen(
      'Battery',
      'Helium Pressure Rate of Change',
      'Helium Level',
      'Helium Pressure',
      'Nitrogen Level',
      'Nitrogen Pressure',
      'GPS'
    );
    cy.verifyRTUColumn(RTUColumn, rtuId2);
   // cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
   cy.visit('/ops/asset-summary');

    cy.verifyQuickAssetReport(
      'Helium ISO Container',
      heliumISOCDesc2,
      'Custom Properties',
      heliumISOCDesc2,
      'None',
      'Badar test site Oakville ON',
      rtuId2,
      'South',
      '1.2',
      'true',
      'notes added',
      heliumLevelId2,
      heliumPressureId2,
      nitroLevelId2,
      nitroPressureId2
    );

    cy.get('[aria-label="close"]').click();



    //Delete newly created HISO 
    cy.deleteAsset(heliumISOCDesc2);
    cy.wait(2000);
    cy.deleteAsset(heliumISOCDesc1);
 
  });
 




    // skipped because not testing FTP disabled scenario for now
    it.skip('TC: 10096 - HISOC-Setting the domain for the Quick Add -Helium ISO Container-Cancel-Save', function () {
      cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
      cy.server();
      cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('siteRec');
      cy.route('POST', routes.updateUserPreferredTimeZone).as('domainTZ');
  
      cy.findAllByText('Quick Add').should('be.visible').click({ force: true });
      cy.findAllByText('Tank').should('be.visible');
      cy.closeDropdown();
      cy.domainMenu().should('be.visible').click();
      cy.verifyDomainMenuList();
  
      cy.selectFromMenuList(
        'Configuration',
        routes.retrieveDomainRecordByParentDomainId
      );
      cy.waitProgressBarToDisappear();
      cy.findAllByText('Domain List').should('be.visible');
      cy.get('[type="text"]').type(this.data.domain);
      cy.applyButton().click();
      cy.wait(3000);
      cy.get('td[aria-label="Name"] a', { timeout: 5000 }).click();
      cy.findAllByText('Edit Domain').should('be.visible');
      cy.verifyTabs();
      cy.assetsTab().click();
      cy.wait('@siteRec').should('have.property', 'status', 200);
      cy.verticalAsseetTab().should('have.text', 'Helium ISO Containers');
      cy.heliumISOContainerCheckbox().check({ force: true }).should('be.checked');
  
      cy.enterDomainAssetTabDetails(
        'abc test',
        'Helium event Rule Group',
        'Helium',
        '0-11 Level Sensor',
        '0-200 PSI Sensor',
        'Default Rate of Change',
        'Nitrogen Event Rule Group',
        'Nitrogen',
        '0-11 Level Sensor',
        '0-200 PSI Sensor'
      );
  
      cy.verifyDisplayPriorityCells(
        displayPriorityCellsLocator,
        'Helium Level',
        'Helium Pressure',
        'Nitrogen Level',
        'Nitrogen Pressure',
        'Helium Pressure Rate of Change',
        'Gps',
        'Battery'
      );
  
      cy.get('[data-rbd-drag-handle-draggable-id="1"]', { timeout: 3000 })
        .as('first')
        .should('contain', 'Helium Level');
      cy.get('[data-rbd-drag-handle-draggable-id="2"]').should(
        'contain',
        'Helium Pressure'
      );
      cy.get('@first')
        .focus()
        .trigger('keydown', { keyCode: 32 })
        .get('@first')
        .trigger('keydown', { keyCode: 40, force: true })
        .wait(0.2 * 1000)
        .trigger('keydown', { keyCode: 32, force: true });
  
      cy.get('[data-rbd-drag-handle-context-id="0"]', { timeout: 2000 })
        .eq(0)
        .should('contain', 'Helium Pressure');
      cy.get('[data-rbd-drag-handle-context-id="0"]')
        .eq(1)
        .should('contain', 'Helium Level');
  
      cy.clickButton('Save');
      cy.wait('@domainTZ').should('have.property', 'status', 200);
      cy.findAllByText('Edit Domain', { timeout: 10000 }).should('be.visible');
      cy.assetsTab().click({ force: true });
  
      cy.get('[data-rbd-drag-handle-draggable-id="2"]', { timeout: 15000 })
        .as('first')
        .should('contain', 'Helium Pressure');
      cy.get('[data-rbd-drag-handle-draggable-id="1"]').should(
        'contain',
        'Helium Level'
      );
      cy.get('@first')
        .focus()
        .trigger('keydown', { keyCode: 32 })
        .get('@first')
        .trigger('keydown', { keyCode: 40, force: true })
        .wait(0.2 * 1000)
        .trigger('keydown', { keyCode: 32, force: true });
  
      cy.get(
        '[data-rbd-droppable-id="domainHeliumIsoContainer.dataChannelsDisplayPriority-input"] div',
        { timeout: 2000 }
      )
        .eq(0)
        .should('contain', 'Helium Level');
      cy.get(
        '[data-rbd-droppable-id="domainHeliumIsoContainer.dataChannelsDisplayPriority-input"] div'
      )
        .eq(1)
        .should('contain', 'Helium Pressure');
  
      cy.clickButton('Save');
      cy.findAllByText('Edit Domain').should('be.visible');
      cy.go('back');
      cy.assetSummaryIcon().click({ force: true });
      cy.selectFromMenuList('Configuration', routes.retrieveAssetByOptionsUrl);
    });
  
    it.skip('TC: 10143 - HISOC-Quick Add-Helium and Nitrogen levels integration (disabled)-with custom properties not filled  -Site default-with Rate of change DC-with design curve -Save-Create new HISO Asset-Exit', function () {
      let rtuId = 'E1004C83';
      cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
      cy.waitProgressBarToDisappear();
      utilFunctions.itemsCountPaginationBefore();
      cy.findAllByText('Quick Add').click({ force: true });
      cy.findAllByText('Tank').should('be.visible');
      cy.findAllByText('Helium ISO Container')
        .should('be.visible')
        .click({ force: true });
      cy.waitProgressBarToDisappear();
      cy.findAllByText('Add Helium ISO Container Asset').should('be.visible');
  
      heliumISOCDesc4 = utilFunctions.suffixWithDate(
        this.data.heliumISODesc + ' 4_'
      );
      cy.enterHeliumISOContainerAssetDetailsOnly(
        heliumISOCDesc4,
        'Gardner 64 psig',
        'abc test',
        'Anova123 Oakville ON',
        rtuId,
        'notes added'
      );
  
      cy.clickAddButton('Save', routes.saveQuickAssetHISOContainer);
  
      cy.verifyHeliumAssetContainerCreateWithoutCustomPropTexts(
        'New Helium ISO Container Asset Created',
        heliumISOCDesc4,
        'Gardner 64 psig',
        'Anova123 Oakville ON',
        rtuId,
        'false',
        'notes added',
        rtuId + '-1',
        rtuId + '-2',
        rtuId + '-3',
        rtuId + '-4',
        rtuId + '-GPS',
        rtuId + '-BATT_VOLTAGE'
      );
  
      cy.verifyDisplayPriorityCells(
        intParametersDCLocator,
        'Helium Level',
        'Helium Pressure',
        'Nitrogen Level',
        'Nitrogen Pressure',
        'GPS',
        'Battery',
        'Helium Pressure Rate of Change'
      );
  
      cy.findAllByText('Create New Helium ISO Container').should('be.visible');
      cy.findAllByText('View Details').should('be.visible');
      cy.clickAddButton('Exit', routes.retrieveAssetByOptionsUrl);
      utilFunctions.verifyItemsCountPaginationAfter(1);
  
      cy.clickOnAssetDescription(heliumISOCDesc4);
  
      cy.verifyAssetDetailsAndDesignCurve(
        'Edit Asset',
        'Helium ISO Container',
        heliumISOCDesc4,
        'Select',
        '',
        '',
        'Anova123 Oakville ON',
        'notes added',
        'Gardner 64 psig'
      );
  
      cy.selectTab('Data Channels');
      cy.dataChannelTable().should('be.visible');
      cy.verifyDataChannelsOnEditAssetScreen(
        'Helium Level',
        'Helium Pressure',
        'Nitrogen Level',
        'Nitrogen Pressure',
        'Helium Pressure Rate of Change',
        'GPS',
        'Battery'
      );
      cy.verifyRTUColumn(RTUColumn, rtuId);
      cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    });
  
    it.skip('QT- Delete-Three dot Menu', function () {
      cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
      cy.server();
      cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecords');
      cy.get('input[type="text"]').type(heliumISOCDesc4);
      cy.applyButton().click();
      cy.wait('@assetRecords').should('have.property', 'status', 200);
  
      cy.deleteQTRecordByThreeDot(heliumISOCDesc4, routes.deleteAssetById);
      cy.wait('@assetRecords').should('have.property', 'status', 200);
      cy.verifyQTDeletedItem(heliumISOCDesc4, 'No assets found');
    });

    //skipped due to bug 11744
    it.skip('TC: 10595 - HISOC-Setting-Verify error message for Misconfiguration -Rule group for Helium /Nitrogen Event rule groups', function () {
  
      cy.findAllByText('Quick Add').click({ force: true });
      cy.findAllByText('Tank').should('be.visible');
      cy.findAllByText('Helium ISO Container').should('be.visible');
      cy.closeDropdown();
  
      cy.domainMenu().should('be.visible').click();
      cy.verifyDomainMenuList();
  
      cy.selectFromMenuList(
        'Configuration',
        routes.retrieveDomainRecordByParentDomainId
      );
      cy.waitProgressBarToDisappear();
      cy.findAllByText('Domain List').should('be.visible');
      cy.searchField().type(domain);
      cy.applyButton().click();
  
      cy.selectItemFromGrid('td[aria-label="Name"] a', domain);
  
      cy.findAllByText('Edit Domain').should('be.visible');
      cy.verifyTabs();
      cy.assetsTab().click();
      cy.verticalAsseetTab().should('have.text', 'Helium ISO Containers');
  
      cy.heliumISOContainerCheckbox().check().should('be.checked');
  
      cy.resetDomainAssetTabDetails('Select');
  
      cy.clickButton('Save');
      cy.findByRole('alert').should('have.text', 'Unable to save domain');
      cy.verifyDomainAssetsErrorTexts();
  
      cy.enterDomainAssetTabDetails(
        'Badar test site',
        'Helium out of range Event rule group ',
        'Helium',
        '0-11 Level Sensor',
        '0-200 PSI Sensor',
        'Default Rate of Change',
        'Nitrogen Event Rule Group',
        'Nitrogen',
        '0-11 Level Sensor',
        '0-200 PSI Sensor'
      );
  
      cy.clickButton('Save');
      cy.defaultHeliumEventErrorText().should(
        'have.text',
        'Event Rule Group : Helium out of range Event rule group  is configured with event rule(s) which exceed the data channel template : 0-11 Level Sensor scaled max value.'
      );
  
      cy.defaultHeliumEvents().click();
      cy.levelDropdown('Nitrogen Event Rule Group');
      cy.clickAddButton('Save & Close', routes.saveAdditionalDomain);
      cy.waitProgressBarToDisappear();
    });
  
    it.skip(`TC: 10102 - HISOC-Setting the domain for the Helium ISO Container Quick add -The check box unchecked(with all settings )-default display priority -Save & Close,`, function () {
      cy.superLogin('dolv3qa');
      cy.navigateToAssetManager();
  
      cy.findAllByText('Quick Add').click({ force: true });
      cy.findAllByText('Tank').should('be.visible');
      cy.findAllByText('Helium ISO Container').should('be.visible');
      cy.closeDropdown();
  
      cy.domainMenu().should('be.visible').click();
      cy.verifyDomainMenuList();
  
      cy.selectFromMenuList(
        'Configuration',
        routes.retrieveDomainRecordByParentDomainId
      );
      cy.waitProgressBarToDisappear();
      cy.findAllByText('Domain List').should('be.visible');
      cy.searchField().type(domain);
      cy.applyButton().click();
  
      cy.selectItemFromGrid('td[aria-label="Name"] a', domain);
  
      cy.findAllByText('Edit Domain').should('be.visible');
      cy.verifyTabs();
      cy.assetsTab().click();
      cy.verticalAsseetTab().should('have.text', 'Helium ISO Containers');
  
      cy.heliumISOContainerCheckbox().uncheck().should('not.be.checked');
  
      cy.enterDomainAssetTabDetails(
        'Badar test site',
        'Helium event Rule Group',
        'Helium',
        '0-11 Level Sensor',
        '0-200 PSI Sensor',
        'Default Rate of Change',
        'Nitrogen Event Rule Group',
        'Nitrogen',
        '0-11 Level Sensor',
        '0-200 PSI Sensor'
      );
      cy.clickAddButton('Save & Close', routes.saveAdditionalDomain);
      cy.waitProgressBarToDisappear();
  
      cy.findAllByText('Domain List').should('be.visible');
      cy.get('[type="text"]').type(domain);
      cy.applyButton().click();
      cy.selectItemFromGrid('td[aria-label="Name"] a', domain);
      cy.assetsTab().click();
      cy.heliumISOContainerCheckbox().should('not.be.checked');
      cy.viewAsset(
        'Configuration',
        'Asset Configuration Manager',
        routes.retrieveAssetByOptionsUrl
      );
  
      cy.findAllByText('Quick Add').click({ force: true });
      cy.findAllByText('Tank').should('be.visible');
      cy.findAllByText('Helium ISO Container').should('not.be.visible');
      cy.closeDropdown();
  
      cy.assetSummaryIcon().click({ force: true });
      cy.domainMenu().should('be.visible').click();
      cy.selectFromMenuList(
        'Configuration',
        routes.retrieveDomainRecordByParentDomainId
      );
      cy.waitProgressBarToDisappear();
      cy.get('[type="text"]').type(domain);
      cy.applyButton().click();
      cy.selectItemFromGrid('td[aria-label="Name"] a', domain);
  
      cy.findAllByText('Edit Domain').should('be.visible');
      cy.assetsTab().click();
      cy.heliumISOContainerCheckbox().check({ force: true }).should('be.checked');
      cy.clickAddButton('Save & Close', routes.saveAdditionalDomain);
      cy.waitProgressBarToDisappear();
      cy.viewAsset(
        'Configuration',
        'Asset Configuration Manager',
        routes.retrieveAssetByOptionsUrl
      );
    });

    it.skip('TC: 10140 - HISOC-Quick Add-Helium and Nitrogen levels integration enabled (Auto generate IDs)-No custom properties filled -Site remove default add from list-with out  RoC-simple Event Rule enabled at domain-with design curve -Cancel-Save-Exit-View details', function () {
      let heliumLevelId = 'HL_' + utilFunctions.randomString();
      let heliumPressureId = 'HP_' + utilFunctions.randomString();
      let nitroLevelId = 'NL_' + utilFunctions.randomString();
      let nitroPressureId = 'NP_' + utilFunctions.randomString();
      let batteryId = 'B_' + utilFunctions.randomString();
      let gpsId = 'G_' + utilFunctions.randomString();
      let assetIntId = 'xyz101' + utilFunctions.randomString();
      let rtuId = rtuid;
      cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
      cy.waitProgressBarToDisappear();
      utilFunctions.itemsCountPaginationBefore();
      cy.findAllByText('Quick Add').click({ force: true });
      cy.findAllByText('Tank').should('be.visible');
      cy.findAllByText('Helium ISO Container')
        .should('be.visible')
        .click({ force: true });
      cy.waitProgressBarToDisappear();
      cy.findAllByText('Add Helium ISO Container Asset').should('be.visible');
  
      heliumISOCDesc3 = utilFunctions.suffixWithDate(
        this.data.heliumISODesc + ' 3_'
      );
      cy.enterHeliumISOContainerAssetWithoutCustomPropDetails(
        heliumISOCDesc3,
        'Gardner 64 psig',
        'anova Oakville ON',
        rtuId,
        assetIntId,
        'dolv3qa-uk',
        heliumLevelId,
        heliumPressureId,
        nitroLevelId,
        nitroPressureId,
        batteryId,
        gpsId,
        'notes added'
      );
      cy.clickAddButton('Save', routes.saveQuickAssetHISOContainer);
  
      cy.verifyHeliumAssetContainerCreateWithoutCustomPropTexts(
        'New Helium ISO Container Asset Created',
        heliumISOCDesc3,
        'Gardner 64 psig',
        'anova Oakville ON',
        rtuId,
        'false',
        'notes added',
        heliumLevelId,
        heliumPressureId,
        nitroLevelId,
        nitroPressureId,
        batteryId,
        gpsId
      );
  
      cy.findAllByText('Create New Helium ISO Container').should('be.visible');
      cy.findAllByText('View Details').should('be.visible');
      cy.clickAddButton('Exit', routes.retrieveAssetByOptionsUrl);
      cy.wait(3000);
      utilFunctions.verifyItemsCountPaginationAfter(1);
      cy.clickOnAssetDescription(heliumISOCDesc3);
      cy.verifyHeliumISOContainerDetails(
        'Edit Asset',
        'Helium ISO Container',
        heliumISOCDesc3,
        'Gardner 64 psig',
        assetIntId,
        'anova Oakville ON',
        'notes added',
        'Select',
        'false',
        ''
      );
  
      cy.selectTab('Data Channels');
      cy.dataChannelTable().should('be.visible');
      cy.verifyDataChannelsOnEditAssetScreen(
        'Analog Channels',
        'Helium Level',
        'Helium Pressure',
        'Nitrogen Level',
        'Nitrogen Pressure',
        'GPS',
        'Battery'
      );
      cy.verifyRTUColumn(RTUColumn, rtuId);
      cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
  
      cy.verifyQuickAssetReport2(
        'Helium ISO Container',
        heliumISOCDesc3,
        'Custom Properties',
        heliumISOCDesc3,
        'Gardner 64 psig',
        'anova Oakville ON',
        rtuId,
        'false',
        'notes added',
        heliumLevelId,
        heliumPressureId,
        nitroLevelId,
        nitroPressureId,
        batteryId,
        gpsId
      );
  
      cy.clickAddButton('View Details', routes.retrieveSiteRecordsOptionsUrl);
      cy.pageHeader().should('have.text', 'Edit Asset');
  
      cy.applicationLaunchPanel().click({ force: true });
  
      cy.get('a').contains('Administration').click({
        force: true,
      });
      cy.waitProgressBarToDisappear();
    });
});
