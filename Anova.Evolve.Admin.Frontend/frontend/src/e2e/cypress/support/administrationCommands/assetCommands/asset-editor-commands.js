import '@testing-library/cypress/add-commands';
import UtilFunctions from '../../utils/UtilFunctions';
const routes = require('../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();
import moment from 'moment';
import '@4tw/cypress-drag-drop';

let assetType,
  designCurveType,
  eventRoleGroup,
  technician,
  assetIntegrationId,
  siteAddress,
  geoAreaGroup,
  custName,
  siteName,
  prodName,
  tankProdName;

Cypress.Commands.add('assetDescription', () => {
  cy.get('[name="asset.description"]');
});

Cypress.Commands.add('assetType', () => {
  cy.get('[id="mui-component-select-asset.assetType"]');
});

Cypress.Commands.add('assetDesignCurveType', () => {
  cy.get('[id="mui-component-select-asset.designCurveType"]');
});

Cypress.Commands.add('assetEventRuleGroup', () => {
  cy.get('[id="mui-component-select-asset.eventRuleGroupId"]');
});

Cypress.Commands.add('assetTechnician', () => {
  cy.get('[name="asset.installedTechName"]');
});

Cypress.Commands.add('assetIntegrationIDName', () => {
  cy.get('[name="asset.integrationName"]');
});

Cypress.Commands.add('dropdownSorting', () => {
  cy.get('[id="hornerRTUType-dropdown"]')
    .click()
  let compressor = '[class="MuiList-root MuiMenu-list MuiList-padding"]'
  utilFunctions.verifyColumnSortingAsc(compressor);
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .click()


  cy.get('[id="hornerModelType-dropdown"]')
    .click()
  let ip = '[class="MuiList-root MuiMenu-list MuiList-padding"]';
  utilFunctions.verifyColumnSortingAsc(ip);
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .click()


  cy.get('[id="rtuPollScheduleGroupId-dropdown"]')
    .click()
  let CET = '[class="MuiList-root MuiMenu-list MuiList-padding"]';
  utilFunctions.verifyColumnSortingAsc(CET);
  cy.get("ul[role='listbox'] > li:first-of-type")
    .click()
})

Cypress.Commands.add('assetMobileCheckbox', () => {
  cy.get('[name="asset.isMobile"]');
});

Cypress.Commands.add('assetGeoAreaGroup', () => {
  cy.get('[id="mui-component-select-asset.geoAreaGroupId"]');
});

Cypress.Commands.add('assetNotes', () => {
  cy.get('[name="asset.notes"]');
});

Cypress.Commands.add('assetTabs', () => {
  cy.get('[aria-label="asset tabs"]');
});

Cypress.Commands.add('dataChannelTable', () => {
  cy.get('[aria-label="data channels table"]');
});

//Data Analog

Cypress.Commands.add('analogChannelDesc', () => {
  cy.get('[name="description"]');
});

Cypress.Commands.add('channelDropdown', () => {
  cy.get('[id="mui-component-select-rtuChannelId"]');
});

Cypress.Commands.add('templateDropdown', () => {
  cy.get('[id="mui-component-select-dataChannelTemplateId"]');
});

Cypress.Commands.add('tankDimensionCheckbox', () => {
  cy.get('[name="isTankDimensionsSet"]');
});

//Manual lat long lookup
Cypress.Commands.add('manualLookup', () => {
  cy.get('[name="isGeoCodeManual"]');
});

Cypress.Commands.add('stateValue', (index) => {
  cy.get(`[name="state${index}Value"]`);
});

Cypress.Commands.add('stateText', (index) => {
  cy.get(`[name="state${index}Text"]`);
});

Cypress.Commands.add('rtuDataChannel', () => {
  cy.get('[id="mui-component-select-deviceId"]', { timeout: 15000 });
});

Cypress.Commands.add('dataChannelCheckboxes', () => {
  cy.get('[aria-label="Available diagnostic channel checkboxes"] div label', {
    timeout: 5000,
  });
});

Cypress.Commands.add('VerifySaveChangesPopUp', () => {
  cy.findAllByRole('dialog').should('be.visible');

  cy.findAllByText('Save Changes?').should('be.visible');
  cy.findAllByText(
    'You have unsaved changes. Would you like to save before exiting?'
  ).should('be.visible');

  cy.findAllByText('Discard & Exit').should('be.visible');
  cy.findAllByText('Resume').should('be.visible');
});

Cypress.Commands.add('clickOnDiscardAndExit', () => {
  cy.server();
  cy.route('POST', routes.retrieveAssetByOptionsUrl).as('retrieveRecords');
  cy.findAllByText('Discard & Exit').click();
  cy.wait('@retrieveRecords').should('have.property', 'status', 200);
  cy.findAllByText('Asset Configuration Manager').should('be.visible');
});

Cypress.Commands.add('clickOnResume', (header) => {
  cy.findAllByText('Resume').click();
  cy.findAllByRole('dialog').should('not.exist');
  cy.findAllByText(header).should('be.visible');
});

Cypress.Commands.add('verifyAssetTankDropdowns', () => {
  cy.get('[data-value="0"]').should('have.text', 'None');
  cy.get('[data-value="1"]').should('have.text', 'Tank');
  cy.get('[data-value="2"]').should('have.text', 'Helium ISO Container');
});

Cypress.Commands.add(
  'editAssetConfiguration',
  (description, type, curveType, ruleGroup, tech, integrationId, notes) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('site');

    cy.assetDescription().clear().type(description);
    cy.wait(1000);
    cy.go('back');
    cy.VerifySaveChangesPopUp();
    cy.clickOnResume('Edit Asset');

    cy.assetType().should('be.visible').click();
    cy.verifyAssetTankDropdowns();
    cy.levelDropdown(type);
    cy.assetType().then((dropdown) => {
      assetType = dropdown.text();
      cy.log(assetType);
    });

    cy.assetDesignCurveType().should('be.visible').click();
    cy.levelDropdown(curveType);
    cy.assetDesignCurveType().then((dropdown) => {
      designCurveType = dropdown.text();
    });

    cy.assetEventRuleGroup().should('be.visible').click();
    cy.levelDropdown(ruleGroup);
    cy.assetEventRuleGroup().then((dropdown) => {
      eventRoleGroup = dropdown.text();
    });

    cy.assetTechnician()
      .should('be.visible')
      .and('have.attr', 'type', 'text')
      .clear()
      .type(tech)
      .invoke('val')
      .then((field) => {
        technician = field;
      });

    cy.assetIntegrationIDName()
      .should('be.visible')
      .and('have.attr', 'type', 'text')
      .type(integrationId)
      .invoke('val')
      .then((field) => {
        assetIntegrationId = field;
      });

    cy.assetNotes().should('be.visible').type(notes);
  }
);

