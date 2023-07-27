const routes = require('../../fixtures/routes.json');
import UtilFunctions from '../utils/UtilFunctions';
import moment from 'moment';
const utilFunctions = new UtilFunctions();

let domainId = null,
userId = null,
integrationDomainIdAutoFtpFalse,
integrationDomainIdAutoFtpTrue,
siteName = 'Bulk Strata Ltd',
assetHISODescription,
deviceID = 'E100392B',
siteID,
rtuID,
propertyTypeDirectionID,
propertyTypeNumberID,
propertyTypeOptID,
propertyTypeValueID,
assetId, assetId2,assetId3,
assetIdsArray = [];


class heliumISOContainerAPIPage
{

loginUser(){
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

retrievePreRequisiteDataToCreateHISO(){
    //Retrieve site ID
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
  
     //Retrieve RTU ID
     var RTUpayload = {
      "options":{
         "isCountRequired":true,
         "userId":userId,
         "domainId":domainId,
         "pageIndex":0,
         "itemsPerPage":10,
         "filterText":'*'+ deviceID +'*',
         "filterBy":0,
         "sortColumnName":"deviceId",
         "sortDirection":0,
         "groupBy":1,
         "selectedRtuCategories":[ 1,
          2,
          3,
          6,
          7]
      }
     };
   
     cy.request(
      'POST',Cypress.config('apiUrl')+routes.retrieveRtuInfoRecordsByOptions,
      RTUpayload,
     ).then(response => {
      expect(response.status).equal(200)
       rtuID = response.body.retrieveRTUInfoRecordsByOptionsResult.records[0].rtuId;
     });
     
     //Retrieve Custom properties and FTP domain Ids
     var assetEditDetailsPayload = {
         "domainId":domainId
        };

     cy.request(
         'POST',Cypress.config('apiUrl')+routes.retrieveQuickAssetCreateHISOContainer,
         assetEditDetailsPayload,
      ).then(response => {
         expect(response.status).equal(200);
 
         integrationDomainIdAutoFtpFalse = response.body.domainIntegrationInfo[0].targetDomainId;
         integrationDomainIdAutoFtpTrue = response.body.domainIntegrationInfo[1].targetDomainId;
         propertyTypeDirectionID = response.body.customProperties[0].propertyTypeId;
         propertyTypeNumberID = response.body.customProperties[1].propertyTypeId;
         propertyTypeOptID = response.body.customProperties[2].propertyTypeId;
         propertyTypeValueID = response.body.customProperties[3].propertyTypeId;

      });
  
}

createHISOWithDesignCurveNone(){
    const assetHISODescription = utilFunctions.suffixWithDate('HISO_API_');
 
    var saveHISOAssetPayload = {
        "domainId":domainId,
        "description":assetHISODescription,
        "designCurveId":0,
        "siteId":siteID,
        "notes":"Notes",
        "customProperties":[],
        "rtuId":rtuID,
        "addHeliumPressureRateOfChange":true,
        "assetIntegrationId":""
     }

       cy.request(
          'POST',Cypress.config('apiUrl')+routes.saveQuickAssetHISOContainer,
          saveHISOAssetPayload,
       ).then(response => {
          expect(response.status).equal(200);
          expect(response.body.asset.assetId).to.exist;
          expect(response.body.asset.description).equal(saveHISOAssetPayload.description);
          expect(response.body.asset.designCurve.designCurveId).equal(saveHISOAssetPayload.designCurveId);
          expect(response.body.asset.siteId).equal(saveHISOAssetPayload.siteId);
 
          assetId = response.body.asset.assetId;
 
       });

}

createHISOWithNitrogenLevelEnabledManaulWithCustomProperties(){
        
    assetHISODescription = utilFunctions.suffixWithDate('HISO_API_');
    const direct = 'South',
    number = 1.2,
    optValue =  true,
    assetIntegrationId = 'xyz9'+utilFunctions.randomString();

  var saveHISOAssetPayload = {
   "domainId":domainId,
   "description":assetHISODescription,
   "designCurveId":0,
   "siteId":siteID,
   "notes":utilFunctions.suffixWithDate("notes added_"),
   "customProperties":[
   {
      "propertyTypeId":propertyTypeDirectionID,
      "name":"Direction",
      "value":direct
   },
   {
      "propertyTypeId":propertyTypeNumberID,
      "name":"Number",
      "value":number
   },
   {
      "propertyTypeId":propertyTypeOptID,
      "name":"Opt",
      "value":optValue
   },
   {
      "propertyTypeId":propertyTypeValueID,
      "name":"value",
      "value":""
   }
],
  "rtuId":rtuID,
  "addHeliumPressureRateOfChange":true,
  "assetIntegrationId":assetIntegrationId,
  "heliumLevelIntegrationDetails":{
   "enableIntegration":true,
   "integrationId":"a1"+utilFunctions.randomString(),
   "integrationDomainId":integrationDomainIdAutoFtpFalse
},
   "heliumPressureIntegrationDetails":{
   "enableIntegration":true,
   "integrationId":"b1"+utilFunctions.randomString(),
   "integrationDomainId":integrationDomainIdAutoFtpFalse
},
  "nitrogenLevelIntegrationDetails":{
   "enableIntegration":true,
   "integrationId":"c1"+utilFunctions.randomString(),
   "integrationDomainId":integrationDomainIdAutoFtpFalse
},
   "nitrogenPressureIntegrationDetails":{
   "enableIntegration":true,
   "integrationId":"d1"+utilFunctions.randomString(),
   "integrationDomainId":integrationDomainIdAutoFtpFalse
},
   "batteryIntegrationDetails":{
   "enableIntegration":false,
   "integrationId":"",
   "integrationDomainId":integrationDomainIdAutoFtpFalse
},
   "gpsIntegrationDetails":{
   "enableIntegration":false,
   "integrationId":"",
   "integrationDomainId":integrationDomainIdAutoFtpFalse
}
 }

cy.request(
   'POST',Cypress.config('apiUrl')+routes.saveQuickAssetHISOContainer,
   saveHISOAssetPayload,
).then(response => {
   expect(response.status).equal(200);
   expect(response.body.asset.assetId).to.exist;
   expect(response.body.asset.description).equal(saveHISOAssetPayload.description);
   expect(response.body.asset.designCurve.designCurveId).equal(saveHISOAssetPayload.designCurveId);
   expect(response.body.asset.siteId).equal(saveHISOAssetPayload.siteId);

   assetId2 = response.body.asset.assetId;

});
}

createHISOwithNitrogenLevelEnabledAuto(){

    assetHISODescription = utilFunctions.suffixWithDate('HISO_API_');
    const assetIntegrationId = 'xyz9'+utilFunctions.randomString();

   var saveHISOAssetPayload = {
      "domainId":domainId,
      "description":assetHISODescription,
      "designCurveId":1,
      "siteId":siteID,
      "notes":"notes",
      "customProperties":[],
      "rtuId":rtuID,
      "addHeliumPressureRateOfChange":false,
      "assetIntegrationId":assetIntegrationId,
      "heliumLevelIntegrationDetails":{
         "enableIntegration":true,
         "integrationId":"ha7"+utilFunctions.randomString(),
         "integrationDomainId":integrationDomainIdAutoFtpTrue
      },
      "heliumPressureIntegrationDetails":{
         "enableIntegration":true,
         "integrationId":"s8"+utilFunctions.randomString(),
         "integrationDomainId":integrationDomainIdAutoFtpTrue
      },
      "nitrogenLevelIntegrationDetails":{
         "enableIntegration":true,
         "integrationId":"s7"+utilFunctions.randomString(),
         "integrationDomainId":integrationDomainIdAutoFtpTrue
      },
      "nitrogenPressureIntegrationDetails":{
         "enableIntegration":true,
         "integrationId":"s0"+utilFunctions.randomString(),
         "integrationDomainId":integrationDomainIdAutoFtpTrue
      },
      "batteryIntegrationDetails":{
         "enableIntegration":true,
         "integrationId":"s9"+utilFunctions.randomString(),
         "integrationDomainId":integrationDomainIdAutoFtpTrue
      },
      "gpsIntegrationDetails":{
         "enableIntegration":true,
         "integrationId":"67"+utilFunctions.randomString(),
         "integrationDomainId":integrationDomainIdAutoFtpTrue
      }
   }

      cy.request(
         'POST',Cypress.config('apiUrl')+routes.saveQuickAssetHISOContainer,
         saveHISOAssetPayload,
      ).then(response => {
         expect(response.status).equal(200);
         expect(response.body.asset.assetId).to.exist;
         expect(response.body.asset.description).equal(saveHISOAssetPayload.description);
         expect(response.body.asset.assetIntegrationId).equal(saveHISOAssetPayload.assetIntegrationId);
         expect(response.body.asset.designCurve.designCurveId).equal(saveHISOAssetPayload.designCurveId);
         expect(response.body.asset.customProperties[0].value).to.be.null;
         expect(response.body.asset.siteId).equal(saveHISOAssetPayload.siteId);
         expect(response.body.asset.notes).equal(saveHISOAssetPayload.notes);
         expect(response.body.asset.dataChannels).not.to.be.empty;

         assetId3 = response.body.asset.assetId;

      });
}

deleteHISOAndVerifyDeletedItems(){
    var deleteAssetPayload = {
        "assetIds":[assetId,assetId2,assetId3]
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
     assetIdsArray = [assetId,assetId2,assetId3];

    const assetIdResponse =  assetsResponse.map(res => res.assetId)
    assetIdResponse.forEach(element =>{
     assetIdsArray.forEach(assets=>{

        // Check if a value exists in the list
        if(element.indexOf(assets) !== -1){
           console.log('deleted asset :' +assets)
           assert.isFalse(true, 'Deleted Asset Exist');
  
       } else
       {
           assert.isTrue(true, 'Deleted Assets does not exists');
       }
     });
    });
   });
}


}


export default heliumISOContainerAPIPage;