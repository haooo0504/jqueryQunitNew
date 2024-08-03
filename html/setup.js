const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync("index.html", "utf8");
const dom = new JSDOM(html, {
  url: "http://localhost",
  runScripts: "dangerously",
  resources: "usable",
});

global.window = dom.window;
global.document = dom.window.document;
global.$ = require("jquery")(dom.window);
