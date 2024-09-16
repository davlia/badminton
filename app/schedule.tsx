import { DayPilotNavigator, DayPilotCalendar } from "daypilot-pro-react";
import { Flex, Group } from "@mantine/core";
import { useState } from "react";

export default function Schedule({
  events,
  startDate,
  setStartDate,
}: {
  events: any;
  startDate: any;
  setStartDate: (date: string) => void;
}) {
  console.log(startDate);
  const handleTimeRangeSelected = (args: any) => {
    setStartDate(args.day);
  };

  return (
    <Flex>
      <DayPilotNavigator onTimeRangeSelected={handleTimeRangeSelected} />
      <div style={{ width: "100%" }}>
        <DayPilotCalendar
          startDate={startDate}
          events={events}
          heightSpec="Full"
          viewType="Week"
          timeRangeSelectedHandling="Disabled"
          durationBarVisible={false}
          cellDuration={15}
          cellHeight={15}
          dayBeginsHour={9}
        />
      </div>
    </Flex>
  );
}
