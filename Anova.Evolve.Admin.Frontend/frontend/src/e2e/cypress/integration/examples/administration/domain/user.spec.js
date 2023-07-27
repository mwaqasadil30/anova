/// <reference types="cypress" />
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();


describe('User Administration testsuite', function () {

    let customerNameSelector = 'tbody [aria-label="Username"]',
        uniqueUserName,
        editUsername;

  beforeEach(function () {

    cy.viewport(1440, 900);
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('Login',{retries : 10}, function () {
    cy.login();
  });

  it('User Administration - Verify domain User details ', function () {
    
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
    

  });

  it('User Administration - Sort by -Ascending/Descending order', function () {

    utilFunctions.verifyColumnSortingDesc(customerNameSelector);

    cy.get('[role="columnheader"][aria-label="Username"]').click()
    utilFunctions.verifyColumnSortingAsc(customerNameSelector);
  });

  it('User Administration - Error validation for required fields',function(){

    cy.intercept('GET',routes.userDomainRole).as('waitUserPageToLoad');
    cy.addUserButton().click();
    cy.wait('@waitUserPageToLoad').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.verifyErrorMessagesForRequiredFields();

  });

  it('User Administration - Add a new User',function(){

      uniqueUserName = 'TestUser_' + utilFunctions.randomString();
     const emailAddress = 'testuser_'+ utilFunctions.randomString()+'@testautomation.com';

      cy.enterUserDetails(
         uniqueUserName,
        'TestUser',
        'test',
        '10p',
        emailAddress,
        'Test123@',
        'Test123@',
        'Web User',
        'Administrator'
      );
      cy.clickAddButton('Save & Close',routes.saveUser);

  });

  it('User Administration - Edit User profile and verify details', function () {

    editUsername = 'EditUser_' + utilFunctions.randomString();
    const editFirstname = 'editfirst' + utilFunctions.randomString();
    const editCompanyname = 'editC' + utilFunctions.randomString();

    cy.selectUserToEdit(uniqueUserName);
    cy.editUserDetails(editUsername,editFirstname,editCompanyname);
    cy.verifyUserDetails(editUsername);
    cy.goBack('GET',routes.getDomainUserDetails);
    
  });

  it('User Administration - Delete User',function(){

    cy.verifyPageUrl('POST',
      routes.userManager,
      routes.getDomainUserDetails
    );
    cy.searchField().type(editUsername);     
    cy.applyButton().click();

    cy.deleteUserByThreeDot('DELETE',routes.getUserDetailsById,'tbody [aria-label="Username"]',editUsername);
    cy.verifySiteDeletedItem(editUsername,'No users found');
  })

  it('View User Profile',function(){

    cy.get('[id="user-avatar-button"]').click();
    //verify user profile UI with API response
    cy.verifyUserProfileDetails();

  })
});