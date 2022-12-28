const path = require("path");
const svgr = require("vite-plugin-svgr");
const { mergeConfig } = require("vite");

module.exports = {
  staticDirs: ["../public"],
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-vite",
  },
  features: {
    storyStoreV7: true,
  },

  async viteFinal(config) {
    return mergeConfig(config, {
      plugins: [svgr()],
      envPrefix: "REACT_APP_",
      resolve: {
        alias: [{ find: "@", replacement: path.resolve(__dirname, "../src") }],
      },
    });
  },
};
