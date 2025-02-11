import StaffRegistration from "@/components/Registrations/StaffRegistration";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const Staff = () => {
  return (
    <div className="flex flex-col justify-center w-full gap-8">
      <div className="flex items-center justify-between w-full ">
        <h1 className="text-4xl font-semibold ">Staff</h1>
        <Dialog>
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
            <StaffRegistration />
          </DialogContent>
        </Dialog>
      </div>

      {/* Staff table */}
      <DataTable
        columns={[
          {
            accessorKey: "name",
            header: "Name",
          },
          {
            accessorKey: "email",
            header: "Email",
          },
          {
            accessorKey: "phone",
            header: "Phone",
          },
          {
            accessorKey: "role",
            header: "Role",
          },
          {
            accessorKey: "actions",
            header: "Actions",
          },
        ]}
        data={[
          {
            name: "John Doe",
            email: "",
            phone: "",
            role: "Admin",
            actions: "",
          },
        ]}
      />
    </div>
  );
};

export default Staff;
