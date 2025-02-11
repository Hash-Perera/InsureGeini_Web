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

// Define Zod Schema
const clientRegistrationSchema = z.object({
  firstName: z.string().min(1, "First name cannot be empty"),
  lastName: z.string().min(1, "Last name cannot be empty"),
  nic: z.string().min(1, "NIC cannot be empty"),
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
});

const ClientRegistration = () => {
  const [loading, setLoading] = useState(false);

  const clientRegistrationForm = useForm({
    resolver: zodResolver(clientRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nic: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Form {...clientRegistrationForm}>
      <form
        className="w-full space-y-2"
        onSubmit={clientRegistrationForm.handleSubmit(onSubmit)}
      >
        {/* First & Last Name Row */}
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={clientRegistrationForm.control}
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
            control={clientRegistrationForm.control}
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

        <div className="grid grid-cols-2 gap-2">
          {/* Email */}
          <FormField
            control={clientRegistrationForm.control}
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
            control={clientRegistrationForm.control}
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
        <div className="grid grid-cols-2 gap-2">
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
          <FormField
            control={clientRegistrationForm.control}
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
          className="w-[200px] h-9 btn-primary"
          disabled={loading}
        >
          Register
        </Button>
      </form>
    </Form>
  );
};

export default ClientRegistration;
