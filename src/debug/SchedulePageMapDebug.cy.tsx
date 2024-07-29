import React from "react";
import SchedulePageMapDebug from "./SchedulePageMapDebug";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter, Route, Router, Routes } from "react-router-dom";
import { AuthProvider } from "../components/Login/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("<SchedulePageMapDebug />", () => {
  const queryClient = new QueryClient();
  const travelID = Cypress.env("dummyTravelID");

  before(() => {
    cy.window().then((win) => {
      const url = `http://localhost:5173/schedulePage/travelID?id=${travelID}`;
      win.history.pushState({}, "Test Page", url);
    });
  });
  beforeEach(() => {
    cy.fetchAuthToken();

    cy.mount(
      <MantineProvider>
        <MemoryRouter>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <SchedulePageMapDebug />
            </QueryClientProvider>
          </AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    );
  });
  it("renders with simulated environment(travelId)", () => {
    cy.intercept("GET", "**/travelPlan/*/schedule/search_all").as(
      "getAllSchedules"
    );
    cy.wait("@getAllSchedules").its("response.statusCode").should("eq", 200);
  });

  it("add schedule", () => {
    cy.intercept("PUT", "**/travelPlan/*/schedule/create_schedule").as(
      "createSchedule"
    );

    cy.get('[placeholder="Input name of schedule here"]').type(
      "CypressActivity2"
    );
    cy.get('[placeholder="Optional activity description"]').type(
      "Optional Cypress Description"
    );
    cy.get('[placeholder="Input destination location"]').type("Elias Mall");

    cy.get(".pac-container").contains("West Grill Station Elias Mall").click();

    cy.get('[id="startTime"]').type("01:52");

    cy.get('[aria-label="endTime"]').type("12:52");

    cy.get('[id="day-select"]').click();

    cy.get(".mantine-Popover-dropdown").contains("22").click();

    cy.get(".schedule-button").should("not.be.disabled");

    // cy.get(".schedule-button").click();
    cy.log("Manually click create");
    cy.pause();
    // cy.wait("@createSchedule").its("response.statusCode").should("eq", 200);
  });

  it("check description tabs", () => {
    cy.get(".rbc-event-content").click();
    cy.get(".mantine-Modal-content").should(
      "contain",
      "Optional Cypress Description"
    );
  });
  it("update for schedules", () => {
    cy.intercept(
      "PATCH",
      "**/travelPlan/**/schedule/update_schedule_metadata"
    ).as("updateSchedule");

    cy.get(".rbc-event-content").eq(0).click();

    cy.get(".mantine-Modal-content")
      .should("be.visible")
      .get(".mantine-Tabs-tab")
      .contains("Edit")
      .click({ force: true })
      .get('[placeholder="Activity Name"]')
      .should("be.visible")
      .get('[placeholder="Description"]')
      .type(" ")
      .type("CypressUpdate Description");

    cy.get(".update-content ").click();

    cy.wait("@updateSchedule").its("response.statusCode").should("eq", 200);
  });

  // it("move and resize schedules", () => {
  //   cy.intercept(
  //     "PATCH",
  //     "**/travelPlan/*/schedule/update_schedule_metadata"
  //   ).as("move&resizeSchedule");
  //   cy.pause();
  //   cy.wait("@move&resizeSchedule")
  //     .its("response.statusCode")
  //     .should("eq", 200);
  //   cy.pause();
  //   cy.wait("@move&resizeSchedule")
  //     .its("response.statusCode")
  //     .should("eq", 200);
  // });

  it("add short reviews", () => {
    cy.intercept("PUT", "**/travelPlan/*/schedule/*/review/upload").as(
      "uploadReview"
    );
    cy.get(".rbc-event-content").click();

    cy.get(".mantine-Modal-content")
      .get(".mantine-Tabs-tab")
      .contains("Reviews")
      .click({ force: true });

    cy.get(".mantine-Text-root")
      .contains("Want to leave a short review?")
      .should("be.visible");

    cy.get(".mantine-Modal-body").within(() => {
      cy.get("textarea").eq(0).type("Cypress Activity Test Description");
      cy.get(".mantine-UnstyledButton-root")
        .contains("Submit Review")
        .dblclick();
    });

    cy.wait("@uploadReview").its("response.statusCode").should("eq", 206);
  });

  it("track expenditure, add income and  expenditure with checking scheduleHistory and delete function", () => {
    cy.intercept("PUT", "**/api/monetary/new-income").as("addIncome");
    cy.intercept("PUT", "**/api/monetary/new-expenditure").as("addExpenditure");

    cy.get(".rbc-event-content").click();

    cy.get(".mantine-Modal-content")
      .get(".mantine-Tabs-tab")
      .contains("Expenditure")
      .click({ force: true });

    cy.get('[placeholder="Enter Amount Here"]')
      .type("100")
      .get(".mantine-Button-root")
      .contains("Add Income")
      .click();

    cy.wait("@addIncome").its("response.statusCode").should("eq", 200);
    cy.get(".mantine-Card-root")
      .eq(0)
      .should("contain", "Income")
      .and("contain", "+ 100 USD");
    cy.get('[placeholder="Enter Amount Here"]')
      .clear()
      .type("20")
      .get('[placeholder="Enter Location Here"]')
      .type("testLocation")
      .get(".mantine-Button-root")
      .contains("Add Expenditure")
      .click();
    cy.wait("@addExpenditure").its("response.statusCode").should("eq", 200);

    cy.get(".mantine-Card-root")
      .eq(0)
      .should("contain", "Food and Dining @ testLocation")
      .and("contain", "- 20 USD");
  });
  it("delete for schedules", () => {
    cy.intercept(
      "DELETE",
      "**/travelPlan/*/schedule/delete_schedule?scheduleId=*"
    ).as("deleteSchedule");
    cy.get(".rbc-event-content").click();

    cy.get(".mantine-Modal-content")
      .get(".mantine-Tabs-tab")
      .contains("Edit")
      .click({ force: true })
      .get(".delete-content")
      .click();
    cy.wait("@deleteSchedule").its("response.statusCode").should("eq", 200);
  });
});
