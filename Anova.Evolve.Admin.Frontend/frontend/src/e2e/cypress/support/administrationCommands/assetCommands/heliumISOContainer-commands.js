import '@testing-library/cypress/add-commands';
const routes = require('../../../fixtures/routes.json');

Cypress.Commands.add('domainMenu', () => {
  cy.get('[aria-label="user nav"]');
});

Cypress.Commands.add('assetTypeInput', () => {
  cy.get('[id="assetType-input"]');
});

Cypress.Commands.add('domainEditorTabs', () => {
  cy.get('[aria-label="Domain Editor tabs"]');
});

Cypress.Commands.add('generalTab', () => {
  cy.get('[role="tab"]').eq(0);
});

Cypress.Commands.add('assetsTab', () => {
  cy.get('[role="tab"]').eq(1);
});

Cypress.Commands.add('displayPriorityCells', () => {
  cy.get('[data-rbd-draggable-context-id="2"]');
});

Cypress.Commands.add('verticalAsseetTab', () => {
  cy.get('[aria-controls="vertical-asset-tabpanel-0"]');
});

Cypress.Commands.add('heliumISOContainerCheckbox', () => {
  cy.get('[id="domainHeliumIsoContainer.hasIsoContainer-input"]');
});

Cypress.Commands.add('defaultSite', () => {
  cy.get('[id="domainHeliumIsoContainer.isoContainerDefaultSiteId-input"]');
});

Cypress.Commands.add('defaultHeliumEvents', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumEventGroupId-input"]'
  );
});

Cypress.Commands.add('defaultHeliumProduct', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumProductId-input"]',
    { timeout: 5000 }
  );
});

Cypress.Commands.add('defaultHeliumLevelDCTemplate', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumLevelDCTemplateId-input"]'
  );
});

Cypress.Commands.add('defaultHeliumPressureDCTemplate', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumPressureDCTemplateId-input"]'
  );
});

Cypress.Commands.add('defaultHeliumPressureRoCDCTemplate', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumPressureRoCDCTemplateId-input"]'
  );
});

Cypress.Commands.add('defaultNitrogenEvents', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultNitrogenEventGroupId-input"]'
  );
});

Cypress.Commands.add('defaultNitrogenProduct', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultNitrogenProductId-input"]'
  );
});

Cypress.Commands.add('defaultNitrogenLevelDCTemplate', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultNitrogenLevelDCTemplateId-input"]'
  );
});

Cypress.Commands.add('defaultNitrogenPressureDCTemplate', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultNitrogenPressureDCTemplateId-input"]'
  );
});

Cypress.Commands.add('defaultSiteErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultSiteId-input-helper-text"]'
  );
});

Cypress.Commands.add('defaultHeliumEventErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumEventGroupId-input-helper-text"]',
    { timeout: 5000 }
  );
});

Cypress.Commands.add('defaultHeliumProdErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumProductId-input-helper-text"]'
  );
});

Cypress.Commands.add('defaultHeliumLevelDCErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumLevelDCTemplateId-input-helper-text"]'
  );
});

Cypress.Commands.add('defaultHeliumPressureDCErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumPressureDCTemplateId-input-helper-text"]'
  );
});

Cypress.Commands.add('defaultHeliumPressureROCErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultHeliumPressureRoCDCTemplateId-input-helper-text"]'
  );
});

Cypress.Commands.add('defaultNitrogenEventErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultNitrogenEventGroupId-input-helper-text"]'
  );
});

Cypress.Commands.add('defaultNitrogenProdErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultNitrogenProductId-input-helper-text"]'
  );
});

Cypress.Commands.add('defaultNitrogenLevelDCErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultNitrogenLevelDCTemplateId-input-helper-text"]'
  );
});

Cypress.Commands.add('defaultNitrogenPressureDCErrorText', () => {
  cy.get(
    '[id="domainHeliumIsoContainer.isoContainerDefaultNitrogenPressureDCTemplateId-input-helper-text"]'
  );
});

Cypress.Commands.add('heliumAssetDescription', () => {
  cy.get('[id="description-input"]');
});

Cypress.Commands.add('heliumDesignCurve', () => {
  cy.get('[id="designCurveId-input"]');
});

Cypress.Commands.add('heliumPressureRocCheckbox', () => {
  cy.get('[id="addHeliumPressureRateOfChange-input"]');
});

//Custom Properties
Cypress.Commands.add('customPropDirection', () => {
  cy.get('[id="mui-component-select-customProperties[0].value"]');
});

Cypress.Commands.add('customPropNumber', () => {
  cy.get('[name="customProperties[1].value"]');
});

Cypress.Commands.add('customPropValue', () => {
  cy.get('[name="customProperties[3].value"]');
});

Cypress.Commands.add('optValueCheckbox', () => {
  cy.get('[name="customProperties[2].value"]');
});

