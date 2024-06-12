import { Button, Input } from "@mantine/core";
import { Autocomplete } from "@mantine/core";

function CreateSchedule() {
  return (
    <>
      <Input placeholder="name of activity"></Input>
      <Input placeholder="Person's Name"></Input>
      <Input placeholder="Start Location"></Input>
      <Input placeholder="End Location"></Input>
      <Button>Create Schedule</Button>
    </>
  );
}

export default CreateSchedule;
