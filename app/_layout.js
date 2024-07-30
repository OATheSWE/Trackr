import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import "@mantine/core/styles.css";
import "../global.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";
import { Slot } from "expo-router";
import { Notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";


const App = () => {

  return (
    <MantineProvider>
      <ModalsProvider>
        <Notifications />
        <Slot />
      </ModalsProvider>
    </MantineProvider>
  );
};

export default App;
