import UtilFunctions from '../../support/utils/UtilFunctions';

describe.skip('Roster Feature API Automation', function () {

   let domainId = null,
       uniqueRosterName = null,
       editRosterName=null,
       messageTemplateID =null,
       searchUserID=null,
       rosterId = null,
       rosterUserId =null;

   const utilFunctions = new UtilFunctions();

   beforeEach(function () {
      // Preserve only the session cookie in every test
      Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return cookie && cookie.name === '.AspNetCore.Session';
         },
      });
   });

   it('POST - Login User', () => {
      var loginPayload = {
         "username": Cypress.env('USERNAME'),
         "password": Cypress.env('PASS')
      }
      cy.request(
         'POST',Cypress.config('apiUrl')+'/AuthenticateAndRetrieveApplicationInfo',
         loginPayload,
      ).then(response => {
         expect(response.status).equal(200)
         expect(response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.username.toLowerCase()).equal(loginPayload.username.toLowerCase())

         domainId = response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.domainId;

      });

   });

   it('GET - ROSTER',() => {

     cy.request(
        'GET',Cypress.config('apiUrl')+'/Roster/domains/'+domainId)
        .then(response => {
        expect(response.status).equal(200);
     });

   });

   it('POST - Add ROSTER',() => {

    uniqueRosterName = utilFunctions.suffixWithDate('Test Roster_');
    var rosterPayload = {
        "description":uniqueRosterName,
        "isEnabled":true,
        "rosterUsers":[],
        "domainId":domainId
    }

    cy.request(
       'POST',Cypress.config('apiUrl')+'/Roster',rosterPayload)
       .then(response => {
       expect(response.status).equal(200);
       expect(response.body.description).equal(uniqueRosterName);
       expect(response.body.isEnabled).to.be.true;

       rosterId = response.body.rosterId;
       
    });


      //Get message template ID for the Roster
      cy.request('GET',Cypress.config('apiUrl')+'/MessageTemplate/domains/'+domainId+'?searchExpression=')
        .then(response => {
         expect(response.status).equal(200);
         messageTemplateID = response.body[0].messageTemplateId;
   });

 
     //Get User ID for the Roster
     cy.request('GET',Cypress.config('apiUrl')+'/User/Search/domains/'+domainId+'?searchExpression=')
       .then(response => {
       expect(response.status).equal(200);
       searchUserID = response.body[0].userId;
    });

   });

   it('POST - Assign User to ROSTER',() => {

    var assignUserRosterPayload = {
        "userId":searchUserID,
        "isEnabled":true,
        "isEmailSelected":true,
        "emailMessageTemplateId":messageTemplateID,
        "isPushSelected":false
    }

    cy.request(
       'POST',Cypress.config('apiUrl')+'/Roster/'+rosterId+'/users',assignUserRosterPayload)
       .then(response => {
       expect(response.status).equal(200);
       expect(response.body.userId).equal(searchUserID);
       expect(response.body.emailMessageTemplateId).equal(messageTemplateID);
       expect(response.body.isEnabled).equal(assignUserRosterPayload.isEnabled);
       expect(response.body.isEmailSelected).equal(assignUserRosterPayload.isEmailSelected);
       expect(response.body.isPushSelected).equal(assignUserRosterPayload.isPushSelected);
    
       rosterUserId = response.body.rosterUserId;
    });

   });

   it('Update Roster User Details',() =>{

    //Edit User Roster Details
    var editUserRosterPayload = {
        "userId":searchUserID,
        "isEnabled":false,
        "isEmailSelected":false,
        "emailMessageTemplateId":messageTemplateID,
        "isPushSelected":false,
        "rosterUserId": rosterUserId
    }

    cy.request(
       'POST',Cypress.config('apiUrl')+'/Roster/'+rosterId+'/users',editUserRosterPayload)
       .then(response => {
       expect(response.status).equal(200);
       expect(response.body.userId).equal(searchUserID);
       expect(response.body.isEnabled).equal(editUserRosterPayload.isEnabled);
       expect(response.body.isEmailSelected).equal(editUserRosterPayload.isEmailSelected);
       expect(response.body.isPushSelected).equal(editUserRosterPayload.isPushSelected);
       });

       //add another roster user

   });

   it('Delete Roster User and update the roster description',()=>{

    //Update Roster Description + delete Roster User
    editRosterName = utilFunctions.suffixWithDate('Edit Roster_');
    var deleteRosterUserPayload = {
        "description":editRosterName,
        "isEnabled":false,
        "rosterUsers":[],
        "domainId":domainId,
        "rosterId":rosterId}

        cy.request(
            'POST',Cypress.config('apiUrl')+'/Roster',deleteRosterUserPayload)
            .then(response => {
            expect(response.status).equal(200);
            expect(response.body.description).equal(editRosterName);
            expect(response.body.isEnabled).equal(deleteRosterUserPayload.isEnabled);
            expect(response.body.rosterUsers).to.be.empty;
            
         });
   });

   it('Delete Roster',()=>{

    cy.request(
        'DELETE',Cypress.config('apiUrl')+'/Roster?rosterIds='+rosterId)
        .then(response => {
        expect(response.status).equal(200);
     });

   });


});
