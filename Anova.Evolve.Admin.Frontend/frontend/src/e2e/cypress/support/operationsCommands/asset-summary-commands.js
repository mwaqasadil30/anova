import '@testing-library/cypress/add-commands';
const routes = require('../../fixtures/routes.json');
import UtilFunctions from '../utils/UtilFunctions';
const utilFunctions = new UtilFunctions();

let assetName;

Cypress.Commands.add('AssetSummaryLoad', () => {
  cy.contains('Domain').should('be.visible')
})

Cypress.Commands.add('applicationLaunchPanel', () => {
  cy.get('[aria-label="app picker"]', { timeout: 10000 });
});

Cypress.Commands.add('verifyLogo', () => {
  cy.findByAltText('Logo').should('be.visible');
});

Cypress.Commands.add('assetTitle', () => {
  cy.get('[aria-label="Asset Title"] a');
});

Cypress.Commands.add('assetSummaryIcon', () => {
  cy.get('[aria-label="configure nav"]', { timeout: 15000 }).should('be.visible');
});

Cypress.Commands.add('assetSummaryIcon', () => {
  cy.get('[aria-label="configure nav"]', { timeout: 10000 });
});

Cypress.Commands.add('filterByDropdown', () => {
  cy.get('[aria-haspopup="listbox"]', { timeout: 5000 })
    .eq(0)
    .should('be.visible');
});

Cypress.Commands.add('groupByDropdown', () => {
  cy.get('[aria-labelledby="groupBy-input-label groupBy-input"]').should(
    'be.visible'
  );
});

Cypress.Commands.add('unitsDropdown', () => {
  cy.get('[id="units-input"]').should('be.visible');
});

Cypress.Commands.add('dataChannelDropdown', () => {
  cy.get('#dataChannel-input').should('be.visible');
});

Cypress.Commands.add('inventoryStatesDropdown', () => {
  cy.get('#inventoryStates-input').should('be.visible');
});

Cypress.Commands.add('checkBox', () => {
  cy.get('[type="checkbox"]');
});

Cypress.Commands.add('columnHeader', () => {
  cy.get('[role="columnheader"] span');
});

Cypress.Commands.add('sortDirectionIcon', () => {
  cy.get('[aria-label="Group by sort direction"]');
});

Cypress.Commands.add('assetSummaryTable', () => {
  cy.get('[aria-label="asset summary table"]', { timeout: 10000 });
});

Cypress.Commands.add('verifyFilterByDropdownFields', () => {
  cy.get('[data-value="1"]').should('be.visible').and('have.text', 'RTU');
  cy.get('[data-value="2"]').should('be.visible').and('have.text', 'FTP ID');
  cy.get('[data-value="3"]')
    .should('be.visible')
    .and('have.text', 'Asset Location');
  cy.get('[data-value="4"]').should('be.visible').and('have.text', 'Product');
  cy.get('[data-value="5"]')
    .should('be.visible')
    .and('have.text', 'Customer Name');
  cy.get('[data-value="6"]')
    .should('be.visible')
    .and('have.text', 'All Fields');
});

