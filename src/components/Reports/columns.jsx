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
import clsx from "clsx";

export const columns = [
  {
    accessorKey: "createdAt", // Assuming 'date' exists or you want to show the creation date
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toLocaleDateString(); // Converts to a readable format (local timezone)

      return <div className="font-medium">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => {
      return (
        <div className="font-medium text-blue-600">
          {row.getValue("userId")}
        </div>
      );
    },
  },
  {
    accessorKey: "claimId", // Mapping claimId to the table
    header: "Claim ID",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">{row.getValue("claimId")}</div>
    ),
  },
  {
    accessorKey: "status", // Mapping status to the table
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status"); // Get the status value

      return (
        <div
          className={clsx(
            "font-medium",
            status === "Approved"
              ? "text-green-600" // Green for Approved
              : status === "Rejected"
              ? "text-red-600" // Red for Rejected
              : "text-yellow-600" // Yellow for Pending
          )}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "decisionReport", // Mapping decisionReport to the table
    header: "Decision Report",
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue("decisionReport")}>
        <a
          href={`${row.getValue("decisionReport")}`}
          target="_blank"
          className="text-blue-600 underline"
        >
          Decision Report
        </a>
      </div>
    ),
  },
  {
    accessorKey: "estimation_approved", // Mapping estimation_approved to the table
    header: "Estimation Approved",
    cell: ({ row }) => (
      <div className="font-medium text-gray-700">
        {row.getValue("estimation_approved")}
      </div>
    ),
  },
  {
    accessorKey: "estimation_requested", // Mapping estimation_requested to the table
    header: "Estimation Requested",
    cell: ({ row }) => (
      <div className="font-medium text-gray-700">
        {row.getValue("estimation_requested")}
      </div>
    ),
  },
  {
    accessorKey: "incidentReport", // Mapping incidentReport to the table
    header: "Incident Report",
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue("incidentReport")}>
        <a
          href={`${row.getValue("incidentReport")}`}
          target="_blank"
          className="text-blue-600 underline"
        >
          Incident Report
        </a>
      </div>
    ),
  },
  {
    accessorKey: "reason", // Mapping reason to the table
    header: "Reason",
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue("reason")}>
        {row.getValue("reason")}
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
              onClick={() => navigator.clipboard.writeText(record.userId)}
            >
              Copy User ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(record.claimId)}
            >
              Copy Claim ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
