"use client";
import React from "react";
import { MantineProvider } from "@mantine/core";
import Tables from "./Table/Table";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Comp({ data }: { data: any }) {

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
      >
        <div>
          <Tables queryClient={queryClient}/>
          
        </div>
      </MantineProvider>
    </QueryClientProvider>
  );
}
