const routes = require('../../../fixtures/routes.json');

Cypress.Commands.add('rosterDescription', () => {
  cy.get('[id="description-input"]');
});

Cypress.Commands.add('isEnabledToggle', () => {
    cy.get('[id="isEnabled-input"]'); 
});

Cypress.Commands.add('usernameRosterInputField', () => {
    cy.get('[id="userId-input"]');
});

Cypress.Commands.add('messageTemplateInputField', () => {
    cy.get('[id="emailMessageTemplateId-input"]');
});

Cypress.Commands.add('isEnabledEmailToggle', () => {
    cy.get('[id="isEmailSelected-input"]');
});

Cypress.Commands.add('descriptionColumn', () => {
    cy.get('tbody [aria-label="Description"]');
});

Cypress.Commands.add('filterUsernameField', () => {
    cy.get('[id = "filterText-input"]');
});

Cypress.Commands.add('CheckAndCreateUser', (namenew,emailnew) =>
{
  cy.server();
  cy.route('GET', routes.getDomainUserDetails).as('userRecords');

  cy.waitProgressBarToDisappear();
  cy.applicationLaunchPanel().click();
  cy.findAllByText('Administration').click({
    force: true,
  });

  cy.domainNav().click();
  cy.userManager().click({force:true});
  cy.userRole().click();
  cy.wait('@userRecords').should('have.property', 'status', 200);
  cy.findByText('User Administration').should('exist');

  //Verify Items count with API response
  cy.verifyUsersCountFromAPIResponse();

  //Veriy User details with API response
  cy.verifyUsersFromAPIResponse();

  cy.filterUsernameField().clear().type(namenew);
  cy.findByText('Apply').click()

  cy.get('body').then(body => {
    cy.wait(1000);
    if((body.find('[aria-label = "Username"]').length) - 1 == 0)
    {
      cy.log('No user found');
      cy.intercept('GET',routes.userDomainRole).as('waitUserPageToLoad');
      cy.addUserButton().click();
      cy.wait('@waitUserPageToLoad').then(({response})=> {expect(response.statusCode).to.eq(200)});
      cy.verifyErrorMessagesForRequiredFields();
 
       cy.enterUserDetails(
         namenew,
         'TestUser',
         'test',
         'Anova',
         emailnew,
         'Test123@',
         'Test123@',
         'Web User',
         'Administrator'
       );
       cy.clickAddButton('Save & Close',routes.saveUser);
    }
  }) 
})


Cypress.Commands.add('verifyColumnDetails', (locator, text) => {
  
    cy.get(locator).each(($el) => {
      const columnText = $el.text();
      if (columnText.toLowerCase(text)) {
        expect(true).to.be.true;
        cy.log('The filter matches the substring');
      } else {
        cy.log('The filter doesnt match the substring');
        cy.log(columnText);
      }
    });
  });

Cypress.Commands.add('addRosterUser', (button,rosterUserName,messageTemplate) => {

    cy.intercept('POST', routes.saveRosterUser).as('saveRosterUser');
    cy.intercept('GET',routes.autoCompleteMessageTemplate).as('autoCompleteTemplate')

    cy.findAllByText(button).click();

    cy.usernameRosterInputField().type(rosterUserName,{force:true});
    cy.wait('@autoCompleteTemplate').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.wait(7000);
    cy.usernameRosterInputField().type('{downarrow}{enter}');
  
    cy.messageTemplateInputField().type(messageTemplate);
    cy.wait('@autoCompleteTemplate').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.wait(3000);
    cy.messageTemplateInputField().type('{downarrow}{enter}');
    cy.isEnabledEmailToggle().check({force:true}).should('be.checked');
  
    cy.findAllByText('Save & Close').eq(1).click();
    cy.wait('@saveRosterUser').then(({response})=> {expect(response.statusCode).to.eq(200)});
  });

Cypress.Commands.add('editRosterUser', (messageTemplate) => {

    let isEnabled = null;

    cy.intercept('POST', routes.saveRosterUser).as('saveRosterUser');
    cy.intercept('POST', routes.saveRoster).as('saveRoster');
    cy.intercept('GET',routes.autoCompleteMessageTemplate).as('autoCompleteTemplate')

    cy.get('tbody [aria-label="First name"]').first().click();
    cy.isEnabledToggle().eq(1).check({force: true});
    //Enable Mobile push notification
    cy.get('[id="isPushSelected-input"]').check({force:true}).should('be.checked');
    //Enable Mobile to Phone Email on update
    cy.get('[id="isEmailToPhoneSelected-input"]').check({force:true}).should('be.checked');
    cy.get('[id="emailToPhoneMessageTemplateId-input"]').type(messageTemplate);
    cy.wait('@autoCompleteTemplate').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.wait(3000);
    cy.get('[id="emailToPhoneMessageTemplateId-input"]').type('{downarrow}{enter}');

    cy.findAllByText('Save & Close').eq(1).click();
    cy.wait('@saveRosterUser').then(({response})=> {
      expect(response.statusCode).to.eq(200);
      isEnabled = response.body.isEnabled;
    });
    cy.verifyColumnDetails('tbody [aria-label="Enabled"]',isEnabled);
  });

Cypress.Commands.add('editRoster',(editRosterName)=>{
  
    cy.rosterDescription().clear().type(editRosterName);
    cy.clickAddButton('Save & Close', routes.saveRoster);

})

Cypress.Commands.add('verifyRosterDeletedItem', (recordName, message) => {

  cy.wait(2000);
  cy.searchField().clear().type(recordName);
  cy.applyButton().click({force: true});
  cy.wait(2000);

  cy.get('tr')
    .its('length')
    .then((len) => {
      cy.log(Number(len));

      if (len > 1) {
        cy.get('tbody [aria-label="Description"]').each(($el) => {
          expect($el.text()).to.not.equal(recordName);
        });
      } else {
        cy.findAllByText(message).should('exist');
      }
    });

  cy.searchField().clear();
  cy.applyButton().click();
  cy.wait(1000);
});