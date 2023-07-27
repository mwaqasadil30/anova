import '@testing-library/cypress/add-commands';
const routes = require('../../../fixtures/routes.json');

Cypress.Commands.add('customerName', () => {
  cy.findByLabelText('Customer Name *');
});

Cypress.Commands.add('contactName', () => {
  cy.get('input[name="contactName"]');
});

Cypress.Commands.add('contactPhone', () => {
  cy.get('input[name="contactPhone"]');
});

Cypress.Commands.add('address1', () => {
  cy.get('input[name="address1"]');
});

Cypress.Commands.add('postalCode', () => {
  cy.get("input[name='postalCode']");
});

Cypress.Commands.add('latitude', () => {
  cy.get('input[name="latitude"]');
});

Cypress.Commands.add('longitude', () => {
  cy.get('input[name="longitude"]');
});

Cypress.Commands.add('notes', () => {
  cy.get('[name="notes"]').should('be.visible');
});

Cypress.Commands.add('filterByDropdownSite', () => {
  cy.get('[id="filterColumn-input"]');
});

Cypress.Commands.add('groupByDropdownSite', () => {
  cy.get('[id="groupBy-input"]');
});

Cypress.Commands.add('siteRecordName', () => {
  cy.get('tbody [aria-label="Customer name"]');
});

Cypress.Commands.add('cityName', () => {
  cy.get('tbody [aria-label="City"]');
});

Cypress.Commands.add('filterByCustomerName', () => {
  cy.get('[data-value="0"]');
});

Cypress.Commands.add('groupByNone', () => {
  cy.get('[data-value="0"]');
});

Cypress.Commands.add('filterByState', () => {
  cy.get('[data-value="1"]');
});

Cypress.Commands.add('groupByCustomerName', () => {
  cy.get('[data-value="1"]');
});

Cypress.Commands.add('filterByCity', () => {
  cy.get('[data-value="2"]');
});

Cypress.Commands.add('groupByState', () => {
  cy.get('[data-value="2"]');
});

Cypress.Commands.add('filterByCountry', () => {
  cy.get('[data-value="3"]');
});

Cypress.Commands.add('groupByCountry', () => {
  cy.get('[data-value="3"]');
});

Cypress.Commands.add(
  'enterAllSiteDetails',
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
    cy.enterSitesDetailsWithoutLatLong(
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
    cy.get('[type="checkbox"]').check({force:true}).should('be.checked');

    cy.latitude().should('be.enabled');

    cy.longitude().should('be.enabled');

    cy.findByText('Get Lat/Long').click({force:true});
  }
);

Cypress.Commands.add('verifySiteFieldsAreClear', (header) => {
  cy.customerName().should('have.value', '');
  cy.contactName().should('have.value', '');
  cy.contactPhone().should('have.value', '');
  cy.address1().should('have.value', '');
  cy.findByLabelText('Country').should('have.value', '');
  cy.findByLabelText('State').should('have.value', '');
  cy.findByLabelText('City').should('have.value', '');
  cy.postalCode().should('have.value', '');
  cy.timeZone().should('have.value', '');
  cy.get('[name = "isGeoCodeManual"]').should('not.be.checked');
  cy.findByText('Get Lat/Long').should('not.exist');
  cy.latitude().should('not.be.enabled');
  cy.longitude().should('not.be.enabled');
  cy.notes().should('have.value', '');
});

Cypress.Commands.add(
  'enterSitesDetailsWithoutLatLong',
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
    cy.customerName().type(custName, {force:true});

    cy.contactName().type(contactName, {force:true});

    cy.contactPhone().type(contactPhone, {force:true});

    cy.address1().type(address1, {force:true});

    cy.get('input[name="address2"]').should('exist');

    cy.get('input[name="address3"]').should('exist');

    cy.findByLabelText('Country').should('exist').type(country);

    cy.findByLabelText('State').should('exist').type(state);

    cy.findByLabelText('City').should('exist').type(city);

    cy.postalCode().type(pcode);

    cy.timeZone().click();
    cy.findAllByText(timeZone).click();

    cy.notes().type('IT is a Test site #@$% 1234567890');
  }
);

Cypress.Commands.add(
  'editSiteDetails',
  (
    customerName,
    contactName,
    contactPhone,
    address1,
    country,
    state,
    city,
    pcode,
    timeZone
  ) => {
    cy.wait(1000);
    cy.customerName().clear({force:true}).type(customerName);
    cy.contactName().clear({force:true}).type(contactName);
    cy.contactPhone().clear({force:true}).type(contactPhone);
    cy.address1().clear({force:true}).type(address1);
    cy.findByLabelText('Country').clear({force:true}).type(country);
    cy.findByLabelText('State').clear({force:true}).type(state);
    cy.findByLabelText('City').clear({force:true}).type(city);
    cy.postalCode().clear({force:true}).type(pcode);
    cy.notes().clear({force:true}).type('Notes edited');

    cy.timeZone({force:true}).click({force: true});
    cy.selectDropdown(timeZone);
  }
);

Cypress.Commands.add('verifyLatLongEnabled', () => {
  cy.get('[name = "isGeoCodeManual"]').should('not.be.checked');
  cy.findByText('Get Lat/Long').should('not.exist');
  cy.latitude().should('not.be.enabled');
  cy.longitude().should('not.be.enabled');
  cy.get('[name = "isGeoCodeManual"]').check({force:true}).should('be.checked');

  cy.latitude().should('be.enabled');
  cy.longitude().should('be.enabled');
  cy.findByText('Get Lat/Long').click();
});

