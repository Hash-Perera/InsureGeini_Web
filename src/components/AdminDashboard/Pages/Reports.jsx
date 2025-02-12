import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import SharedDataTable from "../components/SharedDataTable";

const columns = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "clientId",
    header: "Client ID",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">
        {row.getValue("clientId")}
      </div>
    ),
  },
  {
    accessorKey: "recordedBy",
    header: "Recorded By",
    cell: ({ row }) => (
      <div className="text-gray-700">{row.getValue("recordedBy")}</div>
    ),
  },
  {
    accessorKey: "incidentReport",
    header: "Incident Report",
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue("incidentReport")}>
        {row.getValue("incidentReport")}
      </div>
    ),
  },
  {
    accessorKey: "policyReport",
    header: "Policy Report",
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue("policyReport")}>
        {row.getValue("policyReport")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(record.clientId)}
            >
              Copy Client ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
const data = [
  {
    date: "2025-02-01",
    clientId: "C001",
    recordedBy: "John Doe",
    incidentReport: "Vehicle collision at intersection, minor damage.",
    policyReport: "Claim filed under comprehensive coverage.",
  },
  {
    date: "2025-02-02",
    clientId: "C002",
    recordedBy: "Alice Smith",
    incidentReport: "Water leakage in the kitchen, ceiling damage.",
    policyReport: "Home insurance claim under plumbing coverage.",
  },
  {
    date: "2025-02-03",
    clientId: "C003",
    recordedBy: "Michael Brown",
    incidentReport: "Theft reported at office premises.",
    policyReport: "Coverage under commercial property insurance.",
  },
  {
    date: "2025-02-04",
    clientId: "C004",
    recordedBy: "Sophia Johnson",
    incidentReport: "Fire damage in storage unit.",
    policyReport: "Policy covers fire and smoke damage.",
  },
  {
    date: "2025-02-05",
    clientId: "C005",
    recordedBy: "David Wilson",
    incidentReport: "Slip and fall injury in shopping mall.",
    policyReport: "Liability insurance claim initiated.",
  },
  {
    date: "2025-02-06",
    clientId: "C006",
    recordedBy: "Emma Davis",
    incidentReport: "Hailstorm damaged roof.",
    policyReport: "Home insurance covers weather-related damages.",
  },
  {
    date: "2025-02-07",
    clientId: "C007",
    recordedBy: "Oliver Martinez",
    incidentReport: "Car stolen from parking lot.",
    policyReport: "Comprehensive auto insurance claim filed.",
  },
  {
    date: "2025-02-08",
    clientId: "C008",
    recordedBy: "Mia Anderson",
    incidentReport: "Flooding in basement after heavy rain.",
    policyReport: "Flood insurance policy activated.",
  },
  {
    date: "2025-02-09",
    clientId: "C009",
    recordedBy: "James White",
    incidentReport: "Employee injury at construction site.",
    policyReport: "Workers' compensation insurance claim.",
  },
  {
    date: "2025-02-10",
    clientId: "C010",
    recordedBy: "Charlotte Thomas",
    incidentReport: "Electrical short circuit caused appliance damage.",
    policyReport: "Home insurance electrical damage coverage applied.",
  },
  {
    date: "2025-02-01",
    clientId: "C001",
    recordedBy: "John Doe",
    incidentReport: "Vehicle collision at intersection, minor damage.",
    policyReport: "Claim filed under comprehensive coverage.",
  },
  {
    date: "2025-02-02",
    clientId: "C002",
    recordedBy: "Alice Smith",
    incidentReport: "Water leakage in the kitchen, ceiling damage.",
    policyReport: "Home insurance claim under plumbing coverage.",
  },
  {
    date: "2025-02-03",
    clientId: "C003",
    recordedBy: "Michael Brown",
    incidentReport: "Theft reported at office premises.",
    policyReport: "Coverage under commercial property insurance.",
  },
  {
    date: "2025-02-04",
    clientId: "C004",
    recordedBy: "Sophia Johnson",
    incidentReport: "Fire damage in storage unit.",
    policyReport: "Policy covers fire and smoke damage.",
  },
  {
    date: "2025-02-05",
    clientId: "C005",
    recordedBy: "David Wilson",
    incidentReport: "Slip and fall injury in shopping mall.",
    policyReport: "Liability insurance claim initiated.",
  },
  {
    date: "2025-02-06",
    clientId: "C006",
    recordedBy: "Emma Davis",
    incidentReport: "Hailstorm damaged roof.",
    policyReport: "Home insurance covers weather-related damages.",
  },
  {
    date: "2025-02-07",
    clientId: "C007",
    recordedBy: "Oliver Martinez",
    incidentReport: "Car stolen from parking lot.",
    policyReport: "Comprehensive auto insurance claim filed.",
  },
  {
    date: "2025-02-08",
    clientId: "C008",
    recordedBy: "Mia Anderson",
    incidentReport: "Flooding in basement after heavy rain.",
    policyReport: "Flood insurance policy activated.",
  },
  {
    date: "2025-02-09",
    clientId: "C009",
    recordedBy: "James White",
    incidentReport: "Employee injury at construction site.",
    policyReport: "Workers' compensation insurance claim.",
  },
  {
    date: "2025-02-20",
    clientId: "C020",
    recordedBy: "Charlotte Thomas",
    incidentReport: "Electrical short circuit caused appliance damage.",
    policyReport: "fuck fuck",
  },
];

const Reports = () => {
  return (
    <main>
      <SharedDataTable
        data={data}
        columns={columns}
        searchBy={["date", "clientId"]}
      />
    </main>
  );
};

export default Reports;
