import { Box, IconButton } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PhotoCamera } from "../ResouceIcon";

export default {
  component: IconButton,
  title: "IconButton",
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args) => (
  <Box>
    <IconButton color="primary" aria-label="upload picture" {...args}>
      <PhotoCamera />
    </IconButton>
  </Box>
);

export const Primary = Template.bind({});
export const Secondary = Template.bind({});

Primary.args = {
  color: "primary",
};

Secondary.args = {
  color: "secondary",
};
