/**
 * Copyright 2022 Cisco Systems, Inc.
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

import { Box, Button, ButtonGroup } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: ButtonGroup,
  title: "ButtonGroup",
} as ComponentMeta<typeof ButtonGroup>;

const Template: ComponentStory<typeof ButtonGroup> = (args) => (
  <div>
    <Box component="span" sx={{ color: "white", fontFamily: "Inter" }}>
      Text
    </Box>
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        width: "400px",
      }}
    >
      <ButtonGroup
        {...args}
        variant="text"
        aria-label="outlined primary button group"
      >
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Box>
    <Box component="span" sx={{ color: "white", fontFamily: "Inter" }}>
      Contained
    </Box>
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        width: "400px",
      }}
    >
      <ButtonGroup
        {...args}
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Box>
    <Box component="span" sx={{ color: "white", fontFamily: "Inter" }}>
      Outlined
    </Box>
    <Box
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        width: "400px",
      }}
    >
      <ButtonGroup
        {...args}
        variant="outlined"
        aria-label="outlined primary button group"
      >
        <Button>One</Button>
        <Button>Two</Button>
        <Button>Three</Button>
      </ButtonGroup>
    </Box>
  </div>
);

export const Primary = Template.bind({});
export const Secondary = Template.bind({});

Primary.args = {
  color: "primary",
};

Secondary.args = {
  color: "secondary",
};
