import en from "@/locales/en.json";

export type Dictionary = typeof en;

const dictionaries: Record<string, Dictionary> = {
  en,
};

let currentLocale = "en";

export function setLocale(locale: string) {
  if (dictionaries[locale]) {
    currentLocale = locale;
  }
}

export function getLocale(): string {
  return currentLocale;
}

export function getDictionary(locale = currentLocale): Dictionary {
  return dictionaries[locale] || en;
}

/**
 * Access nested dictionary value by dot path with interpolation.
 * Example: t("site.name") or t("about.missionBody", { siteName: "FedJobs Radar" })
 */
export function t(
  path: string,
  params?: Record<string, string | number>,
  locale = currentLocale,
): string {
  const dict = getDictionary(locale);
  const keys = path.split(".");

  let current: unknown = dict;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return path; // Fallback to key if not found
    }
  }

  if (typeof current !== "string") {
    return path;
  }

  if (!params) {
    return current;
  }

  return current.replace(/\{(\w+)\}/g, (_, match) => {
    return params[match] !== undefined ? String(params[match]) : `{${match}}`;
  });
}
