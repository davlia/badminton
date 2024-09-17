"use client";

import { Box, Container, Group, Stack, Title } from "@mantine/core";
import dynamic from "next/dynamic";

const Content = dynamic(() => import("./content"), { ssr: false });

export default function HomePage() {
  return (
    <Container size="xl" p="lg">
      <Stack align="center" gap="lg">
        <Title order={1}>Badminton Schedule for BKBC</Title>
        <Box w="100%">
          <Content />
        </Box>
      </Stack>
    </Container>
  );
}
