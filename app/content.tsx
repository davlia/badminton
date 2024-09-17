"use client";

import { Box, LoadingOverlay } from "@mantine/core";
import { useState } from "react";
import useSWR from "swr";
import Schedule from "./schedule";
import { DayPilot } from "daypilot-pro-react";
import { format } from "date-fns";

const removeTimeZone = (dateTimeString: string) => {
  const toks = dateTimeString.split("-");
  // remove the last token
  toks.pop();
  return toks.join("-");
};

const formatTime = (time: number) => {
  const date = new Date(time);
  return format(date, "hh:mma");
};

const combineSchedule = (schedule: any) => {
  // Sort the schedule by time
  const flattenedSchedule = schedule.slice().sort((a: any, b: any) => {
    return a.start - b.start;
  });
  // Merge contiguous times (separated by 30 minutes) into a single event
  for (let i = 0; i < flattenedSchedule.length; i++) {
    const currentEvent = flattenedSchedule[i];
    const nextEvent = flattenedSchedule[i + 1];
    if (nextEvent && currentEvent.end >= nextEvent.start) {
      currentEvent.end = nextEvent.end;
      flattenedSchedule.splice(i + 1, 1);
      i--;
    }
  }
  for (let i = 0; i < flattenedSchedule.length; i++) {
    const start = new Date(flattenedSchedule[i].start);
    const end = new Date(flattenedSchedule[i].end);
    const startDate = format(start, "yyyy-MM-dd'T'HH:mm:ss");
    const endDate = format(end, "yyyy-MM-dd'T'HH:mm:ss");
    const startTime = formatTime(flattenedSchedule[i].start);
    const endTime = formatTime(flattenedSchedule[i].end);
    console.log(startDate, endDate, startTime, endTime);
    flattenedSchedule[i] = {
      id: flattenedSchedule[i].start,
      text: `${startTime} - ${endTime}`,
      backColor: "yellow",
      start: startDate,
      end: endDate,
    };
  }
  console.log(flattenedSchedule);
  return flattenedSchedule;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

export default function Content() {
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  let queryDate;
  const now = new Date().getTime();
  if (startDate.firstDayOfWeek().getTime() < now) {
    queryDate = new Date().toISOString().split("T")[0];
  } else {
    queryDate = startDate.firstDayOfWeek().toString().split("T")[0];
  }
  const { data, error, isLoading } = useSWR(
    `/api/schedule?startDate=${queryDate}`,
    fetcher
  );
  if (error) return <div>Failed to load</div>;
  let combinedSchedule = [];
  if (data) combinedSchedule = combineSchedule(data);
  return (
    <Box>
      <LoadingOverlay visible={isLoading} />
      <Schedule
        events={
          isLoading && combinedSchedule.length === 0 ? [] : combinedSchedule
        }
        startDate={startDate}
        setStartDate={setStartDate}
      />
    </Box>
  );
}
