import { Box, IconButton } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { theme } from "@/styles";

import { PhotoCamera } from "../ResourceIcon";

export default {
  component: IconButton,
  title: "IconButton",
} as ComponentMeta<typeof IconButton>;

const Template: ComponentStory<typeof IconButton> = (args) => (
  <Box>
    <IconButton aria-label="upload picture" {...args}>
      <PhotoCamera />
    </IconButton>
  </Box>
);

export const Primary = Template.bind({});
export const Secondary = Template.bind({});
export const FromProps = Template.bind({});

Primary.args = {
  color: "primary",
};

Secondary.args = {
  color: "secondary",
};

FromProps.args = {
  sx: {
    color: theme.palette.grey[200],
  },
};
