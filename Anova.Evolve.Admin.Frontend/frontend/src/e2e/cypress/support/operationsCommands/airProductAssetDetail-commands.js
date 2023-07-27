import moment from 'moment';
import UtilFunctions from '../../support/utils/UtilFunctions';
const routes = require('../../fixtures/routes.json');
chai.use(require('chai-string'));

Cypress.Commands.add('TestAutomationAPDomain', () => {
    cy.intercept('GET', routes.accesibleDomains).as('waitForDomainsLoad');
    cy.get('#domain-dropdown-button').click()
    cy.wait('@waitForDomainsLoad');
    cy.get('input[autocomplete="off"]').type('TestAutomation-AP').type('{enter}')
})

Cypress.Commands.add('RTUManager', () => {
    cy.get('[title="RTU"]').click()
})

Cypress.Commands.add('SearchRTU', (rtu) => {
    cy.get('[id="filterText-input"]').type(rtu)
    cy.get('[type="submit"]').click()
    cy.wait(2000)
    cy.get('[aria-label="Device id"]').eq(1).click()

})

Cypress.Commands.add('TransactionDetailsTab', () => {
    cy.contains('Transaction Details').click()
    cy.get('[aria-haspopup="listbox"]').click()
    cy.get('[data-value="48"]').click()
    cy.contains('Apply').click()
    cy.get('[role="table"]').should('exist')
})

Cypress.Commands.add('AssetSummaryNotLoad', () => {
    cy.contains('Domain').should('not.exist')
})

Cypress.Commands.add('AssetSummaryClickApplyButton', () => {
    cy.get('.MuiGrid-root > button[type="submit"]').click({ force: true })
})

Cypress.Commands.add('OpenAssetInformationByDefault', () => {

    cy.get('.MuiTableRow-root').eq(3).click()
    cy.findByText('Site Notes').should('be.visible');

})

Cypress.Commands.add('filtertext', (filter) => {
    cy.get('#filterText-input').type(filter)
    cy.contains('Apply').click()
})

Cypress.Commands.add('openAssetMetron', (filter) => {
    cy.get('[aria-label="RTU"]').eq(1).click({ force: true })
})

Cypress.Commands.add('open_RTU', (openTab) => {
    cy.get('[aria-controls="Rtu device id"]').click()
    cy.contains(openTab).click()
})

Cypress.Commands.add('dropdownItems', () => {
    cy.get('#status-input').click()
    cy.get('[role="listbox"]').contains('Complete').should('be.visible')
    cy.get('[role="listbox"]').contains('Failed').should('be.visible')
    cy.get('[role="listbox"]').contains('Initialized').should('be.visible')
    cy.get('[role="listbox"]').contains('Partial').should('be.visible')
    cy.get('[role="listbox"]').contains('Processing').should('be.visible')
})

Cypress.Commands.add('defaultfilter', () => {
    cy.get('#status-input').should('have.text', 'All')
    cy.get('#direction-input').should('have.text', 'Any')
    cy.get('#rowCount-input').should('have.value', '500')
})

Cypress.Commands.add('rowCount', () => {
    cy.get('#rowCount-input').clear().click().type('1')
    cy.contains('Apply').click({ force: true })
    cy.get('[aria-label="Status"]').eq(1).should('exist')
    cy.get('[aria-label="Status"]').eq(2).should('not.exist')
    cy.get('#rowCount-input').clear().type('20')
    cy.contains('Apply').click({ force: true })
    cy.wait(750)

})

Cypress.Commands.add('dateSelect', () => {

    cy.get('#startDate-input').clear().type('06/23/2022')
    cy.contains('Apply').click()
    cy.get('[aria-label="Created date"]').eq(1).should('include.text', '6/23/2022')
})

Cypress.Commands.add('deselectAll', () => {
    cy.get('[role="option"] .MuiButton-label').click()
    cy.contains('Apply').click({ force: true })

})

Cypress.Commands.add('selectFilter', (index) => {

    cy.get('[type="checkbox"]').eq(index).click({ force: true })
    cy.contains('Apply').click({ force: true })
    cy.wait(750)
})

Cypress.Commands.add('statusColumnValue', (text) => {

    cy.get('[aria-label="Status"]').eq(1).should('have.text', text)
})

Cypress.Commands.add('sortStatusColumn', () => {

    cy.get('[aria-label="Status"]').eq(0).click({ force: true })
})


Cypress.Commands.add('anyDirection', () => {
    cy.get('#direction-input').click({ force: true })
    cy.get('[data-value="-1"]').click({ force: true })
    cy.contains('Apply').click({ force: true })
    cy.get('[aria-label="Direction"]').eq(0).click({ force: true })
    // cy.get('[aria-label="Direction"]').eq(1).should('have.text', 'Inbound')
    cy.get('[aria-label="Direction"]').eq(0).click({ force: true })
    cy.get('[aria-label="Direction"]').eq(1).should('have.text', 'Outbound')
})

Cypress.Commands.add('selectDirection', (index, direction) => {

    cy.get('#direction-input').click({ force: true })
    cy.get(`[data-value="${index}"]`).click({ force: true })
    cy.contains('Apply').click({ force: true })
    cy.get('[aria-label="Direction"]').eq(1).should('have.text', direction)
})

Cypress.Commands.add('CreateProblemReportappears', () => {
    cy.intercept('POST', routes.getAssetSummaryByOptionUrl).as('records');
    cy.intercept('GET', routes.rtuManager).as('rtumanage');
    cy.filtertext('AMIAG AG Published DC TestAutomation')
    cy.wait('@records').its('response.statusCode').should('eq', 200)
    cy.openAssetMetron();
    cy.contains('[aria-label="Description"]', 'Level - Published DC').prev().click();
    cy.contains('[role="menuitem"]', 'Create Problem Report').should('exist').click();
    cy.pageHeader().should('have.text', 'Problem Report');
    // cy.get('#custom_transcend_logo_id').click({ force: true });
})

Cypress.Commands.add('openAssetAMIAGAGEventsTesting', (RTU) => {

    cy.get(RTU).eq(0).click({ force: true })
})

Cypress.Commands.add('checkCreatPRVisble', () => {

    cy.CreatPRVisbleOrNot('Level - no Event Rule Group', 'be.visible')
    cy.CreatPRVisbleOrNot('Total no Event Rule Group', 'not.be.visible')
    cy.CreatPRVisbleOrNot('Virtual', 'not.be.visible')
    cy.CreatPRVisbleOrNot('Level without RTU', 'not.be.visible')
})

Cypress.Commands.add('CreatPRVisbleOrNot', (DCName, visibility) => {

    cy.contains('[aria-label="Description"]', DCName).prev().click();
    cy.contains('[role="menuitem"]', 'Create Problem Report').should(visibility)
    cy.get('body').click(0, 0)

})

Cypress.Commands.add('openCreatePR', () => {

    cy.contains('[aria-label="Description"]', 'Level - no Event Rule Group').prev().click();
    cy.contains('[role="menuitem"]', 'Create Problem Report').click()
    cy.contains('[aria-label="Page header"]', 'Problem Report').should('be.visible')
})

Cypress.Commands.add('assetTitle', () => {
    cy.get('[aria-label="Page header"]')
})

Cypress.Commands.add('assetInfo', (index) => {
    cy.get('[aria-label="asset information list"] .MuiTypography-body1').eq(index)
})

Cypress.Commands.add('dcName', () => {
    cy.get('[aria-label="Description"]').eq(1)
})

Cypress.Commands.add('rtuDeviceId', () => {
    cy.get('[aria-label="RTU device ID"]').eq(1)
})

