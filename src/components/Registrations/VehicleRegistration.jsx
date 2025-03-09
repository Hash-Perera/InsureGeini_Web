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
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import policyData from "@/components/Registrations/policies.json";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { addVehicle } from "@/services/vehicle";
import { Loader } from "lucide-react";

// Vehicle Registration Schema
const vehicleRegistrationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  insurancePolicyNo: z.string().min(1, "Insurance policy number is required"),
  insuranceCardImageFront: z
    .instanceof(File, "Insurance card front image is required") // Validates that the file is provided
    .refine((file) => file?.size > 0, "Insurance card front image is required"),
  insuranceCardImageBack: z
    .instanceof(File, "Insurance card back image is required") // Validates that the file is provided
    .refine((file) => file?.size > 0, "Insurance card back image is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehiclePhotosFront: z
    .instanceof(File, "Vehicle front photo is required")
    .refine((file) => file?.size > 0, "Vehicle front photo is required"),
  vehiclePhotosBack: z
    .instanceof(File, "Vehicle back photo is required")
    .refine((file) => file?.size > 0, "Vehicle back photo is required"),
  vehiclePhotosLeft: z
    .instanceof(File, "Vehicle left photo is required")
    .refine((file) => file?.size > 0, "Vehicle left photo is required"),
  vehiclePhotosRight: z
    .instanceof(File, "Vehicle right photo is required")
    .refine((file) => file?.size > 0, "Vehicle right photo is required"),
  engineNo: z.string().min(1, "Engine number is required"),
  chassisNo: z.string().min(1, "Chassis number is required"),
  vinNumber: z.string().min(1, "VIN number is required"),
  vehicleColor: z.string().min(1, "Vehicle color is required"),
  vehicleNumberPlate: z.string().min(1, "Vehicle number plate is required"),
  numberPlateImageFront: z
    .instanceof(File, "Number plate front image is required")
    .refine((file) => file?.size > 0, "Number plate front image is required"),
  numberPlateImageBack: z
    .instanceof(File, "Number plate back image is required")
    .refine((file) => file?.size > 0, "Number plate back image is required"),
});

