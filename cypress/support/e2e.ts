/// <reference types="cypress" />

export {}

const TEST_USER = { username: 'cypress_testuser', password: 'TestPass123!' }

// Ensure the test user exists before any login attempt
let testUserCreated = false

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.session([username, password], () => {
    cy.request({
      method: 'POST',
      url: '/api/auth/login',
      body: { username, password },
      failOnStatusCode: false,
    }).then((res) => {
      if (res.status === 200) return

      // If login failed, register the user and try again
      cy.request({
        method: 'POST',
        url: '/api/auth/register',
        body: { username, password },
        failOnStatusCode: false,
      }).then(() => {
        cy.request('POST', '/api/auth/login', { username, password }).then((loginRes) => {
          expect(loginRes.status).to.eq(200)
        })
      })
    })
  })
})

Cypress.Commands.add('getTestUser', () => {
  return cy.wrap(TEST_USER)
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>
      getTestUser(): Chainable<{ username: string; password: string }>
    }
  }
}
