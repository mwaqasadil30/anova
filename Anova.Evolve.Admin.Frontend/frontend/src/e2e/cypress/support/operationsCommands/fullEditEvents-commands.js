import '@testing-library/cypress/add-commands';

let valueLevel1=null, valueLevel2=null, valueLevel3=null, valueLevel4=null, valueLevel5=null;
let valueHyst1=null, valueHyst2=null, valueHyst3=null, valueHyst4=null, valueHyst5=null;
const URL = Cypress.config('baseUrl')
var environment = URL.match("https://(.*).transcend");
switch (environment[1]) {
  case 'test':
    valueLevel1=110, valueLevel2=61, valueLevel3=11, valueLevel4=21, valueLevel5=31;
    valueHyst1=1, valueHyst2=2, valueHyst3=3, valueHyst4=4, valueHyst5=5;
    break;
  case 'staging':
    valueLevel1=55, valueLevel2=44, valueLevel3=11, valueLevel4=33, valueLevel5=22;
    valueHyst1=1, valueHyst2=2, valueHyst3=3, valueHyst4=4, valueHyst5=5;
    break;
}
Cypress.Commands.add('verifyTableColumnsEvents',()=>{
    cy.contains("Enabled").should("be.visible");
    cy.contains("Description").should("be.visible");
    cy.contains("Inventory State").should("be.visible");
    cy.contains("Importance").should("be.visible");
    cy.contains("Value").should("be.visible");
    cy.contains("Set Point").should("be.visible");
    cy.contains("Hysteresis").should("be.visible");
    cy.contains("Event Delay").should("be.visible");
    cy.contains("Roster").should("be.visible");
    cy.contains("Graphed").should("be.visible");
    cy.contains("Summarized").scrollIntoView().should("be.visible");
    cy.contains("Always Triggered").scrollIntoView().should("be.visible");
    cy.contains("Integration ID").scrollIntoView().should("be.visible");
});

Cypress.Commands.add('verifyTableColumnsScheduleDelivery',()=>{
    cy.contains("Enabled").should("be.visible");
    cy.contains("Description").should("be.visible");
    cy.contains("Importance").should("be.visible");
    cy.contains("Roster").should("be.visible");
    cy.contains("Acknowledgement").scrollIntoView().should("be.visible");
    cy.contains("Integration ID").scrollIntoView().should("be.visible");
});

Cypress.Commands.add('navigateToEventEditor',()=>{
    cy.contains("Open Event Editor").should("be.visible").click();
});

Cypress.Commands.add('changeValuesOfLevelEvents',()=>{
    cy.get('[name = "inventoryEvents.0.eventValue"]').clear().type(valueLevel1);
    cy.get('[name = "inventoryEvents.1.eventValue"]').clear().type(valueLevel2);
    cy.get('[name = "inventoryEvents.2.eventValue"]').clear().type(valueLevel3);
    cy.get('[name = "inventoryEvents.3.eventValue"]').clear().type(valueLevel4);
    cy.get('[name = "inventoryEvents.4.eventValue"]').clear().type(valueLevel5);
});

Cypress.Commands.add('changeValuesOfSetPoints',()=>{
    cy.get('[aria-labelledby = "inventoryEvents.0.rtuChannelSetpointIndex-input"]').click();
    cy.get('[data-value="0"]').click();
    cy.get('[aria-labelledby = "inventoryEvents.1.rtuChannelSetpointIndex-input"]').click();
    cy.get('[data-value="1"]').click();
    cy.get('[aria-labelledby = "inventoryEvents.2.rtuChannelSetpointIndex-input"]').click();
    cy.get('[data-value="2"]').click();
    cy.get('[aria-labelledby = "inventoryEvents.3.rtuChannelSetpointIndex-input"]').click();
    cy.get('[data-value="3"]').click();
    cy.get('[aria-labelledby = "inventoryEvents.4.rtuChannelSetpointIndex-input"]').click();
    cy.get('[data-value="4"]').click();
});

