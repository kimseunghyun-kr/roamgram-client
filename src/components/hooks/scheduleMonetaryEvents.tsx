export async function scheduleMonetaryEvents(scheduleId: string) {
  console.log(sessionStorage.getItem(`authToken`));
  const res = await fetch(
    `${
      import.meta.env.VITE_APP_API_URL
    }/api/monetary/schedule-monetary-events?scheduleId=${scheduleId}&pageNumber=0&pageSize=100`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(`authToken`)}`,
      },
    }
  ).then((res) => res.json());

  return await res;
}
