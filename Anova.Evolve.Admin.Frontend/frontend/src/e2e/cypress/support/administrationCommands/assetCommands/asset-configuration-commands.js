import '@testing-library/cypress/add-commands';
const routes = require('../../../fixtures/routes.json');

Cypress.Commands.add('filterByDD', () => {
  cy.get('[aria-haspopup="listbox"]').eq(0);
});

Cypress.Commands.add('assetIntegrationName', () => {
  cy.get('[name="asset.integrationName"]');
});

Cypress.Commands.add('groupByDD', () => {
  cy.get('[aria-haspopup="listbox"]').eq(1);
});

Cypress.Commands.add('verifyFilterByDDFields', () => {
  cy.get('[data-value="0"]').should('have.text', 'Asset Title');
  cy.get('[data-value="1"]').should('have.text', 'RTU');
});

Cypress.Commands.add('verifyGroupByDDFields', () => {
  cy.get('[data-value="2"]').should('have.text', 'None');
  cy.get('[data-value="1"]').should('have.text', 'Customer Name');
});

Cypress.Commands.add(
  'addAssetDetails',
  (description, type, ruleGroup, tech, integrationId, notes) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('site');

    cy.assetDescription().type(description);
    cy.assetType().should('be.visible').click();
    cy.verifyAssetTankDropdowns();
    cy.levelDropdown(type);

    cy.assetEventRuleGroup().should('be.visible').click();
    cy.levelDropdown(ruleGroup);

    cy.assetTechnician()
      .should('be.visible')
      .and('have.attr', 'type', 'text')
      .clear()
      .type(tech);

    cy.assetIntegrationName()
      .should('be.visible')
      .and('have.attr', 'type', 'text')
      .type(integrationId);

    cy.assetNotes().should('be.visible').type(notes);
  }
);

Cypress.Commands.add(
  'addAssetDetailsAllFields',
  (description, type, ruleGroup, tech, integrationId, site, geoArea, notes) => {
    cy.addAssetDetails(
      description,
      type,
      ruleGroup,
      tech,
      integrationId,
      notes
    );
    cy.quickTankSite().type(site);
    cy.wait('@site').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.wait(1000);
    cy.quickTankSite().type('{downarrow}{enter}');

    cy.get('[name="asset.isMobile"]')
      .click({ force: true });

    cy.get('[id="mui-component-select-asset.geoAreaGroupId"]')
      .should('be.visible')
      .click();
    cy.levelDropdown(geoArea);
  }
);

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

Cypress.Commands.add(
  'verifyAssetDetailAllFields',
  (
    header,
    type,
    description,
    eventGroup,
    tech,
    assetIntID,
    site,
    geoGroup,
    notes
  ) => {
    cy.verifyAssetDetails(
      header,
      type,
      description,
      eventGroup,
      tech,
      assetIntID,
      site,
      notes
    );

    cy.fetchDropdownFieldText(
      '[id="mui-component-select-asset.geoAreaGroupId"]',
      geoGroup
    );
  }
);

Cypress.Commands.add(
  'addAssetDetailAndEditSite',
  (description, type, ruleGroup, tech, integrationId, notes, site, text) => {
    cy.route('POST', routes.retrieveSiteByIdUrl).as('siteComponents');
    cy.route('POST', routes.saveSiteUrl).as('saveSite');

    cy.addAssetDetails(
      description,
      type,
      ruleGroup,
      tech,
      integrationId,
      notes
    );
    cy.quickTankSite().type(site);
    cy.wait('@site').then(({response})=> {expect(response.statusCode).to.eq(200)});
    cy.wait(3000);
    cy.quickTankSite().type('{downarrow}{enter}');
    cy.wait(1000);
    cy.tankSiteLabel().findByText('Edit').click();
    cy.wait('@siteComponents').should('have.property', 'status', 200);

    cy.findAllByText('Edit Site').should('be.visible');
    cy.customerName().clear({force:true}).type(text, {force:true});

    cy.clickOnBtnControl('Save & Close');
    cy.wait('@saveSite').should('have.property', 'status', 200);
  }
);

