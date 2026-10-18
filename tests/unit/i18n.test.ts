import { describe, it, expect } from "vitest";
import { t, getDictionary } from "@/lib/i18n";

describe("i18n Localization Engine", () => {
  it("resolves basic strings from JSON dictionary", () => {
    expect(t("site.name")).toBe("FedJobs Radar");
    expect(t("nav.home")).toBe("Home");
    expect(t("home.hero.title")).toBe("Federal jobs, explained in plain English.");
  });

  it("interpolates dynamic parameters inside templates", () => {
    const text = t("about.missionBody", { siteName: "FedJobs Radar" });
    expect(text).toContain("FedJobs Radar was created to bridge this information gap.");
  });

  it("returns fallback key if path does not exist", () => {
    expect(t("non.existent.path")).toBe("non.existent.path");
  });

  it("provides full typed dictionary object", () => {
    const dict = getDictionary();
    expect(dict.site.name).toBe("FedJobs Radar");
    expect(dict.home.howItWorks.step1Title).toBe("1. Spot New Postings Fast");
  });
});