Cypress.Commands.add('heliumAssetIntegrationId', () => {
  cy.get('[id="assetIntegrationId-input"]');
});

Cypress.Commands.add('heliumLevelCheckbox', () => {
  cy.get('[id="heliumLevelIntegrationDetails.enableIntegration-input"]');
});

Cypress.Commands.add('heliumPressureCheckbox', () => {
  cy.get('[id="heliumPressureIntegrationDetails.enableIntegration-input"]');
});
Cypress.Commands.add('nitrogenLevelCheckbox', () => {
  cy.get('[id="nitrogenLevelIntegrationDetails.enableIntegration-input"]');
});

Cypress.Commands.add('nitrogenPressureCheckbox', () => {
  cy.get('[id="nitrogenPressureIntegrationDetails.enableIntegration-input"]');
});

Cypress.Commands.add('gpsIntegrationCheckbox', () => {
  cy.get('[id="gpsIntegrationDetails.enableIntegration-input"]');
});

Cypress.Commands.add('heliumLevelIntegrationId', () => {
  cy.get('[id="heliumLevelIntegrationDetails.integrationId-input"]');
});

Cypress.Commands.add('heliumPressureIntegrationId', () => {
  cy.get('[id="heliumPressureIntegrationDetails.integrationId-input"]');
});

Cypress.Commands.add('nitrogenLevelIntegrationId', () => {
  cy.get('[id="nitrogenLevelIntegrationDetails.integrationId-input"]');
});

Cypress.Commands.add('nitrogenPressureIntegrationId', () => {
  cy.get('[id="nitrogenPressureIntegrationDetails.integrationId-input"]');
});

Cypress.Commands.add('gpsIntegrationId', () => {
  cy.get('[id="gpsIntegrationDetails.integrationId-input"]');
});

Cypress.Commands.add('heliumLevelAutoIntegrationCheckbox', () => {
  cy.get('[id="heliumLevelIntegrationDetails.shouldAutoGenerate-input"]');
});

Cypress.Commands.add('heliumPressureAutoIntegrationCheckbox', () => {
  cy.get('[id="heliumPressureIntegrationDetails.shouldAutoGenerate-input"]');
});

Cypress.Commands.add('nitrogenLevelAutoIntegrationCheckbox', () => {
  cy.get('[id="nitrogenLevelIntegrationDetails.shouldAutoGenerate-input"]');
});

Cypress.Commands.add('nitrogenPressureAutoIntegrationCheckbox', () => {
  cy.get('[id="nitrogenPressureIntegrationDetails.shouldAutoGenerate-input"]');
});

Cypress.Commands.add('batteryAutoIntegrationCheckbox', () => {
  cy.get('[id="batteryIntegrationDetails.shouldAutoGenerate-input"]');
});

Cypress.Commands.add('autoGenerateGPSField', () => {
  cy.get('[aria-label="Auto-Generate Data Channel Integration ID"]').eq(5);
});

Cypress.Commands.add('filter', () => {
  cy.get('[id = "filterColumn-input"]');
});

Cypress.Commands.add('selectRTU', () => {
  cy.get('[data-value = "1"]');
});

Cypress.Commands.add('filterNameField', () => {
  cy.get('[id = "filterText-input"]');
});

Cypress.Commands.add('filterRTUColumn', () => {
  cy.get('[aria-label = "Device Id"]');
});

Cypress.Commands.add('filterFortheRTU', (rtu1) => {

  cy.server();
  // cy.route('POST', routes.retrieveAssetByOptionsUrl).as('deleteRTU');
  cy.route('POST', routes.deleteAssetById).as('deleteRTU');
  cy.route('POST', routes.retrieveAssetByOptionsUrl).as('filtering');

  cy.findAllByText('Asset Configuration Manager').click();
  cy.clearNavItemIfVisible();

  cy.filter().click();
  cy.selectRTU().click();
  cy.filterNameField().clear().type(rtu1);
  cy.findByText('Apply').click();

  cy.get('[aria-labelledby="groupBy-input"]').click({ force: true });
  cy.get('[data-value="2"]').should('have.text', 'None').click({ force: true });

  cy.wait('@filtering');
  cy.wait(2000);

  cy.get('body').then(body => {
    cy.wait(1000);
    if ((body.find('[aria-label = "Device Id"]').length) - 1 > 0) {
      cy.get('td[aria-label="Customer name"]').each(($el, index) => {
        const name = $el.text();
        if (name === 'Badar test site') {
          cy.get('[aria-label="Customer name"]').contains(name).next().should('have.text', rtu1).next().next().next().next().click();
          cy.wait(1000);
          cy.contains("Delete").focused().click()
          cy.get('[role="dialog"] li').then((boxMsg) => {
            const deletePopup = boxMsg.text();
            if (deletePopup.includes("Helium ISO container")) {
              console.log(deletePopup)
              cy.get('[type = "button"]').contains("Delete").click();
              cy.wait('@deleteRTU');
            }
          })
        }
      })
    }
  })
  cy.filterNameField().clear();
});

