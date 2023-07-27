const routes = require('../../../../fixtures/routes.json');
import UtilFunctions from '../../../../support/utils/UtilFunctions';
const utilFunctions = new UtilFunctions();

describe('Roster Test suite', function () {

  let geofenceDesc=null,
      geofenceDescEdit = null;

  beforeEach(function () {

    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('Set UP-1-As Single domain User .', {retries : 10},function () {

    cy.login();

  });

  it('Navigate to Administration app -  Events -  Geofencing ', function () {

    cy.intercept('GET', routes.retrieveGeofencing).as('geofence');
    cy.waitProgressBarToDisappear();
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Administration').click({
      force: true,
    });

    cy.get('[aria-label="events nav"]').click();
    cy.get('[title="Geofencing"] a').click({force:true});
    cy.wait('@geofence').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.pageHeader().should('have.text','Geofence Manager');

  });

  it('Add Geofence - Error validation for required fields',function(){

    utilFunctions.itemsCountBefore();
    cy.AddGeofence().click();
    cy.pageHeader().should('have.text','Add Geofence');
    cy.clickButton('Save & Close');
    cy.RequiredFieldsGeofencingValidation();

  });

  it('Add Geofence',function(){

    cy.intercept('GET', routes.retrieveGeofencing).as('getGeofence');
    geofenceDesc = utilFunctions.suffixWithDate('Test Geofence_');
    cy.enterGeofenceDetails(geofenceDesc);
    cy.clickButton('Save & Close');
    cy.wait('@getGeofence').then(({response})=> {expect(response.statusCode).to.eq(200)});
    utilFunctions.verifyItemsCountAfter(1);

  });

  it('Edit Geofence',function(){

    cy.intercept('GET', routes.getGeofenceById).as('getGeofenceId');
    cy.searchField().type(geofenceDesc);
    cy.applyButton().click();
    cy.get('tbody [aria-label="Description"]').first().click({ force: true });
    cy.wait('@getGeofenceId').then(({response})=> {expect(response.statusCode).to.eq(200)});
    geofenceDescEdit = utilFunctions.suffixWithDate('Edit Test Geofence_');
    cy.editGeofenceDetails(geofenceDescEdit);
    cy.clickButton('Save & Close');

  });

  it('Edit Geofence - Verify ',function(){

    cy.verifyEditedGeofenceDetails(geofenceDescEdit);

  });

  it('Delete Geofence by 3 dot menu',function(){

    cy.searchField().clear().type(geofenceDescEdit, {force: true});
    cy.clickButton('Apply');
    cy.deleteObjectByThreeDot('DELETE',routes.getGeofenceById,'tbody [aria-label="Description"]',geofenceDescEdit);
    cy.verifyRosterDeletedItem(geofenceDescEdit, 'No Geofences found');
  
    });



})