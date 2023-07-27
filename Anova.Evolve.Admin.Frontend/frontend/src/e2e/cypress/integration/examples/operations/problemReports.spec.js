//skipping it for maintenance
describe.skip('Problem Reports Test suite', function () {

  beforeEach(function () {

    cy.viewport(1440, 900);
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('Set UP - Single domain User .', function () {
    cy.login();
  });

  it('Navigate to Operations - Problem Reports page', function () {

    cy.navigateToProblemReportsFunction();
  });

  it('Verify the Add WatchList functionality for problem reports by clicking on the Eye shapped button present in the very first column of problem reports list'
    , function () {

      cy.removeWatchListFunction();
    });


  it('Verify the "Remove WatchList" functionality for problem reports by clicking on the "Eye shapped" button present in the very first column of problem reports list.'
    , function () {

      cy.addWatchListFunction();
    });

  it('Verify the Add functionality of activity log in Problem Reports', function () {

    cy.addNoteActivityLogFunction();
  });

  it('Verify the Edit functionality of activity log in Problem Reports', function () {

    cy.editNoteActivityLogFunction();
  });

  it('Verify the Delete functionality of activity log in Problem Reports', function () {

    cy.deleteNoteActivityLogFunction();
  });

  it('Retrieve and display tags for problem report ID', function () {

    cy.assignTagToProblemReport();
  });

  it('Verify assignment of  tags for problem report ID', function () {

    cy.verifyAssignmentofTagToProblemReport();
  });

  it('Problem Report Editor - Add New Tag', function () {

    cy.addNewTagPR();
  });


  it('Problem Report Editor - General Information - Verify the design', function () {

    cy.verifyGeneralInfoFields();
  });


  it('Problem Report Editor - Status Info - Verify the design', function () {

    cy.verifyStatusInfoFields();
  });


  it('Problem Report Editor - Work Order Info - Verify the design', function () {

    cy.verifyWorkInfoFields();
  });

  it('Problem Report Editor - Data Channel - Delete DC', function () {

    cy.deleteDCfromPR();
  });

  
  it('Problem Report  - Verify description column descending order sorting', function () {

    cy.checkSorting();
  });

  
  it('Problem Report Editor - Data Channel - Verify the deletion is displayed in activity log', function () {

    cy.verifyDelDCActivity();
  });


  it('Problem Report Editor - Data Channel - Add deleted DC', function () {

    cy.addDCinPR();
  });

  it('Problem Report - Add Apply button to Filter', function () {

    cy.checkForProblemReportIssue();
  });
 

  
  
  




});