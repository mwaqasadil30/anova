const routes = require('../../fixtures/routes.json');

let domainId = null,
    userId = null;

let Level_1_dataChannelId = null;
let Pressure_dataChannelId = null;
let Pressure_1_dataChannelId = null;
let Total_dataChannelId = null;
let Level_1_Rate_of_Change_dataChannelId = null;

const URL = Cypress.config('baseUrl')
var environment = URL.match("https://(.*).transcend");
switch (environment[1]) {
    case 'test':
        Level_1_dataChannelId = "ea935b45-11df-eb11-86d3-00155d55772b";  
        Pressure_dataChannelId = "3ac24898-0d3a-eb11-86c4-00155d55772b";
        Pressure_1_dataChannelId = "9fd2867b-1edf-eb11-86d3-00155d55772b";
        Total_dataChannelId = "b6947b11-21df-eb11-86d3-00155d55772b";
        Level_1_Rate_of_Change_dataChannelId = "3525049d-23df-eb11-86d3-00155d55772b";
        break;
    case 'staging':
        Level_1_dataChannelId = "4435100f-23f3-ec11-b128-00155d55c207";  
        Pressure_dataChannelId = "f2863870-9151-eb11-80d7-e0071bf7af6e";
        Pressure_1_dataChannelId = "ca2386ac-27f3-ec11-b128-00155d55c207";
        Total_dataChannelId = "0733fdfd-25f3-ec11-b128-00155d55c207";
        Level_1_Rate_of_Change_dataChannelId= "c4a52927-c5f3-ec11-b128-00155d55c207";
        break;
}


var valuePayLoadSetPoints =
    [{
        "dataChannelId": Level_1_dataChannelId,
        "dataChannelTypeId": 1,
        "dataChannelDescription": "Level 1",
        "productDescription": null,
        "hasIntegrationEnabled": true,
        "inventoryEvents":
            [
                {
                    "eventInventoryStatusTypeId": 1,
                    "rtuSetPointSyncStatusId": 0,
                    "rtuChannelSetpointIndex": 1,
                    "eventComparatorTypeId": 3,
                    "currentUOMTypeId": 1000,
                    "scaledUOM": "Ins WC",
                    "decimalPlaces": 0,
                    "isSetpointUpdateSupported": true,
                    "dcerEventRuleId": 1208452,
                    "description": "Full",
                    "eventValue": 90,                          //change this value for Full inventory state
                    "eventImportanceLevelId": 0,
                    "isEnabled": true,
                    "integrationName": null,
                    "rosters": "",
                    "isLinkedToEventRule": false
                },
                {
                    "eventInventoryStatusTypeId": 2,
                    "rtuSetPointSyncStatusId": 0,
                    "rtuChannelSetpointIndex": 2,
                    "eventComparatorTypeId": 4,
                    "currentUOMTypeId": 1000,
                    "scaledUOM": "Ins WC",
                    "decimalPlaces": 0,
                    "isSetpointUpdateSupported": true,
                    "dcerEventRuleId": 1208453,
                    "description": "Reorder",
                    "eventValue": 80,                            //change this value for Reorder inventory state
                    "eventImportanceLevelId": 2,
                    "isEnabled": true,
                    "integrationName": null,
                    "rosters": "",
                    "isLinkedToEventRule": false
                }
            ],
        "levelEvents": [],
        "missingDataEvent": null,
        "usageRateEvent": null,
        "displayPriority": 3
    }];


var valuePayLoadNotLinkedToSetPoints =
    [{
        "dataChannelId": Level_1_dataChannelId,
        "dataChannelTypeId": 1,
        "dataChannelDescription": "Level 1",
        "productDescription": null,
        "hasIntegrationEnabled": true,
        "inventoryEvents":
            [
                {
                    "eventInventoryStatusTypeId": 4,
                    "rtuSetPointSyncStatusId": 0,
                    "rtuChannelSetpointIndex": null,
                    "eventComparatorTypeId": 5,
                    "currentUOMTypeId": 1000,
                    "scaledUOM": "Ins WC",
                    "decimalPlaces": 0,
                    "isSetpointUpdateSupported": true,
                    "dcerEventRuleId": 1208454,
                    "description": "Refill",
                    "eventValue": 71,                                             //change this value
                    "eventImportanceLevelId": 1,
                    "isEnabled": true,
                    "integrationName": null,
                    "rosters": "",
                    "isLinkedToEventRule": false
                },
                {
                    "eventInventoryStatusTypeId": 3,
                    "rtuSetPointSyncStatusId": 0,
                    "rtuChannelSetpointIndex": null,
                    "eventComparatorTypeId": 5,
                    "currentUOMTypeId": 1000,
                    "scaledUOM": "Ins WC",
                    "decimalPlaces": 0,
                    "isSetpointUpdateSupported": true,
                    "dcerEventRuleId": 1208455,
                    "description": "Critical",
                    "eventValue": 61,                                         //change this value
                    "eventImportanceLevelId": 0,
                    "isEnabled": true,
                    "integrationName": null,
                    "rosters": "",
                    "isLinkedToEventRule": false
                }
            ],
        "levelEvents": [],
        "missingDataEvent": null,
        "usageRateEvent": null,
        "displayPriority": 3
    }];

