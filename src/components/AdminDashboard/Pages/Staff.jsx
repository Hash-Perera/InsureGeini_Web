import { useState } from "react";
import StaffRegistration from "@/components/Registrations/StaffRegistration";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SharedDataTable from "../components/SharedDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStaff, deleteUser } from "@/services/staff";
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

const Staff = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: saffData } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      try {
        const response = await getStaff();
        return response;
      } catch (error) {
        console.error("Error fetching all staff:", error.message);
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const deleteStaff = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await deleteUser(id);
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        return response;
      } catch (error) {
        console.error("Error deleting staff:", error.message);
        throw error;
      }
    },
  });

  const handleDelete = (id) => {
    deleteStaff.mutate(id);
  };

  const columns = [
    {
      accessorKey: "_id", // Staff ID (Object ID)
      header: "Staff ID",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600">{row.getValue("_id")}</div>
      ),
    },
    {
      accessorKey: "name", // Staff name
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email", // Staff email
      header: "Email",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600">
          <a href={`mailto:${row.getValue("email")}`}>
            {row.getValue("email")}
          </a>
        </div>
      ),
    },
    {
      accessorKey: "mobileNumber", // Staff mobile number
      header: "Mobile Number",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("mobileNumber")}</div>
      ),
    },
    {
      accessorKey: "address", // Staff address
      header: "Address",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("address")}</div>
      ),
    },
    {
      id: "actions", // Actions column for further actions (e.g., view, edit)
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
                onClick={() => navigator.clipboard.writeText(record._id)}
              >
                Copy Staff ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(record.email)}
              >
                Copy Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  handleDelete(record._id);
                }}
              >
                <span className="text-red-500">
                  <strong>Delete</strong>
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col justify-center w-full gap-8">
      <div className="flex items-center justify-between w-full ">
        <h1 className="text-4xl font-semibold ">Staff</h1>
        <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <DialogTrigger className="px-2 py-2 text-sm text-white transition-all duration-75 transform bg-black hover:bg-stone-950 sm:rounded-md">
            Add Staff
          </DialogTrigger>
          <DialogContent className="max-w-[39rem]  space-y-4  ">
            <DialogHeader>
              <DialogTitle>Add Staff</DialogTitle>
              <DialogDescription>
                Add a new staff member to the system
              </DialogDescription>
            </DialogHeader>
            <StaffRegistration setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff table */}
      <SharedDataTable
        data={saffData?.data || []}
        columns={columns}
        searchBy={["name", "email", "mobileNumber", "address"]}
      />
    </div>
  );
};

export default Staff;
