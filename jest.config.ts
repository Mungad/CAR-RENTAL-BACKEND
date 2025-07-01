//Unit Testing configuration for Jest with TypeScript
import type {Config} from 'jest';

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
}
export default config;

// Intergretion Testing export default config;

const { createDefaultPreset } = require("ts-jest");
const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/src/__tests__/utils/",
    "/src/Drizzle/Drizzle.ts",
    "/src/Drizzle/schema.ts",
    "/src/mailer/mailer.ts",
    "/src/Drizzle/db.ts",
    "/src/middleware/bearerAuth.ts",
    "/src/router",
]
};