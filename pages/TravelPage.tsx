import React, { useState } from "react";
import { Button, Input, CloseButton } from "@mantine/core";

import { DatePickerInput } from "@mantine/dates";
import { hasLength, useForm, isNotEmpty } from "@mantine/form";
import moment from "moment";
import { v4 as uuid } from "uuid";

function TravelPage() {
  const [travelPlanDetails, setTravelPlanDetails] = useState({
    uuid: uuid(),
    startDate: "",
    endDate: "",
    name: "",
  });

  const [travelName, setTravelName] = useState<string>("");
  const [dateRanges, setDateRanges] = useState<[Date | null, Date | null]>([
    new Date(),
    null,
  ]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  //console.log(dateRanges);
  //console.log(travelPlanDetails.name);

  //function for formatting our start and endDate from mantine into YYYY-MM-DD Format
  function formatDate(_Date: Date) {
    var momentDate = moment(_Date);
    let formattedDate = momentDate.format("Y-MM-DD");
    return formattedDate;
  }

  //function for formatting Start and End Date and Setting
  function settingTravelPlanDetailsDate(_Date: [Date | null, Date | null]) {
    const StartDate = _Date[0];
    const EndDate = _Date[1];
    setDateRanges(_Date);
    if (StartDate) {
      const _startDate = formatDate(StartDate);
      setTravelPlanDetails((p) => ({ ...p, startDate: _startDate }));
    }
    if (EndDate) {
      const _endDate = formatDate(EndDate);
      setTravelPlanDetails((p) => ({ ...p, endDate: _endDate }));
    }
  }

  //// for form check purposes yo
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  //to add to backend function
  const test = () => {
    fetch("http://localhost:8080/travelPlan/create_travel_plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(travelPlanDetails),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };
  return (
    <div>
      <h1>Choose Name for Plan</h1>
      <form onSubmit={handleSubmit}>
        <Input
          //right hand side
          rightSectionPointerEvents="all"
          rightSection={
            <CloseButton
              aria-label="Clear Name"
              onClick={() => setTravelPlanDetails((p) => ({ ...p, name: "" }))}
            />
          }
          required
          //other Input Properties
          placeholder="Choose Name"
          value={travelPlanDetails.name}
          onChange={(e) => {
            setTravelPlanDetails((p) => ({
              ...p,
              name: e.target.value,
            }));
          }}
        ></Input>
        <h1> Choose Date</h1>
        <DatePickerInput
          clearable
          type="range"
          placeholder="Choose Date"
          value={dateRanges}
          onChange={settingTravelPlanDetailsDate}
        ></DatePickerInput>
        <Button
          type="submit"
          onClick={(e) => {
            console.log(travelPlanDetails);
            test();
          }}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default TravelPage;
