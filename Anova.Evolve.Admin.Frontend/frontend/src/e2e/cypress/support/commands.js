import '@testing-library/cypress/add-commands';
const routes = require('../fixtures/routes.json');
const example = require('../fixtures/example.json');

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// **********************************************

import '@4tw/cypress-drag-drop';
// Finally add the custom command

Cypress.Commands.add('waitProgressBarToDisappear', () => {
  cy.get('[role="progressbar"]', { timeout: 90000 }).should('not.exist');
});

Cypress.Commands.add('goToAssetSummary', () => {
  cy.get('[id="app-picker-button"]').click()
  cy.get('[href="/ops"]').last().click()
})

Cypress.Commands.add('username', () => {
  cy.get('input[name="username"]', { timeout: 20000 });
});

Cypress.Commands.add('password', () => {
  cy.get('input[name="password"]', { timeout: 20000 });
});

Cypress.Commands.add('submitButton', () => {
  cy.get('[type="submit"]', { timeout: 15000 });
});

Cypress.Commands.add('pageHeader', () => {
  cy.get('[aria-label="Page header"]');
});

Cypress.Commands.add('collapseSideNav', () => {
  cy.get('[aria-label="Collapse side nav"]').click({ force: true });
});

Cypress.Commands.add('assetNav', () => {
  cy.get('[aria-label="configure nav"]');
});

Cypress.Commands.add('recordName', () => {
  cy.get('tbody [aria-label="Name"]', { timeout: 15000 });
});

Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  if (url) {
    url = Cypress.config('baseUrl') + url;
  } else {
    url = Cypress.config('baseUrl');
  }
  return originalFn(url, options);
});

Cypress.Commands.add('login', () => {
  cy.loginApp()
});

Cypress.Commands.add('loginApp', () => {
  cy.server();
  cy.route('POST', routes.authenticateAppUrl).as('authentication');
  cy.route('GET', routes.authenticateProfile).as('userProfile');

  // cy.visit(Cypress.config('url') + '/login');
  cy.visit("/login");
  cy.username().type(Cypress.env('USERNAME'));
  cy.findAllByText('Next').click();
  cy.wait('@userProfile').should('have.property', 'status', 200);
  cy.password().type(Cypress.env('PASS'));
  cy.get('[type="submit"]').click();
  cy.wait('@authentication').should('have.property', 'status', 200);

  cy.waitProgressBarToDisappear();

  cy.get('body').then(($body) => {
    if ($body.find('[role="dialog"]').length > 0) {
      cy.get('span').contains('Start using Transcend').click({ force: true });
    }
  });
  cy.saveLocalStorage();
});

Cypress.Commands.add('loginSuperUser', () => {
  cy.server();
  cy.route('POST', routes.authenticateAppUrl).as('authentication');
  cy.route('GET', routes.authenticateProfile).as('userProfile');

  // cy.visit(Cypress.config('url') + '/login');
  cy.visit("/login");
  cy.username().type(Cypress.env('SUPERUSER'))
  cy.findAllByText('Next').click();
  cy.wait('@userProfile').should('have.property', 'status', 200);
  cy.password().type(Cypress.env('SUPERPASS'))
  cy.get('[type="submit"]').click();
  cy.wait('@authentication').should('have.property', 'status', 200);

  cy.waitProgressBarToDisappear();

  cy.get('body').then(($body) => {
    if ($body.find('[role="dialog"]').length > 0) {
      cy.get('span').contains('Start using Transcend').click({ force: true });
    }
  });
  cy.saveLocalStorage();
});

Cypress.Commands.add('temporaryLogin', () => {
  cy.server();
  cy.route('POST', routes.authenticateAppUrl).as('authentication');
  cy.route('GET', routes.authenticateProfile).as('userProfile');

  cy.visit("/login");
  cy.username().type(Cypress.env('USERNAME'));
  cy.findAllByText('Next').click();
  cy.wait('@userProfile').should('have.property', 'status', 200);
  cy.password().type(Cypress.env('PASS'));
  cy.get('[type="submit"]').click();
  cy.saveLocalStorage();
});


Cypress.Commands.add('checkForWelcomeAlert', () => {
  cy.get('body').then(($body) => {
    if ($body.find('[role="dialog"]').length > 0) {
      cy.get('span').contains('Start using Transcend').click({ force: true });
    }
  });
});

Cypress.Commands.add('verifyLogin', () => {
  cy.get('body').then(($body) => {

    if ($body.find('[role="dialog"]').length > 0) {
      cy.get('span').contains('Start using Transcend').click({ force: true });
    }

    if ($body.find('[id = "user-avatar-button"]').length > 0) {
      cy.get('[id = "user-avatar-button"]').click();
      cy.get('[role = "menuitem"]').contains("Logout").click();

    }
  })
});

