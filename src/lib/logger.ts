export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  meta?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

/**
 * Masks an email address for privacy/GDPR/CAN-SPAM compliance.
 * Example: 'alex.smith@example.com' -> 'a***h@example.com'
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) {
    return email;
  }

  const [local, domain] = email.split("@");
  if (!local || !domain) {
    return email;
  }

  if (local.length <= 2) {
    return `*@${domain}`;
  }

  const firstChar = local[0];
  const lastChar = local[local.length - 1];
  return `${firstChar}***${lastChar}@${domain}`;
}

/**
 * Recursively sanitizes data to mask any strings matching email patterns.
 */
export function sanitizeLogData<T>(data: T): T {
  if (typeof data === "string") {
    return data.replace(EMAIL_REGEX, (matched) => maskEmail(matched)) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeLogData(item)) as unknown as T;
  }

  if (data !== null && typeof data === "object") {
    const copy: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(data)) {
      copy[key] = sanitizeLogData(val);
    }
    return copy as T;
  }

  return data;
}

function writeLog(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>,
  error?: unknown,
  requestId?: string,
): void {
  const payload: LogPayload = {
    level,
    message: sanitizeLogData(message),
    timestamp: new Date().toISOString(),
    ...(requestId ? { requestId } : {}),
  };

  if (meta && Object.keys(meta).length > 0) {
    payload.meta = sanitizeLogData(meta);
  }

  if (error instanceof Error) {
    payload.error = {
      name: error.name,
      message: sanitizeLogData(error.message),
      ...(process.env.NODE_ENV !== "production" ? { stack: error.stack } : {}),
    };
  } else if (error) {
    payload.error = {
      name: "UnknownError",
      message: sanitizeLogData(String(error)),
    };
  }

  const json = JSON.stringify(payload);
  if (level === "error") {
    console.error(json);
  } else if (level === "warn") {
    console.warn(json);
  } else {
    console.log(json);
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>, requestId?: string) =>
    writeLog("debug", message, meta, undefined, requestId),
  info: (message: string, meta?: Record<string, unknown>, requestId?: string) =>
    writeLog("info", message, meta, undefined, requestId),
  warn: (message: string, meta?: Record<string, unknown>, error?: unknown, requestId?: string) =>
    writeLog("warn", message, meta, error, requestId),
  error: (message: string, meta?: Record<string, unknown>, error?: unknown, requestId?: string) =>
    writeLog("error", message, meta, error, requestId),
  withRequestId: (requestId: string) => ({
    debug: (message: string, meta?: Record<string, unknown>) =>
      writeLog("debug", message, meta, undefined, requestId),
    info: (message: string, meta?: Record<string, unknown>) =>
      writeLog("info", message, meta, undefined, requestId),
    warn: (message: string, meta?: Record<string, unknown>, error?: unknown) =>
      writeLog("warn", message, meta, error, requestId),
    error: (message: string, meta?: Record<string, unknown>, error?: unknown) =>
      writeLog("error", message, meta, error, requestId),
  }),
};