var valuePayloadPressureNotLinked =
    [{
        "dataChannelId": Pressure_dataChannelId  ,
        "dataChannelTypeId": 2,
        "dataChannelDescription": "Pressure",
        "productDescription": null,
        "hasIntegrationEnabled": true,
        "inventoryEvents": [],
        "levelEvents":
            [
                {
                    "rtuSetPointSyncStatusId": 0,
                    "rtuChannelSetpointIndex": null,
                    "eventComparatorTypeId": 2,
                    "currentUOMTypeId": 1000,
                    "scaledUOM": "PSI",
                    "decimalPlaces": 0,
                    "isSetpointUpdateSupported": true,
                    "dcerEventRuleId": 1200317,
                    "description": "High Pressure",
                    "eventValue": 6,                           //change this value for high pressure
                    "eventImportanceLevelId": 0,
                    "isEnabled": true,
                    "integrationName": "5",
                    "rosters": "",
                    "isLinkedToEventRule": false
                },
                {
                    "rtuSetPointSyncStatusId": 0,
                    "rtuChannelSetpointIndex": null,
                    "eventComparatorTypeId": 4,
                    "currentUOMTypeId": 1000,
                    "scaledUOM": "PSI",
                    "decimalPlaces": 0,
                    "isSetpointUpdateSupported": true,
                    "dcerEventRuleId": 1200318,
                    "description": "Low Pressure",
                    "eventValue": 9,                          //change this value for low pressure
                    "eventImportanceLevelId": 2,
                    "isEnabled": true,
                    "integrationName": "2",
                    "rosters": "",
                    "isLinkedToEventRule": false
                }
            ],
        "missingDataEvent": null,
        "usageRateEvent": null,
        "displayPriority": 1
    }]

var valuePayloadPressureLinked =
    [{
        "dataChannelId": Pressure_1_dataChannelId ,
        "dataChannelTypeId": 2,
        "dataChannelDescription": "Pressure 1",
        "productDescription": null,
        "hasIntegrationEnabled": true,
        "inventoryEvents": [],
        "levelEvents":
            [
                {
                    "rtuSetPointSyncStatusId": 0,
                    "rtuChannelSetpointIndex": 1,
                    "eventComparatorTypeId": 2,
                    "currentUOMTypeId": 1000,
                    "scaledUOM": "PSI",
                    "decimalPlaces": 0,
                    "isSetpointUpdateSupported": true,
                    "dcerEventRuleId": 1208462,
                    "description": "High Pressure",
                    "eventValue": 46,                                 //change this value
                    "eventImportanceLevelId": 0,
                    "isEnabled": true,
                    "integrationName": null,
                    "rosters": "",
                    "isLinkedToEventRule": false
                },
                {
                    "rtuSetPointSyncStatusId": 0,
                    "rtuChannelSetpointIndex": 2,
                    "eventComparatorTypeId": 4,
                    "currentUOMTypeId": 1000,
                    "scaledUOM": "PSI",
                    "decimalPlaces": 0,
                    "isSetpointUpdateSupported": true,
                    "dcerEventRuleId": 1208463,
                    "description": "Low Pressure",
                    "eventValue": 36,                                //change this value
                    "eventImportanceLevelId": 2,
                    "isEnabled": true,
                    "integrationName": null,
                    "rosters": "",
                    "isLinkedToEventRule": false
                }
            ],
        "missingDataEvent": null,
        "usageRateEvent": null,
        "displayPriority": 4
    }]

