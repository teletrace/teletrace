import { Box, CircularProgress } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: CircularProgress,
  title: "CircularProgress",
} as ComponentMeta<typeof CircularProgress>;

const Template: ComponentStory<typeof CircularProgress> = (args) => (
  <Box sx={{ display: "flex" }}>
    <CircularProgress {...args} />
  </Box>
);

export const Primary = Template.bind({});
