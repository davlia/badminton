import { addDays, addMinutes, format, parseISO } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';

const appointmentTypes = {
  "48094909": 45, // 2 person (45 min)
  "59989840": 30, // 30 min
} as const;

type AppointmentTypeId = keyof typeof appointmentTypes;

interface ScheduleParams {
  owner: string;
  appointmentTypeId: string;
  calendarId: string;
  startDate: string;
  maxDays: string;
  timezone: string;
}

async function fetchNYBCSchedule({
  owner = '6efeecae',
  appointmentTypeId,
  calendarId = "any",
  startDate,
  maxDays = "10",
  timezone = "America/New_York",
}: Partial<ScheduleParams>): Promise<any> {
  const params = new URLSearchParams({
    owner,
    appointmentTypeId: appointmentTypeId || "",
    calendarId,
    startDate: startDate || "",
    maxDays,
    timezone
  });
  const url = `https://nybcreservation.as.me/api/scheduling/v1/availability/times?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data for appointment type ${appointmentTypeId}`
    );
  }
  const res = await response.json();

  const reformatted = [];
  for (const [date, times] of Object.entries(res)) {
    for (const time of times as any) {
      const duration = appointmentTypes[appointmentTypeId as AppointmentTypeId];
      reformatted.push({
        start: time.time,
        end: format(
          addMinutes(parseISO(time.time), duration),
          "yyyy-MM-dd'T'HH:mm:ssXXX"
        ),
      });
    }
  }
  return reformatted;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || new Date().toISOString().split("T")[0];
    const threeDaysLater = addDays(new Date(startDate), 3).toISOString().split("T")[0];
    const fetchPromises = Object.entries(appointmentTypes).map(
      ([appointmentTypeId]) =>
        fetchNYBCSchedule({ appointmentTypeId, startDate })
    );
    const fetchPromisesThreeDaysLater = Object.entries(appointmentTypes).map(
      ([appointmentTypeId]) =>
        fetchNYBCSchedule({ appointmentTypeId, startDate: threeDaysLater })
    );

    const promises = [...fetchPromises, ...fetchPromisesThreeDaysLater];

    const results = await Promise.all(promises);
    const combinedData = results.flat();
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