Cypress.Commands.add('verifyPageUrl', (method, url, webUrl) => {
  cy.restoreLocalStorage();
  cy.url().then(($currentUrl) => {
    if (!($currentUrl === Cypress.config('baseUrl') + url)) {
      cy.server();
      cy.route(method, webUrl).as('records');
      cy.visit(url);
      cy.wait('@records').should('have.property', 'status', 200);
    } else {
      cy.log('User is at the manager screen');
    }
  });
});



Cypress.Commands.add('superLogin', (domain) => {
  cy.server();
  cy.route('POST', routes.authenticateAppUrl).as('authentication');
  cy.visit();
  cy.get('input[name="username"]', { timeout: 20000 }).type(
    Cypress.env('USERNAME')
  );
  cy.get('input[name="password"]', { timeout: 20000 }).type(
    Cypress.env('PASS')
  );
  cy.get('[type="submit"]').click();
  cy.wait('@authentication').should('have.property', 'status', 200);
  cy.waitProgressBarToDisappear();
  cy.changeDomain(domain);
  cy.waitProgressBarToDisappear();
  cy.wait(1500);
  cy.saveLocalStorage();
  cy.get('body').then(($body) => {
    if ($body.find('[role="dialog"]').length > 0) {
      cy.get('[role="dialog"]')
        .find('[type="checkbox"]')
        .click({ force: true });
      cy.get('span').contains('Start using Transcend').click({ force: true });
    } else {
      cy.log('Welcome to Anova Transcend');
    }
  });
});

