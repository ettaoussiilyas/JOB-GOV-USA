import { describe, it, expect } from "vitest";
import { maskEmail, sanitizeLogData } from "@/lib/logger";

describe("Structured Logger & Email Masking", () => {
  describe("maskEmail helper", () => {
    it("masks standard email addresses properly", () => {
      expect(maskEmail("alex.smith@example.com")).toBe("a***h@example.com");
      expect(maskEmail("developer@agency.gov")).toBe("d***r@agency.gov");
    });

    it("handles short usernames correctly", () => {
      expect(maskEmail("me@test.com")).toBe("*@test.com");
      expect(maskEmail("a@b.org")).toBe("*@b.org");
    });

    it("returns non-email strings unchanged", () => {
      expect(maskEmail("not-an-email")).toBe("not-an-email");
      expect(maskEmail("")).toBe("");
    });
  });

  describe("sanitizeLogData helper", () => {
    it("masks email addresses found inside plain text strings", () => {
      const text = "Subscriber test.user@example.com requested an alert update.";
      const sanitized = sanitizeLogData(text);
      expect(sanitized).toBe("Subscriber t***r@example.com requested an alert update.");
      expect(sanitized).not.toContain("test.user@example.com");
    });

    it("recursively masks email addresses in nested objects and arrays", () => {
      const payload = {
        action: "subscribe",
        recipient: {
          email: "target.applicant@domain.gov",
          tags: ["student", "inquiry@domain.gov"],
        },
        metadata: {
          submittedBy: "admin@corp.internal",
          count: 42,
        },
      };

      const sanitized = sanitizeLogData(payload);
      expect(sanitized.recipient.email).toBe("t***t@domain.gov");
      expect(sanitized.recipient.tags[1]).toBe("i***y@domain.gov");
      expect(sanitized.metadata.submittedBy).toBe("a***n@corp.internal");
      expect(sanitized.metadata.count).toBe(42);
    });
  });
});
