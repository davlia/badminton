"use client";

import React, { useEffect } from "react";
import { Box, Container, Stack, Title, Text } from "@mantine/core";
import dynamic from "next/dynamic";
import Link from "next/link";

const Content = dynamic(() => import("./content"), { ssr: false });

export default function HomePage() {
  useEffect(() => {
    const originalTitle = document.title;
    const newTitle = "🥺 👉👈 come back";

    const handleVisibilityChange = () => {
      document.title = document.hidden ? newTitle : originalTitle;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <Container size="xl" p="lg">
      <Stack align="center" gap="lg">
        <Stack align="center" gap="0">
          <Title order={1}>BKBC Schedule</Title>
          <Text>
            14 Woodward Ave, Ridgewood, NY 11385{" "}
            <Link href="https://nybcreservation.as.me/">Reserve Here</Link>
          </Text>
        </Stack>
        <Box w="100%">
          <Content />
        </Box>
      </Stack>
    </Container>
  );
}