Cypress.Commands.add('verifyDomainMenuList', () => {
  cy.wait(1000);
  cy.findAllByText('Configuration').should('be.visible');
  cy.findAllByText('User').should('be.visible');
  cy.findAllByText('Data Channel Template').should('be.visible');
  cy.findAllByText('User Role').should('be.visible');
});

Cypress.Commands.add('selectFromMenuList', (domain, url) => {
  cy.server();
  cy.route('POST', url).as('domain');
  cy.wait(1000);
  cy.contains('a', domain).click({ force: true });
  cy.wait('@domain').should('have.property', 'status', 200);
});

Cypress.Commands.add('verifyTabs', () => {
  cy.generalTab().should('be.visible');
  cy.assetsTab().should('be.visible');
});

Cypress.Commands.add('verifyDomainAssetsErrorTexts', () => {
  cy.defaultSiteErrorText().should('have.text', 'Default site is required.');
  cy.defaultHeliumEventErrorText().should(
    'have.text',
    'Default Helium Event group is required.'
  );
  cy.defaultHeliumProdErrorText().should(
    'have.text',
    'Default Helium Product is required.'
  );
  cy.defaultHeliumLevelDCErrorText().should(
    'have.text',
    'Default Helium Level Data Channel Template is required.'
  );
  cy.defaultHeliumPressureDCErrorText().should(
    'have.text',
    'Default Helium Pressure Data Channel Template is required.'
  );
  cy.defaultHeliumPressureROCErrorText().should(
    'have.text',
    'Default Helium Pressure Rate of Change Data Channel Template is required.'
  );

  cy.defaultNitrogenEventErrorText().should(
    'have.text',
    'Default Nitrogen Event group is required.'
  );
  cy.defaultNitrogenProdErrorText().should(
    'have.text',
    'Default Nitrogen Product is required.'
  );
  cy.defaultNitrogenLevelDCErrorText().should(
    'have.text',
    'Default Nitrogen Level Data Channel Template is required.'
  );
  cy.defaultNitrogenPressureDCErrorText().should(
    'have.text',
    'Default Nitrogen Pressure Data Channel Template is required.'
  );
});

Cypress.Commands.add('optValueAssetCheckbox', () => {
  cy.get('[name="asset.customProperties[2].value"]');
});

Cypress.Commands.add(
  'enterDomainAssetTabDetails',
  (
    site,
    heliumRuleGroup,
    heliumProd,
    heliumLevel,
    heliumPressure,
    heliumROC,
    nitrogenRuleGroup,
    nitrogenProd,
    nitrogenLevel,
    nitrogenPressure
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('optionSite');
    cy.route('POST', routes.retrieveProductNameInfoByPrefix).as('retrieveProd');
    cy.defaultSite()
      .should('have.attr', 'placeholder', 'Enter Search Criteria...')
      .clear({ force: true })
      .type(site);
    cy.wait('@optionSite').should('have.property', 'status', 200);
    cy.wait(1000);
    cy.defaultSite().type('{downarrow}{enter}');
    cy.findAllByLabelText('Default Site')
      .get('[aria-label="Clear"]')
      .should('exist');

    cy.defaultHeliumEvents().click();
    cy.levelDropdown(heliumRuleGroup);

    cy.defaultHeliumProduct()
      .should('have.attr', 'placeholder', 'Enter Search Criteria...')
      .clear({ force: true })
      .type(heliumProd);
    cy.wait('@retrieveProd').should('have.property', 'status', 200);
    cy.wait(1000);
    cy.defaultHeliumProduct().type('{downarrow}{enter}');
    cy.findAllByLabelText('Default Site')
      .get('[aria-label="Clear"]')
      .should('exist');

    cy.defaultHeliumLevelDCTemplate().click();
    cy.levelDropdown(heliumLevel);

    cy.defaultHeliumPressureDCTemplate().click();
    cy.levelDropdown(heliumPressure);

    cy.defaultHeliumPressureRoCDCTemplate().click();
    cy.levelDropdown(heliumROC);

    cy.defaultNitrogenEvents().click();
    cy.levelDropdown(nitrogenRuleGroup);

    cy.defaultNitrogenProduct()
      .should('have.attr', 'placeholder', 'Enter Search Criteria...')
      .clear({ force: true })
      .type(nitrogenProd);
    cy.wait('@retrieveProd').should('have.property', 'status', 200);
    cy.wait(1000);
    cy.defaultNitrogenProduct().type('{downarrow}{enter}');
    cy.findAllByLabelText('Default Site')
      .get('[aria-label="Clear"]')
      .should('exist');

    cy.defaultNitrogenLevelDCTemplate().click({ force: true });
    cy.levelDropdown(nitrogenLevel);

    cy.defaultNitrogenPressureDCTemplate().click();
    cy.levelDropdown(nitrogenPressure);
  }
);

