import React from "react";

export async function addExpenditure(requestBody) {
  const res = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/api/monetary/new-expenditure`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(`authToken`)}`,
      },
      body: JSON.stringify(requestBody),
    }
  ).then((res) => res.json());

  return res;
}
