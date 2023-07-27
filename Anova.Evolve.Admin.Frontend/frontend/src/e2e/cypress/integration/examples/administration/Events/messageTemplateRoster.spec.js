const routes = require('../../../../fixtures/routes.json');
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const utilFunctions = new UtilFunctions();

describe('Roster Test suite', function () {

  let messageTemplateName=null,
  editMessageTemplateName = null;

  beforeEach(function () {

    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('Set UP-1-As Single domain User .',{retries : 10}, function () {
    cy.login();
  });

  it('Navigate to Administration app -  Events - Message Template ', function () {
   
    cy.intercept('GET', routes.retrieveMessageTemplates).as('templateRecords');
    cy.waitProgressBarToDisappear();
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });

    cy.get('[aria-label="events nav"]').click();
    cy.get('[title="Message Template"] a').click({force:true});
    cy.wait('@templateRecords').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.pageHeader().should('have.text','Message Template')


  });

  it('Add Message Template - Error validation for required fields',function(){

    utilFunctions.itemsCountBefore();
    cy.clickBtn('Add Message Template','GET',routes.getMessageTemplateFields);
    cy.pageHeader().should('have.text','Add Message Template');
    cy.clickButton('Save & Close');
    cy.verifyErrorValidationForRequiredFields();

  });

  it('Add Message Template',function(){

    cy.intercept('GET', routes.retrieveMessageTemplates).as('getTemplates');
    messageTemplateName = utilFunctions.suffixWithDate('Test Message Template_');
    cy.enterMessageTemplateDetails(messageTemplateName,'Domain Available Time Zone');
    cy.clickBtn('Save & Close','POST',routes.saveMessageTemplate);
    cy.wait('@getTemplates').then(({response})=> {expect(response.statusCode).to.eq(200)});
    utilFunctions.verifyItemsCountAfter(1);

  });

  it('Edit Message Template',function(){

    cy.verifyPageUrl('GET',
      routes.messageTemplateUrl,
      routes.retrieveMessageTemplates
    );

    cy.intercept('GET', routes.getMessageTemplateById).as('getTemplatesId');
    cy.searchField().type(messageTemplateName);
    cy.applyButton().click();
    cy.get('tbody [aria-label="Description"]').first().click({ force: true });
    cy.wait('@getTemplatesId').then(({response})=> {expect(response.statusCode).to.eq(200)});
    editMessageTemplateName = utilFunctions.suffixWithDate('Edit Message Template_');
    cy.editMessageTemplateDetails(editMessageTemplateName);
    cy.clickBtn('Save & Close','POST',routes.saveMessageTemplate)

  });

  it('Delete Message Template by 3 dot menu',function(){

  cy.searchField().clear().type(editMessageTemplateName, {force: true});
  cy.clickButton('Apply');
  cy.deleteObjectByThreeDot('DELETE',routes.deleteMessageTemplate,'tbody [aria-label="Description"]',editMessageTemplateName);
  cy.verifyRosterDeletedItem(editMessageTemplateName, 'No message templates found');

  });

});