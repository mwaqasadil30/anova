import '@testing-library/cypress/add-commands';
const routes = require('../../../fixtures/routes.json');

Cypress.Commands.add('navToOps', () => {

  cy.navigateToAppPicker('POST', 'Operations', routes.getAssetSummaryByOptionUrl);
  cy.waitProgressBarToDisappear();
  cy.assetSummaryIcon().click();
  cy.pageHeader().should('have.text', 'Asset Summary');
  cy.url().should('include', 'ops/asset-summary');
});

Cypress.Commands.add('navToRTUsEditor', (rtuID, detailsEP) => {

  const rtuLink = `"/admin/rtu-manager/${rtuID}/edit/packets-and-call-history"`;

  cy.server().route('GET', routes.retrieveAssetDetailById).as('assetDetails');
  cy.intercept('GET', detailsEP).as('fileRTUDetails');

  cy.clearNavItemIfVisible();
  cy.findAllByText('Show Filters').click({ force: true });
  cy.filterByDropdown().click();
  cy.verifyFilterByDropdownFields();
  cy.selectDropdown('RTU');
  cy.filterByDropdown().should('have.text', 'RTU');

  cy.enterName(rtuID);


  cy.assetDescriptionCell().first().click({ force: true });
  cy.wait('@assetDetails').should('have.property', 'status', 200);

  cy.findByRole('tab', { name: /Details/i }).should('exist');
  cy.findByRole('tab', { name: /Readings/i }).should('exist');
  cy.findByRole('tab', { name: /Map/i }).should('exist');

  cy.assetInfoHeaderPanel()
    .findAllByText('Asset Information')
    .should('be.visible');

  cy.get(`a[href = ${rtuLink}]`)
    .should('be.visible')
    .click();
  cy.wait('@fileRTUDetails');
  cy.contains('Packets').click()
  cy.findByRole('table', { name: /table/i }).should('exist');
});

Cypress.Commands.add('checkDefaultValue', () => {

  const d = new Date();
  var year = d.getFullYear();
  var month = (1 + d.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = d.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  const new_d = month + '/' + day + '/' + year;
  cy.get('[id="channel-input"]').click({ force: true })
  cy.contains('Channel');
  cy.findAllByText('Select All').click({ force: true });
  cy.get('body').click(0, 0)
  cy.get('#channel-input').contains('All');
  cy.contains('Packet Category');
  cy.get('#packetCategory-input').contains('All');
  cy.contains('Direction');
  cy.get('#direction-input').contains('Any');
  cy.contains('Before')
  cy.get('#startDate-input').should('have.attr', 'value', new_d);
  cy.contains('Row Count');
  cy.get('#rowCount-input').should('have.attr', 'value', '200');

});

Cypress.Commands.add('verifyFieldsForRTUEditor', (values, i) => {

  cy.get('.MuiSelect-nativeInput').eq(i).should('have.attr', 'value', `${values}`);
});

Cypress.Commands.add('verifyDatePicker', () => {

  cy.get('#startDate-input').clear();
  cy.contains('Required').should('be.visible');
});

Cypress.Commands.add('verifyInvalidFormat', () => {

  cy.get('#startDate-input').type('222');
  cy.contains('Invalid Date Format').should('be.visible');
});

Cypress.Commands.add('datePickerInfluence', () => {

  const d = new Date();
  var year = d.getFullYear();
  var month = (1 + d.getMonth()).toString();
  month = month.length > 1 ? month : month;
  var day = d.getDate().toString();
  day = day.length > 1 ? day : day;
  const new_d = month + '/' + day + '/' + year;

  cy.get('#startDate-input').type('02022022');
  cy.contains('Apply').click();
  cy.get('[role = "table"]')
    .find('[class*="MuiTableBody-root"]')
    .find('div > div') //using tags because selectors are dynamic 
    .find('[class*="MuiTableRow-root"]')
    .eq(0)
    .find('[class*="MuiTableCell-root"]')
    .eq(4)
    .invoke('text')
    .then($date_new => {
      var date_new_1 = $date_new.split(/(\s+)/);
      //  expect(date_new_1[0]).to.eq(new_d);
    })
});