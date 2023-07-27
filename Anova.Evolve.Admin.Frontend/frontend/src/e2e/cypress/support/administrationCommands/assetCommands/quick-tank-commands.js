import '@testing-library/cypress/add-commands';
const routes = require('../../../fixtures/routes.json');

Cypress.Commands.add('quickTankDesc', () => {
  cy.get('[id="description-input"]', { timeout: 5000 });
});

Cypress.Commands.add('quickTankTechnician', () => {
  cy.get('[id="technician-input"]', { timeout: 5000 });
});

Cypress.Commands.add('quickTankSite', () => {
  cy.get('[id="siteId-input"]');
});

Cypress.Commands.add('tankSiteLabel', () => {
  cy.get('[id="siteId-input-label"]');
});

Cypress.Commands.add('setTankDimensionCheckbox', () => {
  cy.get('[id="isTankDimensionsSet-input"]');
});

Cypress.Commands.add('tankDimension', () => {
  cy.get('[id="tankDimensionId-input"]');
});

Cypress.Commands.add('quickTankType', () => {
  cy.get('[id="tankType-input"]');
});

Cypress.Commands.add('quickTankProduct', () => {
  cy.get('[id="productId-input"]');
});

Cypress.Commands.add('quickTankProductLabel', () => {
  cy.get('[id="productId-input-label"]');
});

// Tank Monitoring

Cypress.Commands.add('tankDataSource', () => {
  cy.get('[id="mui-component-select-dataSource"]', { timeout: 5000 });
});

Cypress.Commands.add('tankRTU', () => {
  cy.get('[id="rtuId-input"]', { timeout: 5000 });
});

Cypress.Commands.add('tankLevelSensor', () => {
  cy.get('[id="levelDataChannelTemplateId-input"]');
});

Cypress.Commands.add('tankLevelChannel', () => {
  cy.get('[id="levelRtuChannelId-input"]');
});

Cypress.Commands.add('tankLevelChannelErrorText', () => {
  cy.get('[id="levelRtuChannelId-input-helper-text"]');
});

Cypress.Commands.add('tankLevelPressure', () => {
  cy.get('[id="pressureDataChannelTemplateId-input"]');
});

Cypress.Commands.add('tankPressureChannel', () => {
  cy.get('[id="pressureRtuChannelId-input"]');
});

Cypress.Commands.add('tankPressureChannelErrorText', () => {
  cy.get('[id="pressureRtuChannelId-input-helper-text"]');
});

Cypress.Commands.add('addBatteryChannelCheckbox', () => {
  cy.get('[id="addBatteryChannel-input"]');
});

Cypress.Commands.add('publishedComments', () => {
  cy.get('[id="sourceDataChannelId-input"]');
});

Cypress.Commands.add('levelMaxProductHeight', () => {
  cy.get('[id="levelMonitoringMaxProductHeight-input"]', { timeout: 5000 });
});

Cypress.Commands.add('levelDisplayUnits', () => {
  cy.get('[id="displayUnits-input"]');
});

Cypress.Commands.add('levelMaxProductHeight2', () => {
  cy.get('[id="levelVolumeMaxProductHeight-input"]');
});

//Event Rules

Cypress.Commands.add('eventRuleGroup', () => {
  cy.get('[id="eventRuleGroupId-input"]');
});

Cypress.Commands.add('reorderEventRule', () => {
  cy.get('[id="reorderEventValue-input"]');
});

Cypress.Commands.add('criticalEventRule', () => {
  cy.get('[id="criticalEventValue-input"]');
});

//Integration Parameters

Cypress.Commands.add('assetIntegrationID', () => {
  cy.get('[id="integrationId-input"]');
});

Cypress.Commands.add('selectDomain', () => {
  cy.get('[id="integrationDomainId-input"]');
});

Cypress.Commands.add('levelEnableIntegrationCheckbox', () => {
  cy.get('[id="levelIntegrationDetails.enableIntegration-input"]');
});

Cypress.Commands.add('levelDataChannelIntegrationID', () => {
  cy.get('[id="levelIntegrationDetails.integrationId-input"]');
});

Cypress.Commands.add('pressureEnableIntegrationCheckbox', () => {
  cy.get('[id="pressureIntegrationDetails.enableIntegration-input"]');
});

