import { useState } from "react";
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addStaff } from "@/services/staff";
import { useMutation } from "@tanstack/react-query";

const staffTypes = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Staff" },
];

const staffRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name field cannot be empty"),
  lastName: z.string().min(1, "Last name field cannot be empty"),
  nic: z.string().min(1, "NIC field cannot be empty"),
  staffType: z.string().min(["admin", "value"], "Please select a staff type"),
  email: z
    .string()
    .min(1, "Email field cannot be empty")
    .email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long"),
});

const StaffRegistration = () => {
  const [loading, setLoading] = useState(false);

  const staffRegistrationForm = useForm({
    resolver: zodResolver(staffRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nic: "",
      email: "",
      password: "",
      confirmPassword: "",
      staffType: staffTypes[0].value,
    },
  });

  const mutation = useMutation({
    mutationFn: addStaff,
    onSuccess: () => {
      showSuccessToast(toast, "Staff added successfully");
    },
    onError: (error, variables, context) => {
      showErrorToast(
        toast,
        error?.response?.data?.message || "An unexpected error occurred"
      );
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    mutation.mutate(data);
  };

  return (
    <Form {...staffRegistrationForm}>
      <form
        className="w-full space-y-2"
        onSubmit={staffRegistrationForm.handleSubmit(onSubmit)}
      >
        {/* staff type select */}
        <FormField
          control={staffRegistrationForm.control}
          name="staffType"
          render={({ field }) => (
            <FormItem>
              <Label htmlFor="staffType">Staff Type</Label>
              <FormControl>
                <Select {...field} id="staffType" className="w-full max-w-md">
                  <SelectTrigger>
                    <SelectValue>
                      {
                        staffTypes.find((type) => type.value === field.value)
                          ?.label
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {staffTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* First & Last Name Row */}
        <div className="grid grid-cols-2 gap-2 ">
          <FormField
            control={staffRegistrationForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="firstName">First Name</Label>
                <FormControl>
                  <Input id="firstName" {...field} className="max-w-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={staffRegistrationForm.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="lastName">Last Name</Label>
                <FormControl>
                  <Input id="lastName" {...field} className="max-w-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 ">
          {/* Email */}
          <FormField
            control={staffRegistrationForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="email">Email</Label>
                <FormControl>
                  <Input id="email" {...field} className="w-full max-w-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={staffRegistrationForm.control}
            name="nic"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="nic">NIC</Label>
                <FormControl>
                  <Input id="nic" {...field} className="max-w-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Password & Confirm Password Row */}
        <div className="grid grid-cols-2 gap-2 pb-4 ">
          <FormField
            control={staffRegistrationForm.control}
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
          <FormField
            control={staffRegistrationForm.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <FormControl>
                  <Input
                    id="confirmPassword"
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

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-[200px] h-9  btn-primary"
          disabled={loading}
        >
          Register
        </Button>
      </form>
    </Form>
  );
};

export default StaffRegistration;