Cypress.Commands.add(
  'addAssetDetailWithDesignCurve',
  (description, type, ruleGroup, tech, integrationId, notes, curveType) => {
    cy.addAssetDetails(
      description,
      type,
      ruleGroup,
      tech,
      integrationId,
      notes
    );

    cy.assetDesignCurveType().should('be.visible').click();
    cy.levelDropdown(curveType);
  }
);

Cypress.Commands.add(
  'verifyAssetDetailsAndDesignCurve',
  (
    header,
    type,
    description,
    eventGroup,
    tech,
    assetIntID,
    site,
    notes,
    curveType
  ) => {
    cy.verifyAssetDetails(
      header,
      type,
      description,
      eventGroup,
      tech,
      assetIntID,
      site,
      notes,
      curveType
    );

    cy.fetchDropdownFieldText(
      '[id="mui-component-select-asset.designCurveType"]',
      curveType
    );
  }
);

Cypress.Commands.add('addSiteField', (site) => {
  cy.quickTankSite().type(site);
  cy.wait('@site').then(({response})=> {expect(response.statusCode).to.eq(200)});
  cy.wait(2000);
  cy.quickTankSite().type('{downarrow}{enter}');
});

Cypress.Commands.add('verifyAssetFieldsAreClear', () => {
  cy.assetDescription().should('have.text', '');
  cy.assetType().should('have.text', 'Tank');
  cy.assetEventRuleGroup().should('have.text', 'Select');
  cy.assetTechnician().should('have.text', '');
  cy.assetIntegrationName().should('have.text', '');
  cy.assetNotes().should('have.text', '');
  cy.quickTankSite().should('have.text', '');
  cy.get('[name="asset.isMobile"]').should('not.be.checked');
  cy.assetGeoAreaGroup().should('not.exist');
  cy.wait(1000);
});

Cypress.Commands.add('verifyGridFiltersWithPagination', (selector, rtu) => {
  cy.server();
  cy.route('POST', routes.retrieveAssetByOptionsUrl).as('records');

  cy.get('[aria-label="Pagination navigation"]')
    .first()
    .find('button')
    .its('length')
    .then((page) => {
      const buttons = Number(page) - 4;

      var i;
      for (i = 0; i < buttons; i++) {
        if (
          cy
            .get('[aria-label="Pagination navigation"]')
            .first()
            .find('button')
            .eq(i + 2)
            .should('be.enabled')
            .click({
              force: true,
            })
        ) {
          cy.wait(1000);
          cy.verifyGridFilters(selector, rtu);
        } else {
          cy.log('No page exists');
        }
      }
      cy.get('[aria-label="Pagination navigation"]')
        .first()
        .find('button')
        .eq(2)
        .click();
      cy.wait(1000);
    });
});

//Destination Domain
Cypress.Commands.add('destinationDomain', () => {
  cy.findByLabelText('Destination Domain *');
});

