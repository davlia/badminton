"use client";

import {
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import {
  Center,
  Container,
  LoadingOverlay,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import { useState } from "react";
import { WeekView } from "react-weekview";
import useSWR from "swr";
import Schedule from "./schedule";
import { DayPilot } from "daypilot-pro-react";

const removeTimeZone = (dateTimeString: string) => {
  const toks = dateTimeString.split("-");
  // remove the last token
  toks.pop();
  return toks.join("-");
};

const timeOnly = (dateTimeString: string) => {
  // dateTimeString is in the format "2024-09-20T23:00:00-0400"
  // Convert from 24-hour format to 12-hour format and add AM/PM
  const toks = removeTimeZone(dateTimeString).split("T");
  const time = toks[1];
  const timeOnly = time.split(":");
  const hour = parseInt(timeOnly[0]);
  const minute = timeOnly[1];
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12;
  if (hour12 === 0) {
    return `12:${minute}${ampm}`;
  }
  return `${hour12}:${minute}${ampm}`;
};

const combineSchedule = (schedule: any) => {
  // Sort the schedule by time
  const flattenedSchedule = schedule.slice().sort((a: any, b: any) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });
  // Merge contiguous times (separated by 30 minutes) into a single event
  for (let i = 0; i < flattenedSchedule.length; i++) {
    const currentEvent = flattenedSchedule[i];
    const nextEvent = flattenedSchedule[i + 1];
    if (
      nextEvent &&
      new Date(currentEvent.end).getTime() + 10000 >=
        new Date(nextEvent.start).getTime()
    ) {
      currentEvent.end = nextEvent.end;
      flattenedSchedule.splice(i + 1, 1);
      i--;
    }
  }
  for (let i = 0; i < flattenedSchedule.length; i++) {
    flattenedSchedule[i] = {
      id: flattenedSchedule[i].start,
      text: `${timeOnly(flattenedSchedule[i].start)} - ${timeOnly(
        flattenedSchedule[i].end
      )}`,
      backColor: "yellow",
      start: removeTimeZone(flattenedSchedule[i].start),
      end: removeTimeZone(flattenedSchedule[i].end),
    };
  }

  return flattenedSchedule;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

export default function Content() {
  const [startDate, setStartDate] = useState(DayPilot.Date.today());
  const queryDate = startDate.firstDayOfWeek().toString().split("T")[0];
  const { data, error, isLoading } = useSWR(
    `/api/schedule?startDate=${queryDate}`,
    fetcher
  );
  if (error) return <div>Failed to load</div>;
  let combinedSchedule = [];
  if (data) combinedSchedule = combineSchedule(data);
  return (
    <Container size="xl" p="lg">
      <LoadingOverlay visible={isLoading} />
      <Schedule
        events={
          isLoading && combinedSchedule.length === 0 ? [] : combinedSchedule
        }
        startDate={startDate}
        setStartDate={setStartDate}
      />
    </Container>
  );
}
