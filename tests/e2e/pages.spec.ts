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

    // Scoped strictly to the main article to ensure primary required disclaimer block is present
    await expect(
      page
        .locator("main")
        .getByText("Not affiliated with or endorsed by USAJOBS or any US government agency."),
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

  test("Privacy Policy page renders with AdSense disclosures and passes axe checks", async ({
    page,
  }, testInfo) => {
    await page.goto("/privacy");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Privacy Policy");

    // Verify Google AdSense cookie disclosure is rendered
    await expect(page.getByText("Google AdSense")).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    const projectName = testInfo.project.name;
    await page.screenshot({
      path: path.join(screenshotsDir, `privacy-${projectName}.png`),
      fullPage: true,
    });
  });

  test("Terms of Service page renders cleanly and passes axe checks", async ({
    page,
  }, testInfo) => {
    await page.goto("/terms");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Terms of Service");

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    const projectName = testInfo.project.name;
    await page.screenshot({
      path: path.join(screenshotsDir, `terms-${projectName}.png`),
      fullPage: true,
    });
  });

  test("Contact page renders with contact info and passes axe checks", async ({
    page,
  }, testInfo) => {
    await page.goto("/contact");

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText("Contact Us");

    await expect(page.getByText("Email Support & Inquiries")).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);

    const projectName = testInfo.project.name;
    await page.screenshot({
      path: path.join(screenshotsDir, `contact-${projectName}.png`),
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

test.describe("SEO & Health Endpoints", () => {
  test("GET /robots.txt serves valid directives pointing to sitemap", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("User-Agent: *");
    expect(text).toContain("Sitemap:");
  });

  test("GET /sitemap.xml serves valid sitemap indexing all trust pages", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("/about");
    expect(text).toContain("/privacy");
    expect(text).toContain("/terms");
    expect(text).toContain("/contact");
    expect(text).toContain("/disclaimer");
  });

  test("GET /api/health returns valid JSON shape and headers", async ({ request }) => {
    const response = await request.get("/api/health");
    expect([200, 503]).toContain(response.status());

    const body = await response.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("time");
    expect(body).toHaveProperty("db");
    expect(body).toHaveProperty("lastSync");
    expect(body.lastSync === null || typeof body.lastSync === "string").toBe(true);

    const cacheControl = response.headers()["cache-control"];
    expect(cacheControl).toContain("no-store");
  });
});
