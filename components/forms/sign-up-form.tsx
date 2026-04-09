"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/fetcher";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth";

export function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      businessName: "",
      businessCategory: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);

    try {
      await apiFetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("The workspace was created, but automatic sign-in failed.");
        router.push("/sign-in");
        return;
      }

      toast.success("Workspace created.");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign-up failed.");
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Card className="w-full max-w-xl bg-white/92">
      <CardHeader>
        <CardTitle className="text-2xl">Create your workspace</CardTitle>
        <CardDescription>Set up a business owner account and start configuring the bot.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="md:col-span-1">
            <FormField htmlFor="name" label="Your name" error={form.formState.errors.name?.message}>
              <Input id="name" autoComplete="name" {...form.register("name")} />
            </FormField>
          </div>
          <div className="md:col-span-1">
            <FormField htmlFor="email" label="Email" error={form.formState.errors.email?.message}>
              <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
            </FormField>
          </div>
          <div className="md:col-span-1">
            <FormField htmlFor="password" label="Password" error={form.formState.errors.password?.message}>
              <Input id="password" type="password" autoComplete="new-password" {...form.register("password")} />
            </FormField>
          </div>
          <div className="md:col-span-1">
            <FormField htmlFor="timezone" label="Timezone" error={form.formState.errors.timezone?.message}>
              <Input id="timezone" {...form.register("timezone")} />
            </FormField>
          </div>
          <div className="md:col-span-1">
            <FormField
              htmlFor="businessName"
              label="Business name"
              error={form.formState.errors.businessName?.message}
            >
              <Input id="businessName" {...form.register("businessName")} />
            </FormField>
          </div>
          <div className="md:col-span-1">
            <FormField
              htmlFor="businessCategory"
              label="Business category"
              error={form.formState.errors.businessCategory?.message}
            >
              <Input id="businessCategory" placeholder="Dental clinic, salon, repair shop..." {...form.register("businessCategory")} />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <Button className="w-full" disabled={isSubmitting} type="submit">
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              Create workspace
            </Button>
          </div>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