Cypress.Commands.add('changeValuesOfhysteresisEvents',()=>{
    cy.get('[name = "inventoryEvents.0.hysteresis"]').clear().type(valueHyst1);
    cy.get('[name = "inventoryEvents.1.hysteresis"]').clear().type(valueHyst2);
    cy.get('[name = "inventoryEvents.2.hysteresis"]').clear().type(valueHyst3);
    cy.get('[name = "inventoryEvents.3.hysteresis"]').clear().type(valueHyst4);
    cy.get('[name = "inventoryEvents.4.hysteresis"]').clear().type(valueHyst5);
});

Cypress.Commands.add('enableUsageRateEvent',()=>{
    cy.get('[name = "usageRateEvent.isEnabled"]').click();
});

Cypress.Commands.add('enableScheduleDeliveryEventAndAssignImportance',()=>{
    cy.get('[aria-labelledby = "deliveryScheduleEvents.0.eventImportanceLevelId-input"]').click()
    cy.get('[data-value="1"]').click();
});

Cypress.Commands.add('checkDisableFieldsCannotBeEdited',()=>{
    cy.get('[aria-labelledby = "deliveryScheduleEvents.1.eventImportanceLevelId-input"]')
      .should("have.attr","aria-disabled","true")  
});

Cypress.Commands.add('addRosterToLevelEvent',()=>{
    cy.editnewRosters().click({force:true});
    cy.findAllByText('Add Roster').click();
    cy.addRosters();
    cy.findAllByText('Save & Close').click({force:true});
    cy.wait(3000);
});

Cypress.Commands.add('verifyValueOfLevelEvents',()=>{
    cy.contains("Save").click();
    cy.wait(3000);
    cy.get('[aria-label = "back"]').click();
    cy.wait(5000);
    cy.get("table")
      .find("tbody")
      .find("tr")
      .find("td")
      .contains("Full")
      .parent()
      .then((tr) => {
      cy.get("td")
        .contains(valueLevel1);
      })
      cy.get("table")
        .find("tbody")
        .find("tr")
        .find("td")
        .contains("Reorder")
        .parent()
        .then(($btn) => {
        cy.get("td")
          .contains(valueLevel2);
        })
      cy.get("table")
        .find("tbody")
        .find("tr")
        .find("td")
        .contains("Refill")
        .parent()
        .then(($btn) => {
        cy.get("td")
          .contains(valueLevel3);
        })
      cy.get("table")
        .find("tbody")
        .find("tr")
        .find("td")
        .contains("Critical")
        .parent()
        .then(($btn) => {
        cy.get("td")
          .contains(valueLevel4);
        })
      cy.get("table")
        .find("tbody")
        .find("tr")
        .find("td")
        .contains("Empty")
        .parent()
        .then(($btn) => {
        cy.get("td")
          .contains(valueLevel5);
        })

});

Cypress.Commands.add('verifyValueOfSetPointsOfLevelEvents',()=>{
  cy.wait(5000);
  cy.get("table")
    .find("tbody")
    .find("tr")
    .find("td")
    .contains("Full")
    .parent()
    .then((tr) => {
    cy.get("td")
      .contains("-");
    })
    cy.get("table")
      .find("tbody")
      .find("tr")
      .find("td")
      .contains("Reorder")
      .parent()
      .then(($btn) => {
      cy.get("td")
        .contains(valueHyst1);
      })
    cy.get("table")
      .find("tbody")
      .find("tr")
      .find("td")
      .contains("Refill")
      .parent()
      .then(($btn) => {
      cy.get("td")
        .contains(valueHyst2);
      })
    cy.get("table")
      .find("tbody")
      .find("tr")
      .find("td")
      .contains("Critical")
      .parent()
      .then(($btn) => {
      cy.get("td")
        .contains(valueHyst3);
      })
    cy.get("table")
      .find("tbody")
      .find("tr")
      .find("td")
      .contains("Empty")
      .parent()
      .then(($btn) => {
      cy.get("td")
        .contains(valueHyst4);
      })

});
