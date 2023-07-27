const routes = require('../../fixtures/routes.json');
import UtilFunctions from '../utils/UtilFunctions';
const utilFunctions = new UtilFunctions();

let domainId = null,
userId = null,
siteName = 'Bulk Strata Ltd',
rtuIdE100='c503a787-3268-e811-80cd-e0071bf7af6e',
deviceIdE100 = 'E1001939',
rtuIDFF ='97008d97-8cfe-4beb-a338-c88439d2b895',
productID,
tankDimensionID,
rtuIDindex,
publishedComments,
sourceDataChannelId,
tankDimensionDescription = 'Test Hendrik',
deviceID = 'FF720008',
levelDataChannelTemplateDescription = '0-11 Level Sensor',
pressureDataChannelTemplateDescription = '0-200 PSI Sensor',
eventRuleGroupId,
levelDataChannelTemplateId,
pressureDataChannelTemplateId,
siteID,
levelRtuChannelId,
pressureRtuChannelId,
integrationDomainIdAutoFtpFalse,
integrationDomainIdAutoFtpTrue,
propertyTypeDirectionID,
propertyTypeNumberID,
propertyTypeOptID,
propertyTypeValueID,
assetId, assetId2,assetId3,assetId4,
assetIdsArray = [];

class quickTankAPIPage{


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
    
    retrieveRTUid(){

      //Retrieve RTU ID
      var RTUpayload = {
            "options":{
            "domainId":domainId,
            "deviceIdPrefix":"",
            "maxRecords":50,
            "isTemplateSearch":false,
            "categories":null,
            "rtuType":null}
       };
        cy.request(
         'POST',Cypress.config('apiUrl')+routes.retrieveRtuListPrefixUrl,RTUpayload,
        ).then(response => {
         expect(response.status).equal(200)
         const rtuResponse = response.body.retrieveRTUDeviceInfoListByPrefixResult.map(res => res.deviceId);  
          rtuResponse.forEach(function callback(rtu, rtuIDindex){
        // If RTU id exists in the list
        if(rtu.indexOf(deviceID) !== -1){
           assert.isTrue(true, 'RTU exists, ID is '+ rtuIDindex );
           rtuIDFF =  response.body.retrieveRTUDeviceInfoListByPrefixResult[rtuIDindex].rtuId;
           return false;
       } 
         else if(rtu.indexOf(deviceIdE100) !== -1){
           assert.isTrue(true, 'RTU exists, ID is '+ rtuIDindex );
           rtuIdE100 =  response.body.retrieveRTUDeviceInfoListByPrefixResult[rtuIDindex].rtuId;
           return false;
       } 

      });
       });    
    }

    retrievePreRequisiteDataToCreateQuickTank(){

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
            'POST',Cypress.config('apiUrl')+routes.retrieveSiteByOptionsUrl,sitePayload,
         ).then(response => {
            expect(response.status).equal(200)
            siteID = response.body.retrieveSiteInfoRecordsByOptionsResult.records[0].siteId;
            console.log('another function: '+rtuIDFF);

         });
    

        //Retrieve Tank Dimension ID
        var tankDimensionPayload = {
            "domainId":domainId
        };
         cy.request(
            'POST',Cypress.config('apiUrl')+routes.retrieveTankByDomainUrl,tankDimensionPayload,
         ).then(response => {
            expect(response.status).equal(200);
            var tdIDindex;
            const tankDimensionArray = response.body.retrieveTankDimensionInfoRecordsByDomainResult.map(res => res.description);  
            tankDimensionArray.forEach(function callback(tankDimension, tdIDindex){
          if(tankDimension.indexOf(tankDimensionDescription) !== -1){
             assert.isTrue(true, 'Tank dimension exists, ID is '+ tdIDindex );
             tankDimensionID =  response.body.retrieveTankDimensionInfoRecordsByDomainResult[tdIDindex].tankDimensionId;
             return false;
         } });
         console.log('Tank dimension within a function '+tankDimensionID);
        });
    
        
        //Retrieve Product ID
        var productPayload = {
            "domainId":domainId,
            "namePrefix":"",
            "maxRecords":50
        };
        cy.request(
            'POST',Cypress.config('apiUrl')+routes.retrieveProductNameInfoByPrefix,productPayload,
           ).then(response => {
            expect(response.status).equal(200)
            productID = response.body.retrieveProductNameInfoListByPrefixResult[0].productId;
        });


