export async function findUser(name: string) {
  console.log("name", name);
  const res = await fetch(
    `${
      import.meta.env.VITE_APP_API_URL
    }/users/find-by-name?name=${name}&pageNumber=0&pageSize=10`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
      },
    }
  )
    .then((res) => res.json())
    .catch((error) => console.log("error finding user"));
  console.log("res", res);
  return res;
}

//name should be username
