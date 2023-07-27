import '@testing-library/cypress/add-commands';
const routes = require('../../fixtures/routes.json');

Cypress.Commands.add('SystemSearchIcon', (presence) => {
    cy.findAllByText('System Search').should(presence)
})

Cypress.Commands.add('closeLaunchPanel', (presence) => {
    cy.get('[aria-label="close"]').click()
})

Cypress.Commands.add('searchDeviceID', (searchText) => {
    cy.get('[id="filterText-input"]').clear().type(searchText)
    cy.rtuSearch()
})

Cypress.Commands.add('searchAppears', (searchText) => {
    cy.get('tr td:nth-child(2)').eq(0).invoke('text').then((text) => {
        expect(text).to.include(searchText)
    })
})

Cypress.Commands.add('rtuSearch', () => {
    cy.intercept('POST', routes.rtuSearch).as('search')
    cy.searchButton()
    cy.wait('@search').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('searchButton', () => {
    cy.get('[type="submit"]').click()
})

Cypress.Commands.add('isDelColumn', (value1, value2) => {
    cy.intercept('POST', routes.rtuSearch).as('search')
    cy.sortDeleteCol()
    cy.wait('@search').its('response.statusCode').should('eq', 200)
    cy.get('tr td:nth-child(13)').eq(0).invoke('text').then((text) => {
        expect(text).to.include(value1)

    cy.sortDeleteCol()
    cy.wait('@search').its('response.statusCode').should('eq', 200)
    cy.get('tr td:nth-child(13)').eq(0).invoke('text').then((text) => {
        expect(text).to.include(value2)
    })
})
})

Cypress.Commands.add('sortDeleteCol', () =>{
    cy.get('[aria-label="Deleted"]').eq(0).click()
}) 

Cypress.Commands.add('showDeleCheck', () => {
    cy.contains('Show Deleted').click()
    cy.searchButton()
    cy.intercept('POST', routes.rtuSearch).as('search')
    cy.wait('@search').its('response.statusCode').should('eq', 200)
})

Cypress.Commands.add('selectDomain', () => {
    cy.get('[id="domain-dropdown-button"]').eq(1).click()
    cy.get('[aria-autocomplete="list"]').click().type('TestAutomation')
    cy.get('[role="listbox"]').find('ul > li').each((el)=>{
        const text = el.text()
        if(text==="TestAutomation"){
            el.trigger('click')
    }
    })
})

Cypress.Commands.add('selectSubDomain', () => {
    cy.get('[name="includeSubDomain"]').click()
})


Cypress.Commands.add('verifyDomainInGrid', (value1, value2) => {
    cy.intercept('POST', routes.rtuSearch).as('search')
    cy.sortDomainCol()
    cy.wait('@search').its('response.statusCode').should('eq', 200)
    cy.get('tr td:nth-child(3)').eq(0).invoke('text').then((text) => {
        expect(text).to.include(value1)

    cy.sortDomainCol()
    cy.wait('@search').its('response.statusCode').should('eq', 200)
    cy.get('tr td:nth-child(3)').eq(0).invoke('text').then((text) => {
        expect(text).to.include(value2)
    })
})
})

Cypress.Commands.add('sortDomainCol', () => {
    cy.get('[aria-label="Domain"]').eq(0).click()
})

Cypress.Commands.add('openRTU', (searchText) => {
    cy.intercept('POST', routes.domainAdditional).as('domain')
    cy.get('tr td:nth-child(3)').eq(0).invoke('text').then((gridDomain) => {
    cy.log(gridDomain)
    cy.get('tr td:nth-child(2)').eq(0).invoke('text').then((RTUNum) => {
    cy.get('tr td:nth-child(2)').eq(0).click()
    cy.wait('@domain')
    cy.get('[id="domain-dropdown-button"]').invoke('text').then((domain)=>{
        cy.log(domain)
        expect(gridDomain).to.eql(domain)
    })

    cy.contains('[title="RTU"]', RTUNum).invoke('text').then((RTUTitle)=>{
        expect(RTUTitle).to.includes("RTU - "+RTUNum)
    })
})
})
})
Cypress.Commands.add('back', () => {
    cy.get('[aria-label="back"]').click()

})


Cypress.Commands.add('RTUSearchReset', () => {
    cy.contains('Enter a Search To Get Started').should('be.visible')

})
