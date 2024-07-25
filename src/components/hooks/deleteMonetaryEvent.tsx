export async function deleteMonetaryEvent(transactionId: string) {
  const res = await fetch(
    `${
      import.meta.env.VITE_APP_API_URL
    }/api/monetary/delete-event?transactionId=${transactionId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem(`authToken`)}`,
      },
    }
  )
    .then((res) => res.json())
    .catch((error) => console.log("Error Deleting"));

  return res;
}
