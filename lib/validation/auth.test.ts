import { describe, expect, it } from "vitest";

import { signUpSchema } from "@/lib/validation/auth";

describe("signUpSchema", () => {
  it("accepts a valid workspace sign-up payload", () => {
    const parsed = signUpSchema.safeParse({
      name: "Owner Name",
      email: "owner@example.com",
      password: "Passw0rd!",
      businessName: "Bright Smiles Dental",
      businessCategory: "Dental clinic",
      timezone: "America/New_York",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects too-short passwords", () => {
    const parsed = signUpSchema.safeParse({
      name: "Owner Name",
      email: "owner@example.com",
      password: "short",
      businessName: "Bright Smiles Dental",
      businessCategory: "Dental clinic",
      timezone: "America/New_York",
    });

    expect(parsed.success).toBe(false);
  });
});
