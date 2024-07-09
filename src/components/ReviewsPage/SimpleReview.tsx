import { v4 } from "uuid";
export async function SimpleReview(
  rating,
  userDescription,
  travelId,
  scheduleId
) {
  const authToken = sessionStorage.getItem(`authToken`);

  const requestBody = {
    fileList: [
      {
        id: v4(),
        review: v4(),
        sizeBytes: null,
        contentType: null,
        originalFileName: null,
        s3Key: "",
        mediaFileStatus: null,
      },
    ],
    fileLocation: {
      additionalProp1: 0,
    },
    userDescription: userDescription,
    rating: rating,
  };

  console.log(
    `${
      import.meta.env.VITE_APP_API_URL
    }/travelPlan/${travelId}/schedule/${scheduleId}/upload`
  );
  console.log(requestBody);
  console.log(JSON.stringify(requestBody));
  return await fetch(
    `${
      import.meta.env.VITE_APP_API_URL
    }/travelPlan/${travelId}/schedule/${scheduleId}/review/upload`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(requestBody),
    }
  )
    .then((res) => res.json())
    .then((data) => console.log("Success in adding short review"))
    .catch((error) => console.log("error in adding short review!"));
}