Cypress.Commands.add('changeDomain', (domain) => {
  cy.server();
  cy.route('POST', routes.retrieveDomainApplicationInfoById).as('records');
  cy.wait(3000);
  cy.get('[id="domain-dropdown-button"]', { timeout: 5000 }).click({
    force: true,
  });
  cy.get(
    '[aria-labelledby="domain-dropdown-button"] [type="text"]'
  ).type(domain + '{enter}', { force: true });
  cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add('logout', () => {
  cy.get('[id="user-avatar-button"]').click();
  cy.findByText('Logout').click();
});

Cypress.Commands.add('clickButton', (btn) => {
  cy.wait(1000);
  cy.get('span')
    .contains(btn)
    .should('be.visible')
    .trigger('mouseover', { force: true })
    .click({ force: true });
});

Cypress.Commands.add('clickOnBtnControl', (btn) => {
  cy.wait(1000);
  cy.findAllByText(btn).eq(1).click({ force: true });
});

Cypress.Commands.add('clickAddButton', (btn, url) => {
  cy.server();
  cy.route('POST', url).as('addSite');
  cy.wait(1000);
  cy.findAllByText(btn).should('exist').click({
    force: true,
  });
  cy.wait(1000);
  cy.wait('@addSite').should('have.property', 'status', 200);
});
Cypress.Commands.add('clickCancelButton', (url) => {
  cy.server();
  cy.route('POST', url).as('retrieveRecords');

  cy.findAllByText('Cancel').should('be.visible').click({ force: true });

  cy.wait('@retrieveRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('verifySaveDropdown', (btn) => {
  cy.clickButton(btn);
  cy.findAllByText('Save & Exit').should('be.visible');
  cy.findAllByText('Save').eq(1).should('be.visible');
});

Cypress.Commands.add('clickSaveDropdown', (url) => {
  cy.server();
  cy.route('POST', url).as('saveRecords');
  cy.findAllByText('Save').eq(1).should('be.visible').click();
  cy.wait('@saveRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('clickEmptyScreenSaveDropdown', () => {
  cy.findAllByText('Save').eq(1).should('be.visible').click({ force: true });
  cy.wait(2000);
});

Cypress.Commands.add('clickSaveCloseBtn', (url) => {
  cy.server();
  cy.route('POST', url).as('retrieveRecords');
  cy.findAllByText('Save & Close').should('be.visible').click();
  cy.wait('@retrieveRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('goBack', (method, url) => {
  cy.server().route(method, url).as('retrieveRecords');
  cy.go('back');
  cy.wait('@retrieveRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('backButton', (url) => {
  cy.server();
  cy.route('POST', url).as('retrieveRecords');
  cy.go('back');
  cy.wait('@retrieveRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('itemCount', () => {
  cy.get('[aria-label="Item count"]', { timeout: 20000 });
});

Cypress.Commands.add('viewAsset', (asset, header, url) => {
  cy.server();
  cy.route('POST', url).as('records');
  cy.assetNav().click();
  cy.wait(1000);
  cy.get(asset, { timeout: 5000 }).click({ force: true });
  cy.wait('@records').should('have.property', 'status', 200);
  cy.findByText(header).should('exist');
});

Cypress.Commands.add('getProductItemsListCountVerified', () => {
  //Fetching length of all the rows in Product page and verifying it
  cy.get("tbody[role='rowgroup']")
    .find('tr')
    .then((listing) => {
      const listingCount = Cypress.$(listing).length;
      expect(listing).to.have.length(listingCount);

      cy.get('[aria-label="Item count"]')
        .eq(0)
        .then((productItems) => {
          const product = productItems.text();
          var productList = product.split(' ');
          productList = productList[0].trim();
          expect(Number(productList)).to.eq(listingCount);
        });
    });
});

Cypress.Commands.add('productItemsCountBefore', () => {
  cy.get("tbody[role='rowgroup']")
    .find('tr')
    .then((listing) => {
      productItems = Cypress.$(listing).length;
      this.productItems = productItems;
    });
});

Cypress.Commands.add('verifyProductsCountAfter', () => {
  cy.wait(2000);
  cy.get("tbody[role='rowgroup']")
    .find('tr')
    .then((listing) => {
      const listingCount = Cypress.$(listing).length;
      expect(listingCount).to.be.equal(Number(this.productItems) + 1);
    });
});

Cypress.Commands.add('clickOnRecordName', (productName) => {
  cy.recordName().each(($el, index) => {
    const name = $el.text();
    if (name === productName) {
      cy.recordName().eq(index).click();
      return false;
    }
  });
});

Cypress.Commands.add('verifyFilterScenarios', (filterTxt) => {
  cy.searchField().clear().type(filterTxt);
  cy.applyButton().click();

  cy.get('tbody [aria-label="Name"]').each(($el) => {
    const prodTxt = $el.text();
    if (prodTxt.toLowerCase(filterTxt)) {
      expect(true).to.be.true;
      cy.log('The filter matches the substring');
    } else {
      cy.log('The filter doesnt match the substring');
      cy.log(prodTxt);
    }
  });
});

Cypress.Commands.add('deleteRecord', (recordName) => {
  cy.recordName().each(($el, index) => {
    const name = $el.text();
    cy.log('Record Name' + recordName);
    cy.log('Name' + name);
    if (name === recordName) {
      cy.get('input[type="checkbox"]')
        .eq(index + 1)
        .click({
          force: true,
        });
    }
  });
});

Cypress.Commands.add('deleteSelectedButton', (url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.findByRole('button', { name: /delete selected/i }).click({ force: true });
  // cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add('deleteSelectedButtonForTree', (url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.findByRole('button', { name: /delete selected/i }).click({ force: true });
  cy.wait(1000);
  cy.findAllByText('Delete')
    .click({ force: true, multiple: true });
  cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add('verifyDeletedItem', (recordName, message) => {
  cy.searchField().clear().type(recordName);
  cy.applyButton().click({ force: true });
  cy.wait(1000);

  cy.get('tr')
    .its('length')
    .then((len) => {
      cy.log(Number(len));

      if (len > 1) {
        cy.recordName().each(($el) => {
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

Cypress.Commands.add('searchField', () => {
  cy.get('[id="filterText-input"]');
});

Cypress.Commands.add('applyButton', () => {
  cy.get('span').contains('Apply');
});

Cypress.Commands.add('deleteRecordByThreeDot', (recordName, url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.get('[aria-label="Name"] a').each(($el, index) => {
    cy.log($el.text());
    const name = $el.text();

    if (name === recordName) {
      cy.get('[aria-label="Actions button"]').eq(index).click({
        force: true,
      });

      cy.findByRole('presentation', { hidden: false })
        .findAllByText('Delete')
        .click({
          force: true,
        });

      // cy.wait('@records').should('have.property', 'status', 200);
    }
  });
});

Cypress.Commands.add('deleteRecordByThreeDotForTree', (recordName, url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.get('[aria-label="Name"] a').each(($el, index) => {
    cy.log($el.text());
    const name = $el.text();

    if (name === recordName) {
      cy.get('[aria-label="Actions button"]').eq(index).click({
        force: true,
      });

      cy.findByRole('presentation', { hidden: false })
        .findAllByText('Delete')
        .click({
          force: true,
        });
      cy.wait(1000);
      cy.findAllByText('Delete')
        .click({ force: true, multiple: true });

      cy.wait('@records').should('have.property', 'status', 200);
    }
  });
});
Cypress.Commands.add('selectItemfromList', (locator, itemName, url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.get(locator).each(($el, index) => {
    const name = $el.text();
    if (name === itemName) {
      cy.get(locator).eq(index).click({
        force: true,
      });
    }
  });
  cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add('clickSaveBtn', (url) => {
  cy.server();
  cy.route('POST', url).as('saveRecords');

  cy.clickButton('Save');
  cy.wait(1000);
  cy.findAllByText('Save').eq(1).click({
    force: true,
  });
});

Cypress.Commands.add('clickSaveExitBtn', (url) => {
  cy.server();
  cy.route('POST', url).as('retrieveRecords');

  cy.clickButton('Save');
  cy.findAllByText('Save & Exit', {
    timeout: 1000,
  }).click({
    force: true,
  });

  cy.wait('@retrieveRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('navigateToAppPicker', (method, asset, url) => {
  cy.intercept(method, url).as('records');
  cy.get('[id="app-picker-button"]').click({ force: true });
  cy.get('[aria-labelledby="app-picker-button"]')
    .findAllByText(asset)
    .click({ force: true });
  cy.wait('@records').its('response.statusCode').should('eq', 200)
});

Cypress.Commands.add('navigateToAppPicker2', (asset) => {
  cy.get('[id="app-picker-button"]').click({ force: true });
  cy.get('[aria-labelledby="app-picker-button"]')
    .findAllByText(asset)
    .click({ force: true });
  cy.get('[id="groupBy-input"]', { timeout: 10000 }).should('exist');
});

Cypress.Commands.add('clickOnButton', (btn, url) => {
  cy.server();
  cy.route('POST', url).as('saveQt');

  cy.wait(1000);
  cy.get('span')
    .contains(btn)
    .should('be.visible')
    .trigger('mouseover')
    .click({ force: true });

  cy.wait('@saveQt').should('have.property', 'status', 200);
});

Cypress.Commands.add('verifyPaginationPageNumbers', (url) => {
  cy.wait(2000);
  cy.server();
  cy.route('POST', url).as('records');

  let sum = 0,
    itemsCount, paginationLength;
  cy.itemCount()
    .first()
    .then((siteCount) => {
      const site = siteCount.text();
      itemsCount = site.split('of')[1].trim();
    });

  cy.get('[aria-label="Pagination navigation"] button')
    .then((list) => {
      paginationLength = list[list.length - 3].innerText;
      cy.get('[role="row"]').then((rows) => (sum += rows.length - 1));
      for (let pageNo = 1; pageNo < paginationLength; pageNo++) {
        cy.get('[aria-label="Pagination navigation"] button')
          .contains(pageNo + 1)
          .first()
          .click();
        cy.wait('@records').should('have.property', 'status', 200);
        cy.wait(1000);
        cy.get('[role="row"]').then((rows) => {
          sum += rows.length - 1;
          cy.log('records sum per page:' + sum);
        });
      }
    })
    .then(() => {
      expect(sum).to.be.equal(Number(itemsCount));
    });
});

Cypress.Commands.add('clickOnBtn', (btn, url) => {
  cy.server();
  cy.route('POST', url).as('records');

  cy.wait(1000);
  cy.get('[type="button"]').contains(btn).click({ force: true });

  cy.wait('@records').should('have.property', 'status', 200);
});

Cypress.Commands.add('refreshPage', (page, url) => {
  cy.server();
  cy.route('POST', url).as('refreshWait');

  cy.visit(Cypress.env('url') + page);
  cy.log(Cypress.env('url') + page);

  cy.wait('@refreshWait').should('have.property', 'status', 200);
});

Cypress.Commands.add('clickButtonInDialogBox', (btn, url) => {
  cy.server();
  cy.route('POST', url).as('actionWait');
  cy.get('[role="dialog"]').findAllByText(btn).should('be.visible').click({
    force: true,
  });

  cy.wait('@actionWait').should('have.property', 'status', 200);
});

Cypress.Commands.add('enterSearchField', (url, recordtext) => {
  cy.server();
  cy.route('POST', url).as('searchRecords');

  cy.get('input[type="text"]').clear().type(recordtext);
  cy.applyButton().click();

  cy.wait('@searchRecords').should('have.property', 'status', 200);
  cy.wait(1000);
});



Cypress.Commands.add('selectCheckBox', (text) => {
  cy.get('[role="listbox"]')
    .find('li')
    .each(($el, index) => {
      const level = $el.text();

      if (level === text) {
        cy.get('[role="listbox"]')
          .find('[type="checkbox"]')
          .eq(index - 1)
          .click({
            force: true,
          });
      }
    });
});

Cypress.Commands.add('selectDesiredDropdownIfNotSelected', (locator, dropdownValue) => {

  cy.get(locator).then(($dropdown) => {
    if ($dropdown.text() != dropdownValue) {

      cy.eventTypesDropdown().click({ force: true });
      cy.findAllByText('Select All').click({ force: true });
      cy.closeDropdown();
      cy.wait(2000)
      cy.waitProgressBarToDisappear();
    }
  })
});

Cypress.Commands.add('selectDropdownIfNotSelected', (locator, dropdownValue, method, url) => {
  cy.server();
  cy.route(method, url).as('records');

  cy.get(locator).then(($dropdown) => {
    if ($dropdown.text() != dropdownValue) {
      cy.wait(3000);
      cy.eventTypesDropdown().click({ force: true });
      cy.findAllByText('Select All').click({ force: true })
      cy.closeDropdown();
      cy.wait('@records').should('have.property', 'status', 200);
    }
  })
  cy.wait(3000);
});


Cypress.Commands.add('deleteObjectByThreeDot', (method, url, locator, recordName) => {

  cy.server();
  cy.route(method, url).as('records');

  cy.get(locator).each(($el, index) => {
    cy.log($el.text());
    const name = $el.text();

    if (name === recordName) {
      cy.get('[aria-label="Actions button"]').eq(index).click({
        force: true,
      });

      cy.findByRole('presentation', { hidden: false })
        .findAllByText('Delete')
        .click({
          force: true,
        });

      cy.get('[role="dialog"]').findByText('Are you sure you would like to delete the following item?')
      cy.get('[role="dialog"] li').then((boxMsg) => {
        const deletePopup = boxMsg.text();
        expect(deletePopup.includes(recordName)).to.be.true;
      });

      cy.get('[role="dialog"]').findAllByText('Delete').click();

      cy.wait('@records').should('have.property', 'status', 200);
    }
  });

});


Cypress.Commands.add('selectItems', (locator, recordName) => {

  cy.get(locator).each(($el, index) => {
    const name = $el.text();

    if (name === recordName) {
      cy.get('input[type="checkbox"]').eq(index).click({
        force: true,
      });
    }
  });
});


Cypress.Commands.add('clickOndeleteSelectedButton', (url) => {

  cy.server();
  cy.route('POST', url).as('deleteRecords');

  cy.findByRole('button', { name: /delete selected/i }).click({ force: true });

  cy.get('[role="dialog"] p').then((dialogMsg) => {
    const dialogTxt = dialogMsg.text();

    expect(dialogTxt.includes('Are you sure you would like to delete the following')).to.be.true;
  })
  cy.get('[role="dialog"]').findAllByText('Delete').click();
  cy.wait('@deleteRecords').should('have.property', 'status', 200);
});

Cypress.Commands.add('clickBtn', (btn, method, url) => {
  cy.intercept(method, url).as('wait');
  cy.wait(1000);
  cy.findAllByText(btn).should('exist').click({
    force: true,
  });
  cy.wait(1000);
  cy.wait('@wait').then(({ response }) => { expect(response.statusCode).to.eq(200) });
});

Cypress.Commands.add('dragAndDrop', (subject, target) => {
  Cypress.log({
    name: 'DRAGNDROP',
    message: `Dragging element ${subject} to ${target}`,
    consoleProps: () => {
      return {
        subject: subject,
        target: target
      };
    }
  });
  const BUTTON_INDEX = 0;
  const SLOPPY_CLICK_THRESHOLD = 10;
  cy.get(target)
    .first()
    .then($target => {
      let coordsDrop = $target[0].getBoundingClientRect();
      cy.get(subject)
        .first()
        .then(subject => {
          const coordsDrag = subject[0].getBoundingClientRect();
          cy.wrap(subject)
            .trigger('mousedown', {
              button: BUTTON_INDEX,
              clientX: coordsDrag.x,
              clientY: coordsDrag.y,
              force: true
            })
            .trigger('mousemove', {
              button: BUTTON_INDEX,
              clientX: coordsDrag.x + SLOPPY_CLICK_THRESHOLD,
              clientY: coordsDrag.y,
              force: true
            });
          cy.get('body')
            .trigger('mousemove', {
              button: BUTTON_INDEX,
              clientX: coordsDrop.x,
              clientY: coordsDrop.y,
              force: true
            })
            .trigger('mouseup');
        });
    });
});