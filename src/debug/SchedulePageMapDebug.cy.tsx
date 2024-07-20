import React from "react";
import SchedulePageMapDebug from "./SchedulePageMapDebug";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../components/Login/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("<SchedulePageMapDebug />", () => {
  const queryClient = new QueryClient();
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
  it("renders", () => {});
});
