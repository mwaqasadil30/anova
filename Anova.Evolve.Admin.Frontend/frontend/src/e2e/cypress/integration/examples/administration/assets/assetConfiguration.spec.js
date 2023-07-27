/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();
describe('Asset Configuration Test suite', function () {
  let assetDescriptionLocator = 'tbody [aria-label="Asset description"]',
    deviceIdLocator = 'tbody [aria-label="Device Id"]',
    descriptionColumnLocator = 'tbody [aria-label="Asset description"]',
    assetDescSelector = 'tbody [aria-label="Asset description"] a',
    myString,
    siteName,
    editSiteName,
    assetDescription,
    assetDescription2,
    retrieveAssetUrl = routes.retrieveAssetByOptionsUrl;

  beforeEach(function () {
    cy.fixture('example').then((data) => {
      this.data = data;
    });

    cy.intercept('POST', routes.retrieveSiteRecordsOptionsUrl).as('site');

    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('Test Case 8952: Set UP-As single domain user',{retries : 10}, function () {
    cy.login(); 
  });

  it('Test Case 8953: Asset Configuration Manager View', function () {
    cy.checkForWelcomeAlert();
    cy.navigateToAssetConfigurationScreen();
  });

  it('Test Case 8957: Asset config-Filter By -Asset Titles- Few alphabets from middle of Asset title-Group By -Customer Name', function () {
    const assetTitle = 'Analog Asset';
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.filterByDD().should('have.text', 'Asset Title').click();
    cy.verifyFilterByDDFields();
    cy.levelDropdown('Asset Title');
    cy.groupByDD().should('have.text', 'Customer Name').click();
    cy.verifyGroupByDDFields();
    cy.levelDropdown('Customer Name');

    cy.get('input[type="text"]').should(
      'have.attr',
      'placeholder',
      'Enter Asset Title'
    );

    myString = utilFunctions.splitStrings(assetTitle);
    cy.enterSearchField(retrieveAssetUrl, '*' + myString[2] + '*');
    cy.verifyGridFiltersWithPagination(assetDescSelector, myString[2]);

    cy.enterSearchField(retrieveAssetUrl, myString[2] + '{enter}');
    cy.verifyGridFiltersWithPagination(assetDescSelector, myString[2]);
  });

  it('Test Case 8958: Asset Config -Filter By -RTU -Full ID-Group by None', function () {
    let RTU = 'E1001939';
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.filterByDD().click();
    cy.verifyFilterByDDFields();
    cy.levelDropdown('RTU');
    cy.filterByDD().should('have.text', 'RTU');

    cy.get('input[type="text"]').should(
      'have.attr',
      'placeholder',
      'Enter RTU'
    );

    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, RTU);
    cy.verifyGridFiltersWithPagination(deviceIdLocator, RTU);
    cy.get('[aria-label="Customer name"]', { timeout: 5000 }).should('exist');

    cy.groupByDD().should('have.text', 'Customer Name').click();
    cy.verifyGroupByDDFields();
    cy.levelDropdown('None');
    cy.wait('@records').should('have.property', 'status', 200);
    cy.groupByDD().should('have.text', 'None');
    cy.verifyGridFiltersWithPagination(deviceIdLocator, RTU);
  
  });

  it('Test Case 9296: Asset Config-Add-Type Helium ISO container-Add Site-Save&Exit', function () {

    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.intercept('POST', routes.saveSiteUrl).as('saveSite');

    cy.clickAddButton('Add', routes.retrieveAssetEditByIdUrl);
    assetDescription = utilFunctions.suffixWithDate(this.data.addAsset);
    cy.addAssetDetailWithDesignCurve(
      assetDescription,
      'Helium ISO Container',
      'Default Rule Group',
      'test 3',
      '886 lkm$',
      'test notes 1234@#$%^&',
      'Gardner 175 psig'
    );

    cy.go('back');
    cy.VerifySaveChangesPopUp();
    cy.clickOnResume('Add Asset');

    cy.clickOnSiteLabel('Add');

    siteName = 'Anova Test Site' + utilFunctions.randomString();
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
    cy.clickOnBtnControl('Save & Close');
    cy.wait('@saveSite').then(({response})=> {expect(response.statusCode).to.eq(200)})

    //Save Asset
    cy.clickAddButton('Save & Close', routes.saveAssetEditUrl);

    cy.clickOnAsset(assetDescription);
    cy.verifyAssetDetailsAndDesignCurve(
      'Edit Asset',
      'Helium ISO Container',
      assetDescription,
      'Default Rule Group',
      'test 3',
      '886 lkm$',
      siteName + ' Oakville Ontario',
      'test notes 1234@#$%^&',
      'Gardner 175 psig'
    );
    cy.findAllByText('Save & Close').click();
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
  });

  it('Test Case 9786: Asset Config-Add-Type Tank-Edit Site- Cancel- DiscardAndExit- Save', function () {
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.applicationLaunchPanel().click();
    cy.clickOnAppPickerItems('Administration');

    utilFunctions.itemsCountPaginationBefore();
    cy.clickAddButton('Add', routes.retrieveAssetEditByIdUrl);
    cy.addAssetDetailsAllFields(
      'test Add 4',
      'Tank',
      'Default Rule Group',
      'test tech',
      'int id 2',
       siteName,
      'Karachi-Kuwait route',
      'test add'
    );
    cy.go('back');
    cy.VerifySaveChangesPopUp();
    cy.clickOnDiscardAndExit();

    cy.findByText('Asset Configuration Manager').should('be.visible');
    cy.clickAddButton('Add', routes.retrieveAssetEditByIdUrl);
    cy.get('[name="asset.description"]').type('Asset Add Tank');
    cy.clickCancelButton(routes.retrieveSiteRecordsOptionsUrl);
    cy.verifyAssetFieldsAreClear();

    //Add Asset Details and edit site
    assetDescription2 = utilFunctions.suffixWithDate(this.data.addAsset2);
    editSiteName = 'Edit Anova Test Site_' + utilFunctions.randomString();
    cy.addAssetDetailAndEditSite(
      assetDescription2,
      'Tank',
      'Default Rule Group',
      'test2',
      '5566pol',
      'Notes add 6789:{><',
      siteName,
      editSiteName
    );

    cy.clickAddButton('Save', routes.saveAssetEditUrl);
    cy.wait(10000);
    cy.findByText('Edit Asset',{timeout:10000}).should('exist');
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    utilFunctions.verifyItemsCountPaginationAfter(1);
  });

  it('Test Case 8977: Asset Config-Pagination-navigate with Arrows <,>,|<,>|', function () {
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.get('[aria-label="First page"]').first().should('be.disabled');
    cy.get('[aria-label="Previous page"]').first().should('be.disabled');

    cy.get('[aria-label="First page"]').last().should('be.disabled');
    cy.get('[aria-label="Previous page"]').last().should('be.disabled');

    cy.itemCount()
      .eq(0)
      .then(function (siteCount) {
        const site = siteCount.text();
        var siteList = site.split('f');
        siteList = siteList[1].trim();
        this.siteList = siteList;
      })
      .then(() => {
        if (Number(this.siteList) > 50) {
          cy.get('[aria-label="Last page"]').first().should('be.enabled');
          cy.get('[aria-label="Next page"]')
            .first()
            .should('be.enabled')
            .click({
              force: true,
            });

          cy.get('[aria-label="First page"]').first().should('be.enabled');
          cy.get('[aria-label="Previous page"]')
            .first()
            .should('be.enabled')
            .click();

          cy.get('[aria-label="Last page"]').last().should('be.enabled');
          cy.get('[aria-label="Next page"]').last().should('be.enabled').click({
            force: true,
          });

          cy.get('[aria-label="First page"]').last().should('be.enabled');
          cy.get('[aria-label="Previous page"]').last().should('be.enabled');
        }
      });
  });

  it('Test Case 8976: Asset Config -Pagination-navigate with Page Numbers', function () {
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.searchField().clear().type('{enter}');
    cy.get('[id="groupBy-input"]').click();
    cy.selectDropdown('None');
    cy.verifyPaginationPageNumbers(routes.retrieveAssetByOptionsUrl);
  });

  it('Test Case 8954: Asset Config- Delete-Three dot Menu', function () {
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);

    cy.intercept('POST', routes.retrieveAssetByOptionsUrl).as('retrieveRecords');
    cy.get('input[type="text"]').clear().type(assetDescription);
    cy.applyButton().click();
    cy.wait('@retrieveRecords').then(({response})=> {expect(response.statusCode).to.eq(200)});

    cy.deleteAssetByThreeDot('POST',routes.retrieveAssetByOptionsUrl,assetDescriptionLocator,assetDescription);
    cy.verifyQTDeletedItem(assetDescription, 'No assets found');
  });

  it('Test Case 8966: Asset Config- Bulk Action-Delete(Tear down )', function () {
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.intercept('POST', routes.retrieveAssetByOptionsUrl).as('retrieveRecords');
    cy.get('input[type="text"]').clear().type(assetDescription2);
    cy.applyButton().click();
    cy.wait('@retrieveRecords').then(({response})=> {expect(response.statusCode).to.eq(200)});

    const assetNames = [
      assetDescription2
    ];

    assetNames.forEach((element) => {
      cy.deleteQTRecord(element);
    });
    
    cy.clickOndeleteBtnBulkAction(routes.retrieveAssetByOptionsUrl);
    cy.verifyDeletedItem(assetDescription2, 'No assets found');
  });

  it('Test Case 8960: Asset Config- Refresh', function () {
    utilFunctions.clickRefreshIcon('POST',routes.retrieveAssetByOptionsUrl);
  });




  //All the below cases are skipped as its out of scope for now
  it.skip('Verify RTU Popups', function () {
    cy.applicationLaunchPanel().click();
    cy.clickOnAppPickerItems('Administration');

    cy.verifyRTUPopUps(
      descriptionColumnLocator,
      this.data.NoRtuattacheddata,
      this.data.nestedDCRTUData
    );
  });

  it.skip('Asset config-Bulk Action-Transfer-three dot menu -Transfer back(tear down)', function () {
    cy.server();
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecords');
    cy.route('POST', routes.retrieveTransferAsset).as('transferRecord');
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecordsWait');

    cy.logout();
    cy.superLogin('dolv3qa');
    cy.navigateToAssetManager();

    cy.filterByDD().should('have.text', 'Asset Title').click();
    cy.verifyFilterByDDFields();
    cy.levelDropdown('RTU');
    cy.enterSearchField(
      routes.retrieveAssetByOptionsUrl,
      this.data.assetRTUName
    );
    cy.wait(2000);
    cy.clickOnRecordCheckBox(deviceIdLocator, this.data.assetRTUName);
    cy.get('[role="menu"]').first().findByText('Bulk Actions').click();
    cy.levelDropdown('Transfer');
    cy.wait('@transferRecord').should('have.property', 'status', 200);
    cy.enterDestinationDomain(
      '/api/RetrieveTransferAssetTargetDomainInfoById',
      'morgan'
    );
    cy.verifyAssetTransferTableDetails(
      this.data.assetRTUName,
      this.data.assetNameToTranfer
    );
    cy.clickAddButton('Transfer', routes.transferAssets);
    cy.verifyAssetTransferedDetails(
      this.data.assetRTUName,
      this.data.assetNameToTranfer
    );
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.enterSearchField(
      routes.retrieveAssetByOptionsUrl,
      this.data.assetNameToTranfer
    );
    cy.findByText(this.data.assetNameToTranfer).should('not.exist');

    cy.changeDomain('morgan');
    cy.findByText(this.data.assetNameToTranfer).should('exist');
    cy.groupByDD().click();
    cy.selectDropdown('None');
    cy.groupByDD().should('have.text', 'None');
    cy.wait(1000);
    cy.selectActionByThreeDot(
      descriptionColumnLocator,
      this.data.assetNameToTranfer,
      'Transfer',
      routes.retrieveTransferAsset
    );
    cy.enterDestinationDomain(
      '/api/RetrieveTransferAssetTargetDomainInfoById',
      'dolv3qa'
    );
    cy.verifyAssetTransferTableDetails(
      this.data.assetRTUName,
      this.data.assetNameToTranfer
    );
    cy.wait(3000);
    cy.clickAddButton('Transfer', '/api/TransferAssets');
    cy.verifyAssetTransferedDetails(
      this.data.assetRTUName,
      this.data.assetNameToTranfer
    );
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl); //remove later when error is fixed
    cy.enterSearchField(
      routes.retrieveAssetByOptionsUrl,
      this.data.assetNameToTranfer
    );
    cy.findByText(this.data.assetNameToTranfer).should('not.exist');

    cy.changeDomain('dolv3qa');
    cy.findByText(this.data.assetNameToTranfer).should('exist');
  });

  it.skip('Test Case 11383: Asset config-Bulk Action-Transfer-Non VOL with DU-three dot menu -Transfer back(tear down)', function () {
    const sourceDomain = 'Technet',
      destinationDomain = 'Morgan',
      destinationDomain2 = 'Technet',
      RTUid = 'E1003E25',
      assetRTUName =
        'Accusantium voluptatem molestiae fugit ea odit possimus provident labore.';

    cy.server();
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecords');
    cy.route('POST', routes.retrieveTransferAsset).as('transferRecord');
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecordsWait');

    cy.logout();
    cy.superLogin(sourceDomain);
    cy.navigateToAssetManager();
    cy.filterByDD().click();
    cy.verifyFilterByDDFields();
    cy.levelDropdown('RTU');
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, RTUid);
    cy.wait(2000);
    cy.clickOnRecordCheckBox('tbody [aria-label="Device Id"]', RTUid);
    cy.get('[role="menu"]').first().findByText('Bulk Actions').click();
    cy.levelDropdown('Transfer');
    cy.wait('@transferRecord').should('have.property', 'status', 200);
    cy.enterDestinationDomain(
      routes.retrieveTransferAssetTargetDomainInfoById,
      destinationDomain
    );
    cy.verifyAssetTransferTableDetails(RTUid, assetRTUName);

    cy.verifyByDefaultTransferPageCheckbox();
    cy.clickAddButton('Transfer', routes.transferAssets);
    cy.verifyAssetTransferedDetails(RTUid, assetRTUName);
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, assetRTUName);
    cy.findByText(assetRTUName).should('not.exist');

    cy.changeDomain(destinationDomain);
    cy.findByText(assetRTUName).should('exist');
    cy.groupByDD().click();
    cy.selectDropdown('None');
    cy.groupByDD().should('have.text', 'None');
    cy.wait(1000);
    cy.selectActionByThreeDot(
      descriptionColumnLocator,
      assetRTUName,
      'Transfer',
      routes.retrieveTransferAsset
    );
    cy.enterDestinationDomain(
      routes.retrieveTransferAssetTargetDomainInfoById,
      destinationDomain2
    );
    cy.verifyAssetTransferTableDetails(RTUid, assetRTUName);
    cy.verifyByDefaultTransferPageCheckbox();
    cy.clickAddButton('Transfer', routes.transferAssets);
    cy.verifyAssetTransferedDetails(RTUid, assetRTUName);
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, assetRTUName);
    cy.findByText(assetRTUName).should('not.exist');

    cy.changeDomain(destinationDomain2);
    cy.findByText(assetRTUName).should('exist');
  });

  it.skip('Test Case 11398: Asset config-Bulk Action-Transfer-HISO Asset-three dot menu -Transfer back(tear down)', function () {
    const sourceDomain = 'JUICE',
      destinationDomain = 'Morgan',
      destinationDomain2 = 'JUICE',
      RTUid = 'E10048E5',
      assetRTUName = 'Aut illum harum qui iusto voluptate debitis enim.';

    cy.server();
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecords');
    cy.route('POST', routes.retrieveTransferAsset).as('transferRecord');
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecordsWait');

    cy.logout();
    cy.superLogin(sourceDomain);
    cy.navigateToAssetManager();
    cy.filterByDD().click();
    cy.verifyFilterByDDFields();
    cy.levelDropdown('RTU');
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, RTUid);
    cy.wait(2000);
    cy.clickOnRecordCheckBox('tbody [aria-label="Device Id"]', RTUid);
    cy.get('[role="menu"]').first().findByText('Bulk Actions').click();
    cy.levelDropdown('Transfer');
    cy.wait('@transferRecord').should('have.property', 'status', 200);
    cy.enterDestinationDomain(
      routes.retrieveTransferAssetTargetDomainInfoById,
      destinationDomain
    );
    cy.verifyAssetTransferTableDetails(RTUid, assetRTUName);
    cy.verifyByDefaultTransferPageCheckbox();
    cy.clickAddButton('Transfer', routes.transferAssets);
    cy.verifyAssetTransferedDetails(RTUid, assetRTUName);
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, assetRTUName);
    cy.findByText(assetRTUName).should('not.exist');

    cy.changeDomain(destinationDomain);
    cy.findByText(assetRTUName).should('exist');
    cy.groupByDD().click();
    cy.selectDropdown('None');
    cy.groupByDD().should('have.text', 'None');
    cy.wait(1000);
    cy.selectActionByThreeDot(
      descriptionColumnLocator,
      assetRTUName,
      'Transfer',
      routes.retrieveTransferAsset
    );
    cy.enterDestinationDomain(
      routes.retrieveTransferAssetTargetDomainInfoById,
      destinationDomain2
    );
    cy.verifyAssetTransferTableDetails(RTUid, assetRTUName);
    cy.verifyByDefaultTransferPageCheckbox();
    cy.clickAddButton('Transfer', routes.transferAssets);
    cy.verifyAssetTransferedDetails(RTUid, assetRTUName);
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, assetRTUName);
    cy.findByText(assetRTUName).should('not.exist');

    cy.changeDomain(destinationDomain2);
    cy.findByText(assetRTUName).should('exist');
  });

  it.skip('Test Case 11391: Asset config-Bulk Action-Transfer-VOL Asset-three dot menu -Transfer back(tear down)', function () {
    const sourceDomain = 'Fourseasons',
      destinationDomain = 'Morgan',
      destinationDomain2 = 'Fourseasons',
      RTUid = 'E1005E90',
      assetRTUName = 'Eaque vero atque sint dolores.';

    cy.server();
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecords');
    cy.route('POST', routes.retrieveTransferAsset).as('transferRecord');
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecordsWait');

    cy.logout();
    cy.superLogin(sourceDomain);
    cy.navigateToAssetManager();
    cy.filterByDD().click();
    cy.verifyFilterByDDFields();
    cy.levelDropdown('RTU');
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, RTUid);
    cy.wait(2000);
    cy.clickOnRecordCheckBox('tbody [aria-label="Device Id"]', RTUid);
    cy.get('[role="menu"]').first().findByText('Bulk Actions').click();
    cy.levelDropdown('Transfer');
    cy.wait('@transferRecord').should('have.property', 'status', 200);
    cy.enterDestinationDomain(
      routes.retrieveTransferAssetTargetDomainInfoById,
      destinationDomain
    );
    cy.verifyAssetTransferTableDetails(RTUid, assetRTUName);

    cy.verifyByDefaultTransferPageCheckbox();
    cy.clickAddButton('Transfer', routes.transferAssets);
    cy.verifyAssetTransferedDetails(RTUid, assetRTUName);
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, assetRTUName);
    cy.findByText(assetRTUName).should('not.exist');

    cy.changeDomain(destinationDomain);
    cy.findByText(assetRTUName).should('exist');
    cy.groupByDD().click();
    cy.selectDropdown('None');
    cy.groupByDD().should('have.text', 'None');
    cy.wait(1000);
    cy.selectActionByThreeDot(
      descriptionColumnLocator,
      assetRTUName,
      'Transfer',
      routes.retrieveTransferAsset
    );
    cy.enterDestinationDomain(
      routes.retrieveTransferAssetTargetDomainInfoById,
      destinationDomain2
    );
    cy.verifyAssetTransferTableDetails(RTUid, assetRTUName);
    cy.verifyByDefaultTransferPageCheckbox();
    cy.clickAddButton('Transfer', routes.transferAssets);
    cy.verifyAssetTransferedDetails(RTUid, assetRTUName);
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, assetRTUName);
    cy.findByText(assetRTUName).should('not.exist');

    cy.changeDomain(destinationDomain2);
    cy.findByText(assetRTUName).should('exist');
  });

  it.skip('Test Case 11340: Asset Config-Bulk Action-Copy-Non Volumetric with DU Asset -with Same Site -same RTU for all DCs-Copy & view details', function () {
    const domain = 'Technet',
      asset =
        'Accusantium voluptatem molestiae fugit ea odit possimus provident labore.',
      RTUforSEARCH = 'E1003E25',
      RTUToCopy = 'E1005147',
      uniqueAssetNameToCopy = 'non-Volumetric with DU Asset copy',
      siteToCopy = 'Abshire-Bins West Ulises Wisconsin';

    cy.server();
    cy.route('POST', routes.retrieveAssetCopyEditComponentsById).as(
      'copyRecords'
    );
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecordsWait');
    cy.route('POST', routes.updateUserPreferredTimeZone).as(
      'assetRecordsTimeWait'
    );

    cy.changeDomain(domain);
    cy.filterByDD().click();
    cy.verifyFilterByDDFields();
    cy.levelDropdown('Asset Title');
    utilFunctions.itemsCountPaginationBefore();
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, asset);
    cy.clickOnRecordCheckBox(deviceIdLocator, RTUforSEARCH);
    cy.get('[role="menu"]').first().findByText('Bulk Actions').click();
    cy.levelDropdown('Copy');
    cy.wait('@copyRecords').should('have.property', 'status', 200);
    cy.findAllByText('Copy Asset').should('exist');
    cy.enterAssetInfoToCopy(
      uniqueAssetNameToCopy,
      siteToCopy,
      'Test Technician'
    );
    cy.enterDataChannelsDetailsToCopy(RTUToCopy, '1', 'notes added');
    cy.clickButton('Copy');
    cy.clickAddButton('Copy & View Detail', routes.saveAssetCopy);
    cy.findByText('Edit Asset').should('exist');
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.enterSearchField(
      routes.retrieveAssetByOptionsUrl,
      uniqueAssetNameToCopy
    );
    cy.findByText(uniqueAssetNameToCopy).should('exist');
    cy.selectDeleteByThreeDot(
      assetDescriptionLocator,
      uniqueAssetNameToCopy,
      'Delete',
      routes.retrieveAssetByOptionsUrl
    );
    cy.verifyDeletePopup(uniqueAssetNameToCopy, 'Yes');

    cy.get('[type="text"]').clear();
    cy.applyButton().click();
  });

  it.skip('Test Case 11343: Asset Config-Bulk Action-Copy-Volumetric Asset -with Same Site -same RTU for all DCs-Copy & view details', function () {
    const domain = 'Fourseasons',
      asset = 'Eaque vero atque sint dolores.',
      RTUforSEARCH = 'E1005E90',
      RTUToCopy = 'E1001668',
      uniqueAssetNameToCopy = 'Volumetric Asset copy',
      siteToCopy = 'Activewear Ironcraft Inc. Marquette AZ';

    cy.server();
    cy.route('POST', routes.retrieveAssetCopyEditComponentsById).as(
      'copyRecords'
    );
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecordsWait');
    cy.route('POST', routes.updateUserPreferredTimeZone).as(
      'assetRecordsTimeWait'
    );

    cy.changeDomain(domain);

    cy.filterByDD().click();
    cy.verifyFilterByDDFields();
    cy.levelDropdown('RTU');
    utilFunctions.itemsCountPaginationBefore();
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, RTUforSEARCH);
    cy.clickOnRecordCheckBox(deviceIdLocator, RTUforSEARCH);
    cy.get('[role="menu"]').first().findByText('Bulk Actions').click();
    cy.levelDropdown('Copy');
    cy.wait('@copyRecords').should('have.property', 'status', 200);
    cy.findAllByText('Copy Asset').should('exist');
    cy.enterAssetInfoToCopy(
      uniqueAssetNameToCopy,
      siteToCopy,
      'Test Technician'
    );
    cy.enterDataChannelsDetailsToCopy(RTUToCopy, '1', 'notes added');
    cy.clickButton('Copy');
    cy.clickAddButton('Copy & View Detail', routes.saveAssetCopy);
    cy.findByText('Edit Asset').should('exist');
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);

    utilFunctions.verifyItemsCountPaginationAfter(1);

    cy.enterSearchField(
      routes.retrieveAssetByOptionsUrl,
      uniqueAssetNameToCopy
    );
    cy.findByText(uniqueAssetNameToCopy).should('exist');
    cy.selectDeleteByThreeDot(
      assetDescriptionLocator,
      uniqueAssetNameToCopy,
      'Delete',
      routes.retrieveAssetByOptionsUrl
    );
    cy.verifyDeletePopup(uniqueAssetNameToCopy, 'Yes');

    cy.get('[type="text"]').clear();
    cy.applyButton().click();
  });

  it.skip('Test Case 11344: Asset Config-Bulk Action-Copy-Helium ISO Asset -with Same Site -same RTU for all DCs-Copy & view details', function () {
    const domain = 'JUICE',
      asset = 'Aut illum harum qui iusto voluptate debitis enim.',
      RTUforSEARCH = 'E10048E5',
      RTUToCopy = 'E10060A2',
      uniqueAssetNameToCopy = 'HISO Asset copy',
      siteToCopy = 'Archibv Goldthorpe Co.';

    cy.server();
    cy.route('POST', routes.retrieveAssetCopyEditComponentsById).as(
      'copyRecords'
    );
    cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecordsWait');
    cy.route('POST', routes.updateUserPreferredTimeZone).as(
      'assetRecordsTimeWait'
    );

    cy.changeDomain(domain);

    cy.filterByDD().click();
    cy.verifyFilterByDDFields();
    cy.levelDropdown('RTU');
    utilFunctions.itemsCountPaginationBefore();
    cy.enterSearchField(routes.retrieveAssetByOptionsUrl, RTUforSEARCH);
    cy.clickOnRecordCheckBox(deviceIdLocator, RTUforSEARCH);
    cy.get('[role="menu"]').first().findByText('Bulk Actions').click();
    cy.levelDropdown('Copy');
    cy.wait('@copyRecords').should('have.property', 'status', 200);
    cy.findAllByText('Copy Asset').should('exist');
    cy.enterAssetInfoToCopy(
      uniqueAssetNameToCopy,
      siteToCopy,
      'Test Technician'
    );
    cy.enterDataChannelsDetailsToCopy(RTUToCopy, '1', 'notes added');
    cy.clickButton('Copy');
    cy.clickAddButton('Copy & View Detail', routes.saveAssetCopy);
    cy.findByText('Edit Asset').should('exist');
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);

    utilFunctions.verifyItemsCountPaginationAfter(1);

    cy.enterSearchField(
      routes.retrieveAssetByOptionsUrl,
      uniqueAssetNameToCopy
    );
    cy.findByText(uniqueAssetNameToCopy).should('exist');
    cy.selectDeleteByThreeDot(
      assetDescriptionLocator,
      uniqueAssetNameToCopy,
      'Delete',
      routes.retrieveAssetByOptionsUrl
    );
    cy.verifyDeletePopup(uniqueAssetNameToCopy, 'Yes');

    cy.get('[type="text"]').clear();
    cy.applyButton().click();
  });



  //Remove these
  it.skip('Test Case 9300: Asset Config-Add-Type Tank-Site auto complete-Mobile Asset-Click back-Resume', function () {
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.applicationLaunchPanel().click();
    cy.clickOnAppPickerItems('Administration');
    cy.waitProgressBarToDisappear();
    utilFunctions.itemsCountPaginationBefore();
    cy.clickAddButton('Add', routes.retrieveAssetEditByIdUrl);

    assetDescription5 = utilFunctions.suffixWithDate(this.data.addAsset5);
    cy.addAssetDetailsAllFields(
      assetDescription5,
      'Tank',
      'Default Rule Group',
      'tech 1',
      'test int 2',
      'anova Oakville ON',
      'Karachi-Kuwait route',
      'hello world'
    );

    cy.go('back');
    cy.VerifySaveChangesPopUp();
    cy.clickOnResume('Add Asset');
    cy.clickAddButton('Save & Close', routes.saveAssetEditUrl);
    cy.wait('@retrieveRecords').should('have.property', 'status', 200);
    cy.findByText('Asset Configuration Manager').should('be.visible');

    cy.clickOnAsset(assetDescription5);
    cy.verifyAssetDetailAllFields(
      'Edit Asset',
      'Tank',
      assetDescription5,
      'Default Rule Group',
      'tech 1',
      'test int 2',
      'anova Oakville ON',
      'Karachi-Kuwait route',
      'hello world'
    );

    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.waitProgressBarToDisappear();
    utilFunctions.verifyItemsCountPaginationAfter(1);
  });

  it.skip('Test Case 9353: Asset Config-Add-Type (None-Error-Tank)-Site edit-Save', function () {
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.applicationLaunchPanel().click();
    cy.clickOnAppPickerItems('Administration');

    utilFunctions.itemsCountPaginationBefore();
    cy.clickAddButton('Add', routes.retrieveAssetEditByIdUrl);

    assetDescription6 = utilFunctions.suffixWithDate(this.data.addAsset6);
    cy.addAssetDetails(
      assetDescription6,
      'None',
      'Default Rule Group',
      'test tech',
      '1121',
      'hello world'
    );
    cy.addSiteField(siteName);

    cy.clickButton('Save');
    cy.findAllByText('Unsupported asset type.').should('exist');
    cy.assetType().should('be.visible').click();
    cy.levelDropdown('Tank');
    cy.findAllByText('Unsupported asset type.').should('not.exist');

    cy.clickAddButton('Save & Close', routes.saveAssetEditUrl);
    cy.wait('@retrieveRecords').should('have.property', 'status', 200);
    cy.findByText('Asset Configuration Manager').should('be.visible');

    cy.clickOnAsset(assetDescription6);
    cy.verifyAssetDetails(
      'Edit Asset',
      'Tank',
      assetDescription6,
      'Default Rule Group',
      'test tech',
      '1121',
      'Anova123 Oakville ON',
      'hello world'
    );

    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    cy.waitProgressBarToDisappear();
    utilFunctions.verifyItemsCountPaginationAfter(1);
  });

  it.skip('Test Case 9288: Asset Config-Add-Type Tank-Site auto complete-Mobile Asset-Save', function () {
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.applicationLaunchPanel().click();
    cy.clickOnAppPickerItems('Administration');

    cy.clickAddButton('Add', routes.retrieveAssetEditByIdUrl);
    assetDescription = utilFunctions.suffixWithDate(this.data.addAsset);
    cy.addAssetDetailsAllFields(
      assetDescription,
      'Tank',
      'Default Rule Group',
      'test',
      '1121abcd',
      'anova Oakville ON',
      'Karachi-Kuwait route',
      'test notes 1234@#$%^&'
    );

    cy.clickAddButton('Save', routes.saveAssetEditUrl);

    cy.findByText('Edit Asset').should('exist');
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);

    cy.clickOnAsset(assetDescription);
    cy.verifyAssetDetailAllFields(
      'Edit Asset',
      'Tank',
      assetDescription,
      'Default Rule Group',
      'test',
      '1121abcd',
      'anova Oakville ON',
      'Karachi-Kuwait route',
      'test notes 1234@#$%^&'
    );

    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
  });

  it.skip('Test Case 9294: Asset Config-Add-Type Tank-Site edit-Save', function () {
    cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
    cy.applicationLaunchPanel().click();
    cy.clickOnAppPickerItems('Administration');

    utilFunctions.itemsCountPaginationBefore();
    cy.clickAddButton('Add', routes.retrieveAssetEditByIdUrl);
    assetDescription2 = utilFunctions.suffixWithDate(this.data.addAsset2);
    cy.addAssetDetailAndEditSite(
      assetDescription2,
      'Tank',
      'Default Rule Group',
      'test2',
      '5566pol',
      'test add 6789:{><',
      'Lockers Technik Co.',
      '12'
    );

    cy.clickAddButton('Save', routes.saveAssetEditUrl);

    cy.findByText('Edit Asset').should('exist');
    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);

    cy.clickOnAsset(assetDescription2);
    cy.verifyAssetDetails(
      'Edit Asset',
      'Tank',
      assetDescription2,
      'Default Rule Group',
      'test2',
      '5566pol',
      'Lockers Technik Co.12',
      'test add 6789:{><'
    );

    cy.goBack('POST',routes.retrieveAssetByOptionsUrl);
    utilFunctions.verifyItemsCountPaginationAfter(1);
  });

});