Cypress.Commands.add('SaveCloseBtn', () => {
    cy.contains('Save & Close').click({ force: true })
})

Cypress.Commands.add('DescreptionRequiredError', () => {
    cy.get('[id="problemReport.description-input-label"]')
        .parent('.MuiFormControl-root')
        .find('[id="problemReport.description-input-helper-text"]')
        .should("contain.text", "Required")
})

Cypress.Commands.add('addDescription', (description) => {
    const readingDateTime = moment().format('M/D/YYYY h:mm:ss A')
    cy.get('[id="problemReport.description-input"]').type(description)
})

Cypress.Commands.add('defaultImportance', (importance) => {
    cy.get('[id="problemReport.importanceLevelTypeId-input"]').should('contain.text', importance)
})

Cypress.Commands.add('importanceDropdownList', () => {
    cy.get('[id="problemReport.importanceLevelTypeId-input"]').click()
    cy.get('[data-value="0"]').should('include.text', 'Normal')
    cy.get('[data-value="1"]').should('include.text', 'Information')
    cy.get('[data-value="3"]').should('include.text', 'High')
    cy.get('[data-value="4"]').should('include.text', 'Urgent')
    cy.get('[data-value="2"]').should('include.text', 'Warning').click()
})

Cypress.Commands.add('reportBy', (report) => {
    cy.get('[id="problemReport.reportedBy-input"]').should('have.value', report)
})

Cypress.Commands.add('currentOpStatusEmpty', () => {
    cy.get('[id="problemReport.currentOpStatus-input"]').should('be.empty')
})

Cypress.Commands.add('enterCurrentOpStatus', (opStatus) => {
    cy.get('[id="problemReport.currentOpStatus-input"]').type(opStatus)
})

Cypress.Commands.add('resolutionEmpty', () => {
    cy.get('[id="problemReport.resolution-input"]').should('be.empty')
})

Cypress.Commands.add('enterResolution', (resolution) => {
    cy.get('[id="problemReport.resolution-input"]').type(resolution)
})

Cypress.Commands.add('workOrderEmpty', () => {
    cy.get('[id="problemReport.workOrder.workOrderNumber-input"]').should('be.empty')
})

Cypress.Commands.add('enterWorkOrder', (workOrder) => {
    cy.get('[id="problemReport.workOrder.workOrderNumber-input"]').type(workOrder)
})

Cypress.Commands.add('Date', (element, currentTime, currentTimePlus1) => {
    cy.contains('.MuiFormLabel-root', element)
        .parent()
        .find('.MuiInputBase-root')
        .find('.MuiInputAdornment-root')
        .find('button').click()

    cy.get('.MuiPickersCalendarHeader-switchHeader > button').eq(0).click()
    cy.contains('.MuiTypography-root.MuiTypography-body2', '25').click({force:true})
    cy.get('.MuiInputBase-root >  [aria-invalid="false"]').last()
        .invoke('attr', 'value').then((value) => {
            expect(value).to.be.oneOf([currentTime, currentTimePlus1])
            cy.get('body').click(0, 0)
        })
})

Cypress.Commands.add('addedTags', () => {
    cy.contains('.MuiChip-label', '#BULK').should('be.visible')
    cy.contains('.MuiChip-label', '#DE').should('be.visible')
})

Cypress.Commands.add('dropdownTags', () => {
    cy.get('[aria-autocomplete="list"]').click()
    cy.contains('#test').should('be.visible')

})

Cypress.Commands.add('staticDeviceId', () => {
    cy.get(':nth-child(5) > .MuiListItem-root > .MuiGrid-container > .MuiGrid-grid-xs-7 > .MuiTypography-root')
        .not('.MuiInput-formControl')
})

Cypress.Commands.add('assSummaryPageAppears', () => {
    cy.contains('Save Changes?').should('be.visible')
    cy.contains('Discard & Exit').click({force:true})
})

Cypress.Commands.add('openProblemReport', () => {
    cy.get('[aria-label="Ship To"]').eq(1).click()
})

Cypress.Commands.add('problemReportStatus', (prstatus) => {
    cy.get('.MuiChip-labelSmall').should('have.text', prstatus)
})

Cypress.Commands.add('verifyDescription', (description) => {
    cy.get('[id="description-input"]').invoke('attr', 'value').then((value) => {
        expect(value).to.include(description)
    })
})

Cypress.Commands.add('importanceSaved', (importance) => {
    cy.get('[id="importanceLevelTypeId-input"]').should('include.text', importance)
})

Cypress.Commands.add('reportedBySaved', (reported) => {
    cy.get('[id="reportedBy-input"]').should('have.value', reported)
})

Cypress.Commands.add('currentOpStatusSaved', (opStatus) => {
    cy.get('[id="currentOpStatus-input"]').should('contain.text', opStatus)
})

Cypress.Commands.add('resolutionSaved', (resolution) => {
    cy.get('[id="resolution-input"]').should('contain.text', resolution)
})

Cypress.Commands.add('workOrderSaved', (workOrder) => {
    cy.get('[id="workOrder.workOrderNumber-input"]').should('have.value', workOrder)
})

Cypress.Commands.add('problemNumber', (PRnumber) => {
    cy.get('[aria-label="Page header"]').should('contain.text', PRnumber)

})

Cypress.Commands.add('activityLog', () => {
    cy.findAllByText('Test Automation - DO NOT DELETE').should('be.visible')
    cy.findAllByText('qa@TestAutomation').should('be.visible')
    cy.findAllByText('Activity Log').should('be.visible')
})

Cypress.Commands.add('createdBy', (userCreated, timeoriginal, timeplus1, timeplus2) => {

    cy.findAllByText('Created').parent().next().find('p').then(($span) => {
        const value = $span.text();
        const Data = value.split("by")
        var user = Data[1]
        var time = Data[0].split(':')
        var time1 = time[0] + ':' + time[1]

        expect(time1).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
        expect(user).to.include(userCreated)
    })
})

Cypress.Commands.add('lastUpdatedBy', () => {
    cy.get('.MuiGrid-grid-lg-9').last().should('contain.text', 'N/A')

})

Cypress.Commands.add('DCTriggeredPRPrimaryFaulty', () => {
    cy.get('tr td:nth-child(6)').each(($el, index) => {
        if ("Level - no Event Rule Group" == $el.text()) {
            cy.get(`[name="affectedDataChannels[${index}].isPrimary"]`).should('have.value', 'true');
            cy.get(`[name="affectedDataChannels[${index}].isFaulty"]`).should('have.value', 'true');
        }
    })
})

Cypress.Commands.add('DCMarkedFaulty', () => {
    cy.get('tr td:nth-child(3)').each(($el, index, $list) => {
        cy.get(`[name="affectedDataChannels[${index}].isFaulty"]`).should('have.value', 'true');
    })
})

Cypress.Commands.add('DCSameRTU', (RTU) => {
    cy.get('tr td:nth-child(6)').each(($el, index) => {
        const Description = $el.text();
        cy.contains(Description).next().should('have.text', RTU);
    })
})

Cypress.Commands.add('ClickAddNew', () => {
    cy.contains("Add New").click({ force: true });
})

Cypress.Commands.add('FilterDropDown', () => {
    cy.get("#filterColumn-input").should('have.text', 'Ship To');
})

Cypress.Commands.add('verifyFilterDropDown', () => {
    cy.get("#filterColumn-input").click({ force: true });
    cy.get('[data-value="0"]').should('be.visible').and('have.text', 'Ship To');
    cy.get('[data-value="1"]').should('be.visible').and('have.text', 'RTU');
    cy.get('[data-value="2"]').should('be.visible').and('have.text', 'Asset Title');
});

