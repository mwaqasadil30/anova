import quickTankAPIPage from '../../support/APIpages/quickTankAPIPage';
const quickTank = new quickTankAPIPage();

describe('Quick Tank API Automation', function () {
       
   beforeEach(function () {
      // Preserve only the session cookie in every test
      Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return cookie && cookie.name === '.AspNetCore.Session';
         },
      });
   });

   it('POST - Login User',{retries : 10}, () => {
    quickTank.loginUser();
   });

   it('Pre-requiste: Retrieve data to create Quick Tank',()=>{
    quickTank.retrieveRTUid();
    quickTank.retrievePreRequisiteDataToCreateQuickTank();
   });

   it('Test Case 9028: QT-Add-Data Source RTU-Tank Dimensions not set-with display Unit -Site & Product auto complete-Asset integration enabled -Add new bulk Tank on Save Modal Save & Exit -check report', function () {
    quickTank.createQuick_TankAsset_IntegrationEnabled();
   });

   it('Test Case 9126: QT-Add-Data Source RTU--Set Tank Dimensions-Site and Product Edit -Save&Exit -view details on save Modal -exit', function () {
    quickTank.createQuick_TankAsset_SetTankDimensions();
   });

   //Bug
   it.skip('Test Case 9079: QT- Add-Data Source Published DC-Tank dimensions not set-Add new Site & Product-cancel-Refill-Save&Exit-save Modal-Exit', function () {
    quickTank.createQuick_DataSourcePublishedDC_TankNotSet();
   });

   it('Test Case 9110: QT-Add-with Custom Properties-Data Source RTU-save&exit', function () {
    quickTank.createQuick_DataSourceRTU_CustomProperties();
   });

   it('Test Case 9138: QT- Bulk Action-Delete-Tear down',()=>{
    quickTank.deleteHISOAndVerifyDeletedItems();   
   });
});