Cypress.Commands.add('pressureDataChannelIntegrationID', () => {
  cy.get('[id="pressureIntegrationDetails.integrationId-input"]');
});

Cypress.Commands.add('batteryEnableIntegrationCheckbox', () => {
  cy.get('[id="batteryIntegrationDetails.enableIntegration-input"]');
});

Cypress.Commands.add('batteryDataChannelIntegrationID', () => {
  cy.get('[id="batteryIntegrationDetails.integrationId-input"]');
});

Cypress.Commands.add('quickTankNotes', () => {
  cy.get('[name="notes"]');
});

Cypress.Commands.add('dropdownArrow', () => {
  cy.get('[aria-label="Open"]');
});

//map
Cypress.Commands.add('mapView', () => {
  cy.get('[class="overlays"]');
});

Cypress.Commands.add('clickAddTankButton', () => {
  cy.server();
  cy.route('POST', routes.retrieveQuickAssetCreateBulkTank).as('addTank');

  cy.findAllByText('Quick Add', { timeout: 5000 })
    .should('be.visible')
    .click({ force: true });
  cy.findAllByText('Tank').should('be.visible').click({ force: true });

  cy.wait('@addTank').should('have.property', 'status', 200);
});

Cypress.Commands.add(
  'enterTankMonitoringDetails',
  (RTU, levelSensor, levelChannel, pressureSensor, pressureChannel) => {
    cy.tankDataSource().should('be.visible').and('have.text', 'RTU').click();
    cy.verifyDataSourceDropdownFields();
    cy.levelDropdown('Published Data Channel');
    cy.levelDropdown('RTU');
    cy.tankRTU()
      .should('be.visible')
      .and('have.attr', 'placeholder', 'Enter Search Criteria...')
      .type(RTU);

    cy.wait(2000);
    cy.tankRTU().type('{downarrow}{enter}', { timeout: 6000 });
    cy.tankLevelSensor()
      .should('be.visible')
      .type(levelSensor + '{downarrow}{enter}', {
        force: true,
      });
    cy.tankLevelSensor().type('{downarrow}{enter}');
    cy.wait(1000);
    //Select level channel
    cy.tankLevelChannel().should('be.visible').click();
    cy.clickOnLevelDropdownList(levelChannel);
    cy.tankLevelPressure()
      .should('be.visible')
      .type(pressureSensor + '{downarrow}{enter}', {
        force: true,
      });
    cy.tankLevelPressure().type('{downarrow}{enter}', { force: true });
    //Select pressure channel
    cy.tankPressureChannel().click();
    cy.clickOnPressureDropdownList(levelChannel);
    cy.levelMaxProductHeight().should('be.visible').click();
    cy.tankPressureChannelErrorText().should(
      'have.text',
      'RTU Channel already in use by another Data Channel that is in this Asset.'
    );
    cy.tankLevelChannelErrorText().should(
      'have.text',
      'RTU Channel already in use by another Data Channel that is in this Asset.'
    );
    cy.tankPressureChannel().click();
    cy.clickOnPressureDropdownList(pressureChannel);

    cy.tankPressureChannelErrorText().should('not.exist');

    cy.addBatteryChannelCheckbox().click();
  }
);

Cypress.Commands.add('enterSiteDetails', (site) => {
  cy.server();
  cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('siteRecord');

  cy.mapView().should('not.exist');
  cy.quickTankSite().type(site, {force: true});
  cy.wait('@siteRecord').should('have.property', 'status', 200);
  cy.wait(2000);
  cy.quickTankSite().type('{downarrow}{enter}', { timeout: 5000 });
  //cy.wait('@record').should('have.property', 'status', 200);
  cy.mapView().should('be.visible');
});

Cypress.Commands.add(
  'enterLevelMonitoringAndVolumeDetails',
  (maxProductHeight, displayUnits, maxProductHeight2) => {
    cy.levelMaxProductHeight()
      .should('be.visible')
      .and('have.attr', 'type', 'number')
      .type(maxProductHeight, {force: true});

    cy.levelDisplayUnits()
      .should('be.visible')
      .and('have.text', 'None')
      .click();
    cy.levelDropdown(displayUnits);

    cy.levelMaxProductHeight2()
      .should('be.visible')
      .and('have.attr', 'type', 'number')
      .type(maxProductHeight2);
  }
);

