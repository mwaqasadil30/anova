import UtilFunctions from '../utils/UtilFunctions';
const routes = require('../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();

class forgotPasswordAPIPage {

 VerifyUsername() {
        cy.request(
        'POST',Cypress.config('apiUrl')+routes.forgotPassword,{"userName" :Cypress.env('USERNAME')},
         ).then(response => {
         expect(response.status).equal(200);
       });
 }
}
export default forgotPasswordAPIPage;