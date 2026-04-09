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
import { whatsappConfigSchema, type WhatsAppConfigInput } from "@/lib/validation/business";

export function WhatsAppConfigForm({ initialValues }: { initialValues: WhatsAppConfigInput }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<WhatsAppConfigInput>({
    resolver: zodResolver(whatsappConfigSchema),
    defaultValues: initialValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      await apiFetch("/api/settings/whatsapp", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      toast.success("WhatsApp configuration saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save WhatsApp configuration.");
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp configuration</CardTitle>
        <CardDescription>Connect the Meta phone number identifiers used to resolve webhook traffic.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormField
            htmlFor="whatsappDisplayPhone"
            label="Display phone number"
            description="Shown in the dashboard for quick reference."
            error={form.formState.errors.whatsappDisplayPhone?.message}
          >
            <Input id="whatsappDisplayPhone" placeholder="+1 555 0100" {...form.register("whatsappDisplayPhone")} />
          </FormField>
          <FormField
            htmlFor="whatsappPhoneNumberId"
            label="Phone number ID"
            description="Required to map inbound webhook events to the correct workspace."
            error={form.formState.errors.whatsappPhoneNumberId?.message}
          >
            <Input id="whatsappPhoneNumberId" placeholder="123456789012345" {...form.register("whatsappPhoneNumberId")} />
          </FormField>
          <FormField
            htmlFor="whatsappBusinessAccountId"
            label="Business account ID"
            description="Useful for Meta-side diagnostics and future account management."
            error={form.formState.errors.whatsappBusinessAccountId?.message}
          >
            <Input
              id="whatsappBusinessAccountId"
              placeholder="987654321098765"
              {...form.register("whatsappBusinessAccountId")}
            />
          </FormField>
          <Button disabled={isSaving} type="submit">
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save WhatsApp settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
