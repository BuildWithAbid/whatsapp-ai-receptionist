import OpenAI from "openai";
import { z } from "zod";

import { env } from "@/lib/env";
import { logger } from "@/lib/logging/logger";
import type { AIConversationDecision } from "@/types/api";

const decisionSchema = z.object({
  replyText: z.string().min(1).max(600),
  needsHumanFollowUp: z.boolean(),
  leadData: z
    .object({
      name: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      serviceNeeded: z.string().nullable().optional(),
    })
    .nullable(),
  bookingData: z
    .object({
      name: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      serviceRequested: z.string().nullable().optional(),
      preferredDateText: z.string().nullable().optional(),
      preferredTimeText: z.string().nullable().optional(),
    })
    .nullable(),
  confidence: z.enum(["high", "medium", "low"]),
  reason: z.string().min(1).max(300),
});

const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

function buildSystemPrompt(input: {
  businessName: string;
  businessCategory: string;
  location?: string | null;
  openingHours?: string | null;
  servicesOffered?: string | null;
  pricingNotes?: string | null;
  toneOfVoice?: string | null;
  escalationMessage: string;
  faqs: Array<{ question: string; answer: string }>;
}) {
  const faqBlock =
    input.faqs.length > 0
      ? input.faqs.map((faq, index) => `${index + 1}. Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n")
      : "No FAQs configured.";

  return [
    "You are a WhatsApp AI receptionist for a small business.",
    `Business name: ${input.businessName}`,
    `Business category: ${input.businessCategory}`,
    `Location: ${input.location || "Not provided"}`,
    `Opening hours: ${input.openingHours || "Not provided"}`,
    `Services offered: ${input.servicesOffered || "Not provided"}`,
    `Pricing notes: ${input.pricingNotes || "Not provided"}`,
    `Tone of voice: ${input.toneOfVoice || "Professional, warm, and concise"}`,
    `Escalation message: ${input.escalationMessage}`,
    "Rules:",
    "- Keep responses short, clear, and WhatsApp-friendly.",
    "- Never invent unavailable services, prices, addresses, or opening hours.",
    "- If important business information is missing, ask a concise follow-up question or escalate.",
    "- If the customer wants to book, capture the service and best available date/time details.",
    "- If the customer shares their name or service need, capture them as lead data.",
    "- If uncertain, set needsHumanFollowUp to true and use the escalation message or a short clarification.",
    "- Return JSON only, no markdown.",
    "Approved FAQ answers:",
    faqBlock,
  ].join("\n");
}

function stringifyConversation(messages: Array<{ role: string; content: string }>) {
  return messages.map((message) => `${message.role}: ${message.content}`).join("\n");
}

function extractJsonObject(value: string) {
  const start = value.indexOf("{");
  const end = value.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain JSON.");
  }

  return value.slice(start, end + 1);
}

function keywordScore(text: string, candidate: string) {
  const tokens = text
    .toLowerCase()
    .split(/\W+/)
    .filter(Boolean);
  const haystack = candidate.toLowerCase();

  return tokens.reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
}

function buildFallbackDecision(input: {
  customerMessage: string;
  customerName?: string | null;
  customerPhone: string;
  servicesOffered?: string | null;
  openingHours?: string | null;
  pricingNotes?: string | null;
  escalationMessage: string;
  faqs: Array<{ question: string; answer: string }>;
}): AIConversationDecision {
  const normalizedMessage = input.customerMessage.toLowerCase();
  const faqMatches = input.faqs
    .map((faq) => ({
      faq,
      score: keywordScore(normalizedMessage, `${faq.question} ${faq.answer}`),
    }))
    .sort((a, b) => b.score - a.score);

  if (faqMatches[0]?.score > 1) {
    return {
      replyText: faqMatches[0].faq.answer,
      needsHumanFollowUp: false,
      leadData: {
        name: input.customerName ?? null,
        phone: input.customerPhone,
        serviceNeeded: null,
      },
      bookingData: null,
      confidence: "medium",
      reason: "Matched a configured FAQ.",
    };
  }

  if (normalizedMessage.includes("hour") && input.openingHours) {
    return {
      replyText: `Our current opening hours are:\n${input.openingHours}`,
      needsHumanFollowUp: false,
      leadData: null,
      bookingData: null,
      confidence: "medium",
      reason: "Answered from saved opening hours.",
    };
  }

  if ((normalizedMessage.includes("price") || normalizedMessage.includes("cost")) && input.pricingNotes) {
    return {
      replyText: input.pricingNotes,
      needsHumanFollowUp: false,
      leadData: null,
      bookingData: null,
      confidence: "medium",
      reason: "Answered from saved pricing notes.",
    };
  }

  const bookingIntent = ["book", "booking", "appointment", "schedule"].some((keyword) =>
    normalizedMessage.includes(keyword),
  );
  if (bookingIntent) {
    return {
      replyText:
        "Happy to help with that. What service do you need, and what day or time works best for you?",
      needsHumanFollowUp: false,
      leadData: {
        name: input.customerName ?? null,
        phone: input.customerPhone,
        serviceNeeded: null,
      },
      bookingData: {
        name: input.customerName ?? null,
        phone: input.customerPhone,
        serviceRequested: null,
        preferredDateText: null,
        preferredTimeText: null,
      },
      confidence: "medium",
      reason: "Detected booking intent using fallback keyword rules.",
    };
  }

  return {
    replyText: input.escalationMessage,
    needsHumanFollowUp: true,
    leadData: {
      name: input.customerName ?? null,
      phone: input.customerPhone,
      serviceNeeded: null,
    },
    bookingData: null,
    confidence: "low",
    reason: "Fallback path could not answer with confidence.",
  };
}

export async function generateReceptionistDecision(input: {
  businessName: string;
  businessCategory: string;
  customerName?: string | null;
  customerPhone: string;
  customerMessage: string;
  openingHours?: string | null;
  location?: string | null;
  servicesOffered?: string | null;
  pricingNotes?: string | null;
  toneOfVoice?: string | null;
  escalationMessage: string;
  faqs: Array<{ question: string; answer: string }>;
  recentMessages: Array<{ role: "customer" | "assistant"; content: string }>;
}): Promise<AIConversationDecision> {
  if (!openai) {
    return buildFallbackDecision(input);
  }

  const systemPrompt = buildSystemPrompt(input);
  const conversationTranscript = stringifyConversation([
    ...input.recentMessages,
    {
      role: "customer",
      content: input.customerMessage,
    },
  ]);

  try {
    const response = await openai.responses.create({
      model: env.OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: [
                "Return a JSON object with this exact shape:",
                JSON.stringify({
                  replyText: "string",
                  needsHumanFollowUp: false,
                  leadData: {
                    name: "string | null",
                    phone: "string | null",
                    serviceNeeded: "string | null",
                  },
                  bookingData: {
                    name: "string | null",
                    phone: "string | null",
                    serviceRequested: "string | null",
                    preferredDateText: "string | null",
                    preferredTimeText: "string | null",
                  },
                  confidence: "high | medium | low",
                  reason: "string",
                }),
                `Customer name: ${input.customerName || "Unknown"}`,
                `Customer phone: ${input.customerPhone}`,
                "Conversation:",
                conversationTranscript,
              ].join("\n\n"),
            },
          ],
        },
      ],
      max_output_tokens: 500,
    });

    const json = extractJsonObject(response.output_text);
    const parsed = decisionSchema.parse(JSON.parse(json));
    return parsed;
  } catch (error) {
    logger.error({ error }, "AI decision generation failed. Falling back to deterministic response.");
    return buildFallbackDecision(input);
  }
}