Cypress.Commands.add('SelectDropDownValue', (Value) => {
    cy.contains(Value).click({ force: true });
})

Cypress.Commands.add('SearchField', (Value) => {
    cy.get('[id="filterText-input"]').type(Value);
    cy.get('.MuiGrid-root > button[type="submit"]').click({ force: true });
})

Cypress.Commands.add('SelectItem', (RTU) => {
    cy.get('table').eq(1).find('tbody').find('tr > td').contains(RTU).parent().find('td').eq(0).click()
})

Cypress.Commands.add('AddSelected', () => {
    cy.contains("Add Selected").click({ force: true });
})

Cypress.Commands.add('NewDC', (RTU) => {
    cy.get('tr td:nth-child(7)').each(($el, index) => {
        if (RTU == $el.text()) {
            cy.contains($el.text()).and('have.text', RTU);
        }
    })
})

Cypress.Commands.add('NewDCPrimaryFaulty', (RTU) => {
    cy.get('tr td:nth-child(7)').each(($el, index) => {
        if (RTU == $el.text()) {
            cy.get(`[name="affectedDataChannels[${index}].isPrimary"]`).should('have.value', 'false');
            cy.get(`[name="affectedDataChannels[${index}].isFaulty"]`).should('have.value', 'false');
        }
    })
})

Cypress.Commands.add('ActivityLog', () => {

    cy.contains('No activity log found').should('be.visible');
    cy.get('textarea').last().should('have.attr', 'aria-invalid', 'false').click({ force: true }).type('Test');
    cy.contains("Save Note").click({ force: true });
    cy.contains('[aria-label="Note text"]', 'Test');
})


Cypress.Commands.add('DeleteFirstItem', () => {
    cy.get('table').eq(0).find('tbody > tr').find('td').find('input[value="false"]').eq(0).parentsUntil('td').parent().siblings().eq(5).invoke('text').then((nameDC) => {
        cy.get('table').eq(0).find('tbody > tr').find('td').contains(nameDC).siblings().eq(0).click();
        cy.findAllByText('Cancel').eq(1).click({ force: true });
        cy.contains(nameDC).should('exist');
        cy.get('table').eq(0).find('tbody > tr').find('td').contains(nameDC).siblings().eq(0).click();
        cy.get('div[class*="MuiBox-root"]').find('button').find('[class="MuiButton-label"]').contains('Delete').click();
        cy.contains(nameDC).should('not.exist');
    });
});

Cypress.Commands.add('clickOnMenuDataChannel', () => {
    cy.get('div[title="FF720550"]').eq(1).click({ force: true })

})

Cypress.Commands.add('getTheVariableAsset', () => {
    cy.get('.MuiGrid-zeroMinWidth > .MuiBox-root > .MuiTypography-root').then(function ($AssetTitle) {
        const Asset = $AssetTitle.text()
        cy.wrap(Asset).as('Asset')
    })
})

Cypress.Commands.add('getTheVariableUnits', () => {
    cy.get('.MuiList-root > :nth-child(1) > .MuiGrid-container > :nth-child(2) > .MuiTypography-root')
        .then(function ($businessUnit) {
            const unit = $businessUnit.text()
            cy.wrap(unit).as('unit')
        })
})

Cypress.Commands.add('getTheVariableRegion', () => {
    cy.get(':nth-child(3) > .MuiGrid-container > :nth-child(2)')
        .then(function ($region) {
            const reg = $region.text()
            cy.wrap(reg).as('reg')
        })
})

Cypress.Commands.add('getTheVariableDataChannel', () => {
    cy.get(':nth-child(1) > [aria-label="Description"] > .MuiTypography-root')
        .then(function ($dataChannel) {
            const dc = $dataChannel.text()
            cy.wrap(dc).as('dc')
        })
})

Cypress.Commands.add('getTheVariableRtu', () => {
    cy.get('.MuiTableBody-root > :nth-child(1) > [aria-label="RTU device ID"]')
        .then(function ($rtu) {
            const rt = $rtu.text()
            cy.wrap(rt).as('rt')
        })
})

Cypress.Commands.add('clickOnProblemReportFromTheMenu', () => {
    cy.get('[class="MuiButton-label"] [viewBox="0 0 25 24"]').first().click()
    cy.contains('Create Problem Report')
        .click()
})

Cypress.Commands.add('addPrName', () => {
    cy.get('[id="problemReport.description-input"]').type('Report')
})

Cypress.Commands.add('getTheVariablePrUnits', () => {
    cy.get('.MuiTypography-body1')
        .eq(9)
        .then(function ($prBusiness) {
            const prBs = $prBusiness.text()
            cy.log(prBs)
            cy.wrap(prBs).as('prBs')
        })
})

Cypress.Commands.add('getTheVariablePrRegion', () => {
    cy.get('.MuiTypography-body1')
        .eq(11)
        .then(function ($prRegion) {
            const prRe = $prRegion.text()
            cy.log(prRe)
            cy.wrap(prRe).as('prRe')
        })
})

Cypress.Commands.add('getTheVariablePrAsset', () => {
    cy.get('.MuiTypography-body1')
        .eq(11)
        .then(function ($prAsset) {
            const prAs = $prAsset.text()
            cy.log(prAs)
            cy.wrap(prAs).as('prAs')
        })
})

Cypress.Commands.add('getTheVariablePrRtu', () => {
    cy.get('.MuiTypography-body1')
        .eq(13)
        .then(function ($prRTU) {
            const prRt = $prRTU.text()
            cy.log(prRt)
            cy.wrap(prRt).as('prRt')
        })

})

Cypress.Commands.add('verifyPrAssetWithDetailAsset', () => {
    cy.get('@Asset').then(asset => {
        cy.get('@prAs').then(prAsset => {
            expect(asset).to.contain(prAsset)
        })
    })
})

Cypress.Commands.add('verifyPrUnitsWithDetailUnits', () => {
    cy.get('@unit').then(units => {
        cy.get('@prBs').then(prUnits => {
            expect(units).to.contain(prUnits)
        })
    })
})

Cypress.Commands.add('verifyPrRegionWithDetailRegion', () => {
    cy.get('@reg').then(reg => {
        cy.get('@prRe').then(prReg => {
            expect(reg).to.contain(prReg)
        })
    })
})

Cypress.Commands.add('verifyPrRtuWithDetailRtu', () => {
    cy.get('@rt').then(rtu => {
        cy.get('@prRt').then(prRtu => {
            expect(rtu).to.contain(prRtu)
        })
    })
})

Cypress.Commands.add('checkOpenDate', () => {
    cy.get(':nth-child(9) > .MuiListItem-root > .MuiGrid-container > .MuiGrid-grid-xs-7 > .MuiTypography-root')
        .invoke('text').then(actualDateText => {
            const dateTime = moment().format("M/D/YYYY")
            expect(actualDateText).to.include(dateTime)
        })
})

Cypress.Commands.add('checkboxDisableAutoClose', () => {
    cy.get('[id="problemReport.isDisableAutoClose-input"]').should('not.be.checked')
    cy.get('[id="problemReport.isDisableAutoClose-input"]').check({ force: true })

})

Cypress.Commands.add('checkPriorityDropdown', () => {
    cy.get('[aria-haspopup="listbox"]').eq(1)
        .then(function ($dis) {
            const di = $dis.text()
            cy.log(di)
            cy.get('[id="problemReport.statusInformation.customerPriorityTypeId-input"]')
                .should('have.attr', 'aria-disabled', 'true')
        })
})

