#!/usr/bin/env node
/* Set the hosted dashboard login.
   Usage: node tools/dashboard-login.mjs "<username>" "<password>"

   Writes a fresh random salt and a PBKDF2-SHA256 hash into
   dashboard/js/auth.js (the only thing that ships), and records the
   credentials in _project/.dashboard-login, which is git-ignored.
   Nothing here is printed to the terminal except a confirmation, and the
   password never enters a tracked file. Publish afterwards. */
import { pbkdf2Sync, randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const AUTH_FILE = path.join(ROOT, "dashboard", "js", "auth.js");
const NOTE_FILE = path.join(ROOT, "_project", ".dashboard-login");
const ITERATIONS = 310000;

const [user, pass] = process.argv.slice(2);
if (!user || !pass) {
  console.error('Usage: node tools/dashboard-login.mjs "<username>" "<password>"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = pbkdf2Sync(`${user.trim()}\n${pass}`, Buffer.from(salt, "hex"), ITERATIONS, 32, "sha256").toString("hex");
const line = `  const AUTH = { salt: "${salt}", iterations: ${ITERATIONS}, hash: "${hash}" };`;

const source = fs.readFileSync(AUTH_FILE, "utf8");
const pattern = /^  const AUTH = \{[^\n]*\};$/m;
if (!pattern.test(source)) {
  console.error("dashboard/js/auth.js has no `const AUTH = {...};` line to replace.");
  process.exit(1);
}
fs.writeFileSync(AUTH_FILE, source.replace(pattern, line));
fs.writeFileSync(NOTE_FILE, `# La Rose hosted dashboard login (client-side gate). Never commit this file.\nusername: ${user.trim()}\npassword: ${pass}\nupdated: ${new Date().toISOString()}\n`, { mode: 0o600 });
console.log(`Dashboard login updated for "${user.trim()}" (PBKDF2-SHA256, ${ITERATIONS} iterations). Credentials saved to _project/.dashboard-login. Publish to apply.`);
