/// <reference types="cypress" />
import UtilFunctions from '../../../support/utils/UtilFunctions';
const routes = require('../../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();


describe('WatchList test-suite', function() {

    const assetTitle = 'Events Testing Anova';

    beforeEach(function () {
        cy.viewport(1440, 900)

        // Preserve only the session cookie in every test
        Cypress.Cookies.defaults({
          preserve: (cookie) => {
            return cookie && cookie.name === '.AspNetCore.Session';
          },
        });

      });

      it('Set UP-1-As Single domain User .',{retries : 10}, function () {
        cy.login();
      });
    
      it('Navigate to Operations app -Asset summary ', function () {

        cy.navigateToAppPicker('POST','Operations', routes.getAssetSummaryByOptionUrl);
        cy.assetSummaryIcon().click({ force: true });
        cy.pageHeader().should('have.text', 'Asset Summary');
        cy.url().should('include', 'ops/asset-summary');      

      });

      it('Add an Asset to watchlist',function(){

       cy.verifyPageUrl('POST',
       routes.assetSummaryUrl,
       routes.getAssetSummaryByOptionUrl
       );
        
       cy.intercept('GET', routes.retrieveAssetDetailById).as('assetDetails');
       
       cy.waitProgressBarToDisappear();
       cy.clearNavItemIfVisible();
       cy.findAllByText('Show Filters').click();
       cy.filterByDropdown().click();
       cy.verifyFilterByDropdownFields();
       cy.selectDropdown('Asset Title');
       cy.filterByDropdown().should('have.text', 'Asset Title');
        
       cy.enterName(assetTitle+ '{enter}');
       cy.assetDescriptionCell().first().click({ force: true });
       cy.wait('@assetDetails').then(({response})=> {expect(response.statusCode).to.eq(200)});
       cy.checkIfwatchlistAlreadyExistOrNot(); 
       cy.findAllByText('Add To Watch List',{timeout:20000}).click({force: true,timeout:20000});
       cy.findAllByText('Remove From Watch List',{timeout:20000}).should('be.visible');
       cy.goBack('POST',routes.getAssetSummaryByOptionUrl);

       cy.clearNavItemIfVisible();
       cy.navigationBar().click({ force: true });
       cy.clickOnTab('Watch List');
       cy.verifyAndSelectWatchList('POST',routes.retrieveAssetDetailById,assetTitle);
    
      });

      it('Remove an Asset from the watchlist',function(){

        cy.removeWatchlist();
        cy.clearNavItemIfVisible();
        cy.navigationBar().click({ force: true });
        cy.clickOnTab('Watch List');
        cy.verifyDeletedWatchList(assetTitle);

      });

    });