Cypress.Commands.add('selectDropdown', (text) => {
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

Cypress.Commands.add('enterName', (recordtext) => {
  cy.server().route('POST', routes.getAssetSummaryByOptionUrl).as('recordAssetWait');
  cy.searchField().clear().type(recordtext);
  cy.get('[class = "MuiButton-label"]')
    .contains('Apply')
    .click();
  cy.wait('@recordAssetWait').should('have.property', 'status', 200);
});

Cypress.Commands.add('verifyGridFilters', (locator, recordtext) => {
  cy.get(locator, { timeout: 20000 }).each(($el) => {
    const cellName = $el.text();
    console.log(cellName);
    console.log(recordtext);
    if (cellName.toLowerCase(recordtext)) {
      cy.log('The filter matches the substring');
    } else {
      cy.log('The filter doesnt match the substring');
      cy.log(cellName);
    }
  });
});

Cypress.Commands.add('verifyGroupByDropdownFields', () => {
  cy.get('[data-value="0"]').should('be.visible').and('have.text', 'Asset');
  cy.get('[data-value="1"]')
    .should('be.visible')
    .and('have.text', 'Customer Name');
  cy.get('[data-value="3"]').should('be.visible').and('have.text', 'None');
});

Cypress.Commands.add(
  'verifyIncludesFilters',
  (locator, recordtext, recordtext2) => {
    cy.get(locator).each(($el) => {
      const cellName = $el.text();
      console.log(cellName);
      console.log(recordtext);
      if (
        cellName.includes(recordtext) ||
        cellName.includes(recordtext) ||
        cellName.includes(recordtext2) ||
        cellName.includes('')
      ) {
        cy.log('The filter matches the substring');
      } else {
        cy.log('The filter doesnt match the substring');
        cy.log(cellName);
      }
    });
  }
);

Cypress.Commands.add('selectSpecificCheckBox', (text) => {
  cy.get('[role="listbox"]')
    .find('li')
    .each(($el, index) => {
      const level = $el.text();

      if (level === text) {
        cy.get('[type="checkbox"]')
          .eq(index)
          .click({
            force: true,
          });
      }
    });
});

Cypress.Commands.add(
  'verifyInventoryStateFilters',
  (locator, record1, record2, record3) => {
    cy.wait(2000);
    cy.get(locator).each(($el) => {
      const cellName = $el.text();
      console.log(cellName);
      if (
        cellName.toLowerCase(record1) ||
        cellName.toLowerCase(record2) ||
        cellName.toLowerCase(record3)
      ) {
        cy.log('The filter matches the substring');
      } else {
        cy.log('The filter doesnt match the substring');
        cy.log(cellName);
      }
    });
  }
);

Cypress.Commands.add('verifyAllFieldsFilters', (locator, recordtext) => {
  cy.get(locator).each(($el) => {
    const cellName = $el.text();
    if (cellName.includes(recordtext)) {
      cy.log('The filter matches the substring');
    } else {
      cy.log('substring matches the row');
      cy.log(cellName);
    }
  });
});

Cypress.Commands.add('verifyRTUData', (RTU) => {
  cy.get('[role="cell"][aria-label="RTU"]').then(($el) => {
    const rtu = $el.text();
    if (rtu.includes(RTU)) {
      cy.log('The filter matches the substring');
    } else {
      cy.log('The filter does not matches the substring');
    }
  });
});

Cypress.Commands.add('verifyFTPData', (FTP) => {
  cy.get('[role="cell"][aria-label="FTP ID"]').then(($el) => {
    const ftp = $el.text();
    if (ftp.includes(FTP)) {
      assert.isTrue(true, 'The filter matches the substring')
    } else {
      cy.log('The filter does not matches the substring');
    }
  });
});

Cypress.Commands.add('clickOnAssetSummaryColumn', (text) => {
  cy.server();
  cy.route('GET', routes.getAssetSummaryByOptionUrl).as('records');
  cy.columnHeader().each(($el) => {
    if ($el.text() === text) {
      $el.click();
      cy.wait('@records').should('have.property', 'status', 200);
    }
  });
  cy.wait(3000);
});

Cypress.Commands.add('clickOnGroupBySortFilterSymbol', () => {
  cy.server();
  cy.route('GET', routes.getAssetSummaryByOptionUrl).as('records');
  cy.sortDirectionIcon().click();
  cy.wait('@records').should('have.property', 'status', 200);
  // check downward symbol is visible now
  cy.sortDirectionIcon().should('be.visible');
});

Cypress.Commands.add('verifySortingArrowInColumn', (column, sort) => {
  cy.contains('[role="columnheader"]', column).should(
    'have.attr',
    'aria-sort',
    sort
  );
  cy.wait(4000);
});

Cypress.Commands.add('hoverAndclickOnAsset', () => {
  cy.server();
  cy.route('GET', routes.retrieveAssetDetailById).as('assetDetailWait');
  cy.wait(1000);
  cy.assetTitle().first().click({ force: true });
  cy.wait('@assetDetailWait').should('have.property', 'status', 200);
});

Cypress.Commands.add('openNav', () => {
  cy.get('[aria-label="Open nav popover"]').click({ force: true });
});

Cypress.Commands.add('selectNavItem', (description) => {
  cy.get('[aria-label="Nav item tabs"]')
    .contains('Favorites')
    .click({ force: true });
  cy.get('[aria-label="Favourite items nav"]')
    .contains(description)
    .click({ force: true });
});

Cypress.Commands.add('clickAddFavorite', () => {
  cy.findByRole('button', { name: /Add Favourite/i }).click({ force: true });
});

Cypress.Commands.add('clickFavourite', () => {
  cy.findByRole('button', { name: /Favourite/i }).click({ force: true });
});

Cypress.Commands.add('cancelFavoriteModal', () => {
  cy.findByRole('button', { name: /cancel/i }).click({ force: true });
});

Cypress.Commands.add('saveFavorite', () => {
  cy.findByRole('button', { name: /save/i }).click({ force: true });
});

Cypress.Commands.add('setDefaultFavourite', () => {
  cy.get('[role="dialog"]').get('[id="isDefaultFavorite-input"]').check();
});

Cypress.Commands.add('addFavourite', (description, val) => {
  cy.clickAddFavorite();
  cy.get('#description-input')
    .should('exist')
    .click({ force: true })
    .type(description);
  cy.get(
    '[class = "MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"]'
  ).should('contain', 'Set as default');

  if (val == 'checkSetDefault') {
    cy.get(
      '[class = "MuiTypography-root MuiFormControlLabel-label MuiTypography-body1"]'
    )
      .should('contain', 'Set as default')
      .click({ force: true });
    cy.saveFavorite();
  } else {
    cy.saveFavorite();
  }
});

Cypress.Commands.add('editFavourite', () => {
  cy.clickFavourite();
  cy.wait(750);
  cy.get('[class="MuiList-root MuiList-padding"]')
    .contains('Edit')
    .click({ force: true });
  cy.get('#description-input')
    .should('exist')
    .click({ force: true })
    .clear()
    .type('Edited Test Favourite');
  cy.saveFavorite();
});

Cypress.Commands.add('deleteFavourite', () => {
  cy.clickFavourite();
  cy.get('[class="MuiList-root MuiList-padding"]')
    .contains('Delete')
    .click({ force: true });
  cy.get('.MuiButton-label').contains('Delete').click({ force: true });
});

//----------- asset summary favs-------------

Cypress.Commands.add('navigationBar', () => {
  cy.get('[aria-label="Open nav popover"]', { timeout: 20000 });
});

Cypress.Commands.add('navBreadcrumb', () => {
  cy.get('[aria-label="nav breadcrumbs"]', { timeout: 20000 });
});

Cypress.Commands.add('clickOnTab', (tab) => {
  cy.get('[role="tablist"]')
    .find('button')
    .each(($el, index) => {
      const level = $el.text();

      if (level === tab) {
        cy.get('[role="tablist"]').find('button').eq(index).click({
          force: true,
        });
      }
    });
});

Cypress.Commands.add('verifyNavigationBarTabs', () => {
  cy.get('[role="tablist"] span').eq(0).should('have.text', 'Watch List');
  cy.get('[role="tablist"] span').eq(1).should('have.text', 'Favorites');
  cy.get('[role="tablist"] span').eq(2).should('have.text', 'Tree');
  cy.get('[role="tablist"] span').eq(3).should('have.text', 'Group');
});

Cypress.Commands.add('clickOnNavigationBarRecord', (record) => {
  cy.server();
  cy.route('GET', routes.getAssetSummaryByOptionUrl).as('assetOption');
  cy.get('[role="tabpanel"]')
    .find('[role="button"]')
    .each(($el, index) => {
      const level = $el.text();

      if (level === record) {
        cy.get('[role="tabpanel"]').find('[role="button"]').eq(index).click({
          force: true,
        });
        cy.wait('@assetOption').should('have.property', 'status', 200);
      }
    });
});

Cypress.Commands.add('selectAndVerifyRecordFromNavigationBarHeader', (url) => {
  cy.server();
  cy.route('POST', url).as('asset');
  cy.tabRecord()
    .eq(0)
    .then((asset) => {
      cy.tabRecord().eq(0).click({ force: true });
      cy.wait('@asset').should('have.property', 'status', 200);

      assetName = asset.text();
      cy.get('div h5').should('have.text', assetName);
    });
  cy.navBreadcrumb().then((asset) => {
    var assetNav = asset.text();
    expect(assetNav).to.be.equal(assetName);
  });
});

Cypress.Commands.add(
  'selectAndVerifyRecordFromNavigationBar',
  (assetUrl, optionUrl) => {
    cy.server();
    cy.route('POST', assetUrl).as('asset');
    cy.route('POST', optionUrl).as('option');
    cy.tabRecord()
      .eq(0)
      .then((asset) => {
        cy.tabRecord().eq(0).click({ force: true });
        cy.wait('@asset').should('have.property', 'status', 200);
        cy.wait('@option').should('have.property', 'status', 200);
        assetName = asset.text();
      });

    cy.get('@option').then((xhr) => {
      cy.itemCount().then(function (assetCount) {
        const asset = assetCount.text();
        var assetList = asset.split('of');
        assetList = assetList[1];
        expect(Number(assetList)).to.be.equal(xhr.response.body.count);
      });
    });

    cy.navBreadcrumb().then((asset) => {
      var assetNav = asset.text();
      expect(assetNav).to.be.equal(assetName);
    });
  }
);

Cypress.Commands.add('verifyItemCountWithAPI', (url) => {
  cy.server();
  cy.route('POST', url).as('option');
  cy.wait('@option').should('have.property', 'status', 200);
  cy.get('@option').then((xhr) => {
    cy.itemCount().then(function (assetCount) {
      const asset = assetCount.text();
      var assetList = asset.split('of');
      assetList = assetList[1];
      expect(Number(assetList)).to.be.equal(xhr.response.body.count);
    });
  });
});

Cypress.Commands.add('crossIcon', () => {
  cy.get('[class*="MuiPaper-outlined"] [class="MuiIconButton-label"]');
});

Cypress.Commands.add('tabRecord', () => {
  cy.get('[role="tabpanel"]').find('[role="button"]');
});

Cypress.Commands.add('verifyFavoritesPopUp', () => {
  cy.get('[id="description-input-label"]').then((name) => {
    const nameTxt = name.text();
    expect(nameTxt.includes('Name')).to.be.true;
  });
  cy.get('[role="dialog"]').findAllByText('Add Favourite').should('be.visible');
  cy.get('[role="dialog"]')
    .findAllByText('Set as default')
    .should('be.visible');
  cy.get('[role="dialog"]')
    .get('[id="isDefaultFavorite-input"]')
    .should('exist');
  cy.get('[role="dialog"]').findAllByText('Cancel').should('be.visible');
  cy.get('[role="dialog"]').findAllByText('Save').should('be.visible');
});

Cypress.Commands.add('verifyDeleteFavouritePopUp', (favName) => {

  cy.get('[role="dialog"]')
    .findAllByText(
      'Are you sure you want to remove "' + favName + '" from your Favourites?'
    )
    .should('be.visible');
  cy.get('[role="dialog"]').findAllByText('Cancel').should('be.visible');
  cy.get('[role="dialog"]').findAllByText('Delete').should('be.visible');
});

Cypress.Commands.add('verifyEditFavouritePopUp', (favName) => {
  cy.get('[role="dialog"]')
    .findAllByText('Edit Favourite')
    .should('be.visible');
  cy.get('[id="description-input"]').clear().type(favName);
  cy.get('[role="dialog"]').findAllByText('Cancel').should('be.visible');
  cy.get('[role="dialog"]').findAllByText('Save').should('be.visible');
});

Cypress.Commands.add('clearNavItem', () => {
  cy.get('[aria-label="Clear nav item"]');
});

Cypress.Commands.add('favouriteAssetName', () => {
  cy.get('[id="description-input"]');
});

Cypress.Commands.add('selectFavItemFromNavigationBar', (assetName, url) => {
  cy.server();
  cy.route('POST', url).as('retrieveAssets');

  cy.get('[aria-label="Favourite item title"]').each(($el, index) => {
    const favText = $el.text();

    if (favText === assetName) {
      cy.get('[aria-label="Favourite item title"]')
        .eq(index)
        .click({ force: true });
      return false;
    }
  });
  cy.wait('@retrieveAssets').should('have.property', 'status', 200);

  cy.navBreadcrumb().then((asset) => {
    var assetNav = asset.text();
    expect(assetNav).to.be.equal(assetName);
  });
});

Cypress.Commands.add('verifyAndSelectDefaultFavourite', (assetName, url) => {
  cy.server();
  cy.route('POST', url).as('retrieveAssets');

  cy.get('[aria-label="Favourite item title"]').each(($el, index) => {
    const favText = $el.text();

    if (favText === assetName) {
      cy.get('[aria-label="Favourite item title"]')
        .eq(index)
        .click({ force: true });

      return false;
    }
  });

  cy.navBreadcrumb().then((asset) => {
    var assetNav = asset.text();
    expect(assetNav).to.be.equal(assetName);
  });
});

Cypress.Commands.add('clearNavItemIfVisibleOnEvents', () => {
  cy.get('header').then(($body) => {
    if ($body.find('[aria-label="Clear nav item"]').length > 0) {
      cy.get('[aria-label="Clear nav item"]').click({ force: true });
      cy.eventIcon().click();
      cy.get('[aria-label="Clear nav item"]', { timeout: 20000 }).should('not.exist');
    }
  });
});

Cypress.Commands.add('clearNavItemIfVisible', () => {
  cy.get('header').then(($body) => {
    if ($body.find('[aria-label="Clear nav item"]').length > 0) {
      cy.get('[aria-label="Clear nav item"]').click({ force: true });
    }
  });
});

Cypress.Commands.add(
  'IfAssetsExistVerifyFilter',
  (customerNameSelector, customerName) => {
    cy.get('body').then(($body) => {
      if ($body.find('tbody tr').length > 0) {
        cy.verifyGridFilters(customerNameSelector, customerName);
      }
    });
  }
);

Cypress.Commands.add('fetchInputFieldText', (locator, text) => {
  cy.get(locator).should(($input) => {
    const val = $input.val().toString().toLowerCase();
    expect(val).to.include(text.toString().toLowerCase());
  });
});

Cypress.Commands.add('deselectAllInListbox', (locator) => {
  cy.get(locator).then(($el) => {
    const btnTxt = $el.text();
    if (btnTxt.includes('Deselect All')) {
      cy.get(locator).click({ force: true });
      cy.get(locator).should('have.text', 'Select All');
    } else if (btnTxt.includes('Select All')) {
      cy.get(locator).click({ force: true });
      cy.get(locator)
        .should('have.text', 'Deselect All')
        .click({ force: true });
    }
  });
});

Cypress.Commands.add(
  'createGroup',
  (uniqueGroupDesc, groupUser, isPublishGroup) => {
    cy.viewAsset(
      '[href="/admin/asset-group-manager"]',
      'Asset Group Manager',
      routes.retrieveGroupByDomainUrl
    );
    utilFunctions.itemsCountBefore();

    cy.clickAddButton('Add Asset Group', routes.retrieveGroupEditByIdUrl);
    cy.displayTreeCheckbox().should('be.checked');
    cy.groupDescription().type(uniqueGroupDesc);

    if (isPublishGroup == 'true') {
      cy.enterAssetSelectionCriteriaEqualCase(
        'Add Asset Group',
        'Country',
        '=',
        'Canada',
        'And',
        'City',
        '=',
        'Oakville',
        groupUser
      );
      cy.closeDropdown();
      cy.get('[aria-labelledby="mui-component-select-random"]').eq(1).click();
      cy.get('[class="MuiList-root MuiMenu-list MuiList-padding"]')
        .contains('dolv3qa')
        .click({ force: true });
      cy.get('span').contains('Publish').click({ force: true });
    } else if (isPublishGroup == 'false') {
      cy.enterAssetSelectionCriteriaEqualCase(
        'Add Asset Group',
        'Country',
        '=',
        'United States',
        'And',
        'City',
        '=',
        'Blackwood',
        groupUser
      );
      cy.closeDropdown();
    }

    cy.clickAddButton('Save & Close', routes.retrieveGroupByDomainUrl);
    cy.findByText('Asset Group Manager').should('exist');
  }
);

Cypress.Commands.add('createTree', (uniqueTreeDesc) => {
  cy.viewAsset('[href="/admin/asset-tree-manager"]', 'Asset Tree Manager', routes.retrieveTreeByDomainUrl);
  cy.clickAddButton('Add Asset Tree', routes.retrieveTreeEditComponentsUrl);
  cy.enterTreeDetails(
    uniqueTreeDesc,
    'Country',
    'State or Province',
    'City',
    'Customer Name'
  );

  cy.dataChannelTypeDropdown().click({ force: true });
  cy.findByText('Deselect All')
    .click({ force: true })
    .should('have.text', 'Select All');
  cy.dataChannelTypeDropdown().should('have.text', 'None');
  cy.closeDropdown();
  cy.clickAddButton('Save & Close', routes.retrieveTreeByDomainUrl);
  cy.findByText('Asset Tree Manager').should('exist');
});

Cypress.Commands.add('selectGroup', (assetName) => {
  cy.get('[aria-label="Asset group item title"]')
    .contains(assetName)
    .click({ force: true });
});

Cypress.Commands.add('selectTree', (assetName) => {
  cy.get('[aria-label="Asset tree item title"]')
    .contains(assetName)
    .click({ force: true });
});

Cypress.Commands.add('tearGroup', (uniqueGroupDesc) => {
  cy.applicationLaunchPanel().click();
  cy.findAllByText('Administration').click({ force: true });
  cy.viewAsset('[href="/admin/asset-group-manager"]', 'Asset Group Manager', routes.retrieveGroupByDomainUrl);
  cy.deleteObjectByThreeDot('POST', routes.retrieveGroupByDomainUrl, 'tbody [aria-label="Description"]', uniqueGroupDesc);
  cy.verifyDeletedItem(uniqueGroupDesc, 'No asset groups found');
});

Cypress.Commands.add('tearTree', (uniqueTreeDesc) => {
  cy.wait(3000);
  cy.route('POST', routes.retrieveAssetByOptionsUrl).as('retAsset');
  cy.applicationLaunchPanel().click({ force: true });
  cy.findAllByText('Administration').click({ force: true });
  cy.wait('@retAsset').should('have.property', 'status', 200);
  cy.viewAsset('[href="/admin/asset-tree-manager"]', 'Asset Tree Manager', routes.retrieveTreeByDomainUrl);
  cy.deleteRecordByThreeDot(uniqueTreeDesc, routes.retrieveTreeByDomainUrl);
  cy.verifyTreeDeleted(uniqueTreeDesc);
});


