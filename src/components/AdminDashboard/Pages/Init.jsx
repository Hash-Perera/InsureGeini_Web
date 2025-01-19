"use client";
import React from "react";
import { ChartArea } from "@/components/ui/AreaChart";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

export function Init() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3">
      <ChartArea
        data={chartData}
        config={chartConfig}
        title="Area Chart - Stacked"
        description="Showing total visitors for the last 6 months"
      />
      <ChartArea
        data={chartData}
        config={chartConfig}
        title="Area Chart - Stacked"
        description="Showing total visitors for the last 6 months"
      />
      <ChartArea
        data={chartData}
        config={chartConfig}
        title="Area Chart - Stacked"
        description="Showing total visitors for the last 6 months"
      />
    </div>
  );
}