Cypress.Commands.add('enterEventRulesDetails', (ruleGroup) => {
  cy.eventRuleGroup().should('be.visible').and('have.text', 'Select').click();
  cy.levelDropdown(ruleGroup);
  cy.wait(1000);
  cy.reorderEventRule().should('be.visible');
  cy.criticalEventRule().should('be.visible');
});

Cypress.Commands.add(
  'enterIntegrationParameters',
  (
    integrationID,
    domain,
    levelIntegrationID,
    pressureIntegrationID,
    batteryIntegrationID
  ) => {
    cy.assetIntegrationID()
      .should('be.visible')
      .and('have.attr', 'type', 'text')
      .type(integrationID);

    cy.selectDomain().should('be.visible').click();
    cy.levelDropdown(domain);

    cy.levelEnableIntegrationCheckbox().should('be.visible').click();
    cy.levelDataChannelIntegrationID()
      .should('be.visible')
      .type(levelIntegrationID);

    cy.pressureEnableIntegrationCheckbox().should('be.visible').click();
    cy.pressureDataChannelIntegrationID()
      .should('be.visible')
      .type(pressureIntegrationID);

    cy.batteryEnableIntegrationCheckbox().should('be.visible').click();
    cy.batteryDataChannelIntegrationID()
      .should('be.visible')
      .type(batteryIntegrationID);
  }
);

Cypress.Commands.add(
  'enterQuickTankDetails',
  (
    tankDesc,
    tankTech,
    site,
    tankType,
    RTU,
    levelSensor,
    levelChannel,
    pressureSensor,
    pressureChannel,
    product,
    maxProductHeight,
    displayUnits,
    maxProductHeight2,
    ruleGroup,
    integrationID,
    domain,
    levelIntegrationID,
    pressureIntegrationID,
    batteryIntegrationID,
    notes
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('record');
    cy.get('[id="description-input"]', {timeout:5000}).type(tankDesc, {force:true});
    cy.quickTankTechnician().type(tankTech);

    cy.enterSiteDetails(site);

    cy.quickTankType().should('be.visible').click();
    cy.levelDropdown(tankType);

    cy.enterTankMonitoringDetails(
      RTU,
      levelSensor,
      levelChannel,
      pressureSensor,
      pressureChannel
    );

    cy.quickTankProduct().type(product + '{downarrow}{enter}', {force: true} , {
      timeout: 7000});

    cy.enterLevelMonitoringAndVolumeDetails(
      maxProductHeight,
      displayUnits,
      maxProductHeight2
    );

    cy.enterEventRulesDetails(ruleGroup);

    cy.enterIntegrationParameters(
      integrationID,
      domain,
      levelIntegrationID,
      pressureIntegrationID,
      batteryIntegrationID
    );

    cy.quickTankNotes().should('be.visible').type(notes);
  }
);

Cypress.Commands.add('verifyDataSourceDropdownFields', () => {
  cy.get('[data-value="0"]').should('have.text', 'RTU');
  cy.get('[data-value="1"]').should('have.text', 'Published Data Channel');
});

Cypress.Commands.add('siteSaveAndExit', () => {
  cy.server();
  cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('site');

  cy.wait(1000);

  cy.findAllByText('Save & Close', { timeout: 3000 })
    .eq(1)
    .trigger('mouseover', {force:true})
    .click({ force: true });

  cy.wait('@site').should('have.property', 'status', 200);
});