Cypress.Commands.add('clickOnRecordCheckBox', (locator, recordName) => {
  cy.get(locator).each(($el, index) => {
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

Cypress.Commands.add('enterDestinationDomain', (url, domain) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.destinationDomain().type(domain, { force: true });
  cy.wait(1000);
  cy.get('[type="text"]').type('{enter}');
  cy.closeDropdown();

  cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add('verifyAssetTransferTableDetails', (rtu, description) => {
  cy.get(
    '[aria-label="selected assets for transfer table" ] tbody tr td:nth-child(1)'
  ).then((desc) => {
    const descTxt = desc.text();
    expect(descTxt.includes(description)).to.be.true;
  });

  cy.get(
    '[aria-label="selected assets for transfer table" ] tbody tr td:nth-child(3)'
  ).then((item) => {
    const itemTxt = item.text();
    expect(itemTxt).to.equal(rtu);
  });
});

Cypress.Commands.add('selectTankAndProductForTransfer', () => {
  //Select event rule group
  cy.get('[id*="eventRuleGroupMappings"]').click();
  cy.levelDropdown('Create a Copy');

  cy.get('[id*="productMappings"]').click();
  cy.levelDropdown('Create a Copy');
});

Cypress.Commands.add('verifyAssetTransferedDetails', (rtu, description) => {
  cy.get(
    '[aria-label="transferred assets table"] tbody tr td:nth-child(1)'
  ).then((desc) => {
    const descTxt = desc.text();
    expect(descTxt.includes(description)).to.be.true;
  });

  cy.get(
    '[aria-label="transferred assets table"] tbody tr td:nth-child(3)'
  ).then((item) => {
    const itemTxt = item.text();
    expect(itemTxt).to.equal(rtu);
  });
});

Cypress.Commands.add('enterAssetInfoToCopy', (assetName, site, technician) => {
  cy.server();
  cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('site');

  cy.get('[id="targetDescription-input"]').type(assetName);
  cy.get('[id="targetSiteId-input"]').type(site);
  cy.wait('@site').should('have.property', 'status', 200);
  cy.wait(1000);
  cy.get('[id="targetSiteId-input"]').type('{downarrow}{enter}', {
    force: true,
  });

  cy.get('[id="targetTechnician-input"]').type(technician);
});

Cypress.Commands.add(
  'enterDataChannelsDetailsToCopy',
  (RTU, channel, notes) => {
    cy.server();
    cy.route('POST', routes.retrieveRtuListPrefixUrl).as('rtuRecords');

    cy.rtuNumberInputField(0).type(RTU);
    cy.wait('@rtuRecords').should('have.property', 'status', 200);
    cy.wait(1000);
    cy.rtuNumberInputField(0).type('{downarrow}{enter}' + { force: true });

    cy.get('[id="dataChannels[0].targetChannelNumber-input"]').click();
    cy.clickOnLevelDropdownList(channel);

    cy.get('[name="sameRtuForAll"]')
      .check({ force: true })
      .should('be.checked', { force: true });

    cy.verifyAllDataChannelPreFilledFields(RTU);

    cy.get('[name="targetNotes"]').type(notes);
  }
);

Cypress.Commands.add(
  'enterDataChannelsDetailsToCopyUnchecked',
  (RTU, channel, notes) => {
    cy.server();
    cy.route('POST', 'api/RetrieveRtuDeviceInfoListByPrefix').as('rtuRecords');

    cy.get('[name="sameRtuForAll"]').should('not.be.checked');
    cy.rtuNumberInputField(0).type(RTU);
    cy.wait('@rtuRecords').should('have.property', 'status', 200);
    cy.wait(1000);
    cy.rtuNumberInputField(0).type('{downarrow}{enter}');

    cy.get('[id="dataChannels[0].targetChannelNumber-input"]').click();
    cy.wait(1000);
    cy.clickOnLevelDropdownList(channel);
    cy.wait(1000);

    cy.rtuLevelInputField(1).then((rtuChannel) => {
      const rtuChannelTxt = rtuChannel.text();
      expect(toString(rtuChannelTxt)).to.equal(toString(''));
    });

    cy.get('[name="targetNotes"]').type(notes);
  }
);

Cypress.Commands.add('verifyAllDataChannelPreFilledFields', (RTU) => {
  cy.fetchInputFieldText('[id="dataChannels[1].targetDeviceId-input"]', RTU);
  cy.get('[id="dataChannels[1].targetChannelNumber-input"]').then(
    (rtuChannel) => {
      const rtuChannelTxt = rtuChannel.text();
      expect(rtuChannelTxt).not.to.be.empty;
    }
  );

  cy.fetchInputFieldText('[id="dataChannels[2].targetDeviceId-input"]', RTU);
});

Cypress.Commands.add(
  'enterAssetInfoToCopySiteEdit',
  (assetName, site, editSiteName, technician) => {
    cy.server();
    cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('site');
    cy.route('POST', routes.retrieveSiteByIdUrl).as('editSite');

    cy.get('[id="targetDescription-input"]').type(assetName);

    cy.get('[id="targetSiteId-input"]').type(site);
    cy.wait('@site').should('have.property', 'status', 200);
    cy.wait(2000);
    cy.get('[id="targetSiteId-input"]').type('{downarrow}{enter}');

    cy.findAllByText('Edit').click();
    cy.wait('@editSite').should('have.property', 'status', 200);
    cy.findAllByText('Edit Site').should('be.visible');

    cy.customerName()
      .clear({ force: true })
      .type(editSiteName, { force: true });

    cy.siteSaveAndExitOnAssetCopy();

    cy.get('[id="targetTechnician-input"]').type(technician);
  }
);

Cypress.Commands.add('enterAssetInformation', (assetName, technician) => {
  cy.get('[id="targetDescription-input"]').type(assetName);

  cy.get('[id="targetTechnician-input"]').type(technician);
});

Cypress.Commands.add('rtuNumberInputField', (index) => {
  cy.get(`[id="dataChannels[${index}].targetDeviceId-input"]`);
});

Cypress.Commands.add('rtuLevelInputField', (index) => {
  cy.get(`[id="dataChannels[${index}].targetChannelNumber-input"]`);
});

Cypress.Commands.add('siteSaveAndExitOnAssetCopy', () => {
  cy.server();
  cy.route('POST', routes.retrieveSiteRecordsOptionsUrl).as('site');

  cy.findAllByText('Save').eq(0).click({ force: true });
  cy.wait(1000);
  cy.findAllByText('Save & Exit').trigger('mouseover').click({ force: true });

  cy.wait('@site').should('have.property', 'status', 200);
});

Cypress.Commands.add(
  'enterSitesDetailsforCopy',
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

    cy.get('[name="notes"]').type('IT is a Test site #@$% 1234567890');

    cy.get('[name="isGeoCodeManual"]').check().should('be.checked');

    cy.get('input[name="latitude"]').should('be.enabled');

    cy.get('input[name="longitude"]').should('be.enabled');

    cy.findByText('Get Lat/Long').click({
      force: true,
    });
  }
);

Cypress.Commands.add('verifyRTUPopUps', (locator, noRtu, nestedRtu) => {
  cy.enterSearchField(routes.retrieveAssetByOptionsUrl, noRtu);
  cy.selectActionByThreeDot(
    locator,
    noRtu,
    'Transfer',
    routes.retrieveTransferAsset
  );
  cy.get('[role="dialog"]')
    .findAllByText(
      'There is no RTU association with the selected Asset(s). Asset Transfer is disabled.'
    )
    .should('exist');
  cy.clickOnButton('OK', 'api/RetrieveAssetInfoRecordsByOptions');

  cy.enterSearchField(routes.retrieveAssetByOptionsUrl, nestedRtu);
  cy.selectActionByThreeDot(
    locator,
    nestedRtu,
    'Transfer',
    routes.retrieveTransferAsset
  );
  cy.get('[role="dialog"]')
    .findAllByText(
      'Complex Nesting of Asset(s) and RTU(s) are detected. Asset Transfer is disabled.'
    )
    .should('exist');
  cy.clickOnButton('OK', 'api/RetrieveAssetInfoRecordsByOptions');
});

Cypress.Commands.add('verifyByDefaultTransferPageCheckbox', () => {
  //Checked boxes
  cy.get('[name="transferDataChannelReadings"]').should('be.checked');
  cy.get('[name="transferCustomPropertyValues"]').should('be.checked');
  cy.get('[name="deleteSourceTankDimensionIfNotUsed"]').should('be.checked');
  cy.get('[name="deleteSourceTankDimensionIfNotUsed"]').should('be.checked');

  //Unchecked boxes
  cy.get('[name="transferAssetNotes"]').should('not.be.checked');
  cy.get('[name="transferSiteNotes"]').should('not.be.checked');
  cy.get('[name="deleteSourceProductIfNotUsed"]').should('not.be.checked');
  cy.wait(3000);
});

//Add in commands
Cypress.Commands.add('clickOnLevelDropdownList', (levelChannel) => {
  cy.get('[role="listbox"]')
    .find('li')
    .each(($el, index, $list) => {
      if (
        $el.text().includes(levelChannel) &&
        ($el.text().includes('(in use)') || $el.text().includes('(not in use)'))
      ) {
        $el.click();
      } else {
        cy.log('The filter doesnt match the substring');
        cy.log($el.text());
      }
    });
});

Cypress.Commands.add('verifyDeletePopup', (assetName, action) => {
  cy.route('POST', routes.deleteAssetById).as('deleteAsset');
  cy.get('[role="dialog"]').findAllByText(assetName).should('be.visible');

  cy.findAllByText(action).click();
  cy.wait('@deleteAsset').should('have.property', 'status', 200);
});

Cypress.Commands.add(
  'selectDeleteByThreeDot',
  (locator, recordName, action, url) => {
    cy.get(locator).each(($el, index) => {
      cy.log($el.text());
      const name = $el.text();

      if (name === recordName) {
        cy.get('[aria-controls="asset options"]').eq(index).click({
          force: true,
        });
        cy.findAllByText(action).eq(index).should('be.visible').click({
          force: true,
        });
      }
    });
  }
);

Cypress.Commands.add('clickOnAsset', (asset) => {

  cy.intercept('POST', routes.retrieveAssetEditByIdUrl).as('edit');
  cy.intercept('POST', routes.retrieveAssetByOptionsUrl).as('retrieveAssets');
  
  cy.get('input[type="text"]').type(asset);
  cy.applyButton().click();
  cy.wait('@retrieveAssets').then(({response})=> {expect(response.statusCode).to.eq(200)})
  cy.wait(2000);

  cy.get('tbody [aria-label="Asset description"] a', { timeout: 4000 })
    .first()
    .click({ force: true });
  cy.wait('@edit').then(({response})=> {expect(response.statusCode).to.eq(200)})
});

Cypress.Commands.add('clickOnAppPickerMenuItems', (btn, url) => {
  cy.server();
  cy.route('POST', url).as('records');
  cy.get('[aria-labelledby="app-picker-button"]').findByText(btn).click({
    force: true,
  });
  cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add('clickOnAppPickerItems', (btn) => {
  cy.get('[aria-labelledby="app-picker-button"]', { timeout: 30000 })
    .findByText(btn)
    .click({
      force: true,
    });
});


Cypress.Commands.add('navigateToAssetConfigurationScreen', () => {

  cy.intercept('POST',routes.retrieveAssetByOptionsUrl).as('retrieveAssets');
  cy.applicationLaunchPanel().click();
  cy.findAllByText('Administration').click({
    force: true,
  });
  cy.wait('@retrieveAssets').then(({response})=> {expect(response.statusCode).to.eq(200)})
  cy.findAllByText('Asset Configuration Manager').should('be.visible');
  cy.url().should('include', 'admin/asset-configuration-manager');
  cy.assetNav().click();
  cy.get('[href="/admin/asset-configuration-manager"]').click();
  cy.findAllByText('Asset Configuration Manager').should('be.visible');

});


Cypress.Commands.add('clickOndeleteBtnBulkAction', (url) => {

  cy.server();
  cy.route('POST', url).as('deleteRecords');

  cy.get('[role="menu"] [role="button"]').should('be.visible').click();
  cy.verifyBulkActionsDropdownFields();
  cy.deleteFromBulkActionsDropdown('Delete');

  cy.get('[role="dialog"] p').then((dialogMsg)=>{
    const dialogTxt = dialogMsg.text();

    expect(dialogTxt.includes('Are you sure you would like to delete the following')).to.be.true;
  })
  cy.get('[role="dialog"]').findAllByText('Delete').click();
  cy.wait('@deleteRecords').should('have.property', 'status', 200);
});


Cypress.Commands.add('deleteAssetByThreeDot',(method,url,locator,recordName)=> {

  cy.server();
  cy.route(method, url).as('records');
  cy.route('POST', routes.deleteAssetById).as('deleteRecord');

  cy.get(locator).each(($el, index) => {
    cy.log($el.text());
    const name = $el.text();

    if (name === recordName) {
      cy.get('[aria-controls="asset options"]').eq(index).click({
        force: true,
      });

      cy.findByRole('presentation', { hidden: false })
        .findAllByText('Delete')
        .click({
          force: true,
        });

      cy.get('[role="dialog"]').findByText('Are you sure you would like to delete the following item?')
      cy.get('[role="dialog"] li').then((boxMsg)=>{
        const deletePopup = boxMsg.text();
        expect(deletePopup.includes(recordName)).to.be.true;
   });
       
       cy.get('[role="dialog"]').findAllByText('Delete').click();
       cy.wait('@deleteRecord').should('have.property', 'status', 200);
       cy.wait('@records').should('have.property', 'status', 200);
    }
  });

});
