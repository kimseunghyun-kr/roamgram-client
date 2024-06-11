import React from "react";
import MyCalender from "./MyCalender.tsx";
import moment from "moment";
import { Text } from "@mantine/core";

function SchedulePage() {
  return (
    <>
      <div>
        <MyCalender></MyCalender>
      </div>
    </>
  );
}

export default SchedulePage;