Cypress.Commands.add('resetDomainAssetTabDetails', (select) => {
  cy.get('[aria-label="Clear"]').eq(0).should('exist').click({ force: true });

  cy.defaultHeliumEvents().click();
  cy.levelDropdown(select);

  cy.get('[aria-label="Clear"]').eq(1).should('exist').click({ force: true });

  cy.defaultHeliumLevelDCTemplate().click({ force: true });
  cy.levelDropdown(select);

  cy.defaultHeliumPressureDCTemplate().click();
  cy.levelDropdown(select);

  cy.defaultHeliumPressureRoCDCTemplate().click();
  cy.levelDropdown(select);

  cy.defaultNitrogenEvents().click();
  cy.levelDropdown(select);

  cy.get('[aria-label="Clear"]').eq(2).should('exist').click({ force: true });

  cy.defaultNitrogenLevelDCTemplate().click();
  cy.levelDropdown(select);

  cy.defaultNitrogenPressureDCTemplate().click();
  cy.levelDropdown(select);
});

Cypress.Commands.add('selectItemFromGrid', (locator, text) => {
  cy.server();
  cy.route('POST', routes.retrieveDomainEditComponentById).as('retrieveDomain');
  cy.get(locator).each(($el, index) => {
    const msg = $el.text();

    if (msg === text) {
      cy.get(locator).eq(index).click();
      return false;
    } else {
      cy.log('Domain name does not exist');
      expect(true).to.be.false;
    }
  });

  cy.wait('@retrieveDomain').should('have.property', 'status', 200);
});

Cypress.Commands.add(
  'enterHeliumISOContainerAssetDetails',
  (
    desc,
    curve,
    site,
    rtu,
    number,
    direction,
    assetId,
    domain,
    heliumLevel,
    heliumPressure,
    nitrogenLevel,
    nitrogenPressure,
    notes
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('optionSite');
    cy.route('POST', routes.retrieveHISORtuByPrefix).as('rtu');

    cy.heliumAssetDescription().should('be.visible').type(desc);

    cy.heliumDesignCurve().should('be.visible').click();
    cy.levelDropdown(curve);

    cy.quickTankSite().type(site);
    cy.wait(3000);
    cy.quickTankSite().type('{downarrow}{enter}', { force: true });

    cy.tankRTU()
      .should('have.attr', 'placeholder', 'Enter Search Criteria...')
      .type(rtu);
    cy.wait(3000)
    cy.tankRTU().type('{downarrow}{enter}', { force: true });

    cy.heliumPressureRocCheckbox().check({ force: true }).should('be.checked');

    cy.customPropNumber().type('1.2');
    cy.get('[name="customProperties[3].value"]').type('1.2');
    cy.customPropValue().click({ force: true });
    cy.get('[name="customProperties[3].value"]').check({ force: true }).should('be.checked');

    cy.get('[id="mui-component-select-customProperties[2].value"]').should('have.text', 'Select').click();
    cy.levelDropdown(direction);

    cy.heliumAssetIntegrationId().should('be.visible').type(assetId);

    cy.selectintegrationDomainId().click({ force: true });
    cy.levelDropdown(domain);

    cy.heliumLevelCheckbox()
      .should('not.be.checked')
      .check({ force: true })
      .should('be.checked');

    cy.heliumPressureCheckbox()
      .should('not.be.checked')
      .check({ force: true })
      .should('be.checked');

    cy.nitrogenLevelCheckbox()
      .should('not.be.checked')
      .check({ force: true })
      .should('be.checked');

    cy.nitrogenPressureCheckbox()
      .should('not.be.checked')
      .check({ force: true })
      .should('be.checked');

    cy.heliumLevelIntegrationId().should('be.visible').type(heliumLevel);

    cy.heliumPressureIntegrationId().should('be.visible').type(heliumPressure);

    cy.nitrogenLevelIntegrationId().should('be.visible').type(nitrogenLevel);

    cy.nitrogenPressureIntegrationId()
      .should('be.visible')
      .type(nitrogenPressure);

    cy.notes().should('be.visible').type(notes, { force: true });
  }
);

