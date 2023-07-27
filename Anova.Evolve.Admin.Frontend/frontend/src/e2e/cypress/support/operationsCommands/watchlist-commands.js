const routes = require('../../fixtures/routes.json');
const config = require('../../fixtures/example.json');




Cypress.Commands.add('checkIfwatchlistAlreadyExistOrNot', () => {

    cy.get('[aria-label="Change watchlist status"]').then((watchlistStatus)=>{
        const watchlistStatusTxt = watchlistStatus.text();
        if(watchlistStatusTxt.includes('Remove From Watch List'))
        {
          cy.intercept('DELETE',routes.userWatchList).as('deleteWatchlist');
          cy.get('[aria-label="Change watchlist status"]').click();
          cy.wait('@deleteWatchlist').then(({response})=> {expect(response.statusCode).to.eq(200)});
        }
       });

       cy.wait(2000);
});

    
Cypress.Commands.add('removeWatchlist',() => {

    cy.intercept('DELETE',routes.userWatchList).as('deleteWatchlist');
    cy.findAllByText('Remove From Watch List',{timeout:20000}).click({force:true});
    cy.wait('@deleteWatchlist').then(({response})=> {expect(response.statusCode).to.eq(200)})
  
  });

  Cypress.Commands.add('verifyDeletedWatchList', (assetName) => {


    cy.get('body').then(($body) => {
      if ($body.find('[aria-label="Watchlist item title"]').length > 0) 
      {
  
        cy.get('[aria-label="Watchlist item title"]').each(($el) => {
          const watchlistText = $el.text();
      
          if (watchlistText != assetName) {
             
            assert.isTrue(true, 'The asset is removed from the watchlist')
            return false;
          }
      
          else(watchlistText===assetName)
          {
            assert.isFalse(true, 'The asset is not removed from the watchlist')
          }
        });
  
      } 
    });
  
  });
  

  
Cypress.Commands.add('verifyAndSelectWatchList', (method,url,assetName) => {
  
    cy.get('[aria-label="Watchlist item title"]').each(($el, index) => {
      const watchlistText = $el.text();
  
      if (watchlistText.includes(assetName)) {
        cy.get('[aria-label="Watchlist item title"]')
          .eq(index)
          .click({ force: true });
        return false;
      }
    });

    cy.wait('@assetDetails').then(({response})=> {expect(response.statusCode).to.eq(200)});
  });
  
  
  