Cypress.Commands.add(
  'enterQuickTankEditSiteAndProductDetails',
  (
    tankDesc,
    tankTech,
    site,
    editCustName,
    tankDimension,
    RTU,
    levelSensor,
    levelChannel,
    pressureSensor,
    pressureChannel,
    product,
    editProductName,
    displayUnits,
    maxProductHeight,
    ruleGroup,
    integrationID,
    domain,
    levelIntegrationID,
    pressureIntegrationID,
    batteryIntegrationID,
    notes
  ) => {
    let custName, siteName, displayUnit, maxProductTitle, prodName, productName;

    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('record');
    cy.route('POST', routes.retrieveTankListPrefixUrl).as('tankDimension');
    cy.route('POST', routes.retrieveProductEditUrl).as('productWait');

    cy.get('[id="description-input"]').type(tankDesc);
    cy.quickTankTechnician().type(tankTech);

    cy.enterSiteDetails(site);

    cy.findAllByText('Edit').eq(0).click({force: true});
    cy.findAllByText('Edit Site').should('be.visible');

    cy.customerName()
      .clear({ force: true })
      .type(editCustName, { force: true });

    cy.customerName()
      .invoke('val')
      .then((cust) => {
        custName = cust;
        cy.log(custName);
      });

    cy.siteSaveAndExit();

    cy.quickTankSite()
      .invoke('val')
      .then((site) => {
        siteName = site;
        cy.log('QT screen' + siteName);
        cy.log('site screen' + custName);
        expect(siteName).to.contain(custName);
      });

    cy.setTankDimensionCheckbox().click({force:true});
    cy.quickTankType().should('not.exist');
    cy.findAllByText('Level Volume/Mass Details').should('not.exist');

    cy.tankDimension().type(tankDimension, {force:true});
    cy.wait('@tankDimension').should('have.property', 'status', 200);
    cy.tankDimension().type('{downarrow}{enter}');

    cy.enterTankMonitoringDetails(
      RTU,
      levelSensor,
      levelChannel,
      pressureSensor,
      pressureChannel
    );

    cy.quickTankProduct()
      .should('be.visible')
      .type(product + '{downarrow}{enter}', { timeout: 5000 });

    //Edit Product
    cy.get('[id="productId-input-label"]').findAllByText('Edit').click({force: true});
    cy.wait('@productWait').should('have.property', 'status', 200);
    cy.findAllByText('Edit Product').should('be.visible');
    cy.get('[id="name-input"]', { timeout: 5000 })
      .clear({ force: true })
      .type(editProductName, { force: true });
    cy.get('[id="name-input"]')
      .invoke('val')
      .then((prod) => {
        prodName = prod;
      });

    cy.productSaveAndExit();
    cy.get('[id="productId-input"]')
      .invoke('val')
      .then((product) => {
        productName = product;
        expect(productName).to.contain(prodName);
      });

    cy.levelDisplayUnits()
      .should('be.visible')
      .and('have.text', 'Ins WC')
      .click();
    cy.levelDropdown(displayUnits);

    cy.levelDisplayUnits().then((unit) => {
      displayUnit = unit.text();
    });

    cy.get('[id="levelMonitoringMaxProductHeight-input-label"]').then(
      (maxProduct) => {
        maxProductTitle = maxProduct.text();

        expect(maxProductTitle).to.contain('(' + displayUnit + ')');
      }
    );

    cy.levelMaxProductHeight()
      .should('be.visible')
      .and('have.attr', 'type', 'number')
      .type(maxProductHeight);

    cy.enterEventRulesDetails(ruleGroup);

    cy.enterIntegrationParameters(
      integrationID,
      domain,
      levelIntegrationID,
      pressureIntegrationID,
      batteryIntegrationID
    );

    cy.quickTankNotes().should('be.visible').type(notes);
  }
);

