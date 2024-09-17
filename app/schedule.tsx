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
    <Flex gap="sm">
      <Stack align="center">
        <DayPilotNavigator onTimeRangeSelected={handleTimeRangeSelected} />
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
          viewType="Week"
          timeRangeSelectedHandling="Disabled"
          durationBarVisible={false}
          cellDuration={15}
          cellHeight={15}
          dayBeginsHour={9}
        />
      </Box>
    </Flex>
  );
}
