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

  it.only("add schedule", () => {
    cy.get('[placeholder="Name of Activity"]')
      .type("CypressActivity")
      .get('[placeholder="Destination [Place Added to Schedules]"]')
      .type("Elias Mall")
      .get(".pac-container")
      .eq(1)
      .click()
      .get('[id="startTime"]')
      .type("06:52")
      .get('[aria-label="endTime"]')
      .type("08:52")
      .get('[  id="day-select"]')
      .click()
      .get(".mantine-Popover-dropdown")
      .contains("1")
      .click()
      .get(".schedule-button ");
  });
});
