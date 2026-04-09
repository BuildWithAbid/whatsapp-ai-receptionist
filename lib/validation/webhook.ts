import { z } from "zod";

export const whatsappWebhookSchema = z.object({
  object: z.string(),
  entry: z.array(
    z.object({
      changes: z.array(
        z.object({
          value: z.object({
            metadata: z
              .object({
                phone_number_id: z.string().optional(),
              })
              .optional(),
            contacts: z
              .array(
                z.object({
                  wa_id: z.string(),
                  profile: z.object({
                    name: z.string().optional(),
                  }),
                }),
              )
              .optional(),
            messages: z
              .array(
                z.object({
                  id: z.string(),
                  from: z.string(),
                  type: z.string().default("text"),
                  text: z
                    .object({
                      body: z.string().optional(),
                    })
                    .optional(),
                }),
              )
              .optional(),
            statuses: z
              .array(
                z.object({
                  id: z.string(),
                  status: z.string(),
                }),
              )
              .optional(),
          }),
        }),
      ),
    }),
  ),
});
