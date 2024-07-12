describe('Login', () => {
    it('Login Page', () =>{
        //checking back button
        cy.visit(`${Cypress.config().baseUrl}/login`)
        cy.get(`[aria-label="actionIcon-back"]`).click().url().should('include', Cypress.config().baseUrl)
        cy.visit(`${Cypress.config().baseUrl}/login`)
        //checking create button
        cy.get('[aria-label="create-button"]').click().url().should('include', '/signup')
        cy.visit(`${Cypress.config().baseUrl}/login`)
        //checking login
        cy.get('input[placeholder="Enter Username"]').type('string')
        cy.get('input[placeholder="Enter Password"]').type('string')
        cy.get('button').contains('Continue').click()

        cy
        //error checking
        cy.get(`.mantine-Popover-dropdown`).should('contain','Error')
    })
})