Cypress.Commands.add(
  'editAssetConfigurationAllFields',
  (
    description,
    type,
    curveType,
    ruleGroup,
    tech,
    integrationId,
    site,
    geoArea,
    notes
  ) => {
    cy.editAssetConfiguration(
      description,
      type,
      curveType,
      ruleGroup,
      tech,
      integrationId,
      notes
    );

    cy.quickTankSite().clear();
    cy.wait('@site').should('have.property', 'status', 200);
    cy.quickTankSite().type(site);
    cy.wait('@site').should('have.property', 'status', 200);
    cy.wait(1000);
    cy.quickTankSite()
      .type('{downarrow}{enter}')
      .invoke('val')
      .then((field) => {
        siteAddress = field;
      });

    cy.assetMobileCheckbox().should('be.visible').click({ force: true });

    cy.assetGeoAreaGroup().should('be.visible').click();
    cy.levelDropdown(geoArea);

    cy.assetGeoAreaGroup().then((dropdown) => {
      geoAreaGroup = dropdown.text();
    });
  }
);

Cypress.Commands.add('verifyAllEditedFields', (desc) => {
  cy.assetType().then((dropdown) => {
    const type = dropdown.text();
    cy.log('type:' + type);

    expect(type).to.be.equal(assetType);
  });

  cy.assetDescription()
    .invoke('val')
    .then((desc) => {
      const description = desc;

      expect(description).to.be.equal(desc);
    });

  cy.assetDesignCurveType().then((dropdown) => {
    const curveType = dropdown.text();

    expect(curveType).to.be.equal(designCurveType);
  });

  cy.assetEventRuleGroup().then((dropdown) => {
    const group = dropdown.text();

    expect(group).to.be.equal(eventRoleGroup);
  });

  cy.assetTechnician()
    .invoke('val')
    .then((field) => {
      const tech = field;

      expect(tech).to.be.equal(technician);
    });

  cy.assetIntegrationIDName()
    .invoke('val')
    .then((field) => {
      const intID = field;

      expect(intID).to.be.equal(assetIntegrationId);
    });

  cy.quickTankSite().then(($field) => {
    const site = $field.val().toString().toLowerCase();
    expect(site).to.be.equal(siteAddress.toString().toLowerCase());
  });

  cy.assetMobileCheckbox().should('be.checked');

  cy.assetGeoAreaGroup().then((dropdown) => {
    const group = dropdown.text();

    expect(group).to.be.equal(geoAreaGroup);
  });
});

Cypress.Commands.add(
  'enterSitesDetailsforAsset',
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

    cy.get('[name="notes"]').type('IT is a Test site #@$% 1234567890', { force: true });
    cy.manualLookup().check({ force: true }).should('be.checked');
    cy.get('input[name="latitude"]').should('be.enabled');
    cy.get('input[name="longitude"]').should('be.enabled');
    cy.findByText('Get Lat/Long').click({
      force: true,
    });
  }
);

Cypress.Commands.add('editSiteSaveAndClose', () => {
  cy.server();
  cy.route('POST', routes.saveSiteUrl).as('saveSite');
  cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('retrieveSite');

  cy.wait(1000);
  cy.findAllByText('Save & Close').eq(1).click({ force: true });

  cy.wait('@saveSite').should('have.property', 'status', 200);
  cy.wait('@retrieveSite').should('have.property', 'status', 200);
});

Cypress.Commands.add(
  'enterProductDetailsForAsset',
  (name, gravity, SCM, productGroup, headerText) => {
    cy.wait(1000);

    cy.findByText(headerText).should('exist');

    cy.productName()
      .type(name, { force: true })
      .and('have.attr', 'type', 'text');

    cy.get('[id="specificGravity-input"]')
      .type(gravity, { force: true })
      .and('have.attr', 'type', 'number');

    cy.get('[id="description-input"]')
      .type(name)
      .and('have.attr', 'type', 'text');

    cy.get('[id="standardVolumePerCubicMeter-input"]')
      .type(SCM)
      .and('have.attr', 'type', 'number');

    cy.get('[id="productGroup-input"]').type(productGroup);
    cy.get('[id="displayUnit-input"]').click();
    cy.get('[data-value="40"]').click();
  }
);

Cypress.Commands.add('dataChannelAddButton', (btn) => {
  cy.findAllByText('Add').eq(1).click();
  cy.findAllByText(btn).click();
});

Cypress.Commands.add(
  'enterDataChannelDetails',
  (header, desc, RTU, channel, template, group) => {
    cy.server();
    cy.route('POST', routes.retrieveRtuListPrefixUrl).as('rtu');

    cy.findAllByText(header).should('be.visible');
    cy.analogChannelDesc().type(desc, { force: true });

    cy.tankRTU()
      .should('have.attr', 'placeholder', 'Enter Search Criteria...')
      .type(RTU, { force: true });
    cy.wait('@rtu').should('have.property', 'status', 200);
    cy.tankRTU().type('{downarrow}{enter}');

    cy.wait('@rtu').should('have.property', 'status', 200);
    cy.wait(3000);
    cy.channelDropdown().should('have.text', 'Select').click({ force: true });
    cy.clickOnLevelDropdownList(channel, { force: true });

    cy.templateDropdown().click({ force: true });
    cy.levelDropdown(template);

    cy.eventRuleGroup().should('have.text', 'Select').click({ force: true });
    cy.levelDropdown(group);
  }
);

Cypress.Commands.add(
  'enterAnalogChannelDetails',
  (header, desc, dataChannel, RTU, channel, template, group) => {
    cy.enterDataChannelDetails(header, desc, RTU, channel, template, group);

    cy.tankDataSource().click({ force: true });
    cy.verifyDataSourceDropdownFields();
    cy.levelDropdown(dataChannel);

    cy.tankDimensionCheckbox().should('exist').and('not.be.checked');

    cy.quickTankType()
      .should('exist')
      .and('have.text', 'Horizontal with 2:1 Ellipsoidal Ends');
  }
);

Cypress.Commands.add(
  'enterDigitalChannelDetails',
  (
    header,
    desc,
    RTU,
    channel,
    template,
    group,
    value0,
    text0,
    value1,
    text1
  ) => {
    cy.enterDataChannelDetails(header, desc, RTU, channel, template, group);

    cy.stateValue(0).type(value0);
    cy.stateText(0).type(text0);
    cy.stateValue(1).type(value1);
    cy.stateText(1).type(text1);
  }
);

Cypress.Commands.add('dcSaveAndCloseButton', (url) => {
  cy.server();
  cy.route('POST', url).as('dc');
  cy.findAllByText('Save & Close').eq(1).click();
  cy.wait('@dc')//.should('have.property', 'status', 201);
});

Cypress.Commands.add('verifyDataChannelCreated', (locator, recordName) => {
  cy.get(locator).each(($el) => {
    const name = $el.text();

    if (name == recordName) {
      expect($el.text()).to.be.equal(recordName);
    } else {
      cy.log(name);
    }
  });
});

Cypress.Commands.add(
  'enterDiagnosticChannelDetails',
  (RTU, battery, gps, rtuCase, signalStrength, averageCurrent) => {
    cy.rtuDataChannel().click({ force: true });
    cy.levelDropdown(RTU);

    cy.get('span').contains(battery).should('be.visible');
    cy.get('span').contains(gps).should('be.visible');
    cy.get('span').contains(rtuCase).should('be.visible');
    cy.get('span').contains(signalStrength).should('be.visible');
    cy.get('span').contains(averageCurrent).should('be.visible');

    var dataChannels = [battery, gps, rtuCase, signalStrength, averageCurrent];

    dataChannels.forEach((element) => {
      cy.selectDataChannelCheckBox(element);
    });

    dataChannels.forEach((element) => {
      cy.verifyDataChannelChecked(element);
    });
  }
);

