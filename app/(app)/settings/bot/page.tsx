import { BotSettingsForm } from "@/components/forms/bot-settings-form";
import { PageHeader } from "@/components/shared/page-header";
import { requireCurrentBusiness } from "@/lib/auth/session";

export default async function BotSettingsPage() {
  const { business } = await requireCurrentBusiness();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bot settings"
        description="Control tone of voice, escalation behavior, and the business context the receptionist uses for each reply."
      />
      <BotSettingsForm
        initialValues={{
          openingHours: business.botSetting?.openingHours ?? "",
          servicesOffered: business.botSetting?.servicesOffered ?? "",
          pricingNotes: business.botSetting?.pricingNotes ?? "",
          toneOfVoice: business.botSetting?.toneOfVoice ?? "",
          escalationMessage:
            business.botSetting?.escalationMessage ??
            "Thanks for your message. A team member will get back to you shortly.",
          leadCaptureEnabled: business.botSetting?.leadCaptureEnabled ?? true,
          bookingCaptureEnabled: business.botSetting?.bookingCaptureEnabled ?? true,
          autoReplyEnabled: business.botSetting?.autoReplyEnabled ?? true,
        }}
      />
    </div>
  );
}