Cypress.Commands.add('verifyCalendarBeBlank', () => {
    cy.get('[id="problemReport.statusInformation.fixDate-input"]')
        .should('have.attr', 'aria-invalid', 'false')
})

Cypress.Commands.add('selectCalendar', () => {
    cy.get('[style="flex: 1 0 auto;"] > .MuiBox-root > .MuiGrid-container > :nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputAdornment-root > .MuiButtonBase-root')
        .should('be.exist').click()
    cy.get('[class="MuiSvgIcon-root"]')
        .eq(18)
        .click()
})

Cypress.Commands.add('selectPrevMonth', () => {
    cy.get('.MuiPickersCalendarHeader-switchHeader > :nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root')
        .click()
})

Cypress.Commands.add('selectDate', (currentTime, currentTimePlus1) => {
    const readingDateTime = moment().format('h:mm A')
    cy.get('.MuiPickersCalendar-transitionContainer > :nth-child(1) > :nth-child(1) > Div > [tabindex="0"]').eq(0)
        .click({force:true})
    cy.get('.MuiInputBase-root >  [aria-invalid="false"]').last()
        .invoke('attr', 'value').then((value) => {
            expect(value).to.be.oneOf([currentTime, currentTimePlus1])
        })
})

Cypress.Commands.add('clickOnClear', () => {
    cy.get('[class="MuiButton-label"]').eq(5)
        .click()
})

Cypress.Commands.add('verifyThatDateIsEmpty', () => {
    cy.get('[class="MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedStart MuiInputBase-inputAdornedEnd"]')
        .should('have.attr', 'aria-invalid', 'false')
})

Cypress.Commands.add('clickOnCancel', () => {
    cy.get('[class="MuiButton-label"]').eq(4)
        .click()
})

Cypress.Commands.add('openCalendarAgainAndSelectDate', (currentTime, currentTimePlus1) => {
    // const readingDateTime = moment().format('h:mm A')
    cy.contains('.MuiFormLabel-root', 'Fix Date')
        .parent()
        .find('.MuiInputBase-root')
        .find('.MuiInputAdornment-root')
        .find('button').click()
    cy.get('.MuiPickersDay-daySelected').click()
    cy.get('.MuiInputBase-root >  [aria-invalid="false"]').last()
        .invoke('attr', 'value').then((value) => {
            expect(value).to.be.oneOf([currentTime, currentTimePlus1])
        })
})

Cypress.Commands.add('selectTime', () => {
    cy.get('[class="MuiIconButton-label"]')
        .last()
        .click()
    cy.get('ul.MuiList-root.MuiMenu-list.MuiList-padding > li:nth-of-type(9)').click()
})

Cypress.Commands.add('clickOnApply', () => {
    cy.get('.MuiGrid-container > :nth-child(3) > .MuiButtonBase-root').click()
})

Cypress.Commands.add('verifyTheDateMatched', () => {
    const dateTime = moment().add(1, 'minutes').format('YYYY-MM-DD')
    cy.log(dateTime)
    cy.get('[id="problemReport.statusInformation.fixDate-input"]')
        .should('contain.value', dateTime + ' ' + '04:00 AM')
})

Cypress.Commands.add('saveAndClose', () => {
    cy.get('.MuiBox-root > :nth-child(2) > .MuiButtonBase-root').click()
    cy.go('back');
})

Cypress.Commands.add('VerifylastUpdatedByDate', () => {
    cy.intercept('POST', routes.getAssetSummaryByOptionUrl).as('records');
    cy.intercept('GET', routes.rtuManager).as('rtumanage');
    cy.filtertext('H0000267')
    cy.wait('@records').its('response.statusCode').should('eq', 200)
    cy.openAssetMetron();
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })
    cy.get('#rtu-editor-tabpanel-configuration').contains('Last Updated').siblings().then(($span) => {
        const value = $span.text();
        const Date = value.split("by")
        expect(Date[0]).to.not.equal(null);
        expect(Date[1]).to.not.equal(null);
    })
})

Cypress.Commands.add('clickBackIcon', () => {
    cy.get('[aria-label="back"]').click()
})


Cypress.Commands.add('HornerNotesPanelEdit', () => {
    cy.intercept('POST', routes.getAssetSummaryByOptionUrl).as('records');
    cy.intercept('GET', routes.rtuManager).as('rtumanage');
    cy.filtertext('H0000267')
    cy.wait('@records').its('response.statusCode').should('eq', 200)
    cy.openAssetMetron();
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })
})

Cypress.Commands.add('ChangeInstallationDate', (timeoriginal, timeplus1, timeplus2) => {

    cy.intercept('GET', routes.retriveHorner).as('horner');
    cy.wait('@horner')
    cy.wait(2000)
    cy.contains('Notes').parent().siblings().find('button').click({ force: true });
    var todaydate = new Date();
    var filterdate = todaydate.toString().substring(0, 15);
    cy.get('[name="installationDate"]').clear().type(Cypress.moment().format('MM/DD/YYYY'))
    cy.get('[aria-label="change installation date"]').click({ force: true })
    cy.get('.MuiPickersDay-daySelected').click({ force: true })
    cy.get('body').click(0, 0)
    cy.contains('Save & Close').click({ force: true })
    cy.wait(750)
    cy.contains('Installation Date').siblings().should('have.text', filterdate);

    cy.get('[aria-label="back"]').click({ force: true })
    cy.wait(3000)
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })

    cy.wait(500)
    cy.contains('Last Updated').siblings().invoke('text').then((LastUpdated) => {
        const LastUpdatedtext = LastUpdated.split("by")
        var time = LastUpdatedtext[0].split(':')
        var LastUpdatedtime = time[0] + ':' + time[1]
        expect(LastUpdatedtime).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
        expect((LastUpdatedtext[1].toLowerCase()).replace('\u00A0', '').trim()).to.equal(Cypress.env('USERNAME').toLowerCase());
    })
})

Cypress.Commands.add('ChangeModelDescription', (timeoriginal, timeplus1, timeplus2) => {
    cy.intercept('GET', routes.retriveHorner).as('horner');
    cy.wait('@horner')
    cy.contains('Notes').parent().siblings().find('button').click({ force: true });
    cy.get('[name="modelDescription"]').clear().type('Model Description' + Date.now());
    cy.get('[name="modelDescription"]').invoke('attr', 'value').then((editdescription) => {
        cy.contains('Save & Close').click({ force: true });
        cy.wait(750)
        cy.contains('Model Description').siblings().should('have.text', editdescription);
    })

    cy.get('[aria-label="back"]').click({ force: true })
    cy.wait(3000)
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })

    cy.wait(500)
    cy.contains('Last Updated').siblings().invoke('text').then((LastUpdated) => {
        const LastUpdatedtext = LastUpdated.split("by")
        var time = LastUpdatedtext[0].split(':')
        var LastUpdatedtime = time[0] + ':' + time[1]
        expect(LastUpdatedtime).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
        expect((LastUpdatedtext[1].toLowerCase()).replace('\u00A0', '').trim()).to.equal(Cypress.env('USERNAME').toLowerCase());
    })
})

