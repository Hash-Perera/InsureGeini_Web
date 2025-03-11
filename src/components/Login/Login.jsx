import React, { useState } from "react";
import { set, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth";
import { Loader } from "lucide-react";

const signInSchema = z.object({
  email: z.string().min(1, "Password field cannot be empty"),
  password: z.string().min(1, "Password field cannot be empty"),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = useMutation({
    mutationFn: async (data) => {
      try {
        const response = await login(data.email, data.password);
        const { token, role } = response;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setLoading(false);
        navigate("/admin/staff");
        return response;
      } catch (error) {
        setError("Invalid email or password");
        setLoading(false);
        console.error("Error logging in:", error.message);
        throw error;
      }
    },
  });

  return (
    <div className="flex  w-full flex-col items-center max-w-[380px]  h-screen  mx-auto  justify-center  px-4">
      {/* Brand logo */}
      <div className="flex items-center justify-center w-28 h-28">
        <img src="/images/logo.jpeg" alt="InsureGeni" />
      </div>
      <div className="flex flex-col w-full ">
        <h1 className=" font-semibold text-center text-[1.5rem]">
          Sign in to InsureGeni
        </h1>
        <p className=" text-[#475467] text-center font-normal text-[0.875rem]">
          Welcome back! Please enter your login details
        </p>
      </div>
      <div className="flex flex-col w-full gap-4 mt-[32px] ">
        <Form {...form}>
          <form className="w-full space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      {...field}
                      className={
                        form.formState.errors.email
                          ? "border-[#F44336] focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-0"
                          : " focus:border-[#A1A1AA] border-[#E4E4E7] focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-0"
                      }
                    />
                  </FormControl>
                  <FormMessage className=" text-[#F44336]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className={
                        form.formState.errors.password
                          ? "border-[#F44336] focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-0"
                          : " focus:border-[#A1A1AA] border-[#E4E4E7] focus-visible:ring-offset-0 focus-visible:outline-none focus-visible:ring-0"
                      }
                    />
                  </FormControl>
                  <FormMessage className=" text-[#F44336]" />
                </FormItem>
              )}
            />
            {error &&
              Object.keys(form?.formState?.errors || {}).length === 0 && (
                <FormMessage className=" text-[#F44336]">{error}</FormMessage>
              )}

            <button
              className="inline-flex gap-x-1.5 items-center justify-center w-full h-10 px-4 py-2 mt-2 text-xs font-medium transition rounded-md whitespace-nowrap ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#191B33] text-zinc-50"
              type="button"
              disabled={loading}
              onClick={form.handleSubmit(handleSubmit.mutate)}
            >
              {loading ? (
                <Loader size={16} className=" animate-spin" />
              ) : (
                <span className="text-[16px] font-medium">
                  Continue with email
                </span>
              )}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