        //Retrieve RTU Channel ID
        console.log('rtuIDFF before payload '+ rtuIDFF)
        var rtuChannelPayload = {
            "rtuId":rtuIDFF, 
            "dataChannelId":null,
            "excludeNonNumericChannelNumbers":false
        };
        cy.request(
             'POST',Cypress.config('apiUrl')+routes.retrieveRtuChannelUsageInfoListByRtu,rtuChannelPayload,
           ).then(response => {
             expect(response.status).equal(200);
             console.log('rtuIDFF in other request reponse '+rtuIDFF);
             levelRtuChannelId = response.body.retrieveRTUChannelUsageInfoListByRTUResult[0].rtuChannelId;
             pressureRtuChannelId = response.body.retrieveRTUChannelUsageInfoListByRTUResult[1].rtuChannelId;
        });


        //Retrieve Published Comments ID
         var publishedCommentsPayload = {
            "options":{
               "publishedComments":"",
               "domainId":domainId,
               "dataChannelType":1,
               "subscriberDataChannelId":"00000000-0000-0000-0000-000000000000",
               "maxRecords":50
            }
         };
        cy.request(
            'POST',Cypress.config('apiUrl')+routes.retrievePublishedDCSearchListByComments,publishedCommentsPayload,
           ).then(response => {
            expect(response.status).equal(200)
            sourceDataChannelId = response.body.retrievePublishedDataChannelSearchInfoListByCommentsResult[0].sourceDataChannelId;
            publishedComments = response.body.retrievePublishedDataChannelSearchInfoListByCommentsResult[0].publishedComments;
        });


