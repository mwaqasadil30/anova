import moment from 'moment';

class UtilFunctions {
  suffixWithDate(name) {
    const suffixDate = name + new Date().toLocaleString();
    return suffixDate;
  }

  getCurrentYear(){
    var d = new Date();
    var n = d.getFullYear();
    return "/"+ n;
  }

  getCurrentDate() {
    var today = new Date().toLocaleString();
    var dd = today.split(',');
    var date = dd[0].trim();
    return date;
  }

  randomString() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    for (var i = 0; i < 4; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  randomNumber(min, max) 
  { 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  splitStrings(stringName) {
    var str = stringName;
    var arr = str.split(/(?<=^(?:.{3})+)(?!$)/);
    return arr;
  }

  clickRefreshIcon(method,url) {
    cy.server().route(method,url).as('records');
    cy.clickButton('Refresh');
    cy.wait('@records').its('status').should('eq', 200);
  }

  viewRecord(recordName, headerText, url) {
    cy.server();
    cy.route('POST', url).as('records');
    cy.clickOnRecordName(recordName);
    cy.wait('@records').should('have.property', 'status', 200);
    cy.findByText(headerText).should('exist');
    cy.go('back');
  }

  itemsCountPaginationBefore() {
    cy.wait(1000);
    cy.itemCount()
      .eq(0)
      .then(function (itemsCount) {
        const items = itemsCount.text();
        var itemsList = items.split('f');
        itemsList = itemsList[1].trim();
        this.itemsList = itemsList;
        cy.log(this.itemsList);
      });
  }

  verifyItemsCountPaginationAfter(count) {
    cy.wait(1000);
    cy.itemCount()
      .eq(0)
      .then(function (itemsCount) {
        const items = itemsCount.text();
        var expItemsList = items.split('f');
        expItemsList = expItemsList[1].trim();
        cy.log(expItemsList);
        expect(Number(expItemsList)).to.be.equal(
          Number(this.itemsList) + count
        );
      });
  }

  itemsCountBefore() {
    cy.get("tbody[role='rowgroup']")
      .find('tr')
      .then((listing) => {
        const items = Cypress.$(listing).length;
        this.items = items;
      });
  }

  verifyItemsCountAfter(count) {
    cy.get("tbody[role='rowgroup']")
      .find('tr')
      .then((listing) => {
        const listingCount = Cypress.$(listing).length;
        expect(listingCount).to.be.equal(Number(this.items) + count);
      });
  }

  verifyColumnSortingDesc(locator) {
    getCellTextAsArray(locator).then((cellContents) => {
      let actualColumnSort = cellContents;
      let expColumnSort = cellContents.sort().reverse();
      cy.wrap(actualColumnSort).should('deep.eq', expColumnSort);
    });
  }

  verifyColumnSortingAsc(locator) {
    getCellTextAsArray(locator).then((cellContents) => {
      let actualColumnSort = cellContents;
      let expColumnSort = cellContents.sort();
      cy.wrap(actualColumnSort).should('deep.eq', expColumnSort);
    });
  }

  verifyDateAndTimeSortingAsc(locator) {
    getCellTextAsArray(locator).then((readingTimeContents) => {
      let actualReadingTimeContent = readingTimeContents.filter(
        (date) => date && date !== '-'
      );

      let expReadingTimeContent = readingTimeContents
        .filter((date) => date && date !== '-')
        .sort(
          (a, b) =>
            moment(a, 'MM/DD/YYYY, hh:mm:ssa') - moment(b, 'MM/DD/YYYY, hh:mm:ssa')
        );


      cy.wrap(actualReadingTimeContent).should(
        'deep.eq',
        expReadingTimeContent
      );
    });
  }

  verifyDateAndTimeSortingDesc(locator) {
    getCellTextAsArray(locator).then((readingTimeContents) => {
      let actualReadingTimeContent = readingTimeContents.filter(
        (date) => date && date !== '-'
      );

      let expReadingTimeContent = readingTimeContents
        .filter((date) => date && date !== '-')
        .sort(
          (a, b) =>
            moment(a, 'MM/DD/YYYY, hh:mm:ssa') - moment(b, 'MM/DD/YYYY, hh:mm:ssa')
        )
        .reverse();

      cy.wrap(actualReadingTimeContent).should(
        'deep.eq',
        expReadingTimeContent
      );
    });
  }


  verifyColumnDetailsWithAPIResponse(locator, responseData) {
    getCellTextAsArray(locator).then((cellContents) => {
      let actualColumnSort = responseData.sort().toLowerCase();
      let expColumnSort = cellContents.sort().toLowerCase();
      cy.wrap(actualColumnSort).should('deep.eq', expColumnSort);
    });
  }


}

export default UtilFunctions;

function getReadingTimeTextAsArray() {
  let readingTimeContents = [];
  return new Cypress.Promise((resolve) => {
    cy.get('[aria-label="Reading Time"]')
      .each(($el) => {
        readingTimeContents.push($el.text());
      })
      .then(() => resolve(readingTimeContents));
  });
}


function getCellTextAsArray(locator) {
  let cellContents = [];
  return new Cypress.Promise((resolve) => {
    cy.get(locator)
      .each(($el) => {
        cellContents.push($el.text().toString().toLowerCase());
      })
      .then(() => resolve(cellContents));
  });
}
