import UtilFunctions from '../utils/UtilFunctions';
const routes = require('../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();

let domainId = null,
userId = null,
siteName = 'Bulk Strata Ltd',
eventRuleGroupId,
siteID,
geoAreaGroupId,
assetId, assetId2,assetId3,assetId4,
assetIdsArray = [];

class assetConfigurationAPIPage {

 loginUser() {
    var loginPayload = {
        "username": Cypress.env('USERNAME'),
        "password": Cypress.env('PASS')
     }
     cy.request(
        'POST',Cypress.config('apiUrl')+routes.authenticateAppUrl,
        loginPayload,
     ).then(response => {
        expect(response.status).equal(200)
        expect(response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.username.toLowerCase()).equal(loginPayload.username.toLowerCase())

        domainId = response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.domainId;
        userId = response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.userId;

     });
 }

 retrieveSiteDetails(){

    //Retrive site ID
    var sitePayload = {
        "options":{
           "isCountRequired":true,
           "userId":userId,
           "domainId":domainId,
           "pageIndex":0,
           "itemsPerPage":10,
           "filterText":"*"+siteName+"*",
           "filterBy":0,
           "sortColumnName":"city",
           "sortDirection":0,
           "groupBy":1
        }
     };
      cy.request(
        'POST',Cypress.config('apiUrl')+routes.retrieveSiteByOptionsUrl,
        sitePayload,
     ).then(response => {
        expect(response.status).equal(200)
        siteID = response.body.retrieveSiteInfoRecordsByOptionsResult.records[0].siteId;
     });
 }

 retrievePreRequisiteDataToCreateAsset(){
 
    var assetEditDetailsPayload = {"assetId":"00000000-0000-0000-0000-000000000000"}

    cy.request(
        'POST',Cypress.config('apiUrl')+routes.retrieveAssetEditByIdUrl,
        assetEditDetailsPayload,
     ).then(response => {
        expect(response.status).equal(200);

      geoAreaGroupId = response.body.assetEditOptions.geoAreaGroups[0].geoAreaGroupId;
      eventRuleGroupId = response.body.assetEditOptions.eventRuleGroups[0].eventRuleGroupId;
     });
 }

 addTankMobileAssetWithNewSite(){

    const assetDescription = utilFunctions.suffixWithDate('MobileAsset_API_');

    var saveAssetPayload = {
          "assetId":"00000000-0000-0000-0000-000000000000",
          "description":assetDescription,
          "designCurveType":0,
          "dataChannels":[],
          "notes": utilFunctions.suffixWithDate('Notes added_'),
          "technician":"test",
          "eventRuleGroupId":eventRuleGroupId,
          "siteId":siteID,
          "integrationName":"1121abcd",
          "assetType":1,
          "domainId":domainId,
          "isMobile":true,
          "geoAreaGroupId":geoAreaGroupId,
          "customProperties":[
          ]
       }
       cy.request(
          'POST',Cypress.config('apiUrl')+routes.saveAssetEditUrl,
          saveAssetPayload,
       ).then(response => {
          expect(response.status).equal(200);
          expect(response.body.asset.assetId).to.exist;
          expect(response.body.asset.description).equal(saveAssetPayload.description);
          expect(response.body.asset.designCurveType).equal(saveAssetPayload.designCurveType);
          expect(response.body.asset.dataChannels).to.be.empty;
          expect(response.body.asset.notes).equal(saveAssetPayload.notes);
          expect(response.body.asset.installedTechName).equal(saveAssetPayload.technician);
          expect(response.body.asset.eventRuleGroupId).equal(saveAssetPayload.eventRuleGroupId);
          expect(response.body.asset.siteId).equal(saveAssetPayload.siteId);
          expect(response.body.asset.integrationName).equal(saveAssetPayload.integrationName);
          expect(response.body.asset.assetType).equal(saveAssetPayload.assetType); 
          expect(response.body.asset.domainId).equal(saveAssetPayload.domainId); 
          expect(response.body.asset.isMobile).equal(saveAssetPayload.isMobile);
          expect(response.body.asset.geoAreaGroupId).equal(saveAssetPayload.geoAreaGroupId);
 
          assetId = response.body.asset.assetId;
 
       });
 }

 addTankWithEditSite(){
    const assetDescription = utilFunctions.suffixWithDate('Asset_API_');
  
    var saveAssetPayload = {
          "assetId":"00000000-0000-0000-0000-000000000000",
          "description":assetDescription,
          "designCurveType":0,
          "dataChannels":[],
          "notes":"Notes added",
          "technician":"test",
          "eventRuleGroupId":eventRuleGroupId,
          "siteId":siteID,
          "integrationName":"1121abcd",
          "assetType":1,
          "domainId":domainId,
          "isMobile":false,
          "geoAreaGroupId":"",
          "customProperties":[]
       }
       cy.request(
          'POST',Cypress.config('apiUrl')+routes.saveAssetEditUrl,
          saveAssetPayload,
       ).then(response => {
          expect(response.status).equal(200);
          expect(response.body.asset.assetId).to.exist;
          expect(response.body.asset.description).equal(saveAssetPayload.description);
          expect(response.body.asset.designCurveType).equal(saveAssetPayload.designCurveType);
          expect(response.body.asset.dataChannels).to.be.empty;
          expect(response.body.asset.notes).equal(saveAssetPayload.notes);
          expect(response.body.asset.installedTechName).equal(saveAssetPayload.technician);
          expect(response.body.asset.eventRuleGroupId).equal(saveAssetPayload.eventRuleGroupId);
          expect(response.body.asset.siteId).equal(saveAssetPayload.siteId);
          expect(response.body.asset.integrationName).equal(saveAssetPayload.integrationName);
          expect(response.body.asset.assetType).equal(saveAssetPayload.assetType); 
          expect(response.body.asset.domainId).equal(saveAssetPayload.domainId); 
          expect(response.body.asset.isMobile).equal(saveAssetPayload.isMobile);
          expect(response.body.asset.geoAreaGroupId).to.be.null;
          
          assetId2 = response.body.asset.assetId;
       });
 }

 addHISOContainer(){
    const assetDescription = utilFunctions.suffixWithDate('HISO_Asset_API_');
  
    var saveAssetPayload = {
     "assetId":"00000000-0000-0000-0000-000000000000",
     "description":assetDescription,
     "designCurveType":3,
     "dataChannels":[],
     "notes":"notes",
     "technician":"tech",
     "eventRuleGroupId":eventRuleGroupId,
     "siteId":siteID,
     "integrationName":"73yshs",
     "assetType":2,
     "domainId":domainId,
     "isMobile":false,
     "geoAreaGroupId":"",
     "customProperties":[]
  }

       cy.request(
          'POST',Cypress.config('apiUrl')+routes.saveAssetEditUrl,
          saveAssetPayload,
       ).then(response => {
          expect(response.status).equal(200);
          expect(response.body.asset.assetId).to.exist;
          expect(response.body.asset.description).equal(saveAssetPayload.description);
          expect(response.body.asset.designCurveType).equal(saveAssetPayload.designCurveType);
          expect(response.body.asset.dataChannels).to.be.empty;
          expect(response.body.asset.notes).equal(saveAssetPayload.notes);
          expect(response.body.asset.installedTechName).equal(saveAssetPayload.technician);
          expect(response.body.asset.eventRuleGroupId).equal(saveAssetPayload.eventRuleGroupId);
          expect(response.body.asset.siteId).equal(saveAssetPayload.siteId);
          expect(response.body.asset.integrationName).equal(saveAssetPayload.integrationName);
          expect(response.body.asset.assetType).equal(saveAssetPayload.assetType); 
          expect(response.body.asset.domainId).equal(saveAssetPayload.domainId); 
          expect(response.body.asset.isMobile).equal(saveAssetPayload.isMobile);
          expect(response.body.asset.geoAreaGroupId).to.be.null;

          assetId3 = response.body.asset.assetId;
          
       });
 }
 
 addHISOContainerMobileAsset(){
    const assetDescription = utilFunctions.suffixWithDate('HISO_MobileAsset_API_');
   
    var saveAssetPayload = {
     "assetId":"00000000-0000-0000-0000-000000000000",
     "description":assetDescription,
     "designCurveType":3,
     "dataChannels":[],
     "notes":"notes",
     "technician":"tech",
     "eventRuleGroupId":eventRuleGroupId,
     "siteId":siteID,
     "integrationName":"73yshs",
     "assetType":2,
     "domainId":domainId,
     "isMobile":true,
     "geoAreaGroupId":geoAreaGroupId,
     "customProperties":[]
  }

       cy.request(
          'POST',Cypress.config('apiUrl')+routes.saveAssetEditUrl,
          saveAssetPayload,
       ).then(response => {
          expect(response.status).equal(200);
          expect(response.body.asset.assetId).to.exist;
          expect(response.body.asset.description).equal(saveAssetPayload.description);
          expect(response.body.asset.designCurveType).equal(saveAssetPayload.designCurveType);
          expect(response.body.asset.dataChannels).to.be.empty;
          expect(response.body.asset.notes).equal(saveAssetPayload.notes);
          expect(response.body.asset.installedTechName).equal(saveAssetPayload.technician);
          expect(response.body.asset.eventRuleGroupId).equal(saveAssetPayload.eventRuleGroupId);
          expect(response.body.asset.siteId).equal(saveAssetPayload.siteId);
          expect(response.body.asset.integrationName).equal(saveAssetPayload.integrationName);
          expect(response.body.asset.assetType).equal(saveAssetPayload.assetType); 
          expect(response.body.asset.domainId).equal(saveAssetPayload.domainId); 
          expect(response.body.asset.isMobile).equal(saveAssetPayload.isMobile);
          expect(response.body.asset.geoAreaGroupId).equal(saveAssetPayload.geoAreaGroupId);

          assetId4 = response.body.asset.assetId;
          
       });
 }

 addAssetTypeNone(){

    //Verify error validation message for asset type None
    const assetDescription = utilFunctions.suffixWithDate('Asset_API_');
  
     var saveAssetPayload = {
           "assetId":"00000000-0000-0000-0000-000000000000",
           "description":assetDescription,
           "designCurveType":0,
           "dataChannels":[],
           "notes":"Notes added",
           "technician":"test",
           "eventRuleGroupId":eventRuleGroupId,
           "siteId":siteID,
           "integrationName":"1121abcd",
           "assetType":0,
           "domainId":domainId,
           "isMobile":false,
           "geoAreaGroupId":"",
           "customProperties":[]
     } 
         cy.request({
         method: 'POST',
         url: Cypress.config('apiUrl')+routes.saveAssetEditUrl,
         body: saveAssetPayload,
         failOnStatusCode: false
         }).then(response => {
           expect(response.status).equal(400);
           expect(response.body.validationErrors.assetType).equal("Unsupported asset type.");
        });   
 }

 deleteAllAssetAndVerifyDeletedItems(){
    var deleteAssetPayload = {
        "assetIds":[assetId,assetId2,assetId3,assetId4]
     }

        cy.request(
           'POST',Cypress.config('apiUrl')+routes.deleteAssetById,
           deleteAssetPayload,
        ).then(response => {
           expect(response.status).equal(200);
           expect(response.body.deleteAssetsByIdListResult).to.be.true;
        });
    


   //Verify the deleted assets should not exist in the retrieve Asset info list
    var fetchAssetsPayload = {
      "options":{
      "isCountRequired":true,
      "userId":userId,
      "domainId":domainId,
      "pageIndex":0,
      "itemsPerPage":100,
      "filterText":"",
      "filterBy":0,
      "sortColumnName":"assetDescription",
      "sortDirection":0,
      "groupBy":1
     }
  }
    cy.request({ 
      method: 'POST',
      url: Cypress.config('apiUrl')+routes.retrieveAssetByOptionsUrl,
      body: fetchAssetsPayload,
      response: [] })
      .then(response => {

    let assetsResponse = response.body.retrieveAssetInfoRecordsByOptionsResult.records;
     assetIdsArray = [assetId,assetId2,assetId3,assetId4];

    const assetIdResponse =  assetsResponse.map(res => res.assetId)
    assetIdResponse.forEach(element =>{
     assetIdsArray.forEach(assets=>{

        if(element.indexOf(assets) !== -1){
           console.log('deleted asset :' +assets)
           assert.isFalse(true, 'Deleted Asset Exist');
  
       } else
       {
           assert.isTrue(true, 'Deleted Assets does not exists');
       }
     })
    });
   });
 }

}


export default assetConfigurationAPIPage;