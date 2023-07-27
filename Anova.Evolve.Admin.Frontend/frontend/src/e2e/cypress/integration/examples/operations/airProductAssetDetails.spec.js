const routes = require('../../../fixtures/routes.json');
import '@testing-library/cypress/add-commands';
import UtilFunctions from '../../../support/utils/UtilFunctions';
const utilFunctions = new UtilFunctions();
import moment from 'moment';
const currentDateTime = moment().format('M/D/YYYY hh:mm:ss A')
var Description = "Manual Problem Report" + currentDateTime;
var defImportance = 'High';
var reportBy = 'qa@TestAutomation';
var opStatus = 'Running'
var resolution = 'none';
var workOrder = '1234';
let createPR = null;

describe('Asset Details Air Products', function () {
    before(function () {
        cy.login();
        cy.TestAutomationAPDomain()
    })

    beforeEach(function () {

        cy.viewport(1440, 900);
        // Preserve only the session cookie in every test
        Cypress.Cookies.defaults({
            preserve: (cookie) => {
                return cookie && cookie.name === '.AspNetCore.Session';
            },
        });
        cy.goToAssetSummary()
    });

    it('TC: 34181-  RTU - Backend/Frontend - Horner - Transaction Details',()=>{
        cy.applicationLaunchPanel().click();
        cy.findAllByText('Administration').click({
            force: true,
          });
          cy.RTUManager()
          cy.SearchRTU('H0000127')
          cy.TransactionDetailsTab()
          cy.goToAssetSummary()
    })

    it('TC: 30042 Verify Asset Summary list does not load immediately || Verify Asset Summary list loads upon clicking on apply button ', () => {

        cy.AssetSummaryNotLoad()
        cy.AssetSummaryClickApplyButton()
    })

    it('Verify Open Asset information section as default', () => {
        cy.AssetSummaryClickApplyButton()
        cy.OpenAssetInformationByDefault()
    })

    it('TC: 28505 Verify Metron - Call History Tab', () => {

        cy.intercept('POST', routes.getAssetSummaryByOptionUrl).as('records');
        cy.intercept('GET', routes.rtuManager).as('rtumanage');
        cy.filtertext('AP1000000M2110191155')
        cy.wait('@records')
        cy.openAssetMetron()
        cy.open_RTU('Call History')
        cy.defaultfilter()
        cy.rowCount()
        cy.selectDirection(1, 'Outbound')
        // cy.selectDirection(0, 'Inbound')
        cy.anyDirection()
        cy.dateSelect()
        cy.dropdownItems()

        cy.deselectAll()
        cy.selectFilter(2)
        cy.statusColumnValue('Failed')

        cy.selectFilter(2)
        cy.selectFilter(1)
        // cy.statusColumnValue('Complete')

        cy.selectFilter(2)

        // Sort Column Ascending
        cy.sortStatusColumn()
        // cy.statusColumnValue('Complete')

        // Sort Column Descending
        cy.sortStatusColumn()
        cy.statusColumnValue('Failed')
        cy.get('body').click(0, 0)

    })

    it.only('TC: 35166 RTU - Frontend - Metron - General panel - Edit', () => {
        cy.intercept('POST', routes.getAssetSummaryByOptionUrl).as('records');
        cy.intercept('GET', routes.rtuManager).as('rtumanage');
        cy.filtertext('AP1000000M2110191155')
        cy.wait('@records')
        cy.openAssetMetron()
        cy.open_RTU('Configuration')
        cy.wait(1000)
        cy.editGeneralInfo()
        cy.verifyHardwareDeviceID()
        cy.initialization()
    })

    it('TC: 30223 - Problem Report - Front End - Open Manual Problem report', () => {
        let RTU = null;
        
        const URL = Cypress.config('baseUrl')
        var environment = URL.match("https://(.*).transcend");
        switch (environment[1]) {
            case 'test':
                RTU = 'div[title="FF720550"]';
                createPR = 'https://api-test.transcend.anova.com/ProblemReport/NewProblemReport/datachannel/caf7d0f7-0285-ec11-86de-00155d55772b';
                break;
            case 'staging':
                RTU = 'div[title="FF720008"]'; 
                createPR = 'https://api-staging.transcend.anova.com/ProblemReport/NewProblemReport/datachannel/ccb30fc2-a5c4-ec11-bae9-3ca82a236ff6';
                break;
        }

        cy.intercept('POST', routes.getAssetSummaryByOptionUrl).as('records');
        cy.intercept('GET', routes.rtuManager).as('rtumanage');
        cy.intercept('Get', createPR).as('createPR')
        cy.filtertext('AMIAG AG Events Testing [DE BULK] 1238')
        cy.wait('@records').its('response.statusCode').should('eq', 200)
        cy.openAssetAMIAGAGEventsTesting(RTU)

        cy.getTheVariableAsset()
        cy.getTheVariableUnits()
        cy.getTheVariableRegion()
        cy.getTheVariableDataChannel()
        cy.getTheVariableRtu()

        cy.checkCreatPRVisble()
        cy.openCreatePR()
        cy.wait('@createPR')
        const currentTime = moment().format('hh:mm A');
        const currentTimePlus1 = moment().add(1, 'minutes').format('hh:mm A');
        cy.SaveCloseBtn()
        cy.DescreptionRequiredError()
        cy.staticDeviceId()
        cy.addDescription(Description)
        cy.getTheVariablePrUnits()
        cy.getTheVariablePrRegion()
        cy.getTheVariablePrAsset()
        cy.getTheVariablePrRtu()
        cy.verifyPrAssetWithDetailAsset()
        cy.verifyPrUnitsWithDetailUnits()
        cy.verifyPrRegionWithDetailRegion()
        cy.verifyPrRtuWithDetailRtu()
        cy.checkOpenDate()
        cy.checkboxDisableAutoClose()
        cy.checkPriorityDropdown()
        cy.verifyCalendarBeBlank()
        cy.selectCalendar()
        cy.selectPrevMonth()

        cy.selectDate(currentTime, currentTimePlus1)
        cy.clickOnClear()
        cy.verifyThatDateIsEmpty()
        cy.clickOnCancel()
        cy.openCalendarAgainAndSelectDate(currentTime, currentTimePlus1)
        cy.selectTime()
        cy.clickOnApply()
        cy.verifyTheDateMatched()
        cy.defaultImportance(defImportance)
        cy.importanceDropdownList()
        cy.reportBy(reportBy)
        // cy.addedTags()
        cy.dropdownTags()
        cy.currentOpStatusEmpty()
        cy.enterCurrentOpStatus(opStatus)
        cy.resolutionEmpty()
        cy.enterResolution(resolution)
        cy.workOrderEmpty()
        cy.enterWorkOrder(workOrder)
        cy.Date('Initiated', currentTime, currentTimePlus1)
        cy.Date('Closed', currentTime, currentTimePlus1)

        cy.DCTriggeredPRPrimaryFaulty();
        cy.DCMarkedFaulty();
        cy.DCSameRTU("FF720550");
        cy.ClickAddNew();
        cy.FilterDropDown();
        cy.verifyFilterDropDown();
        cy.SelectDropDownValue("Asset Title");
        cy.SearchField("Published");
        cy.SelectItem("FAF00480");
        cy.AddSelected();
        cy.NewDC("FAF00480");
        cy.NewDCPrimaryFaulty("FAF00480");
        cy.DeleteFirstItem();
        cy.ActivityLog();

        cy.SaveCloseBtn()
        const DateTime = moment().format('M/D/YYYY h:mm')
        const DateTimePlus1 = moment().add(1, 'minutes').format('M/D/YYYY h:mm');
        const DateTimePlus2 = moment().add(2, 'minutes').format('M/D/YYYY h:mm');
        cy.assSummaryPageAppears()
        cy.openPRPage()
        cy.openProblemReport()
        cy.problemReportStatus('Open')
        cy.url().should('include', '/48')

        cy.verifyDescription(Description)
        cy.importanceSaved('Warning')
        cy.reportedBySaved(reportBy)
        // cy.addedTags()
        cy.currentOpStatusSaved(opStatus)
        cy.resolutionSaved(resolution)
        cy.workOrderSaved(workOrder)
        cy.problemNumber('PR00')
        cy.activityLog()
        cy.createdBy(reportBy, DateTime, DateTimePlus1, DateTimePlus2)
        cy.lastUpdatedBy()
        cy.assetSummaryIcon().click();
        cy.AssetSummaryClickApplyButton()
    })

    it('US: 30223 verify create problem report option appears', () => {
        cy.CreateProblemReportappears();
    })

    it('US: 32301 RTU - Frontend - Horner - Notes panel - Edit', () => {
        const DateTime = moment().format('M/D/YYYY h:mm')
        const DateTimePlus1 = moment().add(1, 'minutes').format('M/D/YYYY h:mm');
        const DateTimePlus2 = moment().add(2, 'minutes').format('M/D/YYYY h:mm');
        cy.HornerNotesPanelEdit();
        cy.ChangeInstallationDate(DateTime, DateTimePlus1, DateTimePlus2);
        cy.ChangeModelDescription(DateTime, DateTimePlus1, DateTimePlus2);
        cy.ChangeFunctionalLocation(DateTime, DateTimePlus1, DateTimePlus2);
        cy.ChangeSIMICCID(DateTime, DateTimePlus1, DateTimePlus2);
        cy.ChangeTemporaryNotes(DateTime, DateTimePlus1, DateTimePlus2);
        cy.ChangeNotes(DateTime, DateTimePlus1, DateTimePlus2);
        cy.ChangeDateDescriptionlLocationSIMTemporaryNotes(DateTime, DateTimePlus1, DateTimePlus2);
        cy.ClearDateDescriptionlLocationSIMTemporaryNotes(DateTime, DateTimePlus1, DateTimePlus2);
    })

    it('US: 32302 RTU - Horner - Report - Add lastUpdatedDate and lastUpdateBy', () => {
        cy.VerifylastUpdatedByDate();
    })

    it('US: 32343 RTU - Frontend - Horner - Transaction Channel (T Channel) - Verification', () => {
        cy.OpenRTUEditor('H0000127');
        cy.openTChannelTemplate();
        cy.selectTChannelTemplate('Never Delete TransactionforTest');
        cy.TChannelVerifyAllFields();
        cy.VerifyTChannelpanel_FIELDTYPE();
        cy.VerifyTChannelpanel_CHANNEL();
        cy.VerifyTChannelpanel();
        cy.VerifyTChannelpanel_UOM();
        cy.TChannelSave();
        cy.TChannelVerifySave();
        cy.TChannelSaveClose();
        cy.TChannelVerifySaveClose();
        cy.TChannelCancel();
        cy.TChannelVerifyCancel();
        cy.TChannelAddRow();
        cy.TChannelMove();
        cy.TChannelDeleteRow();
    })

    it('US: 33964 RTU - Frontend - Horner - T Channels - Save as Template', () => {
        cy.OpenRTUEditor('H0000127');
        cy.openTChannelTemplate();
        cy.selectTChannelTemplate('Never Delete TransactionforTest');
        cy.TChannelVerifyAllFields();
        cy.TChannelEditAddRow();
        const currentDate = moment().format('YYYY-MM-DD HH:MM:SS')
        cy.TChannelSaveAsNewTemplate(currentDate);
        cy.selectTChannelTemplate('Never Delete TransactionforTest');
        cy.TChannelVerifyAllFields();
        const template = 'TransactionforTest ' + currentDate
        cy.selectTChannelTemplate(template);
        cy.TChannelVerifyNewTemplate();
    })
})
