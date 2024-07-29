import React from "react";
import DetailedReview from "./DetailedReview";
import { MantineProvider } from "@mantine/core";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../Login/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("<DetailedReview />", () => {
  const queryClient = new QueryClient();
  const travelID = Cypress.env("dummyTravelID");
  const scheduleID = Cypress.env("dummyScheduleID");

  beforeEach(() => {
    cy.log(`Cypress.env('dummyTravelID'): ${travelID}`);
    cy.log(`Cypress.env('dummyScheduleID'): ${scheduleID}`);
    cy.window().then((win) => {
      const url = `http://localhost:5173/reviews/id?travelId?id=${travelID}&scheduleId=${scheduleID}`;
      win.history.pushState({}, "Test Page", url);
      console.log("URL TESTETSET", url);
    });
    cy.fetchAuthToken();

    cy.mount(
      <MantineProvider>
        <MemoryRouter>
          <AuthProvider>
            <QueryClientProvider client={queryClient}>
              <DetailedReview />
            </QueryClientProvider>
          </AuthProvider>
        </MemoryRouter>
      </MantineProvider>
    );
  });
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
  });

  it.only("create review with ratings and image upload and random text(without bolding etc)", () => {
    // cy.intercept("POST", "**/media-file/upload-file-small").as(
    //   "getPresignedURL"
    // );
    let getPresignedURL = false;
    let uploadS3 = false;
    let getS3 = false;
    cy.intercept(
      "PUT",
      `**/travelPlan/294675b3-d1c5-4841-9869-df2cd31ce351/schedule/${scheduleID}/review/upload`
    ).as("uploadReview");
    cy.intercept("POST", "**/media-file/upload-file-small", (req) => {
      getPresignedURL = true; // Set the flag when the request occurs
    }).as("getPresignedURL");

    cy.intercept(
      "PUT",
      "https://nus-orbital-roamgram.s3.ap-southeast-2.amazonaws.com/uploads/**",
      (req) => {
        uploadS3 = true;
      }
    ).as("uploadToS3");

    // Intercept the POST request
    cy.intercept("POST", "**/media-file/get-file", (req) => {
      getS3 = true; // Set the flag when the request occurs
    }).as("getFromS3");

    cy.intercept("POST", "**/media-file/complete-upload").as("completeUpload");

    cy.get(".mantine-Rating-symbolBody").eq(7).click({ force: true });
    cy.get(".ql-editor").type("Test \n \n     space");
    cy.pause();

    cy.then(() => {
      cy.log(`Presigned URL request occurred: ${getPresignedURL}`);
      cy.log(`upload to S3 request occurred: ${uploadS3}`);
      cy.log(`Get from S3 request occurred: ${getS3}`);

      expect(getPresignedURL).to.be.true;
      expect(uploadS3).to.be.true;
      expect(getS3).to.be.true;
    });

    console.log("tid", travelID);
    cy.get(".submit-false-btn").click();
    cy.get(".mantine-Modal-content .submit-button-review-detailed").click();

    cy.wait("@completeUpload").its("response.statusCode").should("eq", 200);
    cy.wait("@uploadReview").its("response.statusCode").should("eq", 200);
  });
});