const VehicleRegistration = ({
  userId,
  setUserId,
  setIsCustomerRegistered,
}) => {
  const [loading, setLoading] = useState(false);

  const vehicleRegistrationForm = useForm({
    resolver: zodResolver(vehicleRegistrationSchema),
    defaultValues: {
      userId: userId,
      insurancePolicyNo: "",
      vehicleModel: "",
      engineNo: "",
      chassisNo: "",
      vinNumber: "",
      vehicleColor: "",
      vehicleNumberPlate: "",
      insuranceCardImageFront: null,
      insuranceCardImageBack: null,
      vehiclePhotosFront: null,
      vehiclePhotosBack: null,
      vehiclePhotosLeft: null,
      vehiclePhotosRight: null,
      numberPlateImageFront: null,
      numberPlateImageBack: null,
    },
  });

  const { setValue, clearErrors } = vehicleRegistrationForm;

  // Image upload handler
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (type === "insuranceCardImageFront") {
      setValue("insuranceCardImageFront", file);
      clearErrors("insuranceCardImageFront");
    } else if (type === "insuranceCardImageBack") {
      setValue("insuranceCardImageBack", file);
      clearErrors("insuranceCardImageBack");
    } else if (type === "vehiclePhotosFront") {
      setValue("vehiclePhotosFront", file);
      clearErrors("vehiclePhotosFront");
    } else if (type === "vehiclePhotosBack") {
      setValue("vehiclePhotosBack", file);
      clearErrors("vehiclePhotosBack");
    } else if (type === "vehiclePhotosLeft") {
      setValue("vehiclePhotosLeft", file);
      clearErrors("vehiclePhotosLeft");
    } else if (type === "vehiclePhotosRight") {
      setValue("vehiclePhotosRight", file);
      clearErrors("vehiclePhotosRight");
    } else if (type === "numberPlateImageFront") {
      setValue("numberPlateImageFront", file);
      clearErrors("numberPlateImageFront");
    } else if (type === "numberPlateImageBack") {
      setValue("numberPlateImageBack", file);
      clearErrors("numberPlateImageBack");
    }
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await addVehicle(data);
        toast.success("Vehicle added successfully");
        vehicleRegistrationForm.reset();
        setLoading(false);
        return response;
      } catch (error) {
        setLoading(false);
        toast.error("Error adding Vehicle");
      }
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    console.log(data); // For debugging
    const formData = new FormData();

    for (const key in data) {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    }

    mutation.mutate(formData);
  };

  const addAnotherClient = () => {
    setIsCustomerRegistered(false);
    setUserId(null);
  };

  return (
    <div className="w-full ">
      <div className="flex items-center justify-between mb-4 ">
        <div className="flex flex-col ">
          <h1 className="text-2xl font-semibold">Add Vehicle</h1>
          <p className="text-sm text-gray-500">
            Please fill in the details to add a new Vehicle
          </p>
        </div>
        <Button
          onClick={addAnotherClient}
          className="w-[200px] h-9 btn-primary"
        >
          Add Another Client
        </Button>
      </div>
      <Form {...vehicleRegistrationForm}>
        <form
          className="p-3 space-y-4 bg-gray-100 rounded-lg"
          onSubmit={vehicleRegistrationForm.handleSubmit(onSubmit)}
        >
          {/* Insurance Policy Select */}
          <FormField
            control={vehicleRegistrationForm.control}
            name="insurancePolicyNo"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="insurancePolicyNo">Insurance Policy</Label>
                <FormControl>
                  <Select
                    id="insurancePolicyNo"
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full max-w-md"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an insurance policy">
                        {policyData?.insurance_policies?.find(
                          (policy) => policy.title === field.value
                        )?.title || "Select an insurance policy"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Insurance Policies</SelectLabel>
                        {policyData?.insurance_policies?.map((policy) => (
                          <SelectItem key={policy.index} value={policy.title}>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm font-medium">
                                {policy.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {policy.description}
                              </p>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-2">
            {/* Vehicle Model */}
            <FormField
              control={vehicleRegistrationForm.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="vehicleModel">Vehicle Model</Label>
                  <FormControl>
                    <Input id="vehicleModel" {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Engine Number */}
            <FormField
              control={vehicleRegistrationForm.control}
              name="engineNo"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="engineNo">Engine Number</Label>
                  <FormControl>
                    <Input id="engineNo" {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* chassisNo  */}
            <FormField
              control={vehicleRegistrationForm.control}
              name="chassisNo"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="chassisNo">Chassis No</Label>
                  <FormControl>
                    <Input id="chassisNo" {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* vinNumber */}
            <FormField
              control={vehicleRegistrationForm.control}
              name="vinNumber"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="vinNumber">VIN Number</Label>
                  <FormControl>
                    <Input id="vinNumber" {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {/* vehicleColor  */}
            <FormField
              control={vehicleRegistrationForm.control}
              name="vehicleColor"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="vehicleColor">vehicle Colour</Label>
                  <FormControl>
                    <Input id="vehicleColor" {...field} className="max-w-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* vehicle NumberPlate */}
            <FormField
              control={vehicleRegistrationForm.control}
              name="vehicleNumberPlate"
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="vehicleNumberPlate">
                    Vehicle Number Plate
                  </Label>
                  <FormControl>
                    <Input
                      id="vehicleNumberPlate"
                      {...field}
                      className="max-w-md"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Upload Fields */}
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={vehicleRegistrationForm.control}
              name="insuranceCardImageFront"
              render={({ field }) => (
                <FormItem>
                  <Label>Insurance Card Front</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, "insuranceCardImageFront")
                    }
                  />
                  <FormMessage
                    error={
                      vehicleRegistrationForm.formState.errors
                        ?.vehiclePhotosFront?.message
                    }
                  />
                </FormItem>
              )}
            />

            <FormField
              control={vehicleRegistrationForm.control}
              name="insuranceCardImageBack"
              render={({ field }) => (
                <FormItem>
                  <Label>Insurance Card Back</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, "insuranceCardImageBack")
                    }
                  />
                  <FormMessage
                    error={
                      vehicleRegistrationForm.formState?.errors
                        ?.insuranceCardImageBack
                    }
                  />
                </FormItem>
              )}
            />
          </div>

          {/* Vehicle Photos */}
          <div className="grid grid-cols-2 gap-2">
            <FormItem>
              <Label>Vehicle Front Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "vehiclePhotosFront")}
              />
              <FormMessage
                error={
                  vehicleRegistrationForm.formState?.errors?.vehiclePhotosFront
                    ?.message
                }
              />
            </FormItem>

            <FormItem>
              <Label>Vehicle Back Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "vehiclePhotosBack")}
              />
              <FormMessage
                error={
                  vehicleRegistrationForm.formState?.errors?.vehiclePhotosBack
                }
              />
            </FormItem>
          </div>

          {/* vehicle photos */}
          <div className="grid grid-cols-2 gap-2">
            <FormItem>
              <Label>Vehicle Left Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "vehiclePhotosLeft")}
              />
              <FormMessage
                error={
                  vehicleRegistrationForm.formState?.errors?.vehiclePhotosLeft
                }
              />
            </FormItem>

            <FormItem>
              <Label>Vehicle Right Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "vehiclePhotosRight")}
              />
              <FormMessage
                error={
                  vehicleRegistrationForm.formState?.errors?.vehiclePhotosRight
                }
              />
            </FormItem>
          </div>

          {/* Vehicle Details */}
          <div className="grid grid-cols-2 gap-2">
            <FormItem>
              <Label>Number Plate Front Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "numberPlateImageFront")}
              />
              <FormMessage
                error={
                  vehicleRegistrationForm.formState?.errors
                    ?.numberPlateImageFront
                }
              />
            </FormItem>

            <FormItem>
              <Label>Vehicle Back numberplate Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "numberPlateImageBack")}
              />
              <FormMessage
                error={
                  vehicleRegistrationForm.formState?.errors
                    ?.numberPlateImageBack
                }
              />
            </FormItem>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-[200px] h-9 btn-primary"
            disabled={loading}
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              "Register Vehicle"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default VehicleRegistration;

/* const VehicleOwnerSelect = ({ clients, onValueChange }) => {
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
}; */
