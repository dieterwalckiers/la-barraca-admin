import React from "react";
import { ThemeProvider, createTheme } from "@mui/material";
import { Card, Text, Heading, Stack, Container } from "@sanity/ui";

const theme = createTheme({
  components: {
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          display: "flex !important",
          padding: "0 20px !important"
        }
      }
    }
  }
});

interface StatsProps {
  tool: {
    options?: Record<string, unknown>;
  };
}

const Stats = (_props: StatsProps) => {
  return (
    <Container padding={4}>
      <Stack space={4}>
        <Heading size={2}>Stats</Heading>
        <Card padding={4} radius={2} shadow={1}>
          <Text muted>Stats functionaliteit komt binnenkort...</Text>
        </Card>
      </Stack>
    </Container>
  );
};

const StatsWrapper = (props: StatsProps) => {
  return (
    <ThemeProvider theme={theme}>
      <Stats {...props} />
    </ThemeProvider>
  );
};

export default StatsWrapper;
