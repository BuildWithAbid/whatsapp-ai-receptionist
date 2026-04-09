"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/fetcher";
import { updateLeadSchema } from "@/lib/validation/crm";

type LeadFormInput = {
  status: "NEW" | "CONTACTED" | "CLOSED";
  notes?: string;
};

export function LeadStatusForm({
  leadId,
  notes,
  status,
}: {
  leadId: string;
  status: "NEW" | "CONTACTED" | "CLOSED";
  notes: string | null;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<LeadFormInput>({
    resolver: zodResolver(updateLeadSchema),
    defaultValues: {
      status,
      notes: notes ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSaving(true);
    try {
      await apiFetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        body: JSON.stringify(values),
      });
      toast.success("Lead updated.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update lead.");
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <Select {...form.register("status")}>
        <option value="NEW">New</option>
        <option value="CONTACTED">Contacted</option>
        <option value="CLOSED">Closed</option>
      </Select>
      <Textarea rows={3} placeholder="Add follow-up notes" {...form.register("notes")} />
      <Button disabled={isSaving} size="sm" type="submit">
        {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
        Save
      </Button>
    </form>
  );
}
