import ClientRegistration from "@/components/Registrations/ClientRegistration";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
            <DialogHeader>
              <DialogTitle>Add Client</DialogTitle>
              <DialogDescription>
                Add a new client to the system.
              </DialogDescription>
            </DialogHeader>

            <ClientRegistration />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Clients;
