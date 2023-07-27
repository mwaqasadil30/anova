
//skipping it because we are using different user for this test suite
describe.skip('Air Products Site', function () {

    beforeEach(function () {

        cy.viewport(1440, 900);
        // Preserve only the session cookie in every test
        Cypress.Cookies.defaults({
            preserve: (cookie) => {
                return cookie && cookie.name === '.AspNetCore.Session';
            },
        });
    });

    it('Set UP-1-As Single domain User .', { retries: 10 }, function () {
        cy.login();
    });

    it('Log into a APCI (Air Products) Integrated domain - Switch to FITZGIBBON domain', function () {
        cy.switchToFitzgibbon();
    });

    it('Go to Sites Manager', function () {
        cy.goToSitesManager();
    });

    it('Verify that there exists No Option to Add new Site', function () {
        cy.checkAddNewSiteOption();
    });

    it('Verify that Filter by dropdown list has Site Number as default and Customer Name has been removed ', function () {
        cy.checkSiteNumberFilter();
    });

    it('Verify that the search by Site Number works ', function () {
        cy.applySiteNumberFilter();
    });

})