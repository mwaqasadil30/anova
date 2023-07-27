Cypress.Commands.add('AddGeofence', () => {
    cy.findAllByText("Add Geofence");
});

Cypress.Commands.add('GeofenceDescription', () => {
    cy.get('[id="description-input"]');
});

Cypress.Commands.add('GeofenceCategory', () => {
    cy.get('[id="mui-component-select-geoAreaCategoryTypeId"]');
});


Cypress.Commands.add('RequiredFieldsGeofencingValidation', () => {

    cy.findAllByText('Description is required.').should('be.visible');    

});

Cypress.Commands.add('enterGeofenceDetails', (GeofenceDescription) => {
   
    //enter description 
    cy.GeofenceDescription().type(GeofenceDescription);
    
    //select category
    cy.GeofenceCategory().click();
    cy.selectDropdown('Port');

}); 

Cypress.Commands.add('editGeofenceDetails', (GeofenceDescription) => {

    cy.GeofenceDescription().clear().type(GeofenceDescription);
 
});

Cypress.Commands.add('verifyEditedGeofenceDetails', (GeofenceDescription) => {

    cy.get("tbody[role='rowgroup']")
      .find('tr')
      .contains(GeofenceDescription);
 
});




