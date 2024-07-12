describe('Explore Nearby', () =>{
    it('Testing Explore Nearby Function', () => {
        cy.visit(Cypress.config().baseUrl)

        cy.get('.map-container-home').should('exist')

        cy.get('[aria-label = "Current Pinned Location"]').should('exist')
        //clicking two different buttons should yield only supermarket
        cy.get(`input[value = "food"]`).should('exist').click({ force: true })
        cy.get(`input[value = "supermarket"]`).should('exist').click({ force: true })
        //checking markers we shall keep this fixed
       
    })
  })

  //incomplete