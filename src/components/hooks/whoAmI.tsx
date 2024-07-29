export async function whoAmI() {
  const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/users/whoami`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${sessionStorage.authToken}`,
    },
  }).then((res) => res.json());
  console.log("res whoami", res.userProfileName);
  return res.userProfileName;
}
