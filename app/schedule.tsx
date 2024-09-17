import { DayPilotNavigator, DayPilotCalendar } from "daypilot-pro-react";
import { Box, Flex, Group, Stack, Text } from "@mantine/core";
import { useState } from "react";

export default function Schedule({
  events,
  startDate,
  setStartDate,
}: {
  events: any;
  startDate: any;
  setStartDate: (date: any) => void;
}) {
  console.log(startDate);
  const handleTimeRangeSelected = (args: any) => {
    setStartDate(args.day);
  };

  return (
    <Flex
      gap="sm"
      direction={{ base: "column", sm: "row" }}
      align={{ base: "center", sm: "flex-start" }}
    >
      <Stack align="center">
        <DayPilotNavigator
          onTimeRangeSelected={handleTimeRangeSelected}
          weekStarts={1}
        />
        <Group gap="sm">
          <Box
            w={20}
            h={20}
            bg="#FFFF00"
            style={{
              border: "1px solid black",
            }}
          />
          <Text>= Available</Text>
        </Group>
      </Stack>
      <Box w="100%">
        <DayPilotCalendar
          startDate={startDate}
          events={events}
          heightSpec="Full"
          viewType={window.innerWidth > 768 ? "Week" : "Week"}
          headerDateFormat="ddd M/d"
          timeRangeSelectedHandling="Disabled"
          durationBarVisible={false}
          cellDuration={15}
          cellHeight={15}
          dayBeginsHour={9}
          eventMoveHandling="Disabled"
          eventResizeHandling="Disabled"
          eventClickHandling="Disabled"
          eventHoverHandling="Disabled"
          hourWidth={window.innerWidth > 768 ? 60 : 40}
          weekStarts={1}
        />
      </Box>
    </Flex>
  );
}
