Cypress.Commands.add('domainDropdown', () => {
    cy.get('[id="domain-dropdown-button"]')
})

Cypress.Commands.add('appPicker', () => {
    cy.get('[id="app-picker-button"]');
})

Cypress.Commands.add('defaultSelectedOption', () => {
    cy.get('[aria-selected= "true"]');
})

Cypress.Commands.add('cycleRunTimeValue', () => {
    cy.get('[aria-label="Cycle Run Time 28h"]');
})

Cypress.Commands.add('cycleSecondaryRunTimeValue', () => {
    cy.get('[aria-label="Cycle run time 28h"]');
})

Cypress.Commands.add('cycleIdleTimeValue', () => {
    cy.get('[aria-label="Cycle Idle Time 00h"]');
})

Cypress.Commands.add('cycleSecondaryIdleTimeValue', () => {
    cy.get('[aria-label="Idle time 00h"]');
})

Cypress.Commands.add('workingPercentageValue', () => {
    cy.get('[aria-label="Working 100%"]');
})

Cypress.Commands.add('workingPercentageSecondaryValue', () => {
    cy.get('[aria-label="Working 100%"]');
})

Cypress.Commands.add('oxygenValue', () => {
    cy.get('[aria-label="Oxygen 66"]');
})

Cypress.Commands.add('oxygenSecondaryValue', () => {
    cy.get('[aria-label="Oxygen 66"]');
})

Cypress.Commands.add('lowTempValue', () => {
    cy.get('[aria-label="Low Temp. 0"]');
})

Cypress.Commands.add('lowTempSecondaryValue', () => {
    cy.get('[aria-label="Low temp. 0"]');
})

Cypress.Commands.add('doorsOpenValue', () => {
    cy.get('[aria-label="Doors Open 0"]');
})

Cypress.Commands.add('doorsOpenSecondaryValue', () => {
    cy.get('[aria-label="Doors open 0"]');
})

Cypress.Commands.add('timeStampValue', () => {
    cy.get(':nth-child(2) > .MuiGrid-container > :nth-child(2) > .MuiTypography-root');
})

Cypress.Commands.add('dragElement',()=>{
    cy.get('[aria-label="LINPosition graph series"]');
})

Cypress.Commands.add('dropPosition',()=>{
    cy.get(':nth-child(1) > .sc-kggxBk > .sc-hGFGMM > .sc-eUZScX');
})


Cypress.Commands.add('switchToMortars', () => {
    cy.intercept('POST', '/GetAssetSummaryRecordsByOptions').as("domainSwitch");
    cy.domainDropdown().type("MORTARS" + '{enter}');
    cy.wait('@domainSwitch');
});

Cypress.Commands.add('flowToFreezer', () => {
    cy.intercept('GET', '/FreezerAsset/SiteAssetSummary').as("siteSummary");
    cy.appPicker().click();
    cy.findAllByText('Freezers').click();
    cy.wait("@siteSummary");
})

Cypress.Commands.add('checkForAvailableSites', () => {
    cy.findAllByText("Kookaburra").should("be.visible");
    cy.findAllByText("Plant and Bean").should("be.visible");
})

Cypress.Commands.add('clickOnPlantAndBeanSite', () => {
    cy.intercept('GET', '/FreezerSite/site/fa905846-eaa6-eb11-86cd-00155d55772b/detail').as('freezerDetails');
    cy.findAllByText("Plant and Bean").click();
    cy.wait("@freezerDetails");
})

Cypress.Commands.add('check2DOptionByDefault', () => {
    cy.defaultSelectedOption().contains("2D");
})

Cypress.Commands.add('generalSectionFields', () => {
    cy.findAllByText("Cycle Run Time").should("be.visible");
    cy.findAllByText("Cycle Idle Time").should("be.visible");
    cy.findAllByText("Working").should("be.visible");
})

Cypress.Commands.add('eventsSectionFields', () => {
    cy.findAllByText("Oxygen").should("be.visible");
    cy.findAllByText("Low Temp.").should("be.visible");
    cy.findAllByText("Doors Open").should("be.visible");

})

Cypress.Commands.add('latestReadingStamp', () => {
    cy.timeStampValue().invoke('text').then(($time) => {
        cy.log($time);
    })
})

Cypress.Commands.add('clickOnTheFreezer', () => {
    cy.intercept('GET', '/FreezerAsset/tags/site/fa905846-eaa6-eb11-86cd-00155d55772b').as("freezerDetails");
    cy.findAllByText("Plant and Bean Boston Compact Spiral").click();
    cy.wait("@freezerDetails");
})

