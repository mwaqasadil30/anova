describe('Problem ReportsAir Product', () => {

  beforeEach(function () {

    cy.viewport(1440, 900)

    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  })

  it('TC: 11685 - Set UP-1-As Single domain User .', { retries: 10 }, function () {
    cy.login();
    cy.navToAssetSummaryPage();
  });

  it('Select Domain TestAutomation-AP', () => {

    cy.TestAutomationAPDomain()
  })

  it('Verify sorting works for Description column', () => {
    cy.openPRPage()
    cy.PRFilterOpetions(0)
    cy.sortDescription(1, 'A0')
    cy.sortDescription(1, 'Z9')
  })


  it('US: 31389 - Problem Report - Frontend - Add support for Close and ReOpen', () => {
    cy.ProblemReportSupportCloseReOpen();
  })

})