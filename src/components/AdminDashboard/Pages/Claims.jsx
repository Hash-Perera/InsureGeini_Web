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
    cell: ({ row }) => (
      <div className="font-medium text-black">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div className="font-medium text-black">{row.getValue("createdAt")}</div>
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
    staleTime: Infinity,
    retry: false,
  });

  return (
    <div className="flex flex-col justify-center w-full gap-8">
      <div className="flex items-center justify-between w-full ">
        <h1 className="text-4xl font-semibold ">Clients List</h1>
        <Link
          to="/admin/clients/add"
          className="px-2 py-2 text-sm text-white transition-all duration-75 transform bg-black hover:bg-stone-950 sm:rounded-md"
        >
          Add Client
        </Link>
      </div>
      <SharedDataTable
        data={claimData?.data || []}
        columns={columns}
        searchBy={["name"]}
      />
    </div>
  );
}
