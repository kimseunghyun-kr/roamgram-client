import { Button, Input } from "@mantine/core";
import { Autocomplete } from "@mantine/core";

//testing purposese
const travelPlanID = "1bfb5d9c-dd40-4e9e-b0f2-0492fda38c37";

function CreateSchedule() {
  const check = () => {
    fetch(
      "http://localhost:8080/travelPlan/get_by_id?planId=1bfb5d9c-dd40-4e9e-b0f2-0492fda38c37",
      { method: "GET", body: "application/json" }
    )
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };


  return <Button onClick={check}>Test Button</Button>;
}

export default CreateSchedule;
