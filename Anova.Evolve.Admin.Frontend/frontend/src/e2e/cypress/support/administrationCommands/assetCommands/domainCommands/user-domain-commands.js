import '@testing-library/cypress/add-commands';
import UtilFunctions from '../../../utils/UtilFunctions';
const routes = require('../../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();


Cypress.Commands.add('domainNav', () => {
    cy.get('[aria-label="user nav"]',{timeout:30000})
});

Cypress.Commands.add('domainConfig', () => {
  cy.get('[aria-label="global nav"]').click( {force: true} )
  cy.get('[href="/admin/domain-manager"]').click( {force: true} )
});

Cypress.Commands.add('filterAndOpenTestAutomation', () => {
  cy.get('[id="filterText-input"]').click().type('test')
  cy.wait(1000)
  cy.contains('Apply').click({force: true})
  cy.get('[size="2"]').each((ele) =>{
    const text = ele.text()
    if (text === 'TestAutomation') {
      ele.trigger('click')
    }
  })
});

Cypress.Commands.add('enterNotes', (test) => {
  cy.contains('Notes').click()
  cy.wait(750)
  cy.get('[id="domainNotes-textarea"]').clear().type(test)
  cy.wait(750)
  cy.intercept('POST', routes.retrieveDomainNotes).as('domainNotes');
  cy.findAllByText('Save & Close').click()
  cy.wait('@domainNotes')
});

Cypress.Commands.add('verifyNotesIcon', (visibility) => {
  cy.get('[id="domain-notes-link"]').should(visibility)
});

Cypress.Commands.add('updatedBy', (userUpdated, timeoriginal, timeplus1, timeplus2) => {

  cy.findAllByText('Last Updated:').parent().next().find('p').then(($span) => {
      const value = $span.text();
      const Data = value.split("by")
      var user = Data[1]
      var time = Data[0].split(':')
      var time1 = time[0] + ':' + time[1]

      expect(time1).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
      expect(user).to.include(userUpdated)
  })
})

Cypress.Commands.add('deleteNotes', () => {
  cy.contains('Notes').click()
  cy.wait(750)
  cy.get('[id="domainNotes-textarea"]').clear()
  cy.intercept('POST', routes.retrieveDomainNotes).as('domainNotes');
  cy.findAllByText('Save & Close').click()
  cy.wait('@domainNotes')
});

Cypress.Commands.add('readableText', () => {
  cy.contains('Notes').click()
  cy.wait(750)
  cy.get('[id="domainNotes-textarea"]').should('not.be.singleLine')
  })

Cypress.Commands.add('userRole', () => {
    cy.get('[href="/admin/user-manager"]')
});

Cypress.Commands.add('userManager', () => {
  cy.get('[aria-label="user nav"]')
});

Cypress.Commands.add('filterByUserDropdown', () => {
    cy.get('[id="filterColumn-input"]')
});

Cypress.Commands.add('userName', () => {
    cy.get('[name="userName"]')
});

Cypress.Commands.add('firstName', () => {
    cy.get('[name="firstName"]')
});

Cypress.Commands.add('lastName', () => {
  cy.get('[name="lastName"]')
});

Cypress.Commands.add('companyName', () => {
    cy.get('[name="companyName"]')
});

Cypress.Commands.add('emailAddress', () => {
  cy.get('[name="emailAddress"]')
});

Cypress.Commands.add('addUserButton', () => {
 cy.findAllByText("Add User");
});




Cypress.Commands.add('verifyUsersCountFromAPIResponse', () => {

    //Count of readings count from API response
    cy.get('@userRecords').then((xhr) => {
    
    cy.itemCount()
    .then(function (itemsCount) {
    const items = itemsCount.text();
    var itemsList = items.split(' ');
    itemsList = itemsList[0].trim();
    
    expect(Number(itemsList)).to.be.equal(
    xhr.response.body.result.length
    );
});

});
    
});

Cypress.Commands.add('verifyUsersFromAPIResponse', () => {

  cy.get('@userRecords').then((xhr) => {

  const users = xhr.response.body.result.map(user => user.userName);

  utilFunctions.verifyColumnDetailsWithAPIResponse('tbody [aria-label="Username"]',users);

});
});

Cypress.Commands.add('editUserDetails', (editUsername,editFirstname,editCompanyname) => {

  cy.pageHeader().should('have.text','Edit User');
  cy.userName().clear().type(editUsername);
  cy.firstName().clear().type(editFirstname);
  cy.companyName().clear().type(editCompanyname);
  cy.get('[aria-labelledby = "domains.0.applicationUserRoleId-input"]').click();
  cy.get('li[role = "option"]').eq(2).click();
  cy.get('[aria-labelledby = "domains.1.applicationUserRoleId-input"]').click();
  cy.wait(1000);
  cy.get('li[role = "option"]').eq(4).click();
  cy.clickOnButton('Save & Close', routes.saveUser);

});

Cypress.Commands.add('selectUserToEdit', (username) => {

    cy.server();
    cy.route('GET', routes.getUserDetailsById).as('userDetailsRecords');

    cy.filterByUserDropdown().click();
    cy.selectDropdown('Username');
    cy.get('[id="filterText-input"]').type(username);
    cy.applyButton().click();

    cy.get('tbody [aria-label="Username"]').should('have.text',username).click();
    cy.wait('@userDetailsRecords').should('have.property', 'status', 200);

});

Cypress.Commands.add('verifyUserDetails', (username) => {

    var userName,
        firstName,
        companyName;


    cy.server();
    cy.route('GET', routes.getUserDetailsById).as('userDetailsRecords');    

    cy.filterByUserDropdown().click();
    cy.selectDropdown('Username');
    cy.get('[id="filterText-input"]').type(username); 
    cy.applyButton().click();

    cy.get('tbody [aria-label="Username"]')
    .first()
    .then((field) => {
        userName = field.text();
    });

    cy.get('tbody [aria-label="Company name"]')
    .first()
    .then((field) => {
        companyName = field.text();
    });

    cy.get('tbody [aria-label="First name"]')
    .first()
    .then((field) => {
        firstName = field.text();
    });

    //click on the user
    cy.get('tbody [aria-label="Username"]').should('have.text',username).click();
    cy.wait('@userDetailsRecords').should('have.property', 'status', 200);


    cy.userName()
      .invoke('val')
      .then((usernameTxt) => {
        expect(usernameTxt).to.be.equal(userName);
      });

      cy.firstName()
      .invoke('val')
      .then((firstNameTxt) => {
        expect(firstNameTxt).to.be.equal(firstName);
      });

      cy.companyName()
      .invoke('val')
      .then((companyNameTxt) => {
        expect(companyNameTxt).to.be.equal(companyName);
      });



});

  
Cypress.Commands.add('deleteUserByThreeDot',(method,url,locator,recordName)=> {

    cy.server();
    cy.route(method, url).as('records');
  
    cy.get(locator).each(($el, index) => {
      cy.log($el.text());
      const name = $el.text();
  
      if (name === recordName) {
        cy.get('[aria-label="Actions button"]').eq(index).click({
          force: true,
        });
        cy.wait(2000);
  
        cy.findByRole('presentation', { hidden: false })
          .contains('Delete')
          .click({
            force: true,
          });
          cy.findAllByText('Delete').eq(1)
            .click({
            force: true,
          });
          cy.wait('@records');
      }
    });
  
  });

Cypress.Commands.add('verifySiteDeletedItem', (recordName, message) => {
    cy.searchField()
      .clear({
        force: true,
      })
      .type(recordName);
    cy.applyButton().click();
    cy.wait(1000);
  
    cy.get('tr')
      .its('length')
      .then((len) => {
        cy.log(Number(len));
  
        if (len > 1) {
          cy.get('tbody [aria-label="Username"]').each(($el) => {
            expect($el.text()).to.not.equal(recordName);
          });
        } else {
          cy.findAllByText(message).should('exist');
        }
      });
  
    cy.searchField().clear();
    cy.applyButton().click();
  });

Cypress.Commands.add('verifyUserProfileDetails', () => {

    let firstnameResponse,lastnameResponse,emailaddressResponse;

    cy.intercept('GET',routes.getUserDetailsById).as('userWait');

    cy.findAllByText('Profile').click();

    cy.wait('@userWait').then(({response})=> {
      expect(response.statusCode).to.eq(200)

      firstnameResponse = response.body.firstName;
      lastnameResponse = response.body.lastName;
      emailaddressResponse = response.body.emailAddress;
    
    });
    cy.get('[name="firstName"]') .invoke('val')
    .then((userFirstname) => {
      const firstname = userFirstname;
      expect(firstname).to.be.equal(firstnameResponse);
    });
     
    cy.get('[name="lastName"]') .invoke('val')
    .then((userLastname) => {
      const lastname = userLastname;
      expect(lastname).to.be.equal(lastnameResponse);
    });
     
    cy.get('[name="emailAddress"]') .invoke('val')
    .then((userEmailAddress) => {
      const emailAddress = userEmailAddress;
      expect(emailAddress).to.be.equal(emailaddressResponse);
    });

});

Cypress.Commands.add('enterUserDetails', (username,firstname,lastname,companyName,emailAddress,password,confirmPassword,userType,userRole) => {

        cy.userName().type(username);
        cy.firstName().type(firstname);
        cy.lastName().type(lastname);
        cy.companyName().type(companyName);
        cy.emailAddress().type(emailAddress);
        cy.get('[id="newPassword-input"]').type(password);
        cy.get('[id="confirmNewPassword-input"]').type(confirmPassword,{force:true});
        cy.get('[id="mui-component-select-userTypeId"]').click();
        cy.selectDropdown(userType);
        cy.get('[id="domains.0.applicationUserRoleId-input"]').click();
        cy.selectDropdown(userRole);

});

Cypress.Commands.add('verifyErrorMessagesForRequiredFields', () => {
 
  cy.wait(3000);
  cy.clickButton('Save & Close');
  cy.findAllByText('Username is required.').should('be.visible');
  cy.findAllByText('First Name is required.').should('be.visible');
  cy.findAllByText('Last Name is required.').should('be.visible');
  cy.findAllByText('Company Name is required.').should('be.visible');
  cy.findAllByText('Email Address is required.').should('be.visible');
  cy.findAllByText('Invalid password').should('be.visible');
  cy.findAllByText('Confirm Password is required.').should('be.visible');
  cy.findAllByText('User must be assigned a user role to a minimum of one domain').should('be.visible');

  

});



