import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllClaims } from "@/services/claims";
import SharedDataTable from "../components/SharedDataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { statusColors } from "@/constants/other";
import { format } from "date-fns";

const columns = [
  {
    accessorKey: "_id",
    header: "Claim Id",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">{row.getValue("_id")}</div>
    ),
  },
  {
    accessorKey: "insuranceId",
    header: "Insurance Id",
    cell: ({ row }) => (
      <div className="font-medium text-black">
        {row.getValue("insuranceId")}
      </div>
    ),
  },
  {
    accessorKey: "nicNo",
    header: "NIC No",
    cell: ({ row }) => (
      <div className="font-medium text-black">{row.getValue("nicNo")}</div>
    ),
  },
  {
    accessorKey: "vinNum",
    header: "VIN No",
    cell: ({ row }) => (
      <div className="font-medium text-black">{row.getValue("vinNum")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") || "default";
      const { text, bg } = statusColors[status] || statusColors.default;

      return (
        <div
          className="px-3 py-1 text-xs font-bold rounded-full"
          style={{
            backgroundColor: bg,
            color: text,
          }}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const dateValue = row.getValue("createdAt");
      const formattedDate = dateValue
        ? format(new Date(dateValue), "MMM d, yyyy h:mm a")
        : "N/A";

      return <div className="font-medium text-black">{formattedDate}</div>;
    },
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
              onClick={() =>
                navigator.clipboard.writeText(record.inusrancePolicy)
              }
            >
              Copy Insurance Policy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={`/admin/claims/${record._id}`}>View Details</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function Claims() {
  const { data: claimData } = useQuery({
    queryKey: ["claims"],
    queryFn: async () => {
      try {
        const response = await getAllClaims();
        return response;
      } catch (error) {
        console.error("Error fetching all customers:", error.message);
        throw error;
      }
    },
    staleTime: 2000,
    refetchInterval: 2000,
    refetchIntervalInBackground: true,
  });

  return (
    <div className="flex flex-col justify-center w-full gap-8">
      <div className="flex items-center justify-between w-full ">
        <h1 className="text-4xl font-semibold ">Claims List</h1>
      </div>
      <SharedDataTable
        data={claimData?.data || []}
        columns={columns}
        searchBy={["name"]}
      />
    </div>
  );
}