Cypress.Commands.add(
  'enterHeliumISOContainerAssetWithoutCustomPropDetails',
  (
    desc,
    curve,
    site,
    rtu,
    assetId,
    domain,
    heliumLevel,
    heliumPressure,
    nitrogenLevel,
    nitrogenPressure,
    battery,
    gps,
    notes
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('optionSite');
    cy.route('POST', routes.retrieveHISORtuByPrefix).as('rtu');

    cy.heliumAssetDescription().should('be.visible').type(desc);

    cy.heliumDesignCurve().should('be.visible').click();
    cy.levelDropdown(curve);

    cy.quickTankSite().type(site);
    cy.wait(3000);
    cy.quickTankSite().type('{downarrow}{enter}', { force: true });
    cy.mapView().should('be.visible');

    cy.tankRTU()
      .should('have.attr', 'placeholder', 'Enter Search Criteria...')
      .type(rtu);
    cy.wait(2000)
    cy.tankRTU().type('{downarrow}{enter}', { force: true });

    cy.heliumAssetIntegrationId().should('be.visible').type(assetId);

    cy.selectintegrationDomainId().click();
    cy.levelDropdown(domain);

    cy.heliumLevelAutoIntegrationCheckbox().uncheck().should('not.be.checked');
    cy.heliumPressureAutoIntegrationCheckbox()
      .uncheck()
      .should('not.be.checked');
    cy.nitrogenLevelAutoIntegrationCheckbox()
      .uncheck()
      .should('not.be.checked');
    cy.nitrogenPressureAutoIntegrationCheckbox()
      .uncheck()
      .should('not.be.checked');
    cy.batteryAutoIntegrationCheckbox().uncheck().should('not.be.checked');
    cy.autoGenerateGPSField().find('[type="checkbox"]').should('not.exist');

    cy.heliumLevelCheckbox()
      .should('not.be.checked')
      .check()
      .should('be.checked');

    cy.heliumPressureCheckbox()
      .should('not.be.checked')
      .check()
      .should('be.checked');

    cy.nitrogenLevelCheckbox()
      .should('not.be.checked')
      .check()
      .should('be.checked');

    cy.nitrogenPressureCheckbox()
      .should('not.be.checked')
      .check()
      .should('be.checked');

    cy.batteryEnableIntegrationCheckbox()
      .should('not.be.checked')
      .check()
      .should('be.checked');

    cy.gpsIntegrationCheckbox()
      .should('not.be.checked')
      .check()
      .should('be.checked');

    cy.heliumLevelIntegrationId()
      .should('be.visible')
      .clear()
      .type(heliumLevel);

    cy.heliumPressureIntegrationId()
      .should('be.visible')
      .clear()
      .type(heliumPressure);

    cy.nitrogenLevelIntegrationId()
      .should('be.visible')
      .clear()
      .type(nitrogenLevel);

    cy.nitrogenPressureIntegrationId()
      .should('be.visible')
      .clear()
      .type(nitrogenPressure);

    cy.batteryDataChannelIntegrationID()
      .should('be.visible')
      .clear()
      .type(battery);

    cy.gpsIntegrationId().should('be.visible').clear().type(gps);

    cy.notes().should('be.visible').type(notes, { force: true });
  }
);

Cypress.Commands.add(
  'enterHeliumISOContainerAssetDetailsOnly',
  (desc, curve, site, newSite, rtu, notes) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('optionSite');

    cy.route('POST', routes.retrieveHISORtuByPrefix).as('rtu');

    cy.heliumAssetDescription().should('be.visible').type(desc);

    cy.heliumDesignCurve().should('be.visible').click();
    cy.levelDropdown(curve);

    cy.quickTankSite().should('have.value', site).clear().type(newSite);
    cy.wait('@optionSite').should('have.property', 'status', 200);
    cy.wait(3000);
    cy.quickTankSite().type('{downarrow}{enter}', { force: true });
    cy.mapView().should('be.visible');

    cy.tankRTU()
      .should('have.attr', 'placeholder', 'Enter Search Criteria...')
      .type(rtu);
    cy.wait(2000)
    cy.tankRTU().type('{downarrow}{enter}', { force: true });

    cy.heliumPressureRocCheckbox().check().should('be.checked');
    cy.notes().should('be.visible').type(notes, { force: true });
  }
);

Cypress.Commands.add(
  'verifyHeliumAssetContainerCreateTexts',
  (
    header,
    desc,
    curve,
    site,
    rtu,
    direction,
    number,
    optValue,
    notes,
    heliumLevel,
    heliumPressure,
    nitroLevel,
    nitroPressure
  ) => {
    cy.findAllByText(header).should('be.visible');
    cy.contains(desc).should('be.visible');
    cy.contains(curve).should('be.visible');

    cy.contains(rtu).should('be.visible');
    cy.contains(direction).should('be.visible');
    cy.contains(number).should('be.visible');
    cy.contains(optValue).should('be.visible');
    cy.contains(notes).should('be.visible');

    cy.verifyIntegrationIdsOnHIS0C(
      heliumLevel,
      heliumPressure,
      nitroLevel,
      nitroPressure
    );
  }
);

Cypress.Commands.add(
  'verifyIntegrationIdsOnHIS0C',
  (heliumLevel, heliumPressure, nitroLevel, nitroPressure) => {
    cy.contains(heliumLevel).should('exist');
    cy.contains(heliumPressure).should('exist');
    cy.contains(nitroLevel).should('exist');
    cy.contains(nitroPressure).should('exist');
  }
);

