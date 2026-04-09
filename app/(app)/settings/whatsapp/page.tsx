import { WhatsAppConfigForm } from "@/components/forms/whatsapp-config-form";
import { PageHeader } from "@/components/shared/page-header";
import { requireCurrentBusiness } from "@/lib/auth/session";

export default async function WhatsAppSettingsPage() {
  const { business } = await requireCurrentBusiness();

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp setup"
        description="Connect the Meta phone number identifiers that map webhook events to this workspace."
      />
      <WhatsAppConfigForm
        initialValues={{
          whatsappPhoneNumberId: business.whatsappPhoneNumberId ?? "",
          whatsappBusinessAccountId: business.whatsappBusinessAccountId ?? "",
          whatsappDisplayPhone: business.whatsappDisplayPhone ?? "",
        }}
      />
    </div>
  );
}
