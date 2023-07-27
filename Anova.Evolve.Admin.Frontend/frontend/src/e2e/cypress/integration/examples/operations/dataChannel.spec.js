const routes = require('../../../fixtures/routes.json');
import UtilFunctions from '../../../support/utils/UtilFunctions';
const utilFunctions = new UtilFunctions();

//skipping this because it is not fully developed 
describe.skip('Data Channel Test suite', function () {

  beforeEach(function () {
    
    cy.viewport(1440, 900);
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('Set UP-1-As Single domain User .', function () {

    cy.login();

    });

  it('Navigate to Operations app -Asset summary ', function () {
   
    cy.navigateToAppPicker('POST','Operations', routes.getAssetSummaryByOptionUrl);
    cy.waitProgressBarToDisappear();
    cy.assetSummaryIcon().click();
    cy.pageHeader().should('have.text', 'Asset Summary');
    cy.url().should('include', 'ops/asset-summary');

    });

  it('Navigate to Asset Detail and then to Data Channel Editor ', function () {

    cy.navigateToAssetDetailsAndToDataChannel();

    });


  it('Verify fields visibility for GENERAL INFORMATION', function () {

    cy.generalInformationFields();
  
    })
  

  it('Verify fields visibility for CENSOR CALIBRATION', function () {

     cy.sensorCalibrationFields();
    
    })


  it('Verify that the Asset Info and General Information is returning correct information to client', function () {
        
     cy.returnGeneralInformation();
      
    })


  it('Verify totalizer data channel information', function () {

     cy.totalizerDataChannelFields();
 
    })


  it('Verify fields visibility for INTEGRATION PROFILE Verison 1', function () {

    cy.integrationProfileFieldsInformation();
   
    })

  it('Verify Warning Modal when user sets Set As Master to True', function () {

    cy.warningModalMaster();

    })

  it('Verify Return all rtu channels for a given rtu', function () {

    cy.verifyRTUs();

    })

  it('Verify fields visibility for TANK SETUP', function () {

    cy.verifyTankSetupFields();
    
    })
    
  it('Verify fields visibility for TANK SETUP Side Drawer - BASIC', function () {
    
    cy.verifyTankSetupBasicFields();
    
    })

  it('Verify fields visibility for TANK SETUP Side Drawer - SIMPLIFIED VOLUMETRIC', function () {
    
    cy.verifyTankSetupSimplifiedVolumetricFields();
    
    })

  it('Verify fields visibility for TANK SETUP Side Drawer - VOLUMETRIC', function () {
    
    cy.verifyTankSetupVolumetricFields();
    
    })

  it('Verify fields visibility for FORECAST AND DELIVERY PARAMETERS Side Drawer', function () {
    
      cy.verifyForecastAndDelieveryParametersFields();
      
      })  
    
})