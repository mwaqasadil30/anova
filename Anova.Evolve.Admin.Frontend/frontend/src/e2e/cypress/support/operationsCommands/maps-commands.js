import '@testing-library/cypress/add-commands';
const routes = require('../../fixtures/routes.json');
const config = require('../../fixtures/example.json');

Cypress.Commands.add('mapsIcon', () => {
  cy.get('[aria-label="map nav"]', { timeout: 5000 });
});

Cypress.Commands.add('mapsTab', () => {
  cy.get('[aria-label="Filters"]');
});

Cypress.Commands.add('inventoryStateCell', () => {
  cy.get('[aria-label="Inventory State"]');
});

Cypress.Commands.add('percentFullCell', () => {
  cy.get('[aria-label="%Full"]');
});

Cypress.Commands.add('productCell', () => {
  cy.get('[aria-label="Product"]');
});

Cypress.Commands.add('readingTimeStampCell', () => {
  cy.get('[aria-label="Reading Time"]');
});

Cypress.Commands.add('readingValueCell', () => {
  cy.get('[aria-label="Reading"]');
});

//Locators for map side drawer

Cypress.Commands.add('dataChannelTypePanel', () => {
  cy.get('[aria-label="Data channel type"]');
});

Cypress.Commands.add('inventoryStatePanel', () => {
  cy.get('[aria-label="Importance level"]');
});

Cypress.Commands.add('dataChannelDetails', () => {
  cy.get('[aria-pressed="false"]');
});

Cypress.Commands.add('dataChannelValuePanel', () => {
  cy.get('[aria-label="Data channel level value"]');
});

Cypress.Commands.add('assetTitleHeader', () => {
  cy.get('[aria-label="Asset title"]');
});

Cypress.Commands.add('dataChannelTypeDrawer', () => {
  cy.get('[aria-label="Data Channel Type"]');
});

Cypress.Commands.add('detailsButton', () => {
  cy.get('[aria-label="Asset details"]');
});

Cypress.Commands.add('siteAddress', () => {
  cy.get('[aria-label="Site address details"]');
});

Cypress.Commands.add('siteLatitude', () => {
  cy.get('[aria-label="latitude"]');
});

Cypress.Commands.add('siteLongitude', () => {
  cy.get('[aria-label="longitude"]');
});

Cypress.Commands.add('timeZonePanel', () => {
  cy.get('[aria-label="Time zone"]');
});

Cypress.Commands.add('contact', () => {
  cy.get('[aria-label="Contact phone"]');
});

Cypress.Commands.add('siteNotes', () => {
  cy.get('[aria-label="Site notes"]');
});

Cypress.Commands.add('assetNotesPanel', () => {
  cy.get('[aria-label="Asset notes"]');
});

let recordCount;
Cypress.Commands.add('getPageCount', () => {
  cy.itemCount()
    .eq(0)
    .then(function (itemsCount) {
      const items = itemsCount.text();
      var count = items.split('f');
      recordCount = count[1].trim();
      cy.log('Records count:' + recordCount);
    })
    .then(() => {
      cy.log('Records count:' + recordCount);
    });
});

Cypress.Commands.add('verifyInventoryStateCount', (tabName) => {
  cy.wait(3000);
  cy.get('[role="tabpanel"] button',{timeout:10000}).each(($el) => {
    const tab = $el.text();
    if ($el.text().includes(tabName)) {
      expect(tab).to.include(recordCount);
    } else {
      expect(tab).to.include('0');
    }
  });
});

let assetTitle,
  inventoryState,
  percentFull,
  product,
  readingTimeStamp,
  readingValue;
Cypress.Commands.add('getAssetSummaryRecords', () => {
  cy.assetTitle()
    .first()
    .then((field) => {
      assetTitle = field.text();
    });

  cy.inventoryStateCell()
    .eq(1)
    .then((field) => {
      inventoryState = field.text();
    })
    .then(() => {
      cy.log('inventory state: ' + inventoryState);
    });

  cy.percentFullCell()
    .eq(1)
    .then((field) => {
      percentFull = field.text();
    });

  cy.productCell()
    .eq(1)
    .then((field) => {
      product = field.text();
    });

  cy.readingTimeStampCell()
    .eq(1)
    .then((field) => {
      readingTimeStamp = field.text();
    });

  cy.readingValueCell()
    .eq(1)
    .then((field) => {
      readingValue = field.text();
    });
});

Cypress.Commands.add('verifySideDrawerRecords', () => {
  cy.dataChannelTypePanel()
    .first()
    .then((field) => {
      const dcType = field.text();
      expect(dcType).to.include(product);
    });

  cy.inventoryStatePanel()
    .first()
    .then((field) => {
      const inventoryStatePanel = field.text();
      cy.log('inventory state: ' + inventoryState);

      if (inventoryState === 'Normal') {
        cy.inventoryStatePanel().first().should('have.text', '-');
      } else {
        expect(inventoryStatePanel).to.be.eq(inventoryState);
      }
    });

  cy.readingTimeStamp()
    .first()
    .then((field) => {
      const readingTimeStampPanel = field.text();
      expect(readingTimeStampPanel).to.be.eq(readingTimeStamp);
    });

  

  cy.dataChannelValuePanel()
    .first()
    .then((field) => {
      const dcValue = field.text();
      expect(dcValue).to.be.eq(percentFull);
    });
});