Cypress.Commands.add(
  'addAssetDetailsAllFields',
  (description, type, ruleGroup, tech, integrationId, site, geoArea, notes) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('siteOptions');
    cy.addAssetDetails(
      description,
      type,
      ruleGroup,
      tech,
      integrationId,
      notes
    );
    cy.quickTankSite().type(site);
    cy.wait('@siteOptions').should('have.property', 'status', 200);
    cy.wait(1000);
    cy.quickTankSite().type('{downarrow}{enter}');

    cy.assetMobileCheckbox().should('be.visible').click({ force: true });

    cy.assetGeoAreaGroup().should('be.visible').click();
    cy.levelDropdown(geoArea);
  }
);

Cypress.Commands.add(
  'verifyHeliumISOContainerDetails',
  (
    header,
    type,
    description,
    curve,
    assetIntID,
    site,
    notes,
    direction,
    opt,
    number
  ) => {
    cy.findAllByText(header).should('be.visible');
    cy.fetchDropdownFieldText(
      '[id="mui-component-select-asset.assetType"]',
      type
    );
    cy.fetchInputFieldText('[name="asset.description"]', description);
    cy.fetchDropdownFieldText(
      '[id="mui-component-select-asset.designCurveType"]',
      curve
    );
    cy.fetchInputFieldText('[name="asset.integrationName"]', assetIntID);
    cy.fetchInputFieldText('[id="siteId-input"]', site);
    cy.fetchInputFieldText('[name="asset.notes"]', notes);

    cy.fetchDropdownFieldText(
      '[id="mui-component-select-asset.customProperties[0].value"]',
      direction
    );
    cy.optValueAssetCheckbox().should('have.attr', 'value', opt);
    cy.fetchInputFieldText('[name="asset.customProperties[1].value"]', number);
  }
);

Cypress.Commands.add(
  'verifyDataChannelsOnEditAssetScreen',
  (
    heliumLevel,
    heliumPressure,
    nitroLevel,
    nitroPressure,
    heliumROC,
    gps,
    battery
  ) => {
    cy.dataChannelTable().findAllByText(heliumLevel);
    cy.dataChannelTable().findAllByText(heliumPressure);
    cy.dataChannelTable().findAllByText(nitroLevel);
    cy.dataChannelTable().findAllByText(nitroPressure);
    cy.dataChannelTable().findAllByText(heliumROC);
    cy.dataChannelTable().findAllByText(gps);
    cy.dataChannelTable().findAllByText(battery);
  }
);

Cypress.Commands.add('verifyRTUColumn', (locator, recordName) => {
  cy.get(locator).each(($el) => {
    const name = $el.text();

    if (name == recordName) {
      expect($el.text()).to.be.equal(recordName);
    } else {
      cy.log('RTU is not same' + name);
    }
  });
});

Cypress.Commands.add('verifyHeliumISOContainerEmptyFields', (site) => {
  cy.heliumAssetDescription().should('have.text', '');
  cy.heliumDesignCurve().should('have.text', 'Select');
  cy.quickTankSite().should('have.value', site);
  cy.tankRTU().should('have.text', '');
  cy.heliumPressureRocCheckbox().should('not.be.checked');
  cy.customPropNumber().should('have.text', '');
  cy.customPropValue().should('have.text', '');

  cy.optValueCheckbox().should('not.be.checked');
  cy.customPropDirection().should('have.text', 'Select');
  cy.heliumAssetIntegrationId().should('have.text', '');
  cy.selectintegrationDomainId().should('have.text', 'Select');

  cy.heliumLevelCheckbox().should('not.be.checked');
  cy.heliumPressureCheckbox().should('not.be.checked');
  cy.nitrogenLevelCheckbox().should('not.be.checked');
  cy.nitrogenPressureCheckbox().should('not.be.checked');
  cy.notes().should('have.text', '');
});

Cypress.Commands.add(
  'verifyHeliumAssetContainerCreateWithoutCustomPropTexts',
  (
    header,
    desc,
    curve,
    site,
    rtu,
    optValue,
    notes,
    heliumLevel,
    heliumPressure,
    nitroLevel,
    nitroPressure,
    gps,
    battery
  ) => {
    cy.findAllByText(header).should('be.visible');
    cy.contains(desc).should('be.visible');
    cy.contains(curve).should('be.visible');

    cy.get('div[class*="MuiGrid-item"] div:nth-child(4) p:nth-child(2)')
      .first()
      .then((site1) => {
        let siteName = site1.text().toString().toLowerCase();
        expect(siteName).to.include(site.toString().toLowerCase());
      });

    cy.contains(rtu).should('be.visible');
    cy.contains(optValue).should('be.visible');
    cy.contains(notes).should('be.visible');

    cy.verifyAllIntegrationIdsOnHIS0C(
      heliumLevel,
      heliumPressure,
      nitroLevel,
      nitroPressure,
      gps,
      battery
    );
  }
);

