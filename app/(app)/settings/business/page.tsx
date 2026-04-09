import { BusinessProfileForm } from "@/components/forms/business-profile-form";
import { PageHeader } from "@/components/shared/page-header";
import { requireCurrentBusiness } from "@/lib/auth/session";

export default async function BusinessSettingsPage() {
  const { business } = await requireCurrentBusiness();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business settings"
        description="Keep the core workspace profile accurate so dashboard reporting and AI responses stay grounded in real business data."
      />
      <BusinessProfileForm
        initialValues={{
          name: business.name,
          category: business.category,
          timezone: business.timezone,
          phoneNumber: business.phoneNumber ?? "",
          location: business.location ?? "",
        }}
      />
    </div>
  );
}
