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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/fetcher";
import { botSettingSchema, type BotSettingInput } from "@/lib/validation/business";

export function BotSettingsForm({ initialValues }: { initialValues: BotSettingInput }) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<BotSettingInput>({
    resolver: zodResolver(botSettingSchema),
    defaultValues: initialValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      await apiFetch("/api/bot-settings/current", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      toast.success("Bot settings saved.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save bot settings.");
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot settings</CardTitle>
        <CardDescription>Business context that powers AI replies, lead capture, and escalation behavior.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField htmlFor="leadCaptureEnabled" label="Lead capture">
              <div className="flex h-11 items-center">
                <Switch
                  id="leadCaptureEnabled"
                  checked={form.watch("leadCaptureEnabled")}
                  onCheckedChange={(checked) => form.setValue("leadCaptureEnabled", checked, { shouldDirty: true })}
                />
              </div>
            </FormField>
            <FormField htmlFor="bookingCaptureEnabled" label="Booking capture">
              <div className="flex h-11 items-center">
                <Switch
                  id="bookingCaptureEnabled"
                  checked={form.watch("bookingCaptureEnabled")}
                  onCheckedChange={(checked) =>
                    form.setValue("bookingCaptureEnabled", checked, { shouldDirty: true })
                  }
                />
              </div>
            </FormField>
            <FormField htmlFor="autoReplyEnabled" label="Auto reply">
              <div className="flex h-11 items-center">
                <Switch
                  id="autoReplyEnabled"
                  checked={form.watch("autoReplyEnabled")}
                  onCheckedChange={(checked) => form.setValue("autoReplyEnabled", checked, { shouldDirty: true })}
                />
              </div>
            </FormField>
          </div>
          <FormField htmlFor="toneOfVoice" label="Tone of voice" error={form.formState.errors.toneOfVoice?.message}>
            <Input id="toneOfVoice" placeholder="Warm, direct, and concise" {...form.register("toneOfVoice")} />
          </FormField>
          <FormField htmlFor="openingHours" label="Opening hours" error={form.formState.errors.openingHours?.message}>
            <Textarea
              id="openingHours"
              placeholder={"Mon-Fri: 9am-6pm\nSat: 10am-2pm\nSun: Closed"}
              {...form.register("openingHours")}
            />
          </FormField>
          <FormField htmlFor="servicesOffered" label="Services offered" error={form.formState.errors.servicesOffered?.message}>
            <Textarea
              id="servicesOffered"
              placeholder={"Teeth cleaning\nWhitening\nEmergency dental appointments"}
              {...form.register("servicesOffered")}
            />
          </FormField>
          <FormField htmlFor="pricingNotes" label="Pricing notes" error={form.formState.errors.pricingNotes?.message}>
            <Textarea
              id="pricingNotes"
              placeholder="Consultation starts at $30. Exact pricing depends on treatment and consultation."
              {...form.register("pricingNotes")}
            />
          </FormField>
          <FormField
            htmlFor="escalationMessage"
            label="Escalation message"
            error={form.formState.errors.escalationMessage?.message}
          >
            <Textarea
              id="escalationMessage"
              placeholder="Thanks for your message. A team member will reply shortly with the right details."
              {...form.register("escalationMessage")}
            />
          </FormField>
          <Button disabled={isSaving} type="submit">
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save bot settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