Cypress.Commands.add('verifyAssetSummarySidePanelRecords', (AssetTitle) => {
  cy.assetTitleHeader().then((field) => {
    const title = field.text();
    expect(title).to.be.eq(AssetTitle);
  });

  cy.dataChannelTypeDrawer().then((field) => {
    const dcType = field.text();
    expect(dcType).to.include(product);
  });

  cy.valueAndUnits().then((field) => {
    const valueUnits = field.text();
    expect(valueUnits).to.be.eq(readingValue);
  });

  if (inventoryState === 'Normal') {
    cy.inventoryStatePanel().should('not.exist');
  } else {
    cy.inventoryStatePanel().then((field) => {
      const inventoryStatePanel = field.text();
      expect(inventoryStatePanel).to.be.eq(inventoryState);
    });
  }

  cy.readingTimeStamp().then((field) => {
    const readingTimeStampPanel = field.text();
    expect(readingTimeStampPanel).to.be.eq(readingTimeStamp);
  });

  cy.dataChannelValuePanel().then((field) => {
    const dcValue = field.text();
    expect(dcValue).to.be.eq(percentFull);
  });
});

Cypress.Commands.add('openAssetPanelIfclosed', () => {
  cy.get('header').then(($body) => {
    if ($body.find('[id="vertical-panel-header"]').length > 0) {
      cy.get('[id="vertical-panel-header"]').should('contain', 'Assets').click({force:true})
    }
  });
});

let siteAddress,
  latitude,
  longitude,
  timeZonePanel,
  contact,
  siteNotes,
  assetNotesPanel;
Cypress.Commands.add('getAssetSummaryDetailsSideDrawerRecords', () => {

cy.openAssetPanelIfclosed();

  cy.siteAddress()
    .first()
    .then((field) => {
      siteAddress = field.text();
    });

  cy.siteLatitude()
    .first()
    .then((field) => {
      latitude = field.text();
    });

  cy.siteLongitude()
    .first()
    .then((field) => {
      longitude = field.text();
    });

  cy.timeZonePanel()
    .first()
    .then((field) => {
      timeZonePanel = field.text();
    });

  cy.contact()
    .first()
    .then((field) => {
      contact = field.text();
    });

  cy.siteNotes()
    .first()
    .then((field) => {
      siteNotes = field.text();
    });

  cy.assetNotesPanel()
    .first()
    .then((field) => {
      assetNotesPanel = field.text();
    });
});

Cypress.Commands.add('verifyAssetDetailsRecords', (AssetTitle) => {
  cy.pageHeader().then((title) => {
    const header = title.text();
    expect(header).to.be.eq(AssetTitle);
  });


  cy.dataChannelDetails().click();
  
  cy.dataChannelValuePanel()
    .eq(0)
    .then((field) => {
      const dcValue = field.text();
      expect(dcValue).to.be.eq(percentFull);
    });

  cy.dataChannelDescription()
    .first()
    .then((field) => {
      const dcDesc = field.text();
      expect(dcDesc).to.include(product);
    });
  cy.readingTimeStamp()
    .first()
    .then((field) => {
      const timeStamp = field.text();
      expect(timeStamp).to.be.eq(readingTimeStamp);
    });

  cy.valueAndUnits()
    .eq(0)
    .then((field) => {
      const valueAndUnits = field.text();
      expect(valueAndUnits).to.be.eq(readingValue);
    });

  cy.eventDescription()
    .eq(0)
    .then((field) => {
      const eventDescription = field.text();
      expect(eventDescription).to.be.eq(inventoryState);
    });

  // siteAddress
  // latitude
  // longitude
  // timeZone
  // contactPhone
  // siteNotes
  // assetNotes
});

Cypress.Commands.add(
  'createSingleRowGroup',
  (uniqueGroupDesc, header, filter1, logic1, value1) => {
    cy.viewAsset(
      '[href="/admin/asset-group-manager"]',
      'Asset Group Manager',
      routes.retrieveGroupByDomainUrl
    );
    cy.clickAddButton('Add Asset Group', routes.retrieveGroupEditByIdUrl);
    cy.displayTreeCheckbox().should('be.checked');
    cy.groupDescription().type(uniqueGroupDesc);

    cy.assetSelectionRowOne(header, filter1, logic1, value1);
    cy.selectUsers(config.groupUser);
    cy.clickAddButton('Save & Close', routes.retrieveGroupByDomainUrl);
    cy.findByText('Asset Group Manager').should('exist');
  }
);

Cypress.Commands.add(
  'assetSelectionRowOne',
  (header, filter1, logic1, value1) => {
    cy.findByText(header).should('exist');
    cy.searchFilter1().click({ force: true });
    cy.levelDropdown(filter1);
    cy.logic1().click({ force: true });
    cy.levelDropdown(logic1);
    cy.searchValue1().type(value1);
  }
);
