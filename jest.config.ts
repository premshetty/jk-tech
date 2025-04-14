import nextJest from "next/jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^.+\\.(css|scss|sass)$": "identity-obj-proxy",
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.tsx", // This matches all pages.tsx files under app
  ],
  coverageDirectory: "coverage", // Directory to store coverage reports
  coverageReporters: ["text", "lcov", "html"], // Report formats
  testEnvironment: "jest-environment-jsdom", // Explicitly set test environment
  testMatch: [
    "<rootDir>/__tests__/**/*.test.tsx", // Match all .test.tsx files in the __tests__ folder
    "<rootDir>/__tests__/**/*.test.ts", // Match all .test.ts files in the __tests__ folder
  ],
};

export default createJestConfig(customJestConfig);
