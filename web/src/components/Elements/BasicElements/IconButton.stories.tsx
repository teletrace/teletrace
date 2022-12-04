/**
 * Copyright 2022 Epsagon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
