import { execSync } from "child_process";
import fs from "fs";

export default function setup() {
  for (const file of ["prisma/test.db", "prisma/test.db-journal"]) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  execSync("npx prisma db push --skip-generate --accept-data-loss", { stdio: "inherit", env: process.env });
}
