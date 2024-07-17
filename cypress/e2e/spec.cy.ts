describe('RoamGram HomePage', () => {
  it('Testing HomePage plan input without login', () => {
    cy.viewport(1920, 1380)
    cy.visit(Cypress.config().baseUrl)

    //input plan check
    cy.get('input[placeholder = "Input Plan Name"]').type('testcase')

    cy.get('.mantine-DatePickerInput-input').click()
    cy.get(`.mantine-Popover-dropdown`).contains('8').click()
    cy.get(`.mantine-Popover-dropdown`).contains('10').click()
    cy.get('button').contains('Submit').click();


    cy.url().should('include', '/travelPage')
  })
})

