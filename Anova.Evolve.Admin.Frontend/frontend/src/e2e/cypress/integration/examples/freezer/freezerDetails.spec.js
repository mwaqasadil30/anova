describe.skip('Freezer app testsuite', function () {

    beforeEach(function () {

        cy.viewport(1440, 900);
        // Preserve only the session cookie in every test
        Cypress.Cookies.defaults({
            preserve: (cookie) => {
                return cookie && cookie.name === '.AspNetCore.Session';
            },
        });
    });

    it('Login', function () {
        cy.login();
    });

    it('Switch to MORTARS domain', function () {
        cy.switchToMortars();
    });

    it('Redirect to FREEZER app', function () {
        cy.flowToFreezer();
    });

    it('F001 - Site Summary - Verify that the available freezer sites are shown ', function () {
        cy.checkForAvailableSites();
    })

    it('F002 - Site Summary - Verify that on clicking any site the system takes the user to the freezer details page ', function () {
        cy.clickOnPlantAndBeanSite();
    })

    it('F003 - Freezer Details - Verify that "2D" time slot is selected by default ', function () {
        cy.check2DOptionByDefault();
    })

    it('F004 - Freezer Details - Verify the fields for "General" Section ', function () {
        cy.generalSectionFields();
    })

    it('F005 - Freezer Details - Verify the fields for "Events" Section ', function () {
        cy.eventsSectionFields();
    })

    it('F006 - Freezer Details - Verify that the last updated time can be seen ', function () {
        cy.latestReadingStamp();
    })

    it('F007 - Freezer Details - By clicking the freezer name the system takes the user to the freezer chart details page', function () {
        cy.clickOnTheFreezer();
    })

    it('F008 - Freezer Chart Details - Verify the values of general section as shown on Freezer details page with those shown on Freezer Chart Details ', function () {
        cy.verifyValues();
    })

    it('F009 - Freezer Chart Details - Verify the creation of New Freezer Chart ', function () {
        cy.newFreezerCreation();
    })
})