Cypress.Commands.add('ChangeFunctionalLocation', (timeoriginal, timeplus1, timeplus2) => {
    cy.intercept('GET', routes.retriveHorner).as('horner');
    cy.wait('@horner')
    cy.contains('Notes').parent().siblings().find('button').click({ force: true });
    cy.get('[name="functionalLocation"]').clear().type('Functional' + Date.now());
    cy.get('[name="functionalLocation"]').invoke('attr', 'value').then((editfunctionalLocation) => {
        cy.contains('Save & Close').click({ force: true });
        cy.wait(750)
        cy.contains('Functional Location').siblings().should('have.text', editfunctionalLocation);
    })

    cy.get('[aria-label="back"]').click({ force: true })
    cy.wait(3000)
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })

    cy.wait(500)
    cy.contains('Last Updated').siblings().invoke('text').then((LastUpdated) => {
        const LastUpdatedtext = LastUpdated.split("by")
        var time = LastUpdatedtext[0].split(':')
        var LastUpdatedtime = time[0] + ':' + time[1]
        expect(LastUpdatedtime).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
        expect((LastUpdatedtext[1].toLowerCase()).replace('\u00A0', '').trim()).to.equal(Cypress.env('USERNAME').toLowerCase());
    })
})

Cypress.Commands.add('ChangeSIMICCID', (timeoriginal, timeplus1, timeplus2) => {
    cy.intercept('GET', routes.retriveHorner).as('horner');
    cy.wait('@horner')
    cy.contains('Notes').parent().siblings().find('button').click({ force: true });
    cy.get('[name="simIccId"]').clear().type(Date.now());
    cy.get('[name="simIccId"]').invoke('attr', 'value').then((editSIMICCID) => {
        cy.contains('Save & Close').click({ force: true });
        cy.wait(750)
        cy.contains('SIM ICCID').siblings().should('have.text', editSIMICCID);
    })

    cy.get('[aria-label="back"]').click({ force: true })
    cy.wait(3000)
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })

    cy.wait(500)
    cy.contains('Last Updated').siblings().invoke('text').then((LastUpdated) => {
        const LastUpdatedtext = LastUpdated.split("by")
        var time = LastUpdatedtext[0].split(':')
        var LastUpdatedtime = time[0] + ':' + time[1]
        expect(LastUpdatedtime).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
        expect((LastUpdatedtext[1].toLowerCase()).replace('\u00A0', '').trim()).to.equal(Cypress.env('USERNAME').toLowerCase());
    })
})
var temNotes = `"18 - In Standby
19 - Pump Running
0 - Loss of Power/E-Stop Pushed
2 - Low Instrument  Nitrogen Warning
3 - Low Instrument  Nitrogen Alarm
4 - Compressor Vibration warning alarm (no shutdown)
5 - Compressor Vibration alarm
6 - Out of Standby
7 - High Pump Temperature alarm
8 - CHC Max Run alarm
9 - High Discharge Temperature alarm
10 - High Discharge Pressure alarm
11 - Low Temperature Past Vaporizers
12 - Cold End Maintenance Warning
13 - Motor Starter Failure alarm
14 - Pressure Transmitter Failure alarm
15 - Discharge Temperature Failure
16 - Tank Pressure Transmitter Failure
17 - Combustible Gas Detected (see *Tech notes)
18 - In Standby
19 - Pump Running
20 - Cool Down Failure Alarm"`
Cypress.Commands.add('ChangeTemporaryNotes', (timeoriginal, timeplus1, timeplus2) => {
    cy.intercept('GET', routes.retriveHorner).as('horner');
    cy.wait('@horner')
    cy.wait(2000)
    cy.contains('Notes').parent().siblings().find('button').click({ force: true });
    cy.get('[name="temporaryNotes"]').clear().type(temNotes);
    cy.get('[name="temporaryNotes"]').invoke('text').then((edittemporaryNotes) => {
        cy.contains('Save & Close').click({ force: true });
        cy.wait(750)
        cy.contains('Temporary Notes').siblings().should('not.be.singleLine')
    })

    cy.get('[aria-label="back"]').click({ force: true })
    cy.wait(3000)
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })

    cy.wait(500)
    cy.contains('Last Updated').siblings().invoke('text').then((LastUpdated) => {
        const LastUpdatedtext = LastUpdated.split("by")
        var time = LastUpdatedtext[0].split(':')
        var LastUpdatedtime = time[0] + ':' + time[1]
        expect(LastUpdatedtime).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
        expect((LastUpdatedtext[1].toLowerCase()).replace('\u00A0', '').trim()).to.equal(Cypress.env('USERNAME').toLowerCase());
    })
})

Cypress.Commands.add('ChangeNotes', (timeoriginal, timeplus1, timeplus2) => {
    cy.intercept('GET', routes.retriveHorner).as('horner');
    cy.wait('@horner')
    cy.contains('Notes').parent().siblings().find('button').click({ force: true });
    cy.get('[name="temporaryNotes"]').clear().type(temNotes);
    cy.get('[name="permanentNotes"]').invoke('text').then((editChangeNotes) => {
        cy.contains('Save & Close').click({ force: true });
        cy.wait(750)
        cy.contains('Temporary Notes').siblings().should('not.be.singleLine')
    })

    cy.get('[aria-label="back"]').click({ force: true })
    cy.wait(3000)
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })

    cy.wait(500)
    cy.contains('Last Updated').siblings().invoke('text').then((LastUpdated) => {
        const LastUpdatedtext = LastUpdated.split("by")
        var time = LastUpdatedtext[0].split(':')
        var LastUpdatedtime = time[0] + ':' + time[1]
        expect(LastUpdatedtime).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
        expect((LastUpdatedtext[1].toLowerCase()).replace('\u00A0', '').trim()).to.equal(Cypress.env('USERNAME').toLowerCase());
    })
})

Cypress.Commands.add('ChangeDateDescriptionlLocationSIMTemporaryNotes', (timeoriginal, timeplus1, timeplus2) => {
    cy.intercept('GET', routes.retriveHorner).as('horner');
    cy.wait('@horner')
    cy.contains('Notes').parent().siblings().find('button').click({ force: true });
    var todaydate = new Date();
    var filterdate = todaydate.toString().substring(0, 15);
    cy.get('[name="installationDate"]').clear().type(Cypress.moment().format('MM/DD/YYYY'));
    cy.get('[aria-label="change installation date"]').click({ force: true });
    cy.get('.MuiPickersDay-daySelected').click({ force: true });
    cy.get('body').click(0, 0);
    cy.get('[name="modelDescription"]').clear().type('Model Description' + Date.now());
    cy.get('[name="functionalLocation"]').clear().type('Functional' + Date.now());
    cy.get('[name="simIccId"]').clear().type(Date.now());
    cy.get('[name="temporaryNotes"]').clear().type('Temporary Notes' + Date.now());
    cy.get('[name="permanentNotes"]').clear().type('Permanent Notes' + Date.now());
    cy.get('[name="modelDescription"]').invoke('attr', 'value').then((editdescription) => {
        cy.get('[name="functionalLocation"]').invoke('attr', 'value').then((editfunctionalLocation) => {
            cy.get('[name="simIccId"]').invoke('attr', 'value').then((editSIMICCID) => {
                cy.get('[name="temporaryNotes"]').invoke('text').then((edittemporaryNotes) => {
                    cy.get('[name="permanentNotes"]').invoke('text').then((editChangeNotes) => {
                        cy.contains('Save & Close').click({ force: true });
                        cy.wait(750);
                        cy.contains('Installation Date').siblings().should('have.text', filterdate);
                        cy.contains('Model Description').siblings().should('have.text', editdescription);
                        cy.contains('Functional Location').siblings().should('have.text', editfunctionalLocation);
                        cy.contains('SIM ICCID').siblings().should('have.text', editSIMICCID);
                        cy.contains('Temporary Notes').siblings().should('have.text', edittemporaryNotes);
                        cy.contains('Permanent Notes').siblings().should('have.text', editChangeNotes);
                    })
                })
            })
        })
    })

    cy.get('[aria-label="back"]').click({ force: true })
    cy.wait(3000)
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })

    cy.wait(500)
    cy.contains('Last Updated').siblings().invoke('text').then((LastUpdated) => {
        const LastUpdatedtext = LastUpdated.split("by")
        var time = LastUpdatedtext[0].split(':')
        var LastUpdatedtime = time[0] + ':' + time[1]
        expect(LastUpdatedtime).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
        expect((LastUpdatedtext[1].toLowerCase()).replace('\u00A0', '').trim()).to.equal(Cypress.env('USERNAME').toLowerCase());
    })
})

