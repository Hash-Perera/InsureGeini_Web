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
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { addVehicle } from "@/services/vehicle";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  policies,
  generalProtectionAddons,
  vehicleSpecificAddons,
  usageSpecificAddons,
  workRelatedCommercialUseAddons,
} from "../../constants/policyData.js";

import { vehicleRegistrationSchema } from "@/constants/validationSchema.js";

const VehicleRegistration = ({
  userId,
  setUserId,
  setIsCustomerRegistered,
}) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const vehicleRegistrationForm = useForm({
    resolver: zodResolver(vehicleRegistrationSchema),
    defaultValues: {
      userId: userId,
      insurancePolicy: "",
      policyAdOns: {
        generaProtection: [],
        vehicleSpecific: [],
        usageSpecific: [],
        workRelated: [],
      },
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
    const formData = new FormData();

    // Extract image files
    const imageFields = [
      "insuranceCardImageFront",
      "insuranceCardImageBack",
      "vehiclePhotosFront",
      "vehiclePhotosBack",
      "vehiclePhotosLeft",
      "vehiclePhotosRight",
      "numberPlateImageFront",
      "numberPlateImageBack",
    ];

    // Add image files to FormData
    imageFields.forEach((field) => {
      if (data[field]) {
        formData.append(field, data[field]);
      }
    });

    const jsonData = {};

    Object.keys(data).forEach((key) => {
      if (!imageFields.includes(key)) {
        jsonData[key] = data[key];
      }
    });

    formData.append("jsonData", JSON.stringify(jsonData));

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
        {!id && (
          <Button
            onClick={addAnotherClient}
            className="w-[200px] h-9 btn-primary"
          >
            Add Another Client
          </Button>
        )}
      </div>
      <Form {...vehicleRegistrationForm}>
        <form
          className="p-3 space-y-4 rounded-lg bg-gray-50"
          onSubmit={vehicleRegistrationForm.handleSubmit(onSubmit)}
        >
          {/* Insurance Policy Select */}
          <FormField
            control={vehicleRegistrationForm.control}
            name="insurancePolicy"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="insurancePolicy">Insurance Policy</Label>
                <FormControl>
                  <Select
                    id="insurancePolicy"
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full max-w-md"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an insurance policy">
                        {policies?.find(
                          (policy) => policy.title === field.value
                        )?.title || "Select an insurance policy"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Insurance Policies</SelectLabel>
                        {policies?.map((policy, index) => (
                          <SelectItem key={index} value={policy.title}>
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

          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger className="no-underline hover:no-underline">
                Insurance Policy Add Ons
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-2 ">
                  <div className="flex flex-col gap-2">
                    <Label>General Protection Add Ons</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {generalProtectionAddons.map((addon) => (
                        <FormField
                          key={addon.value}
                          control={vehicleRegistrationForm.control}
                          name="policyAdOns.generaProtection"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex items-center gap-2 mt-1">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(addon.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            addon.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== addon.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <Label className="text-xs">{addon.label}</Label>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-3">
                    <Label>
                      Vehicle Specific Add Ons (Optional - Select if applicable)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {vehicleSpecificAddons?.map((addon) => (
                        <FormField
                          key={addon.value}
                          control={vehicleRegistrationForm.control}
                          name="policyAdOns.vehicleSpecific"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex items-center gap-2 mt-1">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(addon.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            addon.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== addon.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <Label className="text-xs">{addon.label}</Label>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-3">
                    <Label>
                      Usage Specific Add Ons (Optional - Select if applicable)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {usageSpecificAddons?.map((addon) => (
                        <FormField
                          key={addon.value}
                          control={vehicleRegistrationForm.control}
                          name="policyAdOns.usageSpecific"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex items-center gap-2 mt-1">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(addon.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            addon.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== addon.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <Label className="text-xs">{addon.label}</Label>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-3">
                    <Label>
                      Work Related Commercial Use Add Ons (Optional - Select if
                      applicable)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {workRelatedCommercialUseAddons?.map((addon) => (
                        <FormField
                          key={addon.value}
                          control={vehicleRegistrationForm.control}
                          name="policyAdOns.workRelated"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex items-center gap-2 mt-1">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(addon.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            addon.value,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== addon.value
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <Label className="text-xs">{addon.label}</Label>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

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