Cypress.Commands.add('RTUTimeEditNotPresent', () => {
  cy.contains('RTU Time Correction').parent().siblings().should('not.exist')
})

Cypress.Commands.add('selectDataChannelCheckBox', (text) => {
  cy.dataChannelCheckboxes().each(($el, index) => {
    const level = $el.text();

    if (level === text) {
      cy.dataChannelCheckboxes().find('[type="checkbox"]').eq(index).click({
        force: true,
      });
    }
  });
});

Cypress.Commands.add('verifyDataChannelChecked', (text) => {
  cy.dataChannelCheckboxes().each(($el, index) => {
    const level = $el.text();

    if (level === text) {
      cy.dataChannelCheckboxes()
        .find('[type="checkbox"]')
        .eq(index)
        .should('be.checked');
    }
  });
});

Cypress.Commands.add('verifyDcDeletedFromDiagnostic', (text) => {
  cy.dataChannelCheckboxes().each(($el) => {
    const level = $el.text();

    if (level !== text) {
      cy.log('Data channel doesnt exist: ' + text);
    }
  });
});

Cypress.Commands.add('clickOnCancelDC', (index) => {
  cy.wait(1000);
  cy.findAllByText('Cancel').eq(index).click({ force: true });
});

Cypress.Commands.add('selectTab', (tab) => {
  cy.assetTabs().findByText(tab).should('be.visible').click();
});

Cypress.Commands.add('verifyHistoryTab', (tab) => {
  cy.selectTab(tab);
  cy.findByRole('tabpanel').findByText(tab).should('be.visible');
});

Cypress.Commands.add(
  'editAssetConfigurationAndSite',
  (description, type, site, text, notes) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('site');

    cy.route('POST', routes.retrieveSiteByIdUrl).as('siteComponents');

    cy.assetDescription().clear().type(description);

    cy.assetType().click();
    cy.verifyAssetTankDropdowns();
    cy.levelDropdown(type);

    cy.quickTankSite().clear();
    cy.wait('@site').should('have.property', 'status', 200);

    cy.quickTankSite()
      .should('be.visible')
      .type(site + '{downarrow}{enter}');
    cy.wait('@site').should('have.property', 'status', 200);
    cy.wait(1000);
    cy.quickTankSite().type('{downarrow}{enter}');

    cy.tankSiteLabel().findByText('Edit').click();
    cy.wait('@siteComponents').should('have.property', 'status', 200);

    cy.findAllByText('Edit Site').should('be.visible');
    cy.customerName().type(text, { force: true });

    cy.customerName()
      .invoke('val')
      .then((cust) => {
        custName = cust;
        cy.log(custName);
      });

    cy.editSiteSaveAndClose();

    cy.quickTankSite()
      .invoke('val')
      .then((site) => {
        siteName = site;
        cy.log('QT screen' + siteName);
        cy.log('site screen' + custName);
        expect(siteName).to.contain(custName);
      });

    cy.assetNotes().clear().should('be.visible').type(notes);
  }
);

Cypress.Commands.add(
  'enterAnalogChannelDetailsEditProduct',
  (
    header,
    desc,
    RTU,
    channel,
    template,
    group,
    dataChannel,
    product,
    editProductName,
    tankDimension
  ) => {
    cy.route('POST', routes.retrieveTankListPrefixUrl).as('tankDimension');

    cy.enterDataChannelDetails(header, desc, RTU, channel, template, group);

    cy.tankDataSource().click({ force: true });
    cy.verifyDataSourceDropdownFields();
    cy.levelDropdown(dataChannel);

    cy.quickTankProduct()
      .should('be.visible')
      .type(product + '{downarrow}{enter}');
    cy.wait(1000);
    cy.clickOnProductLabel('Edit');

    cy.productName()
      .clear({ force: true })
      .type(editProductName, { force: true });

    cy.productName()
      .invoke('val')
      .then((prod) => {
        prodName = prod;
        cy.log(prodName);
      });

    cy.productSaveAndClose();

    cy.quickTankProduct()
      .invoke('val')
      .then((prod) => {
        tankProdName = prod;
      });

    cy.tankDimensionCheckbox().click().should('exist').and('be.checked');
    cy.tankDimension().should('exist').type(tankDimension, { force: true });
    cy.wait('@tankDimension').should('have.property', 'status', 200);
    cy.tankDimension().type('{downarrow}{enter}');
    cy.wait(2000);
  }
);

Cypress.Commands.add(
  'enterAnalogDCDetails',
  (header, desc, RTU, channel, template, group, dataChannel) => {
    cy.route('POST', routes.retrieveTankListPrefixUrl).as('tankDimension');

    cy.enterDataChannelDetails(header, desc, RTU, channel, template, group);

    cy.tankDataSource().click({ force: true });
    cy.verifyDataSourceDropdownFields();
    cy.levelDropdown(dataChannel);
  }
);

Cypress.Commands.add(
  'enterQTDetailsForEdit',
  (
    tankDesc,
    site,
    RTU,
    levelSensor,
    levelChannel,
    pressureSensor,
    pressureChannel
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('record');
    cy.route('POST', routes.retrieveRtuListPrefixUrl).as('rtu');
    cy.wait(1000);
    cy.quickTankDesc().type(tankDesc, { force: true });

    cy.enterSiteDetails(site);

    cy.tankDataSource().should('be.visible').and('have.text', 'RTU').click();
    cy.levelDropdown('RTU');

    cy.tankRTU().type(RTU + '{downarrow}{enter}');
    cy.wait('@rtu').should('have.property', 'status', 200);
    cy.tankRTU().type('{downarrow}{enter}');

    cy.tankLevelSensor()
      .should('be.visible')
      .type(levelSensor + '{downarrow}{enter}', {
        force: true,
      });
    cy.tankLevelSensor().type('{downarrow}{enter}');
    cy.wait(1000);

    cy.tankLevelChannel().should('be.visible').click();
    cy.clickOnLevelDropdownList(levelChannel);
    cy.tankLevelPressure()
      .should('be.visible')
      .type(pressureSensor + '{downarrow}{enter}', {
        force: true,
      });
    cy.tankLevelPressure().type('{downarrow}{enter}');

    cy.tankPressureChannel().click();
    cy.clickOnPressureDropdownList(pressureChannel);
  }
);

