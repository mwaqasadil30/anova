/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const config = require('../../../../fixtures/example.json');
const utilFunctions = new UtilFunctions();
describe('Tank Dimension Test Cases', function () {
  
let tankNameLocator= 'tbody [aria-label="Description"]',
    uniqueTankDesc,
    uniqueTankDesc2,
    uniqueTankDesc3,
    uniqueTankDesc4,
    uniqueEditTankDesc;

  beforeEach(function () {
    cy.fixture('example.json').as('config');
   
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('TC:7723 - Set UP-As Super User .',{retries : 10}, function () {
    cy.login();
  });

  it('TC:7850 - Tank Dimensions Manager View ', function () {
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });
    cy.viewAsset(
      '[href="/admin/tank-dimensions-manager"]',
      'Tank Dimensions Manager',
      routes.retrieveTankByDomainUrl
    );
  });

  it('TC:7825 - Add-Tank -Horizontal with Ellipsoidal ends-with Generate strapping points -(save- error- save)', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    let horizontalTankWithEllipsidalEndsImage =
      '[aria-label="Horizontal with 2:1 Ellipsoidal Ends tank"]';
    cy.clickAddButton('Add Tank', routes.retrieveTankEditByIdUrl);

    cy.enterTankDimensionDetailsWithStrappingPoints(
      'Add Tank Dimensions',
      ' ',
      'Horizontal with 2:1 Ellipsoidal Ends',
      horizontalTankWithEllipsidalEndsImage,
      'in',
      '70',
      '55.5',
      'm',
      'm3'
    );

    cy.clickAddButton('Save', routes.saveTankUrl);
    cy.findAllByText('Description is required.').should('exist');

    uniqueTankDesc = utilFunctions.suffixWithDate(config.tankDesc);
    cy.tankDescription().clear().type(uniqueTankDesc);
    cy.clickAddButton('Save', routes.retrieveTankEditByIdUrl);
    cy.findByText('Edit Tank Dimensions').should('exist');
    cy.goBack('POST',routes.retrieveTankByDomainUrl);
  });

  it('TC:7827 - Add-Tank-Vertical with Ellipsoidal ends-with Generate strapping points -(save- error- save&exit)', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    let verticalTankWithEllipsidalEndsImage =
      '[aria-label="Vertical with 2:1 Ellipsoidal Ends tank"]';
    utilFunctions.itemsCountBefore();
    cy.clickAddButton('Add Tank', routes.retrieveTankEditByIdUrl);

    cy.enterTankDimensionDetailsWithStrappingPoints(
      'Add Tank Dimensions',
      ' ',
      'Vertical with 2:1 Ellipsoidal Ends',
      verticalTankWithEllipsidalEndsImage,
      'in',
      '60',
      '36',
      'in',
      'in3'
    );

    cy.clickAddButton('Save', routes.saveTankUrl);
    cy.findAllByText('Description is required.').should('exist');

    uniqueTankDesc2 = utilFunctions.suffixWithDate(config.tankDesc2);
    cy.tankDescription().clear().type(uniqueTankDesc2);
    cy.clickAddButton('Save', routes.retrieveTankEditByIdUrl);
    cy.findByText('Edit Tank Dimensions').should('exist');
    cy.goBack('POST',routes.retrieveTankByDomainUrl);

    utilFunctions.verifyItemsCountAfter(1);
  });

  it('TC:7828 - Add-Tank-Horizontal with Variable dished ends-with entering strapping points  manually -(save&exit)', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    let horizontalTankWithVariableDishedEndsImage =
      '[aria-label="Horizontal with Variable Dished Ends tank"]';
    utilFunctions.itemsCountBefore();

    cy.clickAddButton('Add Tank', routes.retrieveTankEditByIdUrl);
    uniqueTankDesc3 = utilFunctions.suffixWithDate(config.tankDesc3);

    cy.enterTankDimensionWithManualStrappingPoints(
      'Add Tank Dimensions',
      uniqueTankDesc3,
      'Horizontal with Variable Dished Ends',
      horizontalTankWithVariableDishedEndsImage,
      'in',
      '168',
      '106',
      '18',
      'in',
      'gal US'
    );

    cy.clickAddButton('Save & Close', routes.retrieveTankByDomainUrl);
    cy.findByText('Tank Dimensions Manager').should('exist');

    utilFunctions.verifyItemsCountAfter(1);
  });

  it('TC:8687 - Add-Tank -Type None-(save-error-save& exit)', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    cy.clickAddButton('Add Tank', routes.retrieveTankEditByIdUrl);

    cy.tankType().click();
    cy.levelDropdown('None');

    cy.strappingCheckbox().should('not.be.checked');
    cy.clickButton('Save');
    cy.wait(1000);

    //Validation Error messages
    cy.findAllByText('Description is required.').should('exist');
    cy.findAllByText(
      'Tank Type cannot be None unless Strapping Points are provided.'
    ).should('exist');

    cy.tankDescription().type('Test tank None');
    cy.strappingCheckbox().check().should('be.checked');

    cy.clickCancelButton(routes.retrieveTankEditByIdUrl);
    cy.goBack('POST',routes.retrieveTankByDomainUrl);
  });

  it('TC:7833 - Add-Tank-Vertical with conical bottom End-with No Strapping points -(save&exit)', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    let verticalWithConicalBottomEndImage =
      '[aria-label="Vertical with Conical Bottom End tank"]';
    utilFunctions.itemsCountBefore();

    cy.clickAddButton('Add Tank', routes.retrieveTankEditByIdUrl);
    uniqueTankDesc4 = utilFunctions.suffixWithDate(config.tankDesc4);
    cy.enterConicalTankDetails(
      'Add Tank Dimensions',
      uniqueTankDesc4,
      'Vertical with Conical Bottom End',
      verticalWithConicalBottomEndImage,
      'mm',
      '3600',
      '2850',
      '520'
    );

    cy.clickAddButton('Save & Close', routes.retrieveTankByDomainUrl);
    cy.findByText('Tank Dimensions Manager').should('exist');
    utilFunctions.verifyItemsCountAfter(1);
  });

  it('TC:7834 - Add-Tank-Horizontal with hemispherical Ends-with No Strapping points -(cancel)', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    let horizontalWithHemisphericalEndsImage =
      '[aria-label="Horizontal with Hemispherical Ends tank"]';
    cy.clickAddButton('Add Tank', routes.retrieveTankEditByIdUrl);

    cy.enterTankDimensionDetails(
      'Add Tank Dimensions',
      'Horizontal tank',
      'Horizontal with Hemispherical Ends',
      horizontalWithHemisphericalEndsImage,
      'ft',
      '18',
      '16'
    );

    cy.clickCancelButton(routes.retrieveTankEditByIdUrl);
    cy.verifyTankFieldsAreClear();
    cy.findByText('Add Tank Dimensions').should('exist');
    cy.goBack('POST',routes.retrieveTankByDomainUrl);
  });

  it('TC:7837 - Edit-Tank-any existing to Vertical with Hemispherical ends-with Generate strapping points -(save- error- save&exit)', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    let verticalWithHemisphericalEndsImage =
      '[aria-label="Vertical with Hemispherical Ends tank"]';
    utilFunctions.itemsCountBefore();

    cy.selectItemfromTankList(uniqueTankDesc4, routes.retrieveTankEditByIdUrl);

    cy.editTankDimensionDetails(
      'Edit Tank Dimensions',
      uniqueTankDesc,
      'Vertical with Hemispherical Ends',
      verticalWithHemisphericalEndsImage,
      'ft',
      '12',
      '6'
    );
    cy.verifybyDefaultStrappingPoints();
    cy.clickAddButton('Save', routes.saveTankUrl);
    cy.findAllByText(
      'There is already a Tank Dimension with this name.'
    ).should('exist');

    uniqueEditTankDesc = utilFunctions.suffixWithDate(config.editTankDesc);

    cy.tankDescription().clear().type(uniqueEditTankDesc);
    cy.clickAddButton('Save', routes.retrieveTankEditByIdUrl);
    cy.findByText('Edit Tank Dimensions').should('exist');
    cy.goBack('POST',routes.retrieveTankByDomainUrl);
    utilFunctions.verifyItemsCountAfter(0);
  });

  it('TC:7838 - Edit-Tank-Horizontal with Flat Ends-with No Strapping points -(cancel))', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    let horizontalWithFlatEndsImage =
      '[aria-label="Horizontal with Flat Ends tank"]';
    utilFunctions.itemsCountBefore();



    cy.selectItemfromTankList(uniqueTankDesc2, routes.retrieveTankEditByIdUrl);

    cy.editTankDimensionDetails(
      'Edit Tank Dimensions',
      'edit Horizontal tank',
      'Horizontal with Flat Ends',
      horizontalWithFlatEndsImage,
      'ft',
      '12',
      '6'
    );

    cy.clickCancelButton(routes.retrieveTankEditByIdUrl);
    cy.findByText('Edit Tank Dimensions').should('exist');
    cy.goBack('POST',routes.retrieveTankByDomainUrl);

    utilFunctions.verifyItemsCountAfter(0);
  });

  it('TC:7773 - Tank Dimension-Filter By - Few alphabets from middle of Tank name ', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    const myString = utilFunctions.splitStrings(uniqueTankDesc2);
    cy.verifyGroupFilters('[aria-label="Description"]', myString[1]);
  });

  it('TC:7776 - Tank Dimensions Delete- 1-Three dot Menu', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    cy.searchField().clear();
    cy.applyButton().click();
    cy.wait(1000);
    cy.deleteObjectByThreeDot('POST',routes.retrieveTankByDomainUrl,tankNameLocator,uniqueTankDesc);
    cy.verifyTankDeletedItem(config.tankDesc, 'No tank dimensions found');
  });

  it('TC:7778 -Tank Dimensions-Delete All created during Tank dimensions testing -2-With Delete selected', function () {
    cy.verifyPageUrl('POST',routes.tankDimensionManagerUrl, routes.retrieveTankByDomainUrl);
    cy.searchField().clear().type(utilFunctions.getCurrentDate());
    cy.applyButton().click();

    const tankNames = [
      uniqueTankDesc2,
      uniqueTankDesc3,
      uniqueTankDesc4,
      uniqueEditTankDesc,
    ];

    tankNames.forEach((element) => {
      cy.deleteTankRecord(element);
    });

    cy.clickOndeleteSelectedButton(routes.retrieveTankByDomainUrl);

    tankNames.forEach((element) => {
      cy.verifyTankDeletedItem(element, 'No tank dimensions found');
    });
  });

  it('TC:7777 - Tank Dimensions - Refresh', function () {
    utilFunctions.clickRefreshIcon('POST',routes.retrieveTankByDomainUrl);
  });
});
