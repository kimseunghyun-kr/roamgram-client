import React from "react";
import ReviewsPageDebug from "./ReviewPageDebug";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../components/Login/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("<ReviewsPageDebug />", () => {
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
              <ReviewsPageDebug />
            </QueryClientProvider>
          </AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    );

    cy.wait("@mapLoad").its("response.statusCode").should("eq", 200);
    cy.wait("@getAllReviews").its("response.statusCode").should("eq", 200);
  });
  it("renders", () => {
    cy.get('[placeholder="Search Reviews By Location"]').should("be.visible");
  });

  it("Reviews Load", () => {
    cy.get(".mantine-Card-root").should("be.visible");
  });

  it("Search By Places ID", () => {
    //get by id fetch
    cy.intercept(
      "GET",
      "**/travelPlan/*/schedule/*/review/public-google-maps-id?page=0&size=1000&googleMapsId=*"
    ).as("getGoogleIDReviews");
    cy.get('[placeholder="Search Reviews By Location"]')
      .type("Elias Mall")
      .get(".pac-container")
      .first()
      .click();
    cy.wait("@getGoogleIDReviews").its("response.statusCode").should("eq", 200);
  });

  it.only("Click Write Reviews", () => {
    cy.get(".submit-review-page").contains("Write a Review").click();
    cy.on("window:alert", (text) => {
      expect(text).to.contains("choose travel plan");
    });
  });
});
