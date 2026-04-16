"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FadeIn } from "@/components/ui/fade-in";
import { Loader2, ArrowRight } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

const signUpSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

const AuthForm = ({ type }: { type: "sign-in" | "sign-up" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<any>({
    resolver: zodResolver(type === "sign-in" ? signInSchema : signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      dateOfBirth: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = type === "sign-up" ? "/api/auth/signup" : "/api/auth/signin";
      const body = type === "sign-up"
        ? data
        : { email: data.email, password: data.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (result.error) { setError(result.error); return; }
      if (result.redirectTo) { window.location.href = result.redirectTo; return; }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <FadeIn delay={0}>
          <span className="eyebrow">
            {type === "sign-in" ? "Welcome back" : "Get started"}
          </span>
        </FadeIn>
        <FadeIn delay={80}>
          <h1 className="ds" style={{ color: "var(--ds-foreground)" }}>
            {type === "sign-in" ? (
              <>Sign in to your <em>account.</em></>
            ) : (
              <>Create your <em>account.</em></>
            )}
          </h1>
        </FadeIn>
        <FadeIn delay={140}>
          <p className="feature-text" style={{ color: "var(--ds-muted-foreground)" }}>
            {type === "sign-in"
              ? "Enter your credentials to access your dashboard."
              : "Fill in your details to open your account instantly."}
          </p>
        </FadeIn>
      </div>

      {/* Error */}
      {error && (
        <FadeIn direction="none">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        </FadeIn>
      )}

      {/* Form */}
      <FadeIn delay={200}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {type === "sign-up" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-12 font-medium"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          First name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jane"
                            className="input-class h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-12 text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-12 font-medium"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          Last name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            className="input-class h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-12 text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="text-12 font-medium"
                        style={{ color: "var(--ds-foreground)" }}
                      >
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St"
                          className="input-class h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-12 text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-12 font-medium"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          Date of birth
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="YYYY-MM-DD"
                            className="input-class h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-12 text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          className="text-12 font-medium"
                          style={{ color: "var(--ds-foreground)" }}
                        >
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 555 000 0000"
                            className="input-class h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-12 text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-12 font-medium"
                    style={{ color: "var(--ds-foreground)" }}
                  >
                    Email address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="jane@example.com"
                      type="email"
                      className="input-class h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className="text-12 font-medium"
                    style={{ color: "var(--ds-foreground)" }}
                  >
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Min. 8 characters"
                      type="password"
                      className="input-class h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-full px-8 text-14 font-semibold"
              style={{
                background: "var(--ds-primary)",
                color: "var(--ds-primary-fg)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  &nbsp;{type === "sign-in" ? "Signing in…" : "Creating account…"}
                </>
              ) : (
                <>
                  {type === "sign-in" ? "Sign in" : "Create account"}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </FadeIn>

      {/* Footer link */}
      <FadeIn delay={280}>
        <p className="text-center feature-text" style={{ color: "var(--ds-muted-foreground)" }}>
          {type === "sign-in" ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="font-medium underline underline-offset-4"
            style={{ color: "var(--ds-foreground)" }}
          >
            {type === "sign-in" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </FadeIn>
    </div>
  );
};

export default AuthForm;
