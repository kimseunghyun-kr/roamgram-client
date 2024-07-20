import React from "react";
import TravelPlans from "./TravelPlans";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../Login/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("<TravelPlans />", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.fetchAuthToken();
    cy.mount(
      <MantineProvider>
        <MemoryRouter>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <TravelPlans />
            </QueryClientProvider>
          </AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    );
  });
  it("renders", () => {});

  it("checking authToken", () => {
    // cy.fetchAuthToken();

    cy.getAllSessionStorage().then((results) => {
      cy.log(results);
    });
  });

  it("unauthorized render", () => {
    cy.removeAuthToken();
    cy.get(".mantine-Card-root").should("not.exist");
  });
  it("create travel plan unauthorized", () => {
    cy.removeAuthToken().log("removedAuthToken");
    //fills create-plan
    cy.get('[aria-label = "create-reviews-tab-btn"]')
      .click()
      .get('[placeholder = "Choose Name"]')
      .type("testActivityName")
      .get('[aria-label="create-plan-date-input"]')
      .click()
      .get(".mantine-Popover-dropdown")
      .contains("8")
      .click()
      .get(".mantine-Popover-dropdown")
      .contains("20")
      .click()
      .get('[type="submit"]')
      .click()
      .get(".mantine-Popover-dropdown")
      .should("contain", "Please sign in");
  });

  it("create travel plan authorized", () => {
    cy.intercept("GET", "**/travelPlan/get_all").as("getAllTravelPlans");

    cy.get('[aria-label = "create-reviews-tab-btn"]')
      .click()
      .get('[placeholder = "Choose Name"]')
      .type("testActivityName")
      .get('[aria-label="create-plan-date-input"]')
      .click()
      .get(".mantine-Popover-dropdown")
      .contains("8")
      .click()
      .get(".mantine-Popover-dropdown")
      .contains("20")
      .click()
      .get('[type="submit"]')
      .should("be.visible")
      .click()
      .wait(1000);

    cy.wait("@getAllTravelPlans").its("response.statusCode").should("eq", 200);

    cy.get(".travel-plan-container")
      .should("be.visible")
      .should("contain", "testActivityName");
  });

  it("travel plan editing values & check values after refresh", () => {
    cy.intercept("GET", "**/travelPlan/get_all").as("getAllTravelPlans");
    cy.intercept("PATCH", "**/travelPlan/modify_travel_plan").as(
      "modifyTravelPlans"
    );
    cy.wait("@getAllTravelPlans").its("response.statusCode").should("eq", 200);

    cy.get(".mantine-Card-root")
      .first()
      .should("be.visible")
      .within(() => {
        cy.get(".mantine-UnstyledButton-root[aria-haspopup='menu']").click();
      });

    cy.wait(200);

    cy.get(".mantine-Menu-dropdown")
      .should("be.visible")
      .get(".mantine-Menu-item")
      .first()
      .click();
    cy.get(".mantine-Modal-body").within(() => {
      cy.get("[placeholder='Choose Name']")
        .should("be.visible")
        .clear()
        .type("testNameChange");

      cy.get(".mantine-DatePickerInput-input").should("be.visible").click();
    });
    cy.get(".mantine-Popover-dropdown").contains(1).click();
    cy.get(".mantine-Popover-dropdown").contains(10).click();

    cy.get("[type='submit']").contains("Update").click();
    cy.wait("@modifyTravelPlans").its("response.statusCode").should("eq", 200);

    // cy.wait(1000);
    // cy.wait("@getAllTravelPlans").its("response.statusCode").should("eq", 200);

    //check if activityName is changed
    cy.get(".travel-plan-container").should("contain", "testNameChange");
  });

  // it.only("check working schedules button", () => {
  //   cy.get(".to-schedule-button")
  //     .should("be.visible")
  //     .click()
  //     .url()
  //     .then((url) => {
  //       cy.log(url);
  //     });
  // });
});
