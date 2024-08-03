const puppeteer = require("puppeteer");
const path = require("path");

const testFiles = [path.resolve(__dirname, "../../index.html")];

(async () => {
  const browser = await puppeteer.launch({
    args: ["--disable-web-security"], // 用於繞過 CORS 問題
  });
  let totalFailures = 0;

  for (const file of testFiles) {
    const page = await browser.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "log" || msg.type() === "error") {
        if (msg.text().includes("測試失敗")) {
          console.log(`LOG: ${msg.text()}, file: ${file.split("\\").pop()}`);
          totalFailures++;
        }
      }
    });

    await page.goto(`${file}?runTests=true`);

    // 捕捉並打印頁面中的所有錯誤
    page.on("pageerror", (err) => {
      console.log(`Page error: ${err.toString()}`);
    });

    await page.close();
  }

  await browser.close();

  if (totalFailures > 0) {
    console.error(`總共有 ${totalFailures} 個測試失敗。`);
    process.exit(1);
  } else {
    console.log("所有測試通過。");
    process.exit(0);
  }
})();