Cypress.Commands.add('ClearDateDescriptionlLocationSIMTemporaryNotes', (timeoriginal, timeplus1, timeplus2) => {
    cy.intercept('GET', routes.retriveHorner).as('horner');
    cy.wait('@horner')
    cy.contains('Notes').parent().siblings().find('button').click({ force: true });
    cy.get('[name="modelDescription"]').clear()
    cy.get('[name="functionalLocation"]').clear()
    cy.get('[name="simIccId"]').clear()
    cy.get('[name="temporaryNotes"]').clear()
    cy.get('[name="permanentNotes"]').clear()
    cy.get('[name="temporaryNotes"]').clear()
    cy.get('[name="permanentNotes"]').clear()
    cy.contains('Save & Close').click({ force: true });
    cy.wait(750);
    cy.contains('Model Description').siblings().should('have.text', '-');
    cy.contains('Functional Location').siblings().should('have.text', '-');
    cy.contains('SIM ICCID').siblings().should('have.text', '-');
    cy.contains('Temporary Notes').siblings().should('have.text', '-');
    cy.contains('Permanent Notes').siblings().should('have.text', '-');

    cy.get('[aria-label="back"]').click({ force: true })
    cy.wait(3000)
    cy.get('[aria-controls="Rtu device id"]').click({ force: true })

    cy.wait(500)
    cy.contains('Last Updated').siblings().invoke('text').then((LastUpdated) => {
        const LastUpdatedtext = LastUpdated.split("by")
        var time = LastUpdatedtext[0].split(':')
        var LastUpdatedtime = time[0] + ':' + time[1]
        expect(LastUpdatedtime).to.be.oneOf([timeoriginal, timeplus1, timeplus2])
        expect((LastUpdatedtext[1].toLowerCase()).replace('\u00A0', '').trim()).to.equal(Cypress.env('USERNAME').toLowerCase());
    })
})


Cypress.Commands.add('OpenRTUEditor', (RTU) => {

    cy.get('[id="app-picker-button"]').click({force:true});
    cy.findAllByText('Administration').click({force:true});
    cy.get('[title="RTU"]').find('a > span').click({force:true});
    cy.wait(2000)
    cy.filtertext(RTU)
    cy.findAllByText('Apply').click({force:true});
    cy.wait(2000)
    cy.get('[aria-label="Device id"]').eq(1).click({ force: true })
    // cy.get('[aria-controls="Rtu device id"]').click({ force: true })
})

Cypress.Commands.add('openTChannelTemplate', () => {
    cy.findAllByText("Transaction Details").parent().prev().click()
    cy.wait(3000)
    cy.findAllByText("Transaction Channels")
    cy.findAllByText("Transaction Channels").parent().next().click();
})

Cypress.Commands.add('selectTChannelTemplate', (template) => {
    cy.wait(3000)
    cy.contains('Transaction Message Template').parent().next().click();
    cy.contains(template).click({ force: true });
    cy.wait(750)
    cy.get('body').click(0, 0)
    cy.contains('Apply').click({ force: true });
    cy.wait(3000)
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
})

Cypress.Commands.add('TChannelVerifyAllFields', () => {
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').should('have.value', 'Test');
        cy.get('td').eq(3).find('input').should('have.value', 'Blend');
        cy.get('td').eq(4).find('input').should('have.value', 'T1');
        cy.get('td').eq(5).find('input').should('have.value', '0');
        cy.get('td').eq(6).find('input').should('have.value', '5');
        cy.get('td').eq(7).find('input').should('have.value', '0');
        cy.get('td').eq(8).find('input').should('have.value', '10');
        cy.get('td').eq(10).find('input').should('have.value', '0');
        cy.get('td').eq(11).find('input').should('have.value', 'false');
    })
})

Cypress.Commands.add('VerifyTChannelpanel_FIELDTYPE', () => {
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(3).click();
    })
    cy.get('[role="listbox"]').get('[data-value="Space1"]').should('have.text', '1 Space');
    cy.get('[role="listbox"]').get('[data-value="Space2"]').should('have.text', '2 Spaces');
    cy.get('[role="listbox"]').get('[data-value="Space3"]').should('have.text', '3 Spaces');
    cy.get('[role="listbox"]').get('[data-value="Space4"]').should('have.text', '4 Spaces');
    cy.get('[role="listbox"]').get('[data-value="Integer"]').should('have.text', 'Integer');
    cy.get('[role="listbox"]').get('[data-value="StartTime"]').should('have.text', 'Start Time');
    cy.get('[role="listbox"]').get('[data-value="UnsignedInteger"]').should('have.text', 'Unsigned Integer');
    cy.get('[role="listbox"]').get('[data-value="Unused"]').should('have.text', 'Unused');
    cy.get('body').click(0, 0)
})

Cypress.Commands.add('VerifyTChannelpanel_CHANNEL', () => {
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(4).click();
    })
    for (var index = 1; index < 31; index++) {
        cy.get('[role="listbox"]').get('[data-value="T' + index + '"]').should('have.text', index);
    }
    cy.get('body').click(0, 0)
})

Cypress.Commands.add('VerifyTChannelpanel', () => {
    const Array = ['1 Space', '2 Spaces', '3 Spaces', '4 Spaces', 'Start Time', 'Unused']
    const data_value = ['Space1', 'Space2', 'Space3', 'Space4', 'StartTime', 'Unused']
    for (var index = 0; index < 6; index++) {
        cy.get('tbody > tr').eq(0).within(() => {
            cy.get('td').eq(3).click();
            cy.wait(1000);
        })
        cy.get('[role="listbox"]').get('[data-value="' + data_value[index] + '"]').should('have.text', Array[index]).click();
        cy.wait(1000);
        cy.get('td').eq(5).find('input').should('be.disabled');
        cy.get('td').eq(6).find('input').should('be.disabled');
        cy.get('td').eq(7).find('input').should('be.disabled');
        cy.get('td').eq(8).find('input').should('be.disabled');
        cy.get('td').eq(9).find('input').should('not.exist');
        cy.get('td').eq(10).find('input').should('be.disabled');
    }
})

