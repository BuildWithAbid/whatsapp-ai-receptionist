import { describe, expect, it } from "vitest";

import { whatsappWebhookSchema } from "@/lib/validation/webhook";

describe("whatsappWebhookSchema", () => {
  it("accepts a valid message webhook payload", () => {
    const parsed = whatsappWebhookSchema.safeParse({
      object: "whatsapp_business_account",
      entry: [
        {
          changes: [
            {
              value: {
                metadata: {
                  phone_number_id: "12345",
                },
                contacts: [
                  {
                    wa_id: "15550111",
                    profile: {
                      name: "Emily",
                    },
                  },
                ],
                messages: [
                  {
                    id: "wamid.123",
                    from: "15550111",
                    type: "text",
                    text: {
                      body: "Do you do whitening?",
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects payloads without entry data", () => {
    const parsed = whatsappWebhookSchema.safeParse({
      object: "whatsapp_business_account",
    });

    expect(parsed.success).toBe(false);
  });
});
