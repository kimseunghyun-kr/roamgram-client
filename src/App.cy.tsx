import React from "react";
import App from "./App";
import HomePage from "./pages/HomePage";
import { MemoryRouter, Router } from "react-router-dom";
import { MantineProvider } from "@mantine/core";

describe("<App />", () => {
  it("App renders", () => {
    cy.mount(
      <MantineProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </MantineProvider>
    );
  });
});
