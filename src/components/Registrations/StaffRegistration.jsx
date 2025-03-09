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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const staffTypes = [
  { value: "67c7eb72b82959d184a0cd08", label: "Staff" },
  //{ value: "admin", label: "Admin" },
];

const staffRegistrationSchema = z.object({
  name: z.string().min(1, "Name field cannot be empty"),
  email: z
    .string()
    .min(1, "Email field cannot be empty")
    .email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  mobileNumber: z.string().min(10, "Please enter a valid mobile number"),
  address: z.string().min(1, "Address field cannot be empty"),
  role: z.string().min(["staff", "value"], "Please select a staff type"),
});

const StaffRegistration = ({ setIsOpen }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const staffRegistrationForm = useForm({
    resolver: zodResolver(staffRegistrationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: staffTypes[0].value,
      mobileNumber: "",
      address: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await addStaff(data);
        toast.success("Staff added successfully");
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        staffRegistrationForm.reset();
        setLoading(false);
        setIsOpen(false);
        return response;
      } catch (error) {
        toast.error("Error adding staff");
      }
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
                <Select
                  {...field}
                  id="staffType"
                  className="w-full max-w-md"
                  defaultValue="67c7eb72b82959d184a0cd08"
                >
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
        {/*Name Row and Email */}
        <div className="grid grid-cols-2 gap-2 ">
          <FormField
            control={staffRegistrationForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="name">Name</Label>
                <FormControl>
                  <Input id="name" {...field} className="max-w-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>

        <div className="grid grid-cols-2 gap-2 ">
          {/* Address and phone number */}
          <FormField
            control={staffRegistrationForm.control}
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
            control={staffRegistrationForm.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <FormControl>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    {...field}
                    className="w-full max-w-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Password & Confirm Password Row */}
        <div className="grid grid-cols-4 gap-2 pb-4 ">
          <div className="col-span-3 ">
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
          </div>
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