Cypress.Commands.add('VerifyTChannelpanel_UOM', () => {
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(3).click();
    })
    cy.get('[role="listbox"]').get('[data-value="Integer"]').should('have.text', 'Integer').click();
    cy.get('[id="channels.0.unitOfMeasure"]').clear().type('Test UOM');
    cy.get('[id="channels.0.unitOfMeasure"]').should('have.value', 'Test UOM');
    cy.get('[aria-label="Clear"]').click();
    cy.get('body').click(0, 0)
    cy.get('[id="channels.0.unitOfMeasure"]').click();
    cy.get('[id="channels.0.unitOfMeasure-option-0"]').should('have.text', '%');
    cy.get('[id="channels.0.unitOfMeasure-option-1"]').should('have.text', 'Bar');
    cy.get('[id="channels.0.unitOfMeasure-option-2"]').should('have.text', 'kg');
    cy.get('[id="channels.0.unitOfMeasure-option-3"]').should('have.text', 'Kg/min');
    cy.get('[id="channels.0.unitOfMeasure-option-4"]').should('have.text', 'kgs');
    cy.get('[id="channels.0.unitOfMeasure-option-5"]').should('have.text', 'l');
    cy.get('[id="channels.0.unitOfMeasure-option-6"]').should('have.text', 'MPa');
    cy.get('[id="channels.0.unitOfMeasure-option-7"]').should('have.text', '°C');
    cy.get('[id="channels.0.unitOfMeasure-option-8"]').should('have.text', 'Km');
    cy.get('[id="channels.0.unitOfMeasure-option-9"]').should('have.text', 'seconds');
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(10).find('input').should('have.value', '0');
        cy.get('td').eq(11).find('input').should('have.value', 'false').click();
        cy.get('td').eq(11).find('input').should('have.value', 'true').click();
    })
})

const MaxLength80 = "{}yIxxcGJp2PgfiKwKzJZ3YKHFcjVQqA@#$%&'()*+,-.!<>£=/:;?[^_|~¥§àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿćĉċčēĕėęěĝğġģĥħĩīĭĵķĸĺļľñņňŋöōŏőœŕŗřßśŝşšţťũūŬŭůűųŵŷźżžāăอักษรไทย한국어조선말汉语漢語日本語0123456789";
Cypress.Commands.add('TChannelSave', () => {
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').clear().type(MaxLength80);
        cy.get('td').eq(3).click();
    })
    cy.get('[role="listbox"]').get('[data-value="Integer"]').should('have.text', 'Integer').click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(4).click();
    })
    cy.get('[role="listbox"]').get('[data-value="T1"]').should('have.text', 1).click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(5).find('input').clear().type(0.0);
        cy.get('td').eq(6).find('input').clear().type(1.0);
        cy.get('td').eq(7).find('input').clear().type(0.0);
        cy.get('td').eq(8).find('input').clear().type(1.0);
    })
    cy.get('[id="channels.0.unitOfMeasure"]').clear().type('Test UOM');
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(10).find('input').clear().type(6);
    })
    cy.intercept('PUT', routes.retrivetchannels).as('retrivetchannels');
    cy.findAllByText('Save').click();
    cy.wait('@retrivetchannels').its('response.statusCode').should('eq', 400)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(10).find('input').should('have.value', '6').clear().type(0);
    })
    cy.findAllByText('Save').click();
    cy.findAllByText('Changes saved successfully')
    cy.get('[aria-label="back"]').click();
})

Cypress.Commands.add('TChannelVerifySave', () => {
    cy.findAllByText("Transaction Channels").parent().next().click();
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').should('have.value', MaxLength80);
        cy.get('td').eq(3).find('input').should('have.value', 'Integer');
        cy.get('td').eq(4).find('input').should('have.value', 'T1');
        cy.get('td').eq(5).find('input').should('have.value', '0');
        cy.get('td').eq(6).find('input').should('have.value', '1');
        cy.get('td').eq(7).find('input').should('have.value', '0');
        cy.get('td').eq(8).find('input').should('have.value', '1');
        cy.get('td').eq(9).find('input').should('have.value', 'Test UOM');
        cy.get('td').eq(10).find('input').should('have.value', '0');
        cy.get('td').eq(11).find('input').should('have.value', 'false');
    })
})
Cypress.Commands.add('TChannelSaveClose', () => {
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').clear().type("DESCRIPTION 1");
        cy.get('td').eq(3).click();
    })
    cy.get('[role="listbox"]').get('[data-value="Integer"]').should('have.text', 'Integer').click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(4).click();
    })
    cy.get('[role="listbox"]').get('[data-value="T1"]').should('have.text', 1).click();
    cy.wait(1000);
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(5).find('input').clear().type(0);
        cy.get('td').eq(6).find('input').clear().type(1);
        cy.get('td').eq(7).find('input').clear().type(0);
        cy.get('td').eq(8).find('input').clear().type(1);
    })
    cy.get('[id="channels.0.unitOfMeasure"]').clear().type('Test UOM');
    cy.wait(1000);
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(10).find('input').clear().type(0);
    })
    cy.findAllByText('Save & Close').click();
    cy.findAllByText('Changes saved successfully')
})

Cypress.Commands.add('TChannelVerifySaveClose', () => {
    cy.findAllByText("Transaction Channels").parent().next().click();
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
    cy.wait(1000);
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').should('have.value', 'DESCRIPTION 1');
        cy.get('td').eq(3).find('input').should('have.value', 'Integer');
        cy.get('td').eq(4).find('input').should('have.value', 'T1');
        cy.get('td').eq(5).find('input').should('have.value', '0');
        cy.get('td').eq(6).find('input').should('have.value', '1');
        cy.get('td').eq(7).find('input').should('have.value', '0');
        cy.get('td').eq(8).find('input').should('have.value', '1');
        cy.get('td').eq(9).find('input').should('have.value', 'Test UOM');
        cy.get('td').eq(10).find('input').should('have.value', '0');
        cy.get('td').eq(11).find('input').should('have.value', 'false');
    })
})

Cypress.Commands.add('TChannelCancel', () => {
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').clear().type("Test 1");
        cy.get('td').eq(3).click();
        cy.wait(1000);
    })
    cy.get('[role="listbox"]').get('[data-value="UnsignedInteger"]').should('have.text', 'Unsigned Integer').click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(4).click();
    })
    cy.get('[role="listbox"]').get('[data-value="T1"]').should('have.text', 1).click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(5).find('input').clear().type(1);
        cy.get('td').eq(6).find('input').clear().type(1);
        cy.get('td').eq(7).find('input').clear().type(1);
        cy.get('td').eq(8).find('input').clear().type(1);
    })
    cy.get('[id="channels.0.unitOfMeasure"]').clear().type('Testing UOM');
    cy.wait(1000);
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(10).find('input').clear().type(6);
    })
    cy.findAllByText('Cancel').click();
})

Cypress.Commands.add('TChannelVerifyCancel', () => {
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').should('have.value', 'DESCRIPTION 1');
        cy.get('td').eq(3).find('input').should('have.value', 'Integer');
        cy.get('td').eq(4).find('input').should('have.value', 'T1');
        cy.get('td').eq(5).find('input').should('have.value', '0');
        cy.get('td').eq(6).find('input').should('have.value', '1');
        cy.get('td').eq(7).find('input').should('have.value', '0');
        cy.get('td').eq(8).find('input').should('have.value', '1');
        // cy.get('td').eq(9).find('input').should('have.value', 'Test UOM');
        cy.get('td').eq(10).find('input').should('have.value', '0');
        cy.get('td').eq(11).find('input').should('have.value', 'false');
    })
})

