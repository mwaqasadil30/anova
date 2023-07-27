

Cypress.Commands.add('contactSupportIcon', () => {

    cy.get('header > div > div > div')
    .find('button[type="button"]').eq(2).click({ force: true})   
} );

Cypress.Commands.add('contactSupportDropdown', () => {

    cy.get('header > div > div > div')
    .find('button[type="button"]').eq(2).click({ force: true});

    cy.get('a > div > span').eq(0).should('have.text', 'Training Hub');
    cy.get('ul > a').eq(0).should('have.attr','href','/training');

    cy.get('a > div > span').eq(1).should('have.text', 'Contact Support');
    cy.get('ul > a').eq(1).should('have.attr','href','/ops/contact-support');
    
    cy.get('a > div > span').eq(2).should('have.text', 'Release Notes');
    cy.get('ul > a').eq(2).should('have.attr','href','/ops/release-notes');
    cy.get('li > div > span').eq(0).should('have.text', 'About');
    
} );
