import React from "react";

export async function addIncome(requestBody) {
  const res = await fetch(
    `${import.meta.env.VITE_APP_API_URL}/api/monetary/new-income`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem(`authToken`)}`,
      },
      body: JSON.stringify(requestBody),
    }
  )
    .then((res) => res.json())
    .catch((error) => console.log("error adding income"));

  return res;
}