Cypress.Commands.add(
  'enterQuickTankPublichedDCEditSiteDetails',
  (
    tankDesc,
    tankTech,
    site,
    editCustName,
    tankDimension,
    dataSource,
    publishedComments,
    product,
    editProductName,
    displayUnits,
    maxProductHeight,
    ruleGroup,
    integrationID,
    domain,
    levelIntegrationID,
    notes
  ) => {
    let prodName, tankProdName, displayUnit, maxProductTitle;

    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('record');
    cy.route('POST', routes.retrievePublishedDCSearchListByComments).as(
      'dataChannel'
    );
    cy.route('POST', routes.retrieveSiteByIdUrl).as('siteComponent');
    cy.route('POST', routes.retrieveProductEditUrl).as('prodComponent');
    cy.route('POST', routes.retrieveSourceDCbyIdUrl).as('sourceDC');

    cy.quickTankDesc().type(tankDesc);
    cy.quickTankTechnician().type(tankTech);

    cy.enterSiteDetails(site);

    cy.findAllByText('Edit').eq(0).click();
    cy.wait('@siteComponent').should('have.property', 'status', 200);

    cy.findAllByText('Edit Site').should('be.visible');

    cy.wait(2000);
    cy.customerName()
      .clear({ force: true })
      .type(editCustName, { force: true });

    cy.siteSaveAndExit();

    cy.setTankDimensionCheckbox().should('be.visible').click();
    cy.quickTankType().should('not.exist');
    cy.findAllByText('Level Volume/Mass Details').should('not.exist');

    cy.tankDimension().type(tankDimension + '{downarrow}{enter}');
    //cy.wait(2000);
    cy.tankDimension().type('{downarrow}{enter}', { timeout: 5000 });

    cy.tankDataSource().should('be.visible').and('have.text', 'RTU').click();
    cy.verifyDataSourceDropdownFields();
    cy.levelDropdown(dataSource);
    cy.tankDataSource().should('be.visible').and('have.text', dataSource);

    cy.tankRTU().should('not.exist');
    cy.tankLevelSensor().should('not.exist');
    cy.tankLevelChannel().should('not.exist');
    cy.tankLevelPressure().should('not.exist');

    cy.publishedComments()
      .should('be.visible')
      .type(publishedComments + '{downarrow}{enter}');
    cy.publishedComments().type('{downarrow}{enter}');

    cy.wait('@dataChannel').should('have.property', 'status', 200);

    cy.wait('@sourceDC').should('have.property', 'status', 200);
    cy.findAllByText('Source Domain', { timeout: 8000 }).should('be.visible');
    cy.findAllByText('Level Sensor', { timeout: 8000 }).should('be.visible');

    cy.quickTankProduct()
      .should('be.visible')
      .type(product + '{downarrow}{enter}');

    cy.findAllByText('Edit').eq(2).click();

    cy.wait('@prodComponent').should('have.property', 'status', 200);

    cy.findAllByText('Edit Product').should('be.visible');

    cy.get('[id="name-input"]')
      .clear({ force: true })
      .type(editProductName, { force: true });

    cy.get('[id="name-input"]')
      .invoke('val')
      .then((prod) => {
        prodName = prod;
        cy.log(prodName);
      });

    cy.productSaveAndExit();

    cy.quickTankProduct()
      .invoke('val')
      .then((prod) => {
        tankProdName = prod;
        cy.log('QT screen' + tankProdName);
        cy.log('product screen' + prodName);
        expect(tankProdName).to.be.equal(prodName);
      });

    cy.levelDisplayUnits()
      .should('be.visible')
      .and('have.text', 'None')
      .click();
    cy.levelDropdown(displayUnits);

    cy.levelDisplayUnits().then((unit) => {
      displayUnit = unit.text();
    });

    cy.get('[id="levelMonitoringMaxProductHeight-input-label"]').then(
      (maxProduct) => {
        maxProductTitle = maxProduct.text();

        expect(maxProductTitle).to.contain('(' + displayUnit + ')');
      }
    );

    cy.levelMaxProductHeight()
      .should('be.visible')
      .and('have.attr', 'type', 'number')
      .type(maxProductHeight);

    cy.enterEventRulesDetails(ruleGroup);

    cy.assetIntegrationID()
      .should('be.visible')
      .and('have.attr', 'type', 'text')
      .type(integrationID);

    cy.selectDomain().should('be.visible').click();
    cy.levelDropdown(domain);

    cy.levelEnableIntegrationCheckbox().should('be.visible').click();
    cy.levelDataChannelIntegrationID()
      .should('be.visible')
      .type(levelIntegrationID);

    cy.quickTankNotes().should('be.visible').type(notes);
  }
);

