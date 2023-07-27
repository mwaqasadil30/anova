Cypress.Commands.add('messageTemplateDescription', () => {
    cy.get('[id="description-input"]');
});

Cypress.Commands.add('subjectField', () => {
    cy.get('[id="subjectTemplateOptions-input"]');
});

Cypress.Commands.add('bodyField', () => {
    cy.get('[id="bodyTemplateOptions-input"]');
});

Cypress.Commands.add('timeZoneType', () => {
    cy.get('[id="timeZoneTypeId-input"]');
});

Cypress.Commands.add('timeZoneMessageTemplate', () => {
    cy.get('[id="timeZoneId-input"]');
});


Cypress.Commands.add('verifyErrorValidationForRequiredFields', () => {

    cy.findAllByText('Description is required.').should('be.visible');
    cy.findAllByText('Body is required.').should('be.visible');   

});

Cypress.Commands.add('enterMessageTemplateDetails', (templateDescription,timeZoneType) => {
   
    //enter settings
    cy.messageTemplateDescription().type(templateDescription);
    cy.timeZoneType().click({force:true});
    cy.selectDropdown(timeZoneType);
    cy.timeZoneMessageTemplate().click();
    cy.selectDropdown('(UTC-06:00) Central Time (US & Canada)');
    
    //enter template content 
    //Subject
    cy.subjectField().click();
    cy.selectDropdown('Asset.Title');
    cy.findAllByText('Add').first().click();

    //Body
    cy.get('[name="bodyTemplate"]').type('Event: ',{force:true});
    cy.bodyField().click();
    cy.selectDropdown('Event.Description');
    cy.findAllByText('Add').last().click();

    cy.verifyPreviewFunctionality();    
    cy.verifyValidateFunctionality();
 
});

Cypress.Commands.add('editMessageTemplateDetails', (editMessageTemplate) => {

    cy.messageTemplateDescription().clear().type(editMessageTemplate);

    //Add fields in Body
    cy.get('[name="bodyTemplate"]').type('DataChannel: ',{force:true});
    cy.bodyField().click();
    cy.selectDropdown('DataChannel.Description');
    cy.findAllByText('Add').last().click();  

    cy.verifyPreviewFunctionality();
    cy.verifyValidateFunctionality();
 
});


Cypress.Commands.add('verifyPreviewFunctionality', () => {
    cy.clickButton('Preview');
    cy.findAllByText('Message Template Preview').should('be.visible');
    cy.findAllByText('Close').click();
    
});

Cypress.Commands.add('verifyValidateFunctionality', () => {
    cy.clickButton('Validate');
    cy.findAllByText('Subject and body templates are valid').should('be.visible');
    cy.clickButton('OK');
});
