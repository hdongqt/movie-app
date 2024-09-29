const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

const ignoreWarnings = (value) => (config) => {
  config.ignoreWarnings = value;
  return config;
};
module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
  }),
  ignoreWarnings([/Failed to parse source map/])
);
