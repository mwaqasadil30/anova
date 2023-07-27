import '@testing-library/cypress/add-commands';

Cypress.Commands.add('description', () => {
  cy.get('[id="description-input"]');
});

Cypress.Commands.add('dataChannelType', () => {
  cy.get('[id="dataChannelTypes-input"]');
});

Cypress.Commands.add('dataChannelTypeDropdown', () => {
  cy.get(
    '[aria-labelledby="dataChannelTypes-input-label dataChannelTypes-input"]'
  );
});

Cypress.Commands.add('level1', () => {
  cy.get('[id="level1-input"]').should('be.visible');
});

Cypress.Commands.add('level2', () => {
  cy.get('[id="level2-input"]').should('be.visible');
});

Cypress.Commands.add('level3', () => {
  cy.get('[id="level3-input"]').should('be.visible');
});

Cypress.Commands.add('level4', () => {
  cy.get('[id="level4-input"]').should('be.visible');
});

Cypress.Commands.add('closeDropdown', () => {
  cy.get('body').type('{esc}');
});

Cypress.Commands.add('descriptionError', () => {
  cy.get('[id="description-input-helper-text"]');
});

Cypress.Commands.add('levelDropdown', (text) => {
  cy.get('[role="listbox"]')
    .find('li')
    .each(($el, index) => {
      const level = $el.text();

      if (level === text) {
        cy.get('[role="listbox"]').find('li').eq(index).click({
          force: true,
        });
      }
    });
});

Cypress.Commands.add(
  'enterTreeDetails',
  (desc, level1, level2, level3, level4) => {
    cy.description().clear().type(desc);
    cy.level1().click();
    cy.levelDropdown(level1);
    cy.level2().click();
    cy.levelDropdown(level2);
    cy.level3().click();
    cy.levelDropdown(level3);
    cy.level4().click();
    cy.levelDropdown(level4);
  }
);

Cypress.Commands.add('enterTreeDetails2Levels', (desc, level1, level2) => {
  cy.description().type(desc);
  cy.level1().click({ force: true });
  cy.levelDropdown(level1);
  cy.wait(1000);
  cy.level2().click({ force: true });
  cy.levelDropdown(level2);
});

Cypress.Commands.add('verifyTreeFieldsAreClear', (header) => {
  cy.description().should('have.value', '');
  cy.level1().should('have.value', '');
  cy.level2().should('have.value', '');
  cy.level3().should('have.value', '');
  cy.level4().should('have.value', '');
});

Cypress.Commands.add('verifyDataChannelTypeDropdown', (assert) => {
  cy.dataChannelTypeDropdown().click({
    force: true,
  });

  cy.get('[aria-labelledby="dataChannelTypes-input-label"]')
    .find('[type="checkbox"]')
    .each(($el, index) => {
      cy.get('[aria-labelledby="dataChannelTypes-input-label"]')
        .find('[type="checkbox"]')
        .eq(index)
        .should(assert);
    });

  cy.closeDropdown();
});

Cypress.Commands.add('verifySelectAllDCType', () => {
  cy.dataChannelType().click({
    force: true,
  });

  //Deselect Data Channel Types
  cy.findByText('Deselect All').click({ force: true });
  cy.dataChannelType().should('have.text', 'None');
  cy.get('[aria-labelledby="dataChannelTypes-input-label"]')
    .find('[type="checkbox"]')
    .each(($el, index) => {
      cy.get('[aria-labelledby="dataChannelTypes-input-label"]')
        .find('[type="checkbox"]')
        .eq(index)
        .should('not.be.checked');
    });

  cy.wait(1000);
  cy.findByText('Select All').click({
    force: true,
  });
  cy.get('[aria-labelledby="dataChannelTypes-input-label"]')
    .find('[type="checkbox"]')
    .each(($el, index) => {
      cy.get('[aria-labelledby="dataChannelTypes-input-label"]')
        .find('[type="checkbox"]')
        .eq(index)
        .should('be.checked');
    });
  cy.closeDropdown();
});

Cypress.Commands.add('selectDataChannelType', () => {
  cy.dataChannelType().click({
    force: true,
  });
  cy.findByText('Deselect All').should('exist');
  cy.get('[type="checkbox"]').should('be.checked');
  cy.get('[type="checkbox"]').uncheck({force:true});
  cy.findByText('Select All').should('exist');
  cy.dataChannelType().click({
    force: true,
  });

  cy.closeDropdown();
});

Cypress.Commands.add('verifyTreeDeleted', (recordName) => {
  cy.get('[aria-label="Name"] a').each(($el) => {
    const name = $el.text();

    if (name !== recordName) {
      expect($el.text()).to.not.equal(recordName);
    } else {
      cy.log('tree name exits');
      cy.log(recordName);
    }
  });
});

Cypress.Commands.add('deleteTreeRecord', (recordName) => {
  cy.get('[aria-label="Name"] a').each(($el, index) => {
    const name = $el.text();

    if (name === recordName) {
      cy.log(name);
      cy.get('input[type="checkbox"]')
        .eq(index + 1)
        .click({
          force: true,
        });
    }
  });
});
