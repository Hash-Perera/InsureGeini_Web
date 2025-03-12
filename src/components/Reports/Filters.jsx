import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";

const timeIntervals = [
  { label: "Last 7 days", value: "7days" },
  { label: "Last 30 days", value: "1month" },
  { label: "Last 3 months", value: "3months" },
];

const Filters = ({}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const timeInterval = searchParams.get("timeInterval") || "7days";

  return (
    <div className="flex items-end justify-end w-full ">
      <Select
        onValueChange={(value) => {
          setSearchParams({ timeInterval: value });
        }}
        defaultValue={timeInterval}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Select time interval" />
        </SelectTrigger>
        <SelectContent>
          {timeIntervals.map((interval) => (
            <SelectItem key={interval.value} value={interval.value}>
              {interval.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filters;