var valuePayLoadTotalizer =
    [{
        "dataChannelId": Total_dataChannelId ,
        "dataChannelTypeId": 12,
        "dataChannelDescription": "Total",
        "productDescription": null,
        "hasIntegrationEnabled": true,
        "inventoryEvents":
            [
                {
                    "eventInventoryStatusTypeId": 1,
                    "rtuSetPointSyncStatusId": 0,
                    "rtuChannelSetpointIndex": null,
                    "eventComparatorTypeId": 3,
                    "currentUOMTypeId": 1000,
                    "scaledUOM": "Ins WC",
                    "decimalPlaces": 0,
                    "isSetpointUpdateSupported": false,
                    "dcerEventRuleId": 1208469,
                    "description": "Full",
                    "eventValue": 12,                            //change this value for totalizer
                    "eventImportanceLevelId": 0,
                    "isEnabled": true,
                    "integrationName": null,
                    "rosters": "",
                    "isLinkedToEventRule": false
                }
            ],
        "levelEvents": [],
        "missingDataEvent": null,
        "usageRateEvent": null,
        "displayPriority": 100
    }]

var valuePayLoadRateOfChange =
    [{
        "dataChannelId": Level_1_Rate_of_Change_dataChannelId,
        "dataChannelTypeId": 16,
        "dataChannelDescription": "Level 1 Rate of Change",
        "productDescription": null,
        "hasIntegrationEnabled": true,
        "inventoryEvents": [],
        "levelEvents": [],
        "missingDataEvent":
        {
            "maxDataAgeByHour": 28,
            "maxDataAgeByMinute": 0,
            "dcerEventRuleId": 1208483,
            "description": "Missing Data",
            "eventValue": 1600,                           //change the value
            "eventImportanceLevelId": 2,
            "isEnabled": true,
            "integrationName": null,
            "rosters": "",
            "isLinkedToEventRule": false
        },
        "usageRateEvent": null,
        "displayPriority": 101
    }]

class RTUSetPointsAPIPage {

    loginUser() {
        var loginPayload = {
            "username": Cypress.env('USERNAME'),
            "password": Cypress.env('PASS')
        }
        cy.request(
            'POST', Cypress.config('apiUrl') + routes.authenticateAppUrl,
            loginPayload,
        ).then(response => {
            expect(response.status).equal(200)
            expect(response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.username.toLowerCase()).equal(loginPayload.username.toLowerCase())

            domainId = response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.domainId;
            userId = response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.userId;

        });

    }

    retrieveAssetData(id) {
        cy.request(
            'GET', Cypress.config('apiUrl') + "/Asset/Detail/" + id
        ).then(response => {
            expect(response.status).equal(200);
        });
    }

    redirectToEditEventProfile(dcId) {
        cy.request(
            'GET', Cypress.config('apiUrl') + "/DataChannelEventRule/asset/" + dcId
        ).then(response => {
            expect(response.status).equal(200);
        });

    }

    editValuesLinkedToSetPoints(dcId) {
        cy.request(
            'POST', Cypress.config('apiUrl') + "/DataChannelEventRule/asset/" + dcId, valuePayLoadSetPoints
        ).then(response => {
            expect(response.status).equal(200);
        });
    }

    editValuesNotLinkedToSetPoints(dcId) {
        cy.request(
            'POST', Cypress.config('apiUrl') + "/DataChannelEventRule/asset/" + dcId, valuePayLoadNotLinkedToSetPoints
        ).then(response => {
            expect(response.status).equal(200);
        });
    }

    editValuesPressureNotLinkedToSetPoints(dcId) {
        cy.request(
            'POST', Cypress.config('apiUrl') + "/DataChannelEventRule/asset/" + dcId, valuePayloadPressureNotLinked
        ).then(response => {
            expect(response.status).equal(200);
        });
    }

    editValuesPressureLinkedToSetPoints(dcId) {
        cy.request(
            'POST', Cypress.config('apiUrl') + "/DataChannelEventRule/asset/" + dcId, valuePayloadPressureLinked
        ).then(response => {
            expect(response.status).equal(200);
        });
    }

    editValuesForTotalizer(dcId) {
        cy.request(
            'POST', Cypress.config('apiUrl') + "/DataChannelEventRule/asset/" + dcId, valuePayLoadTotalizer
        ).then(response => {
            expect(response.status).equal(200);
        });
    }

    editValuesForRateOfChange(dcId) {
        cy.request(
            'POST', Cypress.config('apiUrl') + "/DataChannelEventRule/asset/" + dcId, valuePayLoadRateOfChange
        ).then(response => {
            expect(response.status).equal(200);
        });
    }
}

export default RTUSetPointsAPIPage;