        //Retrieve Custom properties, FTP domain Ids and Event Rule group
         var assetEditDetailsPayload = {
             "domainId":domainId
        };
        cy.request(
             'POST',Cypress.config('apiUrl')+routes.retrieveQuickAssetCreateBulkTank,assetEditDetailsPayload,
          ).then(response => {
             expect(response.status).equal(200);
     
             eventRuleGroupId = response.body.eventRuleGroups[0].eventRuleGroupId;
             integrationDomainIdAutoFtpFalse = response.body.integrationDomain[0].targetDomainId;
             integrationDomainIdAutoFtpTrue = response.body.integrationDomain[1].targetDomainId;
             propertyTypeDirectionID = response.body.customProperties[0].propertyTypeId;
             propertyTypeNumberID = response.body.customProperties[1].propertyTypeId;
             propertyTypeOptID = response.body.customProperties[2].propertyTypeId;
             propertyTypeValueID = response.body.customProperties[3].propertyTypeId;
            
            //Fetch Level and Pressure DataChannel Template Id
            let templateIDindex;
            const dataChannelTemplateResponse = response.body.dataChannelTemplates.map(res => res.description);  
            dataChannelTemplateResponse.forEach(function callback(dataTemplateDescription, templateIDindex){

           if(dataTemplateDescription.indexOf(levelDataChannelTemplateDescription) !== -1){
              assert.isTrue(true, 'level DataChannel TemplateDescription exists, ID is '+ templateIDindex );
              levelDataChannelTemplateId =  response.body.dataChannelTemplates[templateIDindex].dataChannelTemplateId;
              return false;
             } 
               
           else if(dataTemplateDescription.indexOf(pressureDataChannelTemplateDescription) !== -1){
              assert.isTrue(true, 'Pressure DataChannel TemplateDescription exists, ID is '+ templateIDindex );
              pressureDataChannelTemplateId =  response.body.dataChannelTemplates[templateIDindex].dataChannelTemplateId;
              return false;
             } 
        });     
   
        });

      
    }

    createQuick_TankAsset_IntegrationEnabled(){

        const quickTankDescription = utilFunctions.suffixWithDate('QuickTank_API_');

        var createQuickTankPayload = {
            "description":quickTankDescription,
            "domainId":domainId,
            "siteId":siteID,
            "technician":utilFunctions.suffixWithDate('Tech_'),
            "notes":utilFunctions.suffixWithDate('Notes Tank created_'),
            "integrationId":"xyz101"+utilFunctions.randomString(),
            "customProperties":[],
            "dataChannelsBasedRtu":{
               "isTankDimensionsSet":false,
               "tankType":3,
               "tankDimensionId":"",
               "productId":productID,
               "eventRuleGroupId":eventRuleGroupId,
               "displayUnits":"40",
               "maxProductHeight":10,
               "maxProductHeightInDisplayUnits":10000,
               "reorderEventValue":"",
               "criticalEventValue":"",
               "rtuId":rtuIDFF,
               "levelRtuChannelId":levelRtuChannelId,
               "levelDataChannelTemplateId":levelDataChannelTemplateId,
               "pressureRtuChannelId":pressureRtuChannelId,
               "pressureDataChannelTemplateId":pressureDataChannelTemplateId,
               "addBatteryChannel":true,
               "addRtuTemperatureChannel":true,
               "levelIntegrationDetails":{
                  "enableIntegration":true,
                  "integrationId":"a8"+utilFunctions.randomString(),
                  "integrationDomainId":integrationDomainIdAutoFtpFalse
               },
               "pressureIntegrationDetails":{
                  "enableIntegration":true,
                  "integrationId":"h7"+utilFunctions.randomString(),
                  "integrationDomainId":integrationDomainIdAutoFtpFalse
               },
               "batteryIntegrationDetails":{
                  "enableIntegration":true,
                  "integrationId":"j0"+utilFunctions.randomString(),
                  "integrationDomainId":integrationDomainIdAutoFtpFalse
               }
            }
         }

        cy.request(
            'POST',Cypress.config('apiUrl')+routes.saveQuickAssetTankUrl,
            createQuickTankPayload,
         ).then(response => {
            expect(response.status).equal(200)
            expect(response.body.asset.assetId).to.exist;
            expect(response.body.asset.domainId).equal(createQuickTankPayload.domainId);
            expect(response.body.asset.assetType).equal(1);
            expect(response.body.asset.description).equal(createQuickTankPayload.description);
            expect(response.body.asset.integrationName).equal(createQuickTankPayload.integrationId);
            expect(response.body.asset.siteId).equal(createQuickTankPayload.siteId);
            expect(response.body.asset.notes).equal(createQuickTankPayload.notes);
            expect(response.body.asset.eventRuleGroupId).equal(createQuickTankPayload.dataChannelsBasedRtu.eventRuleGroupId);
            expect(response.body.asset.installedTechName).equal(createQuickTankPayload.technician);
            expect(response.body.asset.dataChannels).not.to.be.empty;

            assetId = response.body.asset.assetId;
            
         });
    }
    
    createQuick_TankAsset_SetTankDimensions(){

        const quickTankDescription = utilFunctions.suffixWithDate('QuickTank_API_');

        var createQuickTankPayload = {
            "description":quickTankDescription,
            "domainId":domainId,
            "siteId":siteID,
            "technician":utilFunctions.suffixWithDate('Tech_'),
            "notes":utilFunctions.suffixWithDate('Notes Tank Created_'),
            "integrationId":"",
            "customProperties":[],
            "dataChannelsBasedRtu":{
               "isTankDimensionsSet":true,
               "tankType":1,
               "tankDimensionId":tankDimensionID,
               "productId":productID,
               "eventRuleGroupId":eventRuleGroupId,
               "displayUnits":"40",
               "maxProductHeight":60,
               "reorderEventValue":"",
               "criticalEventValue":"",
               "rtuId":rtuIDFF,
               "levelRtuChannelId":levelRtuChannelId,
               "levelDataChannelTemplateId":levelDataChannelTemplateId,
               "pressureRtuChannelId":pressureRtuChannelId,
               "pressureDataChannelTemplateId":pressureDataChannelTemplateId,
               "addBatteryChannel":true,
               "addRtuTemperatureChannel":false,
               "levelIntegrationDetails":{
                  "enableIntegration":false,
                  "integrationId":"",
                  "integrationDomainId":""
               },
               "pressureIntegrationDetails":{
                  "enableIntegration":false,
                  "integrationId":"",
                  "integrationDomainId":""
               },
               "batteryIntegrationDetails":{
                  "enableIntegration":false,
                  "integrationId":"",
                  "integrationDomainId":""
               }
            }
         }

        cy.request(
            'POST',Cypress.config('apiUrl')+routes.saveQuickAssetTankUrl,
            createQuickTankPayload,
         ).then(response => {
            expect(response.status).equal(200)
            expect(response.body.asset.assetId).to.exist;
            expect(response.body.asset.domainId).equal(createQuickTankPayload.domainId);
            expect(response.body.asset.assetType).equal(1);
            expect(response.body.asset.description).equal(createQuickTankPayload.description);
            expect(response.body.asset.integrationName).equal(createQuickTankPayload.integrationId);
            expect(response.body.asset.siteId).equal(createQuickTankPayload.siteId);
            expect(response.body.asset.notes).equal(createQuickTankPayload.notes);
            expect(response.body.asset.eventRuleGroupId).equal(createQuickTankPayload.dataChannelsBasedRtu.eventRuleGroupId);
            expect(response.body.asset.installedTechName).equal(createQuickTankPayload.technician);
            expect(response.body.asset.dataChannels[0].tankDimensionId).equal(createQuickTankPayload.dataChannelsBasedRtu.tankDimensionId);
            expect(response.body.asset.dataChannels[0].productId).equal(createQuickTankPayload.dataChannelsBasedRtu.productId);
            expect((response.body.asset.dataChannels[0].displayUnits).toString()).equal((createQuickTankPayload.dataChannelsBasedRtu.displayUnits).toString());
            expect(response.body.asset.dataChannels[0].rtuDeviceId).equal(deviceID);
            expect(response.body.asset.dataChannels).not.to.be.empty;

            assetId2 = response.body.asset.assetId;
            
         });
    }

    createQuick_DataSourcePublishedDC_TankNotSet(){

        const quickTankDescription = utilFunctions.suffixWithDate('QuickTank_API_');

        var createQuickTankPayload = {
            "description":quickTankDescription,
            "domainId":domainId,
            "siteId":siteID,
            "technician":utilFunctions.suffixWithDate('Tech_'),
            "notes":utilFunctions.suffixWithDate('Test Notes_'),
            "integrationId":"",
            "customProperties":[],
            "dataChannelBasedPublishedChannel":{
               "isTankDimensionsSet":false,
               "tankType":1,
               "tankDimensionId":"",
               "productId":productID,
               "eventRuleGroupId":eventRuleGroupId,
               "displayUnits":"60",
               "maxProductHeight":300,
               "reorderEventValue":"",
               "criticalEventValue":"",
               "sourceDataChannelId":sourceDataChannelId,
               "publishedComments":publishedComments,
               "levelIntegrationDetails":{
                  "enableIntegration":false,
                  "integrationId":"",
                  "integrationDomainId":""
               }
            }
         };

        cy.request(
            'POST',Cypress.config('apiUrl')+routes.saveQuickAssetTankUrl,
            createQuickTankPayload,
         ).then(response => {
            expect(response.status).equal(200)
            expect(response.body.asset.assetId).to.exist;
            expect(response.body.asset.domainId).equal(createQuickTankPayload.domainId);
            expect(response.body.asset.assetType).equal(1);
            expect(response.body.asset.description).equal(createQuickTankPayload.description);
            expect(response.body.asset.integrationName).equal(createQuickTankPayload.integrationId);
            expect(response.body.asset.siteId).equal(createQuickTankPayload.siteId);
            expect(response.body.asset.notes).equal(createQuickTankPayload.notes);
            expect(response.body.asset.installedTechName).equal(createQuickTankPayload.technician);
            expect(response.body.asset.eventRuleGroupId).equal(createQuickTankPayload.dataChannelBasedPublishedChannel.eventRuleGroupId);
            expect(response.body.asset.dataChannels[0].publishedComments).equal(createQuickTankPayload.dataChannelBasedPublishedChannel.publishedComments);
            expect(response.body.asset.dataChannels[0].productId).equal(createQuickTankPayload.dataChannelBasedPublishedChannel.productId);
            expect((response.body.asset.dataChannels[0].displayUnits).toString()).equal((createQuickTankPayload.dataChannelBasedPublishedChannel.displayUnits).toString());
            expect(response.body.asset.dataChannels[0].rtuDeviceId).equal(deviceID);
            expect(response.body.asset.dataChannels).not.to.be.empty;
            expect(response.body.asset.dataChannels[0].tankDimensionId).equal(createQuickTankPayload.dataChannelsBasedRtu.tankDimensionId);

            assetId3 = response.body.asset.assetId;
         });
    }

    createQuick_DataSourceRTU_CustomProperties(){

        const quickTankDescription = utilFunctions.suffixWithDate('QuickTank_API_');

        var createQuickTankPayload = {
            "description":quickTankDescription,
            "domainId":domainId,
            "siteId":siteID,
            "technician":utilFunctions.suffixWithDate('Tech_'),
            "notes":utilFunctions.suffixWithDate('Test Notes_'),
            "integrationId":"",
            "customProperties":[
               {
                  "propertyTypeId":propertyTypeDirectionID,
                  "name":"Directions ",
                  "value":"West"
               },
               {
                  "propertyTypeId":propertyTypeNumberID,
                  "name":"Number",
                  "value":50
               },
               {
                  "propertyTypeId":propertyTypeOptID,
                  "name":"opt",
                  "value":true
               },
               {
                  "propertyTypeId":propertyTypeValueID,
                  "name":"value",
                  "value":"658"
               }
            ],
            "dataChannelsBasedRtu":{
               "isTankDimensionsSet":false,
               "tankType":1,
               "tankDimensionId":"",
               "productId":productID,
               "eventRuleGroupId":eventRuleGroupId,
               "displayUnits":"40",
               "maxProductHeight":10,
               "maxProductHeightInDisplayUnits":100,
               "reorderEventValue":"",
               "criticalEventValue":"",
               "rtuId":rtuIdE100,
               "levelRtuChannelId":levelRtuChannelId,
               "levelDataChannelTemplateId":levelDataChannelTemplateId,
               "pressureRtuChannelId":pressureRtuChannelId,
               "pressureDataChannelTemplateId":pressureDataChannelTemplateId,
               "addBatteryChannel":false,
               "addRtuTemperatureChannel":false,
               "levelIntegrationDetails":{
                  "enableIntegration":false,
                  "integrationId":"",
                  "integrationDomainId":""
               },
               "pressureIntegrationDetails":{
                  "enableIntegration":false,
                  "integrationId":"",
                  "integrationDomainId":""
               },
               "batteryIntegrationDetails":null
            }
         };

        cy.request(
            'POST',Cypress.config('apiUrl')+routes.saveQuickAssetTankUrl,
            createQuickTankPayload,
         ).then(response => {
            expect(response.status).equal(200)
            expect(response.body.asset.assetId).to.exist;
            expect(response.body.asset.domainId).equal(createQuickTankPayload.domainId);
            expect(response.body.asset.assetType).equal(1);
            expect(response.body.asset.description).equal(createQuickTankPayload.description);
            expect(response.body.asset.integrationName).equal(createQuickTankPayload.integrationId);
            expect(response.body.asset.siteId).equal(createQuickTankPayload.siteId);
            expect(response.body.asset.notes).equal(createQuickTankPayload.notes);
            expect(response.body.asset.installedTechName).equal(createQuickTankPayload.technician);
            expect(response.body.asset.eventRuleGroupId).equal(createQuickTankPayload.dataChannelsBasedRtu.eventRuleGroupId);
            expect(response.body.asset.dataChannels[0].productId).equal(createQuickTankPayload.dataChannelsBasedRtu.productId);
            expect(response.body.asset.dataChannels[0].rtuDeviceId).equal(deviceID);
            expect(response.body.asset.dataChannels).not.to.be.empty;
            expect(response.body.asset.dataChannels[0].tankDimensionId).to.be.null;

            assetId4 = response.body.asset.assetId;
         });
    }

    deleteHISOAndVerifyDeletedItems(){
        var deleteAssetPayload = {
            "assetIds":[assetId,assetId2,assetId4]
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
         assetIdsArray = [assetId,assetId2,assetId4];
    
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

export default quickTankAPIPage;