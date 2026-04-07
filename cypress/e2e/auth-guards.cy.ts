describe('Auth Guards', () => {
  // Ensure no session cookie is present for each test
  beforeEach(() => {
    cy.clearCookies()
  })

  const protectedRoutes = [
    '/recipe/new',
    '/recipe-books',
    '/recipe-books/new',
    '/saved-recipes',
    '/your-recipes',
    '/moderation',
  ]

  protectedRoutes.forEach((route) => {
    it(`should redirect unauthenticated users from ${route} to /login`, () => {
      cy.visit(route)
      cy.url().should('include', '/login')
    })
  })

  it('should allow unauthenticated users to access the home page', () => {
    cy.visit('/')
    cy.url().should('not.include', '/login')
  })

  it('should allow unauthenticated users to access /login', () => {
    cy.visit('/login')
    cy.url().should('include', '/login')
  })

  it('should allow unauthenticated users to access /register', () => {
    cy.visit('/register')
    cy.url().should('include', '/register')
  })

  it('should grant access to protected routes once logged in', () => {
    cy.login('cypress_guard_user', 'TestPass123!')
    cy.visit('/your-recipes')
    cy.url().should('not.include', '/login')
  })
})
