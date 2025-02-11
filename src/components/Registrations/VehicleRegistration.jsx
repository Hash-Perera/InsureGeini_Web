import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command";

const vehicleRegistrationSchema = z.object({
  vehicleType: z.string().min(1, "Vehicle type field cannot be empty"),
  vehicleNumber: z.string().min(1, "Vehicle number field cannot be empty"),
  vehicleModel: z.string().min(1, "Vehicle model field cannot be empty"),
  vehicleOwner: z.string().min(1, "Vehicle owner field cannot be empty"),
});

const mockClients = [
  "John Doe",
  "Jane Doe",
  "Alice Smith",
  "Bob Smith",
  "Charlie Brown",
  "Diana Brown",
  "Eve Johnson",
  "Frank Johnson",
  "Grace Williams",
  "Henry Williams",
  "Ivy Davis",
  "Jack Davis",
  "Kate Miller",
  "Larry Miller",
  "Mary Wilson",
  "Nancy Wilson",
  "Oliver Moore",
  "Pamela Moore",
  "Quincy Lee",
  "Rachel Lee",
  "Samuel Taylor",
  "Tina Taylor",
  "Ulysses Clark",
  "Victoria Clark",
  "William Young",
  "Xena Young",
  "Yvonne Harris",
  "Zachary Harris",
  "Adam King",
  "Bella King",
  "Carl Adams",
  "Daisy Adams",
  "Ethan Brown",
  "Fiona Brown",
  "George Clark",
  "Hannah Clark",
  "Isaac Davis",
  "Jenny Davis",
  "Kevin Edwards",
  "Lily Edwards",
  "Mason Fisher",
  "Nora Fisher",
  "Oscar Green",
  "Penny Green",
  "Quinn Harris",
  "Rose Harris",
  "Samuel Irving",
  "Tara Irving",
  "Ulysses Johnson",
  "Violet Johnson",
  "William King",
  "Xena King",
];
const VehicleRegistration = () => {
  return <div className="w-full "></div>;
};

export default VehicleRegistration;

const VehicleOwnerSelect = ({ clients, onValueChange }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedClient, setselectedClient] = React.useState("");

  // Filter clients based on the search term
  const filteredclients = clients.filter((client) =>
    client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (value) => {
    setselectedClient(value); // Update local state
    onValueChange(value); // Trigger the external callback
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[280px] justify-start">
          {selectedClient ? (
            <span>{selectedClient}</span>
          ) : (
            <span>Select Client</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Search Client..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No clients for that id </CommandEmpty>
            <CommandGroup>
              {filteredclients.map((client) => (
                <CommandItem key={client} onSelect={() => handleSelect(client)}>
                  <span>{client}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
