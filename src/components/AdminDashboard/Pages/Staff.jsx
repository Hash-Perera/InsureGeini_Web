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

const Staff = () => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  return (
    <div className="flex flex-col justify-center w-full gap-8">
      <div className="flex items-center justify-between w-full ">
        <h1 className="text-4xl font-semibold ">Staff</h1>
        <Dialog onOpenChange={setIsOpen} isOpen={isOpen}>
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
      {/*  <SharedDataTable /> */}
    </div>
  );
};

export default Staff;
