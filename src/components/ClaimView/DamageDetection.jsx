import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDetectionsById } from "@/services/detection";
import SharedDataTable from "../AdminDashboard/components/SharedDataTable";
import { FileText } from "lucide-react";

export const columns = [
  {
    accessorKey: "part", // Mapping part to the table
    header: "Part",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("part")}</div>
    ),
  },
  {
    accessorKey: "damageType", // Mapping damageType to the table
    header: "Damage Type",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("damageType").join(", ")}</div> // Join the array items as a string
    ),
  },
  {
    accessorKey: "severity", // Mapping severity to the table
    header: "Severity",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("severity")}</div>
    ),
  },
  {
    accessorKey: "internal", // Mapping internal to the table
    header: "Internal Details",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("internal")}</div>
    ),
  },
  {
    accessorKey: "decision", // Mapping decision to the table
    header: "Decision",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("decision")}</div>
    ),
  },
  {
    accessorKey: "reason", // Mapping reason to the table
    header: "Reason",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("reason")}</div>
    ),
  },
  {
    accessorKey: "cost", // Mapping cost to the table
    header: "Cost",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("cost")}</div>
    ),
  },
  {
    accessorKey: "flag", // Mapping flag to the table
    header: "Flag",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("flag")}</div>
    ),
  },
];

const DamageDetection = () => {
  const { id: claimId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["detections", claimId],
    queryFn: () => getDetectionsById(claimId),
    staleTime: Infinity,
    retry: false,
  });

  return (
    <div className="px-4 mt-4">
      <div className="flex gap-2 items-center px-5 py-3 mb-5 text-white bg-gradient-to-r from-blue-900 to-blue-600 rounded-md shadow-md">
        <FileText size={24} />
        <h2 className="text-2xl font-bold tracking-wide uppercase">
          Damage Detection Results
        </h2>
      </div>
      <SharedDataTable
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        error={error}
        searchBy={[
          "part",
          "damageType",
          "severity",
          "internal",
          "decision",
          "reason",
          "cost",
          "flag",
        ]}
      />
    </div>
  );
};

export default DamageDetection;