Cypress.Commands.add('TChannelAddRow', () => {
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
    cy.findAllByText('Add T Channel').click({ force: true });
    cy.wait(1000)
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(2).find('input').clear().type("New Row");
        cy.get('td').eq(3).click();
    })
    cy.get('[role="listbox"]').get('[data-value="Integer"]').should('have.text', 'Integer').click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(4).click();
    })
    cy.get('[role="listbox"]').get('[data-value="T2"]').should('have.text', 2).click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(5).find('input').clear().type(0);
        cy.get('td').eq(6).find('input').clear().type(1);
        cy.get('td').eq(7).find('input').clear().type(0);
        cy.get('td').eq(8).find('input').clear().type(1);
    })
    cy.get('[id="channels.1.unitOfMeasure"]').clear().type('New UOM');
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(10).find('input').clear().type(0);
    })
    cy.findAllByText('Save & Close').click();
    cy.findAllByText('Changes saved successfully')
    cy.findAllByText("Transaction Channels").parent().next().click();
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
    cy.wait(1000)
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(2).find('input').should('have.value', 'New Row');
        cy.get('td').eq(3).find('input').should('have.value', 'Integer');
        cy.get('td').eq(4).find('input').should('have.value', 'T2');
        cy.get('td').eq(5).find('input').should('have.value', '0');
        cy.get('td').eq(6).find('input').should('have.value', '1');
        cy.get('td').eq(7).find('input').should('have.value', '0');
        cy.get('td').eq(8).find('input').should('have.value', '1');
        cy.get('td').eq(9).find('input').should('have.value', 'New UOM');
        cy.get('td').eq(10).find('input').should('have.value', '0');
        cy.get('td').eq(11).find('input').should('have.value', 'true');
    })
})
Cypress.Commands.add('TChannelMove', () => {
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127');
    cy.wait(2000);
    cy.get('[data-rbd-draggable-id="0"] > :nth-child(1)').dragAndDrop('[data-rbd-draggable-id="0"] > :nth-child(1)', '[data-rbd-draggable-id="1"] > :nth-child(1)');
    cy.wait(3000);
    cy.findAllByText('Save & Close').click();
    cy.findAllByText('Changes saved successfully');
    cy.findAllByText("Transaction Channels").parent().next().click();
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127');
    cy.wait(3000);
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').should('have.value', 'New Row');
        cy.get('td').eq(3).find('input').should('have.value', 'Integer');
        cy.get('td').eq(4).find('input').should('have.value', 'T2');
        cy.get('td').eq(5).find('input').should('have.value', '0');
        cy.get('td').eq(6).find('input').should('have.value', '1');
        cy.get('td').eq(7).find('input').should('have.value', '0');
        cy.get('td').eq(8).find('input').should('have.value', '1');
        // cy.get('td').eq(9).find('input').should('have.value', 'New UOM');
        cy.get('td').eq(10).find('input').should('have.value', '0');
        cy.get('td').eq(11).find('input').should('have.value', 'true');
    })
});

Cypress.Commands.add('TChannelDeleteRow', () => {
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
    cy.wait(2000)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(1).click();
    })
    cy.findAllByText('Delete Selected').click();
    cy.findAllByText('Save & Close').click();
    cy.findAllByText('Changes saved successfully')
    cy.findAllByText("Transaction Channels").parent().next().click();
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
    cy.wait(2000)
    cy.get('tbody > tr').eq(1).should('not.exist');
})


Cypress.Commands.add('TChannelEditAddRow', () => {
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').clear().type("Update Row 1");
        cy.get('td').eq(3).click();
    })
    cy.get('[role="listbox"]').get('[data-value="Integer"]').should('have.text', 'Integer').click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(4).click();
    })
    cy.get('[role="listbox"]').get('[data-value="T1"]').should('have.text', 1).click();
    cy.wait(1000);
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(5).find('input').clear().type(0);
        cy.get('td').eq(6).find('input').clear().type(1);
        cy.get('td').eq(7).find('input').clear().type(0);
        cy.get('td').eq(8).find('input').clear().type(1);
    })
    cy.get('[id="channels.0.unitOfMeasure"]').clear().type('Test 1 UOM');
    cy.wait(1000);
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(10).find('input').clear().type(0);
    })
    cy.wait(1000)
    cy.findAllByText('Add T Channel').click({ force: true });
    cy.wait(1000)
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(2).find('input').clear().type("New Row 2");
        cy.get('td').eq(3).click();
    })
    cy.get('[role="listbox"]').get('[data-value="Integer"]').should('have.text', 'Integer').click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(4).click();
    })
    cy.get('[role="listbox"]').get('[data-value="T2"]').should('have.text', 2).click();
    cy.get('body').click(0, 0)
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(5).find('input').clear().type(0);
        cy.get('td').eq(6).find('input').clear().type(1);
        cy.get('td').eq(7).find('input').clear().type(0);
        cy.get('td').eq(8).find('input').clear().type(1);
    })
    cy.get('[id="channels.1.unitOfMeasure"]').clear().type('New UOM');
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(10).find('input').clear().type(0);
    })
})


Cypress.Commands.add('TChannelSaveAsNewTemplate', (currentDate) => {
    cy.findAllByText('Save As New Template').click();
    cy.findAllByText('Save as New Template').parent().parent().next().find('input').clear().type('TransactionforTest ' + currentDate);
    cy.findAllByText('Save as New Template').parent().parent().next().next().find('button').click({ force: true });
    cy.wait(3000)
})

Cypress.Commands.add('TChannelVerifyNewTemplate', (currentDate) => {
    cy.get('[title="Edit Transaction Channels - H0000127"]').should('have.text', 'Edit Transaction Channels - H0000127')
    cy.wait(1000)
    cy.get('tbody > tr').eq(0).within(() => {
        cy.get('td').eq(2).find('input').should('have.value', 'Update Row 1');
        cy.get('td').eq(3).find('input').should('have.value', 'Integer');
        cy.get('td').eq(4).find('input').should('have.value', 'T1');
        cy.get('td').eq(5).find('input').should('have.value', '0');
        cy.get('td').eq(6).find('input').should('have.value', '1');
        cy.get('td').eq(7).find('input').should('have.value', '0');
        cy.get('td').eq(8).find('input').should('have.value', '1');
        cy.get('td').eq(9).find('input').should('have.value', 'Test 1 UOM');
        cy.get('td').eq(10).find('input').should('have.value', '0');
        cy.get('td').eq(11).find('input').should('have.value', 'false');
    })
    cy.get('tbody > tr').eq(1).within(() => {
        cy.get('td').eq(2).find('input').should('have.value', 'New Row 2');
        cy.get('td').eq(3).find('input').should('have.value', 'Integer');
        cy.get('td').eq(4).find('input').should('have.value', 'T2');
        cy.get('td').eq(5).find('input').should('have.value', '0');
        cy.get('td').eq(6).find('input').should('have.value', '1');
        cy.get('td').eq(7).find('input').should('have.value', '0');
        cy.get('td').eq(8).find('input').should('have.value', '1');
        cy.get('td').eq(9).find('input').should('have.value', 'New UOM');
        cy.get('td').eq(10).find('input').should('have.value', '0');
        cy.get('td').eq(11).find('input').should('have.value', 'true');
    })
})

Cypress.Commands.add('editGeneralInfo', () => {
    cy.contains('General Information').eq(0).parent().siblings().find('button').click({ force: true });
})

Cypress.Commands.add('verifyHardwareDeviceID', () => {
    cy.get('.MuiGrid-align-items-xs-center').last().find('p').contains('Device Id').parent().siblings().find('p').eq(0).then((deviceID) =>{
        const text = deviceID.text()
        expect(text).to.eql('AP1000000M2110191155')
    })
    cy.get('.MuiGrid-align-items-xs-center').last().find('p').contains('Hardware').parent().siblings().find('p').eq(2).then((deviceID) =>{
        const text = deviceID.text()
        expect(text).to.eql('Metron 2')
    })
})

Cypress.Commands.add('initialization', () => {
    cy.get('[id="description-textbox"]').clear().type('description1-30529')
    cy.get('[id="rtuPollScheduleGroupId-dropdown"]').click()
    cy.get('[data-value="0e634917-0a9a-ec11-86df-00155d55772b"]').click()
    cy.get('[id="pollFilterId-dropdown"]').click()
    cy.get('[data-value="1"]').click()
})