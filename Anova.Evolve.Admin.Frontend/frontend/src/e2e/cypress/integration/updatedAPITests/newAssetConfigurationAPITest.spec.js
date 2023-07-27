import assetConfigurationAPIPage from '../../support/APIpages/assetConfigurationAPIPage';
const assetConfiguration = new assetConfigurationAPIPage();

describe('Asset Configuration API Automation', function () {
     
   beforeEach(function () {
      // Preserve only the session cookie in every test
      Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return cookie && cookie.name === '.AspNetCore.Session';
         },
      });
   });

   it('POST - Login User',{retries : 10}, () => {
      assetConfiguration.loginUser();
   });

   it('Pre-requiste: Retrieve data to create Asset',()=>{
     assetConfiguration.retrieveSiteDetails();
     assetConfiguration.retrievePreRequisiteDataToCreateAsset();
   });

   it('Test Case 9288: Asset Config-Add-Type Tank-Site auto complete-Mobile Asset-Save',()=>{
     assetConfiguration.addTankMobileAssetWithNewSite();
   });

   it('Test Case 9294: Asset Config-Add-Type Tank-Site edit-Save',()=>{
      assetConfiguration.addTankWithEditSite();
   });

   it('Test Case 9296: Asset Config-Add-Type Helium ISO container-Add Site-Save&Exit',()=>{
      assetConfiguration.addHISOContainer();
   })

   it('Test Case 18410: Asset Config-Add-Type Helium ISO container(Mobile)-Save&Exit',()=>{
      assetConfiguration.addHISOContainerMobileAsset();
    })

   it('Test Case 9353: Asset Config-Add-Type (None-Error-Tank)-Site edit-Save',()=>{
       assetConfiguration.addAssetTypeNone();
   })

   it('Test Case 8966: Asset Config- Bulk Action-Delete(Tear down)- DeleteAssetsByIdList',()=>{
       assetConfiguration.deleteAllAssetAndVerifyDeletedItems();
   });

});