Cypress.Commands.add(
  'verifyAllIntegrationIdsOnHIS0C',
  (heliumLevel, heliumPressure, nitroLevel, nitroPressure, gps, battery) => {
    cy.verifyIntegrationIdsOnHIS0C(
      heliumLevel,
      heliumPressure,
      nitroLevel,
      nitroPressure
    );
    cy.contains(gps);
    cy.contains(battery);
  }
);

Cypress.Commands.add(
  'verifyQuickAssetReport',
  (
    type,
    assetName,
    header,
    desc,
    curve,
    site,
    rtu,
    direction,
    number,
    optValue,
    notes,
    heliumLevel,
    heliumPressure,
    nitroLevel,
    nitroPressure
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveHISOReportDetails).as('reportDetails');
    cy.route('POST', routes.retrieveQuickAssetCreateReportUrl).as('quickReportWait');

    cy.applicationLaunchPanel().click();
    cy.findAllByText('Reports').click({ force: true });
    cy.findAllByText('Quick Asset Create').should('exist').click({
      force: true,
    });
    cy.wait('@quickReportWait').should('have.property', 'status', 200);

    cy.findAllByText('Quick Asset Create Report', { timeout: 5000 }).should(
      'be.visible'
    );

    cy.assetTypeInput().click();
    cy.levelDropdown(type);
    cy.searchField().type(assetName);
    cy.applyButton().click({ force: true });
    cy.wait('@quickReportWait').should('have.property', 'status', 200);

    cy.get('[aria-label="Asset title"] a').each(($el, index) => {
      const assetTitle = $el.text();
      if (assetTitle.includes(assetName)) {
        cy.get('[aria-label="Asset title"] a').eq(index).click({
          force: true,
        });
      }
    });
    cy.wait('@reportDetails').should('have.property', 'status', 200);

    cy.verifyHeliumAssetContainerCreateTexts(
      header,
      desc,
      curve,
      site,
      rtu,
      direction,
      number,
      optValue,
      notes,
      heliumLevel,
      heliumPressure,
      nitroLevel,
      nitroPressure
    );
  }
);

Cypress.Commands.add(
  'verifyQuickAssetReport2',
  (
    type,
    assetName,
    header,
    desc,
    curve,
    site,
    rtu,
    optValue,
    notes,
    heliumLevel,
    heliumPressure,
    nitroLevel,
    nitroPressure,
    gps,
    battery
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveHISOReportDetails).as('reportDetails');
    cy.applicationLaunchPanel().click();
    cy.findAllByText('Reports').click({
      force: true,
    });
    cy.clickAddButton(
      'Quick Asset Create',
      '/RetrieveQuickAssetCreateReportByOptions'
    );
    cy.findAllByText('Quick Asset Create Report').should('be.visible');

    cy.assetTypeInput().click();
    cy.levelDropdown(type);
    cy.searchField().type(assetName);
    cy.applyButton().click({ force: true });
    cy.wait('@addSite').should('have.property', 'status', 200);

    cy.get('[aria-label="Asset title"] a').each(($el, index) => {
      const assetTitle = $el.text();
      if (assetTitle.includes(assetName)) {
        cy.get('[aria-label="Asset title"] a').eq(index).click({
          force: true,
        });
      }
    });
    cy.wait('@reportDetails').should('have.property', 'status', 200);

    cy.verifyHeliumAssetContainerCreateWithoutCustomPropTexts(
      header,
      desc,
      curve,
      site,
      rtu,
      optValue,
      notes,
      heliumLevel,
      heliumPressure,
      nitroLevel,
      nitroPressure,
      gps,
      battery
    );
  }
);

Cypress.Commands.add(
  'verifyDisplayPriorityCells',
  (locator, cell1, cell2, cell3, cell4, cell5, cell6, cell7) => {
    cy.get(locator).eq(0).should('have.text', cell1);
    cy.get(locator).eq(1).should('have.text', cell2);
    cy.get(locator).eq(2).should('have.text', cell3);
    cy.get(locator).eq(3).should('have.text', cell4);
    cy.get(locator).eq(4).should('have.text', cell5);
    cy.get(locator).eq(5).should('have.text', cell6);
    cy.get(locator).eq(6).should('have.text', cell7);
  }
);

Cypress.Commands.add(
  'changeEventRules',
  (heliumRuleGroup, nitrogenRuleGroup) => {
    cy.defaultHeliumEvents().click();
    cy.levelDropdown(heliumRuleGroup);
    cy.defaultNitrogenEvents().click();
    cy.levelDropdown(nitrogenRuleGroup);
  }
);

