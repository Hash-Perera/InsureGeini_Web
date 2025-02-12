import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import OAuthSignIn from "./OAuthSignIn";

const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email field cannot be empty")
    .email("Please enter a valid email address"),
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
          <form
            //  onSubmit={form.handleSubmit(handleEmailSignIn)}
            className="w-full space-y-2"
          >
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
              //type="submit"
              type="button"
              //disabled={loading}
              onClick={() => {
                navigate("/admin/admin-dashboard");
              }}
            >
              <span className="text-[16px] font-medium">
                Continue with email
              </span>
            </button>
          </form>
        </Form>

        <div className="relative mt-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="px-2 text-gray-500 uppercase bg-white">
              Or continue with
            </span>
          </div>
        </div>
      </div>
      <OAuthSignIn setError={setError} />
      <button
        onClick={() => handlePasskeySignIn()}
        className="text-sm font-medium underline underline-offset-2"
      >
        Use passkey instead
      </button>
    </div>
  );
};

export default Login;
