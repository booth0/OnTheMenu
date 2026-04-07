describe('Login', () => {
  const testUser = { username: 'cypress_login_user', password: 'TestPass123!' }

  before(() => {
    // Register the user first
    cy.request({
      method: 'POST',
      url: '/api/auth/register',
      body: testUser,
      failOnStatusCode: false,
    })
  })

  it('should log in with valid credentials', () => {
    cy.visit('/login')
    cy.get('main form input[name="username"]').type(testUser.username)
    cy.get('main form input[name="password"]').type(testUser.password)
    cy.get('main form button[type="submit"]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should reject invalid credentials', () => {
    cy.visit('/login')
    cy.get('main form input[name="username"]').type(testUser.username)
    cy.get('main form input[name="password"]').type('wrongpassword')
    cy.get('main form button[type="submit"]').click()
    cy.url().should('include', '/login')
    cy.contains('Invalid username or password').should('be.visible')
  })
})
