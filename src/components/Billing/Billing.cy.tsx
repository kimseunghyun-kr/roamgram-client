import React from "react";
import Billing from "./Billing";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../Login/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("<Billing />", () => {
  const queryClient = new QueryClient();
  const travelID = Cypress.env("dummyTravelID");

  before(() => {
    cy.window().then((win) => {
      const url = `http://localhost:5173/billing/travelID?id=${travelID}`;
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
              <Billing />
            </QueryClientProvider>
          </AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    );
  });

  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
  });
});