Cypress.Commands.add(
  'enterQuickTankPublishedDCAddSiteAndProductDetails',
  (
    tankDesc,
    tankTech,
    header,
    custName,
    contactName,
    contactPhone,
    address1,
    country,
    state,
    city,
    pcode,
    timeZone,
    tankType,
    dataSource,
    publishedComments,
    name,
    gravity,
    SCM,
    productGroup,
    productHeader,
    ruleGroup,
    notes
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('record');
    cy.route('POST', routes.retrievePublishedDCSearchListByComments).as(
      'dataChannel'
    );

    cy.route('POST', routes.retrieveSiteByIdUrl).as('siteComponents');

    cy.quickTankDesc().type(tankDesc);
    cy.quickTankTechnician().type(tankTech);

    cy.tankSiteLabel().findByText('Add').click();

    cy.wait('@siteComponents').should('have.property', 'status', 200);

    cy.enterSitesDetailsforQT(
      header,
      custName,
      contactName,
      contactPhone,
      address1,
      country,
      state,
      city,
      pcode,
      timeZone
    );

    cy.siteSaveAndExit();

    cy.quickTankType().should('be.visible').click();
    cy.levelDropdown(tankType);

    cy.tankDataSource().should('be.visible').and('have.text', 'RTU').click();

    cy.verifyDataSourceDropdownFields();
    cy.levelDropdown(dataSource);
    cy.tankDataSource().should('be.visible').and('have.text', dataSource);

    cy.tankRTU().should('not.exist');
    cy.tankLevelSensor().should('not.exist');
    cy.tankLevelChannel().should('not.exist');
    cy.tankLevelPressure().should('not.exist');

    cy.publishedComments()
      .should('be.visible')
      .type(publishedComments + '{downarrow}{enter}');
    cy.publishedComments().type('{downarrow}{enter}');

    cy.wait('@dataChannel').should('have.property', 'status', 200);

    cy.wait(2000);
    cy.findAllByText('Source Domain').should('be.visible');
    cy.findAllByText('Level Sensor').should('be.visible');

    cy.clickOnProductLabel('Add');

    cy.enterProductDetailsForQT(
      name,
      gravity,
      SCM,
      productGroup,
      productHeader
    );

    cy.productSaveAndExit();

    cy.enterEventRulesDetails(ruleGroup);

    cy.quickTankNotes().should('be.visible').type(notes);
  }
);

Cypress.Commands.add('verifyBulkActionsDropdownFields', () => {
  cy.get('[data-value="copy"]').should('exist');
  cy.get('[data-value="transfer"]').should('exist');
  cy.get('[data-value="delete"]').should('exist');
});

Cypress.Commands.add('deleteFromBulkActionsDropdown', (btn) => {
  cy.levelDropdown(btn);
});

Cypress.Commands.add('emptySiteSaveAndExit', () => {
  cy.wait(1000);
  cy.findAllByText('Save & Close').eq(1).trigger('mouseover').click({
    force: true,
  });
  cy.wait(1000);
});

Cypress.Commands.add('enterGeneralQuickTankDetails', (tankDesc, tankTech) => {
  cy.quickTankDesc().type(tankDesc);
  cy.quickTankTechnician().type(tankTech);
  cy.mapView().should('not.exist');
});

Cypress.Commands.add(
  'enterQuickTankDetailsCustom',
  (
    tankDesc,
    tankTech,
    site,
    tankType,
    RTU,
    levelSensor,
    levelChannel,
    pressureSensor,
    pressureChannel,
    product,
    maxProductHeight,
    displayUnits,
    maxProductHeight2,
    ruleGroup,
    direction,
    value,
    notes
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('record');
    cy.wait(1000);
    cy.get('[id="description-input"]', { timeout: 3000 }).type(tankDesc);
    cy.quickTankTechnician().type(tankTech);

    cy.enterSiteDetails(site);

    cy.quickTankType().should('be.visible').click();
    cy.levelDropdown(tankType);

    cy.enterTankMonitoringDetails(
      RTU,
      levelSensor,
      levelChannel,
      pressureSensor,
      pressureChannel
    );

    cy.quickTankProduct()
      .should('be.visible')
      .type(product + '{downarrow}{enter}', {force: true});

    cy.enterLevelMonitoringAndVolumeDetails(
      maxProductHeight,
      displayUnits,
      maxProductHeight2
    );

    cy.eventRuleGroup().should('be.visible').and('have.text', 'Select').click();
    cy.levelDropdown(ruleGroup);

    cy.enterCustomDetails(direction, value);

    cy.quickTankNotes().should('be.visible').type(notes);
  }
);

Cypress.Commands.add('customNumberInputField', () => {
  cy.get('[name="customProperties[1].value"]');
});

