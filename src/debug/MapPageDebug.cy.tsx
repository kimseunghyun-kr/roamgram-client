import React from "react";
import MapPageDebug from "./MapPageDebug";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../components/Login/AuthContext";

describe("<MapPageDebug />", () => {
  beforeEach(() => {
    cy.viewport(1280, 800);

    cy.mount(
      <MantineProvider>
        <MemoryRouter>
          <AuthProvider>
            <MapPageDebug />
          </AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    );

    cy.intercept("GET", "**/maps/api/mapsjs/gen_204?csp_test=true").as(
      "mapLoad"
    );
  });

  it("Check if Google Map is Loaded", () => {
    cy.wait("@mapLoad").its("response.statusCode").should("eq", 200);

    cy.get(".google-map-container", { timeout: 10000 })
      .should("be.visible")
      .then(() => {
        cy.log("container present");
      });
    // cy.get(".scrollable-element").scrollTo("bottom");
    cy.scrollTo("bottom");
    cy.get('[aria-label="Map"]', { timeout: 10000 }).should("be.visible");
  });

  it("entering details and time and checking if route changes when travel method changes", () => {
    cy.get('[placeholder="Enter a location"]')
      .first()
      .type("510503")
      .get(".pac-item")
      .first()
      .click();

    cy.get('[placeholder="Enter a location"]')
      .eq(1)
      .type("Elias Mall")
      .get(".pac-item")
      .first()
      .click();

    cy.get('[aria-describedby="mode-description"]').select("WALKING");

    cy.get(".mantine-TimeInput-input")
      .type("06:06")
      .get(".mantine-UnstyledButton-root")
      .eq(4)
      .click();
  });
});
