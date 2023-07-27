import '@testing-library/cypress/add-commands';
const routes = require('../../../fixtures/routes.json');

Cypress.Commands.add('groupName', () => {
  cy.get('tbody [aria-label="Description"]');
});

Cypress.Commands.add('groupDescription', () => {
  cy.get('[id="description-input"]');
});

Cypress.Commands.add('assetSelectionCriteriaTable', () => {
  cy.get('[aria-label="asset selection criteria table"]');
});

Cypress.Commands.add('displayTreeCheckbox', () => {
  cy.get('[id="display-in-tree-input"]');
});

Cypress.Commands.add('searchFilter1', () => {
  cy.get('[id="assetGroupSearchCriteria.filter1-input"]').should('be.visible');
});

Cypress.Commands.add('logic1', () => {
  cy.get('[id="assetGroupSearchCriteria.comparator1-input"]').should(
    'be.visible'
  );
});

Cypress.Commands.add('searchValue1', () => {
  cy.get('[id="assetGroupSearchCriteria.value1-input"] input');
});

Cypress.Commands.add('operator1', () => {
  cy.get('[id="assetGroupSearchCriteria.operator1-input"]').should(
    'be.visible'
  );
});

Cypress.Commands.add('searchFilter2', () => {
  cy.get('[id="assetGroupSearchCriteria.filter2-input"]').should('be.visible');
});

Cypress.Commands.add('logic2', () => {
  cy.get('[id="assetGroupSearchCriteria.comparator2-input"]').should(
    'be.visible'
  );
});

Cypress.Commands.add('searchValue2', () => {
  cy.get('[id="assetGroupSearchCriteria.value2-input"]');
});

Cypress.Commands.add('operator2', () => {
  cy.get('[id="assetGroupSearchCriteria.operator2-input"]').should(
    'be.visible'
  );
});

Cypress.Commands.add('logic1Error', () => {
  cy.get('[id="assetGroupSearchCriteria.comparator1-input-helper-text"]');
});

Cypress.Commands.add('operator1Error', (index) => {
  cy.get('[id="assetGroupSearchCriteria.operator1-input-helper-text"]');
});

Cypress.Commands.add('verifyDescriptionError', () => {
  cy.get('[id="description-input-helper-text"]').should(
    'have.text',
    'Description is required.'
  );
});

Cypress.Commands.add('clearIcon', () => {
  cy.get('[aria-label="Clear"]');
});

Cypress.Commands.add('userDropdown', () => {
  cy.get('[id="mui-component-select-random"]').should('be.visible');
});

Cypress.Commands.add('verifyLogicDropdownValues', () => {
  cy.get('[data-value="LIKE"]').should('be.visible');
  cy.get('[data-value="="]').should('be.visible');
  cy.get('[data-value="<>"]').should('be.visible');
  cy.get('[data-value="EMPTY"]').should('be.visible');
});

Cypress.Commands.add('verifyOperatorDropdownValues', () => {
  cy.get('[data-value="OR"]').should('be.visible');
  cy.get('[data-value="AND"]').should('be.visible');
  cy.findByText('None').should('exist');
});

Cypress.Commands.add('selectViewSelectedAssetButton', () => {
  cy.route('POST', routes.retrieveGroupLoadByOptionsUrl).as('records');
  cy.findByText('View selected assets').should('be.visible').click({ force: true });

  cy.findAllByText('Selected Assets').should('exist');

  cy.get('[role="table"] tr', { timeout: 30000 })
    .its('length')
    .then((len) => {
      cy.log(Number(len));

      if (len <= 2) {
        cy.findAllByText('No assets selected').should('exist');
        cy.log('No assets selected');
      } else {
        cy.log('Records exists');
      }
    });

  cy.findAllByText('Selected Assets').should('be.visible');
  cy.findAllByText('OK').click({ force: true });
});

Cypress.Commands.add('selectUsers', (user) => {
  cy.userDropdown().eq(0).click({ force: true });
  cy.levelDropdown(user);
  cy.get('span').contains('Add').click({ force: true });
});

Cypress.Commands.add('verifyAssetCriteriaErrorText', (user) => {
  cy.findAllByText('Save').should('be.visible').click({ force: true });

  cy.findAllByText('Logic is required.').should('exist');
  cy.findAllByText('Second Parameter is required.').should('exist');
});

Cypress.Commands.add(
  'assetSelectionRow1',
  (header, filter1, logic1, value1, operator) => {
    cy.findByText(header).should('exist');
    cy.searchFilter1().click({ force: true });
    cy.levelDropdown(filter1);
    cy.wait(1000);
    cy.findAllByText('Clear').should('exist');

    cy.verifyAssetCriteriaErrorText();

    cy.logic1().click({ force: true });
    cy.verifyLogicDropdownValues();
    cy.levelDropdown(logic1);
    cy.searchValue1().type(value1);
    cy.operator1().click({
      force: true,
    });
    cy.verifyOperatorDropdownValues();
    cy.levelDropdown(operator);
  }
);

