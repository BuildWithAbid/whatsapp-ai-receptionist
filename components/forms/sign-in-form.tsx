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
import { signInSchema, type SignInInput } from "@/lib/validation/auth";

export function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setIsSubmitting(false);

    if (result?.error) {
      toast.error("Invalid email or password.");
      return;
    }

    toast.success("Signed in successfully.");
    router.push("/dashboard");
    router.refresh();
  });

  return (
    <Card className="w-full max-w-md bg-white/92">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>Access your business workspace and dashboard.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormField htmlFor="email" label="Email" error={form.formState.errors.email?.message}>
            <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          </FormField>
          <FormField htmlFor="password" label="Password" error={form.formState.errors.password?.message}>
            <Input id="password" type="password" autoComplete="current-password" {...form.register("password")} />
          </FormField>
          <Button className="w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Continue
          </Button>
        </form>
        <p className="mt-6 text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/sign-up" className="font-semibold text-primary hover:underline">
            Create a workspace
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
