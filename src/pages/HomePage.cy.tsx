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

  it("is able to explore nearby locations with radius change", () => {
    cy.log("This only works with edge/chrome ");
    cy.get(".map-container-home").should("exist");
    // cy.wait(7000);
    cy.get('[aria-label = "Current Pinned Location"]', {
      timeout: 10000,
    }).should("exist");
    //clicking two different buttons should yield only supermarket
    cy.get(`input[value = "shopping_mall"]`)
      .should("exist")
      .click({ force: true });
    cy.get('[role="button"]').its("length").as("initialButtonCount");
    cy.get("@initialButtonCount").then((initialCount) => {
      cy.get('[role="button"]').its("length").should("not.equal", 0);

      cy.get(".mantine-Slider-track").click({ multiple: true });
      cy.get('[role="button"]').its("length").should("not.equal", initialCount);
    });

    // cy.get(`input[value = "supermarket"]`)
    //   .should("exist")
    //   .click({ force: true });
    //checking markers we shall keep this fixed});
  });
});
