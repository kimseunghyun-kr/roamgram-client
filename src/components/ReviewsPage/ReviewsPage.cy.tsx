import React from "react";
import ReviewsPage from "./ReviewsPage";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../Login/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useJsApiLoader } from "@react-google-maps/api";
import LoadGoogleMapsDebug from "../../pages/LoadGoogleMapsDebug";
import App from "../../App";

describe("<ReviewsPage />", () => {
  const queryClient = new QueryClient();
  beforeEach(() => {
    cy.viewport(1920, 1080);
    // cy.intercept(
    //   "GET",
    //   "**/travelPlan/7106554b-7ec6-4019-ac70-8b46210aebd9/schedule/4b56c788-4fb9-4c53-984c-3819b4f8dc09/review/public-all?page=0&size=1000"
    // ).as("getAllReviews");
    // cy.mount(<LoadGoogleMapsDebug />);

    // cy.mount(
    //   <MantineProvider>
    //     <MemoryRouter>
    //       <AuthProvider>
    //         <QueryClientProvider client={queryClient}>
    //           <ReviewsPage />
    //         </QueryClientProvider>
    //       </AuthProvider>
    //     </MemoryRouter>
    //   </MantineProvider>
    // );

    // cy.mountApp();
    // cy.wait("@getAllReviews").its("response.statusCode").should("eq", 200);
  });

  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ReviewsPage />);
  });
});
