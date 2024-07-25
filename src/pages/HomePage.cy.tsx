import React from "react";
import HomePage from "./HomePage";
import { MemoryRouter, Router } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import App from "../App";
import "./HomePage.css";

describe("<HomePage />", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    cy.mount(
      <MantineProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MantineProvider>
    );
  });

  it("renders", () => {});

  it("is able to create unauthorized journey without login", () => {
    cy.get('input[placeholder = "Input Plan Name"]').type("testcase");

    cy.get(".mantine-DatePickerInput-input").click();
    cy.get(`.mantine-Popover-dropdown`).contains("8").click();
    cy.get(`.mantine-Popover-dropdown`).contains("10").click();
    cy.get("button").contains("Submit").click();
    cy.get('[aria-label="unauth-card"]').should("exist").contains("testcase");
  });

  it("is able to explore nearby locations", () => {
    cy.get(".map-container-home").should("exist");
    cy.wait(7000);
    cy.get('[aria-label = "Current Pinned Location"]').should("exist");
    //clicking two different buttons should yield only supermarket
    cy.get(`input[value = "food"]`).should("exist").click({ force: true });
    cy.get(`input[value = "supermarket"]`)
      .should("exist")
      .click({ force: true });
    //checking markers we shall keep this fixed});
  });
});
