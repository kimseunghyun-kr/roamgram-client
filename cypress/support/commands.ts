/// <reference types="cypress" />
import { Query, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mount } from 'cypress/react';
import cypressConfig from "../../cypress.config";
import { useJsApiLoader } from "@react-google-maps/api";

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add(`fetchAuthToken`, () => {
    const requestBody = {
        "username": "string",
        "password": "string"
      }
    
    return cy.request({method: 'POST', headers: {'Content-Type': 'application/json'}, body: requestBody, url:`${Cypress.env('hostUrl')}/authentication/sign-in`,}).then(res => {const authToken = res.body.accessToken; cy.log(authToken); sessionStorage.setItem(`authToken`, authToken)})
})  

// Cypress.Commands.add('mockGoogleMaps', () => {
//   cy.window().then((win) => {
//     win.google = {
//       maps: {
//         Map: function() {},
//         LatLng: function() {},
//         Marker: function() {},
//         InfoWindow: function() {},
//         // Add any other necessary google.maps properties or methods here
//       },
//     };
//   });
// });

// Cypress.Commands.add('mockUseJsApiLoader', () => {
//   cy.window().then((win) => {
//     win.useJsApiLoader = () => ({
//       isLoaded: true,
//     });
//   });

//   cy.log('isLoaded', isLoaded)
// });