/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
import moment from 'moment';
const utilFunctions = new UtilFunctions();

let dcDescriptionCol = 'td[aria-label="Description"]';
let dcTypeCol = 'td[aria-label="Type"]';
let siteName,
  assetDescription,
  assetDescription5 = "Helium ISO container",
  analogDataChannelDesc4;

  describe('Asset Editor Test suite', function () {
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
  
    it('TC: 9404 - Login Portal', function () {
      cy.login();
    });

  it('TC:32299 - Horner - General Panel - Edit', () => {
    cy.TestAutomationAPDomain()
    cy.navigateToAppPicker2('Operations');
    cy.assetSummaryIcon().click();
    cy.pageHeader().should('have.text', 'Asset Summary');
    cy.url().should('include', 'ops/asset-summary');
    cy.enterAssetAndGoToTheOperation()
    cy.searchForAssetDetail()
    cy.clickOnRtu()
    cy.clickOnPollScheduleManager()
    cy.getThePollName1()
    cy.getThePollName2()
    cy.goToSiteManager()
    cy.getSiteNumber1()
    cy.getSiteNumber2()
    cy.getSiteNumber3()
    cy.navigateToAppPicker2('Operations');
    cy.assetSummaryIcon().click();
    cy.pageHeader().should('have.text', 'Asset Summary');
    cy.url().should('include', 'ops/asset-summary');
    cy.enterAssetAndGoToTheOperation()
    cy.searchForAssetDetail()
    cy.clickOnRtu()
    cy.clickOnPencilIcon()
    cy.verifySideDrawerofGI()
    cy.addGenInfoDescription()
    cy.selectDispenser()
    cy.clickOnSerial()
    cy.selectPoll()
    cy.clearSite()
    cy.saveNClose()
    cy.verifyTheDeviceId()
    cy.clickOnPencilIcon()
    cy.modifyDescription()
    cy.verifyDropdownValues()
    //cy.codeForSkip()
    cy.changeTheType()
    cy.openModelDropdown()
    cy.pollDropdownverify()
    cy.verifyPoll()
    cy.selectPollAgain()
    cy.siteVerify()
    cy.verifySite()
    cy.addSite1238()
    //  cy.clickOnPencilIcon()
    cy.verifyAdress()
    cy.saveNClose()
    cy.verifyGeneralinformation()
    const DateTimePlus1 = moment().add(1, 'minutes').format('M/D/YYYY h:mm');
    const user = 'qa@TestAutomation';
    const DateTimePlus2 = moment().format('M DD,YYYY h:mm');
    cy.dateUpdated(user, DateTimePlus1, DateTimePlus2)

  })

  it('TC: 33088 Horner - sort dropdowns alphabetically', () => {
    cy.clickOnPencilIcon()
    cy.dropdownSorting()
    cy.saveNClose()
  })

  it('33023 - RTU - Frontend - Horner - General Information - Update Site fails', () => {
    cy.checkTheSiteResponse();
  })

  it('32613 - RTU - Frontend - Horner - AI Channel - Editor -Save Template', () => {
    cy.clickOnPencilIcon()
    cy.selectCompressor()
    cy.saveNClose()
    cy.RTUTimeEditNotPresent()
    cy.selectAiChannel()
    cy.selectTemplate()
    cy.appendWithCurrDate()
    cy.rowValueCheck()
    cy.channelCheck()
    cy.rowCheck()
    cy.rowMaxCheck()
    cy.scaledMinCheck()
    cy.scaledMaxCheck1()
    cy.uomChecker()
    cy.uomValueCheck()
    cy.decimalCheck()
    cy.row2Des()
    cy.row2ValueCheck()
    cy.row2AddAiChannel()
    cy.row3Des()
    cy.row3ValueCheck()
    cy.row3channelCheck()
    cy.row3Check()
    cy.row3MaxCheck()
    cy.row3ScaledMinCheck()
    cy.row3ScaledMaxCheck()
    cy.row3UomChecker()
    cy.row3DecimalCheck()
    cy.saveAsNewTemp()
    cy.AddTempDes()
    cy.Save()
    cy.AddTempDesWithCurrDate()
    cy.Save()
    cy.cancelSave()
    cy.loadNewTemp()
    cy.wait(2000)
    cy.Apply()
    cy.verifyDes()
    cy.verifyFeilds()
    cy.verifyRow()
    cy.verifyChannel()
    cy.verifyRowMin()
    cy.verifyMinScaled()
    cy.verifyMaxScaled()
    cy.verifyUOM()
    cy.verifydecimalCheck1()
    cy.verifyDes2()
    cy.verifyFieldType2()
    cy.verifyDes3()
    cy.verifyFieldType3()
    cy.verifyChannel3()
    cy.verifyRowMin3()
    cy.verifyRowMax3()
    cy.verifyscaledMin3()
    cy.verifyscaledMax3()
    cy.verifyUom3()
    cy.verifydecimal3()
    cy.go('back')
    cy.clickOnPencilIcon()
    cy.selectDispensor()
    cy.saveNClose()
    cy.selectAiChannel()
    cy.selectTemplate()
    cy.appendWithCurrDate()
    cy.rowValueCheck()
    cy.channelCheck()
    cy.rowCheck()
    cy.rowMaxCheck()
    cy.scaledMinCheck()
    cy.scaledMaxCheck1()
    cy.uomChecker()
    cy.uomValueCheck()
    cy.decimalCheck()
    cy.row2Des()
    cy.row2ValueCheck()
    cy.row2AddAiChannel()
    cy.row3Des()
    cy.row3ValueCheck()
    cy.row3channelCheck()
    cy.row3Check()
    cy.row3MaxCheck()
    cy.row3ScaledMinCheck()
    cy.row3ScaledMaxCheck()
    cy.row3UomChecker()
    cy.row3DecimalCheck()
    cy.saveAsNewTemp()
    cy.AddTempDes()
    cy.Save()
    cy.AddTempDesWithCurrDate()
    cy.Save()
    cy.cancelSave()
    cy.loadNewTemp()
    cy.wait(2000)
    cy.Apply()
    cy.verifyDes()
    cy.verifyFeilds()
    cy.verifyRow()
    cy.verifyChannel()
    cy.verifyRowMin()
    cy.verifyMinScaled()
    cy.verifyMaxScaled()
    cy.verifyUOM()
    cy.verifydecimalCheck1()
    cy.verifyDes2()
    cy.verifyFieldType2()
    cy.verifyDes3()
    cy.verifyFieldType3()
    cy.verifyChannel3()
    cy.verifyRowMin3()
    cy.verifyRowMax3()
    cy.verifyscaledMin3()
    cy.verifyscaledMax3()
    cy.verifyUom3()
    cy.verifydecimal3()
    cy.selectTemp()
    cy.wait(2000)
    cy.Apply()
    cy.wait(2000)
    cy.row2AddAiChannel()
    cy.row3Des()
    cy.deleteChannel()
    cy.row2Des1()
    cy.saveEdit()
    cy.row2DesEdit()
  })

  it.skip('TC: 9407 - Asset Editor-Type Helium ISO container-Add new Site on asset-add new Product in Dc-Add Analogue(non volumetric)+Digital+Diagnostic DCs-Cancel -Save&Exit', function () {
    cy.navigateToAppPicker2('Administration');
    cy.TestAutomationDomain()
    let analogDataChannelDesc, digitalDataChannelDesc, editAssetDescription,
      analogDCVolumetric, newProduct, editProduct;

    assetDescription = utilFunctions.suffixWithDate(this.data.assetDesc + '1_');
    cy.createAssetTank(assetDescription, 'E100392B');

    cy.verifyPageUrl('POST', routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.server();
    cy.route('POST', routes.retrieveSiteByIdUrl).as('siteComponents');

    cy.clickOnAssetDescription(assetDescription);
    cy.findAllByText('Edit Asset').should('be.visible');

    editAssetDescription = utilFunctions.suffixWithDate(
      this.data.editAssetDesc + '2_'
    );
    cy.editAssetConfiguration(
      editAssetDescription,
      'Helium ISO Container',
      'Gardner 64 psig',
      'Default Rule Group',
      ' ',
      '1213',
      'Notes Edited'
    );

    cy.tankSiteLabel().findByText('Add').click();
    cy.wait('@siteComponents').should('have.property', 'status', 200);

    siteName = 'Anova Test Site ' + utilFunctions.randomString();
    cy.enterSitesDetailsforAsset(
      'Add Site',
      siteName,
      'Test site',
      '123-456-7890',
      '133 kerr street',
      'Canada',
      this.data.state,
      'Oakville',
      'L6K 3A6',
      '(UTC-06:00) Central Time (US & Canada)'
    );

    cy.editSiteSaveAndClose();

    cy.selectTab('Data Channels');
    cy.dataChannelTable().should('be.visible');

    //Analog Channel (Non-volumetric)
    cy.dataChannelAddButton('Add Analog Channel');
    analogDataChannelDesc = utilFunctions.suffixWithDate('level_NonVol_');
    cy.enterAnalogChannelDetails(
      'Add Analog Channel',
      analogDataChannelDesc,
      'RTU',
      'E100392B',
      '1',
      '0-11 Level Sensor',
      'Default Rule Group'
    );
    cy.clickOnProductLabel('Add');
    newProduct = 'Nitrogen_' + utilFunctions.randomString();
    cy.enterProductDetailsForAsset(
      newProduct,
      this.data.gravity,
      this.data.SCM,
      this.data.productGroup,
      'Add Product'
    );
    cy.productSaveAndClose();
    cy.dcSaveAndCloseButton(routes.addAnalogDataChannelUrl);
    cy.verifyDataChannelCreated(dcDescriptionCol, analogDataChannelDesc);


    //Analog Channel (Volumetric)
    cy.dataChannelAddButton('Add Analog Channel');
    analogDCVolumetric = utilFunctions.suffixWithDate('level_Vol_');
    editProduct = 'edit_Nitrogen_' + utilFunctions.randomString();
    cy.enterAnalogChannelDetailsEditProduct(
      'Add Analog Channel',
      analogDCVolumetric,
      'FF720008',
      '1',
      '0-11 Level Sensor',
      'Default Rule Group',
      'RTU',
      newProduct,
      editProduct,
      'Test Hendrik'
    );
    cy.dcSaveAndCloseButton(routes.addAnalogDataChannelUrl);
    cy.verifyDataChannelCreated(dcDescriptionCol, analogDCVolumetric);


    //Digital Channel
    cy.dataChannelAddButton('Add Digital Channel');
    digitalDataChannelDesc = utilFunctions.suffixWithDate(
      this.data.digitalDCDesc
    );
    cy.enterDigitalChannelDetails(
      'Add Digital Channel',
      digitalDataChannelDesc,
      'F0000646',
      '1',
      'Default DigitalInput',
      'Default Rule Group',
      '0.23',
      'off',
      '1.1',
      'on'
    );
    cy.dcSaveAndCloseButton(routes.addDigitalDataChannelUrl);
    cy.verifyDataChannelCreated(dcDescriptionCol, digitalDataChannelDesc);


    //Diagnostic Channels (All types use Asset "Anolog")
    cy.dataChannelAddButton('Add Diagnostic Channel');
    cy.enterDiagnosticChannelDetails(
      'E100392B',
      'Battery Voltage',
      'GPS',
      'RTU Case Temperature',
      'Signal Strength',
      'Average Charge Current'
    );

    cy.clickOnCancelDC(1);

    var dc = ['Battery Voltage', 'GPS', 'RTU Case Temperature', 'Signal Strength', 'Average Charge Current'];

    dc.forEach((type) => {
      cy.verifyDataChannelCreated(dcTypeCol, type);
    });

    cy.dataChannelAddButton('Add Diagnostic Channel');
    dc.forEach((type) => {
      cy.verifyDcDeletedFromDiagnostic(type);
    });
    cy.clickOnCancelDC(1);

    cy.verifyHistoryTab('History');
    cy.selectTab('General');

    cy.clickQTSaveCloseBtn();

    //Bug
    //cy.clickOnAssetDescription(editAssetDescription);
    //cy.goBack('POST',routes.retrieveAssetByOptionsUrl);

    //Delete recently created Asset
    cy.deleteAsset(assetDescription);
  });

  //skipped due to bug
  it.skip('TC: 9480 - Asset Editor-Type Tank-DC level-data source published DC- Flow meter channel-Counter channel -Prod edit(dc)-Save&Exit', function () {
    let editAssetDescription5, analogDataChannelDesc5
    cy.verifyPageUrl('POST', routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.clickOnAssetDescription(assetDescription5);
    cy.findAllByText('Edit Asset').should('be.visible');

    editAssetDescription5 = utilFunctions.suffixWithDate(
      this.data.editAssetDesc + '5_'
    );
    cy.editAssetConfigurationTank(editAssetDescription5, 'Tank', '@#$%^12355');
    cy.selectTab('Data Channels');
    cy.dataChannelTable().should('be.visible');

    cy.dataChannelAddButton('Add Analog Channel');
    analogDataChannelDesc4 = utilFunctions.suffixWithDate(
      this.data.analogDCDesc4
    );
    cy.enterAnalogChannelDetailsPDC(
      'Add Analog Channel',
      analogDataChannelDesc4,
      'Published Data Channel',
      'dolv3qa to TranscendTestAutomation',
      'edit_Nitrogen_aBQH',
      'edit_Nitrogen_aBQH',
      'Default Rule Group'
    );

    cy.dcSaveAndCloseButton(routes.addAnalogDataChannelUrl);
    cy.get('span[class^="MuiButton-label-"]').eq(4).click({ force: true })

    //Add analog DC again
    cy.dataChannelAddButton('Add Analog Channel');
    analogDataChannelDesc5 = utilFunctions.suffixWithDate(
      this.data.analogDCDesc5
    );
    cy.enterAnalogChannelDetailsWithoutDimension(
      'Add Analog Channel',
      analogDataChannelDesc5,
      'RTU',
      'FF720008',
      '1',
      'Default FlowMeter',
      'Default Rule Group'
    );

    cy.dcSaveAndCloseButton(routes.addAnalogDataChannelUrl);
    cy.verifyDataChannelCreated(dcDescriptionCol, analogDataChannelDesc5);

    cy.clickAddButton('Save & Close', routes.saveAssetEditUrl);
  });

});
