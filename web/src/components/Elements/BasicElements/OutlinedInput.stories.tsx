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

import { Box, InputAdornment, OutlinedInput } from "@mui/material";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  component: OutlinedInput,
  title: "OutlinedInput",
} as ComponentMeta<typeof OutlinedInput>;

const BasicTemplate: ComponentStory<typeof OutlinedInput> = (args) => (
  <Box
    component="form"
    sx={{
      "& .MuiOutlinedInput-root": { m: 1, width: "25ch" },
    }}
  >
    <OutlinedInput
      id="outlined-adornment-weight"
      endAdornment={<InputAdornment position="end">kg</InputAdornment>}
      aria-describedby="outlined-weight-helper-text"
      inputProps={{
        "aria-label": "weight",
      }}
      {...args}
    />
  </Box>
);

export const Basic = BasicTemplate.bind({});
