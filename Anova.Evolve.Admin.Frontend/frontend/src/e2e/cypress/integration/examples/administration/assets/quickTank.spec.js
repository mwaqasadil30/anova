/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();

let quickTankDesc,
  qTankDesc,
  quickTankDesc2,
  quickTankDesc3,
  quickTankDesc4,
  assetSite,
  assetTitleLocator = '[aria-label="Asset title"]',
  rtuDeviceIdLocator = 'tbody [aria-label="RTU device Id"]';

describe.skip('Quick Tank Test suite', function () {
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

  it('Login Portal', function () {
    cy.login();
  });

  it('Asset Configuration Manager View', function () {
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });

    cy.findAllByText('Asset Configuration Manager').should('be.visible');
    cy.url().should('include', 'admin/asset-configuration-manager');

    //already added in commands
    cy.get('[aria-label="Collapse side nav"]').click();

    //to be added in commands
    cy.get('[aria-label="configure nav"]').click();
    cy.findAllByText('Site').click({force: true});

    cy.findAllByText('Configuration').click({force: true});
    cy.findAllByText('Asset Configuration Manager').should('be.visible');
    cy.get('[aria-label="Collapse side nav"]').click();
    cy.wait(1000);
  });

  it('Test Case 9028: QT-Add-Data Source RTU-Tank Dimensions not set-with display Unit -Site & Product auto complete-Asset integration enabled -Add new bulk Tank on Save Modal Save & Exit -check report', function () {
    
    cy.verifyPageUrl('POST',
      routes.assetConfigurationManagerUrl,
      routes.retrieveAssetByOptionsUrl
    );

    utilFunctions.itemsCountPaginationBefore();
    
    cy.clickAddTankButton();
    cy.findAllByText('Add Tank Asset').should('be.visible');

    quickTankDesc = utilFunctions.suffixWithDate(this.data.qtDesc);
    qTankDesc = utilFunctions.suffixWithDate(this.data.qtDesc2);

    assetSite = 'Anova123';
    let rtuId = 'E1001939';

    cy.enterQuickTankDetails(
      quickTankDesc,
      'tech',
      assetSite,
      'Horizontal with 2:1 Ellipsoidal Ends',
      rtuId,
      '0-11 Level Sensor',
      '1',
      '0-200 PSI Sensor',
      '2',
      'Nitrogen',
      '60',
      'l',
      '10000',
      'Default Rule Group',
      'xyz101',
      'dolv3qa',
      '3'+ utilFunctions.randomString(),
      'f'+ utilFunctions.randomString(),
      '7'+ utilFunctions.randomString(),
      'Notes Added'
    );

    cy.clickOnButton('Save & Close', routes.saveQuickAssetTankUrl);
    cy.levelMaxProductHeight().clear().type('10');
    cy.clickOnButton('Save & Close', routes.saveQuickAssetTankUrl);

    cy.verifyAssetTankPopup(quickTankDesc);
    cy.clickOnButton('Create New Bulk Tank', routes.retrieveQuickAssetCreateBulkTank);
    //Create bulk tank asset again
    cy.enterQuickTankDetails(
      qTankDesc,
      'tech',
      assetSite,
      'Horizontal with 2:1 Ellipsoidal Ends',
      rtuId,
      '0-11 Level Sensor',
      '1',
      '0-200 PSI Sensor',
      '2',
      'Nitrogen',
      '10',
      'l',
      '10000',
      'Default Rule Group',
      'xyz101',
      'dolv3qa',
      'n'+ utilFunctions.randomString(),
      'd'+ utilFunctions.randomString(),
      '9'+ utilFunctions.randomString(),
      'Notes Added'
    );

    cy.clickOnButton('Save & Close', routes.saveQuickAssetTankUrl);

    cy.verifyAssetTankPopup(qTankDesc);
    cy.clickAddButton('Exit',routes.retrieveAssetByOptionsUrl);
    cy.wait(1000)
    utilFunctions.verifyItemsCountPaginationAfter(2);

  });

  it('Test Case 9126: QT-Add-Data Source RTU--Set Tank Dimensions-Site and Product Edit -Save&Exit -view details on save Modal -exit', function () {

    cy.verifyPageUrl('POST',
      routes.assetConfigurationManagerUrl,
      routes.retrieveAssetByOptionsUrl
    );

    //Nagivate back to Quick Tank
    cy.applicationLaunchPanel().click();
    cy.clickOnAppPickerItems('Administration')

    cy.clickAddTankButton();
    cy.findAllByText('Add Tank Asset').should('be.visible');

    quickTankDesc2 = utilFunctions.suffixWithDate(this.data.qtDesc);
   let assetSitee = 'Bulk Strata Ltd.',
       eventRuleGroup = 'Default Rule Group',
       RtuDeviceId = 'E1001939';

    cy.wait(2000)
    cy.enterQuickTankEditSiteAndProductDetails(
      quickTankDesc2,
      'tech',
      'Bulk Strata Ltd',
       assetSitee,
      'Test Hend',
      RtuDeviceId,
      '0-60',
      '1',
      '0-200 PSI Sensor',
      '2',
      'Nitrogen',
      'Nitrogen',
      'l',
      '60',
      eventRuleGroup,
      'xyz101',
      'dolv3qa',
      'h'  + utilFunctions.randomString(),
      's'  + utilFunctions.randomString(),
      '8'  + utilFunctions.randomString(),
      'Notes Added'
    );

    cy.clickOnButton('Save & Close', routes.saveQuickAssetTankUrl);
    cy.verifyAssetTankPopup(quickTankDesc2);
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('retriveRecords');

    //View Details and Data Channels
    cy.clickOnButton('View Details', routes.retrieveAssetEditByIdUrl);
    cy.verifyViewDetailsInformation(quickTankDesc2,assetSitee,eventRuleGroup,'tech','xyz101','Notes Added');
    cy.get('[aria-label="asset tabs"]').findByText('Data Channels').click({
      force: true,
    })
    cy.verifyAllFieldsFilters('[aria-label="RTU device Id"]',RtuDeviceId);
    cy.clickSaveCloseBtn(routes.saveAssetEditUrl);

  });

  //DELETE
  it.skip('QT-Add-with Custom Properties-Data Source RTU-save&exit', function () {
    
    cy.verifyPageUrl('POST',
      routes.assetConfigurationManagerUrl,
      routes.retrieveAssetByOptionsUrl
    );

    cy.clickAddTankButton();
    cy.findAllByText('Add Tank Asset').should('be.visible');

    quickTankDesc4 = utilFunctions.suffixWithDate(this.data.qtDesc);
    let assetSite = 'anova Oakville ON',
     eventGroup = 'Nitrogen Event Rule Group',
     technician = 'tech',
     direction = 'West',
     number = '58',
     RTU= 'E1001939';

    cy.enterQuickTankDetailsCustom(
      quickTankDesc4,
      technician,
      assetSite,
      'Vertical with 2:1 Ellipsoidal Ends',
      RTU,
      '0-11 Level Sensor',
      '1',
      'Default Pressure',
      '2',
      'Nitrogen',
      '11',
      'l',
      '100',
      eventGroup,
      direction,
      number,
      'Notes Added'
    );

    cy.clickOnButton('Save & Close', routes.saveQuickAssetTankUrl);
    cy.verifyAssetTankPopup(quickTankDesc4);

    //View Details and Data Channels
    cy.clickOnButton('View Details', routes.retrieveAssetEditByIdUrl);
    cy.verifyCustomViewDetailsInformation(quickTankDesc4,assetSite,eventGroup,technician,direction,number);
  
    cy.get('[aria-label="asset tabs"]').findByText('Data Channels').click({
      force: true,
    })

    cy.verifyAllFieldsFilters(rtuDeviceIdLocator,RTU);
    cy.clickSaveCloseBtn(routes.saveAssetEditUrl);
    //Verify Reports
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Reports').click({
      force: true,
    });
    cy.clickAddButton('Quick Asset Create',routes.retrieveQuickAssetCreateReportUrl);
    cy.verifyAllFieldsFilters(assetTitleLocator,quickTankDesc4);

  });

  it('QT- Bulk Action-Delete-Tear down', function () {

    cy.verifyPageUrl('POST',
    routes.assetConfigurationManagerUrl,
    routes.retrieveAssetByOptionsUrl
    );

    cy.server();
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('qtRecords');
    cy.route("POST", routes.retrieveAssetByOptionsUrl).as("retrieveRecords");
    cy.get('input[type="text"]').clear().type('Tank Description');
    cy.applyButton().click();
    cy.wait('@retrieveRecords').should('have.property', 'status', 200);

    const qtNames = [
      quickTankDesc,
      qTankDesc,
      quickTankDesc2,
      quickTankDesc3
    ];

    qtNames.forEach((element) => {
      cy.deleteQTRecord(element);
    });

    cy.get('[role="menu"] [role="button"]').click({force: true});
    cy.verifyBulkActionsDropdownFields();
    cy.deleteFromBulkActionsDropdown('Delete');
    cy.get('p').contains('The following assets will be deleted:').should('exist');
    cy.findAllByText('Yes').click({
      force: true,
    });
    cy.wait('@retrieveRecords').should('have.property', 'status', 200);
  });


});