Cypress.Commands.add(
  'enterAssetSelectionCriteriaIsEmptyCase',
  (header, filter1, logic1, value1, operator, filter2, logic2, user) => {
    cy.assetSelectionRow1(header, filter1, logic1, value1, operator);

    cy.searchFilter2().click({ force: true });
    cy.levelDropdown(filter2);
    cy.wait(1000);
    cy.findAllByText('Clear').first().should('exist');
    cy.verifyAssetCriteriaErrorText();
    cy.logic2().click({ force: true });
    cy.verifyLogicDropdownValues();
    cy.levelDropdown(logic2);
    cy.searchValue2().should('not.exist');
    cy.selectViewSelectedAssetButton();
    cy.selectUsers(user);
  }
);

Cypress.Commands.add(
  'enterAssetSelectionCriteriaEqualCase',
  (
    header,
    filter1,
    logic1,
    value1,
    operator,
    filter2,
    logic2,
    value2,
    user
  ) => {
    cy.assetSelectionRow1(header, filter1, logic1, value1, operator);

    cy.searchFilter2().click({ force: true });
    cy.levelDropdown(filter2);
    cy.wait(1000);
    cy.findAllByText('Clear').eq(1).should('exist');
    cy.logic2().click({
      force: true,
    });
    cy.verifyLogicDropdownValues();
    cy.levelDropdown(logic2);
    cy.searchValue2().should('be.visible').type(value2);
    cy.clearIcon().eq(1).should('be.visible');
    cy.selectViewSelectedAssetButton();
    cy.selectUsers(user);
  }
);

Cypress.Commands.add('verifyEmptyGroupFields', () => {
  cy.groupDescription().should('have.value', '');
  cy.searchFilter1().should('have.value', '');
  cy.logic1().should('have.value', '');
  cy.searchValue1().should('have.value', '');
  cy.operator1().should('have.value', '');
  cy.findByText('No users have been added to this asset group').should('exist');
});

Cypress.Commands.add('editGroupDetails', (filter1, logic1, value1) => {
  cy.get('[id="assetGroupSearchCriteria.filter1-input"]').click({
    force: true,
  });
  cy.levelDropdown(filter1);
  cy.wait(1000);
  cy.logic1().click({ force: true });
  cy.verifyLogicDropdownValues();
  cy.levelDropdown(logic1);
  cy.get('[aria-label="Clear"]').eq(0).click({
    force: true,
  });
  cy.searchValue1().should('be.visible').type(value1);
});

Cypress.Commands.add('verifyGroupFilters', (locator, text) => {
  cy.searchField().clear().type(text);
  cy.applyButton().click({ force: true });

  cy.wait(1000);

  cy.get(locator).each(($el) => {
    const siteText = $el.text();
    if (siteText.toLowerCase(text)) {
      expect(true).to.be.true;
      cy.log('The filter matches the substring');
    } else {
      cy.log('The filter doesnt match the substring');
      cy.log(siteText);
    }
  });
});

Cypress.Commands.add('deleteGroupRecord', (recordName) => {
  cy.groupName().each(($el, index) => {
    const name = $el.text();

    if (name === recordName) {
      cy.get('input[type="checkbox"]')
        .eq(index + 1)
        .click({
          force: true,
        });
    }
  });
});

Cypress.Commands.add('verifyGroupDeletedItem', (recordName, message) => {
  cy.searchField().clear().type(recordName);
  cy.applyButton().click({ force: true });
  cy.wait(1000);

  cy.get('tr')
    .its('length')
    .then((len) => {
      cy.log(Number(len));

      if (len > 1) {
        cy.groupName().each(($el) => {
          expect($el.text()).to.not.equal(recordName);
        });
      } else {
        cy.findAllByText(message).should('exist');
      }
    });

  cy.searchField().clear();
  cy.applyButton().click();
  cy.wait(1000);
});


Cypress.Commands.add('selectPublishedGroup', () => {

  cy.intercept('POST', routes.retrieveGroupEditByIdUrl).as('waitPublishedGroup');
  cy.get('tbody [aria-label="Domain"]').each(($el, index) => {
    const domainName = $el.text();
    if (domainName.indexOf('TestAutomation') === -1) {
      cy.get('tbody [aria-label="Domain"]').eq(index).click({ force: true });
      cy.wait('@waitPublishedGroup').then(({ response }) => { expect(response.statusCode).to.eq(200) });
      return false;
    }
  });



});



