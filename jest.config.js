module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": ["esbuild-jest", { isolatedModules: true }]
  },
  testPathIgnorePatterns: ["build/", "node_modules/"]
};
