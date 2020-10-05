#! /usr/bin/env node

const path = require("path"),
  packageJson = require(path.join(process.cwd(), "package.json")),
  childProcess = require("child_process");

const deps = packageJson.dynamicDependencies || {};
const [, , ...args] = process.argv;

let tag;
if (args && args[0]) {
  if (args[0] === "--from-git") {
    tag = childProcess.execSync("git branch --show-current").toString().trim();
  } else {
    tag = args[0];
  }
}

const packages = Object.keys(deps).reduce((acc, pkg) => {
  if (typeof deps[pkg] === "object") {
    if (deps[pkg][tag]) {
      acc.push(pkg + "@" + deps[pkg][tag]);
    }
  }
  return acc;
}, []);

try {
  if (packages && packages.length) {
    childProcess.execSync("npm install --no-save " + packages.join(" "), {
      stdio: [0, 1, 2],
    });
  }
} catch (e) {}
