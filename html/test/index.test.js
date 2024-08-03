const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// 读取 HTML 文件内容
const htmlContent = fs.readFileSync(
  path.resolve(__dirname, "../index.html"),
  "utf-8"
);
const { window } = new JSDOM(htmlContent);
const $ = require("jquery")(window);

QUnit.module("jQuery Example", function () {
  QUnit.test("測試class為title的元素的text", function (assert) {
    var titleText = $(".title").text();
    assert.equal(titleText, "Hello, World!", "元素的text應該為'Hello, World!'");
  });
  QUnit.skip("測試class為title的元素的text", function (assert) {
    var titleText = $(".title").text();
    assert.equal(
      titleText,
      "Hello, World!!!",
      "元素的text應該為'Hello, World!!!'"
    );
  });

  // QUnit 完成後輸出結果到控制台
  QUnit.done(function (details) {
    console.log(details);
    console.table({
      總測試數: details.total,
      成功測試數: details.passed,
      失敗測試數: details.failed,
    });
  });

  // 在控制台中顯示具體的測試失敗信息
  QUnit.testDone(function (details) {
    if (details.failed) {
      console.log(
        "測試失敗: " +
          details.module +
          ": " +
          details.name +
          " (" +
          details.failed +
          " 失敗)"
      );
      details.assertions.forEach(function (assertion) {
        if (!assertion.result) {
          console.log("   " + assertion.message);
        }
      });
    }
  });
});
