import { describe, it, expect, beforeEach, vi } from "vitest";
import { MockEmailSender } from "@/lib/email/mock";
import { BrevoEmailSender } from "@/lib/email/brevo";
import { getEmailSender, setEmailSender } from "@/lib/email";

describe("EmailSender Architecture", () => {
  beforeEach(() => {
    setEmailSender(null);
  });

  it("should send email via MockEmailSender and store message history", async () => {
    const mockSender = new MockEmailSender();
    const result = await mockSender.send({
      to: "applicant@example.com",
      subject: "New Job Alert: IT Specialist (GS-12)",
      html: "<p>New positions matching your search were found.</p>",
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
    expect(mockSender.sentEmails).toHaveLength(1);
    expect(mockSender.sentEmails[0]?.to).toBe("applicant@example.com");
  });

  it("should return configured provider via getEmailSender()", () => {
    process.env.EMAIL_PROVIDER = "mock";
    const sender = getEmailSender();
    expect(sender.providerName).toBe("mock");
  });

  it("should format Brevo mail options correctly and handle transport success", async () => {
    const brevo = new BrevoEmailSender({
      host: "smtp-relay.brevo.com",
      port: 587,
      user: "test@smtp-brevo.com",
      key: "mock-key",
      from: "FedJobs Radar <test@fedjobsradar.com>",
    });

    const mockSendMail = vi.fn().mockResolvedValue({ messageId: "brevo-msg-12345" });
    brevo.setTransporter({
      sendMail: mockSendMail,
    } as unknown as import("nodemailer").Transporter);

    const result = await brevo.send({
      to: "recipient@example.com",
      subject: "Daily Federal Radar Digest",
      html: "<h1>Daily Digest</h1>",
      headers: {
        "List-Unsubscribe": "<https://example.com/unsubscribe?token=xyz>",
      },
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe("brevo-msg-12345");
    expect(mockSendMail).toHaveBeenCalledWith({
      from: "FedJobs Radar <test@fedjobsradar.com>",
      to: "recipient@example.com",
      subject: "Daily Federal Radar Digest",
      html: "<h1>Daily Digest</h1>",
      text: undefined,
      replyTo: undefined,
      headers: {
        "List-Unsubscribe": "<https://example.com/unsubscribe?token=xyz>",
      },
    });
  });

  it("should catch and return error cleanly when SMTP fails", async () => {
    const brevo = new BrevoEmailSender({
      host: "smtp-relay.brevo.com",
      port: 587,
      user: "test@smtp-brevo.com",
      key: "mock-key",
      from: "FedJobs Radar <test@fedjobsradar.com>",
    });

    const mockSendMail = vi.fn().mockRejectedValue(new Error("SMTP connection timeout"));
    brevo.setTransporter({
      sendMail: mockSendMail,
    } as unknown as import("nodemailer").Transporter);

    const result = await brevo.send({
      to: "recipient@example.com",
      subject: "Daily Federal Radar Digest",
      html: "<h1>Daily Digest</h1>",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("SMTP connection timeout");
  });
});
