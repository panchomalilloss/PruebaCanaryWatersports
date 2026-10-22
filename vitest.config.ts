import { defineConfig } from "vitest/config";
import path from "path";

process.env.DATABASE_URL = "file:./test.db";
process.env.AUTH_SECRET = "test-secret-test-secret-test-secret";
process.env.PAYMENT_MODE = "test";
process.env.ADMIN_EMAIL = "admin@test.local";
process.env.ADMIN_PASSWORD = "test-admin-pass";
process.env.HOLD_MINUTES = "15";
process.env.JETSKI_CAPACITY = "4";
process.env.INVENTORY_SOURCE = "configured";

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    globalSetup: "./tests/global-setup.ts",
    hookTimeout: 60000,
    testTimeout: 30000,
  },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
