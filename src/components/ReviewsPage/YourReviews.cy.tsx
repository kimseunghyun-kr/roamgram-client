import React from "react";
import YourReviews from "./YourReviews";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../Login/AuthContext";

describe("<YourReviews />", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    cy.viewport(1920, 1080);
    // cy.intercept("GET", "**/travelPlan/get_all").as("getAllTravelPlans");

    cy.intercept("GET", "**/maps/api/mapsjs/gen_204?csp_test=true").as(
      "mapLoad"
    );
    cy.intercept(
      "GET",
      "**/travelPlan/7106554b-7ec6-4019-ac70-8b46210aebd9/schedule/4b56c788-4fb9-4c53-984c-3819b4f8dc09/review/public-all?page=0&size=1000"
    ).as("getAllReviews");
    cy.fetchAuthToken();

    //ignore the uncaught errors
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.mount(
      <MantineProvider>
        <MemoryRouter>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <YourReviews />
            </QueryClientProvider>
          </AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    );
  });

  it("renders", () => {});

  it("Check Reviews Load", () => {
    cy.intercept(
      "GET",
      "**/travelPlan/*/schedule/*/review/schedule-all?page=0&size=*"
    ).as("getTravelPlans");
    cy.wait("@getTravelPlans").its("response.statusCode").should("eq", 200);
  });

  it.only("Review Delete", () => {
    cy.intercept(
      "DELETE",
      "**/travelPlan/*/schedule/*/review/delete?reviewID=*"
    ).as("deleteReview");

    cy.get(".mantine-Card-root")
      .eq(1)
      .find(".mantine-ActionIcon-root")
      .should("be.visible");
    cy.get(".mantine-Card-root")
      .eq(1)
      .within(() => {
        cy.get(".mantine-UnstyledButton-root").click();
      });

    cy.get(".mantine-Menu-dropdown ")
      .should("be.visible")
      .get(".mantine-Menu-item")
      .contains("Delete")
      .click();

    cy.wait("@deleteReview").its("response.statusCode").should("eq", 200);
  });
});
