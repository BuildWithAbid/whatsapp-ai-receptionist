"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/fetcher";
import { businessProfileSchema, type BusinessProfileInput } from "@/lib/validation/business";

export function BusinessProfileForm({ initialValues }: { initialValues: BusinessProfileInput }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<BusinessProfileInput>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: initialValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      await apiFetch("/api/businesses/current", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      toast.success("Business profile saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save business profile.");
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business profile</CardTitle>
        <CardDescription>Basic workspace information used across the dashboard and AI prompt.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <FormField htmlFor="name" label="Business name" error={form.formState.errors.name?.message}>
            <Input id="name" {...form.register("name")} />
          </FormField>
          <FormField htmlFor="category" label="Category" error={form.formState.errors.category?.message}>
            <Input id="category" {...form.register("category")} />
          </FormField>
          <FormField htmlFor="timezone" label="Timezone" error={form.formState.errors.timezone?.message}>
            <Input id="timezone" {...form.register("timezone")} />
          </FormField>
          <FormField htmlFor="phoneNumber" label="Business phone" error={form.formState.errors.phoneNumber?.message}>
            <Input id="phoneNumber" {...form.register("phoneNumber")} />
          </FormField>
          <div className="md:col-span-2">
            <FormField htmlFor="location" label="Location" error={form.formState.errors.location?.message}>
              <Input id="location" {...form.register("location")} />
            </FormField>
          </div>
          <div className="md:col-span-2">
            <Button disabled={isSaving} type="submit">
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              Save profile
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
