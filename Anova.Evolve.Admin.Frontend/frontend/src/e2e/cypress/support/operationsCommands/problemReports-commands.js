import '@testing-library/cypress/add-commands';
const routes = require('../../fixtures/routes.json');

Cypress.Commands.add('problemReportIcon', () => {
  cy.get('[aria-label="problem reports nav"]');
});

Cypress.Commands.add('domainIdDropDown', () => {
  cy.get('[id="domain-dropdown-button"]');
});

Cypress.Commands.add('addToWatchList', () => {
  cy.get('[aria-label="Add to watch list"]');
});

Cypress.Commands.add('getAssetTitle', () => {
  cy.get('[aria-label="Asset title"]');
});

Cypress.Commands.add('watchList', () => {
  cy.get('[aria-label="All assets icon"]');
});

Cypress.Commands.add('watchListNavItem1', () => {
  cy.get('[aria-label="Watchlist items nav"]');
});

Cypress.Commands.add('getShipToNumber', () => {
  cy.get('[aria-label="Ship To"]');
});

Cypress.Commands.add('watchListStatus', () => {
  cy.get('[aria-label="Change watchlist status"]');
});

Cypress.Commands.add('backButton', () => {
  cy.get('[aria-label="back"]');
});

Cypress.Commands.add('tabPanel', () => {
  cy.get('[aria-label="tabpanel"]');
});

Cypress.Commands.add('notesPR', () => {
  cy.get('[id="note.notes-input"]');
});

Cypress.Commands.add('validateActivityLog', () => {
  cy.get('[aria-label="Note text"]');
});

Cypress.Commands.add('editActivityLog', () => {
  cy.get('[aria-label="Edit note"]');
});

Cypress.Commands.add('editActivityLogField', () => {
  cy.get('[aria-invalid="false"]');
});

Cypress.Commands.add('confirmEditActivityLogField', () => {
  cy.get('[aria-label="Confirm edit note"]');
});

Cypress.Commands.add('deletetActivityLogField', () => {
  cy.get('[aria-label="Delete note"]');
});

Cypress.Commands.add('navigateToProblemReportsFunction', () => {

  cy.intercept('GET', routes.problemReportsEditor).as('problemReportsRecords');
  cy.intercept('POST', routes.getAssetSummaryByOptionUrl).as('retrieveData')
  cy.domainIdDropDown().type('TestAutomation-AP' + '{enter}');
  cy.navigateToAppPicker2('Operations');
  cy.wait(5000);
  cy.wait('@retrieveData').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.problemReportIcon().click();
  cy.wait('@problemReportsRecords').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.pageHeader().should('have.text', 'Problem Reports');
  cy.url().should('include', '/ops/problem-reports');
  cy.waitProgressBarToDisappear();

});

