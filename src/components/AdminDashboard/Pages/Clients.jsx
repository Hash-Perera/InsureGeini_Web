import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCustomers } from "@/services/customer";
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
    accessorKey: "userId", // Assuming 'userId' is available or you can use '_id'
    header: "User ID",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">{row.getValue("userId")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">
        <a href={`mailto:${row.getValue("email")}`}>{row.getValue("email")}</a>
      </div>
    ),
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile Number",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("mobileNumber")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dob"));
      const formattedDate = date.toLocaleDateString(); // Format the date
      return <div className="font-medium">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "nicNo",
    header: "NIC No",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("nicNo")}</div>
    ),
  },
  {
    accessorKey: "insuranceId",
    header: "Insurance ID",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("insuranceId")}</div>
    ),
  },
  {
    accessorKey: "inusrancePolicy",
    header: "Insurance Policy",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("inusrancePolicy")}</div>
    ),
  },
  {
    accessorKey: "nicImage",
    header: "NIC Image",
    cell: ({ row }) => (
      <div className="font-medium">
        <a
          href={row.getValue("nicImage")}
          target="_blank"
          rel="noopener noreferrer"
        >
          View NIC Image
        </a>
      </div>
    ),
  },
  {
    accessorKey: "drivingLicenseImage",
    header: "Driving License Image",
    cell: ({ row }) => (
      <div className="font-medium">
        <a
          href={row.getValue("drivingLicenseImage")}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Driving License
        </a>
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
              onClick={() =>
                navigator.clipboard.writeText(record.inusrancePolicy)
              }
            >
              Copy Insurance Policy
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Clients = () => {
  const { data: customerData } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      try {
        const response = await getAllCustomers();
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
        data={customerData?.data || []}
        columns={columns}
        searchBy={[
          "name",
          "email",
          "mobileNumber",
          "address",
          "nicNo",
          "insuranceId",
          "inusrancePolicy",
        ]}
      />
    </div>
  );
};

export default Clients;
