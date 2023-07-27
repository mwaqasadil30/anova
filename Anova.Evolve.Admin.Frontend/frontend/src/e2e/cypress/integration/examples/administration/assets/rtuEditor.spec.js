/// <reference types="cypress" />

var RtuChannel = "1,2,3,4,5,6,7,8,Gps";
var RtuPC = "1,2,3,0";
var RtuDir = "-1";
var fileDetails = 'https://api-test.transcend.anova.com/Rtu/F0000646/category';
var SMSDetails = 'https://api-test.transcend.anova.com/Rtu/FF7C5880/category';
var eDetails = 'https://api-test.transcend.anova.com/Rtu/E1001939/category';

describe('RTU Editor Test Suite testsuite', function () {
  beforeEach(function () {
    cy.fixture('example').then(function (data) {
      this.data = data;
    });
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });

  it('Login Portal',{retries : 10}, function () {
    cy.login();
  });

  it(' Navigate to Operations app -Asset summary ', function () {
    cy.navToOps();
  });

  it('File RTU - Filter and click on device ID F0000646', function () {
    cy.navToRTUsEditor('F0000646',fileDetails);    
  });

  it('File RTU - Check filters - Verify filters and Default Values of All Filters', function () {
    cy.checkDefaultValue();   
  });

  it('File RTU - Check filters - Channel ', function () {
    cy.verifyFieldsForRTUEditor(RtuChannel,0);   
  });

  it('File RTU - Check filters - Packet Category ', function () {
    cy.verifyFieldsForRTUEditor(RtuPC,1);   
  });

  it('File RTU - Check filters - Direction ', function () {
    cy.verifyFieldsForRTUEditor(RtuDir,2);   
  });

  it(' Navigate to Operations app -Asset summary ', function () {
    cy.navToOps();
  });

  it('SMS RTU - Filter and click on device ID FF7C5880', function () {
    cy.navToRTUsEditor('FF7C5880',SMSDetails);    
  });

  it('SMS RTU - Check filters - Verify filters and Default Values of All Filters', function () {
    cy.checkDefaultValue();   
  });

  it('SMS RTU - Check filters - Channel ', function () {
    cy.verifyFieldsForRTUEditor(RtuChannel,0);   
  });

  it('SMS RTU - Check filters - Packet Category ', function () {
    cy.verifyFieldsForRTUEditor(RtuPC,1);   
  });

  it('SMS RTU - Check filters - Direction ', function () {
    cy.verifyFieldsForRTUEditor(RtuDir,2);   
  });

  it(' Navigate to Operations app -Asset summary ', function () {
    cy.navToOps();
  });

  it('400 series RTU - Filter and click on device ID E1001939', function () {
    cy.navToRTUsEditor('E1001939',eDetails);    
  });

  it('400 series RTU - Check filters - Verify filters and Default Values of All Filters', function () {
    cy.checkDefaultValue();   
  });

  it('400 series RTU - Check filters - Channel ', function () {
    cy.verifyFieldsForRTUEditor(RtuChannel,0);   
  });

  it('400 series RTU - Check filters - Packet Category ', function () {
    cy.verifyFieldsForRTUEditor(RtuPC,1);   
  });

  it('400 series RTU - Check filters - Direction ', function () {
    cy.verifyFieldsForRTUEditor(RtuDir,2);   
  });

  it('RTU - packets - date picker results are influenced by timezone', function () {
    cy.datePickerInfluence()   
  });

  it('RTU - Packets Tab - default sort: most recent first', function () {
    cy.datePickerInfluence()   
  });

  it('RTU - Packets - update to datepicker behaviour ', function () {
    cy.verifyDatePicker();   
  });
  
  it('RTU - Packets - Check invalid date format warning ', function () {
    cy.verifyInvalidFormat();   
  });
 

});