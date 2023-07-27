import RTUSetPointsAPIPage from '../../support/APIpages/RTUSetPointsAPIPage';
import '@testing-library/cypress/add-commands';
const RTUSetPoints = new RTUSetPointsAPIPage();

let strataID = null;


describe('RTU setpoint API Automation', function () {
    const URL = Cypress.config('baseUrl')
    var environment = URL.match("https://(.*).transcend");
    switch (environment[1]) {
        case 'test':
            strataID = "91c14898-0d3a-eb11-86c4-00155d55772b";
            break;
        case 'staging':
            strataID = "f5913f6a-9151-eb11-80d7-e0071bf7af6e";
            break;
    }

    beforeEach(function () {
        // Preserve only the session cookie in every test
        Cypress.Cookies.defaults({
            preserve: (cookie) => {
                return cookie && cookie.name === '.AspNetCore.Session';
            },
        });
    });

    it('POST - Login User', { retries: 10 }, () => {
        RTUSetPoints.loginUser();
    });

    it('TC 1: Totalizer DC - always editable', () => {
        RTUSetPoints.retrieveAssetData(strataID);
        RTUSetPoints.redirectToEditEventProfile(strataID);
        RTUSetPoints.editValuesForTotalizer(strataID);

    });

    it('TC 2: Rate of Change DC - always editable', () => {
        RTUSetPoints.retrieveAssetData(strataID);
        RTUSetPoints.redirectToEditEventProfile(strataID);
        RTUSetPoints.editValuesForRateOfChange(strataID);

    });

    //TC 4: 400 series RTU - event rule (Inventory, Level, Usage Rate) linked to setpoint - editable
    it('Level DC - 400 series RTU - Inventory Event Rule linked to setpoint', () => {
        RTUSetPoints.retrieveAssetData(strataID);
        RTUSetPoints.redirectToEditEventProfile(strataID);
        RTUSetPoints.editValuesLinkedToSetPoints(strataID);
    });

    //TC 3: any Event Rule (Missing Data, Inventory, Level, Usage Rate) that has NO setpoint enabled - editable
    it('Level DC - 400 series RTU - Inventory Event Rule NOT linked to setpoint', () => {
        RTUSetPoints.retrieveAssetData(strataID);
        RTUSetPoints.redirectToEditEventProfile(strataID);
        RTUSetPoints.editValuesNotLinkedToSetPoints(strataID);
    });

    it('Pressure DC - 400 series RTU - Level Event Rule linked to setpoint', () => {
        RTUSetPoints.retrieveAssetData(strataID);
        RTUSetPoints.redirectToEditEventProfile(strataID);
        RTUSetPoints.editValuesPressureLinkedToSetPoints(strataID);
    });

    it('Pressure DC - 400 series RTU - Level Event Rule not linked to setpoint', () => {
        RTUSetPoints.retrieveAssetData(strataID);
        RTUSetPoints.redirectToEditEventProfile(strataID);
        RTUSetPoints.editValuesPressureNotLinkedToSetPoints(strataID);
    });

})
