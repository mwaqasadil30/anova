const routes = require('../../../fixtures/routes.json');
import UtilFunctions from '../../../support/utils/UtilFunctions';
const utilFunctions = new UtilFunctions();
let domain_AP = "TestAutomation-AP";
let assetTitle_NonAP = "Analog Asset Bulk Strata Ltd.";
let assetTitle_AP = "Asset for LBShell Integration";
let enterTestData = "Test";
let enterAnovaUrl = "https://www.anova.com/"

describe('Asset Quick Edit Test Suite', function () {

    beforeEach(function () {

        cy.viewport(1440, 900);
        // Preserve only the session cookie in every test
        Cypress.Cookies.defaults({
            preserve: (cookie) => {
                return cookie && cookie.name === '.AspNetCore.Session';
            },
        })
    })

    it(' Set UP-1-As Single domain User .', { retries: 10 }, function () {
        cy.login();
    })

    it(' Navigate to Operations app -Asset summary ', function () {

        cy.navToAssetSummaryPage();
    })

    it(' Navigate to the asset details page of Analog Asset Bulk Strata', function () {
        cy.navToAssetAnalogStrata(assetTitle_NonAP);
    })

    it(' Check that the Working Instruction is not present for Non-AP Domains', function () {
        cy.checkWorkingInst();
    })

    it(' Click on the Pencil Button to Edit Asset Information', function () {
        cy.clickOnPencilForEditAI();
    })

    it(' Save Asset Information without Working Instructions', function () {
        cy.saveAssetInfo();
    })

    it('Select AP Domain', function () {
        cy.changeTheDomainToAp(assetTitle_AP,enterTestData,enterAnovaUrl)
    })
})