Cypress.Commands.add('enterCustomDetails', (direction, value) => {
  cy.get('[id="mui-component-select-customProperties[0].value"]').click();
  cy.levelDropdown(direction);

  cy.get('[name="customProperties[2].value"]').check().should('be.checked');

  cy.customNumberInputField().type('-1');
  cy.get('[name="customProperties[3].value"]').click();
  cy.findAllByText(
    'Value must be between 0 and 100 with a precision of 2'
  ).should('exist');

  cy.customNumberInputField().clear().type(value);
});

Cypress.Commands.add(
  'enterSitesDetailsforQT',
  (
    header,
    custName,
    contactName,
    contactPhone,
    address1,
    country,
    state,
    city,
    pcode,
    timeZone
  ) => {
    cy.findByText(header).should('exist');

    cy.wait(1000);

    cy.findByLabelText('Customer Name *').type(custName, {
      force: true,
    });

    cy.contactName().type(contactName, {
      force: true,
    });

    cy.contactPhone().type(contactPhone, {
      force: true,
    });

    cy.get('input[name="address1"]').type(address1, {
      force: true,
    });

    cy.findByLabelText('Country').type(country, {
      force: true,
    });

    cy.findByLabelText('State').type(state, {
      force: true,
    });

    cy.findByLabelText('City').type(city, {
      force: true,
    });

    cy.postalCode().type(pcode, {
      force: true,
    });

    cy.timeZone().click({
      force: true,
    });
    cy.findAllByText(timeZone).click({
      force: true,
    });

    cy.get('[name="notes"]').eq(1).type('IT is a Test site #@$% 1234567890');

    cy.get('[type="checkbox"]').eq(2).check().should('be.checked');

    cy.get('input[name="latitude"]').should('be.enabled');

    cy.get('input[name="longitude"]').should('be.enabled');

    cy.findByText('Get Lat/Long').click({
      force: true,
    });
  }
);

Cypress.Commands.add(
  'enterQuickTankDetailsWithoutSiteAndProduct',
  (
    tankDesc,
    tankTech,
    tankType,
    dataSource,
    publishedComments,
    maxProductHeight,
    displayUnits,
    maxProductHeight2,
    ruleGroup,
    notes
  ) => {
    cy.enterGeneralQuickTankDetails(tankDesc, tankTech);

    cy.quickTankType().click();
    cy.levelDropdown(tankType);

    cy.enterTankMonitoringDetailsForPDC(dataSource, publishedComments);

    cy.levelMaxProductHeight()
      .should('have.attr', 'type', 'number')
      .type(maxProductHeight);

    cy.levelDisplayUnits().should('have.text', 'None').click();
    cy.levelDropdown(displayUnits);

    cy.levelMaxProductHeight2()
      .should('have.attr', 'type', 'number')
      .type(maxProductHeight2);

    cy.enterEventRulesDetails(ruleGroup);

    cy.quickTankNotes().should('be.visible').type(notes);
  }
);

Cypress.Commands.add(
  'enterProductDetailsForQT',
  (name, gravity, SCM, productGroup, headerText) => {
    cy.wait(1000);

    cy.findByText(headerText).should('exist');

    cy.get('[id="name-input"]')
      .type(name, { force: true })
      .and('have.attr', 'type', 'text');

    cy.get('[id="specificGravity-input"]')
      .type(gravity, { force: true })
      .and('have.attr', 'type', 'number');

    cy.get('[id="description-input"]')
      .eq(1)
      .type(name)
      .should('be.visible')
      .and('have.attr', 'type', 'text');

    cy.get('[id="standardVolumePerCubicMeter-input"]')
      .type(SCM)
      .should('be.visible')
      .and('have.attr', 'type', 'number');

    cy.get('[id="productGroup-input"]').should('be.visible').type(productGroup);

    cy.get('[id="displayUnit-input"]').should('be.visible').click();

    cy.get('[data-value="40"]').click();
  }
);

