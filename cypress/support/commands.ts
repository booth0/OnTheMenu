/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  // Register first (idempotent — ignores 409 if user already exists)
  cy.request({
    method: 'POST',
    url: '/api/auth/register',
    body: { username, password },
    failOnStatusCode: false,
  })
  // Log in via API; Cypress persists the returned cookies automatically
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { username, password },
  })
})

export {}
