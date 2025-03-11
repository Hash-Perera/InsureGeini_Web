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
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { addCustomer } from "@/services/customer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { policies } from "../../Registrations/policyData.js";
import VehicleRegistration from "@/components/Registrations/VehicleRegistration";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "File cannot be empty")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
    "Invalid file type"
  )
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File size must be less than 5MB"
  );

// Define Zod Schema
const clientRegistrationSchema = z.object({
  name: z.string().min(1, "First name cannot be empty"),
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  nicNo: z.string().min(1, "NIC cannot be empty"),
  insuranceId: z.string().min(1, "Insurance ID cannot be empty"),
  mobileNumber: z.string().min(10, "Invalid mobile number"),
  address: z.string().min(1, "Address cannot be empty"),
  role: z.string().min(["client", "value"], "Please select a client type"),
  dob: z.string().min(1, "Date of birth cannot be empty"),
  drivingLicenseNo: z.string().min(1, "Driving license number cannot be empty"),
  inusrancePolicy: z.string().min(1, "Insurance policy cannot be empty"),
  drivingLicenseImage: imageFileSchema,
  nicImage: imageFileSchema,
});

const AddClient = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [nicImage, setNicImage] = useState(null);
  const [drivingLicenseImage, setDrivingLicenseImage] = useState(null);
  const [isCustomerRegistered, setIsCustomerRegistered] = useState(false);
  const [userId, setUserId] = useState(null);

  const clientRegistrationForm = useForm({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      nicNo: "",
      password: "",
      insuranceId: "",
      mobileNumber: "",
      address: "",
      role: "674831bc5442f8e14a3f3815",
      dob: "",
      drivingLicenseNo: "",
      inusrancePolicy: "Damage to or Loss of Vehicle",
      nicImage: "",
      drivingLicenseImage: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await addCustomer(data);
        toast.success("Customer added successfully");
        setIsCustomerRegistered(true); // Set state to true to show vehicle registration form
        clientRegistrationForm.reset();
        setUserId(response.userId);
        setLoading(false);
        console.log(response);
        return response;
      } catch (error) {
        setLoading(false);
        // toast.error("Error adding customer");
      }
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    for (const key in data) {
      if (data[key]) {
        formData.append(key, data[key]);
      }
    }
    mutation.mutate(formData);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (type === "nicImage") {
      setNicImage(file);
      clientRegistrationForm.setValue("nicImage", file);
    }
    if (type === "drivingLicenseImage") {
      setDrivingLicenseImage(file);
      clientRegistrationForm.setValue("drivingLicenseImage", file);
    } else {
      console.error("Invalid image type");
    }
  };

  return (
    <div className="max-w-4xl space-y-4 ">
      {!isCustomerRegistered && !userId && !id && (
        <>
          <div>
            <h1 className="text-2xl font-semibold">Add Client</h1>
            <p className="text-sm text-gray-500">
              Please fill in the details to add a new client
            </p>
          </div>
          <Form {...clientRegistrationForm}>
            <form
              className="p-3 space-y-4 rounded-lg bg-gray-50 "
              onSubmit={clientRegistrationForm.handleSubmit(onSubmit)}
            >
              {/* policy type select */}
              <FormField
                control={clientRegistrationForm.control}
                name="inusrancePolicy"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="inusrancePolicy">Insurance Policy</Label>
                    <FormControl>
                      <Select
                        id="inusrancePolicy"
                        value={field.value} // ✅ Ensure the selected value is managed by React Hook Form
                        onValueChange={field.onChange} // ✅ Handle changes properly
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
                            {policies?.map((policy) => (
                              <SelectItem
                                key={policy.index}
                                value={policy.title}
                              >
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

              {/* Name & NIC Row */}
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={clientRegistrationForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="name">Full Name</Label>
                      <FormControl>
                        <Input id="name" {...field} className="max-w-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientRegistrationForm.control}
                  name="nicNo"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="nicNo">NIC</Label>
                      <FormControl>
                        <Input id="nicNo" {...field} className="max-w-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email & Mobile Number */}
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={clientRegistrationForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="email">Email</Label>
                      <FormControl>
                        <Input id="email" {...field} className="max-w-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientRegistrationForm.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <FormControl>
                        <Input
                          id="mobileNumber"
                          {...field}
                          className="max-w-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Address & DOB */}
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={clientRegistrationForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="address">Address</Label>
                      <FormControl>
                        <Input id="address" {...field} className="max-w-md" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientRegistrationForm.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <FormControl>
                        <Input
                          id="dob"
                          type="date"
                          {...field}
                          className="max-w-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Insurance Policy & Driving License */}
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={clientRegistrationForm.control}
                  name="insuranceId"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="insuranceId">Insurance ID</Label>
                      <FormControl>
                        <Input
                          id="insuranceId"
                          {...field}
                          className="max-w-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={clientRegistrationForm.control}
                  name="drivingLicenseNo"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="drivingLicenseNo">
                        Driving License No
                      </Label>
                      <FormControl>
                        <Input
                          id="drivingLicenseNo"
                          {...field}
                          className="max-w-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Upload Fields */}
              <div className="grid grid-cols-2 gap-2">
                <FormItem>
                  <Label>NIC Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "nicImage")}
                  />
                  {nicImage && (
                    <p className="text-sm text-gray-500">{nicImage[0]?.name}</p>
                  )}
                  <FormMessage
                    error={clientRegistrationForm?.formState?.errors?.nicImage}
                  />
                </FormItem>

                <FormItem>
                  <Label>Driving License Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleImageUpload(e, "drivingLicenseImage")
                    }
                  />
                  {drivingLicenseImage && (
                    <p className="text-sm text-gray-500">
                      {drivingLicenseImage[0]?.name}
                    </p>
                  )}
                  <FormMessage
                    error={
                      clientRegistrationForm?.formState?.errors
                        ?.drivingLicenseImage
                    }
                  />
                </FormItem>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3 ">
                  <FormField
                    control={clientRegistrationForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <Label htmlFor="password">Password</Label>
                        <FormControl>
                          <Input
                            id="password"
                            type="password"
                            {...field}
                            className="max-w-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-[200px] h-9 btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
        </>
      )}

      {/* Show Vehicle Registration Form */}
      {(isCustomerRegistered && userId) ||
        (id && (
          <VehicleRegistration
            userId={userId || id}
            setUserId={setUserId}
            setIsCustomerRegistered={setIsCustomerRegistered}
          />
        ))}
    </div>
  );
};

export default AddClient;