Cypress.Commands.add(
  'enterTankMonitoringDetailsForPDC',
  (dataSource, publishedComments) => {
    cy.server();
    cy.route('POST', routes.retrievePublishedDCSearchListByComments).as(
      'publishedData'
    );
    cy.route('POST', routes.retrieveSourceDCbyIdUrl).as('sourceDC');

    cy.tankDataSource().should('be.visible').and('have.text', 'RTU').click();
    cy.verifyDataSourceDropdownFields();
    cy.levelDropdown(dataSource);

    cy.publishedComments().type(publishedComments + '{downarrow}{enter}');
    cy.wait('@publishedData').should('have.property', 'status', 200);

    cy.publishedComments().type('{downarrow}{enter}');
    cy.wait('@sourceDC').should('have.property', 'status', 200);
    cy.findAllByText('Source Domain').should('exist');
    cy.findAllByText('Level Sensor').should('exist');
  }
);

Cypress.Commands.add('clickOnSiteLabel', (action) => {
  cy.server();
  cy.route('POST', routes.retrieveSiteLocationInfoAutoCompleteList).as(
    'siteRecords'
  );

  cy.tankSiteLabel().findByText(action).click();

  cy.wait('@siteRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('clickOnProductLabel', (action) => {
  cy.quickTankProductLabel().findByText(action).click({
    force: true,
  });
});

Cypress.Commands.add('clickOnPressureDropdownList', (pressureChannel) => {
  cy.get('[aria-labelledby="pressureRtuChannelId-input-label"]')
    .find('li')
    .each(($el, index, $list) => {
      if (
        $el.text().includes(pressureChannel) &&
        ($el.text().includes('(in use)') || $el.text().includes('(not in use)'))
      ) {
        $el.click();
      } else {
        cy.log('The filter doesnt match the substring');
        cy.log($el.text());
      }
    });
});

Cypress.Commands.add('verifyAssetTankPopup', (quickTank) => {
  cy.findByText('Save Successful!', { timeout: 5000 }).should('exist');
  cy.findByText('Bulk Tank Asset Created').should('exist');
  cy.findByText(quickTank).should('exist');

  cy.findByText('View Details').should('exist');
  cy.findByText('Exit').should('exist');
  cy.findByText('Create New Bulk Tank').should('exist');
});

Cypress.Commands.add('tankDimensionErrorText', () => {
  cy.get('[id="tankDimensionId-input-helper-text"]');
});

Cypress.Commands.add(
  'verifyViewDetailsInformation',
  (
    tankDesc,
    assetSite,
    eventRuleGroup,
    technician,
    assetIntgName,
    assetNotes
  ) => {
    cy.findAllByText(eventRuleGroup).should('exist');
    cy.fetchInputFieldText('[name="asset.description"]', tankDesc);
    cy.fetchInputFieldText('[id="siteId-input"]', assetSite);
    cy.fetchInputFieldText('[name="asset.installedTechName"]', technician);
    cy.fetchInputFieldText('[name="asset.integrationName"]', assetIntgName);
    cy.fetchInputFieldText('[name="asset.notes"]', assetNotes);
  }
);

Cypress.Commands.add(
  'verifyCustomViewDetailsInformation',
  (tankDesc, assetSite, eventRuleGroup, technician, direction, number) => {
    cy.findAllByText(eventRuleGroup).should('exist');
    cy.fetchInputFieldText('[name="asset.description"]', tankDesc);
    cy.fetchInputFieldText('[id="siteId-input"]', assetSite);
    cy.fetchInputFieldText('[name="asset.installedTechName"]', technician);
    cy.findAllByText(direction).should('exist');
    cy.fetchInputFieldText('[name="asset.customProperties[1].value"]', number);
  }
);

Cypress.Commands.add('clickOnDialogButtons', (text, url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.get('[role="dialog"]').findByText(text).click();

  cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add('verifyAllQuickTankFieldsAreClear', () => {
  cy.get('[id="description-input"]').should('have.value', '');
  cy.get('[id="technician-input"]').should('have.value', '');
  cy.get('[id="siteId-input"]').should('have.value', '');
  cy.get('[id="rtuId-input"]').should('have.value', '');
  cy.get('[id="productId-input"]').should('have.value', '');
});

Cypress.Commands.add('productSaveAndExit', () => {
  cy.server();
  cy.route('POST', routes.retrieveProductNameInfoByPrefix).as('product');

  cy.wait(1000);
  cy.findAllByText('Save & Close').eq(1).trigger('mouseover', {force: true}).click({
    force: true,
  });
  cy.wait(1000);

  cy.wait('@product').should('have.property', 'status', 200);
});
