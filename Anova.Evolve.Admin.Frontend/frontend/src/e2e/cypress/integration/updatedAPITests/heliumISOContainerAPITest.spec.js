import heliumISOContainerAPIPage from '../../support/APIpages/heliumISOContainerAPIPage';
const HISOContainer = new heliumISOContainerAPIPage();

describe('HISO Container API Automation', function () {
       
   beforeEach(function () {
      // Preserve only the session cookie in every test
      Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return cookie && cookie.name === '.AspNetCore.Session';
         },
      });
   });

   it('POST - Login User',{retries : 10}, () => {
      HISOContainer.loginUser();
   });

   it('Pre-requiste: Retrieve data to create HISO',()=>{
      HISOContainer.retrievePreRequisiteDataToCreateHISO();
   });

   it('TC 10143: HISOC-Quick Add-Helium and Nitrogen levels integration (disabled)-with custom properties not filled  -Site default-with Rate of change DC-with design curve -Save-Create new HISO Asset-Exit',()=>{
      HISOContainer.createHISOWithDesignCurveNone();
   });

   it('TC 10091: HISOC-Quick Add-Helium and Nitrogen levels integration enabled(manual)-Site default-with Rate of change DC-complex Event Rule enabled at domain-with design curve -Save-Create new HISO Asset-Exit',()=>{
      HISOContainer.createHISOWithNitrogenLevelEnabledManaulWithCustomProperties();
   });

   it('HISOC-Quick Add-Helium and Nitrogen levels integration enabled (Auto generate IDs)-No custom properties filled -Site remove default add from list-with out  RoC-simple Event Rule enabled at domain-with design curve -Cancel-Save-Exit-View details',()=>{
      HISOContainer.createHISOwithNitrogenLevelEnabledAuto();
   });

   it('Test Case 8966: Asset Config- Bulk Action-Delete(Tear down)- DeleteAssetsByIdList',()=>{
      HISOContainer.deleteHISOAndVerifyDeletedItems();   
   });
});