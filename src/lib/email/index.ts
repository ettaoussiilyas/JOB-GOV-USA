import type { EmailSender } from "./types";
import { BrevoEmailSender } from "./brevo";
import { MockEmailSender } from "./mock";

let senderInstance: EmailSender | null = null;

export function getEmailSender(): EmailSender {
  if (senderInstance) {
    return senderInstance;
  }

  const provider = (process.env.EMAIL_PROVIDER || "brevo").toLowerCase();

  switch (provider) {
    case "mock":
      senderInstance = new MockEmailSender();
      break;
    case "brevo":
    default:
      senderInstance = new BrevoEmailSender();
      break;
  }

  return senderInstance;
}

export function setEmailSender(sender: EmailSender | null) {
  senderInstance = sender;
}

export * from "./types";
export * from "./brevo";
export * from "./mock";
