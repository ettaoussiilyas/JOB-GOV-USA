import type { EmailSender, SendEmailOptions, SendEmailResult } from "./types";

export class MockEmailSender implements EmailSender {
  readonly providerName = "mock";
  public sentEmails: SendEmailOptions[] = [];

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    this.sentEmails.push(options);
    return {
      success: true,
      messageId: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    };
  }

  clear() {
    this.sentEmails = [];
  }
}