Cypress.Commands.add('clickQTSaveCloseBtn', () => {
  cy.server();
  cy.route('POST', routes.saveAssetEditUrl).as('retrieveRecords');
  cy.route('POST', routes.retrieveAssetByOptionsUrl).as('records');

  cy.findAllByText('Save & Close', {
    timeout: 1000,
  }).click({
    force: true,
  });

  cy.wait('@retrieveRecords').should('have.property', 'status', 200);
  cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add(
  'enterAnalogChannelDetailsWithoutDimension',
  (header, desc, dataChannel, RTU, channel, template, group) => {
    cy.enterDataChannelDetails(header, desc, RTU, channel, template, group);

    cy.tankDataSource().click({ force: true });
    cy.verifyDataSourceDropdownFields();
    cy.levelDropdown(dataChannel);
  }
);

Cypress.Commands.add(
  'enterDiagnosticChannelDetailswithAllChecked',
  (RTU, battery, gps, rtuCase, shock) => {
    cy.rtuDataChannel().click({ force: true });
    cy.levelDropdown(RTU);

    cy.get('span').contains(battery).should('exist');
    cy.get('span').contains(gps).should('exist');
    cy.get('span').contains(rtuCase).should('exist');
    cy.get('span').contains(shock).should('exist');

    var dataChannels = [battery, gps, rtuCase, shock];

    dataChannels.forEach((element) => {
      cy.selectDataChannelCheckBox(element);
    });

    dataChannels.forEach((element) => {
      cy.verifyDataChannelChecked(element);
    });
  }
);

Cypress.Commands.add(
  'enterDiagnosticChannelDetailsAllChecked400Series',
  (RTU, signalStrength, averageChargeCurrent) => {
    cy.rtuDataChannel().click({ force: true });
    cy.levelDropdown(RTU);

    cy.get('span').contains(signalStrength).should('be.visible');
    cy.get('span').contains(averageChargeCurrent).should('be.visible');

    var dataChannels = [signalStrength, averageChargeCurrent];

    dataChannels.forEach((element) => {
      cy.selectDataChannelCheckBox(element);
    });

    dataChannels.forEach((element) => {
      cy.verifyDataChannelChecked(element);
    });
  }
);

Cypress.Commands.add('deleteDCRecord', (recordName) => {
  cy.get('td[aria-label="Description"]').each(($el, index) => {
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

Cypress.Commands.add(
  'editAssetConfigurationTank',
  (description, type, notes) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('site');

    cy.assetDescription().clear().type(description);
    cy.wait(1000);
    cy.go('back');
    cy.VerifySaveChangesPopUp();
    cy.clickOnResume('Edit Asset');

    cy.assetType().should('be.visible').click();
    cy.verifyAssetTankDropdowns();
    cy.levelDropdown(type);
    cy.assetType().then((dropdown) => {
      assetType = dropdown.text();
      cy.log(assetType);
    });

    cy.assetNotes().clear().should('be.visible').type(notes);

    cy.assetDesignCurveType().should('not.exist');
  }
);

Cypress.Commands.add(
  'enterAnalogChannelDetailsPDC',
  (
    header,
    desc,
    dataSource,
    publishedComments,
    product,
    editProductName,
    group
  ) => {
    cy.server();
    cy.route('POST', routes.retrieveRtuListPrefixUrl).as('rtu');
    cy.route('POST', routes.retrievePublishedDCSearchListByComments).as(
      'sourceDC'
    );
    cy.route('POST', routes.retrieveSourceDCbyIdUrl).as('prodComponent');

    cy.findAllByText(header).should('be.visible');
    cy.analogChannelDesc().type(desc, { force: true });

    cy.get('[id="mui-component-select-dataSource"]')
      .should('have.text', 'RTU')
      .click();
    cy.levelDropdown(dataSource);

    cy.publishedComments().should('be.visible').type(publishedComments);
    cy.wait('@sourceDC').should('have.property', 'status', 200);
    cy.publishedComments().type('{downarrow}{enter}');

    cy.findAllByText('Source Domain', { timeout: 2000 }).should('exist');
    cy.findAllByText('Template', { timeout: 2000 }).should('exist');

    cy.get('[id="productId-input"]')
      .should('have.attr', 'placeholder', 'Enter Search Criteria...')
      .type(product);
    cy.wait(1000);
    cy.get('[id="productId-input"]').type('{downarrow}{enter}');

    cy.findAllByText('Edit').eq(1).click({ force: true });

    cy.wait('@prodComponent').should('have.property', 'status', 200);

    cy.findAllByText('Edit Product').should('be.visible');

    cy.productName()
      .clear({ force: true })
      .type(editProductName, { force: true });

    cy.productName()
      .invoke('val')
      .then((prod) => {
        prodName = prod;
        cy.log(prodName);
      });

    cy.productSaveAndClose();

    cy.get('[id="productId-input"]')
      .invoke('val')
      .then((prod) => {
        tankProdName = prod;
        cy.log('QT screen' + tankProdName);
        cy.log('product screen' + prodName);
        expect(tankProdName).to.be.equal(prodName);
      });

    cy.eventRuleGroup().should('have.text', 'Select').click();
    cy.levelDropdown(group);
  }
);

Cypress.Commands.add('verifyDeleteMsgPopup', () => {
  cy.findByText(
    'Please confirm that you wish to delete the following data channel(s):'
  ).should('be.visible');
});

Cypress.Commands.add('itemDeleted', (asset) => {
  cy.server();
  cy.route('POST', routes.deleteDataChannelUrl).as('assetDeleted');

  cy.get('[role="dialog"]').findByText(asset).click();

  cy.wait('@assetDeleted').should('have.property', 'status', 200);
});

Cypress.Commands.add('productSaveAndClose', () => {
  cy.server();
  cy.route('POST', routes.retrieveProductNameInfoByPrefix).as('product');

  cy.wait(1000);
  cy.findAllByText('Save & Close').eq(2).click({
    force: true,
  });

  cy.wait('@product').should('have.property', 'status', 200);
});

Cypress.Commands.add('deleteSelected', () => {
  cy.findByRole('button', { name: /delete selected/i }).click({ force: true });
});


Cypress.Commands.add('createAssetTank', (assetDescription, rtu) => {

  cy.verifyPageUrl('POST', routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
  cy.clickAddTankButton();
  cy.findAllByText('Add Tank Asset').should('be.visible');

  cy.enterQTDetailsForEdit(
    assetDescription,
    'Bulk Strata Ltd.',
    rtu,
    '0-11',
    '1',
    '0-200 PSI Sensor',
    '2'
  );

  cy.clickOnButton('Save & Close', routes.saveQuickAssetTankUrl);
  cy.clickAddButton('Exit', routes.retrieveAssetByOptionsUrl);

});


Cypress.Commands.add('deleteAsset', (assetDescription) => {

  cy.verifyPageUrl('POST', routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);

  cy.intercept('POST', routes.retrieveAssetByOptionsUrl).as('retrieveRecords');
  cy.get('[id="filterText-input"]').clear().type(assetDescription);
  cy.applyButton().click({force:true});
  cy.wait('@retrieveRecords').then(({ response }) => { expect(response.statusCode).to.eq(200) });
  cy.wait(2000);
  cy.deleteAssetByThreeDot('POST', routes.retrieveAssetByOptionsUrl, 'tbody [aria-label="Asset description"]', assetDescription);
  cy.verifyQTDeletedItem(assetDescription, 'No assets found');

});


Cypress.Commands.add('enterAssetAndGoToTheOperation', () => {
  cy.filtertext('H0000267')

})

Cypress.Commands.add('searchForAssetDetail', () => {
  cy.get('[title="TestAutomation-AP"]')
    .first()
    .click()
})

Cypress.Commands.add('clickOnRtu', () => {
  cy.intercept('GET', routes.goToGeneralInfo).as('wait')
  cy.get("p[title='H0000267']")
    .click()
  cy.wait('@wait').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('clickOnPollScheduleManager', () => {
  cy.get('[title="Poll Schedule"] > .MuiButtonBase-root')
    .click()
})

Cypress.Commands.add('getThePollName1', () => {
  cy.get('[class="MuiTypography-root MuiLink-root MuiLink-underlineNone MuiTypography-colorInherit"]')
    .first()
    .then(function ($pollName1) {
      const name1 = $pollName1.text()
      cy.wrap(name1).as('name1')
    })
})

Cypress.Commands.add('getThePollName2', () => {
  cy.get('[class="MuiTypography-root MuiLink-root MuiLink-underlineNone MuiTypography-colorInherit"]')
    .last()
    .then(function ($pollName2) {
      const name2 = $pollName2.text()
      cy.wrap(name2).as('name2')
    })
})

Cypress.Commands.add('goToSiteManager', () => {
  cy.get("div[title='Site'] a[role='button']")
    .click()
    .should('be.visible')
    .and('have.attr', 'aria-disabled', 'false')
})

Cypress.Commands.add('getSiteNumber1', () => {
  cy.contains('1238')
    .then(function ($SiteNumber1) {
      const site1 = $SiteNumber1.text()
      cy.wrap(site1).as('site1')
    })
})

Cypress.Commands.add('getSiteNumber2', () => {
  cy.contains('0000000000')
    .then(function ($SiteNumber2) {
      const site2 = $SiteNumber2.text()
      cy.wrap(site2).as('site2')
    })
})

Cypress.Commands.add('getSiteNumber3', () => {
  cy.contains('1235')
    .then(function ($SiteNumber3) {
      const site3 = $SiteNumber3.text()
      cy.wrap(site3).as('site3')
    })
})

Cypress.Commands.add('clickOnPencilIcon', () => {
  cy.get('[class = "MuiButton-label"]').eq(1).click();
})

Cypress.Commands.add('verifySideDrawerofGI', () => {
  cy.get('div[class^="MuiBox-root-"]').within(() => {
    cy.get('[title="General Information"]').invoke('text').then((text) => {
      expect(text.trim()).equal('General Information')
    })
  })
})

Cypress.Commands.add('addGenInfoDescription', () => {
  cy.get('#description-textbox')
    .clear()
    .click()
    .type("test")
})

Cypress.Commands.add('selectDispenser', () => {
  cy.get('[id="hornerRTUType-dropdown"]')
    .click()
  cy.get("ul[role='listbox'] > li:nth-of-type(3)")
    .click()
})

Cypress.Commands.add('clickOnSerial', () => {
  cy.get('[id="hornerModelType-dropdown"]')
    .click()
  cy.get("ul[role='listbox'] > li:nth-of-type(3)")
    .click()
})

Cypress.Commands.add('selectPoll', () => {
  cy.get('[id="rtuPollScheduleGroupId-dropdown"]')
    .click()
  cy.get("ul[role='listbox'] > li:first-of-type")
    .click()
})

Cypress.Commands.add('clearSite', () => {
  cy.get('[id="siteId-input"]').click()
  cy.get("button[title='Clear']").click()
  cy.contains('1235').click({ force: true })
})

Cypress.Commands.add('saveNClose', () => {
  cy.intercept('GET', routes.waitTillInfoOccur).as('info')
  cy.contains('Save & Close').click()
  cy.wait('@info').then(({ response }) => { expect(response.statusCode).to.eq(200) });

})

Cypress.Commands.add('verifyTheDeviceId', () => {
  cy.findAllByText("General Information").should("be.visible");
  cy.findAllByText('H0000267').should('have.text', 'H0000267')
})

Cypress.Commands.add('modifyDescription', () => {
  cy.get('#description-textbox')
    .clear({ force: true })
    .click({ force: true })
    .type("语言")
})

Cypress.Commands.add('verifyDropdownValues', () => {
  cy.get('[id="hornerRTUType-dropdown"]')
    .click()
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .should('have.text', 'Compressor')
  cy.get("ul[role='listbox'] > li:nth-of-type(3)")
    .should('have.text', 'Dispenser')
})

Cypress.Commands.add('codeForSkip', () => {
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .click()
  cy.contains('Save & Close').click()
  cy.get(".MuiAlert-message-2630").eq(1)
    .should('have.text', 'Unable to save')
})

Cypress.Commands.add('changeTheType', () => {
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .click()
    .should('have.text', 'Compressor')
})

Cypress.Commands.add('openModelDropdown', () => {
  cy.get('[id="hornerModelType-dropdown"]')
    .click()
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .should('have.text', 'IP')
  cy.get("ul[role='listbox'] > li:nth-of-type(3)")
    .should('have.text', 'Serial')
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .click()
})

Cypress.Commands.add('pollDropdownverify', () => {
  cy.get('[id="rtuPollScheduleGroupId-dropdown"]')
    .click()
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .then(function ($poll) {
      const pl = $poll.text()
      cy.wrap(pl).as('pl')
    })
})

Cypress.Commands.add('verifyPoll', () => {
  cy.get('@name1').then(pollName => {
    cy.get('@pl').then(poll => {
      expect(pollName).to.contain(poll)
    })
  })
})

Cypress.Commands.add('selectPollAgain', () => {
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .click()
})

Cypress.Commands.add('siteVerify', () => {
  cy.get('[id="siteId-input"]')
    .click()
  cy.contains('1235')
    .then(function ($s1) {
      const ss1 = $s1.text()
      cy.wrap(ss1).as('ss1')
    })
})

Cypress.Commands.add('verifySite', () => {
  cy.get('@site3').then(siteName => {
    cy.get('@ss1').then(site => {
      expect(site).to.include(siteName)
    })
  })
})

Cypress.Commands.add('addSite1238', () => {
  cy.get('[id="siteId-input"]')
    .as('as')
    .click()
  cy.get("button[title='Clear']").click()
  cy.get('@as').type('1238, AMIAG AG, HEINRICH-HILL-STR. E3, DE')
  cy.wait(1000)
  cy.contains('1238, AMIAG AG, HEINRICH-HILL-STR. E3, DE')
    .click()
})

Cypress.Commands.add('verifyAdress', () => {
  cy.get('[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-8"]')
    .eq(6)
    .should('have.text', 'AMIAG AG')
  cy.get('[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-8"]')
    .eq(7)
    .should('have.text', 'HEINRICH-HILL-STR. E3HATTINGEN, DE')
})

Cypress.Commands.add('verifyGeneralinformation', () => {
  cy.findAllByText("General Information").should("be.visible");
  cy.findAllByText('H0000267').should('be.visible')
  cy.findAllByText('语言').should('be.visible')
  cy.findAllByText('Compressor').should('be.visible')
  cy.findAllByText('IP').should('be.visible')
  cy.scrollTo('bottom')
  //cy.findAllByText('1238').should('be.visible')
  //cy.findAllByText('HEINRICH-HILL-STR. E3').should('be.visible')
})

Cypress.Commands.add('dateUpdated', (userCreated, timeoriginal, timeplus1) => {

  cy.get('.MuiTypography-body1').last().then(($span) => {
    const value = $span.text();
    const Data = value.split("by")
    var user = Data[1]
    var time = Data[0].split(':')
    var time1 = time[0] + ':' + time[1]
    expect(time1).to.be.oneOf([timeoriginal, timeplus1])
    expect(user).to.include(userCreated)
  })
})

Cypress.Commands.add('checkTheSiteResponse', () => {
  cy.findAllByText("1238").should("be.visible");
  cy.clickOnPencilIcon();
  cy.get('[id="siteId-input"]')
    .as('as')
    .click()
  cy.get("button[title='Clear']").click()
  cy.get('@as').type('0000000000, Mobile Site')
  cy.wait(1000)
  cy.contains('0000000000, Mobile Site')
    .click()
  cy.saveNClose()
  cy.findAllByText("0000000000").should("be.visible");
  //  cy.findAllByText('Mobile Site').should('be.visible');
})

Cypress.Commands.add('TestAutomationDomain', () => {
  cy.intercept('GET', routes.accesibleDomains).as('waitForDomainsLoad');
  cy.get('#domain-dropdown-button').click()
  cy.wait('@waitForDomainsLoad');
  cy.get('input[autocomplete="off"]').type('TestAutomation')
  cy.findAllByText('TestAutomation').click({ force: true })
})

Cypress.Commands.add('selectCompressor', () => {
  cy.get('[id="hornerRTUType-dropdown"]')
    .click()
  cy.get("ul[role='listbox'] > li:nth-of-type(2)")
    .click()
    .should('have.text', 'Compressor')
})

Cypress.Commands.add('selectAiChannel', () => {
  cy.intercept('GET', routes.retriveHornerTemplate).as('retrieveRecords');
  cy.findAllByText("Open AI Channel Editor")
    .click()
  cy.wait('@retrieveRecords').then(({ response }) => { expect(response.statusCode).to.eq(200) });
})

Cypress.Commands.add('selectTemplate', () => {

  cy.contains('Transaction Message Template').parent().next().click()
  cy.contains('automationTemplate').click()
  cy.findAllByText('Apply').click({force:true})
})

Cypress.Commands.add('appendWithCurrDate', () => {
  const todaysDate = moment().format('MMM DD, YYYY')
  const des = 'automationTemplate' + ' ' + todaysDate;
  cy.get("input[value='Running']")
    .clear()
    .type(des)
    .should('be.visible').invoke('attr', 'value').then(function ($temp1) {
      const tempt1 = $temp1
      cy.log(tempt1)
      cy.wrap(tempt1).as('tempt1')
    })
})

Cypress.Commands.add('rowValueCheck', () => {
  cy.get('[id="mui-component-select-channels.0.fieldType"]')
    .trigger('mousemove')
    .click().as('click')
  if ('@click' === "Integer") {
    cy.get('[data-value="Unsigned Integer"]')
      .click({ force: true }).invoke('attr', 'data-value').then(function ($row1) {
        const row1 = $row1
        cy.log(row1)
        cy.wrap(row1).as('row1')
      })
  } else {
    cy.get('[data-value="Integer"]')
      .click({ force: true }).invoke('attr', 'data-value').then(function ($row1) {
        const row1 = $row1
        cy.log(row1)
        cy.wrap(row1).as('row1')
      })
  }

})


Cypress.Commands.add('channelCheck', () => {
  cy.get('[id="mui-component-select-channels.0.channelNumber"]')
    .click({ force: true }).as('channel')
  if ('@channel' === 1) {
    cy.get('[data-value="1"]')
      .click({ force: true }).invoke('attr', 'data-value').then(function ($channel1) {
        const channel1 = $channel1
        cy.log(channel1)
        cy.wrap(channel1).as('channel1')
      })
  } else {
    cy.get('[data-value="2"]')
      .click({ force: true }).invoke('attr', 'data-value').then(function ($channel1) {
        const channel1 = $channel1
        cy.log(channel1)
        cy.wrap(channel1).as('channel1')
      })
  }
})

Cypress.Commands.add('rowCheck', () => {
  cy.get('[name="channels.0.rawMinimumValue"]')
    .trigger('mousemove')
    .click().as('row')
  if ('@row' === 0) {
    cy.get("@row")
      .clear()
      .type('0').invoke('attr', 'value').then(function ($rowcheck1) {
        const rowcheck1 = $rowcheck1
        cy.log(rowcheck1)
        cy.wrap(rowcheck1).as('rowcheck1')
      })
  } else {
    cy.get("@row")
      .clear()
      .type('1').invoke('attr', 'value').then(function ($rowcheck1) {
        const rowcheck1 = $rowcheck1
        cy.log(rowcheck1)
        cy.wrap(rowcheck1).as('rowcheck1')
      })
  }
})

Cypress.Commands.add('rowMaxCheck', () => {
  cy.get('[name="channels.0.rawMaximumValue"]')
    .trigger('mousemove')
    .click().as('rowMax')
  if ('@rowMax' === "32767") {
    cy.get("@rowMax")
      .clear()
      .type("32767").invoke('attr', 'value').then(function ($rowmincheck1) {
        const rowmincheck1 = $rowmincheck1
        cy.log(rowmincheck1)
        cy.wrap(rowmincheck1).as('rowmincheck1')
      })
  } else {
    cy.get("@rowMax")
      .clear()
      .type("32760").invoke('attr', 'value').then(function ($rowmincheck1) {
        const rowmincheck1 = $rowmincheck1
        cy.log(rowmincheck1)
        cy.wrap(rowmincheck1).as('rowmincheck1')
      })
  }
})

Cypress.Commands.add('scaledMinCheck', () => {
  cy.get('[name="channels.0.scaledMinimumValue"]')
    .trigger('mousemove')
    .click()
    .as('scaledMin')
  if ('@scaledMin' === 0) {
    cy.get("@scaledMin")
      .clear()
      .type('0').invoke('attr', 'value').then(function ($scaledMinCheck1) {
        const scaledMinCheck1 = $scaledMinCheck1
        cy.log(scaledMinCheck1)
        cy.wrap(scaledMinCheck1).as('scaledMinCheck1')
      })
  } else {
    cy.get("@scaledMin")
      .clear()
      .type('1').invoke('attr', 'value').then(function ($scaledMinCheck1) {
        const scaledMinCheck1 = $scaledMinCheck1
        cy.log(scaledMinCheck1)
        cy.wrap(scaledMinCheck1).as('scaledMinCheck1')
      })
  }
})

Cypress.Commands.add('scaledMaxCheck1', () => {
  cy.get('[name="channels.0.scaledMaximumValue"]')
    .trigger('mousemove')
    .clear()
    .as('scaledMax1')
  if ('@scaledMax1' === "10000") {
    cy.get("@scaledMax1", { timeout: 30000 })
      .type('9999').invoke('attr', 'value').then(function ($scaledMaxCheck1) {
        const scaledMaxCheck1 = $scaledMaxCheck1
        cy.log(scaledMaxCheck1)
        cy.wrap(scaledMaxCheck1).as('scaledMaxCheck1')
      })
  } else {
    cy.get("@scaledMax1", { timeout: 30000 })
      .type('10000').invoke('attr', 'value').then(function ($scaledMaxCheck1) {
        const scaledMaxCheck1 = $scaledMaxCheck1
        cy.log(scaledMaxCheck1)
        cy.wrap(scaledMaxCheck1).as('scaledMaxCheck1')
      })
  }
})

Cypress.Commands.add('uomChecker', () => {
  cy.get('[id="channels.0.unitOfMeasure"]')
    .trigger('mousemove')
    .click()
    .as('uom')
  if ('@uom' === 'null') {
    cy.get("@uom")
      .clear()
      .type('Time').invoke('attr', 'value').then(function ($uomChecker1) {
        const uomChecker1 = $uomChecker1
        cy.log(uomChecker1)
        cy.wrap(uomChecker1).as('uomChecker1')
      })
  } else {
    cy.get("@uom")
      .clear()
      .type('Counts').invoke('attr', 'value').then(function ($uomChecker1) {
        const uomChecker1 = $uomChecker1
        cy.log(uomChecker1)
        cy.wrap(uomChecker1).as('uomChecker1')
      })
  }
})

Cypress.Commands.add('decimalCheck', () => {
  cy.get('[name="channels.0.decimalPlaces"]')
    .trigger('mousemove')
    .click()
    .as('decimal')
  if ('@decimal' === 0) {
    cy.get("@decimal")
      .clear()
      .type('0').invoke('attr', 'value').then(function ($decimalCheck1) {
        const decimalCheck1 = $decimalCheck1
        cy.log(decimalCheck1)
        cy.wrap(decimalCheck1).as('decimalCheck1')
      })
  } else {
    cy.get("@decimal")
      .clear()
      .type('1').invoke('attr', 'value').then(function ($decimalCheck1) {
        const decimalCheck1 = $decimalCheck1
        cy.log(decimalCheck1)
        cy.wrap(decimalCheck1).as('decimalCheck1')
      })
  }
})

Cypress.Commands.add('row2Des', () => {
  cy.findAllByText('Add AI Channel').click({force:true});
  cy.get('[name="channels.1.fieldName"]')
    .clear()
    .type('Time')
    .should('be.visible').invoke('attr', 'value').then(function ($description2) {
      const description2 = $description2
      cy.log(description2)
      cy.wrap(description2).as('description2')
    })
})

Cypress.Commands.add('row2ValueCheck', () => {
  cy.get('[id="mui-component-select-channels.1.fieldType"]')
    .trigger('mousemove')
    .click()
  cy.get('[data-value="ReadingTime"]')
    .click().invoke('attr', 'data-value').then(function ($fieldType2) {
      const fieldType2 = $fieldType2
      cy.log(fieldType2)
      cy.wrap(fieldType2).as('fieldType2')
    })
})

Cypress.Commands.add('row2AddAiChannel', () => {
  cy.get('body').click(0, 0)
  cy.contains('[class="MuiGrid-root MuiGrid-item"]', 'Add AI Channel')
    .trigger('mousemove')
    .click()
})

Cypress.Commands.add('row3Des', () => {
  cy.get('[name="channels.2.fieldName"]')
    .clear()
    .type('Vehicle Temperature')
    .should('be.visible').invoke('attr', 'value').then(function ($description3) {
      const description3 = $description3
      cy.log(description3)
      cy.wrap(description3).as('description3')
    })
})

Cypress.Commands.add('row3ValueCheck', () => {
  cy.get('[id="mui-component-select-channels.2.fieldType"]')
    .trigger('mousemove')
    .click()
  cy.get('[data-value="Integer"]')
    .click().invoke('attr', 'data-value').then(function ($fieldtype3) {
      const fieldtype3 = $fieldtype3
      cy.log(fieldtype3)
      cy.wrap(fieldtype3).as('fieldtype3')
    })
})

Cypress.Commands.add('row3channelCheck', () => {
  cy.get('[id="mui-component-select-channels.2.channelNumber"]')
    .click()
  cy.get('[data-value="3"]')
    .click().invoke('attr', 'data-value').then(function ($channel3) {
      const channel3 = $channel3
      cy.log(channel3)
      cy.wrap(channel3).as('channel3')
    })
})


Cypress.Commands.add('row3Check', () => {
  cy.get('[name="channels.2.rawMinimumValue"]')
    .trigger('mousemove')
    .clear()
    .type('-904').invoke('attr', 'value').then(function ($rowMin3) {
      const rowMin3 = $rowMin3
      cy.log(rowMin3)
      cy.wrap(rowMin3).as('rowMin3')
    })
})

Cypress.Commands.add('row3MaxCheck', () => {
  cy.get('[name="channels.2.rawMaximumValue"]')
    .trigger('mousemove')
    .clear()
    .type('5720').invoke('attr', 'value').then(function ($rowMax3) {
      const rowMax3 = $rowMax3
      cy.log(rowMax3)
      cy.wrap(rowMax3).as('rowMax3')
    })
})

Cypress.Commands.add('row3ScaledMinCheck', () => {
  cy.get('[name="channels.2.scaledMinimumValue"]')
    .trigger('mousemove')
    .clear()
    .type('-68').invoke('attr', 'value').then(function ($scaledMin3) {
      const scaledMin3 = $scaledMin3
      cy.log(scaledMin3)
      cy.wrap(scaledMin3).as('scaledMin3')
    })
})

Cypress.Commands.add('row3ScaledMaxCheck', () => {
  cy.get('[name="channels.2.scaledMaximumValue"]')
    .trigger('mousemove')
    .clear()
    .type('300').invoke('attr', 'value').then(function ($scaledMax3) {
      const scaledMax3 = $scaledMax3
      cy.log(scaledMax3)
      cy.wrap(scaledMax3).as('scaledMax3')
    })
})

Cypress.Commands.add('row3UomChecker', () => {
  cy.get('[id="channels.2.unitOfMeasure"]')
    .trigger('mousemove')
    .click()
    .clear()
    .type('°C').invoke('attr', 'value').then(function ($Uom3) {
      const Uom3 = $Uom3
      cy.log(Uom3)
      cy.wrap(Uom3).as('Uom3')
    })
})

Cypress.Commands.add('row3DecimalCheck', () => {
  cy.get('[name="channels.2.decimalPlaces"]')
    .trigger('mousemove')
    .clear()
    .type('1').invoke('attr', 'value').then(function ($decimal3) {
      const decimal3 = $decimal3
      cy.log(decimal3)
      cy.wrap(decimal3).as('decimal3')
    })
})

Cypress.Commands.add('saveAsNewTemp', () => {
  cy.contains('.MuiButton-label', 'Save As New Template')
    .click()
})

Cypress.Commands.add('AddTempDes', () => {
  //cy.contains('Description').sibling('.MuiFormControl-root').click()
  cy.get("div[class='MuiDialogContent-root MuiDialogContent-dividers'] input[type='text']")
    .type('automationTemplate')
})

Cypress.Commands.add('Save', () => {
  cy.get('[class="MuiTouchRipple-root"]')
    .last()
    .click({ force: true })
})

Cypress.Commands.add('AddTempDesWithCurrDate', () => {
  const todaysDate = moment().format('MMM DD, YYYY')
  const des = 'automationTemplate' + ' ' + todaysDate;
  cy.get("div[class='MuiDialogContent-root MuiDialogContent-dividers'] input[type='text']")
    .clear()
    .type(des)

})

Cypress.Commands.add('cancelSave', () => {
  cy.get("button[aria-label='close'] span[class='MuiIconButton-label']")
    .click({ force: true })
})

Cypress.Commands.add('Apply', () => {
  cy.contains('.MuiButton-label', 'Apply').click({force:true})
})

Cypress.Commands.add('loadNewTemp', () => {
  const todaysDate = moment().format('MMM DD, YYYY')
  const des = 'automationTemplate' + ' ' + todaysDate;
  cy.contains('Transaction Message Template').parent().next().click()
  cy.get("ul.MuiList-root.MuiMenu-list.MuiList-padding>li").each(($el) => {
    const name = $el.text();
    if (name === des) {
      cy.contains(des).click({ force: true })
    }
  });
});

const newLoca = 'verifyDes';
Cypress.Commands.add(newLoca, () => {
  cy.get('@tempt1').then(tempt => {
    cy.get('@tempt1').then(tempt1 => {
      expect(tempt).to.contain(tempt1)
    })
  })
})

const newLocal = 'verifyFeilds';
Cypress.Commands.add(newLocal, () => {
  cy.get('@row1').then(row => {
    cy.get('@row1').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal1 = 'verifyRow';
Cypress.Commands.add(newLocal1, () => {
  cy.get('@channel1').then(channel1 => {
    cy.get('@channel1').then(channel11 => {
      expect(channel1).to.contain(channel11)
    })
  })
})

const newLocal2 = 'verifyChannel';
Cypress.Commands.add(newLocal2, () => {
  cy.get('@rowcheck1').then(rowcheck1 => {
    cy.get('@rowcheck1').then(rowcheck11 => {
      expect(rowcheck1).to.contain(rowcheck11)
    })
  })
})

const newLocal3 = 'verifyRowMin';
Cypress.Commands.add(newLocal3, () => {
  cy.get('@rowmincheck1').then(rowmincheck1 => {
    cy.get('@rowmincheck1').then(rowmincheck11 => {
      expect(rowmincheck1).to.contain(rowmincheck11)
    })
  })
})

const newLocal4 = 'verifyMinScaled';
Cypress.Commands.add(newLocal4, () => {
  cy.get('@scaledMinCheck1').then(scaledMinCheck1 => {
    cy.get('@scaledMinCheck1').then(scaledMinCheck11 => {
      expect(scaledMinCheck1).to.contain(scaledMinCheck11)
    })
  })
})

const newLocal5 = 'verifyMaxScaled';
Cypress.Commands.add(newLocal5, () => {
  cy.get('@scaledMaxCheck1').then(scaledMaxCheck1 => {
    cy.get('@scaledMaxCheck1').then(scaledMaxCheck11 => {
      expect(scaledMaxCheck1).to.contain(scaledMaxCheck11)
    })
  })
})

const newLocal6 = 'verifydecimalCheck1';
Cypress.Commands.add(newLocal6, () => {
  cy.get('@decimalCheck1').then(decimalCheck1 => {
    cy.get('@decimalCheck1').then(decimalCheck11 => {
      expect(decimalCheck1).to.contain(decimalCheck11)
    })
  })
})

const newLocal7 = 'verifyUOM';
Cypress.Commands.add(newLocal7, () => {
  cy.get('@uomChecker1').then(uomCheckerVerify => {
    cy.get('@uomChecker1').then(uomCheckerVerify1 => {
      expect(uomCheckerVerify).to.contain(uomCheckerVerify1)
    })
  })
})

const newLocal8 = 'verifyDes2';
Cypress.Commands.add(newLocal8, () => {
  cy.get('@description2').then(row => {
    cy.get('@description2').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal9 = 'verifyFieldType2';
Cypress.Commands.add(newLocal9, () => {
  cy.get('@fieldType2').then(row => {
    cy.get('@fieldType2').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal10 = 'verifyDes3';
Cypress.Commands.add(newLocal10, () => {
  cy.get('@description3').then(row => {
    cy.get('@description3').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal11 = 'verifyFieldType3';
Cypress.Commands.add(newLocal11, () => {
  cy.get('@fieldtype3').then(row => {
    cy.get('@fieldtype3').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal12 = 'verifyChannel3';
Cypress.Commands.add(newLocal12, () => {
  cy.get('@channel3').then(row => {
    cy.get('@channel3').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal13 = 'verifyRowMin3';
Cypress.Commands.add(newLocal13, () => {
  cy.get('@rowMin3').then(row => {
    cy.get('@rowMin3').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal14 = 'verifyRowMax3';
Cypress.Commands.add(newLocal14, () => {
  cy.get('@rowMax3').then(row => {
    cy.get('@rowMax3').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal15 = 'verifyscaledMin3';
Cypress.Commands.add(newLocal15, () => {
  cy.get('@scaledMin3').then(row => {
    cy.get('@scaledMin3').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal16 = 'verifyscaledMax3';
Cypress.Commands.add(newLocal16, () => {
  cy.get('@scaledMax3').then(row => {
    cy.get('@scaledMax3').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal17 = 'verifyUom3';
Cypress.Commands.add(newLocal17, () => {
  cy.get('@Uom3').then(row => {
    cy.get('@Uom3').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

const newLocal18 = 'verifydecimal3';
Cypress.Commands.add(newLocal18, () => {
  cy.get('@decimal3').then(row => {
    cy.get('@decimal3').then(prrow => {
      expect(row).to.contain(prrow)
    })
  })
})

Cypress.Commands.add('selectDispensor', () => {
  cy.get('[id="hornerRTUType-dropdown"]')
    .click()
  cy.contains('Dispenser').click()
    .should('have.text', 'Dispenser')
})

Cypress.Commands.add('selectTemp', () => {
  const des = 'abc';
  cy.contains('Transaction Message Template').parent().next().click()
  cy.get("div[id='menu-'] li").each(($el) => {
    const name = $el.text();
    if (name === des) {
      cy.contains(des).click({ force: true })
    }
  });
})

Cypress.Commands.add('uomValueCheck', () => {
  cy.get('[id="channels.0.unitOfMeasure"]').should('have.value', 'Counts')
  cy.get('[title="Clear"]').click({ force: true })
  cy.get('[id="channels.0.unitOfMeasure"]').should('have.value', '')
  cy.contains('UOM').click({ force: true })
  cy.get('[id="channels.0.unitOfMeasure"]').click({ force: true })
  cy.get('[id="channels.0.unitOfMeasure-option-0"]').click({ force: true })
  cy.get('[id="channels.0.unitOfMeasure"]').should('have.value', '%')
  cy.get('[aria-label="Clear"]').click({ force: true })
  cy.get('[id="channels.0.unitOfMeasure"]').should('have.value', '')
  cy.get('[id="channels.0.unitOfMeasure"]').type('Counts')
})

Cypress.Commands.add('saveEdit', () => {
  cy.get('[class="MuiTouchRipple-root"]')
    .eq(16)
    .click({ force: true })
})

Cypress.Commands.add('row2Des1', () => {
  cy.findAllByText('Add AI Channel').click({force:true});
  cy.get('[name="channels.1.fieldName"]')
    .click()
    .type('1')
    .should('be.visible')
})

Cypress.Commands.add('row2DesEdit', () => {
  cy.findAllByText('Add AI Channel').click({force:true});
  cy.get('[name="channels.1.fieldName"]')
    .type('{backspace}')
    .should('be.visible')
})

Cypress.Commands.add('deleteChannel', () => {
  cy.get('[id="channels.2.isRowSelected"]')
    .click()
  cy.contains('[class="MuiButton-label"]', 'Delete Selected')
    .trigger('mousemove')
    .click()
})