Cypress.Commands.add('verifyLatLongDisabled', () => {
  cy.get('[name = "isGeoCodeManual"]').uncheck({force:true}).should('not.be.checked');
  cy.findByText('Get Lat/Long').should('not.exist');
  cy.latitude().should('not.be.enabled');
  cy.longitude().should('not.be.enabled');
});

Cypress.Commands.add('selectGroupBy', (selectGroupBy) => {
  cy.groupByDropdownSite().click();
  cy.get('[role="listbox"]')
    .find('li')
    .each(($el) => {
      const groupBy = $el.text();
      if (groupBy.includes(selectGroupBy)) {
        $el.click();
      } else {
        cy.log('No such filter found');
        cy.log(groupBy);
      }
    });
});

Cypress.Commands.add(
  'deleteSiteRecordByThreeDot',
  (recordName, url, message) => {
    cy.server();
    cy.route('POST', url).as('records');

    cy.siteRecordName().each(($el, index) => {
      const name = $el.text();

      if (name === recordName) {
        cy.get('[aria-label="Actions button"]').eq(index).click({
          force: true,
        });
        cy.findAllByText('Delete').eq(index).should('be.visible').click({
          force: true,
        });
        cy.wait('@records').should('have.property', 'status', 200);
      }
    });
    //Check if its deleted or not
    cy.verifySiteDeleted(recordName, message);
  }
);

Cypress.Commands.add('verifySiteDeleted', (siteName, message) => {
  cy.searchField().clear().type(siteName);
  cy.get('span')
    .contains('Apply')
    .should('be.visible')
    .trigger('mouseover')
    .click({ force: true });

  cy.get('tr')
    .its('length')
    .then((len) => {
      cy.log(Number(len));

      if (len > 1) {
        cy.siteRecordName().each(($el, index, $list) => {
          expect($el.text()).to.not.equal(siteName);
        });
      } else {
        cy.findAllByText(message).should('exist');
      }
    });
});

Cypress.Commands.add('verifyFilters', (locator, text) => {
  cy.server();
  cy.route('POST', routes.retrieveSiteByOptionsUrl).as('records');
  cy.searchField().clear().type(text);
  cy.applyButton().click();

  cy.wait('@records').should('have.property', 'status', 200);

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

Cypress.Commands.add('verifyFilterByDropdowns', () => {
  cy.filterByDropdownSite()
    .click()
    .should('have.attr', 'aria-expanded', 'true');

  cy.get('[data-value="0"]')
    .should('be.visible')
    .and('have.text', 'Customer Name');
  cy.get('[data-value="1"]').should('be.visible').and('have.text', 'State');
  cy.get('[data-value="2"]').should('be.visible').and('have.text', 'City');
  cy.get('[data-value="3"]').should('be.visible').and('have.text', 'Country');
});

Cypress.Commands.add('verifyGroupByDropdowns', () => {
  cy.groupByDropdownSite().click().should('have.attr', 'aria-expanded', 'true');

  cy.get('[data-value="0"]').should('be.visible').and('have.text', 'None');
  cy.get('[data-value="1"]')
    .should('be.visible')
    .and('have.text', 'Customer Name');
  cy.get('[data-value="2"]').should('be.visible').and('have.text', 'State');
  cy.get('[data-value="3"]').should('be.visible').and('have.text', 'Country');
});

Cypress.Commands.add('verifySiteGridFilters', (fieldText, text) => {
  cy.server();
  cy.route('POST', routes.retrieveSiteByOptionsUrl).as('records');
  cy.searchField().clear().type(fieldText);
  cy.applyButton().click();

  cy.wait('@records').should('have.property', 'status', 200);

  cy.get('[role="rowgroup"] div').each(($el, index, $list) => {
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

Cypress.Commands.add('clickOnSiteRecordName', (siteName) => {
  cy.wait(2000);
  cy.siteRecordName().each(($el, index) => {
    const name = $el.text();
    if (name === siteName) {
      cy.siteRecordName().eq(index).click();
      return false;
    }
  });
});
//command will be reomved after bug 11088 resolved
Cypress.Commands.add('clickOnCityRecordName', (siteName) => {
  cy.wait(2000);
  cy.cityName().each(($el, index) => {
    const name = $el.text();
    if (name === siteName) {
      cy.cityName().eq(index).click();
      return false;
    }
  });
});
Cypress.Commands.add('viewSiteRecord', (recordName, headerText, url) => {
  cy.server();
  cy.route('POST', url).as('records');
  cy.clickOnCityRecordName(recordName); //changed due to bug 11088
  cy.wait('@records').should('have.property', 'status', 200);
  cy.findByText(headerText).should('exist');
  cy.go('back');
});

Cypress.Commands.add('deleteSiteRecord', (recordName) => {
  cy.cityName().each(($el, index) => {
    const name = $el.text();

    cy.log(name);
    cy.log(recordName);

    if (name === recordName) {
      cy.get('input[type="checkbox"]')
        .eq(index + 1)
        .click({
          force: true,
        });
    }
  });
});


Cypress.Commands.add('verifySiteDeletedItem', (recordName, message) => {
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
        cy.siteRecordName().each(($el) => {
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
