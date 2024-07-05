//not worknig atm
export function LogOut() {
  const authToken = sessionStorage.getItem(`authToken`);

  fetch(`${import.meta.env.VITE_VITE_APP_API_URL}/authentication/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  })
    .then((res) => res.json())
    .then((data) => console.log("success in logging out"));
}
