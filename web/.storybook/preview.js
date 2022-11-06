import React from "react";
import { AppProviders } from "../src/providers/app";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => (
    <AppProviders>
      <Story />
    </AppProviders>
  ),
];
