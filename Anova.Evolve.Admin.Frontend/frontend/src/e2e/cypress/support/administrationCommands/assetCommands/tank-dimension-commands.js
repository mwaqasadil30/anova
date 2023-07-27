import '@testing-library/cypress/add-commands';
const routes = require('../../../fixtures/routes.json');

Cypress.Commands.add('tankRecordName', () => {
  cy.get('tbody [aria-label="Description"]');
});

Cypress.Commands.add('tankDescription', () => {
  cy.get('[name="description"]').should('be.visible');
});

Cypress.Commands.add('tankType', () => {
  cy.get('[id="mui-component-select-tankType"]').should('be.visible');
});

Cypress.Commands.add('unitsOfMeasure', () => {
  cy.get('[id="mui-component-select-unitsOfMeasure"]').should('be.visible');
});

Cypress.Commands.add('length', () => {
  cy.get('[name="height"]').should('be.visible');
});

Cypress.Commands.add('diameter', () => {
  cy.get('[name="width"]').should('be.visible');
});

Cypress.Commands.add('coneLength', () => {
  cy.get('[name="dishHeight"]').should('be.visible');
});

Cypress.Commands.add('assetList', () => {
  cy.get('[aria-label="Asset list"]').should('be.visible');
});

Cypress.Commands.add('strappingCheckbox', () => {
  cy.get('[name="isStrappingUsedForWeb"]');
});

Cypress.Commands.add('strappingLevelUnit', () => {
  cy.get('[id="mui-component-select-strappingLevelUnits"]').should(
    'be.visible'
  );
});

Cypress.Commands.add('strappingVolumeUnit', () => {
  cy.get('[id="mui-component-select-strappingVolumeUnits"]').should(
    'be.visible'
  );
});

Cypress.Commands.add('strappingHeight0', () => {
  cy.get('[name="tankStrappings[0].height"]');
});

Cypress.Commands.add('strappingVolume0', () => {
  cy.get('[name="tankStrappings[0].volume"]');
});

Cypress.Commands.add(
  'editTankDimensionDetails',
  (header, tankDesc, tankType, tankImage, unit, length, diameter) => {
    cy.server();
    cy.route('POST', routes.generateStrappingChartUrl).as('chart');

    cy.findByText(header).should('exist');

    cy.tankDescription().clear().type(tankDesc);
    cy.tankType().click();
    cy.levelDropdown(tankType);
    cy.get(tankImage).should('be.visible');
    cy.unitsOfMeasure().click();
    cy.levelDropdown(unit);
    cy.findAllByText('Generate Strapping Points').should('not.be.enabled');
    cy.length().clear().should('have.attr', 'type', 'number').type(length);
    cy.diameter().clear().should('have.attr', 'type', 'number').type(diameter);
  }
);

Cypress.Commands.add(
  'enterTankDimensionDetails',
  (header, tankDesc, tankType, tankImage, unit, length, diameter) => {
    cy.server();
    cy.route('POST', routes.generateStrappingChartUrl).as('chart');

    cy.findByText(header).should('exist');

    cy.tankDescription().clear().type(tankDesc);

    //None error message
    cy.tankType().click();
    cy.levelDropdown('None');
    cy.length().click({
      force: true,
    });
    cy.findAllByText(
      'Tank Type cannot be None unless Strapping Points are provided.'
    ).should('exist');

    cy.tankType().click();
    cy.levelDropdown(tankType);

    //check image
    cy.get(tankImage).should('be.visible');

    //verify unit fields
    cy.get('label').contains('Can Length (L)').should('exist');
    cy.get('label').contains('Diameter (D)').should('exist');

    cy.unitsOfMeasure().click();
    cy.levelDropdown(unit);
    cy.findAllByText('Generate Strapping Points').should('not.be.enabled');
    cy.length().clear().should('have.attr', 'type', 'number').type(length);
    cy.diameter().clear().should('have.attr', 'type', 'number').type(diameter);
  }
);

Cypress.Commands.add(
  'enterTankDimensionDetailsWithStrappingPoints',
  (
    header,
    tankDesc,
    tankType,
    tankImage,
    unit,
    length,
    diameter,
    level,
    volumne
  ) => {
    cy.enterTankDimensionDetails(
      header,
      tankDesc,
      tankType,
      tankImage,
      unit,
      length,
      diameter
    );

    cy.strappingCheckbox().check().should('be.checked');
    cy.findAllByText('Strapping Points are required.').should('exist');
    cy.get(tankImage).should('be.visible');
    cy.strappingLevelUnit().and('have.text', 'm').click();
    cy.levelDropdown(level);
    cy.strappingVolumeUnit().and('have.text', 'm3').click();
    cy.levelDropdown(volumne);

    cy.get('span')
      .contains('Generate Strapping Points')
      .should('be.visible')
      .click();

    cy.wait('@chart').should('have.property', 'status', 200);

    cy.get('tbody tr').should('not.be.empty');

    cy.findAllByText('Strapping Points are required.').should('not.exist');
  }
);

Cypress.Commands.add('verifybyDefaultStrappingPoints', () => {
  cy.strappingCheckbox().check().should('be.checked');
  cy.findAllByText('Strapping Points are required.').should('exist');

  cy.strappingLevelUnit().and('have.text', 'm');
  cy.strappingVolumeUnit().and('have.text', 'm3');

  cy.get('span')
    .contains('Generate Strapping Points')
    .should('be.visible')
    .click();

  cy.wait('@chart').should('have.property', 'status', 200);

  cy.get('tbody tr').should('not.be.empty');

  cy.findAllByText('Strapping Points are required.').should('not.exist');
});

