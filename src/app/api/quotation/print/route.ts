import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const sp = url.searchParams;
  const locale = sp.get("locale") ?? "en";

  const origin =
    process.env.SITE_URL ??
    `${req.headers.get("x-forwarded-proto") ?? "https"}://${req.headers.get("host")}`;

  const printParams = new URLSearchParams(sp);
  printParams.delete("locale");
  const printUrl = `${origin}/${locale}/print-pdf/quotation?${printParams.toString()}`;

  const isServerless =
    !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

  let browser: import("puppeteer-core").Browser | null = null;

  try {
    if (isServerless) {
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteer = await import("puppeteer-core");

      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
        defaultViewport: { width: 1240, height: 1754 },
      });
    } else {
      const puppeteer = (await import("puppeteer")).default;
      browser = (await puppeteer.launch({
        headless: true,
      })) as unknown as import("puppeteer-core").Browser;
    }

    const page = await browser.newPage();
    await page.goto(printUrl, { waitUntil: "networkidle0", timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: "10mm", bottom: "10mm", left: "0mm", right: "0mm" },
    });

    await browser.close();
    browser = null;

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="quotation.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    if (browser) await browser.close();
    console.error("PDF generation failed:", err);

    return NextResponse.json(
      { error: "Failed to generate PDF", detail: String(err) },
      { status: 500 },
    );
  }
}
