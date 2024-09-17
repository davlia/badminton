"use client";

import { Box, Container, Stack, Title, Text } from "@mantine/core";
import dynamic from "next/dynamic";
import Link from "next/link";

const Content = dynamic(() => import("./content"), { ssr: false });

export default function HomePage() {
  return (
    <Container size="xl" p="lg">
      <Stack align="center" gap="lg">
        <Stack align="center" gap="0">
          <Title order={1}>Badminton Schedule for BKBC</Title>
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
