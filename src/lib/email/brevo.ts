import nodemailer, { type Transporter } from "nodemailer";
import type { EmailSender, SendEmailOptions, SendEmailResult } from "./types";
import { logger } from "@/lib/logger";

export interface BrevoSmtpConfig {
  host?: string;
  port?: number;
  user?: string;
  key?: string;
  from?: string;
}

export class BrevoEmailSender implements EmailSender {
  readonly providerName = "brevo";
  private transporter: Transporter | null = null;
  private readonly config: Required<BrevoSmtpConfig>;

  constructor(config?: BrevoSmtpConfig) {
    this.config = {
      host: config?.host || process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
      port: Number(config?.port || process.env.BREVO_SMTP_PORT || 587),
      user: config?.user || process.env.BREVO_SMTP_USER || "",
      key: config?.key || process.env.BREVO_SMTP_KEY || "",
      from:
        config?.from || process.env.EMAIL_FROM || "FedJobs Radar <notifications@fedjobsradar.com>",
    };
  }

  getTransporter(): Transporter {
    if (!this.transporter) {
      if (!this.config.user || !this.config.key) {
        throw new Error(
          "[BrevoEmailSender] Missing BREVO_SMTP_USER or BREVO_SMTP_KEY in environment.",
        );
      }

      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.port === 465, // true for port 465, false for 587 (STARTTLS)
        auth: {
          user: this.config.user,
          pass: this.config.key,
        },
      });
    }
    return this.transporter;
  }

  setTransporter(transporter: Transporter) {
    this.transporter = transporter;
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    try {
      const transporter = this.getTransporter();
      const mailOptions = {
        from: options.from || this.config.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        replyTo: options.replyTo,
        headers: options.headers,
      };

      const info = await transporter.sendMail(mailOptions);
      logger.info("[BrevoEmailSender] Email sent successfully", {
        to: options.to,
        messageId: info.messageId,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error("[BrevoEmailSender] Failed to send email", { to: options.to }, err);
      return {
        success: false,
        error: errorMsg,
      };
    }
  }
}