Cypress.Commands.add(
  'enterConicalTankDetails',
  (
    header,
    tankDesc,
    tankType,
    tankImage,
    unit,
    length,
    diameter,
    coneLength
  ) => {
    cy.enterTankDimensionDetails(
      header,
      tankDesc,
      tankType,
      tankImage,
      unit,
      length,
      diameter
    );

    cy.get('label').contains('Cone Length (CL)').should('exist');
    cy.coneLength().type(coneLength);
  }
);

Cypress.Commands.add(
  'enterTankDimensionWithManualStrappingPoints',
  (
    header,
    tankDesc,
    tankType,
    tankImage,
    unit,
    length,
    diameter,
    dishDept,
    level,
    volumne
  ) => {
    cy.enterTankDimensionDetails(
      header,
      tankDesc,
      tankType,
      tankImage,
      unit,
      length,
      diameter
    );
    cy.coneLength().type(dishDept);

    cy.strappingCheckbox().check().should('be.checked');

    cy.findAllByText('Strapping Points are required.').should('exist');

    cy.strappingLevelUnit().and('have.text', 'm').click();
    cy.levelDropdown(level);
    cy.strappingVolumeUnit().and('have.text', 'm3').click();
    cy.levelDropdown(volumne);

    cy.strappingHeight0().type('-1');
    cy.strappingVolume0().click();
    cy.findAllByText('Height must be greater than or equal to 0.').should(
      'exist'
    );
    cy.strappingHeight0().clear();

    cy.get('span').contains('Generate Strapping Points').should('be.visible');

    var level = [
      0,
      5.6842,
      11.368,
      17.053,
      22.737,
      28.421,
      34.105,
      39.789,
      45.474,
      51.158,
      56.842,
      62.526,
      68.211,
      73.895,
      79.579,
      85.263,
      90.947,
      96.632,
      102.32,
      108,
    ];
    var volume = [
      0,
      142.02,
      403.26,
      738.7,
      1129.5,
      1563.1,
      2029.5,
      2520.5,
      3028.4,
      3546.5,
      4967.8,
      4585.8,
      5093.8,
      5584.7,
      6051.2,
      6484.7,
      6875.5,
      7211,
      7472.2,
      7614.2,
    ];
    var i;
    for (i = 0; i < 20; i++) {
      cy.get(`[name="tankStrappings[${i}].height"]`).type(level[i]);
      cy.get(`[name="tankStrappings[${i}].volume"]`).type(volume[i]);
    }

    cy.findAllByText('Strapping Points are required.').should('not.exist');
  }
);

Cypress.Commands.add('enterManualStrappingPoints', (level, volume) => {
  cy.strappingLevelUnit().and('have.text', 'm');
  cy.strappingVolumeUnit().and('have.text', 'm3');

  var i;
  for (i = 0; i < 20; i++) {
    cy.get(`[name="tankStrappings[${i}].height"]`).type(level);
    cy.get(`[name="tankStrappings[${i}].volume"]`).type(volume);
  }
});

Cypress.Commands.add('verifyTankFieldsAreClear', () => {
  cy.tankDescription().and('have.value', '');
  cy.tankType().and('have.value', '');
  cy.unitsOfMeasure().and('have.value', '');
  cy.length().and('have.value', '');
  cy.diameter().and('have.value', '');
});

Cypress.Commands.add('verifyTankDeletedItem', (recordName, message) => {
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
        cy.tankRecordName().each(($el) => {
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

Cypress.Commands.add('deleteTankRecord', (recordName) => {
  cy.tankRecordName().each(($el, index) => {
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

Cypress.Commands.add('selectItemfromTankList', (itemName, url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.tankRecordName().each(($el, index) => {
    const name = $el.text();
    if (name === itemName) {
      cy.tankRecordName().eq(index).click({
        force: true,
      });
    }
  });
  cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add('viewTankRecord', (headerText) => {
  cy.server();
  cy.route('POST', routes.retrieveTankEditByIdUrl).as('records');
  cy.route('POST', routes.retrieveTankByDomainUrl).as('tankRecords');

  cy.wait(1000);

  cy.get('[aria-label="Data channel count"]').each(($el, index) => {
    var rec = $el.text();
    var rec = Number(rec);

    cy.log(rec);
    if (rec > 0) {
      cy.tankRecordName().eq(index).click({
        force: true,
      });
      cy.wait('@records').should('have.property', 'status', 200);
      cy.findByText(headerText).should('exist');
      cy.get('[aria-label="Asset list"] [role="menuitem"]').should('exist');
      cy.go('back');
      cy.wait('@tankRecords').should('have.property', 'status', 200);
      return false;
    } else {
      cy.log('No Data Channel is greater than 0');
    }
  });
});

Cypress.Commands.add('deleteTankRecordByThreeDot', (recordName, url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.gettankRecordName().each(($el, index) => {
    cy.log($el.text());
    const name = $el.text();

    if (name === recordName) {
      cy.get('[aria-label="Actions button"]').eq(index).click({
        force: true,
      });

      cy.findByRole('presentation', {
        hidden: false,
      })
        .findAllByText('Delete')
        .click({
          force: true,
        });

      cy.wait('@records').should('have.property', 'status', 200);
    }
  });
});

Cypress.Commands.add(
  'viewRecordWithZeroDataChannel',
  (recordName, headerText, url) => {
    cy.server();
    cy.route('POST', url).as('records');

    cy.tankRecordName().each(($el, index) => {
      const name = $el.text();
      if (name === recordName) {
        cy.tankRecordName().eq(index).click();
        return false;
      }
    });
    cy.wait('@records').should('have.property', 'status', 200);
    cy.findByText(headerText).should('exist');
    cy.go('back');
  }
);
