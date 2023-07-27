import '@testing-library/cypress/add-commands';

Cypress.Commands.add('pollName', () => {
  cy.get('input[name="name"]');
});

Cypress.Commands.add('pollScheduleName', () => {
  cy.get('[id="mui-component-select-typeOfSchedule"]');
});

Cypress.Commands.add('minDateAge', () => {
  cy.get('input[name="minDataAge"]');
});

Cypress.Commands.add('timeZone', () => {
  cy.get('[id="mui-component-select-timeZoneId"]');
});


Cypress.Commands.add(
  'enterPollScheduleDetails',
  (pollName, scheduleType, minDataAge, timeZone, headerText) => {
    cy.findByText(headerText).should('exist');

    cy.pollName().clear().should('be.visible').type(pollName);

    cy.pollScheduleName().should('be.visible').click();
    cy.get('li[data-value="1"]')
      .as('intervalDropdown')
      .should('have.text', 'Interval');

    cy.get('li[data-value="2"]')
      .as('timeDropdown')
      .should('have.text', 'Time of Day');

    cy.get(scheduleType).click();

    cy.minDateAge().clear().should('be.visible').type(minDataAge);

    cy.timeZone().click({ force: true });
    cy.findAllByText(timeZone).click({ force: true });
  }
);

Cypress.Commands.add(
  'enterPollIntervalDetails',
  (
    pollName,
    scheduleType,
    minDataAge,
    timeZone,
    headerText,
    pollInterval,
    pollOffset
  ) => {
    cy.enterPollScheduleDetails(
      pollName,
      scheduleType,
      minDataAge,
      timeZone,
      headerText
    );

    cy.get('input[name="interval"]')
      .should('be.visible')
      .clear({ force: true })
      .type(pollInterval, { force: true });

    cy.get('input[name="offsetTime"]')
      .clear({ force: true })
      .should('be.visible')
      .type(pollOffset, { force: true });
  }
);

Cypress.Commands.add('addScheduleButton', () => {
  cy.findAllByText('Add Schedule').should('be.visible').click();
});

Cypress.Commands.add('pollTimeField', (index) => {
  cy.get(`input[name="rtuPollSchedules[${index}].scheduledPollTime"]`);
});

Cypress.Commands.add(
  'enterPollDayTimeDetails',
  (
    pollName,
    scheduleType,
    minDataAge,
    timeZone,
    headerText,
    pollTime,
    pollTime2,
    pollTime3,
    pollTime4,
    pollTime5
  ) => {
    cy.enterPollScheduleDetails(
      pollName,
      scheduleType,
      minDataAge,
      timeZone,
      headerText
    );

    cy.pollTimeField(0).clear().should('be.visible').type(pollTime);

    cy.get('input[name="rtuPollSchedules[0].isEnabled"]')
      .should('be.checked')
      .and('have.attr', 'value', 'true');

    cy.addScheduleButton();

    cy.pollTimeField(1).clear().should('be.visible').clear().type(pollTime2);

    cy.get('input[name="rtuPollSchedules[1].isEnabled"]')
      .should('be.checked')
      .and('have.attr', 'value', 'true');

    cy.findAllByText('Remove').should('be.visible');

    cy.addScheduleButton();

    cy.pollTimeField(2).clear().should('be.visible').clear().type(pollTime3);

    cy.get('input[name="rtuPollSchedules[2].isEnabled"]')
      .should('be.checked')
      .and('have.attr', 'value', 'true');

    cy.findAllByText('Remove').eq(1).should('be.visible');

    cy.findAllByText('Add Schedule').should('be.visible');
  }
);

Cypress.Commands.add(
  'enterPollDayTimeFieldsDetails',
  (
    pollName,
    scheduleType,
    minDataAge,
    timeZone,
    headerText,
    pollTime,
    pollTime2,
    pollTime3,
    pollTime4,
    pollTime5
  ) => {
    cy.enterPollScheduleDetails(
      pollName,
      scheduleType,
      minDataAge,
      timeZone,
      headerText
    );

    cy.pollTimeField(0).clear().should('be.visible').type(pollTime);

    cy.get('input[name="rtuPollSchedules[0].isEnabled"]')
      .should('be.checked')
      .and('have.attr', 'value', 'true');

    cy.addScheduleButton();

    cy.pollTimeField(1).clear().should('be.visible').clear().type(pollTime2);

    cy.get('input[name="rtuPollSchedules[1].isEnabled"]')
      .should('be.checked')
      .and('have.attr', 'value', 'true');

    cy.findAllByText('Remove').should('be.visible');

    cy.addScheduleButton();

    cy.pollTimeField(2).clear().should('be.visible').clear().type(pollTime3);

    cy.get('input[name="rtuPollSchedules[2].isEnabled"]')
      .should('be.checked')
      .and('have.attr', 'value', 'true');
    cy.pollTimeField(3).clear().should('be.visible').clear().type(pollTime4);
    cy.pollTimeField(4).clear().should('be.visible').clear().type(pollTime5);

    cy.findAllByText('Remove').eq(1).should('be.visible');

    cy.findAllByText('Add Schedule').should('be.visible');
  }
);

Cypress.Commands.add('verifyAllPollFieldsAreClear', () => {
  cy.pollName().should('have.value', '');

  cy.pollScheduleName().should('have.value', '');

  cy.minDateAge().should('have.value', '0');

  cy.timeZone().should('have.value', '');

  cy.get('input[name="interval"]').should('have.value', '0');

  cy.get('input[name="offsetTime"]').should('have.value', '00:00');
});
