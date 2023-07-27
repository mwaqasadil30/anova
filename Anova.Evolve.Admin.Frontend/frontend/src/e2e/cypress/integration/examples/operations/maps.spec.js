/// <reference types="cypress" />
import UtilFunctions from '../../../support/utils/UtilFunctions';
const routes = require('../../../fixtures/routes.json');
const config = require('../../../fixtures/example.json');
const utilFunctions = new UtilFunctions();

describe('Operation Maps test-suite', function() {
    let favoriteItem, uniqueGroupDesc;

    beforeEach(function () {
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

      it('Create Favorite with empty inventory state and navigate to maps to check that state', function() {
        cy.server();
        cy.route('POST', routes.getAssetSummaryByOptionUrl).as('records');
        cy.route('POST', routes.mapRecordsByOptionsUrl).as('mapRecords');
        cy.route('GET', routes.retrieveAssetDetailById).as('assetRecords');
        favoriteItem = utilFunctions.suffixWithDate(config.favoriteItem);
        let units = ['Level Empty'];
    
        cy.clearNavItemIfVisible();  
        cy.findAllByText('Show Filters').click(); 
        cy.inventoryStatesDropdown().click({ force: true });
        cy.deselectAllInListbox('[aria-labelledby="inventoryStates-input-label"] button');
        units.forEach((element) => {
          cy.selectSpecificCheckBox(element);
        });
        cy.closeDropdown();
        cy.get('[class = "MuiButton-label"]')
          .contains('Apply')
          .click();
        cy.wait('@records').should('have.property', 'status', 200);
        cy.inventoryStatesDropdown().should('have.text', 'Level Empty');
        cy.filterByDropdown().click();
        cy.verifyFilterByDropdownFields();
        cy.selectDropdown('All Fields');
        cy.filterByDropdown().should('have.text', 'All Fields');
        cy.enterName('Analog Asset Bulk Strata Ltd.'+ '{enter}');
        cy.clickAddFavorite()
        cy.verifyFavoritesPopUp();
        cy.favouriteAssetName().type(favoriteItem)
        cy.saveFavorite();
        cy.clickButtonInDialogBox('Save', routes.getFavouritesUrl);
    
        cy.navBreadcrumb().findAllByText(favoriteItem);
        cy.getPageCount();
        cy.getAssetSummaryRecords();

        cy.mapsIcon().click({force:true});
        cy.wait('@mapRecords').should('have.property', 'status', 200);

        cy.mapsTab().should('have.text', 'Inventory',{timeout:20000});
        cy.url().should('include', '/ops/asset-map');

        cy.waitProgressBarToDisappear();
        cy.verifyInventoryStateCount('Level Empty');
        cy.get('[id="vertical-panel-header"]').should('contain', 'Assets').click({force:true})
        cy.verifySideDrawerRecords();
        cy.dataChannelTypePanel().click({force:true})
        cy.wait('@assetRecords').should('have.property', 'status', 200);
        cy.verifyAssetSummarySidePanelRecords('Analog Asset Bulk Strata Ltd.');
      })

      it('User can navigate to ‘Asset Details’ screen from Maps side drawer', function(){
        cy.verifyPageUrl('POST',
          routes.assetMapUrl,
          routes.mapRecordsByOptionsUrl
          );
        cy.server();
        cy.route('GET', routes.retrieveAssetDetailById).as('assetRecs');
        cy.clearNavItemIfVisible(); 
        cy.getAssetSummaryDetailsSideDrawerRecords()
        cy.detailsButton().click({force:true});
        cy.wait('@assetRecs').should('have.property', 'status', 200);
        cy.verifyAssetDetailsRecords('Analog Asset Bulk Strata Ltd.');
      })

      it('Set Group and go to maps, check asset summary side drawer details on maps', function(){
        cy.server();
        cy.route('POST', routes.mapRecordsByOptionsUrl).as('mapRecords');
        cy.route('GET', routes.retrieveAssetDetailById).as('assetRecords');
        cy.route('POST', routes.getAssetSummaryByOptionUrl).as('records');
        
        
        cy.applicationLaunchPanel().click({ force: true });
        cy.contains('Administration').click({ force: true });
        uniqueGroupDesc = utilFunctions.suffixWithDate(config.favoriteItem + 'Group');

        cy.createSingleRowGroup(
          uniqueGroupDesc,
          'Add Asset Group',
          'Customer Name',
          '=',
          'Bulk Strata Ltd.'
        );
        cy.get('[id="app-picker-button"]').click({ force: true });
        cy.get('[aria-labelledby="app-picker-button"]')
          .findAllByText('Operations')
          .click({ force: true });
        cy.wait(3000);
        cy.assetSummaryIcon().click({ force: true });
        cy.pageHeader().should('have.text', 'Asset Summary');

        cy.clearNavItemIfVisible();
        cy.navigationBar().click({ force: true });
        cy.clickOnTab('Group');
        cy.selectGroup(uniqueGroupDesc)
        cy.wait('@records').should('have.property', 'status', 200);
      
        cy.wait(1000)
        let units = ['Level Empty'];
        cy.findAllByText('Show Filters').click(); 
        cy.inventoryStatesDropdown().click({ force: true });
        cy.deselectAllInListbox('[aria-labelledby="inventoryStates-input-label"] button');
        units.forEach((element) => {
          cy.selectSpecificCheckBox(element);
        });
        cy.closeDropdown();
        cy.wait('@records').should('have.property', 'status', 200);
        cy.inventoryStatesDropdown().should('have.text', 'Level Empty');
        cy.filterByDropdown().click();
        cy.verifyFilterByDropdownFields();
        cy.selectDropdown('All Fields');
        cy.filterByDropdown().should('have.text', 'All Fields');
        cy.enterName('Analog Asset Bulk Strata Ltd.'+ '{enter}');
        cy.getAssetSummaryRecords();    
        cy.mapsIcon().click({force:true});
        cy.wait('@mapRecords').should('have.property', 'status', 200);

        cy.mapsTab().should('have.text', 'Inventory');
        cy.url().should('include', '/ops/asset-map');

        cy.get('[id="vertical-panel-header"]').should('contain', 'Assets').click({force:true})
        cy.verifySideDrawerRecords();
        cy.dataChannelTypePanel().first().click({force:true})
        cy.wait('@assetRecords').should('have.property', 'status', 200);
        cy.verifyAssetSummarySidePanelRecords('Analog Asset Bulk Strata Ltd.');        
      })
    
      it('Verify on ‘Deselecting’ the button, no assets should be shown on the side panel and all filter options should be disabled.',function(){

        cy.verifyPageUrl('POST',
        routes.assetSummaryUrl,
        routes.getAssetSummaryByOptionUrl
        );
        
        cy.server();
        cy.route('POST', routes.mapRecordsByOptionsUrl).as('mapRecords');
        cy.closeDropdown();
        cy.get('[aria-label="map nav"]').click({force:true});
        cy.wait('@mapRecords').should('have.property', 'status', 200);
        
        cy.findAllByText('Deselect All').click({force:true});
        
        
        cy.get('[aria-controls="vertical-panel-content"]').then((asset)=>
        {
        const assetTxt = asset.text()
        cy.log(assetTxt)
        
        // const items = itemsCount.text();
        var expItemsList = assetTxt.split('(');
        expItemsList = expItemsList[1].trim();
        const assetCount = expItemsList.slice(0, -1);
        cy.log(assetCount);
        
        expect(Number(assetCount)).to.be.equal(0);
        
        })
        
        })
        
      it.skip('On ‘Select All’, all filter options should be enabled and all assets should be shown on the side panel',function(){
        
        cy.server();
        cy.route('POST', routes.mapRecordsByOptionsUrl).as('mapRecords');
        cy.verifyPageUrl('POST',routes.configurationManagerUrl, routes.retrieveAssetByOptionsUrl);
        
        //fetch total count of assets
        cy.get('[aria-label="Item count"]')
        .first()
        .then((itemsCount) => {
        const item = itemsCount.text();
        var expItemList = item.split('f');
        expItemList = expItemList[1].trim();
        this.expItemList=expItemList;
        });
        
        cy.verifyPageUrl('POST',
        routes.assetSummaryUrl,
        routes.getAssetSummaryByOptionUrl
        );
        cy.wait(1000);
        cy.waitProgressBarToDisappear();
        cy.clearNavItemIfVisible();  
       
        cy.get('[aria-label="map nav"]').click({force:true});
        cy.wait('@mapRecords').should('have.property', 'status', 200);   
        cy.findAllByText('Select All').click();
        cy.get('[aria-controls="vertical-panel-content"]').then((asset)=>
        {
        const assetTxt = asset.text()
        cy.log(assetTxt)
        
        var expItemsList = assetTxt.split('(');
        expItemsList = expItemsList[1].trim();
        const assetCount = expItemsList.slice(0, -1);
        cy.log(assetCount);
        
        expect(Number(assetCount)).to.be.equal(Number(this.expItemList)+1);
        
        })
        
        })
        
      it('User can hide and show filters on the map',function(){
        
        cy.verifyPageUrl('POST',
        routes.assetMapUrl,
        routes.mapRecordsByOptionsUrl
        );
        
        cy.get('[role="tabpanel"]').should('be.visible');
        cy.findAllByText('Hide Filters').click();
        cy.get('[role="tabpanel"]').should('not.be.visible');
        })
})