Cypress.Commands.add('verifyValues', () => {
    var cycleRunTime, cycleIdleTime, workingPercentage, cycleRunTime1, cycleIdleTime1, workingPercentage1, oxygenValue, lowTemp, doorsOpen, oxygenValue1, lowTemp1, doorsOpen1;
    cy.intercept('GET', '/FreezerAsset/tags/site/fa905846-eaa6-eb11-86cd-00155d55772b').as("freezerDetails");
    cy.intercept('GET', '/FreezerSite/site/fa905846-eaa6-eb11-86cd-00155d55772b/detail').as('freezerDetails1');
    cy.cycleSecondaryRunTimeValue().invoke('text').then(($value1) => {
        cycleRunTime1 = $value1;
        cy.get('.MuiIconButton-label > .MuiSvgIcon-root').click();
        cy.wait("@freezerDetails1");
        cy.cycleRunTimeValue().invoke('text').then(($value) => {
            cycleRunTime = $value;
            expect(cycleRunTime1).to.be.equal(cycleRunTime);
        });
    })
    cy.findAllByText("Plant and Bean Boston Compact Spiral").click();
    cy.wait("@freezerDetails");
    cy.cycleSecondaryIdleTimeValue().invoke('text').then(($value2) => {
        cycleIdleTime1 = $value2;
        cy.get('.MuiIconButton-label > .MuiSvgIcon-root').click();
        cy.wait("@freezerDetails1");
        cy.cycleIdleTimeValue().invoke('text').then(($value) => {
            cycleIdleTime = $value;
            expect(cycleIdleTime1).to.be.equal(cycleIdleTime);
        });
    })
    cy.findAllByText("Plant and Bean Boston Compact Spiral").click();
    cy.wait("@freezerDetails");
    cy.workingPercentageSecondaryValue().invoke('text').then(($value3) => {
        workingPercentage1 = $value3;
        cy.get('.MuiIconButton-label > .MuiSvgIcon-root').click();
        cy.wait("@freezerDetails1");
        cy.workingPercentageValue().invoke('text').then(($value) => {
            workingPercentage = $value;
            expect(workingPercentage1).to.be.equal(workingPercentage);
        });
    })
    cy.findAllByText("Plant and Bean Boston Compact Spiral").click();
    cy.wait("@freezerDetails");
    cy.oxygenSecondaryValue().invoke('text').then(($value3) => {
        oxygenValue1 = $value3;
        cy.get('.MuiIconButton-label > .MuiSvgIcon-root').click();
        cy.wait("@freezerDetails1");
        cy.oxygenValue().invoke('text').then(($value) => {
            oxygenValue = $value;
            expect(oxygenValue1).to.be.equal(oxygenValue);
        });
    })
    cy.findAllByText("Plant and Bean Boston Compact Spiral").click();
    cy.wait("@freezerDetails");
    cy.lowTempSecondaryValue().invoke('text').then(($value3) => {
        lowTemp1 = $value3;
        cy.get('.MuiIconButton-label > .MuiSvgIcon-root').click();
        cy.wait("@freezerDetails1");
        cy.lowTempValue().invoke('text').then(($value) => {
            lowTemp = $value;
            expect(lowTemp1).to.be.equal(lowTemp);
        });
    })
    cy.findAllByText("Plant and Bean Boston Compact Spiral").click();
    cy.wait("@freezerDetails");
    cy.doorsOpenSecondaryValue().invoke('text').then(($value3) => {
        doorsOpen1 = $value3;
        cy.get('.MuiIconButton-label > .MuiSvgIcon-root').click();
        cy.wait("@freezerDetails1");
        cy.doorsOpenValue().invoke('text').then(($value) => {
            doorsOpen = $value;
            expect(doorsOpen1).to.be.equal(doorsOpen);
        });
    })
    cy.findAllByText("Plant and Bean Boston Compact Spiral").click();
    cy.wait("@freezerDetails");
})

Cypress.Commands.add('newFreezerCreation', () => {
    cy.intercept('GET', '/Chart/asset/03915846-eaa6-eb11-86cd-00155d55772b/GetDataChannels').as("freezerCreation");
    cy.findAllByText("New freezer chart").click();
    cy.wait("@freezerCreation");
    cy.get('[aria-label="LINPosition graph series"]').drag(':nth-child(1) > .sc-kggxBk > .sc-hGFGMM > .sc-eUZScX');
})
