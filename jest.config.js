module.exports = {
  moduleFileExtensions: ["ts", "js"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "ts-jest",
    "\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  coverageDirectory: "coverage",
  verbose: true,
  testMatch: ["**/*.spec.(ts)"],
  testEnvironment: "node",
  transformIgnorePatterns: ["/node_modules/(?!(@dcl))"],
}