Cypress.Commands.add('clickOnAssetDescription', (asset) => {
  cy.server();
  cy.route('POST', routes.retrieveAssetByOptionsUrl).as('assetRecords');
  cy.route('POST', routes.retrieveAssetEditByIdUrl).as('edit');

  cy.get('[id="filterText-input"]').type(asset);
  cy.applyButton().click();
  cy.wait('@assetRecords').should('have.property', 'status', 200);

  cy.get('tbody [aria-label="Asset description"] a').first().click({ force: true });
  cy.wait('@edit').should('have.property', 'status', 200);
});
Cypress.Commands.add('deleteQTRecord', (recordName) => {
  cy.get('[aria-label="Asset description"]').each(($el, index) => {
    const name = $el.text();

    if (name === recordName) {
      cy.get('input[type="checkbox"]').eq(index).click({
        force: true,
      });
    }
  });
});

Cypress.Commands.add('fetchDropdownFieldText', (locator, text) => {
  cy.get(locator).should((dropdown) => {
    const val = dropdown.text();
    expect(val).to.be.equal(text);
  });
});
Cypress.Commands.add('deleteQTRecordByThreeDot', (recordName, url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.get('[aria-label="Asset description"]').each(($el, index) => {
    cy.log($el.text());
    const name = $el.text();

    if (name === recordName) {
      cy.wait(1000);
      cy.threeDotButton()
        .eq(index - 1)
        .trigger('mouseover')
        .click({
          force: true,
        });

      cy.findByRole('presentation', {
        hidden: false,
      })
        .findAllByText('Delete')
        .click({
          force: true,
        });
      return false;
    }
  });

  cy.get('p').contains('The following assets will be deleted:').should('exist');
  cy.findAllByText('Yes').click({
    force: true,
  });

  cy.wait('@records').should('have.property', 'status', 200);
});
Cypress.Commands.add('navigateToAssetManager', () => {
  cy.server();
  cy.route('POST', routes.retrieveAssetByOptionsUrl).as('records');

  cy.get('[id="app-picker-button"]').click();
  cy.get('[aria-labelledby="app-picker-button"]')
    .findAllByText('Administration')
    .click({ force: true });

  cy.wait('@records').should('have.property', 'status', 200);
});
Cypress.Commands.add('selectTab', (tab) => {
  cy.assetTabs().findByText(tab).should('be.visible').click();
});
Cypress.Commands.add('verifyBulkActionsDropdownFields', () => {
  cy.get('[data-value="copy"]').should('exist');
  cy.get('[data-value="transfer"]').should('exist');
  cy.get('[data-value="delete"]').should('exist');
});
Cypress.Commands.add('dataChannelTable', () => {
  cy.get('[aria-label="data channels table"]');
});
Cypress.Commands.add('quickTankSite', () => {
  cy.get('[id="siteId-input"]');
});
Cypress.Commands.add('mapView', () => {
  cy.get('[class="overlays"]');
});
Cypress.Commands.add('tankRTU', () => {
  cy.get('[id="rtuId-input"]');
});
Cypress.Commands.add(
  'verifyAssetDetails',
  (header, type, description, eventGroup, tech, assetIntID, site, notes) => {
    cy.findAllByText(header).should('be.visible');

    cy.fetchDropdownFieldText(
      '[id="mui-component-select-asset.assetType"]',
      type
    );
    cy.fetchInputFieldText('[name="asset.description"]', description);
    cy.fetchDropdownFieldText(
      '[id="mui-component-select-asset.eventRuleGroupId"]',
      eventGroup
    );
    cy.fetchInputFieldText('[name="asset.installedTechName"]', tech);
    cy.fetchInputFieldText('[name="asset.integrationName"]', assetIntID);
    cy.fetchInputFieldText('[id="siteId-input"]', site);

    cy.fetchInputFieldText('[name="asset.notes"]', notes);
  }
);
Cypress.Commands.add('fetchInputFieldText', (locator, text) => {
  cy.get(locator).should(($input) => {
    const val = $input.val().toString().toLowerCase();
    expect(val).to.include(text.toString().toLowerCase());
  });
});
Cypress.Commands.add('assetTabs', () => {
  cy.get('[aria-label="asset tabs"]');
});
Cypress.Commands.add('threeDotButton', () => {
  cy.get('[aria-controls="asset options"]');
});
Cypress.Commands.add('selectintegrationDomainId', () => {
  cy.get('[id="integrationDomainId-input"]');
});
Cypress.Commands.add('batteryEnableIntegrationCheckbox', () => {
  cy.get('[id="batteryIntegrationDetails.enableIntegration-input"]');
});

Cypress.Commands.add('batteryDataChannelIntegrationID', () => {
  cy.get('[id="batteryIntegrationDetails.integrationId-input"]');
});
Cypress.Commands.add('verifyQTDeletedItem', (recordName, message) => {
  cy.get('input[type="text"]')
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
        cy.get('[aria-label="Asset description"]').each(($el) => {
          expect($el.text()).to.not.equal(recordName);
        });
      } else {
        cy.findAllByText(message).should('exist');
      }
    });

  cy.get('input[type="text"]').clear();
  cy.applyButton().click();
  cy.wait(1000);
});