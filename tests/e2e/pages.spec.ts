import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "fs";
import path from "path";

const screenshotsDir = path.resolve(process.cwd(), "docs/screenshots");

test.beforeAll(() => {
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
});

test.describe("Public Core Pages & Accessibility", () => {
  test("Home page renders correctly, passes WCAG 2.2 AA axe checks, and captures screenshot", async ({
    page,
  }, testInfo) => {
    await page.goto("/");

    // Verify exactly one H1
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Federal jobs, explained in plain English.");

    // Verify key landmarks
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();

    // Verify honest status notice
    await expect(page.getByText("Under Construction")).toBeVisible();

    // Verify required disclaimer text in footer
    await expect(
      page.getByText("Not affiliated with or endorsed by USAJOBS or any US government agency."),
    ).toBeVisible();

    // Run axe accessibility scan
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    // Capture screenshot
    const projectName = testInfo.project.name;
    await page.screenshot({
      path: path.join(screenshotsDir, `home-${projectName}.png`),
      fullPage: true,
    });
  });

  test("About page renders correctly, passes axe checks, and captures screenshot", async ({
    page,
  }, testInfo) => {
    await page.goto("/about");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Demystifying US federal employment.");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    const projectName = testInfo.project.name;
    await page.screenshot({
      path: path.join(screenshotsDir, `about-${projectName}.png`),
      fullPage: true,
    });
  });

  test("Disclaimer page renders exact required text, passes axe checks, and captures screenshot", async ({
    page,
  }, testInfo) => {
    await page.goto("/disclaimer");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Disclaimer & Terms Notice");

    // Verify exact required disclaimer text is rendered on the page main content
    await expect(
      page
        .locator("main")
        .getByText(
          "Not affiliated with or endorsed by USAJOBS or any US government agency. Information may be incomplete or outdated. Always verify details and apply on the official USAJOBS posting.",
        ),
    ).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    const projectName = testInfo.project.name;
    await page.screenshot({
      path: path.join(screenshotsDir, `disclaimer-${projectName}.png`),
      fullPage: true,
    });
  });

  test("404 page renders cleanly, passes axe checks, and captures screenshot", async ({
    page,
  }, testInfo) => {
    await page.goto("/non-existent-page-test-404");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Page not found");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    const projectName = testInfo.project.name;
    await page.screenshot({
      path: path.join(screenshotsDir, `404-${projectName}.png`),
      fullPage: true,
    });
  });
});

test.describe("Health Check API Route", () => {
  test("GET /api/health returns valid JSON shape and headers", async ({ request }) => {
    const response = await request.get("/api/health");
    expect([200, 503]).toContain(response.status());

    const body = await response.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("time");
    expect(body).toHaveProperty("db");
    expect(body).toHaveProperty("lastSync");
    expect(body.lastSync).toBeNull();

    // Verify no-cache headers
    const cacheControl = response.headers()["cache-control"];
    expect(cacheControl).toContain("no-store");
  });
});
