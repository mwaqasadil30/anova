/// <reference types="cypress" />
import UtilFunctions from '../../support/utils/UtilFunctions';
import forgotPasswordAPIPage from '../../support/APIpages/forgotPasswordAPIPage.js';
const forgotPassword = new forgotPasswordAPIPage();
const routes = require('../../fixtures/routes.json');
const example = require('../../fixtures/example.json');
const utilFunctions = new UtilFunctions();

//let editProductUniqueName2, uniqueProductName2;

describe('Forgot Password Test Suite', function () {
  beforeEach(function () {
    // Preserve only the session cookie in every test
    Cypress.Cookies.defaults({
      preserve: (cookie) => {
        return cookie && cookie.name === '.AspNetCore.Session';
      },
    });
  });


  it('TC: 16576 - Login with registered username and check whether email is generated our not', function () {
   
    cy.server();
    cy.route('POST', routes.forgotPassword).as('forgotPassword');
    cy.route('GET', routes.authenticateProfile).as('authenticateProfile');

    cy.visit(Cypress.env('url'));

    cy.username().type(Cypress.env('USERNAME'));
    cy.findAllByText('Next').click();
    cy.wait('@authenticateProfile').should('have.property', 'status', 200);

    forgotPassword.VerifyUsername();

    cy.findAllByText('Forgot password?').should('be.visible').click();

    cy.username().type(Cypress.env('USERNAME'));
    cy.findAllByText('Reset Password').click();

    cy.wait('@forgotPassword').should('have.property', 'status', 200);
    cy.findAllByText('Check your email').should('be.visible');
    cy.findAllByText('If we found a matching account, you will receive an email with the password reset link.').should('be.visible');
    cy.findAllByText('Back to Login').click();

    cy.findAllByText('Log in to your account').should('be.visible');

  })

})