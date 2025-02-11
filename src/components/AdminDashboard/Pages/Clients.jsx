import ClientRegistration from "@/components/Registrations/ClientRegistration";
import VehicleRegistration from "@/components/Registrations/VehicleRegistration";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Clients = () => {
  return (
    <div className="flex flex-col justify-center w-full gap-8">
      <div className="flex items-center justify-between w-full ">
        <h1 className="text-4xl font-semibold ">Clients List</h1>
        <Dialog>
          <DialogTrigger className="px-2 py-2 text-sm text-white transition-all duration-75 transform bg-black hover:bg-stone-950 sm:rounded-md">
            Add Client
          </DialogTrigger>
          <DialogContent className="max-w-[39rem]  space-y-4  " close={false}>
            <Tabs defaultValue="client" className="w-full">
              <TabsList className="w-full h-11">
                <TabsTrigger className="w-full h-9" value="client">
                  Add New Client
                </TabsTrigger>
                <TabsTrigger className="w-full h-9" value="vehicle">
                  Add New Vehicle
                </TabsTrigger>
              </TabsList>
              <TabsContent value="client">
                <DialogHeader className={" my-5"}>
                  <DialogDescription>
                    Add a new client to the system.
                  </DialogDescription>
                </DialogHeader>
                <ClientRegistration />
              </TabsContent>
              <TabsContent value="vehicle">
                <DialogHeader>
                  <DialogDescription>
                    Add a new vehicle to the system.
                  </DialogDescription>
                </DialogHeader>
                <VehicleRegistration />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Client table */}
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

export default Clients;
