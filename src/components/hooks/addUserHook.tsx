export async function addUserHook(
  travelPlanId: string,
  userProfileId: string,
  permissionLevel: string
) {
  const res = await fetch(
    `${
      import.meta.env.VITE_APP_API_URL
    }/travelPlan/share_travel_plan?travelPlanId=${travelPlanId}&userProfileId=${userProfileId}&permissionLevel=${permissionLevel}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(`authToken`)}`,
      },
    }
  )
    // .then((res) => res.json())
    .catch((error) => console.log("error adding user", error));

  return res;
}
