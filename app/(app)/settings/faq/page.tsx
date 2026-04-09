import { FaqManager } from "@/components/forms/faq-manager";
import { PageHeader } from "@/components/shared/page-header";
import { requireCurrentBusiness } from "@/lib/auth/session";

export default async function FaqSettingsPage() {
  const { business } = await requireCurrentBusiness();

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ knowledge base"
        description="Add the short, accurate answers the bot is allowed to reuse when customers ask common questions."
      />
      <FaqManager
        initialFaqs={business.faqs.map((faq) => ({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          sortOrder: faq.sortOrder,
          isActive: faq.isActive,
        }))}
      />
    </div>
  );
}