Cypress.Commands.add('addWatchListFunction', () => {

  cy.intercept('POST', routes.removeFromWatchList).as('addPR');
  cy.intercept('GET', routes.problemReportEditorSetting).as('loadingPR');
  cy.intercept('GET', routes.problemReportsEditor).as('problemReportsRecords');
  cy.intercept('DELETE', routes.removeFromWatchList).as('deletePR');
  cy.getShipToNumber().eq(1).click();
  cy.wait('@loadingPR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.watchListStatus().contains('Add To Watch List').click();
  cy.wait('@addPR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.backButton().click();
  cy.wait('@problemReportsRecords').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.waitProgressBarToDisappear();
  cy.get('body').then(body => {
    if (body.find('[aria-label="Remove from watch list"]').length > 0) {
      cy.log(body.find('[aria-label="Remove from watch list"]').length);
      cy.get('[aria-label="Remove from watch list"]').eq(0).click();
      cy.wait('@deletePR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
    }
  });
});

Cypress.Commands.add('removeWatchListFunction', () => {

  cy.intercept('DELETE', routes.removeFromWatchList).as('deletePR');
  cy.intercept('POST', routes.removeFromWatchList).as('addPR');
  cy.intercept('GET', routes.problemReportEditorSetting).as('loadingPR');
  cy.intercept('GET', routes.problemReportsEditor).as('problemReportsRecords');
  cy.get('body').then(body => {

    if (body.find('[aria-label="Remove from watch list"]').length > 0) {
      cy.log(body.find('[aria-label="Remove from watch list"]').length);
      cy.get('[aria-label="Remove from watch list"]').eq(0).click();
      cy.wait('@deletePR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
    }
  })
  cy.wait(2000);
  cy.addToWatchList().eq(0).click();
  cy.getAssetTitle().eq(1).invoke('text')
    .then((text1) => {
      cy.log(text1);
      cy.wait('@addPR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
      cy.wait(1500);
      // cy.watchList().click();
      // cy.watchListNavItem1().eq(0).should('contain',text1);
      cy.getShipToNumber().eq(1).click();
      cy.wait('@loadingPR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
      cy.watchListStatus().contains('Remove From Watch List').click();
      cy.wait('@deletePR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
      cy.backButton().click();
      cy.wait('@problemReportsRecords').then(({ response }) => { expect(response.statusCode).to.eq(200) });
      cy.waitProgressBarToDisappear();
      // cy.watchList().click().contains('No watch lists found'); 
    });
});

Cypress.Commands.add('addNoteActivityLogFunction', () => {

  var notes = "Adding a note to activity log";
  cy.intercept('GET', routes.problemReportEditorSetting).as('loadingPR');
  cy.intercept('POST', routes.activityLogLoad).as('activityLog');
  cy.wait(2000);
  cy.getShipToNumber().eq(1).click();
  cy.wait('@loadingPR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.notesPR().type(notes);
  cy.findAllByText('Save Note').click();
  cy.wait('@activityLog').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.validateActivityLog().contains(notes);

});

Cypress.Commands.add('editNoteActivityLogFunction', () => {

  var editNotes = "Editing note to activity log";
  cy.intercept('GET', routes.editActivityLogNote).as('editNote');
  cy.editActivityLog().eq(0).click();
  cy.editActivityLogField().eq(9).click().clear().type(editNotes);
  cy.confirmEditActivityLogField().click();
  cy.wait('@editNote').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.validateActivityLog().contains(editNotes);

});

Cypress.Commands.add('deleteNoteActivityLogFunction', () => {

  cy.intercept('DELETE', routes.deleteActivityLogNote).as('deleteNote');
  cy.deletetActivityLogField().eq(0).click();
  cy.wait(1500);
  cy.get('[type="button"]').contains('Delete').click();
  cy.wait('@deleteNote').then(({ response }) => { expect(response.statusCode).to.eq(200) });
});

Cypress.Commands.add('showFilterBtn', () => {
  cy.contains('Show Filters').click()
})

Cypress.Commands.add('PRFilterOpetions', (num) => {
  cy.get('#status-input').click()
  cy.get(`li[data-value="${num}"]`).click()
})

Cypress.Commands.add('openPRPage', () => {
  cy.get('[aria-label="problem reports nav"]').click()

})

Cypress.Commands.add('sortDescription', (index, text) => {
  cy.contains('Description').click()
  cy.get('div[aria-label="Description"]').eq(index).should('contain.text', text)
})
Cypress.Commands.add('assignTagToProblemReport', () => {

  cy.intercept('GET', 'https://api-test.transcend.anova.com/ProblemReport?AssetSearchExpression=&ViewTypeId=0&ShowClosed=false&ShowOpen=true&FilterByTypeId=1&LoadUserSettings=false&IsCountRequired=false&FilterText=').as('getPR');
  cy.get('.MuiAutocomplete-root > .MuiFormControl-root').click();
  cy.get('li[role = "option"]').first().click();
  cy.get('button[type = "button"]')
    .find('span[class = "MuiButton-label"]')
    .contains('Save & Close')
    .click();
  cy.wait(5000);
});


Cypress.Commands.add('verifyAssignmentofTagToProblemReport', () => {

  cy.get('[aria-label="Tags"]').eq(1).contains('#test').should('be.visible');
});

Cypress.Commands.add('addNewTagPR', () => {

  cy.intercept('GET', routes.problemReportEditorSetting).as('loadingPR');
  cy.getShipToNumber().eq(1).click();
  cy.wait('@loadingPR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.get('.MuiAutocomplete-root > .MuiFormControl-root').type('#New_Tag');
  cy.contains('Add New Tag').should('be.visible');
});

Cypress.Commands.add('verifyGeneralInfoFields', () => {

  cy.contains('Business Unit').should('be.visible');
  cy.contains('Region').should('be.visible');
  cy.contains('RTU').should('be.visible');
  cy.contains('Importance').should('be.visible');
  cy.contains('Asset').should('be.visible');
  cy.contains('Description').should('be.visible');
  cy.contains('Reported By').should('be.visible');
  cy.contains('Current Op Status').should('be.visible');
  cy.contains('Tags').should('be.visible');
  cy.contains('Resolution').should('be.visible');
});

Cypress.Commands.add('verifyStatusInfoFields', () => {

  cy.contains('Priority').should('be.visible');
  cy.contains('Open Date').should('be.visible');
  cy.contains('Fix Date').should('be.visible');
});

Cypress.Commands.add('verifyWorkInfoFields', () => {

  cy.contains('Work Order #').should('be.visible');
  cy.contains('Initiated').should('be.visible');
  cy.contains('Closed').should('be.visible');
});

Cypress.Commands.add('addDCinPR', () => {

  cy.intercept('POST', 'https://api-test.transcend.anova.com/ProblemReport/*/AffectedDataChannel').as('addDC');
  cy.intercept('GET', 'https://api-test.transcend.anova.com/ProblemReport/*').as('loadPRedit');
  cy.get('.MuiTableFooter-root > .MuiTableRow-root > .MuiTableCell-root > .MuiButtonBase-root', { timeout: 30000 })
    .click()
  cy.get('#filterColumn-input')
    .click()
  cy.get('[data-value="1"]', { timeout: 30000 })
    .contains('RTU')
    .click();
  cy.get('#filterText-input')
    .type('F0000668' + '{enter}');
  cy.wait(2000);
  cy.get('tbody > tr')
    .find('td > p > a')
    .eq(4)
    .contains('AMIAG AG Asset for LBShell Integration [ ] 1238')
    .parent()
    .parent()
    .siblings('td')
    .eq(0)
    .click();
  cy.get('.MuiDialogActions-root > .MuiBox-root > .MuiButtonBase-root')
    .contains('Add Selected')
    .click();
  cy.wait('@addDC');
  cy.wait('@loadPRedit').then(({ response }) => { expect(response.statusCode).to.eq(200) });
});

Cypress.Commands.add('deleteDCfromPR', () => {

  cy.intercept('DELETE', 'https://api-test.transcend.anova.com/ProblemReport/*/AffectedDataChannel/*').as('delDC');
  cy.get('tbody > tr')
    .find('td')
    .contains('AMIAG AG Asset for LBShell Integration [ ] 1238')
    .parent()
    .parent()
    .siblings()
    .eq(0)
    .click();
  cy.wait(1500);
  cy.get('[type="button"]').contains('Delete').click();
  cy.wait('@delDC');


});

Cypress.Commands.add('checkSorting', () => {

  cy.intercept('GET', "https://api-test.transcend.anova.com/ProblemReport?AssetSearchExpression=&ViewTypeId=0&ShowClosed=false&ShowOpen=true&FilterByTypeId=1&LoadUserSettings=false&IsCountRequired=false&FilterText=").as('prPage');
  cy.get('button[type = "button"]')
    .find('span[class = "MuiButton-label"]')
    .contains('Save & Close')
    .click();
  cy.wait(5000);

});

Cypress.Commands.add('verifyDelDCActivity', () => {
  cy.intercept('GET', routes.problemReportEditorSetting).as('loadingPR');
  cy.getShipToNumber().eq(1).click();
  cy.wait('@loadingPR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.get('.MuiSwitch-root > .MuiButtonBase-root > .MuiIconButton-label')
    .click();
  cy.contains('The following Data Channels were removed from the Affected Data Channel list:')
    .should('be.visible');
});

Cypress.Commands.add('checkForProblemReportIssue', () => {

  cy.intercept('GET', '	https://api-test.transcend.anova.com/ProblemReport?AssetSearchExpression=&ViewTypeId=0&ShowClosed=false&ShowOpen=true&FilterByTypeId=3&LoadUserSettings=false&IsCountRequired=false&FilterText=*mentor*').as('filterPR');
  cy.checkSorting();
  cy.get('span[class="MuiButton-label"]')
    .contains('Show Filters')
    .click();
  cy.get('div[id ="filterBy-input"]')
    .click();
  cy.get('li')
    .contains('Asset Title')
    .click();
  cy.get('input[id = "filterText-input"]')
    .type("mentor" + '{enter}');
  cy.wait('@filterPR').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.get('input[id = "filterText-input"]')
    .clear();
  cy.get('div[class="MuiInputBase-root MuiInput-root MuiAutocomplete-inputRoot MuiInputBase-fullWidth MuiInput-fullWidth MuiInputBase-formControl MuiInput-formControl MuiInputBase-adornedEnd"]')
    .type("#test" + '{enter}');
  cy.get('div[aria-label = "Active filter count"]')
    .contains('1')
    .should('be.visible');

});

Cypress.Commands.add('ProblemReportSupportCloseReOpen', () => {
  cy.PRFilterOpetions(0); //Select filter option OPEN
  cy.get('[aria-label="Problem number"]').eq(1).then(
    ($problem_number) => {
      const problem_number = $problem_number.text();
      cy.get('[aria-label="Problem number"]').eq(1).click();
      cy.get('[aria-label="Close problem report"]').should('have.text', "Close PR");
      cy.contains('Close PR').click({ force: true });
      cy.findAllByText('Close Problem Report?').should('be.visible');
      cy.get('[role="dialog"]').find('.MuiBox-root').find('.MuiGrid-container').find('.MuiGrid-item').find('.MuiGrid-container').find('.MuiGrid-item').find('button:nth-child(1)').contains('Cancel').click({ force: true });
      cy.reload()
      cy.get('[aria-label="Page header"').should('contain.text', problem_number);
      cy.get('[aria-label="Problem report status type"]').should('have.text', "Open");
      cy.contains('Close PR').click({ force: true });
      cy.get('[role="dialog"]').find('.MuiBox-root').find('.MuiGrid-container').find('.MuiGrid-item').find('.MuiGrid-container').find('.MuiGrid-item').find('button:nth-child(1)').contains('Close').click({ force: true });
      cy.reload()
      cy.get('[aria-label="Problem report status type"]').should('have.text', "Closed");
      cy.get('[aria-label="Reopen problem report"]').should('not.have.text', "Close PR");
      cy.get('[aria-label="Reopen problem report"]').should('have.text', "Reopen PR");
      cy.get('[aria-label="Reopen problem report"]').contains('Reopen PR').click({ force: true });
      cy.findAllByText('Reopen Problem Report?').should('be.visible');
      cy.get('[role="dialog"]').find('.MuiBox-root').find('.MuiGrid-container').find('.MuiGrid-item').find('.MuiGrid-container').find('.MuiGrid-item').find('button:nth-child(1)').contains('Cancel').click({ force: true });
      cy.reload()
      cy.get('[aria-label="Problem report status type"]').should('have.text', "Closed");
      cy.get('[aria-label="Page header"').should('contain.text', problem_number);
      cy.get('[aria-label="Reopen problem report"]').contains('Reopen PR').click({ force: true });
      cy.get('[role="dialog"]').find('.MuiBox-root').find('.MuiGrid-container').find('.MuiGrid-item').find('.MuiGrid-container').find('.MuiGrid-item').find('button:nth-child(1)').contains('Reopen').click({ force: true });
      cy.reload()
      cy.get('[aria-label="Problem report status type"]').should('have.text', "Open");
      cy.get('[aria-label="Close problem report"]').should('have.text', "Close PR");
      cy.get('[aria-label="Close problem report"').should('not.have.text', "Reopen PR");
    });
});


